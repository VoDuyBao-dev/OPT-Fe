import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock, faSearch, faEye, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from './ListLearner.module.scss';
import LearnerInfoModal from '../learnerInfoModal/LearnerInfoModal';
import { getLearners, getLearnerDetail, getLearnerStats, toggleLearnerStatus } from '~/api/services/adminService';

function ListLearner() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [showLearnerInfoModal, setShowLearnerInfoModal] = useState(false);
    const [selectedLearner, setSelectedLearner] = useState(null);
    const [learners, setLearners] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
    const [pagination, setPagination] = useState({ size: 10, totalPages: 1, totalItems: 0 });
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState('');

    const pageSize = 10;

    const handleApiError = (err, fallbackMessage) => {
        const message = err?.response?.data?.message || fallbackMessage;
        setError(message);

        if (err?.response?.status === 401 || err?.response?.status === 403) {
            alert('Bạn không có quyền thực hiện chức năng này. Vui lòng đăng nhập bằng tài khoản quản trị.');
        }
    };

    const fetchLearners = async (pageIndex = page) => {
        setLoading(true);
        setError('');
        try {
            const data = await getLearners(pageIndex, pageSize);
            const items = data?.items || [];

            setLearners(
                items.map((item, idx) => ({
                    id: item.user_id,
                    fullName: item.full_name,
                    email: item.email,
                    phone: item.phone_number,
                    address: item.address,
                    status: item.status,
                    createdAt: item.created_at,
                    rowNumber: pageIndex * pageSize + idx + 1,
                }))
            );

            setPagination({
                size: data?.size ?? pageSize,
                totalPages: data?.totalPages ?? 1,
                totalItems: data?.totalItems ?? items.length,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải danh sách người học');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await getLearnerStats();
            setStats({
                total: data?.total ?? 0,
                active: data?.active ?? 0,
                inactive: data?.inactive ?? 0,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải thống kê người học');
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchLearners(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleLockToggle = async (learner) => {
        const action = learner.status === 'ACTIVE' ? 'khóa' : 'mở khóa';
        if (!window.confirm(`Xác nhận ${action} tài khoản của ${learner.fullName}?`)) return;

        try {
            const result = await toggleLearnerStatus(learner.id);
            const newStatus = result?.newStatus || (learner.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
            setLearners((prev) =>
                prev.map((item) => (item.id === learner.id ? { ...item, status: newStatus } : item))
            );
            fetchStats();
        } catch (err) {
            handleApiError(err, 'Không thể cập nhật trạng thái người học');
        }
    };

    const handleViewLearner = async (learner) => {
        setSelectedLearner(null);
        setDetailLoading(true);
        setShowLearnerInfoModal(true);

        try {
            const detail = await getLearnerDetail(learner.id);
            setSelectedLearner({
                id: detail?.user_id,
                fullName: detail?.full_name,
                email: detail?.email,
                phone: detail?.phone_number,
                address: detail?.address,
                status: detail?.status,
                createdAt: detail?.created_at,
                updatedAt: detail?.updated_at,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải thông tin người học');
            setShowLearnerInfoModal(false);
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

    const filteredLearners = learners.filter((learner) => {
        const matchesSearch =
            learner.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            learner.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            learner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            learner.phone?.includes(searchTerm);

        const matchesStatus = statusFilter === 'all' || learner.status === statusFilter;

        const createdAt = learner.createdAt ? new Date(learner.createdAt) : null;

        let matchesDate = true;
        if (dateFilter.from) {
            matchesDate = matchesDate && createdAt && createdAt >= new Date(dateFilter.from);
        }
        if (dateFilter.to) {
            matchesDate = matchesDate && createdAt && createdAt <= new Date(dateFilter.to);
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const changePage = (nextPage) => {
        if (nextPage < 0 || nextPage >= pagination.totalPages) return;
        setPage(nextPage);
    };

    return (
        <div className={styles.listLearner}>
            <div className={styles.filterSection}>
                <div className={styles.topBar}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, ID, email hoặc số điện thoại..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    {/* <Button variant="primary" onClick={handleAddLearner}>
                        <FontAwesomeIcon icon={faPlus} /> Thêm Người học
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

            <div className={styles.statsBar}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Tổng số:</span>
                    <span className={styles.statValue}>{stats.total}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Hoạt động:</span>
                    <span className={styles.statValue}>{stats.active}</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Bị khóa:</span>
                    <span className={styles.statValue}>{stats.inactive}</span>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và Tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Ngày tham gia</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className={styles.noData}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : filteredLearners.length > 0 ? (
                            filteredLearners.map((learner) => (
                                <tr key={learner.id || learner.rowNumber}>
                                    <td>{learner.rowNumber}</td>
                                    <td className={styles.nameCell}>{learner.fullName}</td>
                                    <td>
                                        <div className={styles.emailCell}>
                                            <FontAwesomeIcon icon={faEnvelope} className={styles.icon} />
                                            {learner.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.phoneCell}>
                                            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
                                            {learner.phone}
                                        </div>
                                    </td>
                                    <td>{formatDate(learner.createdAt)}</td>
                                    <td>
                                        <span
                                            className={`${styles.status} ${
                                                learner.status === 'ACTIVE' ? styles.active : styles.locked
                                            }`}
                                        >
                                            {learner.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.iconButton}
                                                onClick={() => handleViewLearner(learner)}
                                                title="Xem chi tiết"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            <button
                                                className={`${styles.iconButton} ${
                                                    learner.status === 'INACTIVE' ? styles.unlock : styles.lock
                                                }`}
                                                onClick={() => handleLockToggle(learner)}
                                                title={learner.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                                            >
                                                <FontAwesomeIcon
                                                    icon={learner.status === 'ACTIVE' ? faLock : faUnlock}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className={styles.noData}>
                                    Không tìm thấy người học nào
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

            <LearnerInfoModal
                isOpen={showLearnerInfoModal}
                learnerData={selectedLearner}
                isLoading={detailLoading}
                onClose={() => setShowLearnerInfoModal(false)}
            />
        </div>
    );
}

export default ListLearner;
