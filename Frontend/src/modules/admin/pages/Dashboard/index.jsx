import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiBriefcase, FiUsers, FiShoppingBag, FiDollarSign, FiActivity } from 'react-icons/fi';
import RevenueLineChart from '../../components/dashboard/RevenueLineChart';
import BookingsBarChart from '../../components/dashboard/BookingsBarChart';
import BookingStatusPieChart from '../../components/dashboard/BookingStatusPieChart';
import PaymentBreakdownPieChart from '../../components/dashboard/PaymentBreakdownPieChart';
import RevenueVsBookingsChart from '../../components/dashboard/RevenueVsBookingsChart';
import TimePeriodFilter from '../../components/dashboard/TimePeriodFilter';
import { formatCurrency } from '../../utils/adminHelpers';
import CustomerGrowthAreaChart from '../../components/dashboard/CustomerGrowthAreaChart';
import TopServices from '../../components/dashboard/TopServices';
import RecentBookings from '../../components/dashboard/RecentBookings';
import { getDashboardStats, getRevenueAnalytics } from '../../../../services/adminDashboardService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');
  const [revenueData, setRevenueData] = useState([]);
  const [recentBookingsList, setRecentBookingsList] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalWorkers: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Stats & Recent Bookings
        const statsRes = await getDashboardStats();
        if (statsRes.success) {
          const s = statsRes.data.stats;
          setStats({
            totalUsers: s.totalUsers,
            totalVendors: s.totalVendors,
            totalWorkers: s.totalWorkers,
            activeBookings: s.pendingBookings,
            completedBookings: s.completedBookings,
            totalRevenue: s.totalRevenue,
            todayRevenue: 0,
          });
          setRecentBookingsList(statsRes.data.recentBookings || []);
        }

        // 2. Fetch Revenue Analytics based on Period
        let apiPeriod = 'monthly';
        let startDate = new Date();
        const endDate = new Date().toISOString();

        if (period === 'year') {
          apiPeriod = 'monthly';
          startDate.setFullYear(startDate.getFullYear() - 1);
        } else if (period === 'week') {
          apiPeriod = 'daily';
          startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'month') {
          apiPeriod = 'daily';
          startDate.setDate(startDate.getDate() - 30);
        } else {
          apiPeriod = 'daily';
          startDate.setDate(startDate.getDate() - 1);
        }

        const revRes = await getRevenueAnalytics({
          period: apiPeriod,
          startDate: startDate.toISOString(),
          endDate
        });

        if (revRes.success) {
          const mapped = revRes.data.revenueData.map(item => ({
            date: item._id,
            revenue: item.revenue,
            orders: item.bookings
          }));
          mapped.sort((a, b) => new Date(a.date) - new Date(b.date));
          setRevenueData(mapped);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, [period]);

  const handleExportCsv = () => {
    try {
      const rows = revenueData.map((r) => ({
        date: r.date,
        bookings: r.orders,
        revenue: r.revenue,
      }));

      const headers = ['date', 'bookings', 'revenue'];
      const csv = [
        headers.join(','),
        ...rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin_dashboard_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('CSV export failed', e);
      alert('Export failed.');
    }
  };

  const onViewBooking = (booking) => {
    if (booking?._id || booking?.id) navigate(`/admin/bookings/${booking._id || booking.id}`);
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      change: 0,
      icon: FiDollarSign,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      cardBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Pending Bookings',
      value: (stats.activeBookings || 0).toLocaleString(),
      change: 0,
      icon: FiShoppingBag,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Completed Bookings',
      value: (stats.completedBookings || 0).toLocaleString(),
      change: 0,
      icon: FiActivity,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-purple-500 to-violet-600',
      cardBg: 'bg-gradient-to-br from-purple-50 to-violet-50',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Total Users',
      value: (stats.totalUsers || 0).toLocaleString(),
      change: 0,
      icon: FiUser,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-orange-500 to-amber-600',
      cardBg: 'bg-gradient-to-br from-orange-50 to-amber-50',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Total Vendors',
      value: (stats.totalVendors || 0).toLocaleString(),
      change: 0,
      icon: FiBriefcase,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      cardBg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Total Workers',
      value: (stats.totalWorkers || 0).toLocaleString(),
      change: 0,
      icon: FiUsers,
      color: 'text-white',
      bgColor: 'bg-gradient-to-br from-rose-500 to-pink-600',
      cardBg: 'bg-gradient-to-br from-rose-50 to-pink-50',
      iconBg: 'bg-white/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4">
        <div className="lg:hidden">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's your business overview.</p>
        </div>
        <div className="w-full">
          <TimePeriodFilter
            selectedPeriod={period}
            onPeriodChange={setPeriod}
            onExport={handleExportCsv}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = (card.change || 0) >= 0;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`${card.cardBg} rounded-xl p-4 sm:p-6 shadow-md border-2 border-transparent hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgColor} opacity-10 rounded-full -mr-16 -mt-16`} />

              <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                <div className={`${card.bgColor} ${card.iconBg} p-2 sm:p-3 rounded-lg shadow-md`}>
                  <Icon className={`${card.color} text-lg sm:text-xl`} />
                </div>
                {card.change !== 0 && (
                  <div
                    className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {isPositive ? '+' : ''}
                    {Math.abs(card.change || 0)}%
                  </div>
                )}
              </div>

              <div className="relative z-10">
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-gray-800 text-xl sm:text-2xl font-bold">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueLineChart data={revenueData} period={period} />
        <BookingsBarChart data={revenueData} period={period} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingStatusPieChart bookings={recentBookingsList} />
        <PaymentBreakdownPieChart bookings={recentBookingsList} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueVsBookingsChart data={revenueData} period={period} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CustomerGrowthAreaChart timelineData={revenueData} bookings={recentBookingsList} period={period} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopServices
          bookings={recentBookingsList}
          periodLabel="Top Booked Services (Recent)"
        />
        <RecentBookings bookings={recentBookingsList} onViewBooking={onViewBooking} />
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

