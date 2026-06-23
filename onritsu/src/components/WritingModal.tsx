import React, { useEffect, useState } from 'react';
import { JapaneseCharacter } from '../types';
import { speakJapanese, playSuccessChime, playInkDip } from '../utils/audio';
import { Sparkles, Volume2, BookOpen, Layers } from 'lucide-react';

interface WritingModalProps {
  character: JapaneseCharacter;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (score: number) => void;
  onFailure: () => void;
  soundEnabled: boolean;
}

/**
 * Detailed Tofugu-style Pronunciation Guidance descriptions
 */
export const getPronunciationGuide = (romaji: string): string => {
  const r = romaji.toLowerCase();
  if (r === 'a') return 'Pronounced like the "ah!" in "father" or "car", like when you make a realization.';
  if (r === 'i') return 'Pronounced like the "ee" in "eel" or "meet".';
  if (r === 'u') return 'Pronounced like the "ooh" in "ooh, ahh!" or "u" in "UNO".';
  if (r === 'e') return 'Pronounced like the "e" in "egg" or "mess".';
  if (r === 'o') return 'Pronounced like the "o" in "origami" or "oh".';
  if (r === 'ka') return 'Pronounced like the "ka" in "karma". It is the K sound combined with "a".';
  if (r === 'ki') return 'Pronounced like the "kee" in "key".';
  if (r === 'ku') return 'Pronounced like the "koo" in "cuckoo" or "coo-coo".';
  if (r === 'ke') return 'Pronounced like the "ke" in "kelp".';
  if (r === 'ko') return 'Pronounced like the "co" in "cohabitating" or resembles "coin".';
  if (r === 'sa') return 'Pronounced like the "sa" in "salsa".';
  if (r === 'shi') return 'Pronounced like the "shee" in "sheep". Note this is an exception (shi instead of si).';
  if (r === 'su') return 'Pronounced like "sue" or the "su" in "suit".';
  if (r === 'se') return 'Pronounced like the "se" in "sell".';
  if (r === 'so') return 'Pronounced like the "so" in "soda".';
  if (r === 'ta') return 'Pronounced like the "ta" in "taco".';
  if (r === 'chi') return 'Pronounced like the "chee" in "cheese". Note this is an exception (chi instead of ti).';
  if (r === 'tsu') return 'Pronounced like the "tsu" in "tsunami". Note this is an exception (tsu instead of tu).';
  if (r === 'te') return 'Pronounced like the "te" in "telescope" or "telephone".';
  if (r === 'to') return 'Pronounced like the "to" in "toe".';
  if (r === 'na') return 'Pronounced like the "na" in "nachos".';
  if (r === 'ni') return 'Pronounced like the "nee" in "needle".';
  if (r === 'nu') return 'Pronounced like the "noo" in "noodle".';
  if (r === 'ne') return 'Pronounced like the "ne" in "Nelly".';
  if (r === 'no') return 'Pronounced like the "no" in "nose".';
  if (r === 'ha') return 'Pronounced like the "ha" in "haha" (laughing!).';
  if (r === 'hi') return 'Pronounced like the "he" in "heat".';
  if (r === 'fu') return 'Pronounced like the softly blown-out "fu" / "hu" sound in "fool".';
  if (r === 'he') return 'Pronounced like the "he" in "help".';
  if (r === 'ho') return 'Pronounced like the "ho" in "hoe".';
  if (r === 'ma') return 'Pronounced like the "ma" in "mark" or "mama".';
  if (r === 'mi') return 'Pronounced like the "me" in "meet".';
  if (r === 'mu') return 'Pronounced like the "moo" in "mood" (cow voice!).';
  if (r === 'me') return 'Pronounced like the "me" in "mess" or "makeup".';
  if (r === 'mo') return 'Pronounced like the "mo" in "more".';
  if (r === 'ya') return 'Pronounced like the "ya" in "yacht" or "yak".';
  if (r === 'yu') return 'Pronounced like the English word "you".';
  if (r === 'yo') return 'Pronounced like the "yo" in "yo-yo" or "yonder".';
  if (r === 'ra') return 'Pronounced like the combination of "r" / "l" in "ra" or "la".';
  if (r === 'ri') return 'Pronounced like the "ree" in "reed" or "lee" in "leek".';
  if (r === 'ru') return 'Pronounced like the combination "ru" in "rule" or "loo" in "loop".';
  if (r === 're') return 'Pronounced like the "re" in "retch" or "le" in "led".';
  if (r === 'ro') return 'Pronounced like the "ro" in "road".';
  if (r === 'wa') return 'Pronounced like the "wa" in "wasabi".';
  if (r === 'wo') return 'Pronounced exactly like "o" in "origami". Often used as object particle.';
  if (r === 'n') return 'Pronounced like the ending "n" in "pen" or "pin".';
  return `Pronounced as the consonant/vowel syllable sound "${romaji}".`;
};

/**
 * Returns the stable KanjiVG URL for stroke order diagram rendering.
 */
export const getKanjivgUrl = (char: string): string => {
  const codePoint = char.codePointAt(0);
  if (!codePoint) return '';
  const hex = codePoint.toString(16).toLowerCase().padStart(5, '0');
  return `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
};

export const WritingModal: React.FC<WritingModalProps> = ({
  character,
  isOpen,
  onClose,
  onSuccess,
  onFailure,
  soundEnabled
}) => {
  const [imageError, setImageError] = useState(false);

  // Auto-play pronunciation upon arrival
  useEffect(() => {
    if (isOpen && character) {
      speakJapanese(character.char);
      if (soundEnabled) playInkDip();
      setImageError(false); // Reset error state on character change
    }
  }, [isOpen, character, soundEnabled]);

  if (!isOpen) return null;

  const handlePlayVoice = () => {
    speakJapanese(character.char);
  };

  const handleCompletePractice = () => {
    if (soundEnabled) playSuccessChime();
    onSuccess(100); // 100% mastery score as they reviewed the textbook details!
    onClose();
  };

  const kanjivgImageSrc = getKanjivgUrl(character.char);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md overflow-y-auto animate-fade-in" id="writing-modal-overlay">
      <div className="relative bg-white w-full max-w-[620px] shadow-2xl rounded-sm border border-[#E5E1D8] flex flex-col justify-between animate-zoom-in" id="practice-modal-body">
        
        {/* Modal Top Header Bar */}
        <div className="flex justify-between items-center w-full px-6 py-4 border-b border-[#FAF9F5] bg-[#FCFAF7]">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-serif font-black text-[#1A1A1A] leading-none">{character.char}</span>
            <span className="text-[9px] font-sans font-bold tracking-widest text-[#BC2F32] bg-[#BC2F32]/10 px-2.5 py-1 rounded-sm uppercase">
              {character.type}
            </span>
            <span className="text-xs text-gray-400 font-sans tracking-wide">
              {character.strokes} {character.strokes === 1 ? 'stroke' : 'strokes'} order study
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-black transition-colors focus:outline-none leading-none p-1"
            title="Close Guide"
            id="btn-close-modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]" id="modal-content-area">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Box: Elegant displaying character box or KanjiVG Stroke order SVG */}
            <div className="col-span-1 md:col-span-5 flex flex-col items-center">
              
              {/* Genkouyoushi Style Grid Reference with KanjiVG Image */}
              <div 
                className="relative w-44 h-44 bg-[#F8F5F0] rounded border border-[#E5E1D8] flex items-center justify-center select-none overflow-hidden group shadow-inner"
                title={`${character.char} stroke order image`}
                id="main-character-illustration"
              >
                {/* Traditional Genkouyoushi guide grid dashes */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  {/* Subtle red crosshairs */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-[#BC2F32]/15 border-dashed" />
                    <div className="border-b border-[#BC2F32]/15 border-dashed" />
                    <div className="border-r border-[#BC2F32]/15 border-dashed" />
                  </div>
                </div>

                {!imageError && kanjivgImageSrc ? (
                  <img
                    src={kanjivgImageSrc}
                    alt={`Stroke order diagram of ${character.char}`}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="relative w-36 h-36 object-contain z-10 p-2 transition-transform group-hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="text-[96px] font-serif text-[#1A1A1A] leading-none text-center select-none transform transition-transform group-hover:scale-105 duration-300 z-10" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {character.char}
                  </div>
                )}

                {/* Corner indicator */}
                <span className="absolute bottom-1.5 right-1.5 p-1 bg-white/90 border border-gray-100 rounded shadow-xs text-xs font-serif font-black text-[#BC2F32] z-20">
                  {character.strokes}画
                </span>
              </div>

              {/* Sound Option Button */}
              <button
                onClick={handlePlayVoice}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#BC2F32]/5 hover:bg-[#BC2F32]/10 active:bg-[#BC2F32]/20 text-[#BC2F32] text-xs font-sans font-black tracking-widest rounded-full transition-all border border-[#BC2F32]/15 shadow-sm"
                id="speak-guidance-btn"
              >
                <Volume2 size={15} className="animate-pulse" />
                <span>HEAR SOUND ({character.romaji.toUpperCase()})</span>
              </button>
            </div>

            {/* Right Box: Tofugu Learning mnemonic and explanations */}
            <div className="col-span-1 md:col-span-7 flex flex-col gap-4">
              
              {/* Box 1: Pronunciation info */}
              <div className="bg-[#FCFAF7] border border-[#E5E1D8] p-4 rounded-sm" id="pronounce-commentary-box">
                <h4 className="text-[10px] uppercase font-sans font-black text-gray-500 tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[#BC2F32]" />
                  <span>How to Pronounce "{character.romaji}"</span>
                </h4>
                <p className="text-[#1A1A1A] font-sans text-xs leading-relaxed">
                  {getPronunciationGuide(character.romaji)}
                </p>
              </div>

              {/* Box 2: Memory visual tip */}
              {character.mnemonic && (
                <div className="bg-amber-50/60 border border-amber-250/50 p-4 rounded-sm" id="reminder-card">
                  <h4 className="text-[10px] uppercase font-sans font-black text-amber-800 tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-600" />
                    <span>Memory Association Hint</span>
                  </h4>
                  <p className="text-[#1A1A1A] font-serif text-[12.5px] leading-relaxed italic">
                    "{character.mnemonic}"
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Layout Row: Stroke steps sequence instruction descriptions */}
          <div className="mt-8 border-t border-gray-100 pt-6" id="stroke-steps-strip-block">
            <h4 className="text-[11px] uppercase tracking-wider font-sans font-extrabold text-[#BC2F32] mb-4 flex items-center gap-1.5">
              <Layers size={13} className="text-[#BC2F32]" />
              <span>Step-by-Step Stroke Instructions</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="static-step-list-grid">
              {character.markers && character.markers.length > 0 ? (
                character.markers.map((marker, idx) => {
                  const arrowIndicator = marker.directionArrow ? ` [Directed ${marker.directionArrow}]` : '';
                  return (
                    <div key={idx} className="flex gap-3 bg-[#FCFAF7] border border-[#E5E1D8] p-3 rounded-sm items-start" id={`stroke-step-line-${idx}`}>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#BC2F32] text-white flex items-center justify-center font-serif text-[11px] font-bold">
                        {idx + 1}
                      </span>
                      <div className="font-sans text-xs">
                        <span className="font-bold text-gray-800">Stroke {idx + 1}</span>
                        <span className="text-[#BC2F32] font-semibold text-[10px] ml-1.5">{arrowIndicator}</span>
                        <p className="text-gray-500 mt-0.5 leading-relaxed font-normal">
                          {marker.description || 'Draw elegant curve in position'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center text-xs text-gray-400 py-3">
                  Refer to the diagram above to view the exact stroke steps.
                </div>
              )}
            </div>

            <p className="text-[10px] text-gray-400 mt-4 leading-normal italic font-sans animate-fade-in">
              * Note: The standard rules are left to right, and top to bottom. Keep your wrist steady.
            </p>
          </div>
        </div>

        {/* Modal Bottom Mastery Confirmation Footer */}
        <div className="px-6 py-4 border-t border-[#FAF9F5] bg-[#FCFAF7] flex justify-end gap-3 rounded-b-sm">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-[#E5E1D8] hover:bg-gray-50 text-gray-700 text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleCompletePractice}
            className="py-2.5 px-6 bg-black hover:bg-neutral-900 border border-transparent text-white text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition shadow-sm cursor-pointer flex items-center gap-1.5"
            id="mark-completed-study-btn"
          >
            <Sparkles size={12} />
            <span>Mark as Studied</span>
          </button>
        </div>
        
      </div>
    </div>
  );
};
