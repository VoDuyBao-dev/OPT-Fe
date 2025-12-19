import { useEffect, useState } from "react";
import styles from "./ChatSidebar.module.scss";
import { getConversations } from "~/api/services/chatService";

export default function ChatSidebar({ activeUserId, onSelect, onLoaded }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getConversations();

            console.log("[ChatSidebar] raw conversations =", res);

            const list = Array.isArray(res) ? res : [];

            setItems(list);

            // 👇 báo ngược lại cho ChatPage
            if (typeof onLoaded === "function") {
                console.log("[ChatSidebar] call onLoaded()");
                onLoaded(list);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.title}>Tin nhắn</div>
                <button
                    className={styles.refreshBtn}
                    onClick={load}
                    title="Refresh"
                >
                    ↻
                </button>
            </div>

            <div className={styles.list}>
                {loading && (
                    <div className={styles.loading}>Đang tải hội thoại...</div>
                )}

                {!loading && items.length === 0 && (
                    <div className={styles.empty}>
                        Bạn chưa có cuộc trò chuyện nào.
                    </div>
                )}

                {!loading &&
                    items.map((u) => {
                        const active = u.userId === activeUserId;

                        return (
                            <div
                                key={u.userId}
                                className={`${styles.item} ${active ? styles.active : ""
                                    }`}
                                onClick={() => {
                                    console.log("[ChatSidebar] click user =", u);
                                    onSelect(u);
                                }}
                            >
                                <div className={styles.avatar}>
                                    {u.avatarUrl ? (
                                        <img src={u.avatarUrl} alt="avatar" />
                                    ) : null}
                                </div>

                                <div className={styles.meta}>
                                    <div className={styles.nameRow}>
                                        <div className={styles.name}>
                                            {u.fullName || `User #${u.userId}`}
                                        </div>
                                        {u.unreadCount > 0 && (
                                            <div className={styles.badge}>
                                                {u.unreadCount}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.lastMsg}>
                                        {"..."}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </aside>
    );
}
