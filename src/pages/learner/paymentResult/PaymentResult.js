import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentResult.module.scss';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { code, message } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      code: params.get('code') || params.get('vnp_ResponseCode') || params.get('vnp_TransactionStatus'),
      message: params.get('message') || params.get('vnp_Message') || params.get('vnp_OrderInfo'),
    };
  }, [location.search]);

  const isSuccess = code === '00';
  const title = isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại';
  const description = message || (isSuccess ? 'Hệ thống đã ghi nhận thanh toán.' : 'Giao dịch bị hủy hoặc gặp lỗi.');

  const handleBackHome = () => navigate('/');
  const handleRetry = () => navigate(-1);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={`${styles.icon} ${isSuccess ? styles.iconSuccess : styles.iconError}`}>
          {isSuccess ? '✓' : '✕'}
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{description}</p>
        <p className={styles.code}>Mã phản hồi: {code || 'N/A'}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.btnPrimary} onClick={handleBackHome}>
            Về trang chủ
          </button>
          <button type="button" className={styles.btnGhost} onClick={handleRetry}>
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
