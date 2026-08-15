// Data model: TOPICS is an array of topic objects.
// Each topic has: id, title, pronouns[], verbs[], tenseOrder[], drills[]
//
// verbs[i] = { key, label, usage[], tenses: { <tenseKey>: { label, note, forms[] } } }
//   forms[] is aligned index-for-index with `pronouns`.
//
// drills[i] = { sentence, answer, options[], translation, explanation, verb, tense, pronounIndex }
//   verb/tense/pronounIndex point at the exact chart cell this drill exercises,
//   so the Examples view can highlight it.

const TOPICS = [
  {
    id: "ser-estar",
    title: '"To Be" — Ser vs. Estar',
    pronouns: ["yo", "tú", "él / ella / usted", "nosotros/as", "vosotros/as", "ellos/ellas/ustedes"],
    tenseOrder: ["present", "imperfect", "preterite"],
    verbs: [
      {
        key: "ser",
        label: "Ser",
        usage: [
          "Identity, what something IS at its core: name, profession, nationality, relationships.",
          "Characteristics that are inherent or normally permanent: personality, physical traits, material.",
          "Time, dates, and where an event takes place.",
          "Origin ('soy de...') and material ('es de madera')."
        ],
        tenses: {
          present: { label: "Present", forms: ["soy", "eres", "es", "somos", "sois", "son"] },
          imperfect: { label: "Imperfect", note: "background, 'used to be'", forms: ["era", "eras", "era", "éramos", "erais", "eran"] },
          preterite: { label: "Preterite", note: "rare with ser", forms: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"] }
        }
      },
      {
        key: "estar",
        label: "Estar",
        usage: [
          "Location — where something or someone physically is right now.",
          "Temporary states and conditions: mood, health, appearance at a moment ('está guapo hoy').",
          "Ongoing action: estar + gerund (estoy comiendo = I am eating).",
          "Mnemonic: PLACE + temporary Condition → ESTAR. Identity/characteristic/time → SER."
        ],
        tenses: {
          present: { label: "Present", forms: ["estoy", "estás", "está", "estamos", "estáis", "están"] },
          imperfect: { label: "Imperfect", note: "ongoing state", forms: ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"] },
          preterite: { label: "Preterite", note: "a completed change/moment", forms: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"] }
        }
      }
    ],
    drills: [
      { sentence: "Yo ___ médico.", answer: "soy", options: ["soy", "estoy", "fui", "era"], translation: "I am a doctor.", explanation: "Profession = identity → ser, present tense.", verb: "ser", tense: "present", pronounIndex: 0 },
      { sentence: "¿Dónde ___ el baño?", answer: "está", options: ["está", "es", "estuvo", "fue"], translation: "Where is the bathroom?", explanation: "Location → estar.", verb: "estar", tense: "present", pronounIndex: 2 },
      { sentence: "Ella ___ muy alta.", answer: "es", options: ["es", "está", "fue", "estaba"], translation: "She is very tall.", explanation: "Permanent physical trait → ser.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "Hoy ___ cansado.", answer: "estoy", options: ["estoy", "soy", "fui", "era"], translation: "Today I am tired.", explanation: "Temporary condition → estar, present.", verb: "estar", tense: "present", pronounIndex: 0 },
      { sentence: "Nosotros ___ de México.", answer: "somos", options: ["somos", "estamos", "fuimos", "estábamos"], translation: "We are from Mexico.", explanation: "Origin → ser.", verb: "ser", tense: "present", pronounIndex: 3 },
      { sentence: "La fiesta ___ en mi casa.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The party is at my house.", explanation: "Where an event takes place → ser (not location of an object, but of the event itself).", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "El café ___ frío.", answer: "está", options: ["está", "es", "estuvo", "fue"], translation: "The coffee is cold.", explanation: "Temporary state → estar.", verb: "estar", tense: "present", pronounIndex: 2 },
      { sentence: "Mis padres ___ profesores.", answer: "son", options: ["son", "están", "fueron", "estaban"], translation: "My parents are teachers.", explanation: "Profession → ser.", verb: "ser", tense: "present", pronounIndex: 5 },
      { sentence: "Ayer yo ___ en Madrid.", answer: "estuve", options: ["estuve", "fui", "era", "estaba"], translation: "Yesterday I was in Madrid.", explanation: "A completed location/state in the past → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 0 },
      { sentence: "Cuando era niño, ___ muy tímido.", answer: "era", options: ["era", "estaba", "fui", "estuve"], translation: "When I was a kid, I was very shy.", explanation: "Ongoing background trait in the past → ser, imperfect.", verb: "ser", tense: "imperfect", pronounIndex: 0 },
      { sentence: "¿Cómo ___ (tú)?", answer: "estás", options: ["estás", "eres", "fuiste", "eras"], translation: "How are you (feeling)?", explanation: "Asking about current state/mood → estar.", verb: "estar", tense: "present", pronounIndex: 1 },
      { sentence: "¿Cómo ___ (tú)?", answer: "eres", options: ["eres", "estás", "fuiste", "eras"], translation: "What are you like? (personality)", explanation: "Asking about inherent character → ser.", verb: "ser", tense: "present", pronounIndex: 1 },
      { sentence: "La boda ___ el sábado.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The wedding is on Saturday.", explanation: "Time of an event → ser.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "Nosotros ___ estudiando toda la noche.", answer: "estuvimos", options: ["estuvimos", "fuimos", "somos", "éramos"], translation: "We were studying all night.", explanation: "estar + gerund for ongoing action, completed period → preterite of estar.", verb: "estar", tense: "preterite", pronounIndex: 3 },
      { sentence: "La mesa ___ de madera.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The table is made of wood.", explanation: "Material → ser.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "El niño ___ enfermo ayer.", answer: "estuvo", options: ["estuvo", "fue", "era", "es"], translation: "The boy was sick yesterday.", explanation: "A temporary condition that started/ended → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 2 },
      { sentence: "Vosotros ___ mis mejores amigos.", answer: "sois", options: ["sois", "estáis", "fuisteis", "erais"], translation: "You all are my best friends.", explanation: "Relationship/identity → ser.", verb: "ser", tense: "present", pronounIndex: 4 },
      { sentence: "Ustedes ___ muy ocupados esta semana.", answer: "están", options: ["están", "son", "estuvieron", "fueron"], translation: "You all are very busy this week.", explanation: "Temporary condition, present → estar.", verb: "estar", tense: "present", pronounIndex: 5 }
    ]
  }
];
