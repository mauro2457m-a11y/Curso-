
import React, { useState } from 'react';
import { type ContentType, type StructureItem } from './types';
import { generateStructure, generateDetailedContent } from './services/geminiService';
import Header from './components/Header';
import TopicForm from './components/TopicForm';
import StructureDisplay from './components/StructureDisplay';
import { LoadingSpinnerIcon, MagicWandIcon } from './components/icons';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType>('Course');
  const [structure, setStructure] = useState<StructureItem[] | null>(null);
  const [isLoadingStructure, setIsLoadingStructure] = useState<boolean>(false);
  
  const [selectedItem, setSelectedItem] = useState<{ parentIndex: number; childIndex: number } | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGeneratingContent, setIsGeneratingContent] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStructure = async (newTopic: string, newContentType: ContentType) => {
    setIsLoadingStructure(true);
    setTopic(newTopic);
    setContentType(newContentType);
    setError(null);
    setStructure(null);
    setSelectedItem(null);
    setGeneratedContent('');

    try {
      const result = await generateStructure(newTopic, newContentType);
      if (result && result.length > 0) {
        setStructure(result);
      } else {
        setError('The generated structure was empty. Please try a different topic or wording.');
      }
    } catch (err) {
      setError('An error occurred while generating the structure. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoadingStructure(false);
    }
  };

  const handleGenerateContent = async (parentIndex: number, childIndex: number) => {
    if (!structure) return;
    
    const parentItem = structure[parentIndex];
    const childItemTitle = parentItem.children[childIndex];
    
    setIsGeneratingContent(true);
    setSelectedItem({ parentIndex, childIndex });
    setGeneratedContent('');
    setError(null);
    
    try {
      const content = await generateDetailedContent(topic, contentType, parentItem.title, childItemTitle);
      setGeneratedContent(content);
    } catch (err) {
      setError('An error occurred while generating the content. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleReset = () => {
    setTopic('');
    setContentType('Course');
    setStructure(null);
    setIsLoadingStructure(false);
    setSelectedItem(null);
    setGeneratedContent('');
    setIsGeneratingContent(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {isLoadingStructure && (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-xl shadow-lg">
            <LoadingSpinnerIcon className="w-12 h-12 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-slate-700">Building Your Outline...</h2>
            <p className="mt-2 text-slate-500">The AI is crafting the perfect structure for your {contentType.toLowerCase()}.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button onClick={handleReset} className="ml-4 font-semibold text-red-800 hover:text-red-600">Try Again</button>
          </div>
        )}

        {!structure && !isLoadingStructure && (
          <TopicForm onSubmit={handleGenerateStructure} isLoading={isLoadingStructure} />
        )}
        
        {structure && !isLoadingStructure && (
          <div className="grid lg:grid-cols-2 lg:gap-8 xl:gap-12">
            {/* Left Column: Structure */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider">{contentType}</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 break-words">{topic}</h2>
                </div>
                <button 
                  onClick={handleReset} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                    Start Over
                </button>
              </div>
              <StructureDisplay
                structure={structure}
                contentType={contentType}
                onGenerateContent={handleGenerateContent}
                selectedItem={selectedItem}
                isGeneratingContent={isGeneratingContent}
              />
            </div>

            {/* Right Column: Content */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mt-8 lg:mt-0 min-h-[300px] lg:min-h-[500px] flex flex-col">
              {isGeneratingContent && (
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <LoadingSpinnerIcon className="w-10 h-10 text-primary" />
                  <p className="mt-4 font-semibold text-slate-600">Generating content...</p>
                </div>
              )}
              {!isGeneratingContent && generatedContent && selectedItem && (
                 <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1 text-slate-700">{structure[selectedItem.parentIndex].title}</h3>
                    <p className="text-md font-semibold text-primary mb-4">{structure[selectedItem.parentIndex].children[selectedItem.childIndex]}</p>
                    <div 
                        className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-800 prose-strong:text-slate-700" 
                        dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br />') }} 
                    />
                 </div>
              )}
               {!isGeneratingContent && !generatedContent && (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500">
                    <MagicWandIcon className="w-16 h-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-600">Content will appear here</h3>
                    <p className="mt-1">Select a {contentType === 'Course' ? 'lesson' : 'section'} to generate its content.</p>
                </div>
               )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
