import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import TutorInfoModal from '../tutorInfoModal/TutorInfoModal';
import styles from './ListTutor.module.scss';
import { getTutorDetail, getTutors, toggleTutorStatus } from '~/api/services/adminService';

function ListTutor() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [showTutorInfoModal, setShowTutorInfoModal] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [pagination, setPagination] = useState({ size: 5, totalPages: 1, totalItems: 0 });

    const pageSize = 5;

    const handleApiError = (err, fallbackMessage) => {
        const message = err?.response?.data?.message || fallbackMessage;
        setError(message);

        if (err?.response?.status === 401 || err?.response?.status === 403) {
            alert('Bạn không có quyền thực hiện chức năng này. Vui lòng đăng nhập bằng tài khoản quản trị.');
        }
    };

    const fetchTutors = async (pageIndex = page) => {
        setLoading(true);
        setError('');
        try {
            const data = await getTutors(pageIndex, pageSize);
            const items = data?.items || [];

            setTutors(
                items.map((item, idx) => ({
                    id: item.tutor_id,
                    userId: item.user_id,
                    fullName: item.full_name,
                    subjects: item.subjects || [],
                    rating: item.average_rating ?? 0,
                    status: item.status,
                    updatedAt: item.updated_at,
                    rowNumber: pageIndex * pageSize + idx + 1,
                }))
            );

            setPagination({
                size: data?.size ?? pageSize,
                totalPages: data?.totalPages ?? 1,
                totalItems: data?.totalItems ?? items.length,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải danh sách gia sư');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTutors(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchTutors(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleLockToggle = async (tutor) => {
        const action = tutor.status === 'ACTIVE' ? 'khóa' : 'mở khóa';
        if (!window.confirm(`Xác nhận ${action} tài khoản gia sư ${tutor.fullName}?`)) return;

        try {
            const result = await toggleTutorStatus(tutor.id);
            const newStatus = result?.newStatus || (tutor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
            setTutors((prev) => prev.map((item) => (item.id === tutor.id ? { ...item, status: newStatus } : item)));
        } catch (err) {
            handleApiError(err, 'Không thể cập nhật trạng thái gia sư');
        }
    };

    const handleViewDetail = async (tutor) => {
        setShowTutorInfoModal(true);
        setDetailLoading(true);
        setSelectedTutor(null);

        try {
            const detail = await getTutorDetail(tutor.id);
            const certificates = (detail?.certificates ?? detail?.pending_certificates ?? []).map((cert, idx) => ({
                name: cert?.certificateName ?? cert?.name ?? cert?.title ?? `Chứng chỉ ${idx + 1}`,
                files: (cert?.files ?? [])
                    .map((f) => f?.fileUrl ?? f?.url ?? f?.file_url ?? f)
                    .filter(Boolean),
            }));
            setSelectedTutor({
                id: detail?.tutor_id,
                userId: detail?.user_id,
                fullName: detail?.full_name,
                gender: detail?.gender,
                email: detail?.email,
                phone: detail?.phone_number,
                address: detail?.address,
                subjects: detail?.subjects || [],
                currentLevel: detail?.educational_level,
                certifications: certificates,
                introduction: detail?.introduction,
                pricePerHour: detail?.price_per_hour,
                university: detail?.university,
                status: detail?.status,
                rating: detail?.average_rating,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải thông tin gia sư');
            setShowTutorInfoModal(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const parsed = new Date(dateStr);
        if (Number.isNaN(parsed)) return dateStr;
        return parsed.toLocaleDateString('vi-VN');
    };

    const filteredTutors = tutors.filter((tutor) => {
        const matchesSearch =
            tutor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutor.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (tutor.subjects || []).some((subject) => subject.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || tutor.status === statusFilter;

        const updatedAt = tutor.updatedAt ? new Date(tutor.updatedAt) : null;
        let matchesDate = true;
        if (dateFilter.from) {
            matchesDate = matchesDate && updatedAt && updatedAt >= new Date(dateFilter.from);
        }
        if (dateFilter.to) {
            matchesDate = matchesDate && updatedAt && updatedAt <= new Date(dateFilter.to);
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const changePage = (nextPage) => {
        if (nextPage < 0 || nextPage >= pagination.totalPages) return;
        setPage(nextPage);
    };
    console.log(selectedTutor)
    return (
        <div className={styles.listTutor}>
            <div className={styles.filterSection}>
                <div className={styles.topBar}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, môn dạy,..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    {/* <Button variant="primary" onClick={handleAddTutor}>
                        <FontAwesomeIcon icon={faPlus} /> Thêm Gia sư
                    </Button> */}
                </div>
                
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Trạng thái:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">Tất cả</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Bị khóa</option>
                        </select>
                    </div>
                    
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Từ ngày:</label>
                        <input
                            type="date"
                            value={dateFilter.from}
                            onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                            className={styles.dateInput}
                        />
                    </div>
                    
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Đến ngày:</label>
                        <input
                            type="date"
                            value={dateFilter.to}
                            onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                            className={styles.dateInput}
                        />
                    </div>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và Tên</th>
                            <th>Môn Dạy</th>
                            <th>Đánh Giá</th>
                            <th>Ngày Tham Gia</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className={styles.noData}>Đang tải dữ liệu...</td>
                            </tr>
                        ) : filteredTutors.length > 0 ? (
                            filteredTutors.map((tutor) => (
                                <tr key={tutor.id || tutor.rowNumber}>
                                    <td>{tutor.rowNumber}</td>
                                    <td className={styles.nameCell}>{tutor.fullName}</td>
                                    <td>
                                        <div className={styles.subjects}>
                                            {(tutor.subjects || []).map((subject, index) => (
                                                <span key={`${tutor.id}-${index}`} className={styles.subjectTag}>
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.rating}>
                                            ⭐ {(tutor.rating ?? 0).toFixed(1)}
                                        </span>
                                    </td>
                                    <td>{formatDate(tutor.updatedAt)}</td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${
                                                tutor.status === 'ACTIVE' ? styles.active : styles.locked
                                            }`}
                                        >
                                            {tutor.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.iconButton}
                                                onClick={() => handleViewDetail(tutor)}
                                                title="xem chi tiết"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>

                                            <button
                                                className={`${styles.iconButton} ${
                                                    tutor.status === 'INACTIVE' ? styles.unlock : styles.lock
                                                }`}
                                                onClick={() => handleLockToggle(tutor)}
                                                title={tutor.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                                            >
                                                <FontAwesomeIcon
                                                    icon={tutor.status === 'ACTIVE' ? faLock : faUnlock}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.noData}>
                                    Không tìm thấy gia sư nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination}>
                <button
                    className={styles.pageButton}
                    onClick={() => changePage(page - 1)}
                    disabled={page === 0 || loading}
                >
                    Trang trước
                </button>
                <span className={styles.pageInfo}>
                    Trang {page + 1} / {pagination.totalPages || 1}
                </span>
                <button
                    className={styles.pageButton}
                    onClick={() => changePage(page + 1)}
                    disabled={page + 1 >= pagination.totalPages || loading}
                >
                    Trang sau
                </button>
            </div>

            <TutorInfoModal
                isOpen={showTutorInfoModal}
                onClose={() => setShowTutorInfoModal(false)}
                tutorData={selectedTutor}
                isLoading={detailLoading}
            />
        </div>
    );
}

export default ListTutor;
