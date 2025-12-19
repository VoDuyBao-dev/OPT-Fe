import { useEffect } from 'react';
import styles from './Toast.module.scss';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type] || ''}`}>
      {message}
    </div>
  );
}

export default Toast;
