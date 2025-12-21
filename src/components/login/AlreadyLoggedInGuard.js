import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserType } from '~/utils/auth';
import { logout as logoutApi } from '~/api/services/logoutAPI';

const roleHome = {
  learner: '/',
  tutor: '/tutor/home',
  admin: '/admin/dashboard',
};

function AlreadyLoggedInGuard({ children }) {
  const navigate = useNavigate();
  const role = getUserType();

  const isLoggedIn = useMemo(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return !!role || !!token;
  }, [role]);

  const handleCancel = () => {
    navigate(roleHome[role] || '/');
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      ['token', 'role', 'userType', 'user'].forEach((key) => localStorage.removeItem(key));
      window.location.href = '/login';
    }
  };

  if (!isLoggedIn) return children;

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Bạn đã đăng nhập</h2>
        <p style={styles.desc}>Bạn có muốn đăng xuất để truy cập trang này không?</p>
        <div style={styles.actions}>
          <button type="button" onClick={handleCancel} style={styles.cancelBtn}>
            Hủy
          </button>
          <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    background: 'var(--bgr-c)',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--section-bgr)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
    backdropFilter: 'blur(8px)',
    color: 'var(--text-c)',
    textAlign: 'center',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '22px',
    fontWeight: 700,
  },
  desc: {
    margin: '0 0 20px',
    fontSize: '16px',
    color: 'var(--text-c)',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  cancelBtn: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid var(--text-c)',
    background: 'transparent',
    color: 'var(--text-c)',
    cursor: 'pointer',
    fontWeight: 600,
  },
  logoutBtn: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
};

export default AlreadyLoggedInGuard;
