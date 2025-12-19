import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatBox.module.scss";
import { sendChatMessage } from "~/api/services/chatSocket";
import { getChatHistory, getStickers } from "~/api/services/chatService";
import StickerPicker from "./StickerPicker";

const PAGE_SIZE = 20;

/**
 * Props mới:
 * - receiverIdFromProfile: số id người nhận khi đi từ trang profile qua chat
 *   (trường hợp chưa có lịch sử conversation => activeUser null)
 */
export default function ChatBox({ activeUser, myUserId, receiverIdFromProfile }) {
    // receiverId lấy ưu tiên từ activeUser, fallback từ receiverIdFromProfile
    const receiverId = useMemo(() => {
        const fromActive = activeUser?.userId ? Number(activeUser.userId) : null;
        const fromParam =
            receiverIdFromProfile !== undefined && receiverIdFromProfile !== null
                ? Number(receiverIdFromProfile)
                : null;
        return fromActive ?? fromParam;
    }, [activeUser, receiverIdFromProfile]);

    const meId = myUserId ? Number(myUserId) : null;

    const [messages, setMessages] = useState([]);

    // lazy load
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // input
    const [text, setText] = useState("");
    const [stickers, setStickers] = useState([]);
    const [showSticker, setShowSticker] = useState(false);
    const [selectedSticker, setSelectedSticker] = useState(null);

    // scroll
    const listRef = useRef(null);
    const shouldAutoScrollRef = useRef(true);
    const knownMessageIdsRef = useRef(new Set());

    // ✅ Cho phép gửi nếu có receiverId (dù activeUser null)
    const canChat = !!receiverId && !!meId;
    const canSend = canChat && (!!text.trim() || !!selectedSticker);

    const title = useMemo(() => {
        // ✅ Nếu chưa có activeUser nhưng có receiverId (new chat) thì vẫn hiện tiêu đề
        if (activeUser) return activeUser.fullName || `User #${activeUser.userId}`;
        if (receiverId) return `Đang nhắn với User #${receiverId}`;
        return "Chọn một cuộc trò chuyện";
    }, [activeUser, receiverId]);

    /* ===============================
       0) LOAD STICKERS (1 lần)
    =============================== */
    useEffect(() => {
        getStickers()
            .then((data) => setStickers(data || []))
            .catch(() => setStickers([]));
    }, []);

    /* ===============================
       1) RESET KHI ĐỔI receiverId
    =============================== */
    useEffect(() => {
        setMessages([]);
        setText("");
        setSelectedSticker(null);
        setShowSticker(false);

        setPage(0);
        setHasMore(true);
        setLoadingHistory(false);

        knownMessageIdsRef.current = new Set();
        shouldAutoScrollRef.current = true;
    }, [receiverId]);

    const scrollToBottom = useCallback(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, []);

    const mapToUI = useCallback(
        (m) => {
            const sender = Number(m.senderId);
            const receiver = Number(m.receiverId);

            const sentAtObj = m.sentAt ? new Date(m.sentAt) : null;

            return {
                id: m.id ?? m.messageId,
                senderId: sender,
                receiverId: receiver,
                content: m.content ?? null,
                stickerUrl: m.stickerUrl ?? null,
                sentAt: m.sentAt ?? null,
                isMine: sender === meId,
                time: sentAtObj ? sentAtObj.toLocaleTimeString() : "",
            };
        },
        [meId]
    );

    /* ===============================
       2) LOAD LỊCH SỬ (PAGE 0) khi có receiverId
    =============================== */
    useEffect(() => {
        if (!receiverId || !meId) return;

        const loadFirst = async () => {
            setLoadingHistory(true);
            try {
                const raw = await getChatHistory(receiverId, 0, PAGE_SIZE);
                const content = raw?.content ?? [];
                const isLast = !!raw?.last;

                const mapped = content
                    .slice()
                    .reverse()
                    .map(mapToUI)
                    .filter((msg) => {
                        if (!msg.id) return true;
                        if (knownMessageIdsRef.current.has(msg.id)) return false;
                        knownMessageIdsRef.current.add(msg.id);
                        return true;
                    });

                setMessages(mapped);
                setHasMore(!isLast);
                setPage(0);

                setTimeout(() => {
                    if (shouldAutoScrollRef.current) scrollToBottom();
                }, 0);
            } finally {
                setLoadingHistory(false);
            }
        };

        loadFirst();
    }, [receiverId, meId, mapToUI, scrollToBottom]);

    /* ===============================
       3) LAZY LOAD (SCROLL TOP)
    =============================== */
    const loadMore = useCallback(async () => {
        if (!receiverId || !meId) return;
        if (loadingHistory || !hasMore) return;

        const nextPage = page + 1;
        const prevHeight = listRef.current?.scrollHeight ?? 0;

        setLoadingHistory(true);
        try {
            const raw = await getChatHistory(receiverId, nextPage, PAGE_SIZE);
            const content = raw?.content ?? [];
            const isLast = !!raw?.last;

            const mapped = content
                .slice()
                .reverse()
                .map(mapToUI)
                .filter((msg) => {
                    if (!msg.id) return true;
                    if (knownMessageIdsRef.current.has(msg.id)) return false;
                    knownMessageIdsRef.current.add(msg.id);
                    return true;
                });

            setMessages((prev) => [...mapped, ...prev]);
            setHasMore(!isLast);
            setPage(nextPage);

            setTimeout(() => {
                if (!listRef.current) return;
                const newHeight = listRef.current.scrollHeight;
                listRef.current.scrollTop = newHeight - prevHeight;
            }, 0);
        } finally {
            setLoadingHistory(false);
        }
    }, [receiverId, meId, loadingHistory, hasMore, page, mapToUI]);

    const onScroll = useCallback(
        (e) => {
            const el = e.currentTarget;

            const distanceToBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
            shouldAutoScrollRef.current = distanceToBottom < 80;

            if (el.scrollTop <= 40 && hasMore && !loadingHistory) {
                loadMore();
            }
        },
        [hasMore, loadingHistory, loadMore]
    );

    /* ===============================
       4) RECEIVE REALTIME (WS)
    =============================== */
    useEffect(() => {
        if (!receiverId || !meId) return;

        const handler = (e) => {
            const payload = e.detail;
            if (!payload) return;

            const uiMsg = mapToUI(payload);
            const sender = uiMsg.senderId;
            const receiver = uiMsg.receiverId;

            const related =
                (sender === meId && receiver === receiverId) ||
                (sender === receiverId && receiver === meId);

            if (!related) return;

            if (uiMsg.id && knownMessageIdsRef.current.has(uiMsg.id)) return;
            if (uiMsg.id) knownMessageIdsRef.current.add(uiMsg.id);

            setMessages((prev) => [...prev, uiMsg]);

            setTimeout(() => {
                if (shouldAutoScrollRef.current) scrollToBottom();
            }, 0);
        };

        window.addEventListener("chat:new-message", handler);
        return () => window.removeEventListener("chat:new-message", handler);
    }, [receiverId, meId, mapToUI, scrollToBottom]);

    /* ===============================
       5) SEND (WS)
    =============================== */
    const handleSend = useCallback(() => {
        if (!receiverId || !meId) return;

        const cleanText = text.trim();
        const stickerId = selectedSticker?.id ?? null;

        if (!cleanText && !stickerId) return;

        sendChatMessage({
            receiverId,
            content: cleanText || null,
            stickerId,
        });

        setText("");
        setSelectedSticker(null);
        shouldAutoScrollRef.current = true;
    }, [receiverId, meId, text, selectedSticker]);

    /* ===============================
       6) UI
    =============================== */
    return (
        <main className={styles.main}>
            <div className={styles.mainHeader}>
                <div className={styles.headerTitle}>
                    <div className={styles.headerName}>{title}</div>
                </div>
            </div>

            <div className={styles.messages} ref={listRef} onScroll={onScroll}>
                {!receiverId && (
                    <div className={styles.empty}>Chọn người để bắt đầu chat.</div>
                )}

                {receiverId && messages.length === 0 && !loadingHistory && (
                    <div className={styles.empty}>Chưa có tin nhắn nào.</div>
                )}

                {receiverId &&
                    messages.map((msg) => (
                        <div
                            key={msg.id ?? `${msg.senderId}-${msg.sentAt}-${Math.random()}`}
                            className={`${styles.msgRow} ${msg.isMine ? styles.msgMe : styles.msgOther}`}
                        >
                            <div className={`${styles.bubble} ${msg.isMine ? styles.bubbleMe : styles.bubbleOther}`}>
                                <div className={styles.content}>
                                    {msg.content && <span>{msg.content}</span>}
                                    {msg.stickerUrl && (
                                        <img src={msg.stickerUrl} alt="sticker" className={styles.sticker} />
                                    )}
                                </div>
                                <div className={styles.meta}>{msg.time}</div>
                            </div>
                        </div>
                    ))}

                {receiverId && loadingHistory && <div className={styles.loading}>Đang tải...</div>}
            </div>

            <div className={styles.inputBar}>
                {selectedSticker && (
                    <div className={styles.selectedSticker}>
                        <img src={selectedSticker.imageUrl} alt="selected" />
                        <button
                            type="button"
                            className={styles.clearSticker}
                            onClick={() => setSelectedSticker(null)}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <input
                    className={styles.textbox}
                    placeholder={canChat ? "Nhập tin nhắn..." : "Chọn người để chat"}
                    value={text}
                    disabled={!canChat}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <button
                    type="button"
                    className={styles.stickerBtn}
                    disabled={!canChat}
                    onClick={() => setShowSticker((v) => !v)}
                >
                    😊
                </button>

                <button
                    type="button"
                    className={styles.sendBtn}
                    disabled={!canSend}
                    onClick={handleSend}
                >
                    Gửi
                </button>

                {showSticker && canChat && (
                    <StickerPicker
                        stickers={stickers}
                        onSelect={(s) => {
                            setSelectedSticker(s);
                            setShowSticker(false);
                        }}
                    />
                )}
            </div>
        </main>
    );
}
