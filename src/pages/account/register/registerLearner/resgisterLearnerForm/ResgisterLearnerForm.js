import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ResgisterLearnerForm.module.scss";
import FormGroup from "~/components/formGroup/FormGroup";
// import { useGoogleLogin } from "@react-oauth/google";
import { registerLearner } from "~/api/services/authService";

function ReisterFormLearner() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // const login = useGoogleLogin({
    //     scope: 'openid profile email',
    //     onSuccess: async (tokenResponse) => {
    //         try {
    //             const accessToken = tokenResponse?.access_token;
    //             if (!accessToken) return;
    //             // Fetch profile from Google UserInfo endpoint
    //             const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    //                 headers: { Authorization: `Bearer ${accessToken}` }
    //             });
    //             const profile = await res.json();
    //             const fullName = profile?.name || '';
    //             const email = profile?.email || '';
    //             setFormData((prev) => ({ ...prev, fullName, email }));
    //             // TODO: Optionally send tokenResponse or profile to your backend for registration/login
    //         } catch (err) {
    //             console.error('Google userinfo error:', err);
    //         }
    //     },
    //     onError: () => {
    //         console.error('Google login failed');
    //     },
    // });

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullName = formData.fullName.trim();
        const email = formData.email.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        const newErrors = {};
        if (!fullName) newErrors.fullName = 'Vui lòng nhập họ và tên';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) newErrors.email = 'Vui lòng nhập email';
        else if (!emailRegex.test(email)) newErrors.email = 'Email không hợp lệ';

        if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
        else if (password.length < 6) newErrors.password = 'Mật khẩu phải tối thiểu 6 ký tự';

        if (!confirmPassword) newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        else if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            //đăng ký thành công và điều hướng qua trang login
            setLoading(true);
            await registerLearner({ fullName, email, password, confirmPassword });
            alert('Đăng ký thành công. chúng tôi sẽ chuyển bạn đến trang đăng nhập');
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const apiMsg = err.response?.data?.message;
            const apiCode = err.response?.data?.code;
            const normalizedMsg = (apiMsg || '').toLowerCase();
            if (apiCode === 409 || normalizedMsg.includes('user') && normalizedMsg.includes('exist')) {
                setErrors((prev) => ({ ...prev, email: 'Email đã được sử dụng' }));
                return;
            }

            if (normalizedMsg.includes('email')) {
                setErrors((prev) => ({ ...prev, email: 'Email không hợp lệ' }));
                return;
            }

            alert(apiMsg || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormGroup
                label="Họ và tên"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                placeholder="Nhập họ và tên"
                error={errors.fullName}
                required
            />
            <FormGroup
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="Nhập địa chỉ email"
                error={errors.email}
                required
            />
            <FormGroup
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                placeholder="Nhập mật khẩu"
                error={errors.password}
                required
            />
            <FormGroup
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                placeholder="Nhập lại mật khẩu"
                error={errors.confirmPassword}
                required
            />

            <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            {/* <div className={styles.dividerWrap}>
                <span className={styles.divider} />
                <span className={styles.dividerText}>hoặc</span>
                <span className={styles.divider} />
            </div>
            <div className={styles.oauthRow}>
                <button
                    type="button"
                    className={styles.googleFullBtn}
                    onClick={() => login()}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
                        <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9561 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"/>
                        <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.54755 0 8.99983C0 10.4521 0.347727 11.8266 0.957273 13.0416L3.96409 10.7098Z" fill="#FBBC05"/>
                        <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"/>
                    </svg>
                    Đăng ký bằng Google
                </button>
            </div> */}
        </form>
    );
}

export default ReisterFormLearner;