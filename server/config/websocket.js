import WebSocket, { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();
const clients = new Map(); // Map<userId (string), Set<WebSocket>>

// Ensure JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables.");
}

function initWebSocketAuthenticated(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const token = parsedUrl.searchParams.get("token");

      if (!token) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        return socket.destroy();
      }

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err || !decoded?.id) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          return socket.destroy();
        }

        const userId = String(decoded.id);

        wss.handleUpgrade(req, socket, head, (ws) => {
          ws.userId = userId;
          ws.isAlive = true;

          if (!clients.has(userId)) {
            clients.set(userId, new Set());
          }

          clients.get(userId).add(ws);
          console.log(`[dev-server] WebSocket connected for user: ${userId}`);

          wss.emit('connection', ws, req);

          // Send initial notifications
          prisma.notification.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: { date: 'desc' },
          })
            .then((notifications) => {
              safeSend(ws, {
                type: 'notification',
                payload: notifications || [],
              });
            })
            .catch((error) => {
              console.error(`[dev-server] Error fetching notifications for user ${userId}:`, error);
            });
        });
      });
    } catch (err) {
      console.error('[dev-server] WebSocket upgrade error:', err);
      socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
      socket.destroy();
    }
  });

  // Heartbeat: Ping clients to detect dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        console.log(`[dev-server] Terminating stale connection: ${ws.userId}`);
        removeClient(ws.userId, ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('connection', (ws) => {
    ws.on('pong', () => {
      ws.isAlive = true;
      console.log(`[dev-server] Received pong from user: ${ws.userId}`);
    });

    ws.on('close', () => {
      console.log(`[dev-server] WebSocket closed for user: ${ws.userId}`);
      removeClient(ws.userId, ws);
    });

    ws.on('error', (err) => {
      console.error(`[dev-server] WebSocket error for user ${ws.userId}:`, err);
    });
  });

  wss.on('close', () => {
    clearInterval(interval);
  });
}

// Remove a specific socket from a user's set of sockets
function removeClient(userId, ws) {
  const key = String(userId);
  const userSockets = clients.get(key);
  if (userSockets) {
    userSockets.delete(ws);
    if (userSockets.size === 0) {
      clients.delete(key);
    }
  }
}

function broadcastNotification(userId, notification) {
  const key = String(userId);
  const sockets = clients.get(key);

  if (sockets && sockets.size > 0) {
    // if (notification.length > 0) {
    //   notification[0].toShow = true;
    // }

    console.log(`[dev-server] Sending notification to user: ${key} (connections: ${sockets.size})`);
    for (const ws of sockets) {
      safeSend(ws, {
        type: 'notification',
        payload: notification,
      });
    }
  } else {
    console.warn(`[dev-server] WebSocket not open for user: ${key}`);
    printClients();
  }
}

// Safe send wrapper
function safeSend(ws, message) {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  } catch (error) {
    console.error('[dev-server] Error sending message over WebSocket:', error);
  }
}

// Debug utility
function printClients() {
  console.log("[dev-server] Current WebSocket clients:");
  for (const [id, sockets] of clients.entries()) {
    for (const ws of sockets) {
      console.log(`- User: ${id}, ReadyState: ${ws.readyState}`);
    }
  }
}

export { initWebSocketAuthenticated, broadcastNotification };
