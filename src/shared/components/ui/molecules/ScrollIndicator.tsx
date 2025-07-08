import React from 'react';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center text-white/80 select-none">
      <span className="text-sm font-medium mb-2 tracking-wider uppercase">
        Desplázate para ver más
      </span>
      <div className="animate-bounce-pulse">
        <ChevronDown size={24} className="stroke-2" />
      </div>
    </div>
  );
}
