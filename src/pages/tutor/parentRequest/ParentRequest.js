import { useEffect, useState } from 'react';
import { PageHeader, RequestFilters, RequestList, RejectModal } from './components';
import styles from './ParentRequest.module.scss';
import HeaderPage from '~/components/headerPage/HeaderPage';
import Toast from '~/components/toast/Toast';
import { fetchTutorRequests, acceptTutorRequest, rejectTutorRequest } from '~/api/services/tutorService';

function ParentRequest() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
    const [typeFilter, setTypeFilter] = useState('all'); // all, trial, official
    const [searchTerm, setSearchTerm] = useState('');
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 8, totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [toast, setToast] = useState({ message: '', type: '' });

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const loadRequests = async (page = 0) => {
        try {
            setLoading(true);
            setError('');
            const result = await fetchTutorRequests({
                status: filter,
                type: typeFilter,
                keyword: searchTerm,
                page,
                size: pageInfo.size,
            });

            const content = (result?.content || []).map((item) => ({
                id: item.requestId,
                learnerName: item.fullName,
                subject: item.subjectName,
                grade: item.grade,
                type: item.type === 'TRIAL' ? 'trial' : 'official',
                schedule: item.scheduleDescription,
                startDate: item.startDate,
                duration: `${item.totalSessions || ''} buổi`,
                price: item.pricePerHour ? `${item.pricePerHour.toLocaleString('vi-VN')} đ/giờ` : '',
                message: item.additionalNotes || '',
                status: item.status === 'CONFIRMED' ? 'accepted' : item.status === 'CANCELLED' ? 'rejected' : 'pending',
                createdAt: item.createdAt,
                requestStatus: item.status,
                typeRaw: item.type,
            }));
            setRequests(content);
            setPageInfo({
                page: result?.number || 0,
                size: result?.size || pageInfo.size,
                totalPages: result?.totalPages || 0,
                totalElements: result?.totalElements || 0,
            });
        } catch (err) {
            setError('Tải yêu cầu thất bại');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, typeFilter, searchTerm]);

    const handleAccept = async (id) => {
        try {
            await acceptTutorRequest(id);
            await loadRequests(pageInfo.page);
            showToast('Chấp nhận yêu cầu thành công', 'success');
        } catch (err) {
            setError('Chấp nhận yêu cầu thất bại');
            showToast('Chấp nhận yêu cầu thất bại', 'error');
        }
    };

    const handleReject = (request) => {
        setSelectedRequest(request);
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (selectedRequest) {
            try {
                await rejectTutorRequest(selectedRequest.id);
                await loadRequests(pageInfo.page);
                showToast('Từ chối yêu cầu thành công', 'success');
            } catch (err) {
                setError('Từ chối yêu cầu thất bại');
                showToast('Từ chối yêu cầu thất bại', 'error');
            }
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedRequest(null);
        }
    };

    const pendingCount = requests.filter(r => r.status === 'pending').length;

    const filteredRequests = requests; // already filtered via API params


    const handlePageChange = (nextPage) => {
        const target = Math.min(Math.max(nextPage, 0), Math.max((pageInfo.totalPages || 1) - 1, 0));
        if (target !== pageInfo.page && !loading) {
            loadRequests(target);
        }
    };

    return (
        <div className={styles.parentRequest}>
            <Toast
                message={toast.message}
                type={toast.type}
                duration={3000}
                onClose={() => setToast({ message: '', type: '' })}
            />
            <div className={styles.container}>
                <HeaderPage title="Quản lý yêu cầu" />
                <PageHeader pendingCount={pendingCount} />

                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                {loading && <div style={{ marginBottom: 12 }}>Đang tải yêu cầu...</div>}

                <RequestFilters
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filter={filter}
                    onFilterChange={setFilter}
                    typeFilter={typeFilter}
                    onTypeFilterChange={setTypeFilter}
                />

                <RequestList
                    requests={filteredRequests}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />

                { (pageInfo.totalPages || 0) > 1 && (
                    <div className={styles.pagination}>
                        <button
                            className={styles.pageBtn}
                            onClick={() => handlePageChange(pageInfo.page - 1)}
                            disabled={loading || pageInfo.page <= 0}
                        >
                            Trang trước
                        </button>
                        <span className={styles.pageInfo}>
                            Trang { (pageInfo.page || 0) + 1 } / { Math.max(pageInfo.totalPages || 1, 1) }
                        </span>
                        <button
                            className={styles.pageBtn}
                            onClick={() => handlePageChange(pageInfo.page + 1)}
                            disabled={loading || (pageInfo.page + 1) >= (pageInfo.totalPages || 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                )}
            </div>

            <RejectModal
                isOpen={showRejectModal}
                onClose={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedRequest(null);
                }}
                onConfirm={confirmReject}
                reason={rejectReason}
                onReasonChange={setRejectReason}
            />
        </div>
    );
}

export default ParentRequest;