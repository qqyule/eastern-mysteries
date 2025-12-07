import React, { useEffect, useState } from 'react';
import { GameStatus } from '../types';
import { Clock, RefreshCcw } from 'lucide-react';

interface ResultViewProps {
  status: GameStatus;
  pointsEarned: number;
}

const ResultView: React.FC<ResultViewProps> = ({ status, pointsEarned }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();
    return () => clearInterval(timer);
  }, []);

  const isWin = status === GameStatus.WON;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 animate-in zoom-in duration-700 text-center relative">
      
      {/* Result Card */}
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-lg overflow-hidden shadow-2xl relative">
        
        {/* Top Image */}
        <div className="h-48 w-full relative">
           <div className={`absolute inset-0 ${isWin ? 'bg-amber-500/20' : 'bg-stone-900/50'} z-10`}></div>
           <img 
             src={isWin 
               ? "https://images.unsplash.com/photo-1610459846879-880c946e60b9?q=80&w=1000&auto=format&fit=crop" // Lanterns/Celebration
               : "https://images.unsplash.com/photo-1494587351196-bbf5f29cff42?q=80&w=1000&auto=format&fit=crop" // Dark Forest
             } 
             alt="Result Status" 
             className={`w-full h-full object-cover ${isWin ? 'grayscale-0' : 'grayscale contrast-125'}`}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-20"></div>
           
           <div className="absolute bottom-4 left-0 w-full text-center z-30">
              <h2 className={`text-3xl font-display font-bold ${isWin ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]' : 'text-stone-400'}`}>
                {isWin ? 'DESTINY FULFILLED' : 'LOST IN THE MIST'}
              </h2>
           </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
            <p className="text-stone-400 font-serif-sc text-lg mb-8 leading-relaxed">
              {isWin 
                ? "The dragon nods in approval. Your wisdom pierces the veil of mystery." 
                : "The path remains shrouded. The spirits are silent. Meditate and return tomorrow."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 border rounded-sm flex flex-col items-center ${isWin ? 'border-amber-900/50 bg-amber-950/20' : 'border-stone-800 bg-stone-900'}`}>
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Fortune</span>
                    <span className={`text-2xl font-bold ${isWin ? 'text-amber-500' : 'text-stone-600'}`}>
                    {isWin ? `+${pointsEarned}` : '0'}
                    </span>
                    <span className="text-xs text-stone-600">points</span>
                </div>
                <div className="p-4 border border-stone-800 bg-stone-900 rounded-sm flex flex-col items-center">
                    <span className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Status</span>
                    <span className={`text-xl font-bold ${isWin ? 'text-emerald-500' : 'text-rose-700'}`}>
                    {isWin ? 'VICTORY' : 'DEFEAT'}
                    </span>
                </div>
            </div>
            
            <div className="border-t border-stone-800 pt-6">
              <div className="flex flex-col items-center">
                <span className="text-stone-600 text-xs uppercase tracking-[0.2em] mb-3 flex items-center">
                  <Clock className="w-3 h-3 mr-2" /> Scrolls Unseal In
                </span>
                <span className="text-4xl font-mono text-stone-200 tracking-wider text-shadow-glow">
                  {timeLeft}
                </span>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
