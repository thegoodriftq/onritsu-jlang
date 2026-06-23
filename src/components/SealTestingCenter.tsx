import React, { useState, useEffect } from 'react';
import { JapaneseCharacter } from '../types';
import { HIRAGANA_CHARACTERS, KATAKANA_CHARACTERS, GOJUON_ROWS } from '../data/letters';
import { playSuccessChime, playFailureGong } from '../utils/audio';
import { 
  Award, CheckCircle2, Volume2, ShieldCheck, BookOpen, AlertCircle, Sparkles, 
  Check, Clock, X, HelpCircle, FileText
} from 'lucide-react';
import { CertificateView } from './CertificateView';
import { updateStreakStats } from '../utils/streak';

interface SealTestingCenterProps {
  masteredChars: string[];
  stats: {
    hiraganaMastered: number;
    katakanaMastered: number;
    streak: number;
    totalAttempts: number;
    beginnerSeals?: string[]; // list of rows passed, e.g. "hira_a"
    masterSealEarned?: boolean;
    practiceDetails?: Record<string, { attempts: number; bestScore: number; dateStr?: string; wrongAttempts?: number }>;
    lastIntermediateAttemptTime?: number;
    lastMasterAttemptTime?: number;
    intermediateSeals?: string[]; // e.g. ["hiragana_inter", "katakana_inter"]
  };
  onUpdateStats: (updatedStats: any) => void;
  soundEnabled: boolean;
  hiraganaUnlocked: boolean;
  katakanaUnlocked: boolean;
}

type TestType = 'none' | 'beginner' | 'intermediate' | 'master';

interface QuizQuestion {
  character: JapaneseCharacter;
  part: 1 | 2; // Keep for interface compatibility (1: reading, 2: phonetic visual choose)
  subType: 'romaji_to_char' | 'char_to_romaji' | 'draw_from_audio';
  choices: { text: string; correct: boolean }[];
}

const CONFUSING_GROUPS: string[][] = [
  ['あ', 'お', 'め', 'ぬ', 'め', 'ね', 'わ'],
  ['い', 'り', 'こ', 'け'],
  ['さ', 'ち', 'き', 'ら', 'た'],
  ['は', 'ほ', 'ま', 'よ', 'く', 'け'],
  ['わ', 'れ', 'ね', 'ぬ', 'め'],
  ['ろ', 'る'],
  ['ア', 'マ', 'ヌ', 'フ', 'ス'],
  ['シ', 'ツ', 'ソ', 'ン', 'ノ'],
  ['チ', 'テ', 'タ'],
  ['ル', 'レ', 'ヲ', 'フ'],
  ['ま', 'も', 'ほ'],
  ['ソ', 'ン', 'シ', 'ツ', 'ノ'],
  ['コ', 'ゴ', 'ユ'],
  ['メ', 'ヌ', 'タ'],
  ['ク', 'ケ', 'タ', 'ワ']
];

export const SealTestingCenter: React.FC<SealTestingCenterProps> = ({
  masteredChars,
  stats,
  onUpdateStats,
  soundEnabled
}) => {
  const [activeTest, setActiveTest] = useState<TestType>('none');
  const [selectedRowId, setSelectedRowId] = useState<string>('a');
  const [selectedScriptType, setSelectedScriptType] = useState<'hiragana' | 'katakana'>('hiragana');
  
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [certConfig, setCertConfig] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    badgeLabel: string;
    badgeChar: string;
    sealColor: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    badgeLabel: '',
    badgeChar: '',
    sealColor: 'sky',
    description: ''
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [hasSubmittedChoice, setHasSubmittedChoice] = useState<boolean>(false);
  const [scoreSummary, setScoreSummary] = useState<{ character: string; type: 'identify' | 'audio'; score: number; passed: boolean }[]>([]);
  
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [isTestPassed, setIsTestPassed] = useState<boolean>(false);
  const [testFailedEarly, setTestFailedEarly] = useState<boolean>(false);
  const [failedQuestionIndex, setFailedQuestionIndex] = useState<number>(-1);

  const speakCharacter = (charText: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(charText);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentQuestion = questions[currentIdx];

  const generateConfusingChoices = (character: JapaneseCharacter, type: 'romaji_to_char' | 'char_to_romaji' | 'draw_from_audio'): { text: string; correct: boolean }[] => {
    const isRomajiAnswer = type === 'char_to_romaji';
    const pool = character.type === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
    
    let visualMatches: string[] = [];
    for (const group of CONFUSING_GROUPS) {
      if (group.includes(character.char)) {
        visualMatches = group.filter(c => c !== character.char);
        break;
      }
    }
    
    const candidateChars = pool.filter(c => c.char !== character.char);
    const selectedMatches: string[] = [];
    
    visualMatches.forEach(ch => {
      if (candidateChars.some(c => c.char === ch)) {
        selectedMatches.push(ch);
      }
    });

    while (selectedMatches.length < 3) {
      const rand = candidateChars[Math.floor(Math.random() * candidateChars.length)].char;
      if (!selectedMatches.includes(rand)) {
        selectedMatches.push(rand);
      }
    }

    const shuffledWrong = selectedMatches.slice(0, 3).map(ch => {
      const matchObj = pool.find(c => c.char === ch) || character;
      return {
        text: isRomajiAnswer ? matchObj.romaji : matchObj.char,
        correct: false
      };
    });

    const choices = [
      ...shuffledWrong,
      { text: isRomajiAnswer ? character.romaji : character.char, correct: true }
    ];

    return choices.sort(() => Math.random() - 0.5);
  };

  const initiateTest = (type: TestType, rowId?: string, scriptType?: 'hiragana' | 'katakana') => {
    let testChars: JapaneseCharacter[] = [];
    let list: QuizQuestion[] = [];

    const actualScriptType = scriptType || selectedScriptType;
    const actualRowId = rowId || selectedRowId;

    if (type === 'beginner') {
      const candidates = actualScriptType === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
      testChars = candidates.filter(c => c.row === actualRowId);
      
      if (testChars.length === 0) return;

      testChars.forEach(c => {
        list.push({
          character: c,
          part: 1,
          subType: 'char_to_romaji',
          choices: generateConfusingChoices(c, 'char_to_romaji')
        });
      });

      const shuffled = [...testChars].sort(() => 0.5 - Math.random());
      const firstTarget = shuffled[0];
      const secondTarget = shuffled[1] || shuffled[0];

      if (firstTarget) {
        list.push({
          character: firstTarget,
          part: 2,
          subType: 'draw_from_audio',
          choices: generateConfusingChoices(firstTarget, 'draw_from_audio')
        });
      }
      if (secondTarget && secondTarget.char !== firstTarget?.char) {
        list.push({
          character: secondTarget,
          part: 2,
          subType: 'draw_from_audio',
          choices: generateConfusingChoices(secondTarget, 'draw_from_audio')
        });
      }
    }
    else if (type === 'intermediate') {
      const candidates = actualScriptType === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());

      for (let i = 0; i < 5; i++) {
        const sub = Math.random() > 0.5 ? 'char_to_romaji' : 'romaji_to_char';
        list.push({
          character: shuffled[i],
          part: 1,
          subType: sub,
          choices: generateConfusingChoices(shuffled[i], sub)
        });
      }

      for (let i = 5; i < 10; i++) {
        list.push({
          character: shuffled[i],
          part: 2,
          subType: 'draw_from_audio',
          choices: generateConfusingChoices(shuffled[i], 'draw_from_audio')
        });
      }
    }
    else if (type === 'master') {
      const hiraShuffled = [...HIRAGANA_CHARACTERS].sort(() => 0.5 - Math.random());
      const kataShuffled = [...KATAKANA_CHARACTERS].sort(() => 0.5 - Math.random());

      const mixedPool: JapaneseCharacter[] = [];
      for (let i = 0; i < 8; i++) {
        mixedPool.push(hiraShuffled[i], kataShuffled[i]);
      }
      const shuffledPool = mixedPool.sort(() => 0.5 - Math.random()).slice(0, 15);

      shuffledPool.forEach((c, idx) => {
        if (idx < 7) {
          const sub = Math.random() > 0.5 ? 'char_to_romaji' : 'romaji_to_char';
          list.push({
            character: c,
            part: 1,
            subType: sub,
            choices: generateConfusingChoices(c, sub)
          });
        } else {
          list.push({
            character: c,
            part: 2,
            subType: 'draw_from_audio',
            choices: generateConfusingChoices(c, 'draw_from_audio')
          });
        }
      });
    }

    setQuestions(list);
    setCurrentIdx(0);
    setSelectedChoiceIdx(null);
    setHasSubmittedChoice(false);
    setScoreSummary([]);
    setTestCompleted(false);
    setIsTestPassed(false);
    setTestFailedEarly(false);
    setFailedQuestionIndex(-1);
    setActiveTest(type);
  };

  // Speak character sound automatically when questions change
  useEffect(() => {
    if (currentQuestion) {
      if (currentQuestion.subType === 'draw_from_audio') {
        const timer = setTimeout(() => {
          speakCharacter(currentQuestion.character.char);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIdx, questions]);

  const selectChoice = (choiceIdx: number) => {
    if (hasSubmittedChoice || !currentQuestion) return;
    setSelectedChoiceIdx(choiceIdx);
    setHasSubmittedChoice(true);

    const chosen = currentQuestion.choices[choiceIdx];
    const isCorrect = chosen.correct;

    if (isCorrect) {
      if (soundEnabled) playSuccessChime();
      
      const currentSummary = [...scoreSummary, {
        character: currentQuestion.character.char,
        type: (currentQuestion.subType === 'draw_from_audio' ? 'audio' : 'identify') as any,
        score: 100,
        passed: true
      }];
      setScoreSummary(currentSummary);
      updateStatsRecord(currentQuestion.character.char, 100, false);

      setTimeout(() => {
        advanceTest(currentSummary);
      }, 1500);
    } else {
      if (soundEnabled) playFailureGong();
      failTestEarly(currentQuestion.character, 0);
    }
  };

  const failTestEarly = (wrongChar: JapaneseCharacter, scoreVal: number) => {
    const currentSummary = [...scoreSummary, {
      character: wrongChar.char,
      type: (currentQuestion.subType === 'draw_from_audio' ? 'audio' : 'identify') as any,
      score: scoreVal,
      passed: false
    }];
    setScoreSummary(currentSummary);
    updateStatsRecord(wrongChar.char, scoreVal, true);

    setFailedQuestionIndex(currentIdx);
    setTestFailedEarly(true);
    setTestCompleted(true);
    setIsTestPassed(false);
  };

  const updateStatsRecord = (char: string, score: number, isWrong: boolean) => {
    const prevDetails = stats.practiceDetails?.[char] || { attempts: 0, bestScore: 0, wrongAttempts: 0 };
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const newDetails = {
      attempts: prevDetails.attempts + 1,
      bestScore: Math.max(prevDetails.bestScore || 0, score),
      wrongAttempts: (prevDetails.wrongAttempts || 0) + (isWrong ? 1 : 0),
      testAttempts: ((prevDetails as any).testAttempts || 0) + 1,
      testWrongAttempts: ((prevDetails as any).testWrongAttempts || 0) + (isWrong ? 1 : 0),
      testBestScore: Math.max(((prevDetails as any).testBestScore || 0), score),
      dateStr
    };

    const statsWithLogs = updateStreakStats(stats, char, !isWrong);

    onUpdateStats({
      ...statsWithLogs,
      practiceDetails: {
        ...(statsWithLogs.practiceDetails || {}),
        [char]: newDetails
      }
    });
  };

  const advanceTest = (updatedSummary: any[]) => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedChoiceIdx(null);
      setHasSubmittedChoice(false);
    } else {
      setIsTestPassed(true);
      setTestCompleted(true);

      let currentSeals = stats.beginnerSeals ? [...stats.beginnerSeals] : [];
      let currentInterSeals = stats.intermediateSeals ? [...stats.intermediateSeals] : [];
      let masterWon = stats.masterSealEarned || false;

      let lastInterTime = stats.lastIntermediateAttemptTime;
      let lastMasterTime = stats.lastMasterAttemptTime;

      if (activeTest === 'beginner') {
        const rowCode = `${selectedScriptType}_${selectedRowId}`;
        if (!currentSeals.includes(rowCode)) {
          currentSeals.push(rowCode);
        }
      } else if (activeTest === 'intermediate') {
        const interSetKey = `${selectedScriptType}_inter`;
        if (!currentInterSeals.includes(interSetKey)) {
          currentInterSeals.push(interSetKey);
        }
        lastInterTime = Date.now();
      } else if (activeTest === 'master') {
        masterWon = true;
        lastMasterTime = Date.now();
      }

      onUpdateStats({
        ...stats,
        beginnerSeals: currentSeals,
        intermediateSeals: currentInterSeals,
        masterSealEarned: masterWon,
        lastIntermediateAttemptTime: lastInterTime,
        lastMasterAttemptTime: lastMasterTime,
        totalAttempts: stats.totalAttempts + 1
      });
    }
  };

  const isHiraComplete = stats.hiraganaMastered === 46;
  const isKataComplete = stats.katakanaMastered === 46;

  const clearedRowsCount = stats.beginnerSeals?.length || 0;
  const isBeginnerSealEarned = clearedRowsCount >= 20;

  const isHiraInterPassed = stats.intermediateSeals?.includes('hiragana_inter') || false;
  const isKataInterPassed = stats.intermediateSeals?.includes('katakana_inter') || false;
  const isIntermediateSealEarned = isHiraInterPassed && isKataInterPassed;

  const interCooldownRemaining = stats.lastIntermediateAttemptTime ? (stats.lastIntermediateAttemptTime + 86400000) - currentTime : 0;
  const isInterCooldownActive = interCooldownRemaining > 0;

  const masterCooldownRemaining = stats.lastMasterAttemptTime ? (stats.lastMasterAttemptTime + 86400000) - currentTime : 0;
  const isMasterCooldownActive = masterCooldownRemaining > 0;

  const formatCooldown = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  return (
    <div className="bg-white rounded-sm border border-[#E5E1D8] p-6 shadow-sm flex flex-col gap-8" id="seal-testing-workspace">
      
      {/* 1. Simplified and Clear Rules Header */}
      <div className="border-b border-[#E5E1D8] pb-6">
        <h2 className="text-sm font-bold tracking-widest text-[#BC2F32] uppercase mb-4 font-sans flex items-center gap-2">
          <Award size={18} /> Calligraphy Certification Board
        </h2>
        
        {/* Simplified Rules Explainer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FCFAF7] p-4 border border-[#E5E1D8] rounded-sm mb-6 text-xs text-gray-600 leading-relaxed font-sans">
          <div>
            <h4 className="font-bold text-[#BC2F32] flex items-center gap-1.5 mb-2">
              <BookOpen size={13} /> Progression & Licensing Rules
            </h4>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex gap-2">
                <span className="text-[#BC2F32] font-bold">1.</span>
                <span>Complete studying all 46 <strong>Hiragana</strong> letters to unlock the <strong>Katakana</strong> scrolls.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BC2F32] font-bold">2.</span>
                <span>Complete 46 <strong>Katakana</strong> letters to open the row-by-row <strong>Beginner Seal Row Tests</strong>.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BC2F32] font-bold">3.</span>
                <span>Clear all 20 rows with 100% perfection to earn the <strong>Beginner Seal</strong> and open the Intermediate exam.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BC2F32] font-bold">4.</span>
                <span>Perfect both <strong>Intermediate set tests</strong> (separately) to unlock the mixed <strong>Supreme Master Seal Exam</strong>.</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 flex items-center gap-1.5 mb-2">
              <AlertCircle size={13} /> Strict Trial Requirements
            </h4>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex gap-2 text-red-700 font-medium">
                <span className="font-bold">✕</span>
                <span><strong>Instant Out:</strong> A single wrong answer terminates the exam immediately. You get the solution report but no seal.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BC2F32] font-bold">●</span>
                <span><strong>24-Hour Cooldown:</strong> Intermediate and Master exams can be taken only once every 24 hours (1-day cool).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#BC2F32] font-bold">●</span>
                <span><strong>Aural & Visual Focus:</strong> Designed to evaluate pronunciation and reading memory with zero game-like drawing noise.</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Short explanation of corner red badge */}
        <div className="bg-red-50/55 p-3 flex gap-2.5 items-start border border-dashed border-[#BC2F32]/20 rounded-sm text-xs font-sans text-gray-500 max-w-3xl leading-relaxed">
          <span className="flex-shrink-0 w-5 h-5 rounded-full border border-[#BC2F32] border-double bg-[#BC2F32]/10 flex items-center justify-center text-[10px] font-bold text-[#BC2F32] font-serif">済</span>
          <div>
            <strong className="text-[#BC2F32] font-sans font-bold">⛩️ Calligraphy Stamp Conferred (済):</strong> Earned upon absolute error-free completion of visual & listening trials, confirming total phonetic & writing recognition.
          </div>
        </div>
      </div>

      {activeTest === 'none' ? (
        <div className="space-y-8">
          
          {/* Rank Journey Roadmap Status Tracker */}
          <div>
            <h3 className="font-serif text-sm font-bold text-[#1A1A1A] mb-3 uppercase tracking-wider">Your Shodo Ranking Roadmap</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-[11px] font-sans">
              
              {/* Step 1 */}
              <div className={`p-2 border rounded-sm flex flex-col justify-between ${isHiraComplete ? 'bg-green-50/40 border-green-200' : 'bg-amber-50/30 border-amber-200 animate-pulse'}`}>
                <div>
                  <div className="font-semibold text-gray-400">Step 1</div>
                  <div className="font-serif font-bold text-[#1a1a1a]">ひらがな / Hiragana</div>
                </div>
                <div className={`mt-2 font-bold ${isHiraComplete ? 'text-green-600' : 'text-amber-600'}`}>
                  {isHiraComplete ? '✓ Cleared' : `${stats.hiraganaMastered}/46 Letters`}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-2 border rounded-sm flex flex-col justify-between ${
                !isHiraComplete ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-60' :
                isKataComplete ? 'bg-green-50/40 border-green-200' : 'bg-amber-50/30 border-amber-200 animate-pulse'
              }`}>
                <div>
                  <div className="font-semibold text-gray-400">Step 2</div>
                  <div className="font-serif font-bold text-[#1a1a1a]">カタカナ / Katakana</div>
                </div>
                <div className="mt-2 font-bold">
                  {!isHiraComplete ? '🔒 Locked' : isKataComplete ? '✓ Cleared' : `${stats.katakanaMastered}/46 Letters`}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-2 border rounded-sm flex flex-col justify-between ${
                !isKataComplete ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-60' :
                isBeginnerSealEarned ? 'bg-sky-50 border-sky-200' : 'bg-amber-50/30 border-amber-200 animate-pulse'
              }`}>
                <div>
                  <div className="font-semibold text-gray-400">Step 3</div>
                  <div className="font-serif font-bold text-sky-600">初伝 / Beginner Seal</div>
                </div>
                <div className="mt-2 font-bold text-sky-650">
                  {!isKataComplete ? '🔒 Locked' : isBeginnerSealEarned ? '✓ Conferred' : `${clearedRowsCount}/20 Rows`}
                </div>
              </div>

              {/* Step 4 */}
              <div className={`p-2 border rounded-sm flex flex-col justify-between ${
                !isBeginnerSealEarned ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-60' :
                isIntermediateSealEarned ? 'bg-red-50/50 border-red-200 animate-pulse' : 'bg-amber-50/30 border-amber-200'
              }`}>
                <div>
                  <div className="font-semibold text-gray-400">Step 4</div>
                  <div className="font-serif font-bold text-[#BC2F32]">中伝 / Intermediate</div>
                </div>
                <div className="mt-2 font-bold text-[#BC2F32]">
                  {!isBeginnerSealEarned ? '🔒 Locked' : isIntermediateSealEarned ? '✓ Conferred' : `${(isHiraInterPassed ? 1 : 0) + (isKataInterPassed ? 1 : 0)}/2 Cleared`}
                </div>
              </div>

              {/* Step 5 */}
              <div className={`p-2 border rounded-sm flex flex-col justify-between ${
                !isIntermediateSealEarned ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-60' :
                stats.masterSealEarned ? 'bg-neutral-900 text-white border-black' : 'bg-amber-50/30 border-amber-200 animate-pulse'
              }`}>
                <div>
                  <div className="font-semibold text-gray-400">Step 5</div>
                  <div className="font-serif font-bold">皆伝 / Supreme Master</div>
                </div>
                <div className="mt-2 font-bold">
                  {!isIntermediateSealEarned ? '🔒 Locked' : stats.masterSealEarned ? '✓ Grandmaster' : '★ Ready'}
                </div>
              </div>

            </div>
          </div>

          {/* Test Launch Pads Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Level 1: Beginner Row Test */}
            <div className={`border p-5 rounded-sm flex flex-col justify-between ${isKataComplete ? 'border-sky-300 bg-sky-50/5' : 'border-[#E5E1D8] opacity-60'}`}>
              <div>
                <span className="text-[9px] font-sans font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">初級 / Row-By-Row Trials</span>
                <h4 className="font-serif text-lg font-bold mt-2 text-[#1A1A1A]">Beginner Row Exam</h4>
                <p className="text-xs text-gray-500 font-sans mt-2 leading-relaxed">
                  Practice individual row sounds. Must pass direct visual & listening assessments of Hiragana/Katakana with 100% accuracy to earn the Beginner Seal.
                </p>

                {isKataComplete && (
                  <div className="mt-4 space-y-2 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Row Script selection:</span>
                      <div className="flex bg-[#EDE9E1] p-0.5 rounded-sm">
                        <button
                          onClick={() => setSelectedScriptType('hiragana')}
                          className={`flex-1 py-1 rounded-sm text-[10px] font-bold ${selectedScriptType === 'hiragana' ? 'bg-white shadow-xs text-[#BC2F32]' : 'text-gray-500'}`}
                        >
                          Hiragana
                        </button>
                        <button
                          onClick={() => setSelectedScriptType('katakana')}
                          className={`flex-1 py-1 rounded-sm text-[10px] font-bold ${selectedScriptType === 'katakana' ? 'bg-white shadow-xs text-[#BC2F32]' : 'text-gray-500'}`}
                        >
                          Katakana
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Select row:</span>
                      <select
                        value={selectedRowId}
                        onChange={(e) => setSelectedRowId(e.target.value)}
                        className="w-full bg-white border border-[#E5E1D8] p-1.5 rounded-sm focus:outline-none text-[11px]"
                      >
                        {GOJUON_ROWS.map(r => (
                          <option key={r.id} value={r.id}>{r.id === 'a' ? 'あ Vowels' : r.label.split(' ')[0]} Row</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                disabled={!isKataComplete}
                onClick={() => initiateTest('beginner')}
                className={`mt-6 w-full py-2.5 text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition-all ${
                  isKataComplete
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-95 text-white cursor-pointer shadow-xs'
                    : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!isKataComplete ? '🔒 Master Katakana Set First' : 'Start Row Challenge'}
              </button>
            </div>

            {/* Level 2: Intermediate Set Exam */}
            <div className={`border p-5 rounded-sm flex flex-col justify-between ${isBeginnerSealEarned ? 'border-red-300 bg-red-50/5' : 'border-[#E5E1D8] opacity-60'}`}>
              <div>
                <span className="text-[9px] font-sans font-bold text-[#BC2F32] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full border border-red-100">中級 / Full Syllabary Trial</span>
                <h4 className="font-serif text-lg font-bold mt-2 text-[#1A1A1A]">Intermediate Set Exam</h4>
                <p className="text-xs text-gray-500 font-sans mt-2 leading-relaxed">
                  Test the complete set of Hiragana or Katakana. Contains 10 rapid randomized phonetic matching and reverse reading trials.
                </p>

                {isBeginnerSealEarned && (
                  <div className="mt-4 p-2 bg-[#FCFAF7] border border-[#E5E1D8] rounded text-[11px] space-y-1">
                    <div className="text-gray-400 font-bold text-[9px] uppercase tracking-widest block mb-1">Target Script:</div>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="inter_script"
                          checked={selectedScriptType === 'hiragana'}
                          onChange={() => setSelectedScriptType('hiragana')}
                          className="accent-[#BC2F32]"
                        />
                        <span>Hiragana ({isHiraInterPassed ? '済' : 'No Seal'})</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="inter_script"
                          checked={selectedScriptType === 'katakana'}
                          onChange={() => setSelectedScriptType('katakana')}
                          className="accent-[#BC2F32]"
                        />
                        <span>Katakana ({isKataInterPassed ? '済' : 'No Seal'})</span>
                      </label>
                    </div>

                    {isInterCooldownActive && (
                      <div className="mt-2 text-rose-700 font-bold flex items-center gap-1 text-[10px]">
                        <Clock size={11} />
                        <span>Daily Lock: retry in {formatCooldown(interCooldownRemaining)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                disabled={!isBeginnerSealEarned || isInterCooldownActive}
                onClick={() => initiateTest('intermediate')}
                className={`mt-6 w-full py-2.5 text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition-all ${
                  isBeginnerSealEarned && !isInterCooldownActive
                    ? 'bg-gradient-to-r from-[#BC2F32] to-[#da2222] hover:opacity-95 text-white cursor-pointer shadow-xs'
                    : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!isBeginnerSealEarned ? '🔒 Earn Beginner Seal First' : isInterCooldownActive ? '🔒 Cooldown Locked' : `Launch ${selectedScriptType === 'hiragana' ? 'Hiragana' : 'Katakana'} Trial`}
              </button>
            </div>

            {/* Level 3: Grand Master Combo Trial */}
            <div className={`border p-5 rounded-sm flex flex-col justify-between ${isIntermediateSealEarned ? 'border-neutral-500 bg-neutral-50' : 'border-[#E5E1D8] opacity-60'}`}>
              <div>
                <span className="text-[9px] font-sans font-bold text-gray-700 uppercase tracking-widest bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">真伝 / Supreme Combo Trial</span>
                <h4 className="font-serif text-lg font-bold mt-2 text-[#1A1A1A]">Supreme Master Exam</h4>
                <p className="text-xs text-gray-500 font-sans mt-2 leading-relaxed">
                  The ultimate phonetic check. 15 questions covering mixed Hiragana + Katakana visual identification, rapid hearing trials, and comprehensive spelling checks.
                </p>

                {isIntermediateSealEarned && isMasterCooldownActive && (
                  <div className="mt-4 p-2 bg-red-50 text-rose-700 font-bold border border-red-100 rounded text-[10px] flex items-center gap-1">
                    <Clock size={11} />
                    <span>Daily Lock: retry in {formatCooldown(masterCooldownRemaining)}</span>
                  </div>
                )}
              </div>

              <button
                disabled={!isIntermediateSealEarned || isMasterCooldownActive}
                onClick={() => initiateTest('master')}
                className={`mt-6 w-full py-2.5 text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition-all ${
                  isIntermediateSealEarned && !isMasterCooldownActive
                    ? 'bg-black text-white hover:bg-neutral-900 cursor-pointer shadow-md'
                    : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!isIntermediateSealEarned ? '🔒 Get Intermediate Seal First' : isMasterCooldownActive ? '🔒 Cooldown Locked' : 'Start Supreme Master Exam'}
              </button>
            </div>

          </div>

          {/* List of Beginner Rows Checkbox Checklist */}
          {isKataComplete && (
            <div className="bg-[#FCFAF7] border border-[#E5E1D8] p-5 rounded-sm">
              <h4 className="font-serif text-[13px] font-bold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-sky-600" />
                <span>Beginner Row Completion Board ({clearedRowsCount} / 20 Cleared)</span>
              </h4>
              <p className="text-[11px] text-gray-400 font-sans mb-4">
                You must clear all rows below with a 100% perfect scorecard (no wrong answers) to earn the Beginner Seal.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] font-sans">
                {['hiragana', 'katakana'].map(script => (
                  <React.Fragment key={script}>
                    {GOJUON_ROWS.map(row => {
                      const id = `${script}_${row.id}`;
                      const isRowCleared = stats.beginnerSeals?.includes(id);
                      return (
                        <div 
                          key={id} 
                          onClick={() => {
                            setSelectedScriptType(script as any);
                            setSelectedRowId(row.id);
                          }}
                          className={`p-2 border rounded-sm flex items-center justify-between cursor-pointer transition ${
                            isRowCleared 
                              ? 'bg-green-50/40 border-green-300 text-green-800' 
                              : selectedScriptType === script && selectedRowId === row.id
                              ? 'bg-sky-50 border-sky-400 text-sky-800'
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span className="truncate">{script === 'hiragana' ? 'Hira' : 'Kata'}-{row.id.toUpperCase()} ({row.label.split(' ')[0]})</span>
                          {isRowCleared ? (
                            <Check size={11} className="text-green-600 font-bold" />
                          ) : (
                            <span className="text-[8px] text-gray-300 uppercase">Todo</span>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Re-designed Highly Polished Calligraphy Certificates Tray */}
          <div className="border-t border-[#E5E1D8] pt-8 mt-4">
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-2" id="kakejiku-certificates-tray">
              <ShieldCheck className="text-[#BC2F32]" size={22} />
              <span>修業の印可書 / Calligraphy Scroll Portfolio</span>
            </h3>
            <p className="text-xs text-gray-400 font-sans mb-6 max-w-4xl">
              Authentic traditional portrait hanging scrolls (Kakejiku style) dynamically unlocked as formal milestones of your penmanship journey. Download high-resolution verifiable PNG credentials below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">

              {/* Scroll 1: Vowel Mastery */}
              {(() => {
                const hiraVowels = ['あ', 'い', 'う', 'え', 'お'];
                const kataVowels = ['ア', 'イ', 'ウ', 'エ', 'オ'];
                const hiraVowelsCleared = hiraVowels.every(c => masteredChars.includes(c));
                const kataVowelsCleared = kataVowels.every(c => masteredChars.includes(c));
                const unlocked = hiraVowelsCleared && kataVowelsCleared;

                return (
                  <div className={`relative flex flex-col items-center p-3 border-2 rounded-xs select-none shadow-sm transition-all duration-300 ${
                    unlocked 
                      ? 'bg-[#FCFAF7] border-[#BC2F32] scale-102 hover:shadow-lg' 
                      : 'bg-gray-50 border-gray-200 opacity-55'
                  }`}>
                    {/* Hanging Ribbons Accent for traditional Japanese scroll look */}
                    <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 flex gap-4 z-10 pointer-events-none">
                      <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                      <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                    </div>

                    <div className="w-full h-full border border-dashed border-[#E5E1D8] p-3 flex flex-col justify-between items-center text-center">
                      <div className="space-y-2 w-full">
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-[8px] font-sans font-black px-1.5 py-0.5 rounded ${unlocked ? 'bg-sky-50 text-sky-800' : 'bg-gray-100 text-gray-400'}`}>
                            {unlocked ? 'Certified' : 'Locked'}
                          </span>
                        </div>
                        
                        <div className="font-serif text-[11px] font-bold text-gray-400 tracking-tighter block uppercase">Shoden scroll I</div>
                        <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">Vowel Mastery Scroll</h4>
                        <div className="h-0.5 w-10 bg-[#BC2F32] mx-auto mt-2" />
                        <p className="text-[10px] text-gray-450 mt-1 leading-normal font-sans pt-1">
                          Conferred for perfectly mastering Hiragana and Katakana vowels (A, I, U, E, O).
                        </p>
                      </div>

                      <div className="w-full mt-4">
                        <button
                          onClick={() => {
                            if (!unlocked) {
                              alert("🔒 To unlock, master the vowel row (A, I, U, E, O) for both Hiragana and Katakana!");
                              return;
                            }
                            setCertConfig({
                              isOpen: true,
                              title: "Shoden Vowel Calligraphy Scroll",
                              subtitle: "初伝・五母音習得の証",
                              badgeLabel: "Beginner",
                              badgeChar: "初",
                              sealColor: "sky",
                              description: "Verified masterly control over all basic vocal letters of Hiragana and Katakana alphabets."
                            });
                          }}
                          className={`w-full py-2 text-[9px] uppercase font-sans font-bold tracking-widest rounded-xs border transition ${
                            unlocked 
                              ? 'bg-[#1A1A1A] hover:bg-[#BC2F32] hover:border-[#BC2F32] text-white border-transparent cursor-pointer' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          }`}
                        >
                          {unlocked ? 'View Scroll' : '🔒 Master Vowels'}
                        </button>
                        <div className="h-2 w-full bg-amber-900/10 rounded-b-xs border-t border-amber-900/20 mt-2 block" />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Scroll 2: Beginner Seal */}
              <div className={`relative flex flex-col items-center p-3 border-2 rounded-xs select-none shadow-sm transition-all duration-300 ${
                isBeginnerSealEarned 
                  ? 'bg-[#FCFAF7] border-[#BC2F32] scale-102 hover:shadow-lg' 
                  : 'bg-gray-50 border-gray-200 opacity-55'
              }`}>
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 flex gap-4 z-10 pointer-events-none">
                  <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                  <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                </div>

                <div className="w-full h-full border border-dashed border-[#E5E1D8] p-3 flex flex-col justify-between items-center text-center">
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[8px] font-sans font-black px-1.5 py-0.5 rounded ${isBeginnerSealEarned ? 'bg-sky-50 text-sky-850' : 'bg-gray-100 text-gray-400'}`}>
                        {isBeginnerSealEarned ? 'Conferred' : 'Locked'}
                      </span>
                    </div>
                    
                    <div className="font-serif text-[11px] font-bold text-gray-400 tracking-tighter block uppercase">Shoden scroll II</div>
                    <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">Beginner Shodo Scroll</h4>
                    <div className="h-0.5 w-10 bg-[#BC2F32] mx-auto mt-2" />
                    <p className="text-[10px] text-gray-450 mt-1 leading-normal font-sans pt-1">
                      Awarded for clearing all 10 Hiragana + 10 Katakana Gojuon rows with absolute zero mistakes.
                    </p>
                  </div>

                  <div className="w-full mt-4">
                    <button
                      onClick={() => {
                        if (!isBeginnerSealEarned) {
                          alert("🔒 To unlock, pass all 20 basic rows in the Beginner certification board with 100% scores!");
                          return;
                        }
                        setCertConfig({
                          isOpen: true,
                          title: "Shoden Beginner Shodo Credential",
                          subtitle: "初伝・基本五十音免状",
                          badgeLabel: "Shoden",
                          badgeChar: "初",
                          sealColor: "sky",
                          description: "Commemorating perfect execution of all 46 basic characters and variations under strict time and accuracy guidelines."
                        });
                      }}
                      className={`w-full py-2 text-[9px] uppercase font-sans font-bold tracking-widest rounded-xs border transition ${
                        isBeginnerSealEarned 
                          ? 'bg-[#1A1A1A] hover:bg-[#BC2F32] hover:border-[#BC2F32] text-white border-transparent cursor-pointer' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      }`}
                    >
                      {isBeginnerSealEarned ? 'View Scroll' : '🔒 Clear Beginner Rows'}
                    </button>
                    <div className="h-2 w-full bg-amber-900/10 rounded-b-xs border-t border-amber-900/20 mt-2 block" />
                  </div>
                </div>
              </div>

              {/* Scroll 3: Chuden (Intermediate) */}
              <div className={`relative flex flex-col items-center p-3 border-2 rounded-xs select-none shadow-sm transition-all duration-300 ${
                isIntermediateSealEarned 
                  ? 'bg-[#FCFAF7] border-[#BC2F32] scale-102 hover:shadow-lg' 
                  : 'bg-gray-50 border-gray-200 opacity-55'
              }`}>
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 flex gap-4 z-10 pointer-events-none">
                  <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                  <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                </div>

                <div className="w-full h-full border border-dashed border-[#E5E1D8] p-3 flex flex-col justify-between items-center text-center">
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[8px] font-sans font-black px-1.5 py-0.5 rounded ${isIntermediateSealEarned ? 'bg-[#BC2F32]/10 text-[#BC2F32]' : 'bg-gray-100 text-gray-400'}`}>
                        {isIntermediateSealEarned ? 'Conferred' : 'Locked'}
                      </span>
                    </div>
                    
                    <div className="font-serif text-[11px] font-bold text-gray-400 tracking-tighter block uppercase">Chuden Scroll</div>
                    <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">Intermediate Shodo Scroll</h4>
                    <div className="h-0.5 w-10 bg-[#BC2F32] mx-auto mt-2" />
                    <p className="text-[10px] text-gray-450 mt-1 leading-normal font-sans pt-1">
                      Awarded for clearing both full Hiragana and Katakana intermediate trials with 100% scores.
                    </p>
                  </div>

                  <div className="w-full mt-4">
                    <button
                      onClick={() => {
                        if (!isIntermediateSealEarned) {
                          alert("🔒 To unlock, pass both the Hiragana and Katakana intermediate set tests on the certification board!");
                          return;
                        }
                        setCertConfig({
                          isOpen: true,
                          title: "Chuden Intermediate Shodo License",
                          subtitle: "中伝・中級書道免状",
                          badgeLabel: "Chuden",
                          badgeChar: "中",
                          sealColor: "red",
                          description: "Deemed proficient in phonetic sound alignment and prompt writing translations of both Hiragana and Katakana syllabaries."
                        });
                      }}
                      className={`w-full py-2 text-[9px] uppercase font-sans font-bold tracking-widest rounded-xs border transition ${
                        isIntermediateSealEarned 
                          ? 'bg-[#1A1A1A] hover:bg-[#BC2F32] hover:border-[#BC2F32] text-white border-transparent cursor-pointer' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      }`}
                    >
                      {isIntermediateSealEarned ? 'View Scroll' : '🔒 Clear Inter Tests'}
                    </button>
                    <div className="h-2 w-full bg-amber-900/10 rounded-b-xs border-t border-amber-900/20 mt-2 block" />
                  </div>
                </div>
              </div>

              {/* Scroll 4: Kaiden (Master) */}
              <div className={`relative flex flex-col items-center p-3 border-2 rounded-xs select-none shadow-sm transition-all duration-300 ${
                stats.masterSealEarned 
                  ? 'bg-[#1A1A1A] text-white border-black scale-102 hover:shadow-lg' 
                  : 'bg-gray-50 border-gray-200 opacity-55'
              }`}>
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 flex gap-4 z-10 pointer-events-none">
                  <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                  <div className="w-1 h-3 bg-[#BC2F32]/100 rounded-b-sm" />
                </div>

                <div className="w-full h-full border border-dashed border-[#E5E1D8]/20 p-3 flex flex-col justify-between items-center text-center">
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[8px] font-sans font-black px-1.5 py-0.5 rounded ${stats.masterSealEarned ? 'bg-[#BC2F32] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {stats.masterSealEarned ? 'KAIDEN MASTER' : 'Locked'}
                      </span>
                    </div>
                    
                    <div className={`font-serif text-[11px] font-bold tracking-tighter block uppercase ${stats.masterSealEarned ? 'text-gray-400' : 'text-gray-400'}`}>Kaiden Scroll</div>
                    <h4 className={`font-serif text-sm font-bold ${stats.masterSealEarned ? 'text-white' : 'text-[#1A1A1A]'}`}>Supreme Kaiden Scroll</h4>
                    <div className="h-0.5 w-10 bg-[#BC2F32] mx-auto mt-2" />
                    <p className={`text-[10px] mt-1 leading-normal font-sans pt-1 ${stats.masterSealEarned ? 'text-gray-300' : 'text-gray-450'}`}>
                      Conferred for surviving the Grand Master trial - 15 supreme random listening characters with no mistakes.
                    </p>
                  </div>

                  <div className="w-full mt-4">
                    <button
                      onClick={() => {
                        if (!stats.masterSealEarned) {
                          alert("🔒 To unlock, conquer the mixed 15-character Supreme Master Exam on the board!");
                          return;
                        }
                        setCertConfig({
                          isOpen: true,
                          title: "Kaiden Supreme Master Shodo License",
                          subtitle: "皆伝・書道大極意皆伝免状",
                          badgeLabel: "Kaiden",
                          badgeChar: "極",
                          sealColor: "black",
                          description: "The absolute pinnacle of shodo recognition. Demonstrated flawless audio decoding, reading translation, and structural comprehension."
                        });
                      }}
                      className={`w-full py-2 text-[9px] uppercase font-sans font-bold tracking-widest rounded-xs border transition ${
                        stats.masterSealEarned 
                          ? 'bg-[#BC2F32] hover:bg-red-800 text-white border-transparent cursor-pointer' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      }`}
                    >
                      {stats.masterSealEarned ? 'View Scroll' : '🔒 Conquer Master Exam'}
                    </button>
                    <div className="h-2 w-full bg-amber-900/10 rounded-b-xs border-t border-amber-900/20 mt-2 block" />
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      ) : (
        // ACTIVE TEST EXAM WORKSPACE - Re-designed to center beautifully on 1 column
        <div className="bg-[#FCFAF7] border border-[#E5E1D8] p-6 max-w-xl mx-auto rounded-sm relative shadow-sm" id="test-exam-workspace-container">
          
          {/* Top Status Indicators bar */}
          <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-sans font-black tracking-widest text-red-700 bg-red-50 border border-red-100 rounded px-2 py-0.5 uppercase">
                {activeTest === 'beginner' ? 'Beginner Row Test' :
                 activeTest === 'intermediate' ? `Intermediate ${selectedScriptType.toUpperCase()}` : 'Supreme MasterMixed Trial'}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-[10px] font-sans font-bold text-gray-400">
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>
            
            <div className="text-[9px] font-sans text-rose-700 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
              <span>STRICT PERFECT MODE</span>
            </div>
          </div>

          {!testCompleted ? (
            <div className="space-y-6">
              
              {/* Question prompt block */}
              <div className="bg-white border border-[#E5E1D8] p-5 rounded-sm shadow-xs">
                <span className="text-[8px] font-sans font-black tracking-wider text-gray-400 uppercase block mb-1">Trial Task</span>
                
                <h4 className="font-serif text-sm font-bold text-[#1A1A1A] leading-relaxed mb-3">
                  {currentQuestion.subType === 'char_to_romaji' 
                    ? "Identify the correct Romanization (Romaji) matching the character shown below:"
                    : currentQuestion.subType === 'romaji_to_char'
                    ? `Identify the matching visual character for the sound "${currentQuestion.character.romaji.toUpperCase()}":`
                    : "Listen to the auditive sound carefully and select the matched character glyph:"}
                </h4>

                {/* Display Question Target glyph or Sound Play icon trigger button */}
                <div className="h-36 bg-[#FAFAFA] rounded border border-dashed border-[#E5E1D8] flex flex-col items-center justify-center mb-6 p-4">
                  {currentQuestion.subType === 'char_to_romaji' ? (
                    <span className="font-serif text-6xl font-bold text-[#1a1a1a]">{currentQuestion.character.char}</span>
                  ) : currentQuestion.subType === 'romaji_to_char' ? (
                    <span className="font-serif text-4xl font-extrabold text-[#BC2F32] tracking-wider">"{currentQuestion.character.romaji.toUpperCase()}"</span>
                  ) : (
                    // Listening test subtypes (draw_from_audio transformed to multiple choice listening test!)
                    <div className="flex flex-col items-center gap-3">
                      <button
                        onClick={() => speakCharacter(currentQuestion.character.char)}
                        className="w-14 h-14 bg-[#BC2F32] hover:bg-red-800 text-white rounded-full shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                        title="Play audio pronunciation"
                      >
                        <Volume2 size={24} className="animate-pulse" />
                      </button>
                      <span className="text-[10px] text-gray-400 font-sans tracking-wide">
                        Click to play / repeat sound
                      </span>
                    </div>
                  )}
                </div>

                {/* confusing multiple selection choices with 4 candidates */}
                <div className="grid grid-cols-2 gap-3" id="test-multiple-choice-buttons">
                  {currentQuestion.choices.map((choice, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => selectChoice(cIdx)}
                      disabled={hasSubmittedChoice}
                      className={`p-4 border rounded text-center transition flex justify-center items-center font-bold text-sm h-14 ${
                        hasSubmittedChoice
                          ? choice.correct
                            ? 'bg-green-50 border-green-400 text-green-700 font-extrabold shadow-sm'
                            : selectedChoiceIdx === cIdx
                            ? 'bg-red-50 border-red-400 text-red-700 font-extrabold shadow-sm animate-shake'
                            : 'bg-white border-gray-150 text-gray-300'
                          : 'bg-white border-gray-200 hover:border-black active:bg-gray-50 text-gray-800 cursor-pointer text-base shadow-xs'
                      }`}
                    >
                      <span className="font-serif text-base">{choice.text}</span>
                    </button>
                  ))}
                </div>

              </div>

              {/* Sudden exit button to abort the exam */}
              <button
                onClick={() => {
                  if (confirm("Cancel this trial? You will forfeit any current progress.")) {
                    setActiveTest('none');
                  }
                }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-sm text-[10px] uppercase font-sans font-black tracking-widest transition cursor-pointer"
              >
                Abort Calligraphy Trial
              </button>

            </div>
          ) : (
            // TEST SOLUTIONS PERFORMANCE SUMMARY REPORT
            <div className="space-y-6 text-center">
              
              {isTestPassed ? (
                // SUCCESS CERTIFICATION DISPLAY
                <div className="space-y-6 animate-scale-spring">
                  <div className="w-20 h-20 rounded-full border-4 border-double border-[#BC2F32] bg-red-50 flex items-center justify-center text-3xl text-[#BC2F32] mx-auto rotate-[-12deg] shadow-sm">
                    済
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-black text-gray-905">書道免許印可 / Trial Passed!</h3>
                    <p className="text-xs text-gray-400 font-sans mt-2 max-w-sm mx-auto">
                      Congratulations! You demonstrated flawless phonetic recognition and spelling accuracy on this exam.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50/50 border border-green-150 rounded text-green-800 text-[11px] text-left leading-relaxed font-sans max-w-md mx-auto space-y-1.5 shadow-sm">
                    <strong className="block text-green-900 uppercase tracking-wide">⛩️ Scroll unlocked:</strong>
                    <span>Your traditional calligrapher scroll has been unlocked inside the portfolio tray below! You may now open and view your credential.</span>
                  </div>

                  <button
                    onClick={() => setActiveTest('none')}
                    className="py-2.5 px-6 bg-black hover:bg-neutral-900 text-white text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition shadow-md cursor-pointer"
                  >
                    Return to Center
                  </button>
                </div>
              ) : (
                // FAILED EXAM AND DETAILED SOLUTION REPORT
                <div className="space-y-6 text-left">
                  
                  <div className="text-center pt-2">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-[#BC2F32] mx-auto text-2xl font-black mb-3">
                      ✕
                    </div>
                    <h3 className="font-serif text-xl font-bold text-gray-905">Trial Interrupted / Mistake Made</h3>
                    <p className="text-xs text-gray-400 font-sans mt-2 leading-relaxed max-w-sm mx-auto">
                      To earn a formal Calligrapher Seal, <strong>100% perfect accuracy</strong> is strictly required. No mistakes are permitted in the trials.
                    </p>
                  </div>

                  {/* Solutions Performance Report Details block */}
                  <div className="bg-[#FCFAF7] border border-[#E5E1D8] p-5 rounded-sm space-y-4 font-sans text-xs shadow-inner">
                    <div className="border-b border-[#E5E1D8] pb-2 text-gray-700 font-bold uppercase text-[10px] tracking-widest flex items-center gap-1.5">
                      <FileText size={14} className="text-[#BC2F32]" />
                      <span>Detailed Error Performance Report & Solution</span>
                    </div>

                    {(() => {
                      const failedQu = questions[failedQuestionIndex];
                      if (!failedQu) return <p className="text-gray-400">Loading details...</p>;
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                          <div className="sm:col-span-8 space-y-2.5">
                            <div>
                              <span className="text-gray-400 block tracking-tight uppercase text-[9px] font-bold">Failed Character:</span>
                              <span className="text-xl font-serif font-black text-[#1A1A1A]">
                                {failedQu.character.char} ({failedQu.character.type.toUpperCase()})
                              </span>
                            </div>

                            <div>
                              <span className="text-gray-400 block tracking-tight uppercase text-[9px] font-bold">Correct Romanization (Romaji):</span>
                              <span className="font-serif font-bold text-[#BC2F32] bg-red-50 border border-red-50 text-xs px-2 py-0.5 rounded uppercase">
                                "{failedQu.character.romaji.toUpperCase()}"
                              </span>
                            </div>

                            {failedQu.character.mnemonic && (
                              <div>
                                <span className="text-gray-400 block tracking-tight uppercase text-[9px] font-bold">Memory Mnemonic Clue:</span>
                                <span className="text-[11.5px] italic text-gray-500 font-serif leading-relaxed">"{failedQu.character.mnemonic}"</span>
                              </div>
                            )}

                            <div className="pt-1">
                              <button
                                onClick={() => speakCharacter(failedQu.character.char)}
                                className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 border border-gray-300 rounded text-[10px] font-bold transition focus:outline-none cursor-pointer shadow-xs"
                              >
                                <Volume2 size={13} className="text-[#BC2F32]" />
                                <span>Listen Pronunciation</span>
                              </button>
                            </div>
                          </div>

                          {/* Static Stroke Order illustration of the missed character */}
                          <div className="sm:col-span-4 bg-white border border-[#E5E1D8] p-3 rounded-sm flex flex-col items-center">
                            <span className="text-[8px] font-bold text-[#BC2F32] uppercase tracking-widest block mb-1.5 text-center">Stroke Sequence Reference</span>
                            
                            {/* Display character step by step image from KanjiVG */}
                            <div className="w-20 h-20 bg-[#FAFAFA] rounded border border-dashed border-[#E5E1D8] flex items-center justify-center p-1.5">
                              <img 
                                src={`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${failedQu.character.char.codePointAt(0)!.toString(16).toLowerCase().padStart(5, '0')}.svg`}
                                className="w-16 h-16 object-contain"
                                alt="Correct stroke order reference diagram"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            
                            <span className="text-[8px] text-gray-400 leading-normal text-center mt-1.5">
                              Order contains {failedQu.character.strokes} strokes. Study in character cards!
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => {
                        setActiveTest('none');
                      }}
                      className="flex-1 py-3 text-center border border-gray-300 hover:bg-gray-50 text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition text-gray-700 cursor-pointer"
                    >
                      Close Report
                    </button>

                    <button
                      onClick={() => {
                        initiateTest(activeTest);
                      }}
                      className="flex-1 py-3 text-center bg-[#BC2F32] hover:bg-red-800 text-white text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition shadow-sm cursor-pointer"
                    >
                      Try Trial Again
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Dynamic Master Certification Portrait Window Overlay */}
      {certConfig.isOpen && (
        <CertificateView
          isOpen={certConfig.isOpen}
          onClose={() => setCertConfig({ ...certConfig, isOpen: false })}
          title={certConfig.title}
          subtitle={certConfig.subtitle}
          badgeLabel={certConfig.badgeLabel}
          badgeChar={certConfig.badgeChar}
          sealColor={certConfig.sealColor}
          recipientName="Master Calligrapher (You)"
          dateString={new Date().toLocaleDateString('ja-JP', {year: 'numeric', month: 'long', day: 'numeric'})}
          description={certConfig.description}
        />
      )}

    </div>
  );
};
