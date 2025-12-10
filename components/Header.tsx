
import React from 'react';
import { BrainCircuitIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 md:px-8 flex items-center">
        <BrainCircuitIcon className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-xl md:text-2xl font-bold text-slate-800">
          AI Course & E-book Creator
        </h1>
      </div>
    </header>
  );
};

export default Header;
