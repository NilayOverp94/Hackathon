/**
 * asl_dictionary.js - Comprehensive Reference Database for Full ASL Alphabet & Signs
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
    name: 'FUCK YOU',
    category: 'Conversational',
    badge: 'Expressive',
    description: 'Middle finger extended upright with all other fingers curled tightly into a closed fist.',
    icon: '🖕',
    tips: 'Hold your fist closed and extend only your middle finger straight up.'
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
    name: 'NO',
    category: 'Conversational',
    badge: 'Static',
    description: 'Index and Middle fingers snapped closed onto thumb tip.',
    icon: '🤏',
    tips: 'Pinch index and middle fingertips quickly to thumb tip.'
  },
  {
    name: 'PLEASE',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Flat open palm rubbing chest area gently in a circular motion.',
    icon: '🤲',
    tips: 'Rub flat palm gently across your chest.'
  },
  {
    name: 'SORRY',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Closed fist rubbing chest in a circular motion.',
    icon: '🥺',
    tips: 'Make a fist and move it in small circles on your chest.'
  },
  {
    name: 'HAPPY',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Flat open hand brushing upward repeatedly across chest.',
    icon: '😊',
    tips: 'Brush flat palm upward toward chin.'
  },
  {
    name: 'MORE',
    category: 'Conversational',
    badge: 'Two-Hand / Single',
    description: 'Fingertips pinched together touching (or tapping together).',
    icon: '➕',
    tips: 'Pinch all fingertips together and face them up/forward.'
  },
  {
    name: 'STOP',
    category: 'Conversational',
    badge: 'Two-Hand',
    description: 'One flat hand chopping down vertically into flat base palm.',
    icon: '🛑',
    tips: 'Chop the side of your flat hand into your other palm.'
  },
  {
    name: 'WHERE',
    category: 'Conversational',
    badge: 'Dynamic',
    description: 'Index finger pointing up, wagging gently side-to-side.',
    icon: '❓',
    tips: 'Hold index up and wag it side to side.'
  },
  {
    name: 'WATER',
    category: 'Conversational',
    badge: 'Static',
    description: 'W handshape held near chin or lower lip.',
    icon: '💧',
    tips: 'Form letter W and tap index near chin/mouth.'
  },
  {
    name: 'EAT / FOOD',
    category: 'Conversational',
    badge: 'Static',
    description: 'Fingertips pressed together touching near mouth.',
    icon: '🍽️',
    tips: 'Pinch fingertips together and hold near lips.'
  },
  {
    name: 'DRINK',
    category: 'Conversational',
    badge: 'Static',
    description: 'C handshape tilted towards mouth like holding a glass.',
    icon: '🥤',
    tips: 'Cup your hand in a C and tilt it toward your mouth.'
  },
  {
    name: 'YOU',
    category: 'Conversational',
    badge: 'Static',
    description: 'Index finger pointing directly forward toward camera/person.',
    icon: '👉',
    tips: 'Point index finger straight toward the screen.'
  },
  {
    name: 'ME / I',
    category: 'Conversational',
    badge: 'Static',
    description: 'Index finger pointing directly back inward to chest.',
    icon: '👈',
    tips: 'Point index finger inward toward yourself.'
  },
  {
    name: 'LOOK / SEE',
    category: 'Conversational',
    badge: 'Static',
    description: 'V handshape pointing forward toward camera.',
    icon: '👀',
    tips: 'Point peace sign forward toward the screen.'
  },
  {
    name: 'TIME',
    category: 'Conversational',
    badge: 'Static',
    description: 'Index finger tapping your wrist where a watch is worn.',
    icon: '⌚',
    tips: 'Tap index finger onto your wrist.'
  },
  {
    name: 'FINE',
    category: 'Conversational',
    badge: 'Static',
    description: 'Open 5 hand with thumb resting against chest.',
    icon: '✨',
    tips: 'Spread 5 fingers and touch thumb to chest.'
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
    tips: 'Pinch index and thumb into a ring with 3 fingers up.'
  },
  {
    name: 'HELP',
    category: 'Conversational',
    badge: 'Two-Hand',
    description: 'One flat palm facing upward with a thumbs-up fist placed on top.',
    icon: '🤝',
    tips: 'Rest a thumbs-up fist atop a flat open palm.'
  },
  {
    name: 'WORK',
    category: 'Conversational',
    badge: 'Two-Hand',
    description: 'Two closed fists tapping together wrist-on-wrist.',
    icon: '💼',
    tips: 'Tap one fist on top of your other fist.'
  },
  {
    name: 'PLAY',
    category: 'Conversational',
    badge: 'Two-Hand',
    description: 'Both hands in Y (Shaka) handshapes shaking gently.',
    icon: '🎉',
    tips: 'Make two Y shapes with thumbs & pinkies and shake.'
  },
  {
    name: 'EXCELLENT',
    category: 'Conversational',
    badge: 'Two-Hand',
    description: 'Two thumbs up held side by side.',
    icon: '🌟',
    tips: 'Give two thumbs up to the camera.'
  },

  // Full 26-Letter ASL Fingerspelling Alphabet
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
    tips: 'Form a ring with thumb and middle fingers while index points up.'
  },
  {
    name: 'E',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'All 4 fingertips curled tightly with tips resting on top edge of thumb folded across palm.',
    icon: '🇪',
    tips: 'Curl all fingers tightly down onto your tucked thumb.'
  },
  {
    name: 'F',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index finger and thumb touching tips in circle; middle, ring, pinky extended upright.',
    icon: '🇫',
    tips: 'Identical to OK sign: index + thumb circle, 3 fingers standing tall.'
  },
  {
    name: 'G',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index finger pointing horizontally sideways with thumb parallel.',
    icon: '🇬',
    tips: 'Point index sideways like pointing horizontally, thumb parallel.'
  },
  {
    name: 'H',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index and Middle fingers extended together pointing horizontally sideways.',
    icon: '🇭',
    tips: 'Keep index and middle tightly paired, pointing sideways.'
  },
  {
    name: 'I',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Pinky finger extended straight up; other fingers curled into fist.',
    icon: 'ℹ️',
    tips: 'Only pinky stays up with closed fist.'
  },
  {
    name: 'J',
    category: 'Alphabet',
    badge: 'Dynamic',
    description: 'Pinky finger drawing a swooping J curve down and up in the air.',
    icon: '🇯',
    tips: 'Make an I handshape and trace a J swoop.'
  },
  {
    name: 'K',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index finger pointing straight up, Middle angled forward at 45°, Thumb between them.',
    icon: '🇰',
    tips: 'Make a V shape and place thumb between index and middle.'
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
    name: 'M',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Three fingers (index, middle, ring) folded over thumb tucked underneath.',
    icon: 'Ⓜ️',
    tips: 'Tuck thumb under index, middle, and ring fingers.'
  },
  {
    name: 'N',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Two fingers (index, middle) folded over thumb tucked underneath.',
    icon: '🇳',
    tips: 'Tuck thumb under index and middle fingers.'
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
    name: 'P',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'K handshape oriented pointing downwards toward the floor.',
    icon: '🇵',
    tips: 'Hold a K sign and tilt your wrist downwards.'
  },
  {
    name: 'Q',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'G handshape (index and thumb) oriented pointing downwards.',
    icon: '🇶',
    tips: 'Hold index and thumb pointing down toward the floor.'
  },
  {
    name: 'R',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index and middle fingers crossed over each other.',
    icon: '🇷',
    tips: 'Cross your index and middle fingers like wishing for luck.'
  },
  {
    name: 'S',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Tight fist with thumb crossed over the front of all curled fingers.',
    icon: '🇸',
    tips: 'Make a fist with thumb resting across the front of fingers.'
  },
  {
    name: 'T',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Fist with thumb tucked between index and middle finger knuckles.',
    icon: '🇹',
    tips: 'Tuck thumb tip between your index and middle fingers.'
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
    name: 'X',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Index finger hooked/bent at first joint; other fingers curled.',
    icon: '❌',
    tips: 'Curl index finger like a pirate hook.'
  },
  {
    name: 'Y',
    category: 'Alphabet',
    badge: 'Fingerspell',
    description: 'Thumb and pinky extended outward; middle 3 fingers curled in.',
    icon: '🤙',
    tips: 'Also known as the Shaka or phone sign.'
  },
  {
    name: 'Z',
    category: 'Alphabet',
    badge: 'Dynamic',
    description: 'Index finger extended, tracing a Z path in the air.',
    icon: '⚡',
    tips: 'Point index finger and draw a Z in the air.'
  },

  // ASL Numbers
  {
    name: '1',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Single index finger pointing straight up.',
    icon: '1️⃣',
    tips: 'Point index finger up.'
  },
  {
    name: '2',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Index and middle fingers extended upright (Peace sign / V).',
    icon: '2️⃣',
    tips: 'Show two fingers up.'
  },
  {
    name: '3',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Thumb, index, and middle fingers extended upright.',
    icon: '3️⃣',
    tips: 'In official ASL: extend thumb, index, and middle.'
  },
  {
    name: '4',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Four fingers upright with thumb tucked across palm.',
    icon: '4️⃣',
    tips: 'Show four fingers up with thumb tucked.'
  },
  {
    name: '5',
    category: 'Numbers',
    badge: 'Digit',
    description: 'All 5 fingers spread wide open.',
    icon: '5️⃣',
    tips: 'Hold open hand facing camera.'
  },
  {
    name: '6',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Pinky fingertip touching thumb tip, other 3 fingers upright.',
    icon: '6️⃣',
    tips: 'Touch pinky to thumb with 3 fingers standing tall.'
  },
  {
    name: '7',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Ring fingertip touching thumb tip, other 3 fingers upright.',
    icon: '7️⃣',
    tips: 'Touch ring finger to thumb with 3 fingers up.'
  },
  {
    name: '8',
    category: 'Numbers',
    badge: 'Digit',
    description: 'Middle fingertip touching thumb tip, other 3 fingers upright.',
    icon: '8️⃣',
    tips: 'Touch middle finger to thumb with other 3 fingers up.'
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
    tips: 'Swipe hand swiftly left to instantly erase previous character.'
  }
];
