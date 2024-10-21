import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountStatementForm from '../components/AccountStatementForm';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    totalLandlords: 0,
    totalProperties: 0,
    occupiedProperties: 0,
    vacantProperties: 0,
    totalRent: 0,
    latePayments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/report', {
        headers: { Authorization: token }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const chartData = {
    labels: ['Total Properties', 'Occupied', 'Vacant'],
    datasets: [
      {
        label: 'Property Statistics',
        data: [stats.totalProperties, stats.occupiedProperties, stats.vacantProperties],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Property Overview',
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tenants" value={stats.totalTenants} />
        <StatCard title="Total Landlords" value={stats.totalLandlords} />
        <StatCard title="Total Rent" value={`$${stats.totalRent.toFixed(2)}`} />
        <StatCard title="Late Payments" value={stats.latePayments} />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Property Overview</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Generate Account Statement</h2>
        <AccountStatementForm />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default Dashboard;