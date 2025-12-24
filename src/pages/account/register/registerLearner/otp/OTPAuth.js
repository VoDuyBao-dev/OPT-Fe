import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import styles from './OTPAuth.module.scss';
import { resendOtp, verifyOtp } from '~/api/services/authService';

const OTPAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialEmail = params.get('email') || '';
  const initialType = params.get('type') || 'ACCOUNT_ACTIVATION';

  const [email, setEmail] = useState(initialEmail);
  const [otpCode, setOtpCode] = useState('');
  const [otpType, setOtpType] = useState(initialType);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail(initialEmail);
    setOtpType(initialType || 'ACCOUNT_ACTIVATION');
  }, [initialEmail, initialType]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!otpCode.trim()) {
      setError('Vui lòng nhập mã OTP');
      return;
    }

    setError('');
    setMessage('');
    try {
      setLoading(true);
      await verifyOtp({ email: email.trim(), otpCode: otpCode.trim(), otpType });
      setMessage('Xác thực OTP thành công. Bạn có thể đăng nhập.');
      setTimeout(() => navigate('/Login'), 1200);
    } catch (err) {
      const apiMsg = err?.response?.data?.message || 'Xác thực OTP thất bại';
      setError(apiMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email để gửi lại OTP');
      return;
    }
    setError('');
    setMessage('');
    try {
      setResending(true);
      const res = await resendOtp(email.trim());
      const apiMsg = res?.message || 'Gửi lại OTP thành công';
      setMessage(apiMsg);
    } catch (err) {
      const apiMsg = err?.response?.data?.message || 'Gửi lại OTP thất bại';
      setError(apiMsg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Xác thực OTP</h1>
        <p className={styles.subtitle}>Nhập email và mã OTP được gửi tới hộp thư của bạn.</p>

        <form className={styles.form} onSubmit={handleVerify}>
          <label className={styles.label}>
            Email
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhapemail@example.com"
              required
            />
          </label>

          <label className={styles.label}>
            Mã OTP
            <input
              type="text"
              className={styles.input}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Nhập mã OTP"
              required
            />
          </label>

          <div className={styles.actions}>
            <button type="submit" className={clsx(styles.btn, styles.btnPrimary)} disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>
            <button
              type="button"
              className={clsx(styles.btn, styles.btnGhost)}
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
          </div>
        </form>

        {message && <div className={clsx(styles.alert, styles.success)}>{message}</div>}
        {error && <div className={clsx(styles.alert, styles.error)}>{error}</div>}
      </div>
    </div>
  );
};

export default OTPAuth;
