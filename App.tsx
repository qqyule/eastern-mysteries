import React, { useState, useEffect } from 'react';
import { AppState, GameStatus, UserStats, DailyPuzzle } from './types';
import { generateDailyPuzzle } from './services/geminiService';
import StoryCard from './components/StoryCard';
import QuizGauntlet from './components/QuizGauntlet';
import ResultView from './components/ResultView';
import ProfileStats from './components/ProfileStats';
import { User, Book, Loader2, Mountain, CloudFog } from 'lucide-react';

// Key for LocalStorage
const STORAGE_KEY = 'eastern_mysteries_app_v1';

const INITIAL_STATS: UserStats = {
  totalPoints: 0,
  currentStreak: 0,
  lastPlayedDate: null,
  playHistory: []
};

const App: React.FC = () => {
  const [view, setView] = useState<'GAME' | 'PROFILE'>('GAME');
  const [state, setState] = useState<AppState>({
    status: GameStatus.LOADING,
    dailyPuzzle: null,
    userStats: INITIAL_STATS,
    currentQuestionIndex: 0
  });

  // Load User Data & Determine Daily State
  useEffect(() => {
    const loadApp = async () => {
      // 1. Load LocalStorage
      const savedData = localStorage.getItem(STORAGE_KEY);
      let loadedStats = INITIAL_STATS;
      if (savedData) {
        loadedStats = JSON.parse(savedData);
      }

      // 2. Check Date
      const today = new Date().toISOString().split('T')[0];
      const hasPlayedToday = loadedStats.lastPlayedDate === today;

      // 3. Fetch Puzzle
      // Optimization: Cache puzzle in LS to avoid API spam on refresh.
      let puzzle: DailyPuzzle | null = null;
      const cachedPuzzleStr = localStorage.getItem(`em_puzzle_${today}`);
      
      if (cachedPuzzleStr) {
        puzzle = JSON.parse(cachedPuzzleStr);
      } else {
        puzzle = await generateDailyPuzzle();
        localStorage.setItem(`em_puzzle_${today}`, JSON.stringify(puzzle));
      }

      // 4. Set Initial State
      setState(prev => ({
        ...prev,
        dailyPuzzle: puzzle,
        userStats: loadedStats,
        status: hasPlayedToday ? GameStatus.ALREADY_PLAYED : GameStatus.READING
      }));
    };

    loadApp();
  }, []);

  const saveStats = (newStats: UserStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setState(prev => ({ ...prev, userStats: newStats }));
  };

  const handleStartQuiz = () => {
    setState(prev => ({ ...prev, status: GameStatus.QUIZ, currentQuestionIndex: 0 }));
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!isCorrect) {
      // Wrong Answer Logic
      const newStats: UserStats = {
        ...state.userStats,
        currentStreak: 0, // Reset Streak
        lastPlayedDate: new Date().toISOString().split('T')[0],
        playHistory: [
          ...state.userStats.playHistory,
          { date: new Date().toISOString().split('T')[0], result: 'LOST', points: 0 }
        ]
      };
      saveStats(newStats);
      setState(prev => ({ ...prev, status: GameStatus.LOST }));
    } else {
      // Correct Answer Logic
      const nextIndex = state.currentQuestionIndex + 1;
      const totalQs = state.dailyPuzzle?.questions.length || 3;

      if (nextIndex >= totalQs) {
        // WIN GAME
        const newStats: UserStats = {
          ...state.userStats,
          totalPoints: state.userStats.totalPoints + 100,
          currentStreak: state.userStats.currentStreak + 1,
          lastPlayedDate: new Date().toISOString().split('T')[0],
          playHistory: [
            ...state.userStats.playHistory,
            { date: new Date().toISOString().split('T')[0], result: 'WON', points: 100 }
          ]
        };
        saveStats(newStats);
        setState(prev => ({ ...prev, status: GameStatus.WON }));
      } else {
        // NEXT QUESTION
        setState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
      }
    }
  };

  // --- Render Logic ---

  if (state.status === GameStatus.LOADING) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-400 relative overflow-hidden">
         {/* Loading Background */}
         <div className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1516570161688-662768d0cc46?q=80&w=1920&auto=format&fit=crop" 
               alt="Loading Background" 
               className="w-full h-full object-cover opacity-20 blur-sm"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent"></div>
         </div>
        <div className="z-10 flex flex-col items-center">
            <Loader2 className="w-16 h-16 animate-spin text-amber-700 mb-6" />
            <p className="font-display text-xl tracking-[0.2em] text-amber-500/80 animate-pulse">DIVINING THE FUTURE</p>
            <p className="font-serif-sc text-sm mt-2 opacity-60">Consulting the Oracle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans relative selection:bg-amber-900 selection:text-amber-50">
      
      {/* Global Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop" 
          alt="Misty Mountains" 
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/70 to-stone-950/90 mix-blend-multiply"></div>
        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      </div>

      {/* Navbar */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 bg-stone-950/80 backdrop-blur-md z-50 shadow-2xl">
        <div className="flex items-center text-amber-500/90 font-display font-bold text-xl tracking-wide group cursor-default">
          <span className="mr-3 text-3xl group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">🏮</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-600">EASTERN MYSTERIES</span>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setView('GAME')} 
            className={`p-3 rounded-full transition-all duration-300 border ${view === 'GAME' ? 'bg-amber-950/50 border-amber-600/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-transparent text-stone-500 hover:text-stone-300 hover:bg-white/5'}`}
          >
            <Book size={20} />
          </button>
          <button 
            onClick={() => setView('PROFILE')} 
            className={`p-3 rounded-full transition-all duration-300 border ${view === 'PROFILE' ? 'bg-amber-950/50 border-amber-600/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-transparent text-stone-500 hover:text-stone-300 hover:bg-white/5'}`}
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 overflow-hidden relative z-10 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full h-full">
          
          {/* View: Profile */}
          {view === 'PROFILE' && (
            <ProfileStats stats={state.userStats} />
          )}

          {/* View: Game */}
          {view === 'GAME' && (
            <>
              {/* Scenario 1: Already Played Today (Win or Loss stored from previous session) */}
              {state.status === GameStatus.ALREADY_PLAYED && state.userStats.playHistory.length > 0 && (
                <ResultView 
                   status={state.userStats.playHistory[state.userStats.playHistory.length - 1].result === 'WON' ? GameStatus.WON : GameStatus.LOST} 
                   pointsEarned={state.userStats.playHistory[state.userStats.playHistory.length - 1].points} 
                />
              )}

              {/* Scenario 2: Reading the Story */}
              {state.status === GameStatus.READING && state.dailyPuzzle && (
                <StoryCard 
                  title={state.dailyPuzzle.title}
                  lunarDate={state.dailyPuzzle.lunarDate}
                  content={state.dailyPuzzle.story}
                  onStart={handleStartQuiz}
                />
              )}

              {/* Scenario 3: Taking the Quiz */}
              {state.status === GameStatus.QUIZ && state.dailyPuzzle && (
                <QuizGauntlet 
                  question={state.dailyPuzzle.questions[state.currentQuestionIndex]}
                  questionNumber={state.currentQuestionIndex + 1}
                  totalQuestions={state.dailyPuzzle.questions.length}
                  onAnswer={handleAnswer}
                />
              )}

              {/* Scenario 4: Just finished (Won/Lost) this session */}
              {(state.status === GameStatus.WON || state.status === GameStatus.LOST) && (
                <ResultView 
                  status={state.status} 
                  pointsEarned={state.status === GameStatus.WON ? 100 : 0} 
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;