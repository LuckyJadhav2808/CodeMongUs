import { auth } from '../config/firebase.js';

/**
 * Express middleware — validates Firebase ID token from Authorization header.
 * Attaches decoded user to req.user.
 */
export async function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = header.split('Bearer ')[1];
  try {
    if (!auth) {
      // Firebase not configured — allow through with mock user for dev
      req.user = { uid: 'dev-user', email: 'dev@localhost', name: 'Developer' };
      return next();
    }
    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.email || 'Anonymous',
      picture: decoded.picture || null,
      isAnonymous: decoded.firebase?.sign_in_provider === 'anonymous',
    };
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Socket.io middleware — validates Firebase ID token during handshake.
 * Attaches decoded user to socket.user.
 */
export async function verifySocketToken(socket, next) {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split('Bearer ')[1];
  if (!token) {
    return next(new Error('Authentication required'));
  }

  try {
    if (!auth) {
      socket.user = { uid: 'dev-user', email: 'dev@localhost', name: 'Developer' };
      return next();
    }
    const decoded = await auth.verifyIdToken(token);
    socket.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.email || 'Anonymous',
      picture: decoded.picture || null,
      isAnonymous: decoded.firebase?.sign_in_provider === 'anonymous',
    };
    next();
  } catch (err) {
    console.error('Socket auth failed:', err.message);
    next(new Error('Invalid token'));
  }
}

/**
 * Express middleware — optional auth. Attaches user if token present, continues otherwise.
 */
export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  try {
    const token = header.split('Bearer ')[1];
    if (!auth) {
      req.user = { uid: 'dev-user', email: 'dev@localhost', name: 'Developer' };
      return next();
    }
    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || decoded.email || 'Anonymous',
      picture: decoded.picture || null,
    };
  } catch {
    req.user = null;
  }
  next();
}
