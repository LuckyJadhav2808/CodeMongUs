import { WebSocketServer } from 'ws';
import * as Y from 'yjs';
import { applyUpdate, encodeStateAsUpdate } from 'yjs';

/**
 * Message types for awareness protocol.
 * We prefix each WebSocket message with a 1-byte type tag:
 *   0 = Yjs document update
 *   1 = Awareness update (cursor position, user info)
 */
const MSG_DOC_UPDATE = 0;
const MSG_AWARENESS = 1;

/**
 * Yjs WebSocket server for real-time collaborative code editing.
 * Each game room gets its own Y.Doc.
 * Supports Awareness protocol for multi-cursor identification.
 */
export default class YjsServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
    this.docs = new Map(); // roomCode → Y.Doc
    this.wss = null;
  }

  start() {
    this.wss = new WebSocketServer({ server: this.httpServer, path: '/yjs' });

    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.url, 'http://localhost');
      const roomCode = url.searchParams.get('room');
      const username = url.searchParams.get('user') || 'Anonymous';
      const clientId = url.searchParams.get('clientId') || String(Date.now());

      if (!roomCode) {
        ws.close(4000, 'Missing room parameter');
        return;
      }

      // Get or create doc for this room
      const doc = this.getOrCreateDoc(roomCode);

      // Store metadata on the socket
      ws._yjsRoom = roomCode;
      ws._yjsUser = username;
      ws._yjsClientId = clientId;

      // Send current document state (tagged as doc update)
      const stateUpdate = encodeStateAsUpdate(doc);
      ws.send(this.tagMessage(MSG_DOC_UPDATE, stateUpdate));

      // Send existing awareness states from other clients in this room
      this.broadcastExistingAwareness(ws, roomCode);

      // Listen for messages from this client
      ws.on('message', (rawMessage) => {
        try {
          // Safely convert Node.js Buffer to Uint8Array (handles pool-sliced Buffers)
          const data = rawMessage instanceof Buffer
            ? new Uint8Array(rawMessage.buffer, rawMessage.byteOffset, rawMessage.byteLength)
            : new Uint8Array(rawMessage);

          if (data.length < 1) return;
          const msgType = data[0];
          const payload = data.slice(1);

          // Re-pack as a clean Buffer for broadcasting (avoids ws library edge cases)
          const broadcastBuf = Buffer.from(data);

          if (msgType === MSG_DOC_UPDATE) {
            // Apply Yjs document update to server's copy
            applyUpdate(doc, payload);
            // Broadcast to all other clients in same room
            this.broadcastToRoom(roomCode, ws, broadcastBuf);
          } else if (msgType === MSG_AWARENESS) {
            // Cache awareness on this socket for new joiners
            ws._yjsLastAwareness = broadcastBuf;
            // Relay awareness update to all other clients in same room
            this.broadcastToRoom(roomCode, ws, broadcastBuf);
          }
        } catch (err) {
          console.error(`[Yjs] Error for room ${roomCode}:`, err.message);
        }
      });

      ws.on('close', () => {
        // Broadcast awareness "offline" for this client
        const offlineMsg = JSON.stringify({
          clientId,
          user: null, // null signals removal
        });
        const offlinePayload = new TextEncoder().encode(offlineMsg);
        const tagged = this.tagMessage(MSG_AWARENESS, offlinePayload);
        this.broadcastToRoom(roomCode, ws, tagged);

        // Check if room is empty
        let hasClients = false;
        this.wss.clients.forEach((client) => {
          if (client._yjsRoom === roomCode && client.readyState === 1) {
            hasClients = true;
          }
        });
        if (!hasClients) {
          setTimeout(() => {
            let stillEmpty = true;
            this.wss.clients.forEach((client) => {
              if (client._yjsRoom === roomCode && client.readyState === 1) stillEmpty = false;
            });
            // Don't auto-delete — let destroyDoc handle it
          }, 30000);
        }
      });
    });

    console.log(`📝 Yjs WebSocket server mounted at /yjs`);
  }

  /**
   * Prefix a payload with a 1-byte message type tag.
   * Returns a Buffer for reliable ws sending on Node.js.
   */
  tagMessage(type, payload) {
    const tagged = Buffer.alloc(1 + payload.length);
    tagged[0] = type;
    tagged.set(payload, 1);
    return tagged;
  }

  /**
   * Broadcast a raw tagged message to all clients in a room except the sender.
   */
  broadcastToRoom(roomCode, sender, data) {
    this.wss.clients.forEach((client) => {
      if (client !== sender && client.readyState === 1 && client._yjsRoom === roomCode) {
        client.send(data);
      }
    });
  }

  /**
   * Send existing awareness states of other clients to a newly connected client.
   */
  broadcastExistingAwareness(ws, roomCode) {
    this.wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1 && client._yjsRoom === roomCode) {
        // Ask existing clients to re-announce themselves
        // We do this by sending a "request awareness" ping
        // But simpler: send cached awareness info for each client
        if (client._yjsLastAwareness) {
          ws.send(client._yjsLastAwareness);
        }
      }
    });
  }

  getOrCreateDoc(roomCode) {
    if (!this.docs.has(roomCode)) {
      const doc = new Y.Doc();
      this.docs.set(roomCode, doc);
    }
    return this.docs.get(roomCode);
  }

  getCode(roomCode) {
    const doc = this.docs.get(roomCode);
    if (!doc) return '';
    const ytext = doc.getText('code');
    return ytext.toString();
  }

  destroyDoc(roomCode) {
    const doc = this.docs.get(roomCode);
    if (doc) {
      doc.destroy();
      this.docs.delete(roomCode);
    }
    if (this.wss) {
      this.wss.clients.forEach((client) => {
        if (client._yjsRoom === roomCode) {
          client.close(4001, 'Game ended');
        }
      });
    }
  }

  stop() {
    if (this.wss) this.wss.close();
    this.docs.forEach((doc) => doc.destroy());
    this.docs.clear();
  }
}
