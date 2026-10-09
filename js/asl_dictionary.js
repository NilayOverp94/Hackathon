/**
 * asl_dictionary.js - Reference Database for ASL Gestures & Signs
 */

export const ASL_SIGNS = [
  // Conversational Gestures
  {
    name: 'HELLO',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Open hand with all fingers extended, waving gently side to side.',
    icon: '👋',
    tips: 'Wave your open palm side-to-side across the camera.'
  },
  {
    name: 'THANK YOU',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Flat open hand near chin, moving smoothly forward and slightly downward.',
    icon: '🙏',
    tips: 'Move flat palm forward from chin towards the camera.'
  },
  {
    name: 'I LOVE YOU',
    category: 'Conversational',
    badge: 'Iconic',
    description: 'Thumb, Index, and Pinky extended outward; Middle and Ring fingers curled down.',
    icon: '🤟',
    tips: 'Combine I, L, and Y fingers into one single iconic sign.'
  },
  {
    name: 'YES',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Closed fist bobbing up and down gently like a nodding head.',
    icon: '✊',
    tips: 'Make a fist and nod it vertically twice.'
  },
  {
    name: 'GOOD',
    category: 'Conversational',
    badge: 'Static',
    description: 'Thumbs up gesture with thumb pointing straight upward.',
    icon: '👍',
    tips: 'Closed fist with thumb extended vertically.'
  },
  {
    name: 'BAD',
    category: 'Conversational',
    badge: 'Static',
    description: 'Thumbs down gesture with thumb pointing straight downward.',
    icon: '👎',
    tips: 'Closed fist with thumb pointing down.'
  },
  {
    name: 'OK',
    category: 'Conversational',
    badge: 'Static',
    description: 'Thumb and index finger touching in a circle; middle, ring, pinky straight.',
    icon: '👌',
    tips: 'Pinch index and thumb into a ring.'
  },
  {
    name: 'HELP',
    category: 'Conversational',
    badge: 'Two-Hand',
    description: 'One flat palm facing upward with a thumbs-up fist placed on top.',
    icon: '🤝',
    tips: 'Rest a thumbs-up fist atop a flat open palm.'
  },

  // Alphabets
  {
    name: 'A',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Tight fist with thumb resting straight up alongside index finger.',
    icon: '🅰️',
    tips: 'Keep thumb aligned on the outer edge of the fist.'
  },
  {
    name: 'B',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Four fingers pointing straight up together; thumb tucked across palm.',
    icon: '🅱️',
    tips: 'Keep index, middle, ring, and pinky pressed together.'
  },
  {
    name: 'C',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Hand curved in a cup shape like the letter C.',
    icon: '©️',
    tips: 'Curve fingers and thumb facing each other.'
  },
  {
    name: 'D',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index finger straight up; thumb touches tips of middle, ring, pinky.',
    icon: '🇩',
    tips: 'Form a ring with thumb and other 3 fingers while index stands tall.'
  },
  {
    name: 'I',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Pinky finger extended straight up; other fingers curled into fist.',
    icon: 'ℹ️',
    tips: 'Only pinky stays up.'
  },
  {
    name: 'L',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Thumb and index extended at a 90-degree angle forming the letter L.',
    icon: '🇱',
    tips: 'Thumb pointing sideways, index pointing straight up.'
  },
  {
    name: 'O',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'All fingertips meet the thumb tip to form an O shape.',
    icon: '⭕',
    tips: 'Form a round loop with all fingertips.'
  },
  {
    name: 'U',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index and middle fingers extended together pointing straight up.',
    icon: '🇺',
    tips: 'Keep index and middle tightly paired.'
  },
  {
    name: 'V',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index and middle fingers spread in a V (Peace sign).',
    icon: '✌️',
    tips: 'Spread index and middle apart.'
  },
  {
    name: 'W',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index, middle, and ring fingers spread upward forming a W.',
    icon: '🇼',
    tips: 'Three middle fingers straight up.'
  },
  {
    name: 'Y',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Thumb and pinky extended outward; middle 3 fingers curled in.',
    icon: '🤙',
    tips: 'Also known as the Shaka or phone sign.'
  },

  // Practical Controls
  {
    name: 'SPACE',
    category: 'Controls',
    badge: 'Action',
    description: 'Flat open palm held horizontally.',
    icon: '␣',
    tips: 'Turn open hand sideways to insert a space.'
  },
  {
    name: 'BACKSPACE',
    category: 'Controls',
    badge: 'Action',
    description: 'Hand swipe horizontally to the left.',
    icon: '⌫',
    tips: 'Swipe hand swiftly left to erase previous character.'
  }
];
