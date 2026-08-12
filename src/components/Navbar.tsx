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

const STAGES: { id: StageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'INTRO', label: '1. Story Intro', icon: BookOpen },
  { id: 'PRIME_SELECTION', label: '2. Prime Hunt', icon: Key },
  { id: 'KEY_FORGE', label: '3. Key Forge', icon: Lock },
  { id: 'ENCRYPTION', label: '4. Bello Encrypts', icon: Unlock },
  { id: 'EVE_INTERCEPTION', label: '5. Paulson Intercepts', icon: ShieldAlert },
  { id: 'DECRYPTION', label: '6. Nii Decrypts', icon: Lock },
  { id: 'SANDBOX', label: '7. RSA Playground', icon: Compass },
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
    <header id="main-app-header" className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectStage('INTRO')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  RSA Visualizer
                </span>
                <span className="text-xs bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full font-medium">
                  GROUP 34
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Public Key Cryptography & RSA</p>
            </div>
          </div>

          {/* Active Keys Quick Status Pill */}
          {keys && (
            <div className="hidden lg:flex items-center space-x-3 bg-slate-800/80 border border-slate-700/70 rounded-full px-3 py-1 text-xs">
              <div className="flex items-center space-x-1.5 text-cyan-300">
                <span className="text-slate-400">Public:</span>
                <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">n={keys.n}</span>
                <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">e={keys.e}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center space-x-1.5 text-emerald-300">
                <span className="text-slate-400">Private:</span>
                <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">d={keys.d}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Achievements pill */}
            <div className="flex items-center space-x-1 text-xs bg-amber-950/40 border border-amber-800/50 text-amber-300 px-2.5 py-1.5 rounded-lg">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">{achievementsUnlockedCount}/6</span>
            </div>

            {/* AI Tutor Button */}
            <button
              id="ai-tutor-btn"
              onClick={onOpenTutor}
              className="relative inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="hidden sm:inline">Ask Prof. Cyber</span>
              <span className="sm:hidden">Tutor</span>
            </button>

            {/* Reset Button */}
            <button
              id="reset-story-btn"
              onClick={onReset}
              title="Reset Story & Numbers"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage / Chapter Navigation Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {STAGES.map((s) => {
            const Icon = s.icon;
            const isActive = currentStage === s.id;
            return (
              <button
                key={s.id}
                id={`nav-stage-${s.id.toLowerCase()}`}
                onClick={() => onSelectStage(s.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-500'}`} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
