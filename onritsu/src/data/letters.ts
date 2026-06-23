import { JapaneseCharacter } from '../types';

export const HIRAGANA_CHARACTERS: JapaneseCharacter[] = [
  // --- A ROW ---
  {
    char: 'あ', romaji: 'a', strokes: 3, type: 'hiragana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 25, y: 42, directionArrow: '→', description: 'Left to right horizontal' },
      { strokeNumber: 2, x: 50, y: 15, directionArrow: '↓', description: 'Top to bottom vertical' },
      { strokeNumber: 3, x: 43, y: 50, directionArrow: '⟳', description: 'Loops around from center' }
    ],
    mnemonic: 'Looks like an "A" with a loop.'
  },
  {
    char: 'い', romaji: 'i', strokes: 2, type: 'hiragana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 28, y: 25, directionArrow: '↓', description: 'Left side hook' },
      { strokeNumber: 2, x: 72, y: 38, directionArrow: '↓', description: 'Right shorter line' }
    ],
    mnemonic: 'Two lines, looks like "ii" (two eels).'
  },
  {
    char: 'う', romaji: 'u', strokes: 2, type: 'hiragana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 50, y: 15, directionArrow: '↘', description: 'Short diagonal dash' },
      { strokeNumber: 2, x: 32, y: 45, directionArrow: '⟳', description: 'Curved bottom shape' }
    ],
    mnemonic: 'Looks like a "U" turned on its side.'
  },
  {
    char: 'え', romaji: 'e', strokes: 2, type: 'hiragana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 48, y: 15, directionArrow: '↘', description: 'Short top line' },
      { strokeNumber: 2, x: 30, y: 45, directionArrow: '→', description: 'Z-shaped fluid line' }
    ],
    mnemonic: 'Looks like an exotic bird on a perch.'
  },
  {
    char: 'お', romaji: 'o', strokes: 3, type: 'hiragana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 25, y: 40, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 2, x: 50, y: 20, directionArrow: '↺', description: 'Loop and curve' },
      { strokeNumber: 3, x: 75, y: 30, directionArrow: '↘', description: 'Isolated seal dot' }
    ],
    mnemonic: 'Looks like an "o" with a flying banner.'
  },

  // --- KA ROW ---
  {
    char: 'か', romaji: 'ka', strokes: 3, type: 'hiragana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 25, y: 40, directionArrow: '⟳', description: 'Main left stroke' },
      { strokeNumber: 2, x: 60, y: 25, directionArrow: '↓', description: 'Vertical cross line' },
      { strokeNumber: 3, x: 78, y: 35, directionArrow: '↘', description: 'Small accent tick' }
    ],
    mnemonic: 'Looks like a kite flying.'
  },
  {
    char: 'き', romaji: 'ki', strokes: 4, type: 'hiragana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 32, y: 32, directionArrow: '→', description: 'Top parallel line' },
      { strokeNumber: 2, x: 30, y: 45, directionArrow: '→', description: 'Bottom parallel line' },
      { strokeNumber: 3, x: 50, y: 15, directionArrow: '↘', description: 'Slanted spine stroke' },
      { strokeNumber: 4, x: 38, y: 80, directionArrow: '→', description: 'Detached bottom smile' }
    ],
    mnemonic: 'Looks like a key.'
  },
  {
    char: 'く', romaji: 'ku', strokes: 1, type: 'hiragana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 70, y: 30, directionArrow: '↙', description: 'Single wedge line' }
    ],
    mnemonic: 'Looks like a mouth of a Cuckoo bird.'
  },
  {
    char: 'け', romaji: 'ke', strokes: 3, type: 'hiragana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 26, y: 22, directionArrow: '↓', description: 'Left straight hook' },
      { strokeNumber: 2, x: 45, y: 35, directionArrow: '→', description: 'Horizontal bar' },
      { strokeNumber: 3, x: 70, y: 15, directionArrow: '↓', description: 'Main curve slice' }
    ],
    mnemonic: 'Looks like a keg of sake on its side.'
  },
  {
    char: 'こ', romaji: 'ko', strokes: 2, type: 'hiragana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 32, y: 35, directionArrow: '→', description: 'Top parallel cap' },
      { strokeNumber: 2, x: 30, y: 75, directionArrow: '→', description: 'Bottom parallel base' }
    ],
    mnemonic: 'Two lines like cohabitating fish.'
  },

  // --- SA ROW ---
  {
    char: 'さ', romaji: 'sa', strokes: 3, type: 'hiragana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 30, y: 35, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 2, x: 52, y: 18, directionArrow: '↘', description: 'Main downward spine' },
      { strokeNumber: 3, x: 38, y: 78, directionArrow: '→', description: 'Detached smile' }
    ],
    mnemonic: 'A tilted cross shape, like a samurai sword.'
  },
  {
    char: 'し', romaji: 'shi', strokes: 1, type: 'hiragana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 50, y: 15, directionArrow: '↓', description: 'Down and upward hook' }
    ],
    mnemonic: 'Looks like a fish hook (for she-fish).'
  },
  {
    char: 'す', romaji: 'su', strokes: 2, type: 'hiragana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 20, y: 30, directionArrow: '→', description: 'Long horizontal line' },
      { strokeNumber: 2, x: 55, y: 12, directionArrow: '↓', description: 'Spine with center loop' }
    ],
    mnemonic: 'A loop that looks like a swing (swing starts with S).'
  },
  {
    char: 'せ', romaji: 'se', strokes: 3, type: 'hiragana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 22, y: 45, directionArrow: '→', description: 'Horizontal bar' },
      { strokeNumber: 2, x: 74, y: 30, directionArrow: '↓', description: 'Right hook' },
      { strokeNumber: 3, x: 46, y: 25, directionArrow: '↓', description: 'Left vertical base' }
    ],
    mnemonic: 'Two people sitting on a settee.'
  },
  {
    char: 'そ', romaji: 'so', strokes: 1, type: 'hiragana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 30, y: 25, directionArrow: '→', description: 'Zig-zag horizontal curve' }
    ],
    mnemonic: 'Zig-zag sewing needle stitches.'
  },

  // --- TA ROW ---
  {
    char: 'た', romaji: 'ta', strokes: 4, type: 'hiragana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 25, y: 32, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 2, x: 35, y: 18, directionArrow: '↓', description: 'Vertical cross' },
      { strokeNumber: 3, x: 58, y: 48, directionArrow: '→', description: 'Top short line' },
      { strokeNumber: 4, x: 56, y: 70, directionArrow: '→', description: 'Bottom short line' }
    ],
    mnemonic: 'Spells the letters "t" and "a".'
  },
  {
    char: 'ち', romaji: 'chi', strokes: 2, type: 'hiragana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 28, y: 30, directionArrow: '→', description: 'Horizontal' },
      { strokeNumber: 2, x: 50, y: 15, directionArrow: '↓', description: 'Downwards and big loop' }
    ],
    mnemonic: 'Looks like a cheerleader or the number "5".'
  },
  {
    char: 'つ', romaji: 'tsu', strokes: 1, type: 'hiragana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 30, y: 45, directionArrow: '→', description: 'Big tidal wave loop' }
    ],
    mnemonic: 'Looks like a giant Wave (tsunami).'
  },
  {
    char: 'て', romaji: 'te', strokes: 1, type: 'hiragana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 25, y: 28, directionArrow: '→', description: 'Top cap and long loop' }
    ],
    mnemonic: 'Looks like an outstretched hand (te means hand).'
  },
  {
    char: 'と', romaji: 'to', strokes: 2, type: 'hiragana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 38, y: 25, directionArrow: '↙', description: 'Small helper slant' },
      { strokeNumber: 2, x: 42, y: 45, directionArrow: '⟳', description: 'Big crescent seed' }
    ],
    mnemonic: 'Looks like a hairy toe.'
  },

  // --- NA ROW ---
  {
    char: 'な', romaji: 'na', strokes: 4, type: 'hiragana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 25, y: 35, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 2, x: 42, y: 18, directionArrow: '↓', description: 'Slanted vertical cross' },
      { strokeNumber: 3, x: 62, y: 25, directionArrow: '↘', description: 'Floating loop mark' },
      { strokeNumber: 4, x: 45, y: 65, directionArrow: '⟳', description: 'Bottom ribbon loop' }
    ],
    mnemonic: 'A nun praying in front of a cross.'
  },
  {
    char: 'に', romaji: 'ni', strokes: 3, type: 'hiragana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 28, y: 20, directionArrow: '↓', description: 'Left straight hook' },
      { strokeNumber: 2, x: 55, y: 38, directionArrow: '→', description: 'Top right bar' },
      { strokeNumber: 3, x: 52, y: 65, directionArrow: '→', description: 'Bottom right bar' }
    ],
    mnemonic: 'Looks like a needle and thread.'
  },
  {
    char: 'ぬ', romaji: 'nu', strokes: 2, type: 'hiragana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 45, y: 25, directionArrow: '↘', description: 'Slanted slide' },
      { strokeNumber: 2, x: 25, y: 35, directionArrow: '⟳', description: 'Endless loops' }
    ],
    mnemonic: 'Looks like a bowl of noodles.'
  },
  {
    char: 'ね', romaji: 'ne', strokes: 2, type: 'hiragana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 30, y: 15, directionArrow: '↓', description: 'Vertical stay' },
      { strokeNumber: 2, x: 22, y: 38, directionArrow: '→', description: 'Z-loop wrapping around' }
    ],
    mnemonic: 'A cat (neko) with a curly tail.'
  },
  {
    char: 'の', romaji: 'no', strokes: 1, type: 'hiragana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 50, y: 35, directionArrow: '↺', description: 'One fluid loop' }
    ],
    mnemonic: 'A "No entry" sign.'
  },

  // --- HA ROW ---
  {
    char: 'は', romaji: 'ha', strokes: 3, type: 'hiragana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 28, y: 20, directionArrow: '↓', description: 'Left straight hook' },
      { strokeNumber: 2, x: 45, y: 35, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 3, x: 58, y: 16, directionArrow: '↓', description: 'Spine with loop' }
    ],
    mnemonic: 'Looks like "ha" containing an "H" and "a".'
  },
  {
    char: 'ひ', romaji: 'hi', strokes: 1, type: 'hiragana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 22, y: 32, directionArrow: '→', description: 'Hehehe happy wide mouth' }
    ],
    mnemonic: 'A big, happy laughing face (hihihi).'
  },
  {
    char: 'ふ', romaji: 'fu', strokes: 4, type: 'hiragana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 50, y: 20, directionArrow: '↘', description: 'Top forehead' },
      { strokeNumber: 2, x: 46, y: 42, directionArrow: '↓', description: 'Nose/loop wave' },
      { strokeNumber: 3, x: 28, y: 60, directionArrow: '↙', description: 'Left eyebrow' },
      { strokeNumber: 4, x: 72, y: 60, directionArrow: '↘', description: 'Right eyebrow' }
    ],
    mnemonic: 'Looks like Mt. Fuji.'
  },
  {
    char: 'へ', romaji: 'he', strokes: 1, type: 'hiragana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 25, y: 65, directionArrow: '↗', description: 'Pointy hill' }
    ],
    mnemonic: 'Looks like a point of a Hill (he).'
  },
  {
    char: 'ほ', romaji: 'ho', strokes: 4, type: 'hiragana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 28, y: 22, directionArrow: '↓', description: 'Left straight hook' },
      { strokeNumber: 2, x: 45, y: 30, directionArrow: '→', description: 'Top cross bar' },
      { strokeNumber: 3, x: 45, y: 45, directionArrow: '→', description: 'Middle cross bar' },
      { strokeNumber: 4, x: 58, y: 15, directionArrow: '↓', description: 'Spine with loop' }
    ],
    mnemonic: 'Looks like "ha" but wearing a hot hat (ho).'
  },

  // --- MA ROW ---
  {
    char: 'ま', romaji: 'ma', strokes: 3, type: 'hiragana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 30, y: 28, directionArrow: '→', description: 'Top cross' },
      { strokeNumber: 2, x: 28, y: 48, directionArrow: '→', description: 'Bottom cross' },
      { strokeNumber: 3, x: 52, y: 15, directionArrow: '↓', description: 'Spine and loop' }
    ],
    mnemonic: 'Looks like an orchestra conductor waving hands: Mama!'
  },
  {
    char: 'み', romaji: 'mi', strokes: 2, type: 'hiragana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 26, y: 32, directionArrow: '→', description: 'Loop with tail' },
      { strokeNumber: 2, x: 68, y: 18, directionArrow: '↓', description: 'Cross vertical slash' }
    ],
    mnemonic: 'Looks like the number "21" (me/mi 21).'
  },
  {
    char: 'む', romaji: 'mu', strokes: 3, type: 'hiragana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 22, y: 35, directionArrow: '→', description: 'Short horizontal bar' },
      { strokeNumber: 2, x: 48, y: 15, directionArrow: '↓', description: 'Spine, wide basin, loop' },
      { strokeNumber: 3, x: 74, y: 24, directionArrow: '↘', description: 'Isolated seal tick' }
    ],
    mnemonic: 'Looks like a cow saying Moo.'
  },
  {
    char: 'め', romaji: 'me', strokes: 2, type: 'hiragana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 48, y: 25, directionArrow: '↘', description: 'Short slash' },
      { strokeNumber: 2, x: 28, y: 45, directionArrow: '↺', description: 'Big swirl (no micro-loops)' }
    ],
    mnemonic: 'Prettier "nu", like beautiful eyes (me).'
  },
  {
    char: 'も', romaji: 'mo', strokes: 3, type: 'hiragana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 50, y: 18, directionArrow: '↓', description: 'Hook tail' },
      { strokeNumber: 2, x: 32, y: 38, directionArrow: '→', description: 'Top horizontal cross' },
      { strokeNumber: 3, x: 32, y: 55, directionArrow: '→', description: 'Bottom horizontal cross' }
    ],
    mnemonic: 'Looks like a hook to catch MORE fish.'
  },

  // --- YA ROW ---
  {
    char: 'や', romaji: 'ya', strokes: 3, type: 'hiragana', row: 'ya',
    markers: [
      { strokeNumber: 1, x: 32, y: 40, directionArrow: '⟳', description: 'Wide curved basin' },
      { strokeNumber: 2, x: 42, y: 22, directionArrow: '↙', description: 'Accent tick' },
      { strokeNumber: 3, x: 65, y: 15, directionArrow: '↓', description: 'Cross vertical slash' }
    ],
    mnemonic: 'Looks like a yak with horns.'
  },
  {
    char: 'ゆ', romaji: 'yu', strokes: 2, type: 'hiragana', row: 'ya',
    markers: [
      { strokeNumber: 1, x: 30, y: 30, directionArrow: '↓', description: 'Loop with horizontal bar' },
      { strokeNumber: 2, x: 66, y: 15, directionArrow: '↓', description: 'Vertical straight line' }
    ],
    mnemonic: 'Looks like a unique fish swimming.'
  },
  {
    char: 'よ', romaji: 'yo', strokes: 2, type: 'hiragana', row: 'ya',
    markers: [
      { strokeNumber: 1, x: 26, y: 34, directionArrow: '→', description: 'Short horizontal bar' },
      { strokeNumber: 2, x: 54, y: 15, directionArrow: '↓', description: 'Vertical line with loop' }
    ],
    mnemonic: 'Looks like a yo-yo hanging on a string.'
  },

  // --- RA ROW ---
  {
    char: 'ら', romaji: 'ra', strokes: 2, type: 'hiragana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 46, y: 15, directionArrow: '↘', description: 'Short diagonal dash' },
      { strokeNumber: 2, x: 32, y: 40, directionArrow: '⟳', description: 'Giant sickle-like loop' }
    ],
    mnemonic: 'A rabbit on its hind legs.'
  },
  {
    char: 'り', romaji: 'ri', strokes: 2, type: 'hiragana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 32, y: 25, directionArrow: '↓', description: 'Left short line' },
      { strokeNumber: 2, x: 68, y: 15, directionArrow: '↓', description: 'Right long line' }
    ],
    mnemonic: 'Looks like ribbons waving in the wind.'
  },
  {
    char: 'る', romaji: 'ru', strokes: 1, type: 'hiragana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 28, y: 25, directionArrow: '→', description: 'Zigzag wrapping to bottom loop' }
    ],
    mnemonic: 'Looks like "ro" but has a loop: a road with a roundabout.'
  },
  {
    char: 'れ', romaji: 're', strokes: 2, type: 'hiragana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 30, y: 15, directionArrow: '↓', description: 'Vertical stay' },
      { strokeNumber: 2, x: 24, y: 38, directionArrow: '→', description: 'Z-loop kicked outward' }
    ],
    mnemonic: 'A person retching / vomiting out.'
  },
  {
    char: 'ろ', romaji: 'ro', strokes: 1, type: 'hiragana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 28, y: 25, directionArrow: '→', description: 'Simple open zigzag' }
    ],
    mnemonic: 'A road with no end loop (open Road).'
  },

  // --- WA ROW ---
  {
    char: 'わ', romaji: 'wa', strokes: 2, type: 'hiragana', row: 'wa',
    markers: [
      { strokeNumber: 1, x: 30, y: 15, directionArrow: '↓', description: 'Vertical stay' },
      { strokeNumber: 2, x: 24, y: 38, directionArrow: '→', description: 'W-like smooth loop' }
    ],
    mnemonic: 'A wasp flying around a straight pole.'
  },
  {
    char: 'を', romaji: 'wo', strokes: 3, type: 'hiragana', row: 'wa',
    markers: [
      { strokeNumber: 1, x: 24, y: 35, directionArrow: '→', description: 'Horizontal bar' },
      { strokeNumber: 2, x: 42, y: 18, directionArrow: '↓', description: 'Tilted vertical & hook' },
      { strokeNumber: 3, x: 48, y: 60, directionArrow: '↺', description: 'Lower scoop basket' }
    ],
    mnemonic: 'A person walking across other letters.'
  },
  {
    char: 'ん', romaji: 'n', strokes: 1, type: 'hiragana', row: 'wa',
    markers: [
      { strokeNumber: 1, x: 28, y: 30, directionArrow: '↘', description: 'Calligraphic soft zigzag' }
    ],
    mnemonic: 'Looks exactly like an elegant cursive "n".'
  }
];

// Custom normalization adjustments
HIRAGANA_CHARACTERS.forEach(c => {
  if (c.char === 'ひ') c.romaji = 'hi';
  if (c.char === 'よ') c.romaji = 'yo';
});


export const KATAKANA_CHARACTERS: JapaneseCharacter[] = [
  // --- A ROW ---
  {
    char: 'ア', romaji: 'a', strokes: 2, type: 'katakana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 28, y: 28, directionArrow: '→', description: 'Horizontal and sharp bend' },
      { strokeNumber: 2, x: 48, y: 40, directionArrow: '↙', description: 'Leftward curved swipe' }
    ],
    mnemonic: 'Looks like a cliff edge.'
  },
  {
    char: 'イ', romaji: 'i', strokes: 2, type: 'katakana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 62, y: 18, directionArrow: '↙', description: 'Left slanted tick' },
      { strokeNumber: 2, x: 48, y: 35, directionArrow: '↓', description: 'Straight vertical support' }
    ],
    mnemonic: 'Looks like an easel or an "I" beam.'
  },
  {
    char: 'ウ', romaji: 'u', strokes: 3, type: 'katakana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 50, y: 15, directionArrow: '↓', description: 'Top vertical crown pin' },
      { strokeNumber: 2, x: 28, y: 38, directionArrow: '↓', description: 'Left edge bracket' },
      { strokeNumber: 3, x: 28, y: 38, directionArrow: '→', description: 'Right hook and sweep' }
    ],
    mnemonic: 'Looks like a hat covering "U".'
  },
  {
    char: 'エ', romaji: 'e', strokes: 3, type: 'katakana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 28, y: 25, directionArrow: '→', description: 'Top cap bar' },
      { strokeNumber: 2, x: 50, y: 25, directionArrow: '↓', description: 'Vertical pillar' },
      { strokeNumber: 3, x: 20, y: 78, directionArrow: '→', description: 'Long support base' }
    ],
    mnemonic: 'Looks like an engineer\'s I-beam.'
  },
  {
    char: 'オ', romaji: 'o', strokes: 3, type: 'katakana', row: 'a',
    markers: [
      { strokeNumber: 1, x: 24, y: 40, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 2, x: 52, y: 15, directionArrow: '↓', description: 'Vertical hooked spine' },
      { strokeNumber: 3, x: 52, y: 42, directionArrow: '↙', description: 'Leftward kick' }
    ],
    mnemonic: 'A runner stretching out: OH!'
  },

  // --- KA ROW ---
  {
    char: 'カ', romaji: 'ka', strokes: 2, type: 'katakana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 28, y: 36, directionArrow: '→', description: 'Upper roof bend' },
      { strokeNumber: 2, x: 55, y: 15, directionArrow: '↓', description: 'Vertical cross' }
    ],
    mnemonic: 'Sharp angular "ka" Hiragana derivative.'
  },
  {
    char: 'キ', romaji: 'ki', strokes: 3, type: 'katakana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 28, y: 30, directionArrow: '→', description: 'Top parallel cross' },
      { strokeNumber: 2, x: 26, y: 50, directionArrow: '→', description: 'Bottom parallel cross' },
      { strokeNumber: 3, x: 50, y: 15, directionArrow: '↙', description: 'Main slanted support' }
    ],
    mnemonic: 'Looks like a classic key.'
  },
  {
    char: 'ク', romaji: 'ku', strokes: 2, type: 'katakana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 58, y: 18, directionArrow: '↙', description: 'Top short wedge' },
      { strokeNumber: 2, x: 38, y: 40, directionArrow: '→', description: 'Main scoop swipe' }
    ],
    mnemonic: 'Looks like a cook\'s apron corners.'
  },
  {
    char: 'ケ', romaji: 'ke', strokes: 3, type: 'katakana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 38, y: 32, directionArrow: '↙', description: 'Slanted tick' },
      { strokeNumber: 2, x: 24, y: 42, directionArrow: '→', description: 'Horizontal shelf' },
      { strokeNumber: 3, x: 50, y: 42, directionArrow: '↙', description: 'Long curvature slice' }
    ],
    mnemonic: 'Looks like the letter "K".'
  },
  {
    char: 'コ', romaji: 'ko', strokes: 2, type: 'katakana', row: 'ka',
    markers: [
      { strokeNumber: 1, x: 28, y: 30, directionArrow: '→', description: 'Top wall and right hook' },
      { strokeNumber: 2, x: 28, y: 75, directionArrow: '→', description: 'Bottom matching floor' }
    ],
    mnemonic: 'A corner bracket (ko).'
  },

  // --- SA ROW ---
  {
    char: 'サ', romaji: 'sa', strokes: 3, type: 'katakana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 24, y: 38, directionArrow: '→', description: 'Long horizontal base link' },
      { strokeNumber: 2, x: 42, y: 18, directionArrow: '↓', description: 'Left vertical tooth' },
      { strokeNumber: 3, x: 68, y: 22, directionArrow: '↓', description: 'Right hook tooth' }
    ],
    mnemonic: 'Three plants growing in soil.'
  },
  {
    char: 'シ', romaji: 'shi', strokes: 3, type: 'katakana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 30, y: 28, directionArrow: '↘', description: 'First drop' },
      { strokeNumber: 2, x: 30, y: 52, directionArrow: '↘', description: 'Second drop' },
      { strokeNumber: 3, x: 26, y: 82, directionArrow: '↗', description: 'Upward splash line' }
    ],
    mnemonic: 'She looks up smilingly at you.'
  },
  {
    char: 'ス', romaji: 'su', strokes: 2, type: 'katakana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 26, y: 32, directionArrow: '→', description: 'Top horizon and hook' },
      { strokeNumber: 2, x: 48, y: 50, directionArrow: '↘', description: 'Diagonal support' }
    ],
    mnemonic: 'A hanger for a suit.'
  },
  {
    char: 'セ', romaji: 'se', strokes: 2, type: 'katakana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 26, y: 40, directionArrow: '→', description: 'Upper cross and drop' },
      { strokeNumber: 2, x: 50, y: 22, directionArrow: '↓', description: 'Corner hook L-stroke' }
    ],
    mnemonic: 'Looks like Hiragana "se" but sharper.'
  },
  {
    char: 'ソ', romaji: 'so', strokes: 2, type: 'katakana', row: 'sa',
    markers: [
      { strokeNumber: 1, x: 32, y: 26, directionArrow: '↘', description: 'Top-left dropspin' },
      { strokeNumber: 2, x: 68, y: 18, directionArrow: '↙', description: 'Top-right long slope' }
    ],
    mnemonic: 'A sewing needle dropping thread.'
  },

  // --- TA ROW ---
  {
    char: 'タ', romaji: 'ta', strokes: 3, type: 'katakana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 46, y: 22, directionArrow: '↙', description: 'Slanted tick' },
      { strokeNumber: 2, x: 28, y: 42, directionArrow: '→', description: 'Big sweep box' },
      { strokeNumber: 3, x: 40, y: 56, directionArrow: '→', description: 'Inner horizontal split' }
    ],
    mnemonic: 'Looks like "ku" but with a tongue.'
  },
  {
    char: 'チ', romaji: 'chi', strokes: 3, type: 'katakana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 62, y: 18, directionArrow: '↙', description: 'Slanted top tick' },
      { strokeNumber: 2, x: 28, y: 41, directionArrow: '→', description: 'Horizontal cross' },
      { strokeNumber: 3, x: 48, y: 41, directionArrow: '↓', description: 'Pillar curve' }
    ],
    mnemonic: 'A cheerleader waving her hands.'
  },
  {
    char: 'ツ', romaji: 'tsu', strokes: 3, type: 'katakana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 30, y: 22, directionArrow: '↓', description: 'First top drop' },
      { strokeNumber: 2, x: 55, y: 28, directionArrow: '↓', description: 'Second top drop' },
      { strokeNumber: 3, x: 74, y: 20, directionArrow: '↙', description: 'Downward sweep' }
    ],
    mnemonic: 'Tsunami waves splashing downwards.'
  },
  {
    char: 'テ', romaji: 'te', strokes: 3, type: 'katakana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 32, y: 28, directionArrow: '→', description: 'Top short line' },
      { strokeNumber: 2, x: 24, y: 48, directionArrow: '→', description: 'Middle longer line' },
      { strokeNumber: 3, x: 50, y: 48, directionArrow: '↙', description: 'Spine curved sweep' }
    ],
    mnemonic: 'Looks like television antennas.'
  },
  {
    char: 'ト', romaji: 'to', strokes: 2, type: 'katakana', row: 'ta',
    markers: [
      { strokeNumber: 1, x: 50, y: 16, directionArrow: '↓', description: 'Straight wall' },
      { strokeNumber: 2, x: 50, y: 44, directionArrow: '↘', description: 'Side branch slant' }
    ],
    mnemonic: 'A tree branch trunk (to).'
  },

  // --- NA ROW ---
  {
    char: 'ナ', romaji: 'na', strokes: 2, type: 'katakana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 22, y: 42, directionArrow: '→', description: 'Horizontal beam' },
      { strokeNumber: 2, x: 52, y: 16, directionArrow: '↙', description: 'Big sword curve' }
    ],
    mnemonic: 'Looks like a sword or cross.'
  },
  {
    char: 'ニ', romaji: 'ni', strokes: 2, type: 'katakana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 32, y: 35, directionArrow: '→', description: 'Short top horizontal' },
      { strokeNumber: 2, x: 20, y: 72, directionArrow: '→', description: 'Long bottom horizontal' }
    ],
    mnemonic: 'Two parallel lines: Ni means two (二).'
  },
  {
    char: 'ヌ', romaji: 'nu', strokes: 2, type: 'katakana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 28, y: 32, directionArrow: '→', description: 'Hook split' },
      { strokeNumber: 2, x: 44, y: 48, directionArrow: '↘', description: 'Cross mark slash' }
    ],
    mnemonic: 'Looks like chopsticks grabbing noodles.'
  },
  {
    char: 'ネ', romaji: 'ne', strokes: 4, type: 'katakana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 35, y: 18, directionArrow: '↘', description: 'Top drop tick' },
      { strokeNumber: 2, x: 24, y: 42, directionArrow: '→', description: 'Pillar cross support' },
      { strokeNumber: 3, x: 48, y: 42, directionArrow: '↓', description: 'Standing support' },
      { strokeNumber: 4, x: 54, y: 56, directionArrow: '↘', description: 'Right kick dot' }
    ],
    mnemonic: 'Nest shape under an umbrella.'
  },
  {
    char: 'ノ', romaji: 'no', strokes: 1, type: 'katakana', row: 'na',
    markers: [
      { strokeNumber: 1, x: 74, y: 18, directionArrow: '↙', description: 'Single elegant slash' }
    ],
    mnemonic: 'A "No entry" barrier line.'
  },

  // --- HA ROW ---
  {
    char: 'ハ', romaji: 'ha', strokes: 2, type: 'katakana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 36, y: 28, directionArrow: '↙', description: 'Leftward support' },
      { strokeNumber: 2, x: 64, y: 28, directionArrow: '↘', description: 'Rightward support' }
    ],
    mnemonic: 'Underneath a roof (hahaha house).'
  },
  {
    char: 'ヒ', romaji: 'hi', strokes: 2, type: 'katakana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 30, y: 36, directionArrow: '→', description: 'Upper short horizontal' },
      { strokeNumber: 2, x: 30, y: 64, directionArrow: '⟳', description: 'L-hook floor scoop' }
    ],
    mnemonic: 'A heel of a shoe sitting down.'
  },
  {
    char: 'フ', romaji: 'fu', strokes: 1, type: 'katakana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 28, y: 28, directionArrow: '→', description: 'Horizontal and sweep hook' }
    ],
    mnemonic: 'Looks like a standard flag flapping.'
  },
  {
    char: 'ヘ', romaji: 'he', strokes: 1, type: 'katakana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 28, y: 62, directionArrow: '↗', description: 'Peak mountain shape' }
    ],
    mnemonic: 'Looks identical to Hiragana "he".'
  },
  {
    char: 'ホ', romaji: 'ho', strokes: 4, type: 'katakana', row: 'ha',
    markers: [
      { strokeNumber: 1, x: 25, y: 38, directionArrow: '→', description: 'Horizontal cross bar' },
      { strokeNumber: 2, x: 50, y: 15, directionArrow: '↓', description: 'Main vertical spine hook' },
      { strokeNumber: 3, x: 30, y: 48, directionArrow: '↙', description: 'Left side sweep' },
      { strokeNumber: 4, x: 70, y: 48, directionArrow: '↘', description: 'Right side drop' }
    ],
    mnemonic: 'Hohoho, looks like a tiny pine tree!'
  },

  // --- MA ROW ---
  {
    char: 'マ', romaji: 'ma', strokes: 2, type: 'katakana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 26, y: 30, directionArrow: '→', description: 'Horizontal cap and bend' },
      { strokeNumber: 2, x: 52, y: 48, directionArrow: '↘', description: 'Single slash support' }
    ],
    mnemonic: 'A martini glass shape (bottom part).'
  },
  {
    char: 'ミ', romaji: 'mi', strokes: 3, type: 'katakana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 32, y: 26, directionArrow: '↘', description: 'Top tilt drop' },
      { strokeNumber: 2, x: 28, y: 48, directionArrow: '↘', description: 'Middle tilt drop' },
      { strokeNumber: 3, x: 24, y: 70, directionArrow: '↘', description: 'Bottom tilt drop' }
    ],
    mnemonic: 'Three ribbons flying (mi-mi-mi).'
  },
  {
    char: 'ム', romaji: 'mu', strokes: 2, type: 'katakana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 42, y: 25, directionArrow: '↙', description: 'Apex triangle hook' },
      { strokeNumber: 2, x: 55, y: 64, directionArrow: '→', description: 'Bottom flat line' }
    ],
    mnemonic: 'Looks like a cow nose profile.'
  },
  {
    char: 'メ', romaji: 'me', strokes: 2, type: 'katakana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 68, y: 22, directionArrow: '↙', description: 'Long curved left swipe' },
      { strokeNumber: 2, x: 30, y: 38, directionArrow: '↘', description: 'Crossing branch line' }
    ],
    mnemonic: 'An X-mark covering your eyes: mess (me).'
  },
  {
    char: 'モ', romaji: 'mo', strokes: 3, type: 'katakana', row: 'ma',
    markers: [
      { strokeNumber: 1, x: 28, y: 32, directionArrow: '→', description: 'Top bar' },
      { strokeNumber: 2, x: 26, y: 52, directionArrow: '→', description: 'Middle bar' },
      { strokeNumber: 3, x: 48, y: 15, directionArrow: '↓', description: 'L hook floor' }
    ],
    mnemonic: 'Almost like Hiragana "mo" but cleaner.'
  },

  // --- YA ROW ---
  {
    char: 'ヤ', romaji: 'ya', strokes: 2, type: 'katakana', row: 'ya',
    markers: [
      { strokeNumber: 1, x: 24, y: 40, directionArrow: '→', description: 'Horizontal cap & bend' },
      { strokeNumber: 2, x: 58, y: 18, directionArrow: '↙', description: 'Cross downward slash' }
    ],
    mnemonic: 'Looks like a yak horn.'
  },
  {
    char: 'ユ', romaji: 'yu', strokes: 2, type: 'katakana', row: 'ya',
    markers: [
      { strokeNumber: 1, x: 28, y: 30, directionArrow: '→', description: 'Pillar bracket hook' },
      { strokeNumber: 2, x: 28, y: 72, directionArrow: '→', description: 'Long horizontal base extension' }
    ],
    mnemonic: 'A unique corner cup (yu).'
  },
  {
    char: 'ヨ', romaji: 'yo', strokes: 3, type: 'katakana', row: 'ya',
    markers: [
      { strokeNumber: 1, x: 28, y: 24, directionArrow: '→', description: 'Top cap & vertical wall' },
      { strokeNumber: 2, x: 28, y: 48, directionArrow: '→', description: 'Middle horizontal shelf' },
      { strokeNumber: 3, x: 28, y: 74, directionArrow: '→', description: 'Bottom support base' }
    ],
    mnemonic: 'A toy chest rotated 90 degrees.'
  },

  // --- RA ROW ---
  {
    char: 'ラ', romaji: 'ra', strokes: 2, type: 'katakana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 30, y: 28, directionArrow: '→', description: 'Top short ceiling' },
      { strokeNumber: 2, x: 30, y: 52, directionArrow: '→', description: 'Lower scoop side curvature' }
    ],
    mnemonic: 'A lantern on a pole.'
  },
  {
    char: 'リ', romaji: 'ri', strokes: 2, type: 'katakana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 35, y: 28, directionArrow: '↓', description: 'Left short slash' },
      { strokeNumber: 2, x: 65, y: 18, directionArrow: '↓', description: 'Right long curve' }
    ],
    mnemonic: 'Identical to Hiragana "ri" but sharp.'
  },
  {
    char: 'ル', romaji: 'ru', strokes: 2, type: 'katakana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 36, y: 22, directionArrow: '↙', description: 'Left slope curve' },
      { strokeNumber: 2, x: 62, y: 22, directionArrow: '↓', description: 'Right hook vertical curve' }
    ],
    mnemonic: 'Looks like two legs running.'
  },
  {
    char: 'レ', romaji: 're', strokes: 1, type: 'katakana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 38, y: 24, directionArrow: '↓', description: 'Hook downward slope' }
    ],
    mnemonic: 'Looks like the right half of "ru".'
  },
  {
    char: 'ロ', romaji: 'ro', strokes: 3, type: 'katakana', row: 'ra',
    markers: [
      { strokeNumber: 1, x: 28, y: 25, directionArrow: '↓', description: 'Left column support' },
      { strokeNumber: 2, x: 28, y: 25, directionArrow: '→', description: 'Top ceiling & right hook' },
      { strokeNumber: 3, x: 28, y: 78, directionArrow: '→', description: 'Bottom sealant floor' }
    ],
    mnemonic: 'A beautiful square window (ro).'
  },

  // --- WA ROW ---
  {
    char: 'ワ', romaji: 'wa', strokes: 2, type: 'katakana', row: 'wa',
    markers: [
      { strokeNumber: 1, x: 28, y: 28, directionArrow: '↓', description: 'Left corner drop' },
      { strokeNumber: 2, x: 28, y: 28, directionArrow: '→', description: 'Top ceiling & sweep' }
    ],
    mnemonic: 'Wine glass (wa) on a table.'
  },
  {
    char: 'ヲ', romaji: 'wo', strokes: 3, type: 'katakana', row: 'wa',
    markers: [
      { strokeNumber: 1, x: 28, y: 30, directionArrow: '→', description: 'Upper bar' },
      { strokeNumber: 2, x: 24, y: 48, directionArrow: '→', description: 'Lower bar' },
      { strokeNumber: 3, x: 48, y: 15, directionArrow: '↙', description: 'Down sweep intersect' }
    ],
    mnemonic: 'Almost like "te" but slanting.'
  },
  {
    char: 'ン', romaji: 'n', strokes: 2, type: 'katakana', row: 'wa',
    markers: [
      { strokeNumber: 1, x: 30, y: 35, directionArrow: '↘', description: 'Top drop point' },
      { strokeNumber: 2, x: 28, y: 78, directionArrow: '↗', description: 'Upward dynamic stroke' }
    ],
    mnemonic: 'A single eye winking: n-n-n.'
  }
];

// Custom normalization adjustments
KATAKANA_CHARACTERS.forEach(c => {
  if (c.char === 'ル') c.romaji = 'ru';
});

// Group row mappings for standard layout
export const GOJUON_ROWS = [
  { id: 'a', label: 'Vowels (A-I-U-E-O)' },
  { id: 'ka', label: 'K-Row (Ka-Ki-Ku-Ke-Ko)' },
  { id: 'sa', label: 'S-Row (Sa-Shi-Su-Se-So)' },
  { id: 'ta', label: 'T-Row (Ta-Chi-Tsu-Te-To)' },
  { id: 'na', label: 'N-Row (Na-Ni-Nu-Ne-No)' },
  { id: 'ha', label: 'H-Row (Ha-Hi-Fu-He-Ho)' },
  { id: 'ma', label: 'M-Row (Ma-Mi-Mu-Me-Mo)' },
  { id: 'ya', label: 'Y-Row (Ya-Yu-Yo)' },
  { id: 'ra', label: 'R-Row (Ra-Ri-Ru-Re-Ro)' },
  { id: 'wa', label: 'W-Row (Wa-Wo-N)' }
];
