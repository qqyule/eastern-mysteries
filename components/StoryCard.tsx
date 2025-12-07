import React from 'react';
import { Scroll, BookOpen, Wind } from 'lucide-react';

interface StoryCardProps {
  title: string;
  lunarDate: string;
  content: string;
  onStart: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ title, lunarDate, content, onStart }) => {
  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative bg-[#f7f5eb] text-stone-900 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col border-y-8 border-double border-amber-900">
        
        {/* Decorative Corner Borders */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-800 z-20"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-800 z-20"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-800 z-20"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-800 z-20"></div>

        {/* Hero Image Header */}
        <div className="relative h-48 md:h-64 overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1515169273894-7e876dcf13da?q=80&w=1000&auto=format&fit=crop" 
             alt="Chinese Architecture" 
             className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-amber-900 via-transparent to-transparent opacity-90"></div>
           <div className="absolute bottom-0 left-0 w-full p-6 text-center">
             <div className="inline-block px-3 py-1 mb-2 border border-amber-400/30 bg-black/40 backdrop-blur-sm rounded-full">
                <h2 className="text-xs font-serif tracking-[0.2em] uppercase text-amber-200">{lunarDate}</h2>
             </div>
             <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight text-amber-50 drop-shadow-lg">{title}</h1>
           </div>
        </div>

        {/* Content */}
        <div className="relative px-8 py-8 flex-1 overflow-y-auto story-scroll max-h-[50vh] bg-[#f7f5eb]">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]"></div>
          
          <div className="relative z-10">
             <div className="flex justify-center mb-6 text-amber-800/20">
               <Wind className="w-8 h-8 mx-2" />
               <Wind className="w-8 h-8 mx-2 scale-x-[-1]" />
             </div>
             <div className="prose prose-stone prose-lg mx-auto font-serif-sc leading-loose text-stone-800 text-justify">
              <p className="first-letter:text-6xl first-letter:font-display first-letter:text-amber-900 first-letter:mr-3 first-letter:float-left first-letter:font-bold">
                {content}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-[#eae6d8] border-t border-stone-300/50 text-center relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-amber-50 transition-all duration-300 bg-stone-900 font-display hover:bg-amber-900 shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full md:w-auto"
          >
            <span className="absolute inset-0 w-full h-full border border-amber-500/20 transform scale-[0.98] transition-transform group-hover:scale-100"></span>
            <BookOpen className="w-5 h-5 mr-3 text-amber-500 group-hover:text-amber-200 transition-colors" />
            <span className="tracking-widest">ENTER THE GAUNTLET</span>
          </button>
          <p className="mt-4 text-[10px] text-stone-500 uppercase tracking-[0.3em]">
            Fate offers but one chance
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
