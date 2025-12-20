import styles from "./StickerPicker.module.scss";

export default function StickerPicker({ stickers, onSelect }) {
    if (!stickers || stickers.length === 0) {
        return <div className={styles.empty}>Không có sticker</div>;
    }

    return (
        <div className={styles.picker}>
            {stickers.map((s) => (
                <img
                    key={s.id}
                    src={s.imageUrl}
                    alt="sticker"
                    className={styles.sticker}
                    onClick={() => onSelect(s)}
                />
            ))}
        </div>
    );
}
