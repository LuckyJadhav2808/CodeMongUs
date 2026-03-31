import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';

// Derive Yjs WebSocket URL from the server URL (http→ws, append /yjs)
function getYjsWsUrl() {
  const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return serverUrl.replace(/^http/, 'ws').replace(/\/$/, '') + '/yjs';
}
const YJS_WS_URL = getYjsWsUrl();

/**
 * Message type tags — must match yjsServer.js
 */
const MSG_DOC_UPDATE = 0;
const MSG_AWARENESS = 1;

/**
 * Predefined cursor colors for players.
 * Each player gets a unique color based on their clientId hash.
 */
const CURSOR_COLORS = [
  { color: '#ff6b6b', light: 'rgba(255,107,107,0.3)', name: 'Red' },
  { color: '#4ecdc4', light: 'rgba(78,205,196,0.3)', name: 'Teal' },
  { color: '#45b7d1', light: 'rgba(69,183,209,0.3)', name: 'Blue' },
  { color: '#f9ca24', light: 'rgba(249,202,36,0.3)', name: 'Yellow' },
  { color: '#a55eea', light: 'rgba(165,94,234,0.3)', name: 'Purple' },
  { color: '#26de81', light: 'rgba(38,222,129,0.3)', name: 'Green' },
  { color: '#fd9644', light: 'rgba(253,150,68,0.3)', name: 'Orange' },
  { color: '#fc5c65', light: 'rgba(252,92,101,0.3)', name: 'Pink' },
];

function getColorForClient(clientId) {
  let hash = 0;
  for (let i = 0; i < clientId.length; i++) {
    hash = ((hash << 5) - hash) + clientId.charCodeAt(i);
    hash |= 0;
  }
  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
}

/**
 * Custom hook that manages a Yjs document synced via WebSocket
 * with Awareness support for multi-cursor identification.
 *
 * @param {string} roomCode - The game room code to sync with
 * @param {string} username - The current player's display name
 * @returns {{ yDoc, yText, isConnected, awareness, getText }}
 */
export function useYjs(roomCode, username = 'Player') {
  const docRef = useRef(null);
  const wsRef = useRef(null);
  const awarenessRef = useRef({
    localState: null,
    states: new Map(),
    listeners: new Set(),
  });
  const [isConnected, setIsConnected] = useState(false);
  const [awarenessVersion, setAwarenessVersion] = useState(0);
  const clientIdRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

  // Broadcast local awareness state
  const broadcastAwareness = useCallback(() => {
    const ws = wsRef.current;
    const awareness = awarenessRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !awareness.localState) return;

    const msg = JSON.stringify({
      clientId: clientIdRef.current,
      user: awareness.localState,
    });
    const payload = new TextEncoder().encode(msg);
    const tagged = new Uint8Array(1 + payload.length);
    tagged[0] = MSG_AWARENESS;
    tagged.set(payload, 1);
    ws.send(tagged);
  }, []);

  useEffect(() => {
    if (!roomCode) return;

    const clientId = clientIdRef.current;
    const cursorColor = getColorForClient(clientId);

    // Create Yjs document
    const doc = new Y.Doc();
    docRef.current = doc;

    // Set initial local awareness state
    awarenessRef.current.localState = {
      name: username,
      color: cursorColor.color,
      colorLight: cursorColor.light,
      clientId,
    };

    // Connect to Yjs WebSocket server with user info
    const ws = new WebSocket(
      `${YJS_WS_URL}?room=${encodeURIComponent(roomCode)}&user=${encodeURIComponent(username)}&clientId=${encodeURIComponent(clientId)}`
    );
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log(`📝 Yjs connected to room ${roomCode} as ${username}`);
      // Announce ourselves via awareness
      broadcastAwareness();
      // Re-announce again after 1s to catch any missed broadcasts during initial sync
      setTimeout(() => broadcastAwareness(), 1000);
    };

    ws.onmessage = (event) => {
      try {
        const data = new Uint8Array(event.data);
        const msgType = data[0];
        const payload = data.slice(1);

        if (msgType === MSG_DOC_UPDATE) {
          // Mark as 'remote' so our update handler doesn't echo it back
          Y.applyUpdate(doc, payload, 'remote');
        } else if (msgType === MSG_AWARENESS) {
          const text = new TextDecoder().decode(payload);
          const { clientId: remoteId, user } = JSON.parse(text);

          if (remoteId === clientId) return; // skip own awareness

          const awareness = awarenessRef.current;
          if (user === null) {
            // Remote client disconnected
            awareness.states.delete(remoteId);
          } else {
            awareness.states.set(remoteId, user);
          }
          // Notify all listeners AND bump version for React re-renders
          awareness.listeners.forEach((fn) => fn());
          setAwarenessVersion(v => v + 1);
        }
      } catch (err) {
        console.error('Yjs message error:', err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log(`📝 Yjs disconnected from room ${roomCode}`);
    };

    ws.onerror = (err) => {
      console.error('Yjs WebSocket error:', err);
    };

    // Listen for local doc changes and send tagged updates
    const updateHandler = (update, origin) => {
      if (origin === 'remote') return; // Don't echo remote updates back
      if (ws.readyState === WebSocket.OPEN) {
        const tagged = new Uint8Array(1 + update.length);
        tagged[0] = MSG_DOC_UPDATE;
        tagged.set(update, 1);
        ws.send(tagged);
      }
    };
    doc.on('update', updateHandler);

    // Periodically re-broadcast awareness (heartbeat every 2s for faster cursor updates)
    const heartbeat = setInterval(() => {
      broadcastAwareness();
    }, 2000);

    // Cleanup
    return () => {
      clearInterval(heartbeat);
      doc.off('update', updateHandler);
      awarenessRef.current.states.clear();
      awarenessRef.current.listeners.clear();
      ws.close();
      doc.destroy();
      docRef.current = null;
      wsRef.current = null;
      setIsConnected(false);
    };
  }, [roomCode, username, broadcastAwareness]);

  const yDoc = docRef.current;
  const yText = yDoc?.getText('code') || null;

  const getText = useCallback(() => {
    return yText?.toString() || '';
  }, [yText]);

  return {
    yDoc,
    yText,
    isConnected,
    awareness: awarenessRef.current,
    awarenessVersion,
    clientId: clientIdRef.current,
    broadcastAwareness,
    getText,
  };
}
