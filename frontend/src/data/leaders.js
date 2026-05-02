// // src/data/leaders.js

// export const leaders = [
//   {
//     id: 1,
//     name: { en: 'Rahman Baba', ps: 'رحمان بابا' },
//     role: { en: 'Sufi Poet', ps: 'صوفي شاعر' },
//     era: '1653 – 1711',
//     description: {
//       en: 'The beloved Sufi poet of the Pashtuns, known for his spiritual and mystic poetry about love and God.',
//       ps: 'د پښتنو د مینې صوفي شاعر چې د مینې او د خدای د مینې په اړه یې روحاني شاعري کړې.',
//     },
//     color: 'from-green-700 to-green-900',
//     emoji: '📜',
//     type: { en: 'Poet', ps: 'شاعر' },
//   },
//   {
//     id: 2,
//     name: { en: 'Khushal Khan Khattak', ps: 'خوشال خان خټک' },
//     role: { en: 'Warrior Poet & Chief', ps: 'جنګیالی شاعر او سردار' },
//     era: '1613 – 1689',
//     description: {
//       en: 'National poet of the Pashtuns and tribal chief who fought for Pashtun freedom and unity.',
//       ps: 'د پښتنو ملي شاعر او قبیلوي مشر چې د پښتنو د آزادۍ او یووالي لپاره یې جنګ وکړ.',
//     },
//     color: 'from-amber-600 to-amber-900',
//     emoji: '⚔️',
//     type: { en: 'Warrior & Poet', ps: 'جنګیالی او شاعر' },
//   },
//   {
//     id: 3,
//     name: { en: 'Benazir Bhutto', ps: 'بینظیر بھټو' },
//     role: { en: 'Prime Minister of Pakistan', ps: 'د پاکستان لومړۍ وزیره' },
//     era: '1953 – 2007',
//     description: {
//       en: 'First female Prime Minister of Pakistan and a symbol of courage and democracy for Pashtun women.',
//       ps: 'د پاکستان لومړۍ ښځینه لومړۍ وزیره او د پښتنو ښځو لپاره د زړورتیا او ولسواکۍ سمبول.',
//     },
//     color: 'from-rose-600 to-rose-900',
//     emoji: '🌹',
//     type: { en: 'Politician', ps: 'سیاستوال' },
//   },
//   {
//     id: 4,
//     name: { en: 'Ghani Khan', ps: 'غني خان' },
//     role: { en: 'Poet, Artist & Philosopher', ps: 'شاعر، هنرمند او فیلسوف' },
//     era: '1914 – 1996',
//     description: {
//       en: 'One of the greatest modern Pashto poets, artists and philosophers — son of Khan Abdul Ghaffar Khan.',
//       ps: 'د پښتو د عصري شاعرۍ، هنر او فلسفې یو له لویو استازو — د خان عبدالغفار خان زوی.',
//     },
//     color: 'from-purple-700 to-purple-900',
//     emoji: '🎨',
//     type: { en: 'Poet & Artist', ps: 'شاعر او هنرمند' },
//   },
//   {
//     id: 5,
//     name: { en: 'Khan Abdul Ghaffar Khan', ps: 'خان عبدالغفار خان' },
//     role: { en: 'Frontier Gandhi', ps: 'د سرحد ګاندي' },
//     era: '1890 – 1988',
//     description: {
//       en: 'Known as the Frontier Gandhi, he led a non-violent movement for Pashtun rights and dignity.',
//       ps: 'د سرحد ګاندي په نامه مشهور، هغه د پښتنو د حقونو او عزت لپاره د عدم تشدد غورځنګ مشري وکړه.',
//     },
//     color: 'from-red-700 to-red-900',
//     emoji: '☮️',
//     type: { en: 'Political Leader', ps: 'سیاسي مشر' },
//   },
//   {
//     id: 6,
//     name: { en: 'Malala Yousafzai', ps: 'ملاله یوسفزۍ' },
//     role: { en: 'Nobel Peace Prize Laureate', ps: 'د نوبل د سولې جایزې ګټونکې' },
//     era: '1997 – present',
//     description: {
//       en: 'Youngest Nobel Peace Prize winner and global advocate for girls education from Swat, Pakistan.',
//       ps: 'د نوبل د سولې جایزې کم عمره ګټونکې او د نجونو د زده کړې نړیواله مدافعه له سوات، پاکستان.',
//     },
//     color: 'from-teal-600 to-teal-900',
//     emoji: '📚',
//     type: { en: 'Activist', ps: 'فعاله' },
//   },
// ]


export const leaders = [
  {
    id: 1, slug: 'rahman-baba',
    name: { en: 'Rahman Baba', ps: 'رحمان بابا' },
    role: { en: 'Sufi Poet', ps: 'صوفي شاعر' },
    era: '1653 – 1711',
    color: 'from-green-700 to-green-900',
    emoji: '📜',
    type: { en: 'Poet', ps: 'شاعر' },
    description: {
      en: 'The beloved Sufi poet of the Pashtuns, known for his spiritual and mystic poetry about love and God.',
      ps: 'د پښتنو د مینې صوفي شاعر چې د مینې او د خدای د مینې په اړه یې روحاني شاعري کړې.',
    },
    biography: {
      en: `Rahman Baba, born Abdur Rahman, was a 17th-century Pashtun Sufi poet born in the village of Bahadur Kalay near Peshawar. He is considered one of the greatest poets in the Pashto language and is often called the "Nightingale of Peshawar." His poetry revolves around themes of divine love, mysticism, and the transient nature of life. Rahman Baba spent most of his life in spiritual contemplation and writing poetry that touched the hearts of generations of Pashtuns. His tomb in Peshawar became a shrine visited by thousands of devotees. His work continues to be recited, sung, and celebrated across the Pashtun world.`,
      ps: `رحمان بابا، د عبدالرحمان په نامه زیږیدلی، د ۱۷مې پیړۍ یو پښتون صوفي شاعر و چې د پښور سره نږدې د بهادر کلي په کلي کې زیږیدلی و. هغه د پښتو ژبې د لویو شاعرانو له ډلې شمیرل کیږي او ډیری وختونه "د پښور بلبل" بلل کیږي. د هغه شاعري د الهي مینې، عرفان او د ژوند د لنډوالي د موضوعاتو شاوخوا ده.`,
    },
    achievements: {
      en: [
        'Wrote over 350 mystical poems in Pashto',
        'Considered the national poet of the Pashtuns',
        'His shrine in Peshawar is a major cultural site',
        'Poetry translated into many world languages',
        'Inspired generations of Pashto literature',
      ],
      ps: [
        'د پښتو ژبې کې یې له ۳۵۰ زیاتې روحاني شعرونه ولیکل',
        'د پښتنو ملي شاعر ګڼل کیږي',
        'د پښور کې د هغه مزار یو لوی کلتوري ځای دی',
        'شاعري یې ډیرو نړیوالو ژبو ته ژباړل شوې',
        'د پښتو ادب ډیرو نسلونو ته یې الهام ورکړی',
      ],
    },
    quotes: [
      {
        ps: 'چې مینه وکړې نو بد مه ګڼه',
        en: 'If you love, think no ill of others',
      },
      {
        ps: 'د مینې لار ډیره اوږده ده',
        en: 'The path of love is very long',
      },
      {
        ps: 'رحمان د خدای مینه غواړه',
        en: 'Rahman, seek the love of God',
      },
    ],
    photoUrl: null,
  },
  {
    id: 2, slug: 'khushal-khan-khattak',
    name: { en: 'Khushal Khan Khattak', ps: 'خوشال خان خټک' },
    role: { en: 'Warrior Poet & Chief', ps: 'جنګیالی شاعر او سردار' },
    era: '1613 – 1689',
    color: 'from-amber-600 to-amber-900',
    emoji: '⚔️',
    type: { en: 'Warrior & Poet', ps: 'جنګیالی او شاعر' },
    description: {
      en: 'National poet of the Pashtuns and tribal chief who fought for Pashtun freedom and unity.',
      ps: 'د پښتنو ملي شاعر او قبیلوي مشر چې د پښتنو د آزادۍ او یووالي لپاره یې جنګ وکړ.',
    },
    biography: {
      en: `Khushal Khan Khattak was born in 1613 and became the paramount chief of the Khattak tribe. He is celebrated as the national poet of the Pashtuns and a great warrior who resisted Mughal rule. He wielded both the sword and the pen with equal mastery. His poetry reflects deep patriotism, Pashtun code of honor (Pashtunwali), love, and philosophy. He was imprisoned by the Mughal Emperor Aurangzeb for six years, which only deepened his resolve and poetry. He wrote over 45,000 verses and remains a towering figure in Pashto literature and Pashtun history.`,
      ps: `خوشال خان خټک د ۱۶۱۳ کال کې زیږیدلی و او د خټک قبیلې لوی مشر شو. هغه د پښتنو ملي شاعر او یو لوی جنګیالی دی چې د مغلو واکمنۍ سره یې مقاومت وکړ. هغه دواړه توره او قلم مساوي مهارت سره کاراوه.`,
    },
    achievements: {
      en: [
        'Wrote over 45,000 verses in Pashto',
        'Led resistance against Mughal Emperor Aurangzeb',
        'Chief of the powerful Khattak tribe',
        'Wrote on philosophy, medicine, falconry and war',
        'Symbol of Pashtun nationalism and resistance',
      ],
      ps: [
        'د پښتو ژبې کې یې له ۴۵۰۰۰ زیات بیتونه ولیکل',
        'د مغل بادشاه اورنګزیب پر ضد مقاومت یې مشري وکړه',
        'د پیاوړي خټک قبیلې مشر و',
        'د فلسفې، طب، بازبازۍ او جګړې په اړه یې ولیکل',
        'د پښتون ملیت او مقاومت سمبول',
      ],
    },
    quotes: [
      {
        ps: 'پښتون هغه دی چې پښتو وکړي',
        en: 'A Pashtun is one who practices Pashtunwali',
      },
      {
        ps: 'د میړانې نوم دې ژوندی وي',
        en: 'May the name of bravery live on forever',
      },
    ],
    photoUrl: null,
  },
  {
    id: 3, slug: 'benazir-bhutto',
    name: { en: 'Benazir Bhutto', ps: 'بینظیر بھټو' },
    role: { en: 'Prime Minister of Pakistan', ps: 'د پاکستان لومړۍ وزیره' },
    era: '1953 – 2007',
    color: 'from-rose-600 to-rose-900',
    emoji: '🌹',
    type: { en: 'Politician', ps: 'سیاستوال' },
    description: {
      en: 'First female Prime Minister of Pakistan and a symbol of courage and democracy for Pashtun women.',
      ps: 'د پاکستان لومړۍ ښځینه لومړۍ وزیره او د پښتنو ښځو لپاره د زړورتیا او ولسواکۍ سمبول.',
    },
    biography: {
      en: `Benazir Bhutto was born on June 21, 1953, in Karachi. She was the daughter of Prime Minister Zulfikar Ali Bhutto. She studied at Harvard and Oxford universities. In 1988, she became the first female Prime Minister of Pakistan and the first female head of government in the Muslim world. She served two terms as Prime Minister. After years in exile, she returned to Pakistan in 2007 to participate in elections but was tragically assassinated on December 27, 2007, in Rawalpindi. She remains a powerful symbol of courage, democracy and women's empowerment.`,
      ps: `بینظیر بھټو د ۱۹۵۳ کال د جون ۲۱ نیټه کراچۍ کې زیږیدلې وه. هغه د لومړي وزیر ذوالفقار علي بھټو لور وه. هغه د هارورډ او آکسفورډ پوهنتونونو کې زده کړې وکړې. د ۱۹۸۸ کال کې، هغه د پاکستان لومړۍ ښځینه لومړۍ وزیره شوه.`,
    },
    achievements: {
      en: [
        'First female Prime Minister of Pakistan',
        'First female head of government in Muslim world',
        'Graduated from Harvard and Oxford',
        'Led Pakistan Peoples Party (PPP)',
        'Champion of democracy and women\'s rights',
      ],
      ps: [
        'د پاکستان لومړۍ ښځینه لومړۍ وزیره',
        'د مسلمانو نړۍ کې د حکومت لومړۍ ښځینه مشره',
        'د هارورډ او آکسفورډ فارغه',
        'د پاکستان خلک ګوند (PPP) مشري وکړه',
        'د ولسواکۍ او د ښځو د حقونو مدافعه',
      ],
    },
    quotes: [
      {
        ps: 'زه د ژوند او مرګ تر منځ ولاړه یم، خو زه نه ډارم',
        en: 'I stand between life and death, but I am not afraid',
      },
      {
        ps: 'ولسواکي تر ټولو ښه انتقام دی',
        en: 'Democracy is the best revenge',
      },
    ],
    photoUrl: null,
  },
  {
    id: 4, slug: 'ghani-khan',
    name: { en: 'Ghani Khan', ps: 'غني خان' },
    role: { en: 'Poet, Artist & Philosopher', ps: 'شاعر، هنرمند او فیلسوف' },
    era: '1914 – 1996',
    color: 'from-purple-700 to-purple-900',
    emoji: '🎨',
    type: { en: 'Poet & Artist', ps: 'شاعر او هنرمند' },
    description: {
      en: 'One of the greatest modern Pashto poets, artists and philosophers — son of Khan Abdul Ghaffar Khan.',
      ps: 'د پښتو د عصري شاعرۍ، هنر او فلسفې یو له لویو استازو — د خان عبدالغفار خان زوی.',
    },
    biography: {
      en: `Ghani Khan was born on April 23, 1914, in Utmanzai, Charsadda. He was the son of the legendary Khan Abdul Ghaffar Khan (Bacha Khan). He was a multi-talented genius — a poet, sculptor, painter, philosopher and author. He wrote in Pashto, English and Urdu. His Pashto poetry is celebrated for its philosophical depth, romantic imagery and lyrical beauty. He studied in India and Europe. He also created beautiful sculptures and paintings. His most famous work "The Pathans" is an insightful portrait of Pashtun society and culture.`,
      ps: `غني خان د ۱۹۱۴ کال د اپریل ۲۳ نیټه د چارسده اوتمانزي کې زیږیدلی و. هغه د افسانوي خان عبدالغفار خان (باچا خان) زوی و. هغه یو څو استعداده عبقري و — شاعر، مجسمه ساز، رسام، فیلسوف او لیکوال.`,
    },
    achievements: {
      en: [
        'Renowned Pashto poet and philosopher',
        'Talented sculptor and painter',
        'Wrote "The Pathans" — a masterpiece on Pashtun culture',
        'Son of Bacha Khan — Frontier Gandhi',
        'Studied in India and Europe',
      ],
      ps: [
        'مشهور پښتو شاعر او فیلسوف',
        'استعداده مجسمه ساز او رسام',
        '"پښتانه" یې ولیکل — د پښتون کلتور یوه شاهکاره',
        'د باچا خان زوی — د سرحد ګاندي',
        'د هند او اروپا کې یې زده کړې وکړې',
      ],
    },
    quotes: [
      {
        ps: 'پښتون د غرونو زوی دی، آزاد او لوړ',
        en: 'The Pashtun is the son of mountains, free and high',
      },
      {
        ps: 'مینه د ژوند رڼا ده',
        en: 'Love is the light of life',
      },
    ],
    photoUrl: null,
  },
  {
    id: 5, slug: 'khan-abdul-ghaffar-khan',
    name: { en: 'Khan Abdul Ghaffar Khan', ps: 'خان عبدالغفار خان' },
    role: { en: 'Frontier Gandhi', ps: 'د سرحد ګاندي' },
    era: '1890 – 1988',
    color: 'from-red-700 to-red-900',
    emoji: '☮️',
    type: { en: 'Political Leader', ps: 'سیاسي مشر' },
    description: {
      en: 'Known as the Frontier Gandhi, he led a non-violent movement for Pashtun rights and dignity.',
      ps: 'د سرحد ګاندي په نامه مشهور، هغه د پښتنو د حقونو او عزت لپاره د عدم تشدد غورځنګ مشري وکړه.',
    },
    biography: {
      en: `Khan Abdul Ghaffar Khan, known as Bacha Khan and the Frontier Gandhi, was born in 1890 in Utmanzai. He founded the Khudai Khidmatgar movement — an army of non-violent soldiers dedicated to Pashtun rights and independence. He was a close ally of Mahatma Gandhi and spent over 30 years in prison for his beliefs. He was the first non-Indian to receive the Bharat Ratna — India's highest civilian honor. He dedicated his entire life to peace, education and the upliftment of the Pashtun people.`,
      ps: `خان عبدالغفار خان، د باچا خان او د سرحد ګاندي په نامه مشهور، د ۱۸۹۰ کال کې د اوتمانزي کې زیږیدلی و. هغه د خدایي خدمتګار غورځنګ بنسټ کیښود.`,
    },
    achievements: {
      en: [
        'Founded Khudai Khidmatgar non-violent movement',
        'First non-Indian to receive Bharat Ratna',
        'Spent over 30 years in prison for Pashtun rights',
        'Close ally of Mahatma Gandhi',
        'Dedicated life to peace and Pashtun education',
      ],
      ps: [
        'د خدایي خدمتګار د عدم تشدد غورځنګ بنسټ یې کیښود',
        'د بهارت رتنا د ترلاسه کولو لومړی غیر هندي',
        'د پښتنو د حقونو لپاره یې له ۳۰ کالو زیات زندان وکاږه',
        'د مهاتما ګاندي نږدې ملګری',
        'ژوند یې د سولې او پښتون زده کړې ته وقف کړ',
      ],
    },
    quotes: [
      {
        ps: 'زما وسله صبر او حق دی',
        en: 'My weapon is patience and truth',
      },
      {
        ps: 'د پښتنو خدمت د خدای خدمت دی',
        en: 'Service to Pashtuns is service to God',
      },
    ],
    photoUrl: null,
  },
  {
    id: 6, slug: 'malala-yousafzai',
    name: { en: 'Malala Yousafzai', ps: 'ملاله یوسفزۍ' },
    role: { en: 'Nobel Peace Prize Laureate', ps: 'د نوبل د سولې جایزې ګټونکې' },
    era: '1997 – present',
    color: 'from-teal-600 to-teal-900',
    emoji: '📚',
    type: { en: 'Activist', ps: 'فعاله' },
    description: {
      en: 'Youngest Nobel Peace Prize winner and global advocate for girls education from Swat, Pakistan.',
      ps: 'د نوبل د سولې جایزې کم عمره ګټونکې او د نجونو د زده کړې نړیواله مدافعه له سوات، پاکستان.',
    },
    biography: {
      en: `Malala Yousafzai was born on July 12, 1997, in Mingora, Swat. From a young age, she spoke out for girls' right to education when the Taliban banned girls from attending school in Swat. On October 9, 2012, she was shot by a Taliban gunman on her school bus but miraculously survived. She recovered in the UK and continued her activism with greater strength. In 2014, at age 17, she became the youngest-ever Nobel Peace Prize laureate. She established the Malala Fund to champion girls' education worldwide. She graduated from Oxford University in 2020.`,
      ps: `ملاله یوسفزۍ د ۱۹۹۷ کال د جولای ۱۲ نیټه د سوات مینګوره کې زیږیدلې وه. له کمه عمره، هغه د طالبانو لخوا د سوات کې د ښوونځیو بندیدو پر وخت د نجونو د زده کړې د حق لپاره غږ پورته کړ.`,
    },
    achievements: {
      en: [
        'Youngest Nobel Peace Prize winner (age 17)',
        'Founded the Malala Fund for girls education',
        'Survived Taliban assassination attempt in 2012',
        'Graduated from Oxford University in 2020',
        'Global icon for girls education and women\'s rights',
      ],
      ps: [
        'د نوبل د سولې جایزې کم عمره ګټونکې (۱۷ کلنه)',
        'د نجونو د زده کړې لپاره د ملالې فنډ بنسټ یې کیښود',
        'د ۲۰۱۲ کال کې د طالبانو د وژنې هڅې څخه ژوندۍ پاتې شوه',
        'د ۲۰۲۰ کال کې د آکسفورډ پوهنتون فارغه شوه',
        'د نجونو د زده کړې او د ښځو د حقونو نړیوال انځور',
      ],
    },
    quotes: [
      {
        ps: 'یو ماشوم، یو ښوونکی، یو کتاب او یو قلم نړۍ بدلولی شي',
        en: 'One child, one teacher, one book and one pen can change the world',
      },
      {
        ps: 'کله چې نړۍ چوپ وي، یو غږ به قوي وي',
        en: 'When the whole world is silent, even one voice becomes powerful',
      },
    ],
    photoUrl: null,
  },
]