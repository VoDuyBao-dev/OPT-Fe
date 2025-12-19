// src/pages/Register/RegisterForm.jsx

import FormGroup from "~/components/formGroup/FormGroup";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from './RegisterForm.module.scss';
import clsx from "clsx";
import { registerTutor } from "~/api/services/authService";
import { subjectOptions } from "~/constants/options/subjects";
import { genderOptions } from "~/constants/options/gender";
import { addressOptions } from "~/constants/options/address";
import { educationLevelOptions } from "~/constants/options/educationLevel";

function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        avatar: null,
        email: '',
        gender: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        subjects: [],
        currentLevel: '',
        university: '',
        introduction: '',
        tuition: '',
        certificateFiles: [null],
        certificateNames: ['']
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const levelOptions = educationLevelOptions;

    const handleChange = (e) => {
        const { name, value, files, selectedOptions } = e.target;

        // Clear field-level error when user edits
        if (name) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'avatar') {
            const file = files?.[0] || null;
            // Giới hạn dung lượng ảnh (5MB)
            const MAX_SIZE = 5 * 1024 * 1024;
            if (file && file.size > MAX_SIZE) {
                setError('Ảnh chân dung vượt quá 5MB, vui lòng chọn ảnh nhỏ hơn.');
                setFormData(prev => ({ ...prev, [name]: null }));
                setAvatarPreview(prevUrl => {
                    if (prevUrl) URL.revokeObjectURL(prevUrl);
                    return null;
                });
                return;
            }
            setFormData(prev => ({ ...prev, [name]: file }));
            setAvatarPreview(prevUrl => {
                if (prevUrl) URL.revokeObjectURL(prevUrl);
                return file ? URL.createObjectURL(file) : null;
            });
            return;
        }

        if (name === 'certificateFiles') {
            const files = Array.from(e.target.files || []);
            setFormData(prev => ({ ...prev, certificateFiles: files }));
            return;
        }

        if (name === 'subjects') {
            if (selectedOptions) {
                const selected = Array.from(selectedOptions, (opt) => opt.value);
                setFormData({ ...formData, subjects: selected });
            } else {
                setFormData({ ...formData, subjects: value });
            }
            return;
        }

        const rawValue = typeof value === 'string' ? value : value;
        setFormData({ ...formData, [name]: rawValue });
    };

    const handleAddCertificate = () => {
        setFormData(prev => ({
            ...prev,
            certificateNames: [...prev.certificateNames, ''],
            certificateFiles: [...prev.certificateFiles, null]
        }));
    };

    const handleCertificateNameChange = (index, value) => {
        setFormData(prev => {
            const newNames = [...prev.certificateNames];
            newNames[index] = value;
            return { ...prev, certificateNames: newNames };
        });
    };

    const handleCertificateFileChange = (index, file) => {
        setFormData(prev => {
            const newFiles = [...prev.certificateFiles];
            newFiles[index] = file;
            return { ...prev, certificateFiles: newFiles };
        });
    };

    const handleRemoveCertificate = (index) => {
        setFormData(prev => ({
            ...prev,
            certificateNames: prev.certificateNames.filter((_, i) => i !== index),
            certificateFiles: prev.certificateFiles.filter((_, i) => i !== index)
        }));
    };

    const translateError = (err) => {
        const code = err?.response?.data?.code;
        const msg = err?.response?.data?.message || '';
        const normalized = msg.toLowerCase();

        if (code === 409 || msg === 'USER_EXISTED' || normalized.includes('exist')) return 'Email đã được sử dụng';
        if (msg === 'PASSWORDS_DO_NOT_MATCH') return 'Mật khẩu xác nhận không khớp';
        if (msg === 'EMAIL_INVALID') return 'Email không hợp lệ';
        if (msg === 'PASSWORD_TOO_SHORT') return 'Mật khẩu quá ngắn';

        return msg || 'Đăng ký thất bại';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setErrors({});

        const newErrors = {};

        // ✅ Validation fullName
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (formData.fullName.trim().length < 2 || formData.fullName.trim().length > 50) {
            newErrors.fullName = 'Họ và tên phải từ 2-50 ký tự';
        }

        // ✅ Validation email
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = 'Email không hợp lệ';
        }

        // ✅ Validation password
        if (!formData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
        }

        if (formData.password.length < 6 || formData.password.length > 30) {
            newErrors.password = 'Mật khẩu phải từ 6-30 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }

        // ✅ Validation gender
        if (!formData.gender) {
            newErrors.gender = 'Vui lòng chọn giới tính';
        }

        // ✅ Validation phone
        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        }

        if (!/^0[0-9]{9}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (0 + 9 chữ số)';
        }

        // ✅ Validation avatar (bắt buộc)
        if (!formData.avatar) {
            newErrors.avatar = 'Vui lòng chọn ảnh chân dung';
        }

        if (!formData.avatar.type.startsWith('image/')) {
            newErrors.avatar = 'Avatar phải là file ảnh (JPG, PNG, ...)';
        }

        // ✅ Validation address
        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng chọn tỉnh thành phố';
        }

        // ✅ Validation subjects
        if (formData.subjects.length === 0) {
            newErrors.subjects = 'Vui lòng chọn ít nhất 1 môn dạy';
        }

        // ✅ Validation currentLevel
        if (!formData.currentLevel) {
            newErrors.currentLevel = 'Vui lòng chọn trình độ hiện tại';
        }

        // ✅ Validation university
        if (!formData.university.trim()) {
            newErrors.university = 'Vui lòng nhập trường đào tạo';
        }

        if (formData.university.trim().length > 100) {
            newErrors.university = 'Trường đào tạo không được vượt quá 100 ký tự';
        }

        // ✅ Validation introduction
        if (!formData.introduction.trim()) {
            newErrors.introduction = 'Vui lòng nhập giới thiệu bản thân';
        }

        if (formData.introduction.trim().length < 10) {
            newErrors.introduction = 'Giới thiệu bản thân phải có ít nhất 10 ký tự';
        }

        // ✅ Validation tuition
        if (!formData.tuition) {
            newErrors.tuition = 'Vui lòng nhập học phí';
        }

        const tuitionNum = parseInt(formData.tuition);
        if (tuitionNum < 50000 || tuitionNum > 1000000) {
            newErrors.tuition = 'Học phí phải từ 50,000 - 1,000,000 VND/giờ';
        }

        // ✅ Validation certificate files - Phải có cặp tên/file hợp lệ
        const certificatePairs = formData.certificateFiles
            .map((file, idx) => ({
                file,
                name: formData.certificateNames[idx] || ''
            }))
            .filter(cert => cert.file !== null || cert.name.trim() !== '');

        // Kiểm tra tất cả cặp phải đầy đủ (có tên và file)
        for (let cert of certificatePairs) {
            if (!cert.file || !cert.name.trim()) {
                newErrors.certificate = 'Mỗi chứng chỉ phải có cả tên và file PDF';
                break;
            }
            if (cert.file.type !== 'application/pdf') {
                newErrors.certificate = 'Tất cả file chứng chỉ phải là PDF';
                break;
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // 📋 Chuẩn bị dữ liệu gửi
            // ✅ Lưu ý: confirmPassword KHÔNG được gửi vào server
            // Server sẽ validate nó ở Frontend trước
            const submitData = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                confirmPassword: formData.confirmPassword, // ✅ Giữ lại cho authService. js xử lý
                phoneNumber: formData.phone.trim(),
                gender: formData.gender,
                address: formData.address.trim(),
                university: formData.university.trim(),
                educationalLevel: formData.currentLevel,
                introduction: formData.introduction.trim(),
                pricePerHour: parseInt(formData.tuition),
                subjectIds: formData.subjects.map(s => parseInt(s)),
                avatarFile: formData.avatar || null,
                certificateFiles: certificatePairs.map(c => c.file),
                certificateNames: certificatePairs.map(c => c.name.trim())
            };

            const response = await registerTutor(submitData);
            setSuccess('✅ Đăng ký thành công!  Đang chuyển hướng.. .');
            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            console.error('❌ Registration error:', err);
            const friendly = translateError(err);
            const code = err?.response?.data?.code;
            const msg = err?.response?.data?.message || '';
            const normalized = msg.toLowerCase();

            if (code === 409 || msg === 'USER_EXISTED' || normalized.includes('exist')) {
                setErrors(prev => ({ ...prev, email: friendly }));
                setError(null);
            } else if (msg === 'PASSWORDS_DO_NOT_MATCH') {
                setErrors(prev => ({ ...prev, confirmPassword: friendly }));
                setError(null);
            } else if (msg === 'EMAIL_INVALID') {
                setErrors(prev => ({ ...prev, email: friendly }));
                setError(null);
            } else if (msg === 'PASSWORD_TOO_SHORT') {
                setErrors(prev => ({ ...prev, password: friendly }));
                setError(null);
            } else {
                setError(friendly);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            {error && (
                <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#fee', borderRadius: '4px' }}>
                    ❌ {error}
                </div>
            )}

            {success && (
                <div style={{ color: 'green', marginBottom: '15px', padding: '10px', backgroundColor: '#efe', borderRadius: '4px' }}>
                    ✅ {success}
                </div>
            )}

            <div className={styles.topRow}>
                <div className={styles.leftCol}>
                    <FormGroup
                        className={clsx(styles.fullName, styles.inputField)}
                        label="Họ và tên"
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Nhập họ và tên"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.fullName}
                        required
                    />
                    <FormGroup
                        className={clsx(styles.gender, styles.inputField)}
                        label="Giới tính"
                        type="select"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={genderOptions}
                        error={errors.gender}
                        required
                    />
                </div>
                <div className={styles.avatarCol}>
                    <label htmlFor="avatar" className={styles.avatarLabel}>Ảnh chân dung <span style={{ color: 'red' }}>*</span></label>
                    <button
                        type="button"
                        className={styles.avatarBox}
                        onClick={() => fileInputRef.current?.click()}
                        aria-label="Chọn ảnh chân dung"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Xem trước ảnh chân dung"
                                className={styles.avatarImg}
                            />
                        ) : (
                            <span className={styles.avatarPlaceholder}>Bấm để chọn ảnh</span>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className={styles.avatarInput}
                    />
                </div>
            </div>

            <FormGroup
                className={clsx(styles.email, styles.inputField)}
                label="Email"
                type="email"
                id="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                        error={errors.email}
                required
            />
            <FormGroup
                className={clsx(styles.phone, styles.inputField)}
                label="Số điện thoại"
                type="tel"
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại (0xxxxxxxxx)"
                value={formData.phone}
                onChange={handleChange}
                        error={errors.phone}
                required
            />
            <FormGroup
                className={clsx(styles.password, styles.inputField)}
                label="Mật khẩu"
                type="password"
                id="password"
                name="password"
                placeholder="Nhập mật khẩu (6-30 ký tự)"
                value={formData.password}
                onChange={handleChange}
                        error={errors.password}
                required
            />
            <FormGroup
                className={clsx(styles.confirmPassword, styles.inputField)}
                label="Xác nhận mật khẩu"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Nhập xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                        error={errors.confirmPassword}
                required
            />

            <FormGroup
                className={clsx(styles.subjects, styles.inputField)}
                label="Môn muốn dạy"
                type="select"
                id="subjects"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                options={subjectOptions}
                multiple={true}
                        error={errors.subjects}
                required
            />

            <FormGroup
                className={clsx(styles.address, styles.inputField)}
                label="Tỉnh thành phố"
                type="select"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                options={addressOptions}
                        error={errors.address}
                required
            />
            <FormGroup
                className={clsx(styles.currentLevel, styles.inputField)}
                label="Trình độ hiện tại"
                type="select"
                id="currentLevel"
                name="currentLevel"
                value={formData.currentLevel}
                onChange={handleChange}
                options={levelOptions}
                        error={errors.currentLevel}
                required
            />
            <FormGroup
                className={clsx(styles.university, styles.inputField)}
                label="Trường đào tạo"
                type="text"
                id="university"
                name="university"
                placeholder="Nhập trường đào tạo"
                value={formData.university}
                onChange={handleChange}
                        error={errors.university}
                required
            />

            <FormGroup
                className={clsx(styles.introduction, styles.inputField)}
                label="Giới thiệu bản thân"
                type="textarea"
                id="introduction"
                name="introduction"
                placeholder="Giới thiệu bản thân (tối thiểu 10 ký tự)"
                value={formData.introduction}
                onChange={handleChange}
                        error={errors.introduction}
                required
            />

            <FormGroup
                className={clsx(styles.tuition, styles.inputField)}
                label="Học phí (VND/giờ, 50,000 - 1,000,000)"
                type="number"
                id="tuition"
                name="tuition"
                placeholder="Nhập học phí"
                value={formData.tuition}
                onChange={handleChange}
                        error={errors.tuition}
                required
                min="50000"
                max="1000000"
            />

            <div className={clsx(styles.certificates, styles.inputField)}>
                <label>Chứng chỉ (nếu có)</label>

                {formData.certificateNames.map((name, idx) => (
                    <div key={idx} className={styles.certificateRow}>
                        <div className={styles.certificateInputGroup}>
                            <input
                                type="text"
                                placeholder="Nhập tên chứng chỉ"
                                value={name}
                                onChange={(e) => handleCertificateNameChange(idx, e.target.value)}
                                className={styles.certNameInput}
                            />
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleCertificateFileChange(idx, e.target.files?.[0] || null)}
                                className={styles.certFileInput}
                            />
                        </div>
                        {idx === formData.certificateNames.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleAddCertificate}
                                className={styles.addCertBtn}
                                title="Thêm chứng chỉ"
                            >
                                +
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleRemoveCertificate(idx)}
                                className={styles.removeCertBtn}
                                title="Xóa chứng chỉ"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}

            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
            >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
        </form>
    );
}

export default RegisterForm;