import React from 'react';
import { StageId, RSAKeys } from '../types';
import { 
  Key, 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Compass, 
  Sparkles, 
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';

interface NavbarProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
  keys: RSAKeys | null;
  onOpenTutor: () => void;
  onReset: () => void;
  achievementsUnlockedCount: number;
}

const STAGES: { id: StageId; num: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'INTRO', num: '1', label: 'Story Intro', icon: BookOpen },
  { id: 'PRIME_SELECTION', num: '2', label: 'Prime Hunt', icon: Key },
  { id: 'KEY_FORGE', num: '3', label: 'Key Forge', icon: Lock },
  { id: 'ENCRYPTION', num: '4', label: 'Bello Encrypts', icon: Unlock },
  { id: 'EVE_INTERCEPTION', num: '5', label: 'Paulson Intercepts', icon: ShieldAlert },
  { id: 'DECRYPTION', num: '6', label: 'Nii Decrypts', icon: Lock },
  { id: 'SANDBOX', num: '7', label: 'RSA Playground', icon: Compass },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  keys,
  onOpenTutor,
  onReset,
  achievementsUnlockedCount,
}) => {
  return (
    <header id="main-app-header" className="bg-slate-900 border-b-4 border-blue-600 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onSelectStage('INTRO')}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md group-hover:bg-blue-500 transition-colors">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  RSA Visualizer
                </span>
                <span className="text-[11px] bg-blue-950 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded-full font-bold">
                  GROUP 34
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block font-medium">Public Key Cryptography Interactive Visualizer</p>
            </div>
          </div>

          {/* Active Keys Quick Status Pill */}
          {keys && (
            <div className="hidden lg:flex items-center space-x-3 bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-1.5 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-blue-300">
                <span className="text-slate-400 font-sans font-semibold">Public PU:</span>
                <span className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-blue-900 font-bold">{`{e:${keys.e}, n:${keys.n}}`}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center space-x-1.5 text-rose-300">
                <span className="text-slate-400 font-sans font-semibold">Private PR:</span>
                <span className="bg-slate-800 text-rose-300 px-1.5 py-0.5 rounded border border-rose-900 font-bold">{`{d:${keys.d}, n:${keys.n}}`}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Achievements pill */}
            <div className="flex items-center space-x-1 text-xs bg-amber-950/50 border border-amber-800/80 text-amber-300 px-2.5 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-bold">{achievementsUnlockedCount}/7</span>
            </div>

            {/* AI Tutor Button - High Visibility Yellow Accent like textbook visualizer */}
            <button
              id="ai-tutor-btn"
              onClick={onOpenTutor}
              className="inline-flex items-center space-x-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-lg shadow transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Ask Prof. Cyber</span>
              <span className="sm:hidden">Tutor</span>
            </button>

            {/* Reset Button */}
            <button
              id="reset-story-btn"
              onClick={onReset}
              title="Reset to textbook defaults"
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage / Chapter Navigation Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800">
          {STAGES.map((s) => {
            const Icon = s.icon;
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                id={`nav-stage-${s.id.toLowerCase()}`}
                onClick={() => onSelectStage(s.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300 font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                  isActive ? 'bg-white text-blue-700' : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
