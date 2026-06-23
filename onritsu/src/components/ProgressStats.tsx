import React, { useState } from 'react';
import { AppStats } from '../types';
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS, GOJUON_ROWS } from '../data/letters';
import { Award, Zap, History, RefreshCw, Calendar, Sparkles, AlertTriangle, ArrowLeft } from 'lucide-react';

interface ProgressStatsProps {
  stats: AppStats;
  totalHiragana: number;
  totalKatakana: number;
  onReset: () => void;
  onResetRow?: (rowId: string, characters: string[]) => void;
  masteredChars: string[];
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  stats,
  totalHiragana,
  totalKatakana,
  onReset,
  onResetRow,
  masteredChars
}) => {
  const [activeMapTab, setActiveMapTab] = useState<'hiragana' | 'katakana'>('hiragana');
  
  // Disclaimer state variables
  const [showFullResetConfirm, setShowFullResetConfirm] = useState(false);
  const [rowToReset, setRowToReset] = useState<{ id: string; label: string; characters: string[] } | null>(null);

  const hiraPercent = totalHiragana > 0 ? Math.round((stats.hiraganaMastered / totalHiragana) * 100) : 0;
  const kataPercent = totalKatakana > 0 ? Math.round((stats.katakanaMastered / totalKatakana) * 100) : 0;

  // Render character heat map cell helper
  const renderHeatMapCell = (charObj: typeof HIRAGANA_CHARACTERS[0]) => {
    const details = stats.practiceDetails?.[charObj.char] || { 
      attempts: 0, 
      bestScore: 0, 
      wrongAttempts: 0,
      testAttempts: 0,
      testWrongAttempts: 0,
      testBestScore: 0
    };
    const { 
      attempts, 
      bestScore, 
      wrongAttempts, 
      testAttempts, 
      testWrongAttempts, 
      testBestScore 
    } = details as any;

    // Default styles for unpracticed letters
    let bgClass = 'bg-[#FCFAF7] text-[#BFBAA9] hover:bg-stone-50 border-[#E8E3D5]';
    let borderStyle = 'border';
    let squareColor = ''; // empty means no small square
    let statusText = 'Not practiced yet';

    // Test performance overrules standard practice color
    if (testAttempts > 0) {
      if (testWrongAttempts > 0) {
        // Absolute red square for wrong response in tests
        bgClass = 'bg-red-650 text-white font-bold';
        borderStyle = 'border border-red-800 shadow-sm';
        squareColor = 'bg-white';
        statusText = `Test Failure: Incorrect letter`;
      } else {
        // Absolute black square for accurately mastered letters
        bgClass = 'bg-stone-950 text-[#F9F7F5] font-bold';
        borderStyle = 'border border-black shadow-md';
        squareColor = 'bg-amber-400';
        statusText = `Test Mastered: ${testBestScore}% accuracy`;
      }
    } else if (attempts > 0) {
      if (wrongAttempts > 0) {
        // Simple red square for failure in practice
        bgClass = 'bg-red-100 text-red-700 border-red-300';
        borderStyle = 'border';
        squareColor = 'bg-red-505';
        statusText = `Practice Errors: ${wrongAttempts} mistakes`;
      } else if (attempts === 1) {
        // Simple blue square for accurately practiced the letter first time
        bgClass = 'bg-blue-50 text-blue-700 border-blue-200';
        borderStyle = 'border';
        squareColor = 'bg-blue-400';
        statusText = 'Practiced 1x (Accurate)';
      } else if (attempts === 2 || attempts === 3) {
        // More/darker blue square for accurately practiced 2 or 3 times
        bgClass = 'bg-blue-100 text-blue-900 border-blue-400 font-semibold';
        borderStyle = 'border';
        squareColor = 'bg-blue-600';
        statusText = `Practiced ${attempts}x (Accurate)`;
      } else {
        // More than 3 times accurate practice
        bgClass = 'bg-sky-100 text-sky-950 border-sky-305 font-bold';
        borderStyle = 'border';
        squareColor = 'bg-sky-600';
        statusText = `Repeatedly practiced: ${attempts}x`;
      }
    }

    return (
      <div
        key={charObj.char}
        className={`w-9 h-9 rounded-sm flex flex-col items-center justify-center transition-all cursor-help relative group text-xs ${bgClass} ${borderStyle}`}
        title={`Character: ${charObj.char} (${charObj.romaji})\nAttempts: ${attempts}\nAccuracy: ${bestScore > 0 ? bestScore + '%' : 'Unpracticed'}\nWrong: ${wrongAttempts || 0}`}
      >
        <span className="font-serif leading-none text-sm">{charObj.char}</span>
        <span className="text-[6.5px] opacity-70 font-sans tracking-tight uppercase leading-none mt-0.5">
          {charObj.romaji}
        </span>

        {/* Small color square indicator */}
        {squareColor && (
          <div className="absolute top-0.5 right-0.5 flex items-center justify-center">
            <span className={`w-1 h-1 ${squareColor} rounded-[1px]`} />
          </div>
        )}

        {/* Custom tooltip helper floating over cell on hover */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-stone-900/95 text-[#FCFAF7] text-[9px] py-1.5 px-2.5 rounded-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-md font-sans border border-stone-800">
          <div className="font-bold border-b border-stone-800 pb-0.5 mb-1 flex justify-between items-center gap-4">
            <span className="font-serif text-[11px] text-amber-400 font-normal">{charObj.char} ({charObj.romaji.toUpperCase()})</span>
            <span className="text-[7px] text-stone-400 uppercase tracking-widest">{statusText}</span>
          </div>
          <div className="flex gap-2 text-stone-300 font-mono text-[8px]">
            <span>Attempts: {attempts}</span>
            <span>Best: {bestScore}%</span>
            <span>Wrong: {wrongAttempts || 0}</span>
            {testAttempts > 0 && <span>Test Best: {testBestScore}%</span>}
          </div>
        </div>
      </div>
    );
  };

  const getPastTwoWeeksDates = () => {
    const list = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      list.push({
        dateStr,
        label: `${month}/${day}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return list;
  };

  const datesList = getPastTwoWeeksDates();

  return (
    <div className="bg-white rounded-sm border border-[#E5E1D8] p-6 shadow-sm flex flex-col gap-6" id="stats-section">
      
      {/* Title with full reset trigger */}
      <div className="flex items-center justify-between border-b pb-4 border-[#E5E1D8]">
        <div>
          <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans">修業の進捗 / Mastery State</h3>
          <p className="font-serif text-lg font-medium text-[#1A1A1A]">Your Practice Scrolls</p>
        </div>
        <button
          onClick={() => {
            setShowFullResetConfirm(true);
          }}
          className="text-[10px] text-gray-400 font-sans tracking-wide hover:text-[#BC2F32] transition duration-150 flex items-center gap-1.5 focus:outline-none bg-stone-50 hover:bg-stone-100 border border-stone-200 px-2 py-1 rounded-[2px]"
          title="Reset Practice Records"
          id="btn-reset-stats"
        >
          <RefreshCw size={11} className="text-[#BC2F32]" />
          Reset Records
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
        {/* Streak card */}
        <div className="flex items-center gap-3 bg-[#FAFAFA] p-3 rounded-sm border border-[#E5E1D8]">
          <div className="p-2 bg-amber-50 rounded-full text-amber-600">
            <Zap size={16} />
          </div>
          <div>
            <div className="text-lg font-bold font-serif text-[#1A1A1A] leading-none mb-1">{stats.streak}</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-medium">Streak</div>
          </div>
        </div>

        {/* Total Attempts */}
        <div className="flex items-center gap-3 bg-[#FAFAFA] p-3 rounded-sm border border-[#E5E1D8]">
          <div className="p-2 bg-slate-50 rounded-full text-slate-600">
            <History size={16} />
          </div>
          <div>
            <div className="text-lg font-bold font-serif text-[#1A1A1A] leading-none mb-1">{stats.totalAttempts}</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-medium">Checked</div>
          </div>
        </div>

        {/* Overall Letters Done */}
        <div className="flex items-center gap-3 bg-[#FAFAFA] p-3 rounded-sm border border-[#E5E1D8]">
          <div className="p-2 bg-[#BC2F32]/10 rounded-full text-[#BC2F32]">
            <Award size={16} />
          </div>
          <div>
            <div className="text-lg font-bold font-serif text-[#BC2F32] leading-none mb-1">{masteredChars.length}</div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest font-sans font-medium">Letters</div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Hiragana Progress */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-sans tracking-wide uppercase font-medium text-gray-500 mb-1.5">
            <span>Hiragana Mastery</span>
            <span>{stats.hiraganaMastered} / {totalHiragana} ({hiraPercent}%)</span>
          </div>
          <div className="w-full bg-[#EDE9E1] h-1 rounded-full overflow-hidden">
            <div
              className="bg-[#BC2F32] h-full transition-all duration-500"
              style={{ width: `${hiraPercent}%` }}
            />
          </div>
        </div>

        {/* Katakana Progress */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-sans tracking-wide uppercase font-medium text-gray-500 mb-1.5">
            <span>Katakana Mastery</span>
            <span>{stats.katakanaMastered} / {totalKatakana} ({kataPercent}%)</span>
          </div>
          <div className="w-full bg-[#EDE9E1] h-1 rounded-full overflow-hidden">
            <div
              className="bg-gray-800 h-full transition-all duration-500"
              style={{ width: `${kataPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* HEAT MAPS SECTION: Japanese-style Structured Gojūon Rows Grid */}
      <div className="border-t border-[#E5E1D8] pt-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" />
            <h4 className="text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase font-sans">
              Traditional Syllabary Heat Map
            </h4>
          </div>
          
          {/* Subtabs selection */}
          <div className="flex bg-[#EDE9E1] p-0.5 rounded-sm text-[9px] font-sans font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveMapTab('hiragana')}
              className={`px-3 py-1 rounded-sm transition-all ${activeMapTab === 'hiragana' ? 'bg-white text-black shadow-xs' : 'text-gray-500'}`}
            >
              Hira Map
            </button>
            <button
              onClick={() => setActiveMapTab('katakana')}
              className={`px-3 py-1 rounded-sm transition-all ${activeMapTab === 'katakana' ? 'bg-white text-black shadow-xs' : 'text-gray-500'}`}
            >
              Kata Map
            </button>
          </div>
        </div>

        {/* Color key indicator with user specified rules */}
        <div className="text-[9px] text-gray-400 font-sans mb-5 block leading-relaxed bg-[#FCFAF7] p-3 border border-[#E8E3D5] rounded-sm">
          <strong className="text-gray-600 uppercase tracking-widest text-[8px] font-bold block mb-1.5">Color Key & Performance rules:</strong>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-50 border border-blue-200 rounded-[1px] inline-block shadow-2xs"></span> Simple Blue: Accurate 1st time</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-105 border border-blue-400 rounded-[1px] inline-block"></span> More Blue: Accurate 2-3x</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-100 border border-red-300 rounded-[1px] inline-block"></span> Simple Red: Practice failure</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-stone-950 border border-black rounded-[1px] inline-block"></span> Absolute Black: Test Mastered</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-650 border border-red-800 rounded-[1px] inline-block"></span> Absolute Red: Test wrong letter</span>
          </div>
        </div>

        {/* GOJUON GRID LAYOUT: Row by Row display (Completely static, no scrolling inside) */}
        <div className="space-y-3 bg-[#FCFAF7] p-3 border border-[#E5E1D8] rounded-sm" id="heatmap-static-grid">
          {GOJUON_ROWS.map(row => {
            const charactersInRow = (activeMapTab === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS)
              .filter(c => c.row === row.id);

            if (charactersInRow.length === 0) return null;

            return (
              <div key={row.id} className="flex flex-col py-1.5 border-b border-dashed border-[#E5E1D8]/70 last:border-b-0 gap-2">
                
                {/* Row info */}
                <div className="flex items-center justify-between w-full">
                  <span className="font-serif text-[11px] font-bold text-[#1A1A1A] whitespace-nowrap">
                    {row.id === 'a' ? 'あ 行 / Vowels' :
                     row.id === 'ka' ? 'か 行 / K-Row' :
                     row.id === 'sa' ? 'さ 行 / S-Row' :
                     row.id === 'ta' ? 'た 行 / T-Row' :
                     row.id === 'na' ? 'な 行 / N-Row' :
                     row.id === 'ha' ? 'は 行 / H-Row' :
                     row.id === 'ma' ? 'ま 行 / M-Row' :
                     row.id === 'ya' ? 'や 行 / Y-Row' :
                     row.id === 'ra' ? 'ら 行 / R-Row' : 'わ 行 / W-Row'}
                  </span>
                  
                  {/* Row Reset Trigger */}
                  <button
                    onClick={() => {
                      if (onResetRow) {
                        setRowToReset({
                          id: row.id,
                          label: row.label,
                          characters: charactersInRow.map(c => c.char)
                        });
                      }
                    }}
                    className="text-[8.5px] text-gray-400 font-sans tracking-tight hover:text-[#BC2F32] flex items-center gap-0.5 focus:outline-none bg-stone-100 hover:bg-stone-150 px-1.5 py-0.5 rounded-[1px]"
                    title={`Reset ${row.id.toUpperCase()} Row`}
                  >
                    <RefreshCw size={8} />
                    Reset
                  </button>
                </div>

                {/* Character list row */}
                <div className="flex flex-wrap gap-1.5">
                  {charactersInRow.map(charObj => renderHeatMapCell(charObj))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-DAY CALENDAR HEAT MAP */}
      <div className="border-t border-[#E5E1D8] pt-4">
        <h4 className="text-[10px] font-bold tracking-widest text-[#1A1A1A] uppercase mb-1.5 font-sans flex items-center gap-1.5">
          <Calendar size={12} className="text-gray-400" /> Frequency Logs
        </h4>
        <p className="text-[9px] text-gray-400 font-sans mb-3 leading-relaxed">
          The frequency logs monitor your calligraphic stamina. A stamp like <strong>"15x"</strong> means you successfully practiced exactly <strong>15 letters accurately</strong> (new or old characters) on that calendar date.
        </p>

        <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center bg-[#FAFAFA] border border-[#E5E1D8] p-3 rounded-sm text-[8px] font-sans font-medium text-center">
          {datesList.map(dateObj => {
            // Count total items checked on this day that were accurate
            let dailyChecks = 0;
            if (stats.practiceDetails) {
              Object.values(stats.practiceDetails).forEach((det: any) => {
                // If it belongs to this date and there are attempts and no wrong practices / or best score is valid
                if (det.dateStr === dateObj.dateStr) {
                  // Only count if practiced accurately (either high score, or zero wrong attempts)
                  if (!det.wrongAttempts || det.bestScore >= 60) {
                    dailyChecks += det.attempts || 1;
                  }
                }
              });
            }

            // Github style color coding based on practice velocity
            let colorCell = 'bg-stone-100/50 text-gray-400';
            if (dailyChecks > 0) {
              if (dailyChecks <= 2) colorCell = 'bg-blue-105 text-blue-800 font-bold border border-blue-200';
              else if (dailyChecks <= 5) colorCell = 'bg-blue-110 text-blue-900 font-bold border border-blue-300';
              else colorCell = 'bg-blue-700 text-white font-bold';
            }

            return (
              <div key={dateObj.dateStr} className="flex flex-col gap-1 items-center w-full">
                <span className="text-[7px] text-gray-400 block tracking-tighter uppercase">{dateObj.dayName}</span>
                <div
                  className={`w-6 h-6 rounded-xs flex items-center justify-center border border-transparent text-[8px] ${colorCell}`}
                  title={`Date: ${dateObj.dateStr}\nAccurate practices: ${dailyChecks}`}
                >
                  {dailyChecks > 0 ? `${dailyChecks}x` : '—'}
                </div>
                <span className="text-[7px] text-gray-400 block font-mono">{dateObj.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================= */}
      {/* DISCLAIMER POPUPS (MODAL DIALOG STRUCTURES) */}
      {/* ======================================= */}

      {/* Popup 1: Row Reset Disclaimer Modal */}
      {rowToReset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white w-full max-w-sm p-6 rounded-sm border border-[#E5E1D8] shadow-2xl flex flex-col items-center text-center space-y-4">
            
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#BC2F32] border border-red-100">
              <AlertTriangle size={22} />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-base font-bold text-gray-900">
                Reset Row Record?
              </h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                You are about to reset the calligraphic progress for the <strong className="text-stone-950">{rowToReset.label}</strong>.
              </p>
              <div className="text-[10.5px] text-[#BC2F32] bg-red-50 p-2.5 rounded-[2px] font-sans border border-red-105/40 text-left mt-2">
                <strong>Disclaimer:</strong> This operation clears all Hanko stamps, practice attempts, failures, and test statistics for characters: <strong className="font-mono">{rowToReset.characters.join(', ')}</strong>. This action is irreversible.
              </div>
            </div>

            {/* Prompt Actions */}
            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => {
                  if (onResetRow) {
                    onResetRow(rowToReset.id, rowToReset.characters);
                  }
                  setRowToReset(null);
                }}
                className="flex-1 py-2 bg-[#BC2F32] hover:bg-[#9B2326] text-white text-[10px] uppercase font-bold tracking-wider font-sans rounded-sm transition duration-150"
              >
                Reset Row
              </button>
              <button
                onClick={() => setRowToReset(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-750 text-[10px] uppercase font-bold tracking-wider font-sans rounded-sm transition duration-150 flex items-center justify-center gap-1"
              >
                <ArrowLeft size={10} />
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup 2: Whole Record Reset Disclaimer Modal */}
      {showFullResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white w-full max-w-sm p-6 rounded-sm border border-[#E5E1D8] shadow-2xl flex flex-col items-center text-center space-y-4">
            
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#BC2F32] border border-red-100">
              <AlertTriangle size={22} className="animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif text-base font-bold text-red-950">
                Reset Whole Record?
              </h3>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                This will completely erase your entire Calligraphy learning journey statistics.
              </p>
              <div className="text-[10.5px] text-[#BC2F32] bg-red-50 p-2.5 rounded-[2px] font-sans border border-red-100/40 text-left mt-2">
                <strong>Disclaimer:</strong> This action clears all unlocked levels, mastered statuses, daily streaks, historical operational logs, and student status badges. All letters will reset to "Unpracticed". This action is irreversible.
              </div>
            </div>

            {/* Prompt Actions */}
            <div className="flex gap-2 w-full mt-2">
              <button
                onClick={() => {
                  onReset();
                  setShowFullResetConfirm(false);
                }}
                className="flex-1 py-2 bg-stone-950 hover:bg-black text-white text-[10px] uppercase font-bold tracking-wider font-sans rounded-sm transition duration-150"
              >
                Whole Reset
              </button>
              <button
                onClick={() => setShowFullResetConfirm(false)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-750 text-[10px] uppercase font-bold tracking-wider font-sans rounded-sm transition duration-150 flex items-center justify-center gap-1"
              >
                <ArrowLeft size={10} />
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
