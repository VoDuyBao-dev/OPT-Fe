import { useEffect, useState } from 'react';
import styles from './TutorProfile.module.scss';
import {
    ProfileHeader,
    ProfileTabs,
    PersonalInfoTab,
    EducationTab,
    SubjectsTab,
    PasswordModal
} from './components';
import {
    fetchPersonalInfo,
    fetchEducationInfo,
    fetchSubjectsInfo,
    fetchTutorRatings,
    updatePersonalInfo,
    updateEducationInfo,
    updateSubjectsInfo,
    updateTutorAvatar,
} from '~/api/services/tutorService';
import { subjectOptions } from '~/constants/options/subjects';

function TutorProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'education', 'subjects'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const emptyProfile = {
        id: '',
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        address: '',
        university: '',
        introduction: '',
        pricePerHour: '',
        verificationStatus: '',
        rating: 0,
        totalReviews: 0,
        avatarUrl: '',
    };

    const [tutorData, setTutorData] = useState(emptyProfile);

    const [subjects, setSubjects] = useState([]);
    const [initialSubjects, setInitialSubjects] = useState([]);
    const [availability] = useState([]);
    const [certificates, setCertificates] = useState([]); // {id,name,fileUrl,file?}

    const [formData, setFormData] = useState(emptyProfile);

    const normalizeCertificates = (certsArr = []) => certsArr.map((c, idx) => {
        const activeFile = (c.files || []).find(f => f.isActive) || (c.files || [])[0];
        return {
            id: c.certificateId ?? idx,
            name: c.certificateName ?? 'Chứng chỉ',
            fileUrl: activeFile?.fileUrl || '',
            status: activeFile?.status,
            file: null,
            deleted: false,
        };
    });

    const mapTutorData = (personal = {}, education = {}, ratings = {}) => ({
        id: personal.id ?? '',
        fullName: personal.fullName ?? '',
        email: personal.email ?? '',
        phone: personal.phoneNumber ?? '',
        gender: personal.gender ?? '',
        address: personal.address ?? '',
        university: education.university ?? '',
        introduction: education.introduction ?? '',
        pricePerHour: education.pricePerHour ?? '',
        verificationStatus: personal.verificationStatus ?? '',
        rating: ratings.averageRating ?? 0,
        totalReviews: ratings.totalReviews ?? 0,
        avatarUrl: personal.avatarUrl ?? '',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');
                setInfo('');
                const [personal, education, subjectsRes, ratings] = await Promise.all([
                    fetchPersonalInfo(),
                    fetchEducationInfo(),
                    fetchSubjectsInfo(),
                    fetchTutorRatings(),
                ]);

                const mapped = mapTutorData(personal, education, ratings);
                setTutorData(mapped);
                setFormData(mapped);

                const subjectsArr = subjectsRes?.subjects || [];
                const normalizedSubjects = subjectsArr.map((s, idx) => ({
                    id: s.subjectId ?? s.id ?? idx,
                    name: s.subjectName ?? s.name ?? 'Môn học',
                    grade: s.grade ?? s.gradeLevel ?? '',
                }));
                setSubjects(normalizedSubjects);
                setInitialSubjects(normalizedSubjects);

                const certsArr = education?.certificates || [];
                setCertificates(normalizeCertificates(certsArr));
            } catch (e) {
                setError(e.response?.data?.message || e.message || 'Lỗi tải hồ sơ');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (e.target.type === 'file') {
            return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCertificate = () => {
        setCertificates(prev => ([
            ...prev,
            { id: `new-${Date.now()}`, name: '', fileUrl: '', file: null, status: undefined, deleted: false },
        ]));
    };

    const handleCertificateNameChange = (index, value) => {
        setCertificates(prev => prev.map((c, idx) => idx === index ? { ...c, name: value } : c));
    };

    const handleCertificateFileChange = (index, file) => {
        setCertificates(prev => prev.map((c, idx) => idx === index ? { ...c, file, fileUrl: file ? '' : c.fileUrl } : c));
    };

    const handleRemoveCertificate = (index) => {
        setCertificates(prev => prev.map((c, idx) => {
            if (idx !== index) return c;
            const isNew = String(c.id || '').startsWith('new');
            if (isNew) {
                return { ...c, deleted: true }; // dropped when sending
            }
            return { ...c, deleted: true, file: null };
        }));
    };

    const handleAddSubject = (subjectId) => {
        if (!subjectId) return;
        const idNum = Number(subjectId);
        if (subjects.some(s => Number(s.id) === idNum)) {
            setInfo('Môn học đã tồn tại');
            return;
        }
        const option = subjectOptions.find(opt => Number(opt.value) === idNum);
        setSubjects(prev => ([
            ...prev,
            { id: idNum, name: option?.label || 'Môn học', grade: '' }
        ]));
    };

    const handleRemoveSubject = (subjectId) => {
        setSubjects(prev => prev.filter(s => Number(s.id) !== Number(subjectId)));
    };

    const handleSave = async () => {
        const personalChanged = (
            formData.fullName !== tutorData.fullName ||
            formData.email !== tutorData.email ||
            formData.phone !== tutorData.phone ||
            formData.gender !== tutorData.gender ||
            formData.address !== tutorData.address
        );

        const visibleCertificates = certificates.filter(c => !c.deleted);
        const hasNewCertFiles = certificates.some(c => c.file);
        const hasNewCertificates = visibleCertificates.some(c => String(c.id || '').startsWith('new'));
        const hasDeletedCertificates = certificates.some(c => c.deleted);

        const educationChanged = (
            formData.university !== tutorData.university ||
            formData.introduction !== tutorData.introduction ||
            formData.pricePerHour !== tutorData.pricePerHour ||
            hasNewCertFiles ||
            hasNewCertificates ||
            hasDeletedCertificates
        );

        const newCertMissingFile = certificates.some(c => String(c.id || '').startsWith('new') && !c.file);

        const currentSubjectIds = subjects.map(s => Number(s.id)).sort((a, b) => a - b);
        const initialSubjectIds = initialSubjects.map(s => Number(s.id)).sort((a, b) => a - b);
        const subjectsChanged = (
            currentSubjectIds.length !== initialSubjectIds.length ||
            currentSubjectIds.some((id, idx) => id !== initialSubjectIds[idx])
        );

        if (!personalChanged && !educationChanged && !subjectsChanged) {
            setInfo('Không có thay đổi để lưu');
            setIsEditing(false);
            return;
        }

        try {
            setLoading(true);
            setError('');
            setInfo('');
            let updatedTutor = { ...tutorData };

            if (personalChanged) {
                await updatePersonalInfo({
                    fullName: formData.fullName,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    gender: formData.gender?.toUpperCase(),
                    address: formData.address,
                });
                updatedTutor = {
                    ...updatedTutor,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    gender: formData.gender,
                    address: formData.address,
                };
            }

            if (educationChanged) {
                const withFiles = [];
                const withoutFiles = [];
                const files = [];

                certificates.forEach((c) => {
                    const cid = c.id;
                    const isNew = cid === null || cid === undefined || String(cid).startsWith('new');
                    if (c.deleted && isNew) return; // skip brand-new rows deleted before save

                    const dto = {
                        certificateId: isNew ? null : cid,
                        certificateName: (c.name || '').trim() || 'Chứng chỉ',
                        deleted: !!c.deleted,
                    };

                    if (!c.deleted && c.file) {
                        withFiles.push(dto);
                        files.push(c.file); // keep same order
                    } else {
                        withoutFiles.push(dto);
                    }
                });

                const certPayload = [...withFiles, ...withoutFiles];

                const rawPrice = formData.pricePerHour === '' || formData.pricePerHour === undefined
                    ? tutorData.pricePerHour
                    : formData.pricePerHour;
                const priceNumber = Number(rawPrice);
                if (!Number.isFinite(priceNumber) || priceNumber < 10000) {
                    throw new Error('Học phí phải >= 10000');
                }

                const educationPayload = {
                    university: formData.university,
                    introduction: formData.introduction,
                    pricePerHour: priceNumber,
                    certificates: certPayload,
                };

                await updateEducationInfo(educationPayload, files);

                const refreshedEducation = await fetchEducationInfo();
                setCertificates(normalizeCertificates(refreshedEducation?.certificates || []));

                updatedTutor = {
                    ...updatedTutor,
                    university: educationPayload.university,
                    introduction: educationPayload.introduction,
                    pricePerHour: educationPayload.pricePerHour,
                };
            }

            if (subjectsChanged && subjects.length) {
                await updateSubjectsInfo({ subjectIds: subjects.map(s => s.id) });
            }

            setTutorData(updatedTutor);
            setFormData(updatedTutor);
            setInitialSubjects(subjects);
            setIsEditing(false);
            setInfo(hasNewCertFiles ? 'Đã lưu thay đổi. Nếu upload file mới, admin sẽ duyệt lại' : 'Đã lưu thay đổi');
        } catch (e) {
            setError(e.response?.data?.message || e.message || 'Lưu hồ sơ thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({ ...tutorData });
        setIsEditing(false);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('Vui lòng chọn file ảnh (JPG, PNG, GIF)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 5MB');
            return;
        }

        try {
            setLoading(true);
            const result = await updateTutorAvatar(file);
            const url = result?.avatarUrl || result;
            setFormData(prev => ({ ...prev, avatarUrl: url }));
            setTutorData(prev => ({ ...prev, avatarUrl: url }));
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Cập nhật ảnh đại diện thất bại');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.tutorProfile}>
            <div className={styles.container}>
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                {info && <div style={{ color: '#2563eb', marginBottom: 8 }}>{info}</div>}
                {loading && <div style={{ marginBottom: 8 }}>Đang tải...</div>}
                <ProfileHeader
                    tutorData={tutorData}
                    isEditing={isEditing}
                    onEditClick={() => setIsEditing(true)}
                    onSaveClick={handleSave}
                    onCancelClick={handleCancel}
                    onPasswordClick={() => setShowPasswordModal(true)}
                    onAvatarChange={handleAvatarChange}
                />

                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    isEditing={isEditing}
                />

                <div className={styles.tabContent}>
                    {activeTab === 'info' && (
                        <PersonalInfoTab
                            formData={formData}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                        />
                    )}

                    {activeTab === 'education' && (
                        <EducationTab
                            formData={formData}
                            tutorData={tutorData}
                            isEditing={isEditing}
                            onChange={handleInputChange}
                            certificates={certificates}
                            onAddCertificate={handleAddCertificate}
                            onCertificateNameChange={handleCertificateNameChange}
                            onCertificateFileChange={handleCertificateFileChange}
                            onRemoveCertificate={handleRemoveCertificate}
                        />
                    )}

                    {activeTab === 'subjects' && (
                        <SubjectsTab
                            subjects={subjects}
                            availability={availability}
                            isEditing={isEditing}
                            onAddSubject={handleAddSubject}
                            onRemoveSubject={handleRemoveSubject}
                            availableSubjects={subjectOptions}
                        />
                    )}
                </div>
            </div>

            <PasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
        </div>
    );
}

export default TutorProfile;