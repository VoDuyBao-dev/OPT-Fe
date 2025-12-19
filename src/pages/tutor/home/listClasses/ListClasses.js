import { useEffect, useState } from 'react';
import { courseImages } from '~/assets/imgs';

import { getActiveClasses } from '~/api/services/tutorService';
import CardItem from '../cardItem/CardItem';
import Button from '~/components/button/Button';
import styles from './ListClasses.module.scss';

function ListClasses() {
  const [data, setData] = useState({ items: [], page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pageSize = 5;

  const fetchData = async (page = 0) => {
    try {
      setLoading(true);
      setError('');
      const result = await getActiveClasses(page, pageSize);
      setData({
        items: result.items || result.content || [],
        page: result.page,
        totalPages: result.totalPages,
      });
    } catch (e) {
      setError(e.response?.data?.message || `Lỗi tải danh sách lớp: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(0); }, []);

  const handlePrev = () => {
    if (data.page > 0 && !loading) {
      fetchData(data.page - 1);
    }
  };

  const handleNext = () => {
    if (data.page < data.totalPages - 1 && !loading) {
      fetchData(data.page + 1);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  return (
    <div className={styles.listClasses}>
      <div className={styles.ctn}>
        <div className={styles.header}>
          <h2 className={styles.title}>Danh sách lớp học đang dạy</h2>
        </div>
        <div className={styles.body}>
          {data.items.length === 0 ? (
            <div>Chưa có lớp đang dạy</div>
          ) : (
            data.items.map((c, idx) => {
              const imgIndex = idx % courseImages.length; //index
              const courseImg = courseImages[imgIndex] || '';
              return (
                <CardItem
                  key={idx}
                  imgSrc={courseImg}
                  fullNameLearner={c.learnerName}
                  address={c.learnerAddress}
                  subject={c.subjectName}
                  startDate={c.startDate}
                  endDate={c.endDate}
                  className={styles.cardItem}
                />
              );
            })
          )}
        </div>
        {data.totalPages > 1 && (
          <div className={styles.pagination}>
            <Button
              variant="secondary"
              size="small"
              onClick={handlePrev}
              disabled={loading || data.page === 0}
            >
              Trang trước
            </Button>
            <span>
              Trang {data.page + 1} / {data.totalPages}
            </span>
            <Button
              variant="secondary"
              size="small"
              onClick={handleNext}
              disabled={loading || data.page >= data.totalPages - 1}
            >
              Trang tiếp
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListClasses;