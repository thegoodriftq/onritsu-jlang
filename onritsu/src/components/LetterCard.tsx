import React from 'react';
import { JapaneseCharacter } from '../types';
import { Edit, Volume2 } from 'lucide-react';
import { speakJapanese } from '../utils/audio';

interface LetterCardProps {
  character: JapaneseCharacter;
  mastered: boolean;
  onSelect: (char: JapaneseCharacter) => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({ character, mastered, onSelect }) => {
  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening the modal!
    speakJapanese(character.char);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(character)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(character);
        }
      }}
      className="group relative bg-white hover:bg-[#FDFDFB] border border-[#E5E1D8] hover:border-[#BC2F32] h-32 flex flex-col items-center justify-center transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#BC2F32] select-none"
      title={`Practice character: ${character.char} (${character.romaji}) - Click to see stroke guide`}
      id={`letter-card-${character.char}`}
    >
      {/* Hanko Stamp approval overlay in traditional vermillion red `#BC2F32` */}
      {mastered && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full border border-[#BC2F32]/30 flex items-center justify-center bg-red-50/50 pointer-events-none overflow-hidden select-none animate-scale-spring">
          {/* Outer circle double line */}
          <div className="w-[23px] h-[23px] rounded-full border-2 border-double border-[#BC2F32] flex items-center justify-center font-serif text-[10px] font-bold text-[#BC2F32] leading-none">
            済
          </div>
        </div>
      )}

      {/* Speaker Button to Hear Pronunciation */}
      <button
        onClick={handlePlaySound}
        className="absolute bottom-2 right-2 p-1.5 rounded-full hover:bg-gray-100/80 text-gray-400 hover:text-[#BC2F32] transition duration-150 border border-transparent hover:border-gray-200 shadow-sm bg-[#FAF8F5]"
        title={`Hear pronunciation of ${character.char}`}
        id={`letter-sound-btn-${character.char}`}
      >
        <Volume2 size={12} className="transition-transform group-hover:scale-110" />
      </button>

      {/* Row sound indicator */}
      <div className="text-[10px] text-gray-400 font-sans tracking-widest uppercase transition-colors group-hover:text-[#BC2F32] font-semibold">
        {character.romaji}
      </div>

      {/* Large Japanese glyph */}
      <div className="text-4xl font-serif text-[#1A1A1A] my-1 transition-colors group-hover:text-black leading-tight">
        {character.char}
      </div>

      {/* Stroke count guide */}
      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-sans tracking-tight">
        <Edit size={8} className="text-gray-300" />
        <span>{character.strokes} {character.strokes === 1 ? 'stroke' : 'strokes'}</span>
      </div>
    </div>
  );
};
