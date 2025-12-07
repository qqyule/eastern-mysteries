export enum Difficulty {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3,
}

export enum GameStatus {
  LOADING = 'LOADING',
  READING = 'READING',
  QUIZ = 'QUIZ',
  WON = 'WON',
  LOST = 'LOST',
  ALREADY_PLAYED = 'ALREADY_PLAYED',
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  difficulty: Difficulty;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface DailyPuzzle {
  id: string; // usually date string YYYY-MM-DD
  title: string;
  lunarDate: string;
  story: string;
  questions: Question[];
}

export interface UserStats {
  totalPoints: number;
  currentStreak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
  playHistory: { date: string; result: 'WON' | 'LOST'; points: number }[];
}

export interface AppState {
  status: GameStatus;
  dailyPuzzle: DailyPuzzle | null;
  userStats: UserStats;
  currentQuestionIndex: number;
}
