import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'react-hot-toast';
import adminReportService from '../../../../services/adminReportService';
import CardShell from '../UserCategories/components/CardShell';

const BookingReport = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await adminReportService.getBookingReport();
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error('Booking report error:', error);
      toast.error('Failed to load booking report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const COLORS = ['#2874F0', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <CardShell className="bg-white p-4">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <FiPieChart className="text-primary-600" />
            Booking Status Distribution
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data?.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        {/* Service Distribution */}
        <CardShell className="bg-white p-4">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-amber-600" />
            Bookings by Service
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.serviceDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="count" fill="#2874F0" radius={[4, 4, 0, 0]}>
                  {data?.serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        {/* Monthly Trends */}
        <CardShell className="bg-white lg:col-span-2 p-4">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <FiShoppingBag className="text-indigo-600" />
            Monthly Booking Trends
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" />
                <Bar dataKey="total" name="Total Bookings" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" name="Cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardShell>
      </div>
    </div>
  );
};

export default BookingReport;
