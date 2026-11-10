/**
 * DarkVault Cryptographically Secure Generator Engine
 * Employs Web Crypto API with rejection sampling to eliminate modulo bias.
 */

import { GeneratorConfig } from '../types';
import { analyzePassword } from './entropy';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = '0O1lI|';

// Curated EFF-inspired wordlist for passphrase generation
const EFF_WORDLIST = [
  'abacus', 'ability', 'absent', 'absorb', 'abstract', 'academy', 'accent', 'acid', 'acoustic',
  'acquire', 'action', 'actor', 'actress', 'actual', 'adapt', 'addition', 'address', 'adjust',
  'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'agency',
  'agenda', 'agent', 'agree', 'ahead', 'airline', 'airport', 'alarm', 'album', 'alert', 'alien',
  'almost', 'alone', 'alpha', 'already', 'alter', 'always', 'amateur', 'amazing', 'among',
  'amount', 'anchor', 'ancient', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce',
  'antenna', 'antique', 'anxiety', 'anybody', 'apart', 'apology', 'appear', 'apple', 'approve',
  'apron', 'arcade', 'arch', 'arctic', 'area', 'arena', 'argue', 'armor', 'army', 'around',
  'arrange', 'arrest', 'arrive', 'arrow', 'artist', 'artwork', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract',
  'auction', 'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado',
  'avoid', 'awake', 'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor',
  'bacon', 'badge', 'bagel', 'balance', 'balcony', 'bamboo', 'banner', 'bargain', 'barrel',
  'barrier', 'battery', 'battle', 'beach', 'beacon', 'beauty', 'because', 'become', 'before',
  'begin', 'behave', 'behind', 'believe', 'benefit', 'beret', 'best', 'betray', 'better',
  'between', 'beyond', 'bicycle', 'binary', 'biology', 'bird', 'birth', 'bitter', 'black',
  'blade', 'blanket', 'blaster', 'blaze', 'bless', 'blind', 'block', 'blossom', 'blur',
  'board', 'boat', 'body', 'boiler', 'bold', 'bolt', 'bomb', 'bonus', 'border', 'borrow',
  'bottle', 'bounce', 'boundary', 'brace', 'brain', 'branch', 'brave', 'bread', 'break',
  'breeze', 'brick', 'bridge', 'brief', 'bright', 'bronze', 'brother', 'brush', 'bubble',
  'budget', 'buffer', 'build', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst',
  'cabin', 'cable', 'cactus', 'cage', 'cake', 'camera', 'camp', 'canal', 'candle', 'cannon',
  'canyon', 'capable', 'capital', 'captain', 'carbon', 'card', 'cargo', 'carpet', 'carrier',
  'carrot', 'castle', 'casual', 'catch', 'category', 'cattle', 'cause', 'cave', 'ceiling',
  'celery', 'cement', 'census', 'century', 'cereal', 'chain', 'chalk', 'champion', 'change',
  'chaos', 'chapter', 'charge', 'chase', 'cheap', 'check', 'cheese', 'chef', 'cherry',
  'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'chronic', 'chuckle', 'chunk',
  'cinema', 'circle', 'circuit', 'citizen', 'city', 'civil', 'claim', 'clap', 'clarify',
  'claw', 'clay', 'clean', 'clerk', 'clever', 'click', 'client', 'cliff', 'climb', 'clinic',
  'cloak', 'clock', 'clone', 'cloud', 'clown', 'clutch', 'coach', 'coast', 'cobra', 'coconut',
  'code', 'coffee', 'coherent', 'coin', 'cold', 'collar', 'collect', 'colony', 'column',
  'combat', 'combine', 'comfort', 'comic', 'common', 'company', 'concert', 'conduct', 'confirm',
  'connect', 'conquer', 'console', 'constant', 'control', 'convert', 'copper', 'coral', 'core',
  'corner', 'correct', 'corridor', 'cosmic', 'costume', 'cotton', 'couch', 'country', 'couple',
  'course', 'cousin', 'cover', 'coyote', 'crack', 'cradle', 'craft', 'crane', 'crash',
  'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket', 'crime', 'crisis',
  'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial', 'cruel', 'cruise', 'crumble',
  'crunch', 'crush', 'crystal', 'cube', 'culture', 'cupboard', 'curious', 'current', 'curtain',
  'curve', 'cushion', 'custom', 'cyber', 'cycle', 'cylinder', 'dagger', 'daily', 'damage',
  'dance', 'danger', 'daring', 'dark', 'darling', 'dash', 'daughter', 'dawn', 'daylight',
  'decade', 'decide', 'deck', 'declare', 'decor', 'decrease', 'deer', 'defense', 'define',
  'defy', 'degree', 'delay', 'deliver', 'deluxe', 'demand', 'demise', 'denial', 'density',
  'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair',
  'destroy', 'detail', 'detect', 'develop', 'device', 'devote', 'diagram', 'dial', 'diamond',
  'diary', 'dice', 'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner',
  'dinosaur', 'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder',
  'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document', 'dodge',
  'domain', 'donate', 'donkey', 'donor', 'door', 'dose', 'double', 'dove', 'draft', 'dragon',
  'drain', 'drama', 'drastic', 'draw', 'dream', 'dress', 'drift', 'drill', 'drink', 'drip',
  'drive', 'drop', 'drum', 'dryer', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch', 'duty',
  'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy',
  'echo', 'ecology', 'economy', 'edge', 'edit', 'educate', 'effort', 'eight', 'either',
  'elbow', 'elder', 'electric', 'elegant', 'element', 'elephant', 'elevator', 'elite', 'else',
  'embark', 'embody', 'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable',
  'enact', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine', 'enhance',
  'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter', 'entire', 'entry',
  'envelope', 'episode', 'equal', 'equip', 'era', 'erase', 'erode', 'erosion', 'error',
  'erupt', 'escape', 'essay', 'essence', 'estate', 'eternal', 'ethics', 'evidence', 'evil',
  'evoke', 'evolve', 'exact', 'example', 'excess', 'exchange', 'excite', 'exclude', 'excuse',
  'execute', 'exercise', 'exhaust', 'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand',
  'expect', 'expire', 'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow',
  'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family',
  'famous', 'fancy', 'fantasy', 'farm', 'fashion', 'fatal', 'father', 'fatigue', 'fault',
  'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence',
  'festival', 'fetch', 'fever', 'fiber', 'fiction', 'field', 'figure', 'file', 'film',
  'filter', 'final', 'finance', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first',
  'fiscal', 'fish', 'fitness', 'fix', 'flag', 'flame', 'flash', 'flat', 'flavor', 'flee',
  'flight', 'flip', 'float', 'flock', 'floor', 'flower', 'fluid', 'flush', 'fly', 'foam',
  'focus', 'fog', 'foil', 'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget',
  'fork', 'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile',
  'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost', 'frown',
  'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury', 'future', 'gadget', 'gain',
  'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment',
  'gas', 'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle',
  'genuine', 'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl',
  'give', 'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory',
  'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good', 'goose', 'gorilla', 'gospel',
  'gossip', 'govern', 'gown', 'grab', 'grace', 'grain', 'grant', 'grape', 'grass', 'gravity',
  'great', 'green', 'grid', 'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard',
  'guess', 'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half', 'hammer',
  'hamster', 'hand', 'handle', 'harbor', 'hard', 'harsh', 'harvest', 'hat', 'have', 'hawk',
  'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog', 'height', 'hello', 'helmet',
  'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby',
  'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope', 'horn',
  'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover', 'hub', 'huge', 'human',
  'humble', 'humor', 'hundred', 'hungry', 'hunt', 'hurdle', 'hurry', 'hurt', 'husband',
  'hybrid', 'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'illness', 'illegal',
  'image', 'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch',
  'include', 'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant',
  'inflict', 'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner',
  'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install', 'intact',
  'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island', 'isolate', 'issue',
  'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel',
  'job', 'join', 'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior',
  'junk', 'just', 'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney',
  'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife',
  'knock', 'know', 'lab', 'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language',
  'laptop', 'large', 'later', 'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit',
  'layer', 'lazy', 'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal',
  'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson', 'letter',
  'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift', 'light', 'like', 'limb',
  'limit', 'link', 'lion', 'liquid', 'list', 'little', 'live', 'lizard', 'load', 'loan',
  'lobster', 'local', 'lock', 'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge',
  'love', 'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics'
];

/**
 * Returns a cryptographically secure random integer in [0, max - 1]
 * Uses rejection sampling to completely avoid modulo bias.
 */
function secureRandomInt(max: number): number {
  if (max <= 1) return 0;
  const bitLength = 32 - Math.clz32(max - 1);
  const bitMask = (1 << bitLength) - 1;
  const uint32 = new Uint32Array(1);
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;

  while (true) {
    cryptoObj.getRandomValues(uint32);
    const value = uint32[0] & bitMask;
    if (value < max) {
      return value;
    }
  }
}

/**
 * Generates a standard cryptographically random password according to configuration.
 */
export function generatePassword(config: GeneratorConfig): string {
  if (config.mode === 'pin') {
    let pin = '';
    for (let i = 0; i < config.length; i++) {
      pin += NUMBERS[secureRandomInt(NUMBERS.length)];
    }
    return pin;
  }

  if (config.mode === 'passphrase') {
    const selectedWords: string[] = [];
    for (let i = 0; i < config.wordCount; i++) {
      let word = EFF_WORDLIST[secureRandomInt(EFF_WORDLIST.length)];
      if (config.capitalizeWords) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      selectedWords.push(word);
    }

    if (config.includeNumberInPassphrase) {
      const randomIdx = secureRandomInt(selectedWords.length);
      const randomNum = secureRandomInt(100);
      selectedWords[randomIdx] = `${selectedWords[randomIdx]}${randomNum}`;
    }

    return selectedWords.join(config.wordSeparator || '-');
  }

  // Standard password mode
  let charPool = '';
  const requiredChars: string[] = [];

  let upper = UPPERCASE;
  let lower = LOWERCASE;
  let nums = NUMBERS;
  let syms = config.customSymbols || SYMBOLS;

  if (config.excludeAmbiguous) {
    upper = upper.split('').filter((c) => !AMBIGUOUS.includes(c)).join('');
    lower = lower.split('').filter((c) => !AMBIGUOUS.includes(c)).join('');
    nums = nums.split('').filter((c) => !AMBIGUOUS.includes(c)).join('');
    syms = syms.split('').filter((c) => !AMBIGUOUS.includes(c)).join('');
  }

  if (config.includeUppercase && upper.length > 0) {
    charPool += upper;
    requiredChars.push(upper[secureRandomInt(upper.length)]);
  }
  if (config.includeLowercase && lower.length > 0) {
    charPool += lower;
    requiredChars.push(lower[secureRandomInt(lower.length)]);
  }
  if (config.includeNumbers && nums.length > 0) {
    charPool += nums;
    requiredChars.push(nums[secureRandomInt(nums.length)]);
  }
  if (config.includeSymbols && syms.length > 0) {
    charPool += syms;
    requiredChars.push(syms[secureRandomInt(syms.length)]);
  }

  // Fallback to lowercase if nothing selected
  if (charPool.length === 0) {
    charPool = LOWERCASE;
    requiredChars.push(lower[secureRandomInt(lower.length)]);
  }

  const length = Math.max(config.length, requiredChars.length);
  const result: string[] = [...requiredChars];

  // Fill remaining slots
  for (let i = result.length; i < length; i++) {
    result.push(charPool[secureRandomInt(charPool.length)]);
  }

  // Cryptographically secure Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}

/**
 * Generates multiple passwords for bulk creation.
 */
export function generateBulkPasswords(
  config: GeneratorConfig,
  count: number = 5
): Array<{ password: string; analysis: ReturnType<typeof analyzePassword> }> {
  const list = [];
  for (let i = 0; i < count; i++) {
    const pwd = generatePassword(config);
    const analysis = analyzePassword(pwd);
    list.push({ password: pwd, analysis });
  }
  return list;
}
