import React, { useMemo, useState } from 'react';
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


const RevenueManagement = () => {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const stats = useMemo(
    () => [
      {
        label: 'Tổng doanh thu',
        value: '124.500.000 ₫',
        delta: '+18,2%',
        icon: <LuTrendingUp />,
        accent: styles.accentPrimary,
      },
      {
        label: 'Lợi nhuận sàn',
        value: '24.900.000 ₫',
        delta: '20% phí',
        icon: <LuCoins />,
        accent: styles.accentTeal,
      },
      {
        label: 'Gia sư đang hoạt động',
        value: '482',
        delta: '+36 mới',
        icon: <LuUsers />,
        accent: styles.accentIndigo,
      },
      {
        label: 'Chờ thanh toán',
        value: '6.740.000 ₫',
        delta: '5 đang duyệt',
        icon: <LuClock4 />,
        accent: styles.accentAmber,
      },
    ],
    [],
  );

  const revenueTrend = useMemo(
    () => [
      { month: 'Thg 7', revenue: 17500, profit: 3500 },
      { month: 'Thg 8', revenue: 19200, profit: 3840 },
      { month: 'Thg 9', revenue: 20500, profit: 4100 },
      { month: 'Thg 10', revenue: 21800, profit: 4360 },
      { month: 'Thg 11', revenue: 23600, profit: 4720 },
      { month: 'Thg 12', revenue: 24700, profit: 4940 },
    ],
    [],
  );

  const subjectShare = useMemo(
    () => [
      { name: 'Toán', value: 32 },
      { name: 'Vật lý', value: 18 },
      { name: 'Tiếng Anh', value: 22 },
      { name: 'Âm nhạc', value: 12 },
      { name: 'Hóa học', value: 9 },
      { name: 'Khác', value: 7 },
    ],
    [],
  );

  const transactions = useMemo(
    () => [
      {
        id: '#TX-98421',
        tutor: 'Nguyen Van A',
        student: 'Tran Minh Khoa',
        subject: 'Toán',
        amount: 120,
        status: 'Đã thanh toán',
        date: '01/12/2025',
      },
      {
        id: '#TX-98422',
        tutor: 'Le Thi B',
        student: 'Hoang Gia Bao',
        subject: 'Tiếng Anh',
        amount: 95,
        status: 'Đang chờ',
        date: '02/12/2025',
      },
      {
        id: '#TX-98423',
        tutor: 'Pham Van C',
        student: 'Vu Quynh Nhu',
        subject: 'Vật lý',
        amount: 130,
        status: 'Đã thanh toán',
        date: '03/12/2025',
      },
      {
        id: '#TX-98424',
        tutor: 'Dang Thi D',
        student: 'Le Tien Dat',
        subject: 'Âm nhạc',
        amount: 80,
        status: 'Hoàn tiền',
        date: '04/12/2025',
      },
      {
        id: '#TX-98425',
        tutor: 'Nguyen Van E',
        student: 'Ngo My Linh',
        subject: 'Hóa học',
        amount: 110,
        status: 'Đã thanh toán',
        date: '05/12/2025',
      },
      {
        id: '#TX-98426',
        tutor: 'Tran Thi F',
        student: 'Nguyen Truong An',
        subject: 'Toán',
        amount: 140,
        status: 'Đang chờ',
        date: '06/12/2025',
      },
      {
        id: '#TX-98427',
        tutor: 'Hoang Van G',
        student: 'Bui Bao Ngoc',
        subject: 'Tiếng Anh',
        amount: 90,
        status: 'Đã thanh toán',
        date: '07/12/2025',
      },
      {
        id: '#TX-98428',
        tutor: 'Pham Thi H',
        student: 'Trinh Bao Khanh',
        subject: 'Vật lý',
        amount: 125,
        status: 'Đã thanh toán',
        date: '08/12/2025',
      },
      {
        id: '#TX-98429',
        tutor: 'Do Van I',
        student: 'Vu Minh Chau',
        subject: 'Âm nhạc',
        amount: 85,
        status: 'Hoàn tiền',
        date: '09/12/2025',
      },
      {
        id: '#TX-98430',
        tutor: 'Vo Thi J',
        student: 'Dang Gia Han',
        subject: 'Toán',
        amount: 150,
        status: 'Đã thanh toán',
        date: '10/12/2025',
      },
    ],
    [],
  );

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedTransactions = useMemo(
    () => transactions.slice(start, end),
    [transactions, start, end],
  );

  const totalPages = Math.ceil(transactions.length / pageSize);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value * 1000);

  const subjectColors = ['#2563EB', '#38BDF8', '#22C55E', '#FACC15', '#A855F7', '#0EA5E9'];

  const statusClass = (status) => {
    if (status === 'Đã thanh toán') return styles.statusPaid;
    if (status === 'Đang chờ') return styles.statusPending;
    return styles.statusRefunded;
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
        <div className={styles.headerBadge}>Cập nhật: 10/12/2025</div>
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
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Doanh thu theo môn</h3>
            <span className={styles.badgeAlt}>30 ngày gần nhất</span>
          </div>
          <div className={styles.chartWrapper}>
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
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
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
              {pagedTransactions.map((tx) => (
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