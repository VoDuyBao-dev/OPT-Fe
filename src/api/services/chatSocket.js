import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Nếu backend có context-path: /tutorsFinder
 * → http://localhost:8080/tutorsFinder
 */
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/tutorsFinder";

/**
 * SockJS endpoint (PHẢI khớp backend .withSockJS())
 * registry.addEndpoint("/ws/chat-sockjs").withSockJS();
 */
const WS_SOCKJS_URL = `${API_BASE}/ws/chat-sockjs`;

let stompClient = null;
let isConnected = false;

// Chuẩn hoá token: nhận string hoặc object {token: "..."}; bỏ "Bearer " nếu có
const normalizeToken = (raw) => {
  if (!raw) return null;

  // trường hợp ai đó truyền nhầm object
  if (typeof raw === "object" && raw.token) raw = raw.token;

  if (typeof raw !== "string") return null;

  let t = raw.trim();
  if (!t) return null;

  // nếu đã có Bearer thì bỏ đi để connectHeaders tự thêm
  if (/^Bearer\s+/i.test(t)) t = t.replace(/^Bearer\s+/i, "").trim();

  return t || null;
};

// CONNECT
export const connectChatSocket = (token) => {
  // ✅ fallback: nếu caller truyền thiếu token thì tự lấy từ localStorage
  const stored = localStorage.getItem("token");
  const finalToken = normalizeToken(token) || normalizeToken(stored);

  if (!finalToken) {
    console.error("[ChatSocket] JWT token not found (param & localStorage empty)");
    return;
  }

  // tránh connect trùng
  if (stompClient && isConnected) return;

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WS_SOCKJS_URL),

    connectHeaders: {
      Authorization: `Bearer ${finalToken}`,
    },

    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (str) => console.log("[STOMP]", str),

    onConnect: () => {
      console.log("[ChatSocket] CONNECTED");
      isConnected = true;

      stompClient.subscribe("/user/queue/messages", (msg) => {
        try {
          const body = JSON.parse(msg.body);
          window.dispatchEvent(
            new CustomEvent("chat:new-message", { detail: body })
          );
        } catch (err) {
          console.error("[ChatSocket] Invalid message body", err);
        }
      });
    },

    onWebSocketError: (e) => {
      console.error("[ChatSocket] WebSocket error", e);
    },

    onStompError: (frame) => {
      console.error("[ChatSocket] STOMP error:", frame.headers["message"]);
    },

    onDisconnect: () => {
      console.log("[ChatSocket] DISCONNECTED");
      isConnected = false;
    },
  });

  stompClient.activate();
};

// SEND MESSAGE
export const sendChatMessage = ({ receiverId, content, stickerId }) => {
  if (!stompClient || !isConnected) {
    console.warn("[ChatSocket] Not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      receiverId,
      content: content || null,
      stickerId: stickerId || null,
    }),
  });
};

// DISCONNECT
export const disconnectChatSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
  }
};
