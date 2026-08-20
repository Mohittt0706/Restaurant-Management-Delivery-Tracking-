import React from 'react';
import { User } from 'lucide-react';

export default function Topbar({ title }) {
  return (
    <header className="h-20 bg-cult-espresso border-b border-cult-bronze px-8 flex items-center justify-between sticky top-0 z-30 ml-64">
      {/* Dynamic Title */}
      <div>
        <h1 className="font-heading text-2xl text-cult-cream tracking-wide">
          {title}
        </h1>
        <p className="text-xs font-body text-cult-warmgray">
          Manager Control Panel
        </p>
      </div>

      {/* Static Profile Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-body font-medium text-cult-cream uppercase tracking-wider">
            Restaurant Manager
          </p>
          <p className="text-[10px] font-mono text-cult-warmgray">
            CULT Headquarters
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-cult-charcoal border border-cult-bronze flex items-center justify-center text-cult-ember shadow-md">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
