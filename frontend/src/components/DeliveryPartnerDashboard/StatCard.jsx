import React from 'react';

export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-cult-espresso border border-cult-bronze p-6 rounded-sm space-y-3 hover:border-cult-ember/40 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-body tracking-widest text-cult-warmgray font-medium">
          {label}
        </span>
        {Icon && (
          <div className="p-2 rounded bg-cult-charcoal border border-cult-bronze text-cult-ember">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <p className="font-display text-4xl text-cult-cream tracking-wider font-bold">
        {value}
      </p>
    </div>
  );
}
