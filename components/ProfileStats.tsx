import React from 'react';
import { UserStats } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Scroll, Flame } from 'lucide-react';

interface ProfileStatsProps {
  stats: UserStats;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  // Prepare data for chart - last 7 entries
  const chartData = stats.playHistory.slice(-7).map(entry => ({
    name: entry.date.split('-').slice(1).join('/'),
    points: entry.points,
    result: entry.result
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-in slide-in-from-bottom duration-500">
      <h2 className="text-2xl font-display font-bold mb-6 text-stone-100 flex items-center">
        <Scroll className="mr-3 text-amber-600" />
        Scholar's Record
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 flex flex-col items-center justify-center">
           <span className="text-stone-400 text-sm uppercase tracking-widest mb-2">Total Wisdom</span>
           <span className="text-4xl font-bold text-amber-500">{stats.totalPoints}</span>
        </div>
        <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 flex flex-col items-center justify-center">
           <span className="text-stone-400 text-sm uppercase tracking-widest mb-2 flex items-center">
             <Flame className="w-4 h-4 mr-1 text-orange-500" /> Streak
           </span>
           <span className="text-4xl font-bold text-orange-500">{stats.currentStreak} Days</span>
        </div>
      </div>

      <div className="bg-stone-800 p-6 rounded-lg border border-stone-700 h-64">
        <h3 className="text-stone-400 text-sm uppercase tracking-widest mb-4">Recent History</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#78716c" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', color: '#f5f5f4' }}
              itemStyle={{ color: '#d97706' }}
            />
            <Bar dataKey="points" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.result === 'WON' ? '#d97706' : '#44403c'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfileStats;
