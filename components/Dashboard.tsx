
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { date: 'Mon', sales: 4000, spend: 2400 },
  { date: 'Tue', sales: 3000, spend: 1398 },
  { date: 'Wed', sales: 2000, spend: 9800 },
  { date: 'Thu', sales: 2780, spend: 3908 },
  { date: 'Fri', sales: 1890, spend: 4800 },
  { date: 'Sat', sales: 2390, spend: 3800 },
  { date: 'Sun', sales: 3490, spend: 4300 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Business Overview</h1>
        <p className="text-slate-500">Welcome back, Sarah. Here's what's happening with your FBA store today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Sales', value: '$45,290', change: '+12.5%', color: 'text-green-600' },
          { label: 'Ad Spend', value: '$8,432', change: '-4.3%', color: 'text-indigo-600' },
          { label: 'Avg ROAS', value: '5.3x', change: '+0.8%', color: 'text-green-600' },
          { label: 'Units Sold', value: '1,204', change: '+18.2%', color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sales vs Ad Spend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="spend" stroke="#94a3b8" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent AI Assets</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <img src={`https://picsum.photos/seed/${item}/100/100`} className="w-12 h-12 rounded-lg object-cover" alt="Asset" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-700 text-sm">Main Gallery Image - Mosquito Lamp</p>
                  <p className="text-xs text-slate-500">Generated 2 hours ago • High Res 2K</p>
                </div>
                <button className="text-indigo-600 font-medium text-sm">Download</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
