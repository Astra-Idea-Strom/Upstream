---
name: realtime
description: >-
  Real-time bidirectional communication: WebSockets, Server-Sent Events (SSE), Socket.io, and pub/sub channels. Use when streaming live tokens, building collaborative features, pushing real-time notifications, or managing persistent connections. Not for standard request-response REST APIs (that is backend-engineering or api-design).
---

# Realtime: WebSockets, Server-Sent Events (SSE) & Pub/Sub

## 1. Decision Matrix: WebSockets vs Server-Sent Events (SSE)

| Criterion | Server-Sent Events (SSE) | WebSockets (WS) |
| :--- | :--- | :--- |
| **Directionality** | **Unidirectional** (Server -> Client) | **Bi-directional** (Full Duplex) |
| **Protocol** | Standard HTTP/HTTPS | `ws://` or `wss://` upgraded connection |
| **Firewall & Proxy** | Works transparently through any corporate proxy | May be blocked by strict firewalls or proxies |
| **Reconnection** | Native automatic reconnection built into browser | Requires manual reconnection logic |
| **Best For** | AI streaming tokens, live dashboards, stock feeds, notifications | Real-time chat, multiplayer games, collaborative canvas |

---

## 2. Server-Sent Events (SSE) Implementation Pattern

For streaming LLM tokens or real-time metrics, prefer lightweight SSE over WebSockets:

```typescript
// Express SSE Endpoint
app.get("/api/v1/stream-metrics", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // Send periodic heartbeat to keep connection alive through NAT firewalls
  const heartbeat = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 15000);

  // Subscribe to Redis Pub/Sub channel
  const onMetric = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  redisSubscriber.on("message", onMetric);

  req.on("close", () => {
    clearInterval(heartbeat);
    redisSubscriber.off("message", onMetric);
    res.end();
  });
});
```

---

## 3. WebSocket Multi-Instance Scaling via Redis Pub/Sub

When scaling WebSockets horizontally across multiple Node.js server instances:
- Users connected to Instance A cannot receive messages broadcast from Instance B directly.
- **Solution**: Back the WebSocket server with a Redis Pub/Sub adapter (`@socket.io/redis-adapter`). All messages published on any instance are relayed through Redis to all other instances.

---

## 4. Anti-Patterns
- **Using WebSockets When SSE Suffices**: Overcomplicating unidirectional event streams with full-duplex socket protocols.
- **Missing Heartbeat / Ping-Pong**: Connections silently hanging when intermediate routers drop idle TCP connections.
- **Unauthenticated Sockets**: Allowing clients to connect to WebSocket channels without verifying JWT / session tokens on the upgrade handshake.

---

## 5. Verification Check
- Does the client automatically reconnect with backoff when the network drops?
- Are idle connections kept alive with periodic 15–30s heartbeats?
- Is WebSocket upgrade gated by strict authentication middleware?
