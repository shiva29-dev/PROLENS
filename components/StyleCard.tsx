import React from 'react';
import { StyleOption } from '../types';

interface StyleCardProps {
  styleOption: StyleOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const StyleCard: React.FC<StyleCardProps> = ({ styleOption, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(styleOption.id)}
      className={`
        cursor-pointer relative overflow-hidden rounded-xl p-5
        transition-all duration-300 ease-out
        border border-white/5
        flex flex-col gap-3
        ${
          isSelected
            ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/50'
            : 'bg-slate-900/40 hover:bg-slate-800/60 hover:border-white/10'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
            p-2 rounded-lg transition-colors duration-300
            ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}
        `}>
           <span className="text-lg">{styleOption.icon}</span>
        </div>
        <h4 className={`font-medium ${isSelected ? 'text-amber-100' : 'text-slate-200'}`}>
            {styleOption.name}
        </h4>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">
        {styleOption.description}
      </p>

      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent pointer-events-none -mr-8 -mt-8 rounded-full blur-xl"></div>
      )}
    </div>
  );
};
