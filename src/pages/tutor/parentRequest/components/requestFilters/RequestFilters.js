import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from './RequestFilters.module.scss';

function RequestFilters({ 
    searchTerm, 
    onSearchChange, 
    filter, 
    onFilterChange, 
    typeFilter, 
    onTypeFilterChange 
}) {
    return (
        <div className={styles.filters}>
            <div className={styles.searchBox}>
                <FontAwesomeIcon icon={faSearch} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc môn học..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className={styles.filterGroup}>
                <FontAwesomeIcon icon={faFilter} />
                <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="accepted">Đã chấp nhận</option>
                    <option value="rejected">Đã từ chối</option>
                </select>

                <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value)}>
                    <option value="all">Tất cả loại</option>
                    <option value="trial">Học thử</option>
                    <option value="official">Học chính thức</option>
                </select>
            </div>
        </div>
    );
}

export default RequestFilters;
