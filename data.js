// Data model: TOPICS is an array of topic objects.
// Each topic has: id, title, pronouns[], tenseOrder[], tenseMeta{}, verbs[], drills[]
//
// tenseMeta[tenseKey] = { icon, hint } — a short glyph + phrase shown under the
// chart's column header so the reader can tell at a glance what kind of time
// each tense represents (ongoing vs. a single completed point).
//
// verbs[i] = { key, label, usage[], tenses: { <tenseKey>: { label, forms[] } } }
//   forms[] is aligned index-for-index with `pronouns`. Latin American Spanish
//   only — no vosotros/as; ustedes covers 2nd person plural everywhere.
//
// drills[i] = { sentence, answer, options[], translation, explanation, verb, tense, pronounIndex }
//   verb/tense/pronounIndex point at the exact chart cell this drill exercises,
//   so the Examples view can highlight it.

const TOPICS = [
  {
    id: "ser-estar",
    title: '"To Be" — Ser vs. Estar',
    pronouns: ["yo", "tú", "él / ella / usted", "nosotros/as", "ellos/ellas/ustedes"],
    tenseOrder: ["present", "imperfect", "preterite"],
    tenseMeta: {
      present: { icon: "→", hint: "true right now" },
      imperfect: { icon: "∿∿∿", hint: "ongoing / repeated / background, no clear end" },
      preterite: { icon: "•", hint: "a single completed moment, clear start & end" }
    },
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
          present: { label: "Present", forms: ["soy", "eres", "es", "somos", "son"] },
          imperfect: { label: "Imperfect", forms: ["era", "eras", "era", "éramos", "eran"] },
          preterite: { label: "Preterite", forms: ["fui", "fuiste", "fue", "fuimos", "fueron"] }
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
          present: { label: "Present", forms: ["estoy", "estás", "está", "estamos", "están"] },
          imperfect: { label: "Imperfect", forms: ["estaba", "estabas", "estaba", "estábamos", "estaban"] },
          preterite: { label: "Preterite", forms: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvieron"] }
        }
      }
    ],
    drills: [
      // yo — soy / era / fui / estoy / estaba / estuve
      { sentence: "Yo ___ ingeniera.", answer: "soy", options: ["soy", "estoy", "fui", "estaba"], translation: "I am an engineer.", explanation: "Profession = identity → ser, present.", verb: "ser", tense: "present", pronounIndex: 0 },
      { sentence: "Yo ___ de Perú.", answer: "soy", options: ["soy", "estuve", "era", "estoy"], translation: "I am from Peru.", explanation: "Origin → ser, present.", verb: "ser", tense: "present", pronounIndex: 0 },
      { sentence: "Yo ___ muy cansada hoy.", answer: "estoy", options: ["estoy", "soy", "fui", "era"], translation: "I am very tired today.", explanation: "Temporary condition → estar, present.", verb: "estar", tense: "present", pronounIndex: 0 },
      { sentence: "Yo ___ en el gimnasio ahora.", answer: "estoy", options: ["estoy", "soy", "fui", "estaba"], translation: "I am at the gym right now.", explanation: "Location right now → estar, present.", verb: "estar", tense: "present", pronounIndex: 0 },
      { sentence: "Cuando era niña, yo ___ muy curiosa.", answer: "era", options: ["era", "fui", "estaba", "soy"], translation: "When I was a girl, I was very curious.", explanation: "Ongoing personality trait in the past → ser, imperfect.", verb: "ser", tense: "imperfect", pronounIndex: 0 },
      { sentence: "Anoche yo ___ preocupada por el examen.", answer: "estaba", options: ["estaba", "era", "estuve", "soy"], translation: "Last night I was worried about the exam.", explanation: "Temporary emotional state, ongoing at that moment → estar, imperfect.", verb: "estar", tense: "imperfect", pronounIndex: 0 },
      { sentence: "Yo ___ el último en salir.", answer: "fui", options: ["fui", "era", "estuve", "soy"], translation: "I was the last one to leave.", explanation: "A single, completed role at one moment → ser, preterite.", verb: "ser", tense: "preterite", pronounIndex: 0 },
      { sentence: "Yo ___ en Bogotá la semana pasada.", answer: "estuve", options: ["estuve", "fui", "estaba", "soy"], translation: "I was in Bogotá last week.", explanation: "A completed stay with a clear start and end → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 0 },

      // tú — eres / eras / fuiste / estás / estabas / estuviste
      { sentence: "Tú ___ muy generoso.", answer: "eres", options: ["eres", "estás", "fuiste", "eras"], translation: "You are very generous.", explanation: "Personality trait → ser, present.", verb: "ser", tense: "present", pronounIndex: 1 },
      { sentence: "¿De dónde ___ tú?", answer: "eres", options: ["eres", "estás", "estuviste", "eras"], translation: "Where are you from?", explanation: "Origin → ser, present.", verb: "ser", tense: "present", pronounIndex: 1 },
      { sentence: "¿Cómo ___ tú hoy?", answer: "estás", options: ["estás", "eres", "fuiste", "estabas"], translation: "How are you today?", explanation: "Current mood/state → estar, present.", verb: "estar", tense: "present", pronounIndex: 1 },
      { sentence: "Tú ___ en mi casa ahora mismo.", answer: "estás", options: ["estás", "eres", "eras", "fuiste"], translation: "You are at my house right now.", explanation: "Location right now → estar, present.", verb: "estar", tense: "present", pronounIndex: 1 },
      { sentence: "Tú ___ mi mejor amigo en la escuela.", answer: "eras", options: ["eras", "estabas", "fuiste", "eres"], translation: "You were my best friend in school.", explanation: "Ongoing relationship in the past → ser, imperfect.", verb: "ser", tense: "imperfect", pronounIndex: 1 },
      { sentence: "Tú ___ muy callado esa tarde.", answer: "estabas", options: ["estabas", "eras", "estuviste", "eres"], translation: "You were very quiet that afternoon.", explanation: "Temporary state in progress → estar, imperfect.", verb: "estar", tense: "imperfect", pronounIndex: 1 },
      { sentence: "Tú ___ muy amable conmigo ese día.", answer: "fuiste", options: ["fuiste", "eras", "estuviste", "eres"], translation: "You were very kind to me that day.", explanation: "A completed, one-time behavior → ser, preterite.", verb: "ser", tense: "preterite", pronounIndex: 1 },
      { sentence: "¿Dónde ___ tú anoche?", answer: "estuviste", options: ["estuviste", "fuiste", "estabas", "eres"], translation: "Where were you last night?", explanation: "A completed location at a specific past moment → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 1 },

      // él/ella/usted — es / era / fue / está / estaba / estuvo
      { sentence: "Mi hermana ___ doctora.", answer: "es", options: ["es", "está", "fue", "era"], translation: "My sister is a doctor.", explanation: "Profession → ser, present.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "La mesa ___ de madera.", answer: "es", options: ["es", "está", "estuvo", "era"], translation: "The table is made of wood.", explanation: "Material → ser, present.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "El café ___ frío.", answer: "está", options: ["está", "es", "fue", "estaba"], translation: "The coffee is cold.", explanation: "Temporary condition → estar, present.", verb: "estar", tense: "present", pronounIndex: 2 },
      { sentence: "¿Dónde ___ el baño?", answer: "está", options: ["está", "es", "fue", "estuvo"], translation: "Where is the bathroom?", explanation: "Location → estar, present.", verb: "estar", tense: "present", pronounIndex: 2 },
      { sentence: "Mi abuelo ___ carpintero.", answer: "era", options: ["era", "estaba", "fue", "es"], translation: "My grandfather was a carpenter.", explanation: "Ongoing profession in the past → ser, imperfect.", verb: "ser", tense: "imperfect", pronounIndex: 2 },
      { sentence: "Ella ___ en casa cuando llamé.", answer: "estaba", options: ["estaba", "era", "estuvo", "es"], translation: "She was home when I called.", explanation: "Ongoing location at a past moment → estar, imperfect.", verb: "estar", tense: "imperfect", pronounIndex: 2 },
      { sentence: "La fiesta ___ un desastre.", answer: "fue", options: ["fue", "estuvo", "era", "es"], translation: "The party was a disaster.", explanation: "A single, completed event → ser, preterite.", verb: "ser", tense: "preterite", pronounIndex: 2 },
      { sentence: "El niño ___ enfermo ayer.", answer: "estuvo", options: ["estuvo", "fue", "estaba", "es"], translation: "The boy was sick yesterday.", explanation: "A completed condition with a clear start and end → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 2 },

      // nosotros/as — somos / éramos / fuimos / estamos / estábamos / estuvimos
      { sentence: "Nosotros ___ de México.", answer: "somos", options: ["somos", "estamos", "fuimos", "éramos"], translation: "We are from Mexico.", explanation: "Origin → ser, present.", verb: "ser", tense: "present", pronounIndex: 3 },
      { sentence: "___ buenos amigos.", answer: "Somos", options: ["Somos", "Estamos", "Éramos", "Fuimos"], translation: "We are good friends.", explanation: "Relationship/identity → ser, present.", verb: "ser", tense: "present", pronounIndex: 3 },
      { sentence: "___ listos para salir.", answer: "Estamos", options: ["Estamos", "Somos", "Fuimos", "Estábamos"], translation: "We are ready to leave.", explanation: "Temporary readiness → estar, present.", verb: "estar", tense: "present", pronounIndex: 3 },
      { sentence: "Nosotros ___ en el parque.", answer: "estamos", options: ["estamos", "somos", "fuimos", "estábamos"], translation: "We are at the park.", explanation: "Location → estar, present.", verb: "estar", tense: "present", pronounIndex: 3 },
      { sentence: "___ vecinos hace muchos años.", answer: "Éramos", options: ["Éramos", "Estábamos", "Fuimos", "Somos"], translation: "We were neighbors many years ago.", explanation: "Ongoing relationship in the past → ser, imperfect.", verb: "ser", tense: "imperfect", pronounIndex: 3 },
      { sentence: "Nosotros ___ cansados después del viaje.", answer: "estábamos", options: ["estábamos", "éramos", "estuvimos", "somos"], translation: "We were tired after the trip.", explanation: "Temporary state in progress → estar, imperfect.", verb: "estar", tense: "imperfect", pronounIndex: 3 },
      { sentence: "___ campeones ese año.", answer: "Fuimos", options: ["Fuimos", "Éramos", "Estuvimos", "Somos"], translation: "We were champions that year.", explanation: "A completed achievement → ser, preterite.", verb: "ser", tense: "preterite", pronounIndex: 3 },
      { sentence: "___ en la playa todo el fin de semana.", answer: "Estuvimos", options: ["Estuvimos", "Fuimos", "Estábamos", "Somos"], translation: "We were at the beach all weekend.", explanation: "A completed stay with a clear duration → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 3 },

      // ellos/ellas/ustedes — son / eran / fueron / están / estaban / estuvieron
      { sentence: "Mis padres ___ profesores.", answer: "son", options: ["son", "están", "fueron", "eran"], translation: "My parents are teachers.", explanation: "Profession → ser, present.", verb: "ser", tense: "present", pronounIndex: 4 },
      { sentence: "Ustedes ___ muy amables.", answer: "son", options: ["son", "están", "eran", "fueron"], translation: "You all are very kind.", explanation: "Characteristic → ser, present.", verb: "ser", tense: "present", pronounIndex: 4 },
      { sentence: "Ellos ___ de vacaciones.", answer: "están", options: ["están", "son", "fueron", "estaban"], translation: "They are on vacation.", explanation: "Temporary situation → estar, present.", verb: "estar", tense: "present", pronounIndex: 4 },
      { sentence: "¿Dónde ___ ustedes?", answer: "están", options: ["están", "son", "fueron", "estaban"], translation: "Where are you all?", explanation: "Location → estar, present.", verb: "estar", tense: "present", pronounIndex: 4 },
      { sentence: "Mis padres ___ muy estrictos.", answer: "eran", options: ["eran", "estaban", "fueron", "son"], translation: "My parents were very strict.", explanation: "Ongoing personality trait in the past → ser, imperfect.", verb: "ser", tense: "imperfect", pronounIndex: 4 },
      { sentence: "Ellos ___ contentos con el resultado.", answer: "estaban", options: ["estaban", "eran", "estuvieron", "son"], translation: "They were happy with the result.", explanation: "Temporary emotional state → estar, imperfect.", verb: "estar", tense: "imperfect", pronounIndex: 4 },
      { sentence: "Ellos ___ los ganadores del concurso.", answer: "fueron", options: ["fueron", "estuvieron", "eran", "son"], translation: "They were the winners of the contest.", explanation: "A completed role at one moment → ser, preterite.", verb: "ser", tense: "preterite", pronounIndex: 4 },
      { sentence: "___ esperando por dos horas.", answer: "Estuvieron", options: ["Estuvieron", "Fueron", "Estaban", "Son"], translation: "They were waiting for two hours.", explanation: "A completed span of time → estar, preterite.", verb: "estar", tense: "preterite", pronounIndex: 4 },

      // extra present-tense variety
      { sentence: "Mis abuelos ___ de Colombia.", answer: "son", options: ["son", "están", "fueron", "eran"], translation: "My grandparents are from Colombia.", explanation: "Origin → ser, present.", verb: "ser", tense: "present", pronounIndex: 4 },
      { sentence: "La boda ___ el sábado.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The wedding is on Saturday.", explanation: "Time of an event → ser, present.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "La fiesta ___ en mi casa.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The party is at my house.", explanation: "Where an event takes place → ser (the event itself, not an object) → present.", verb: "ser", tense: "present", pronounIndex: 2 },
      { sentence: "Ustedes ___ muy ocupados esta semana.", answer: "están", options: ["están", "son", "estuvieron", "fueron"], translation: "You all are very busy this week.", explanation: "Temporary condition → estar, present.", verb: "estar", tense: "present", pronounIndex: 4 }
    ]
  }
];
