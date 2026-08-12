import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Clock } from 'lucide-react';

interface ModularClockVisualizerProps {
  modulus: number;
  base: number;
  exponent: number;
  highlightValue?: number;
  title?: string;
}

export const ModularClockVisualizer: React.FC<ModularClockVisualizerProps> = ({
  modulus,
  base,
  exponent,
  highlightValue,
  title = "Modular Clock Arithmetic Visualizer",
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Calculate step sequence: base^k % modulus for k = 0..exponent
  const steps: { k: number; val: number; rawPower: bigint }[] = [];
  let curVal = 1n;
  const b = BigInt(base);
  const m = BigInt(modulus || 1);

  for (let k = 0; k <= Math.min(exponent, 20); k++) {
    steps.push({
      k,
      val: Number(curVal),
      rawPower: BigInt(base) ** BigInt(k),
    });
    curVal = (curVal * b) % m;
  }

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [base, exponent, modulus]);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  const activeStepObj = steps[currentStep] || steps[0] || { k: 0, val: 0, rawPower: 0n };
  const currentValue = activeStepObj.val;

  // Render clock ticks around SVG
  const numTicks = Math.min(modulus, 36);
  const clockRadius = 110;
  const clockCenterX = 150;
  const clockCenterY = 150;

  // Hand angle calculation
  const handAngleDegrees = (currentValue / (modulus || 1)) * 360 - 90;
  const handAngleRad = (handAngleDegrees * Math.PI) / 180;
  const handLength = 80;
  const handX2 = clockCenterX + handLength * Math.cos(handAngleRad);
  const handY2 = clockCenterY + handLength * Math.sin(handAngleRad);

  // Format big integer powers cleanly for presentation
  const formatPowerString = (num: bigint) => {
    const s = num.toString();
    if (s.length > 15) {
      return `${s.slice(0, 8)}... (${s.length} digits)`;
    }
    return s;
  };

  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>{title}</span>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-mono font-bold">
              Modulus n = {modulus}
            </span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Computing modular power step-by-step: <span className="font-mono text-blue-700 font-bold">{base}^{exponent} mod {modulus}</span>
          </p>
        </div>

        {/* Step controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))}
            disabled={currentStep >= steps.length - 1}
            className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg border border-slate-300 text-slate-700 transition-colors cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 text-slate-600 transition-colors cursor-pointer"
            title="Reset Clock"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Responsive SVG Clock Face */}
        <div className="flex flex-col items-center justify-center bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-inner">
          <svg 
            viewBox="0 0 300 300" 
            className="w-full max-w-[260px] sm:max-w-[290px] h-auto overflow-visible"
          >
            {/* Outer Rim Circle */}
            <circle
              cx={clockCenterX}
              cy={clockCenterY}
              r={clockRadius}
              className="fill-slate-950 stroke-blue-500/60"
              strokeWidth="4"
            />
            <circle
              cx={clockCenterX}
              cy={clockCenterY}
              r={clockRadius + 8}
              className="fill-none stroke-slate-700"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Ticks & Numbers around rim */}
            {Array.from({ length: numTicks }).map((_, i) => {
              const tickVal = Math.round((i * modulus) / numTicks);
              const angle = (i / numTicks) * 2 * Math.PI - Math.PI / 2;
              const innerR = clockRadius - 10;
              const outerR = clockRadius;
              const labelR = clockRadius - 22;

              const x1 = clockCenterX + innerR * Math.cos(angle);
              const y1 = clockCenterY + innerR * Math.sin(angle);
              const x2 = clockCenterX + outerR * Math.cos(angle);
              const y2 = clockCenterY + outerR * Math.sin(angle);
              const lx = clockCenterX + labelR * Math.cos(angle);
              const ly = clockCenterY + labelR * Math.sin(angle);

              const isCurrent = tickVal === currentValue;
              const isHighlight = highlightValue !== undefined && tickVal === highlightValue;

              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={isCurrent ? 'stroke-cyan-400' : 'stroke-slate-600'}
                    strokeWidth={isCurrent ? '3' : '1.5'}
                  />
                  {numTicks <= 20 && (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] font-mono ${
                        isCurrent
                          ? 'fill-cyan-300 font-bold text-xs'
                          : isHighlight
                          ? 'fill-emerald-400 font-bold'
                          : 'fill-slate-400'
                      }`}
                    >
                      {tickVal}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Target highlight indicator if applicable */}
            {highlightValue !== undefined && (
              <g>
                {(() => {
                  const targetAngle = (highlightValue / (modulus || 1)) * 2 * Math.PI - Math.PI / 2;
                  const tx = clockCenterX + (clockRadius - 5) * Math.cos(targetAngle);
                  const ty = clockCenterY + (clockRadius - 5) * Math.sin(targetAngle);
                  return (
                    <circle
                      cx={tx}
                      cy={ty}
                      r="6"
                      className="fill-emerald-400 stroke-white"
                      strokeWidth="2"
                    />
                  );
                })()}
              </g>
            )}

            {/* Hand Line */}
            <line
              x1={clockCenterX}
              y1={clockCenterY}
              x2={handX2}
              y2={handY2}
              className="stroke-cyan-400 transition-all duration-500 ease-out"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Hand Tip Glowing Dot */}
            <circle
              cx={handX2}
              cy={handY2}
              r="6"
              className="fill-cyan-300 stroke-white"
              strokeWidth="2"
            />

            {/* Center Cap */}
            <circle cx={clockCenterX} cy={clockCenterY} r="8" className="fill-blue-600 stroke-blue-300" strokeWidth="2" />

            {/* Center Text */}
            <text
              x={clockCenterX}
              y={clockCenterY + 35}
              textAnchor="middle"
              className="fill-cyan-300 text-sm font-bold font-mono"
            >
              val = {currentValue}
            </text>
            <text
              x={clockCenterX}
              y={clockCenterY + 52}
              textAnchor="middle"
              className="fill-slate-400 text-[10px] font-mono"
            >
              (mod {modulus})
            </text>
          </svg>

          <span className="text-[11px] text-slate-300 mt-2 font-medium text-center">
            Clock hand wraps around {modulus} positions (modular congruence).
          </span>
        </div>

        {/* Right: Step breakdown card */}
        <div className="space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="text-xs text-slate-600 flex items-center justify-between font-semibold">
              <span>Exponent Step: <strong className="text-blue-700 font-mono text-sm">k = {activeStepObj.k}</strong> of {exponent}</span>
              <span className="text-blue-700 font-mono text-xs bg-blue-100 px-2 py-0.5 rounded border border-blue-200">Step {currentStep + 1} / {steps.length}</span>
            </div>

            <div className="bg-white border border-slate-300 rounded-lg p-3 space-y-2 font-mono text-xs">
              <div className="text-slate-600 flex justify-between items-center">
                <span>Unmodded Power ({base}^{activeStepObj.k}):</span>
                <span className="text-slate-900 font-bold">
                  {formatPowerString(activeStepObj.rawPower)}
                </span>
              </div>
              <div className="text-slate-600 flex justify-between items-center">
                <span>Modulo Operation:</span>
                <span className="text-blue-800 font-semibold">{base}^{activeStepObj.k} mod {modulus}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
                <span className="text-slate-800 font-sans font-bold">Clock Remainder Position:</span>
                <span className="text-blue-700 font-extrabold text-base bg-blue-50 border border-blue-300 px-3 py-1 rounded-md">
                  {currentValue}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] text-slate-600 block mb-2 font-bold uppercase tracking-wider">
              Exponent Trajectory Timeline:
            </span>
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {steps.map((st, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentStep(idx);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    idx === currentStep
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {base}^{st.k}→{st.val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
