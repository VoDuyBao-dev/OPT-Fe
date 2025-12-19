import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ChatSidebar from "~/components/chat/chat/ChatSidebar";
import ChatBox from "~/components/chat/chat/ChatBox";

import {
  connectChatSocket,
  disconnectChatSocket,
} from "~/api/services/chatSocket";

import { getMe } from "~/api/services/chatService";

import styles from "./ChatPage.module.scss";

export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const receiverIdFromProfile = searchParams.get("userId");
  /* ===============================
     1. USER ĐANG ĐĂNG NHẬP (CHAT)
  =============================== */
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    getMe()
      .then((me) => {
        console.log("[chat/me] =", me);
        setMyUserId(me.userId);
      })
      .catch((err) => {
        console.error("[chat/me] error", err);
        navigate("/Login");
      });
  }, [navigate]);

  /* ===============================
     2. ACTIVE USER ID TỪ URL
  =============================== */
  const activeUserId = useMemo(() => {
    const q = searchParams.get("userId");
    const id = Number(q);
    return Number.isFinite(id) ? id : null;
  }, [searchParams]);

  /* ===============================
     3. CONVERSATIONS
  =============================== */
  const [conversations, setConversations] = useState([]);

  const handleSidebarLoad = (items) => {
    setConversations(items);
  };

  /* ===============================
     4. ACTIVE USER = SUY RA
  =============================== */
  const activeUser = useMemo(() => {
    if (!activeUserId) return null;
    return conversations.find((u) => u.userId === activeUserId) || null;
  }, [activeUserId, conversations]);

  /* ===============================
     5. WEBSOCKET
  =============================== */
  useEffect(() => {
    if (!myUserId) return;

    connectChatSocket(null, (msg) => {
      window.dispatchEvent(
        new CustomEvent("chat:new-message", { detail: msg })
      );
    });

    return () => disconnectChatSocket();
  }, [myUserId]);

  /* ===============================
     6. CLICK SIDEBAR
  =============================== */
  const onSelect = (u) => {
    navigate(`/chat?userId=${u.userId}`);
  };

  /* ===============================
     7. RENDER
  =============================== */
  return (
    <div className={styles.wrap}>
      <ChatSidebar
        activeUserId={activeUserId}
        onSelect={onSelect}
        onLoaded={handleSidebarLoad}
      />

      <ChatBox
        activeUser={activeUser}
        myUserId={myUserId}
        receiverIdFromProfile={receiverIdFromProfile}
      />

    </div>
  );
}
