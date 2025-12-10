
import React, { useState } from 'react';
import { type ContentType, type StructureItem } from '../types';
import { ChevronDownIcon, MagicWandIcon, LoadingSpinnerIcon } from './icons';

interface StructureDisplayProps {
  structure: StructureItem[];
  contentType: ContentType;
  onGenerateContent: (parentIndex: number, childIndex: number) => void;
  selectedItem: { parentIndex: number; childIndex: number } | null;
  isGeneratingContent: boolean;
}

const StructureDisplay: React.FC<StructureDisplayProps> = ({
  structure,
  contentType,
  onGenerateContent,
  selectedItem,
  isGeneratingContent
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const parentTerm = contentType === 'Course' ? 'Module' : 'Chapter';
  const childTerm = contentType === 'Course' ? 'Lesson' : 'Section';

  return (
    <div className="space-y-3">
      {structure.map((item, parentIdx) => (
        <div key={parentIdx} className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleAccordion(parentIdx)}
            className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="text-left">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{parentTerm} {parentIdx + 1}</span>
              <h3 className="font-bold text-slate-700">{item.title}</h3>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-slate-500 transform transition-transform ${openIndex === parentIdx ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === parentIdx && (
            <ul className="bg-white p-2">
              {item.children.map((childTitle, childIdx) => {
                const isSelected = selectedItem?.parentIndex === parentIdx && selectedItem?.childIndex === childIdx;
                const isLoadingThis = isSelected && isGeneratingContent;
                
                return (
                  <li
                    key={childIdx}
                    className={`flex justify-between items-center p-2 rounded-md transition-colors ${isSelected ? 'bg-blue-100' : 'hover:bg-slate-50'}`}
                  >
                    <span className="text-slate-600 text-sm md:text-base">{childTerm} {parentIdx + 1}.{childIdx + 1}: {childTitle}</span>
                    <button
                      onClick={() => onGenerateContent(parentIdx, childIdx)}
                      disabled={isGeneratingContent}
                      className="flex items-center text-sm font-semibold bg-blue-100 text-primary px-3 py-1 rounded-full hover:bg-blue-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoadingThis ? (
                        <LoadingSpinnerIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <MagicWandIcon className="w-4 h-4 mr-1" />
                      )}
                      <span>{isLoadingThis ? '...' : 'Generate'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default StructureDisplay;
