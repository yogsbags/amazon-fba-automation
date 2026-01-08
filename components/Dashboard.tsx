
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

const data = [
  { date: 'Oct 01', sales: 4000, spend: 2400, sessions: 1200, conv: 12.5, rank: 14, reviews: 2 },
  { date: 'Oct 08', sales: 5200, spend: 1800, sessions: 1500, conv: 14.1, rank: 11, reviews: 4 },
  { date: 'Oct 15', sales: 4800, spend: 2600, sessions: 1400, conv: 11.8, rank: 12, reviews: 3 },
  { date: 'Oct 22', sales: 7100, spend: 2100, sessions: 1900, conv: 15.2, rank: 8, reviews: 8 },
  { date: 'Oct 29', sales: 6200, spend: 1900, sessions: 1700, conv: 13.8, rank: 9, reviews: 5 },
  { date: 'Nov 05', sales: 8400, spend: 2300, sessions: 2200, conv: 16.4, rank: 6, reviews: 12 },
  { date: 'Nov 12', sales: 9800, spend: 2500, sessions: 2500, conv: 17.5, rank: 4, reviews: 15 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="sticky top-0 z-40 py-6 mb-4 bg-slate-50/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise BI Hub</h1>
          <p className="text-slate-500 mt-1 font-medium">Weekly Conversion, Session Logic, and Organic Rank Tracking.</p>
        </div>
        <div className="flex gap-3">
           <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             Full Business Audit
           </button>
           <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
             Live Experiment
           </button>
        </div>
      </header>

      {/* Checklist-driven stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Weekly Conv. Rate', value: '17.5%', change: '+3.4%', trend: 'up', icon: '⚡', subtitle: 'Unit Session %' },
          { label: 'Organic Rank (Avg)', value: '#4.2', change: '-2 Pos', trend: 'up', icon: '🎯', subtitle: 'Target Keywords' },
          { label: 'Review Velocity', value: '15/wk', change: '+22%', trend: 'up', icon: '⭐', subtitle: '7-Day Momentum' },
          { label: 'Refund Rate', value: '1.2%', change: 'Low', trend: 'neutral', icon: '📦', subtitle: 'Health Check' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover-lift group">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</div>
               <span className={`text-xs font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-indigo-500' : 'text-slate-400'}`}>
                 {stat.change}
               </span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <div className="mt-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase mt-1 tracking-widest">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
           {/* Sessions vs Conv Rate Chart */}
           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Traffic Efficiency (Sessions vs Conv)</h3>
                  <p className="text-sm text-slate-400 font-medium">Are your sessions actually converting?</p>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={15} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#indigo-600', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area yAxisId="left" type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={3} fill="url(#sessionGrad)" />
                    <Line yAxisId="right" type="monotone" dataKey="conv" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Organic Rank vs Spend */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Organic Rank Velocity</h4>
                 <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={data}>
                          <Line type="stepAfter" dataKey="rank" stroke="#f59e0b" strokeWidth={4} dot={false} />
                          <YAxis reversed domain={[1, 20]} hide />
                          <Tooltip />
                       </LineChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 text-center mt-4">Top 5 keywords average position (Descending is good)</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Review Accumulation</h4>
                 <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={data}>
                          <Bar dataKey="reviews" fill="#6366f1" radius={[10, 10, 0, 0]} />
                          <Tooltip />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 text-center mt-4">Verified purchases converted to feedback</p>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Refund Analysis Card */}
           <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-red-900 tracking-tight italic">Refund Root Analysis</h3>
                <span className="text-[10px] font-black text-red-600 uppercase bg-white px-2 py-1 rounded-lg border border-red-100">Critical</span>
              </div>
              <div className="space-y-4">
                 {[
                   { reason: 'Size too small', count: 12, impact: '-$240' },
                   { reason: 'Damaged in transit', count: 4, impact: '-$80' },
                   { reason: 'Does not match photos', count: 2, impact: '-$40' }
                 ].map((ref, i) => (
                   <div key={i} className="bg-white p-4 rounded-2xl border border-red-50 flex justify-between items-center">
                      <div>
                         <p className="text-xs font-black text-slate-900">{ref.reason}</p>
                         <p className="text-[10px] font-bold text-slate-400">{ref.count} instances this week</p>
                      </div>
                      <span className="text-xs font-black text-red-500">{ref.impact}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">
                Update Visuals to Reduce Returns
              </button>
           </div>

           {/* A/B Test Results Widget */}
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12 group-hover:rotate-0 transition-transform">🧪</div>
              <h3 className="text-lg font-black tracking-tight mb-6">Live Asset Experiment</h3>
              
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden border border-white/20">
                       <img src="https://picsum.photos/seed/testA/100/100" className="w-full h-full object-cover" alt="A" />
                       <div className="bg-indigo-600 text-[8px] font-black text-center py-0.5">Test A</div>
                    </div>
                    <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden border border-white/20">
                       <img src="https://picsum.photos/seed/testB/100/100" className="w-full h-full object-cover" alt="B" />
                       <div className="bg-emerald-500 text-[8px] font-black text-center py-0.5">Test B</div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                       <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Leading: B</p>
                       <p className="text-2xl font-black text-white">+12.4% <span className="text-[10px] text-slate-400">CTR</span></p>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Neural Prediction</p>
                    <p className="text-xs font-medium text-slate-200 leading-relaxed italic">"B's infographic focus on 'BPA Free' is resonating better with the current EU market demographic."</p>
                 </div>

                 <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                    Apply Winner B Globally
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
