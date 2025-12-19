import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faFilePdf, faChevronLeft, faChevronRight, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/button/Button';
import styles from './PendingApprovals.module.scss';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { approveTutor, getPendingTutorDetail, getPendingTutors } from '~/api/services/adminService';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function PendingApprovals() {
    const [pendingTutors, setPendingTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [certificateIdx, setCertificateIdx] = useState(0);
    const [pdfError, setPdfError] = useState(null);
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

    const fetchPendingTutors = async (pageIndex = page) => {
        setLoading(true);
        setError('');
        try {
            const data = await getPendingTutors(pageIndex, pageSize);
            const items = data?.items || [];

            setPendingTutors(
                items.map((item, idx) => ({
                    id: item.tutor_id,
                    userId: item.user_id,
                    fullName: item.full_name,
                    email: item.email,
                    phone: item.phone_number,
                    subjects: item.subjects || [],
                    currentLevel: item.educational_level,
                    submittedDate: item.created_at,
                    certificates: item.pending_certificates || [],
                    rowNumber: pageIndex * pageSize + idx + 1,
                }))
            );

            setPagination({
                size: data?.size ?? pageSize,
                totalPages: data?.totalPages ?? 1,
                totalItems: data?.totalItems ?? items.length,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải danh sách hồ sơ chờ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingTutors(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchPendingTutors(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleViewDetail = async (tutor) => {
        setDetailLoading(true);
        setSelectedTutor(null);
        setPageNumber(1);
        setNumPages(null);
        setPdfError(null);
        setCertificateIdx(0);

        try {
            const detail = await getPendingTutorDetail(tutor.id);
            const certificateFiles = (detail?.certificates ?? detail?.pending_certificates ?? [])
                .flatMap((c, certIdx) => (c.files ?? []).map((f) => ({
                    url: f?.fileUrl ?? f?.url ?? f?.file_url ?? f,
                    name:
                        f?.name ??
                        f?.fileName ??
                        c?.certificateName ??
                        c?.name ??
                        c?.title ??
                        `Chứng chỉ ${certIdx + 1}`,
                })))
                .filter((f) => f.url);
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
                university: detail?.university,
                certificates: certificateFiles,
                introduction: detail?.introduction,
                pricePerHour: detail?.price_per_hour,
                submittedDate: detail?.create_at || detail?.created_at || detail?.createdAt,
            });
        } catch (err) {
            handleApiError(err, 'Không thể tải chi tiết hồ sơ');
        } finally {
            setDetailLoading(false);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPdfError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        setPdfError('Không thể tải file PDF. Vui lòng thử lại.');
    };

    const goToPrevPage = () => {
        if (!numPages) return;
        setPageNumber((prev) => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        if (!numPages) return;
        setPageNumber((prev) => Math.min(prev + 1, numPages));
    };

    const hasCertificates = selectedTutor?.certificates?.length > 0;
    const currentCertificate = hasCertificates
        ? selectedTutor.certificates[Math.min(certificateIdx, selectedTutor.certificates.length - 1)] || null
        : null;
    const currentFileUrl = typeof currentCertificate === 'string' ? currentCertificate : currentCertificate?.url;

    const handleOpenInNewTab = () => {
        if (!currentFileUrl) return;
        window.open(currentFileUrl, '_blank');
    };

    const handleApprove = async () => {
        if (!selectedTutor) return;
        if (!window.confirm(`Xác nhận phê duyệt hồ sơ của ${selectedTutor.fullName}?`)) return;

        try {
            await approveTutor(selectedTutor.id);
            alert('Đã phê duyệt hồ sơ thành công!');
            setSelectedTutor(null);
            fetchPendingTutors(page);
        } catch (err) {
            handleApiError(err, 'Không thể phê duyệt hồ sơ');
        }
    };

    const handleReject = () => {
        alert('Hiện chưa hỗ trợ từ chối hồ sơ từ BE.');
    };

    const closeDetailModal = () => {
        setSelectedTutor(null);
        setPageNumber(1);
        setNumPages(null);
        setPdfError(null);
        setCertificateIdx(0);
    };

    const changePage = (nextPage) => {
        if (nextPage < 0 || nextPage >= pagination.totalPages) return;
        setPage(nextPage);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const parsed = new Date(dateStr);
        if (Number.isNaN(parsed)) return dateStr;
        return parsed.toLocaleDateString('vi-VN');
    };
    console.log(selectedTutor)
    return (
        <div className={styles.pendingApprovals}>
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statNumber}>{pagination.totalItems}</div>
                    <div className={styles.statLabel}>Hồ sơ chờ duyệt</div>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.listWrapper}>
                {loading ? (
                    <div className={styles.noData}>
                        <p>Đang tải danh sách...</p>
                    </div>
                ) : pendingTutors.length > 0 ? (
                    <div className={styles.cardGrid}>
                        {pendingTutors.map((tutor) => (
                            <div key={tutor.id || tutor.rowNumber} className={styles.tutorCard}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.tutorName}>{tutor.fullName}</h3>
                                    <span className={styles.tutorId}>STT: {tutor.rowNumber}</span>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Email:</span>
                                        <span className={styles.infoValue}>{tutor.email}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Số điện thoại:</span>
                                        <span className={styles.infoValue}>{tutor.phone}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Môn dạy:</span>
                                        <span className={styles.infoValue}>{(tutor.subjects || []).join(', ')}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Trình độ:</span>
                                        <span className={styles.infoValue}>{tutor.currentLevel}</span>
                                    </div>
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoLabel}>Ngày tạo hồ sơ:</span>
                                        <span className={styles.infoValue}>{formatDate(tutor.submittedDate)}</span>
                                    </div>
                                </div>
                                <div className={styles.cardFooter}>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleViewDetail(tutor)}
                                        fullWidth
                                    >
                                        Xem chi tiết & Duyệt
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noData}>
                        <FontAwesomeIcon icon={faCheckCircle} className={styles.noDataIcon} />
                        <p>Không có hồ sơ nào chờ phê duyệt</p>
                    </div>
                )}
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

            {selectedTutor && (
                <div className={styles.modalOverlay} onClick={closeDetailModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Phê duyệt Hồ sơ Gia sư</h2>
                            <button className={styles.closeButton} onClick={closeDetailModal}>
                                ×
                            </button>
                        </div>
                        
                        <div className={styles.modalBody}>
                            {detailLoading ? (
                                <div className={styles.noData}>Đang tải chi tiết...</div>
                            ) : (
                                <div
                                    className={styles.approvalLayout}
                                    style={!hasCertificates ? { gridTemplateColumns: '1fr' } : undefined}
                                >
                                    {hasCertificates && (
                                        <div className={styles.certificatesSection}>
                                            <h3 className={styles.sectionTitle}>
                                                <FontAwesomeIcon icon={faFilePdf} /> Bằng cấp & Chứng chỉ (PDF)
                                            </h3>
                                            <div className={styles.pdfViewer}>
                                                {pdfError ? (
                                                    <div className={styles.pdfError}>
                                                        <FontAwesomeIcon icon={faFilePdf} className={styles.errorIcon} />
                                                        <p>{pdfError}</p>
                                                        {currentFileUrl && (
                                                            <Button
                                                                variant="primary"
                                                                onClick={handleOpenInNewTab}
                                                                className={styles.actionButton}
                                                            >
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} /> Mở tab mới
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : currentFileUrl ? (
                                                    <>
                                                        {String(currentFileUrl).includes('drive.google.com') ? (
                                                            <div className={styles.driveContainer}>
                                                                <iframe
                                                                    title="certificate-preview"
                                                                    src={currentFileUrl}
                                                                    className={styles.driveFrame}
                                                                    allow="autoplay"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className={styles.pdfContainer}>
                                                                <Document
                                                                    file={currentFileUrl}
                                                                    onLoadSuccess={onDocumentLoadSuccess}
                                                                    onLoadError={onDocumentLoadError}
                                                                    loading={
                                                                        <div className={styles.pdfLoading}>
                                                                            <div className={styles.spinner}></div>
                                                                            <p>Đang tải PDF...</p>
                                                                        </div>
                                                                    }
                                                                >
                                                                    <Page
                                                                        pageNumber={pageNumber}
                                                                        width={500}
                                                                        renderTextLayer={true}
                                                                        renderAnnotationLayer={true}
                                                                    />
                                                                </Document>
                                                            </div>
                                                        )}
                                                        <div className={styles.pdfControls}>
                                                            <button
                                                                onClick={handleOpenInNewTab}
                                                                className={styles.actionButton}
                                                                title="Mở ở tab mới"
                                                            >
                                                                <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                                Mở tab mới
                                                            </button>
                                                        </div>
                                                        {numPages && numPages > 1 && !String(currentFileUrl).includes('drive.google.com') && (
                                                            <div className={styles.pdfNavigation}>
                                                                <button
                                                                    onClick={goToPrevPage}
                                                                    disabled={pageNumber <= 1}
                                                                    className={styles.navButton}
                                                                >
                                                                    <FontAwesomeIcon icon={faChevronLeft} />
                                                                </button>
                                                                <span className={styles.pageCounter}>
                                                                    Trang {pageNumber} / {numPages}
                                                                </span>
                                                                <button
                                                                    onClick={goToNextPage}
                                                                    disabled={pageNumber >= numPages}
                                                                    className={styles.navButton}
                                                                >
                                                                    <FontAwesomeIcon icon={faChevronRight} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : null}
                                            </div>

                                            {selectedTutor.certificates?.length > 1 && (
                                                <div className={styles.fileList}>
                                                    {selectedTutor.certificates.map((url, idx) => (
                                                        <button
                                                            key={`${url.url || url}-${idx}`}
                                                            className={`${styles.fileButton} ${idx === certificateIdx ? styles.activeFile : ''}`}
                                                            onClick={() => {
                                                                setNumPages(null);
                                                                setPageNumber(1);
                                                                setPdfError(null);
                                                                setCertificateIdx(idx);
                                                            }}
                                                        >
                                                            {url?.name || `File ${idx + 1}`}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className={styles.infoSection}>
                                        <h3 className={styles.sectionTitle}>Thông tin khai báo</h3>
                                        <div className={styles.detailsList}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Mã hồ sơ:</span>
                                                <span className={styles.detailValue}>{selectedTutor.id}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Họ và Tên:</span>
                                                <span className={styles.detailValue}>{selectedTutor.fullName}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Giới tính:</span>
                                                <span className={styles.detailValue}>{selectedTutor.gender}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Email:</span>
                                                <span className={styles.detailValue}>{selectedTutor.email}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Số điện thoại:</span>
                                                <span className={styles.detailValue}>{selectedTutor.phone}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Địa chỉ:</span>
                                                <span className={styles.detailValue}>{selectedTutor.address}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Môn dạy:</span>
                                                <span className={styles.detailValue}>{(selectedTutor.subjects || []).join(', ')}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Trình độ:</span>
                                                <span className={styles.detailValue}>{selectedTutor.currentLevel}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Trường đào tạo:</span>
                                                <span className={styles.detailValue}>{selectedTutor.university}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Chứng chỉ:</span>
                                                <span className={styles.detailValue}>
                                                    {hasCertificates
                                                        ? selectedTutor.certificates.length + ' tài liệu'
                                                        : 'Không có'}
                                                </span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Học phí (VND/giờ):</span>
                                                <span className={styles.detailValue}>
                                                    {selectedTutor.pricePerHour
                                                        ? Number(selectedTutor.pricePerHour).toLocaleString('vi-VN')
                                                        : '-'}
                                                </span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Giới thiệu:</span>
                                                <span className={styles.detailValue}>{selectedTutor.introduction}</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailLabel}>Ngày tạo hồ sơ:</span>
                                                <span className={styles.detailValue}>{formatDate(selectedTutor.submittedDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <Button
                                variant="primary"
                                onClick={handleApprove}
                                className={styles.approveButton}
                                disabled={detailLoading}
                            >
                                <FontAwesomeIcon icon={faCheckCircle} /> Phê duyệt
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleReject}
                                className={styles.rejectButton}
                                disabled={detailLoading}
                            >
                                <FontAwesomeIcon icon={faTimesCircle} /> Từ chối (chưa hỗ trợ)
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingApprovals;
