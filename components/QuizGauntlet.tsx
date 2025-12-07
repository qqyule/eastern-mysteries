import React, { useState } from 'react';
import { Question, Difficulty } from '../types';
import { Feather, Sword, Ghost, CheckCircle2, XCircle } from 'lucide-react';

interface QuizGauntletProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
}

const QuizGauntlet: React.FC<QuizGauntletProps> = ({ question, questionNumber, totalQuestions, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (isSubmitting) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitting) return;
    
    setIsSubmitting(true);
    const isCorrect = selectedOption === question.correctOptionId;

    if (isCorrect) {
      setTimeout(() => {
        onAnswer(true);
        setSelectedOption(null);
        setIsSubmitting(false);
      }, 800);
    } else {
      setShake(true);
      setTimeout(() => {
        onAnswer(false); // Game over immediately
      }, 1000);
    }
  };

  const getDifficultyIcon = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.EASY: return <Feather className="w-5 h-5 mr-2" />;
      case Difficulty.MEDIUM: return <Sword className="w-5 h-5 mr-2" />;
      case Difficulty.HARD: return <Ghost className="w-5 h-5 mr-2" />;
      default: return null;
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.EASY: return "text-emerald-400";
      case Difficulty.MEDIUM: return "text-amber-400";
      case Difficulty.HARD: return "text-rose-500";
      default: return "text-stone-400";
    }
  };

  const getDifficultyLabel = (diff: Difficulty) => {
    switch(diff) {
      case Difficulty.EASY: return "Novice • Feather Weight";
      case Difficulty.MEDIUM: return "Adept • Blade Edge";
      case Difficulty.HARD: return "Master • Spirit Realm";
      default: return "";
    }
  };

  return (
    <div className={`max-w-xl mx-auto p-4 w-full flex flex-col justify-center min-h-[60vh] ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      
      {/* Progress Header */}
      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div className="flex space-x-3">
          {[...Array(totalQuestions)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 w-12 rounded-none skew-x-[-12deg] transition-all duration-500 ${
                i < questionNumber - 1 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                i === questionNumber - 1 ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-y-125' : 'bg-stone-800'
              }`}
            />
          ))}
        </div>
        <div className={`flex items-center text-xs font-bold uppercase tracking-widest ${getDifficultyColor(question.difficulty)}`}>
          {getDifficultyIcon(question.difficulty)}
          {getDifficultyLabel(question.difficulty)}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-stone-900/80 backdrop-blur-md border border-amber-900/30 p-8 rounded-sm shadow-2xl mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
        <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
            {question.difficulty === Difficulty.HARD ? <Ghost size={200} /> : <Sword size={200} />}
        </div>
        <h3 className="text-xl md:text-2xl font-serif-sc font-medium text-stone-100 leading-relaxed relative z-10 drop-shadow-md">
          {question.text}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {question.options.map((option) => {
          let stateStyles = "bg-stone-900/60 border-stone-800 hover:border-amber-700/50 hover:bg-stone-800/80";
          let iconStyles = "border-stone-700 text-stone-500 group-hover:border-amber-700 group-hover:text-amber-500";
          
          if (selectedOption === option.id) {
            stateStyles = "bg-amber-950/40 border-amber-600/80 ring-1 ring-amber-600/50";
            iconStyles = "border-amber-500 bg-amber-500 text-stone-900";
          }
          
          if (isSubmitting && selectedOption === option.id) {
             if (option.id === question.correctOptionId) {
                stateStyles = "bg-emerald-950/60 border-emerald-500/80 text-emerald-100";
                iconStyles = "border-emerald-500 bg-emerald-500 text-stone-900";
             } else {
                stateStyles = "bg-rose-950/60 border-rose-500/80 text-rose-100";
                iconStyles = "border-rose-500 bg-rose-500 text-stone-900";
             }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isSubmitting}
              className={`w-full text-left p-4 md:p-5 rounded-sm border transition-all duration-200 flex items-center group relative overflow-hidden ${stateStyles}`}
            >
              <div className={`w-8 h-8 rounded-none flex items-center justify-center mr-5 font-bold font-display text-sm border transition-colors relative z-10 ${iconStyles}`}>
                {option.id}
              </div>
              <span className="text-lg font-serif-sc relative z-10">{option.text}</span>
              
              {/* Status Icon */}
              {isSubmitting && selectedOption === option.id && (
                  <div className="ml-auto relative z-10">
                      {option.id === question.correctOptionId ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-rose-500" />}
                  </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit Button (Only visible when selected) */}
      <div className="mt-8 h-16 flex items-center justify-center">
        {selectedOption && !isSubmitting && (
          <button
            onClick={handleSubmit}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-sm shadow-[0_0_20px_rgba(180,83,9,0.4)] transform transition hover:-translate-y-1 font-display tracking-wider border border-amber-500/50"
          >
            CONFIRM CHOICE
          </button>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default QuizGauntlet;
