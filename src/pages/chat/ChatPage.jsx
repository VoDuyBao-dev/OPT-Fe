import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ChatSidebar from "~/components/chat/ChatSidebar";
import ChatBox from "~/components/chat/ChatBox";

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
     1. USER ĐANG ĐĂNG NHẬP
  =============================== */
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    getMe()
      .then((me) => {
        // console.log("[chat/me] =", me);
        setMyUserId(me.userId);
      })
      .catch(() => navigate("/Login"));
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
     4. ACTIVE USER
  =============================== */
  const activeUser = useMemo(() => {
    if (!activeUserId) return null;
    return conversations.find((u) => u.userId === activeUserId) || null;
  }, [activeUserId, conversations]);

  /* ===============================
     5. WEBSOCKET (CONNECT 1 LẦN)
  =============================== */
  useEffect(() => {
    if (!myUserId) return;

    // ❗ KHÔNG truyền callback
    connectChatSocket();

    return () => disconnectChatSocket();
  }, [myUserId]);

  /* ===============================
     6. UNREAD REALTIME (GLOBAL)
  =============================== */
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.unreadCount == null) return;
      setTotalUnread(Number(e.detail.unreadCount));
    };

    window.addEventListener("chat:unread", handler);
    return () => window.removeEventListener("chat:unread", handler);
  }, []);

  /* ===============================
     7. CLICK SIDEBAR
  =============================== */
  const onSelect = (u) => {
    navigate(`/chat?userId=${u.userId}`);
  };

  /* ===============================
     8. RENDER
  =============================== */
  return (
    <div className={styles.wrap}>
      <ChatSidebar
        myUserId={myUserId}          //  BẮT BUỘC
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
