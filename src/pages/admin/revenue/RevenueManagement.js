import React, { useMemo, useState, useEffect } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LuClock4, LuCoins, LuTrendingUp, LuUsers } from 'react-icons/lu';
import styles from './RevenueManagement.module.scss';
import {
  getAdminRevenueTransactions,
  getAdminDashboardStats,
  getAdminRevenueLast6Months,
  getAdminRevenueBySubject,
} from '~/api/services/adminService';


const RevenueManagement = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);
  const [subjectShare, setSubjectShare] = useState([]);
  const [subjectRange, setSubjectRange] = useState('30d');
  const [subjectLoading, setSubjectLoading] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value || 0);

  const stats = useMemo(() => {
    const totalRevenue = statsData?.totalRevenue ?? 0;
    const platformProfit = statsData?.platformProfit ?? 0;
    const activeTutors = statsData?.activeTutors ?? 0;
    const pendingAmount = statsData?.pendingAmount ?? 0;
    const growth = statsData?.revenueGrowthPercent;

    return [
      {
        label: 'Tổng doanh thu',
        value: formatCurrency(totalRevenue),
        delta: growth != null ? `${growth}%` : '—',
        icon: <LuTrendingUp />,
        accent: styles.accentPrimary,
      },
      {
        label: 'Lợi nhuận sàn',
        value: formatCurrency(platformProfit),
        delta: '20% phí',
        icon: <LuCoins />,
        accent: styles.accentTeal,
      },
      {
        label: 'Gia sư đang hoạt động',
        value: activeTutors?.toLocaleString('vi-VN') ?? '0',
        delta: '',
        icon: <LuUsers />,
        accent: styles.accentIndigo,
      },
      {
        label: 'Chờ thanh toán',
        value: formatCurrency(pendingAmount),
        delta: '',
        icon: <LuClock4 />,
        accent: styles.accentAmber,
      },
    ];
  }, [statsData]);

  const statusLabel = (status) => {
    if (!status) return 'Không xác định';
    const map = {
      PAID: 'Đã thanh toán',
      PENDING: 'Đang chờ',
      REFUNDED: 'Hoàn tiền',
      FAILED: 'Thất bại',
    };
    return map[status] || status;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAdminRevenueTransactions({ page: page - 1, size: pageSize });
        const content = res?.content || [];
        setTransactions(
          content.map((item) => ({
            id: item.transactionCode,
            tutor: item.tutorName,
            student: item.learnerName,
            subject: item.subjectName,
            amount: item.amount,
            status: statusLabel(item.status),
            rawStatus: item.status,
            date: item.createdAt?.slice(0, 10) || '',
          })),
        );
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error('Load revenue transactions error:', err);
        setError('Không tải được danh sách giao dịch.');
        setTransactions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const res = await getAdminDashboardStats();
        setStatsData(res || null);
      } catch (err) {
        console.error('Load dashboard stats error:', err);
        setStatsData(null);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const loadTrend = async () => {
      try {
        setTrendLoading(true);
        const res = await getAdminRevenueLast6Months();
        const mapped = (res || []).map((item) => ({
          month: item.month,
          revenue: item.revenue || 0,
          profit: item.profit || 0,
        }));
        setTrendData(mapped);
      } catch (err) {
        console.error('Load revenue last 6 months error:', err);
        setTrendData([]);
      } finally {
        setTrendLoading(false);
      }
    };

    loadTrend();
  }, []);

  useEffect(() => {
    const loadSubjectShare = async () => {
      try {
        setSubjectLoading(true);
        const res = await getAdminRevenueBySubject(subjectRange);
        const mapped = (res || []).map((item) => ({
          name: item.subject,
          value: item.percent || 0,
          amount: item.amount || 0,
        }));
        setSubjectShare(mapped);
      } catch (err) {
        console.error('Load revenue by subject error:', err);
        setSubjectShare([]);
      } finally {
        setSubjectLoading(false);
      }
    };

    loadSubjectShare();
  }, [subjectRange]);

  const subjectColors = ['#2563EB', '#38BDF8', '#22C55E', '#FACC15', '#A855F7', '#0EA5E9'];

  const statusClass = (status) => {
    if (status === 'Đã thanh toán') return styles.statusPaid;
    if (status === 'Đang chờ') return styles.statusPending;
    if (status === 'Hoàn tiền') return styles.statusRefunded;
    return '';
  };

  const handlePageChange = (direction) => {
    setPage((prev) => {
      if (direction === 'prev') return Math.max(prev - 1, 1);
      return Math.min(prev + 1, totalPages);
    });
  };

  const renderDonutLabel = ({ cx, cy }) => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className={styles.donutLabel}>
      Doanh thu theo môn
    </text>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bảng điều khiển doanh thu</h1>
          <p className={styles.subtitle}>Theo dõi hiệu suất nền tảng và thanh toán theo thời gian thực.</p>
        </div>
        {/* <div className={styles.headerBadge}>Cập nhật: 10/12/2025</div> */}
      </header>

      <section className={styles.statsGrid}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCard}>
            <div className={`${styles.iconWrap} ${item.accent}`}>{item.icon}</div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{item.label}</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statDelta}>{item.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.chartsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Doanh thu 6 tháng</h3>
            <span className={styles.badge}>VND</span>
          </div>
          <div className={styles.chartWrapper}>
            {trendLoading ? (
              <div className={styles.empty}>Đang tải...</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="profit" stroke="#22C55E" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2.5} />
                  <Legend verticalAlign="top" height={32} iconType="circle" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Doanh thu theo môn</h3>
            <div className={styles.subjectHeaderRight}>
              <span className={styles.badgeAlt}>{subjectRange === '7d' ? '7 ngày' : subjectRange === '90d' ? '90 ngày' : '30 ngày gần nhất'}</span>
              <select value={subjectRange} onChange={(e) => setSubjectRange(e.target.value)} className={styles.rangeSelect}>
                <option value="7d">7d</option>
                <option value="30d">30d</option>
                <option value="90d">90d</option>
              </select>
            </div>
          </div>
          <div className={styles.chartWrapper}>
            {subjectLoading ? (
              <div className={styles.empty}>Đang tải...</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={subjectShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    labelLine={false}
                    label={renderDonutLabel}
                  >
                    {subjectShare.map((entry, index) => (
                      <Cell key={entry.name} fill={subjectColors[index % subjectColors.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  <Tooltip formatter={(value, name, props) => [`${value}%`, props?.payload?.name]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Giao dịch gần đây</h3>
          <span className={styles.badge}>Đối soát tự động hằng ngày</span>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã giao dịch</th>
                <th>Gia sư</th>
                <th>Học viên</th>
                <th>Môn học</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className={styles.empty}>Đang tải dữ liệu...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className={styles.empty}>{error}</td>
                </tr>
              )}
              {!loading && !error && transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.empty}>Chưa có giao dịch</td>
                </tr>
              )}
              {!loading && !error && transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.tutor}</td>
                  <td>{tx.student}</td>
                  <td>{tx.subject}</td>
                  <td>{formatCurrency(tx.amount)}</td>
                  <td>
                    <span className={`${styles.status} ${statusClass(tx.status)}`}>{tx.status}</span>
                  </td>
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button onClick={() => handlePageChange('prev')} disabled={page === 1}>
            Trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button onClick={() => handlePageChange('next')} disabled={page === totalPages}>
            Sau
          </button>
        </div>
      </section>
    </div>
  );
};

export default RevenueManagement;