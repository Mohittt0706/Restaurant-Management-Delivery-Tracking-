import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export default function ReportChart({ title, data = [], type = 'bar', dataKey = 'value', nameKey = 'name' }) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-cult-espresso border border-cult-bronze p-6 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between border-b border-cult-bronze pb-3">
        <h3 className="font-heading text-sm uppercase tracking-wider text-cult-cream">
          {title}
        </h3>
        <span className="text-[10px] font-mono uppercase text-cult-warmgray">
          {hasData ? 'Live Data' : 'Empty State'}
        </span>
      </div>

      <div className="h-60 w-full flex items-center justify-center">
        {!hasData ? (
          <div className="text-center p-6 text-xs text-cult-warmgray/60 font-body italic border border-dashed border-cult-bronze/40 w-full h-full flex items-center justify-center">
            No data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A2E22" />
                <XAxis dataKey={nameKey} stroke="#A89E92" fontSize={11} />
                <YAxis stroke="#A89E92" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1512', borderColor: '#3A2E22', color: '#F5EFE6' }}
                  itemStyle={{ color: '#E8642C' }}
                />
                <Bar dataKey={dataKey} fill="#E8642C" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A2E22" />
                <XAxis dataKey={nameKey} stroke="#A89E92" fontSize={11} />
                <YAxis stroke="#A89E92" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1512', borderColor: '#3A2E22', color: '#F5EFE6' }}
                  itemStyle={{ color: '#E8642C' }}
                />
                <Line type="monotone" dataKey={dataKey} stroke="#E8642C" strokeWidth={2} dot={{ fill: '#C89B3C' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
