
import React, { useState } from 'react';
import { type ContentType } from '../types';
import { BookOpenIcon, PresentationChartLineIcon } from './icons';

interface TopicFormProps {
  onSubmit: (topic: string, contentType: ContentType) => void;
  isLoading: boolean;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('Course');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onSubmit(topic.trim(), contentType);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-800">
        What do you want to create?
      </h2>
      <p className="text-center text-slate-500 mt-2">
        Enter a topic and choose a format. Our AI will generate a structured outline for you.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Introduction to Quantum Computing"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-focus focus:border-primary-focus transition"
            required
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Format
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setContentType('Course')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        contentType === 'Course' ? 'bg-blue-100 border-primary text-primary ring-2 ring-primary' : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                >
                    <PresentationChartLineIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">Course</span>
                </button>
                <button
                    type="button"
                    onClick={() => setContentType('E-book')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        contentType === 'E-book' ? 'bg-blue-100 border-primary text-primary ring-2 ring-primary' : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                >
                    <BookOpenIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">E-book</span>
                </button>
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate Outline'}
        </button>
      </form>
    </div>
  );
};

export default TopicForm;
