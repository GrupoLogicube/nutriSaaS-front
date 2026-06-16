import React from 'react';

const Card = ({ children, title, icon: Icon, className = "" }) => (
  <div className={`bg-white dark:bg-[#0a1128] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden mb-6 ${className}`}>
    {title && (
      <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        {Icon && <Icon size={20} className="text-sky-600" />}
        <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default Card;