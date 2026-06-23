/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS, GOJUON_ROWS } from './data/letters';
import { JapaneseCharacter, AppStats, StudentProgress } from './types';
import { LetterCard } from './components/LetterCard';
import { ProgressStats } from './components/ProgressStats';
import { WritingModal } from './components/WritingModal';
import { SealTestingCenter } from './components/SealTestingCenter';
import { updateStreakStats } from './utils/streak';
import { BookOpen, Search, Volume2, VolumeX, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'seals'>('hiragana');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bypassKatakanaLock, setBypassKatakanaLock] = useState(false);

  // Selected character state for practice overlay modal
  const [selectedCharacter, setSelectedCharacter] = useState<JapaneseCharacter | null>(null);

  // Student progress state persistent via local storage
  const [masteredChars, setMasteredChars] = useState<string[]>([]);
  const [stats, setStats] = useState<AppStats>({
    hiraganaMastered: 0,
    katakanaMastered: 0,
    streak: 0,
    totalAttempts: 0
  });

  // Load stats and mastered characters from localStorage on startup
  useEffect(() => {
    try {
      const storedMastered = localStorage.getItem('kaku_mastered_characters');
      if (storedMastered) {
        setMasteredChars(JSON.parse(storedMastered));
      }

      const storedStats = localStorage.getItem('kaku_student_stats');
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }
    } catch (e) {
      console.error("Could not load local storage progress", e);
    }
  }, []);

  // Sync state stats back to localStorage
  const saveProgressToLocalStorage = (newMastered: string[], newStats: AppStats) => {
    try {
      localStorage.setItem('kaku_mastered_characters', JSON.stringify(newMastered));
      localStorage.setItem('kaku_student_stats', JSON.stringify(newStats));
    } catch (e) {
      console.error("Error writing progress to storage", e);
    }
  };

  const handlePracticeSuccess = (score: number) => {
    if (!selectedCharacter) return;
    const char = selectedCharacter.char;

    // Add to mastered characters list if not already present
    let updatedMastered = [...masteredChars];
    let isNewlyMastered = false;
    
    if (!masteredChars.includes(char)) {
      updatedMastered.push(char);
      isNewlyMastered = true;
    }

    // Recompute statistics
    const totalHiraMastered = HIRAGANA_CHARACTERS.filter(c => updatedMastered.includes(c.char)).length;
    const totalKataMastered = KATAKANA_CHARACTERS.filter(c => updatedMastered.includes(c.char)).length;

    // Record practice attempts metrics details for calligraphy heat map
    const prevDetails = stats.practiceDetails?.[char] || { attempts: 0, bestScore: 0, wrongAttempts: 0 };
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const newAttempts = prevDetails.attempts + 1;
    const newBestScore = Math.max(prevDetails.bestScore, score);

    // Apply strict daily consistency streak evaluation
    const statsWithLogs = updateStreakStats(stats, char, true);

    const updatedStats: AppStats = {
      ...statsWithLogs,
      hiraganaMastered: totalHiraMastered,
      katakanaMastered: totalKataMastered,
      totalAttempts: stats.totalAttempts + 1,
      beginnerSeals: stats.beginnerSeals,
      intermediateWins: stats.intermediateWins,
      masterSealEarned: stats.masterSealEarned,
      practiceDetails: {
        ...(statsWithLogs.practiceDetails || stats.practiceDetails || {}),
        [char]: {
          attempts: newAttempts,
          bestScore: newBestScore,
          dateStr,
          wrongAttempts: prevDetails.wrongAttempts // Keep unchanged on success
        }
      }
    };

    setMasteredChars(updatedMastered);
    setStats(updatedStats);
    saveProgressToLocalStorage(updatedMastered, updatedStats);

    // Close practice modal after showcasing the Hanko stamp briefly
    setTimeout(() => {
      setSelectedCharacter(null);
    }, 1500);
  };

  const handlePracticeFailure = () => {
    if (!selectedCharacter) return;
    const char = selectedCharacter.char;

    const prevDetails = stats.practiceDetails?.[char] || { attempts: 0, bestScore: 0, wrongAttempts: 0 };
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Apply strict daily consistency streak evaluation (failures immediately trigger penalty)
    const statsWithLogs = updateStreakStats(stats, char, false);

    const updatedStats: AppStats = {
      ...statsWithLogs,
      totalAttempts: stats.totalAttempts + 1,
      practiceDetails: {
        ...(statsWithLogs.practiceDetails || stats.practiceDetails || {}),
        [char]: {
          attempts: prevDetails.attempts + 1,
          bestScore: prevDetails.bestScore,
          dateStr,
          wrongAttempts: (prevDetails.wrongAttempts || 0) + 1
        }
      }
    };
    setStats(updatedStats);
    saveProgressToLocalStorage(masteredChars, updatedStats);
  };

  const handleResetRowRecords = (rowId: string, charactersInRow: string[]) => {
    const updatedMastered = masteredChars.filter(char => !charactersInRow.includes(char));

    const totalHiraMastered = HIRAGANA_CHARACTERS.filter(c => updatedMastered.includes(c.char)).length;
    const totalKataMastered = KATAKANA_CHARACTERS.filter(c => updatedMastered.includes(c.char)).length;

    const updatedDetails = { ...(stats.practiceDetails || {}) };
    charactersInRow.forEach(char => {
      delete updatedDetails[char];
    });

    const updatedStats: AppStats = {
      ...stats,
      hiraganaMastered: totalHiraMastered,
      katakanaMastered: totalKataMastered,
      practiceDetails: updatedDetails
    };

    setMasteredChars(updatedMastered);
    setStats(updatedStats);
    saveProgressToLocalStorage(updatedMastered, updatedStats);
  };

  const handleResetRecords = () => {
    const clearedStats: AppStats = {
      hiraganaMastered: 0,
      katakanaMastered: 0,
      streak: 0,
      totalAttempts: 0
    };
    setMasteredChars([]);
    setStats(clearedStats);
    localStorage.removeItem('kaku_mastered_characters');
    localStorage.removeItem('kaku_student_stats');
  };

  // Filter letters based on current search input with enhanced queries and mnemonic row label routing
  const currentCharacters = activeTab === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
  const filteredCharacters = currentCharacters.filter(c => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return true;

    const matchesChar = c.char.includes(trimmedQuery);
    const matchesRomaji = c.romaji.toLowerCase().includes(trimmedQuery);
    const matchesMnemonic = c.mnemonic?.toLowerCase().includes(trimmedQuery);

    // Contextually match row labels (e.g. searching for "K-row" or "Vowels")
    const rowGroup = GOJUON_ROWS.find(r => r.id === c.row);
    const matchesRowId = c.row.toLowerCase().includes(trimmedQuery);
    const matchesRowLabel = rowGroup?.label.toLowerCase().includes(trimmedQuery);

    return matchesChar || matchesRomaji || matchesMnemonic || matchesRowId || matchesRowLabel;
  });

  // Group characters by standard Gojuon rows for displaying elegant tables
  const rowsData = GOJUON_ROWS.map(rowGroup => {
    const matchingChars = filteredCharacters.filter(c => c.row === rowGroup.id);
    return {
      ...rowGroup,
      characters: matchingChars
    };
  }).filter(r => r.characters.length > 0);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1A1A1A] font-serif antialiased selection:bg-[#BC2F32]/10 selection:text-[#BC2F32] pb-12 pt-8" id="sandbox-root">
      
      {/* Outer elegant container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Navigation bar Header in Geometric Balance Theme */}
        <header className="h-auto md:h-20 py-4 md:py-0 border-b border-[#E5E1D8] flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 bg-white/50 backdrop-blur-sm z-10 rounded-sm mb-10 gap-4 md:gap-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#BC2F32] flex items-center justify-center text-white font-serif font-bold text-xl rounded-sm">書</div>
            <h1 className="text-xl sm:text-2xl tracking-[0.2em] font-light uppercase text-[#1A1A1A]">
              Kaku 
              <span className="text-xs sm:text-sm text-gray-400 font-sans tracking-normal ml-2 italic">
                {activeTab === 'hiragana' ? 'Hiragana Master' : activeTab === 'katakana' ? 'Katakana Master' : 'Seal Exams'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Audio Toggle control switch */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full border transition duration-150 flex items-center justify-center ${
                soundEnabled 
                  ? 'bg-amber-50/50 border-amber-200 text-amber-800' 
                  : 'bg-white border-gray-200 text-gray-400'
              }`}
              title={soundEnabled ? "Disable sound" : "Enable sound"}
              id="sound-control-btn"
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>

            {/* Script Selector Tabs pill container */}
            <div className="flex flex-1 md:flex-none justify-between bg-[#EDE9E1] p-1 rounded-full font-sans text-xs font-medium uppercase tracking-widest" id="script-selector-tabs">
              <button
                onClick={() => {
                  setActiveTab('hiragana');
                  setSearchQuery('');
                }}
                className={`flex-1 md:flex-none px-3 sm:px-6 py-2 rounded-full transition-all duration-200 text-[9px] sm:text-xs font-bold whitespace-nowrap ${
                  activeTab === 'hiragana'
                    ? 'bg-white shadow-sm text-[#BC2F32]'
                    : 'text-gray-500 hover:text-black'
                }`}
                id="btn-tab-hiragana"
              >
                Hiragana
              </button>
              <button
                onClick={() => {
                  setActiveTab('katakana');
                  setSearchQuery('');
                }}
                className={`flex-1 md:flex-none px-3 sm:px-6 py-2 rounded-full transition-all duration-200 text-[9px] sm:text-xs font-bold whitespace-nowrap ${
                  activeTab === 'katakana'
                    ? 'bg-white shadow-sm text-[#BC2F32]'
                    : 'text-gray-500 hover:text-black'
                }`}
                id="btn-tab-katakana"
              >
                Katakana
              </button>
              <button
                onClick={() => {
                  setActiveTab('seals');
                  setSearchQuery('');
                }}
                className={`flex-1 md:flex-none px-3 sm:px-6 py-2 rounded-full transition-all duration-200 text-[9px] sm:text-xs font-bold whitespace-nowrap ${
                  activeTab === 'seals'
                    ? 'bg-white shadow-sm text-[#BC2F32]'
                    : 'text-gray-500 hover:text-black'
                }`}
                id="btn-tab-seals"
              >
                Seal Exams
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Grid columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main workspace section spanning 2 columns list */}
          <div className="lg:col-span-2 space-y-10">
            {(() => {
              const totalHiraganaCount = HIRAGANA_CHARACTERS.length;
              const masteredHiraganaCount = HIRAGANA_CHARACTERS.filter(hc => masteredChars.includes(hc.char)).length;
              const katakanaUnlocked = masteredHiraganaCount >= totalHiraganaCount || bypassKatakanaLock;

              if (activeTab === 'seals') {
                return (
                  <SealTestingCenter
                    masteredChars={masteredChars}
                    stats={stats}
                    onUpdateStats={(updatedStats) => {
                      setStats(updatedStats);
                      saveProgressToLocalStorage(masteredChars, updatedStats);
                    }}
                    soundEnabled={soundEnabled}
                    hiraganaUnlocked={true}
                    katakanaUnlocked={katakanaUnlocked}
                  />
                );
              }

              if (activeTab === 'katakana' && !katakanaUnlocked) {
                return (
                  <div className="bg-white rounded-sm border border-[#E5E1D8] p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200 text-3xl animate-pulse">
                      ⛩️
                    </div>
                    <div className="max-w-md">
                      <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Katakana Scroll is Unopened</h3>
                      <p className="text-sm font-sans text-gray-400 leading-relaxed">
                        To maintain disciplined balance in your study path, you must master the complete Hiragana character set before practicing Katakana.
                      </p>
                    </div>
                    
                    {/* Progress bar info for Hiragana unlocking condition */}
                    <div className="w-full max-w-sm bg-gray-100 rounded-full h-2 mb-2 overflow-hidden border border-gray-200">
                      <div
                        className="bg-[#BC2F32] h-full transition-all duration-300"
                        style={{ width: `${(masteredHiraganaCount / totalHiraganaCount) * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest leading-none">
                      Hiragana Progress: {masteredHiraganaCount} / {totalHiraganaCount} Letters Mastered
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full justify-center max-w-xs">
                      <button
                        onClick={() => setActiveTab('hiragana')}
                        className="flex-1 py-3 px-4 border border-[#E5E1D8] hover:bg-[#FAFAFA] text-[10px] uppercase tracking-widest font-sans font-bold text-gray-600 transition-all rounded-sm"
                      >
                        Go Study Hiragana
                      </button>
                      <button
                        onClick={() => {
                          setBypassKatakanaLock(true);
                          alert("🪄 Vermillion override activated! Katakana has been unlocked for testing and evaluation.");
                        }}
                        className="flex-1 py-3 px-4 bg-[#BC2F32] hover:bg-[#A12528] text-[10px] uppercase tracking-widest font-sans font-bold text-white transition-all rounded-sm shadow-md"
                      >
                        Bypass / Unlock Instantly
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <>
                  {/* Search filter bar */}
                  <div className="relative bg-white rounded-sm border border-[#E5E1D8] shadow-sm flex items-center px-4 py-3">
                    <Search size={15} className="text-gray-400 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search character, e.g. 'a', 'ka', 'tsu', or mnemonics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none text-sm text-[#1A1A1A] placeholder-gray-400 focus:outline-none font-sans"
                      id="search-letters-input"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-gray-400 hover:text-black focus:outline-none font-sans font-medium"
                        title="Clear query"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Structured Rows Group Grid */}
                  <div className="space-y-8" id="rows-container">
                    {rowsData.length > 0 ? (
                      rowsData.map((rowGroup) => (
                        <div
                          key={rowGroup.id}
                          className="p-6 bg-white rounded-sm border border-[#E5E1D8] shadow-sm space-y-5"
                          id={`row-group-${rowGroup.id}`}
                        >
                          {/* Row group header label */}
                          <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-[#1A1A1A] text-sm">
                                {rowGroup.id === 'a' ? 'あ 行 / Vowels' :
                                 rowGroup.id === 'ka' ? 'か 行 / K-Series' :
                                 rowGroup.id === 'sa' ? 'さ 行 / S-Series' :
                                 rowGroup.id === 'ta' ? 'た 行 / T-Series' :
                                 rowGroup.id === 'na' ? 'な 行 / N-Series' :
                                 rowGroup.id === 'ha' ? 'は 行 / H-Series' :
                                 rowGroup.id === 'ma' ? 'ま 行 / M-Series' :
                                 rowGroup.id === 'ya' ? 'や 行 / Y-Series' :
                                 rowGroup.id === 'ra' ? 'ら 行 / R-Series' : 'わ 行 / W-Series'}
                              </span>
                              <span className="h-[1px] w-12 bg-[#E5E1D8] hidden sm:block"></span>
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-medium">
                                ({rowGroup.label})
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-sans uppercase tracking-widest font-medium">
                              {rowGroup.characters.filter(c => masteredChars.includes(c.char)).length} / {rowGroup.characters.length} Cleared
                            </span>
                          </div>

                          {/* Horizontal grid mapping characters inside row */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {rowGroup.characters.map((character) => (
                              <LetterCard
                                key={character.char}
                                character={character}
                                mastered={masteredChars.includes(character.char)}
                                onSelect={(char) => setSelectedCharacter(char)}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16 bg-white rounded-sm border border-[#E5E1D8] p-6 shadow-sm">
                        <div className="text-gray-300 text-5xl mb-3">🕳️</div>
                        <p className="font-serif text-lg text-gray-500">No matching scrolls found</p>
                        <p className="text-xs text-gray-400 mt-1 font-sans">Try searching for other vowels or romaji like "a", "ka", "tsu".</p>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Sidebar Area: Telemetry metrics stats & traditional Hanko stamps */}
          <div className="space-y-6">
            
            {/* Progress Tracker stats card */}
            <ProgressStats
              stats={stats}
              totalHiragana={HIRAGANA_CHARACTERS.length}
              totalKatakana={KATAKANA_CHARACTERS.length}
              onReset={handleResetRecords}
              onResetRow={handleResetRowRecords}
              masteredChars={masteredChars}
            />

            {/* Callout Info box helping instructions */}
            <div className="bg-white rounded-sm border border-[#E5E1D8] p-5 shadow-sm">
              <h3 className="font-serif text-sm font-semibold text-[#BC2F32] mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                <BookOpen size={15} />
                Studying Guide
              </h3>
              <ul className="text-xs text-gray-600 space-y-2.5 leading-relaxed list-none pl-0 font-sans">
                <li className="flex gap-2">
                  <span className="text-[#BC2F32] font-semibold">1.</span>
                  <span>Click on any card tile to open its practice trace canvas workspace.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#BC2F32] font-semibold">2.</span>
                  <span>Trace along the template starting brush at the numbered vermillion indicators (①, ②, etc.).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#BC2F32] font-semibold">3.</span>
                  <span>Choose any brush index or Sumi inkwell palette to slide and practice!</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#BC2F32] font-semibold">4.</span>
                  <span>Once complete, click <strong>Verify Stroke</strong> to stamps your character with an approval seal.</span>
                </li>
              </ul>
            </div>
            
          </div>
        </div>

        {/* Footer / Status Bar in Geometric Balance styling */}
        <footer className="mt-12 h-12 border-t border-[#E5E1D8] flex items-center justify-between text-[10px] text-gray-400 font-sans tracking-wide">
          <div className="flex gap-8 uppercase">
            <span>PROGRESS: {masteredChars.length} / {HIRAGANA_CHARACTERS.length + KATAKANA_CHARACTERS.length} CHARACTERS</span>
            <span>STREAK: {stats.streak} DAYS</span>
          </div>
                    {/* Product Hunt Support Badge */}
          
          <div className="flex justify-center mt-6 mb-2 w-full shadow-xs hover:scale-102 transition-all duration-200">
            <a href="https://www.producthunt.com/products/onritsu-jlang?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-onritsu-jlang" target="_blank" rel="noopener noreferrer"
              className="inline-block">
              
            <img alt="Onritsu-Jlang - Learn Japanese in Minimal way.  | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1179188&amp;theme=dark&amp;t=1782225300935"
                referrerPolicy="no-referrer"
                className="max-w-[210px] sm:max-w-[250px] h-auto object-contain"
                /></a></div>         
          <div className="italic">Crafted in Geometric Balance.</div>
        </footer>

      </div>

      {/* Primary calligraphy practice overlays workspace */}
      {selectedCharacter && (
        <WritingModal
          character={selectedCharacter}
          isOpen={selectedCharacter !== null}
          onClose={() => setSelectedCharacter(null)}
          onSuccess={handlePracticeSuccess}
          onFailure={handlePracticeFailure}
          soundEnabled={soundEnabled}
        />
      )}
      
    </div>
  );
}
