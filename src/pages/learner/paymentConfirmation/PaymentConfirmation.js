import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { previewOfficialClass } from '~/api/services/leanerService';
import styles from './PaymentConfirmation.module.scss';

const dayMap = {
  MONDAY: 'Thứ 2',
  TUESDAY: 'Thứ 3',
  WEDNESDAY: 'Thứ 4',
  THURSDAY: 'Thứ 5',
  FRIDAY: 'Thứ 6',
  SATURDAY: 'Thứ 7',
  SUNDAY: 'Chủ nhật',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatTime = (time) => (time ? time.slice(0, 5) : '--:--');

const PaymentConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const requestPayload = location.state?.requestPayload;
  const prefilledPreview = location.state?.previewData;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(prefilledPreview || null);

  useEffect(() => {
    if (prefilledPreview || !requestPayload) {
      if (!requestPayload && !prefilledPreview) {
        setError('Không có dữ liệu yêu cầu. Vui lòng quay lại và điền form.');
      }
      return;
    }

    const fetchPreview = async () => {
      try {
        setLoading(true);
        const res = await previewOfficialClass(requestPayload);
        const data = res?.data?.result;
        setPreview(data);
      } catch (err) {
        const message = err?.response?.data?.message || 'Không tải được dữ liệu xác nhận.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [requestPayload, prefilledPreview]);

  const summaryItems = useMemo(() => {
    if (!preview) return [];
    return [
      { label: 'Gia sư', value: preview.tutorName },
      { label: 'Môn học', value: preview.subjectName },
      { label: 'Tổng buổi', value: preview.totalSessions },
      { label: 'Tổng học phí', value: formatCurrency(preview.totalAmount) },
      { label: 'Bắt đầu', value: preview.startDate },
      { label: 'Kết thúc', value: preview.endDate },
    ];
  }, [preview]);

  const handleConfirm = () => {
    if (!preview) return;
    navigate('/learner/payment/checkout', {
      state: {
        previewData: preview,
        requestPayload,
      },
    });
  };

  const handleBack = () => navigate(-1);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.breadcrumb}>Học viên / Thanh toán</p>
          <h1 className={styles.title}>Xác nhận thanh toán</h1>
          <p className={styles.subtitle}>Kiểm tra thông tin lớp học trước khi chuyển sang bước thanh toán.</p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.btnGhost} onClick={handleBack}>
            Quay lại
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleConfirm}
            disabled={!preview || loading}
          >
            Xác nhận & Thanh toán
          </button>
        </div>
      </header>

      {loading && <div className={styles.notice}>Đang tải thông tin lớp học…</div>}
      {error && !loading && <div className={styles.error}>{error}</div>}

      {preview && !loading && (
        <div className={styles.layout}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Tổng quan</h3>
            <div className={styles.summaryGrid}>
              {summaryItems.map((item) => (
                <div key={item.label} className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>{item.label}</span>
                  <span className={styles.summaryValue}>{item.value || '—'}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Lịch học dự kiến</h3>
            <div className={styles.scheduleList}>
              {preview.schedules?.length ? (
                preview.schedules.map((slot, idx) => (
                  <div key={`${slot.dayOfWeek}-${idx}`} className={styles.scheduleItem}>
                    <div>
                      <p className={styles.scheduleDay}>{dayMap[slot.dayOfWeek] || slot.dayOfWeek}</p>
                      <p className={styles.scheduleTime}>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </p>
                    </div>
                    <span className={styles.scheduleBadge}>Buổi {idx + 1}</span>
                  </div>
                ))
              ) : (
                <p className={styles.muted}>Chưa có lịch học.</p>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Ghi chú thêm</h3>
            <div className={styles.noteBox}>
              {preview.additionalNotes || 'Không có ghi chú.'}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;