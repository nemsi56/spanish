// Data model: TOPICS is an array of topic objects.
// Each topic has: id, title, charts (array of {verb, usage[], tenses: {tense: {rows:[{pronoun, form}]}}}), drills (array)
// Adding a new topic later just means pushing another object onto TOPICS.

const TOPICS = [
  {
    id: "ser-estar",
    title: '"To Be" — Ser vs. Estar',
    charts: [
      {
        verb: "Ser",
        usage: [
          "Identity, what something IS at its core: name, profession, nationality, relationships.",
          "Characteristics that are inherent or normally permanent: personality, physical traits, material.",
          "Time, dates, and where an event takes place.",
          "Origin ('soy de...') and material ('es de madera')."
        ],
        tenses: {
          "Present": {
            rows: [
              { pronoun: "yo", form: "soy" },
              { pronoun: "tú", form: "eres" },
              { pronoun: "él / ella / usted", form: "es" },
              { pronoun: "nosotros/as", form: "somos" },
              { pronoun: "vosotros/as", form: "sois" },
              { pronoun: "ellos/ellas/ustedes", form: "son" }
            ]
          },
          "Past — Imperfect (background, 'used to be')": {
            rows: [
              { pronoun: "yo", form: "era" },
              { pronoun: "tú", form: "eras" },
              { pronoun: "él / ella / usted", form: "era" },
              { pronoun: "nosotros/as", form: "éramos" },
              { pronoun: "vosotros/as", form: "erais" },
              { pronoun: "ellos/ellas/ustedes", form: "eran" }
            ]
          },
          "Past — Preterite (a completed state, rare with ser)": {
            rows: [
              { pronoun: "yo", form: "fui" },
              { pronoun: "tú", form: "fuiste" },
              { pronoun: "él / ella / usted", form: "fue" },
              { pronoun: "nosotros/as", form: "fuimos" },
              { pronoun: "vosotros/as", form: "fuisteis" },
              { pronoun: "ellos/ellas/ustedes", form: "fueron" }
            ]
          }
        }
      },
      {
        verb: "Estar",
        usage: [
          "Location — where something or someone physically is right now.",
          "Temporary states and conditions: mood, health, appearance at a moment ('está guapo hoy').",
          "Ongoing action: estar + gerund (estoy comiendo = I am eating).",
          "Mnemonic: PLACE + temporary Condition → use ESTAR. Identity/characteristic/time → use SER."
        ],
        tenses: {
          "Present": {
            rows: [
              { pronoun: "yo", form: "estoy" },
              { pronoun: "tú", form: "estás" },
              { pronoun: "él / ella / usted", form: "está" },
              { pronoun: "nosotros/as", form: "estamos" },
              { pronoun: "vosotros/as", form: "estáis" },
              { pronoun: "ellos/ellas/ustedes", form: "están" }
            ]
          },
          "Past — Imperfect (ongoing state)": {
            rows: [
              { pronoun: "yo", form: "estaba" },
              { pronoun: "tú", form: "estabas" },
              { pronoun: "él / ella / usted", form: "estaba" },
              { pronoun: "nosotros/as", form: "estábamos" },
              { pronoun: "vosotros/as", form: "estabais" },
              { pronoun: "ellos/ellas/ustedes", form: "estaban" }
            ]
          },
          "Past — Preterite (a completed change/moment)": {
            rows: [
              { pronoun: "yo", form: "estuve" },
              { pronoun: "tú", form: "estuviste" },
              { pronoun: "él / ella / usted", form: "estuvo" },
              { pronoun: "nosotros/as", form: "estuvimos" },
              { pronoun: "vosotros/as", form: "estuvisteis" },
              { pronoun: "ellos/ellas/ustedes", form: "estuvieron" }
            ]
          }
        }
      }
    ],
    drills: [
      { sentence: "Yo ___ médico.", answer: "soy", options: ["soy", "estoy", "fui", "era"], translation: "I am a doctor.", explanation: "Profession = identity → ser, present tense." },
      { sentence: "¿Dónde ___ el baño?", answer: "está", options: ["está", "es", "estuvo", "fue"], translation: "Where is the bathroom?", explanation: "Location → estar." },
      { sentence: "Ella ___ muy alta.", answer: "es", options: ["es", "está", "fue", "estaba"], translation: "She is very tall.", explanation: "Permanent physical trait → ser." },
      { sentence: "Hoy ___ cansado.", answer: "estoy", options: ["estoy", "soy", "fui", "era"], translation: "Today I am tired.", explanation: "Temporary condition → estar, present." },
      { sentence: "Nosotros ___ de México.", answer: "somos", options: ["somos", "estamos", "fuimos", "estábamos"], translation: "We are from Mexico.", explanation: "Origin → ser." },
      { sentence: "La fiesta ___ en mi casa.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The party is at my house.", explanation: "Where an event takes place → ser (not location of an object, but of the event itself)." },
      { sentence: "El café ___ frío.", answer: "está", options: ["está", "es", "estuvo", "fue"], translation: "The coffee is cold.", explanation: "Temporary state → estar." },
      { sentence: "Mis padres ___ profesores.", answer: "son", options: ["son", "están", "fueron", "estaban"], translation: "My parents are teachers.", explanation: "Profession → ser." },
      { sentence: "Ayer yo ___ en Madrid.", answer: "estuve", options: ["estuve", "fui", "era", "estaba"], translation: "Yesterday I was in Madrid.", explanation: "A completed location/state in the past → estar, preterite." },
      { sentence: "Cuando era niño, ___ muy tímido.", answer: "era", options: ["era", "estaba", "fui", "estuve"], translation: "When I was a kid, I was very shy.", explanation: "Ongoing background trait in the past → ser, imperfect." },
      { sentence: "¿Cómo ___ (tú)?", answer: "estás", options: ["estás", "eres", "fuiste", "eras"], translation: "How are you (feeling)?", explanation: "Asking about current state/mood → estar." },
      { sentence: "¿Cómo ___ (tú)?", answer: "eres", options: ["eres", "estás", "fuiste", "eras"], translation: "What are you like? (personality)", explanation: "Asking about inherent character → ser." },
      { sentence: "La boda ___ el sábado.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The wedding is on Saturday.", explanation: "Time of an event → ser." },
      { sentence: "Nosotros ___ estudiando toda la noche.", answer: "estuvimos", options: ["estuvimos", "fuimos", "somos", "éramos"], translation: "We were studying all night.", explanation: "estar + gerund for ongoing action, completed period → preterite of estar." },
      { sentence: "La mesa ___ de madera.", answer: "es", options: ["es", "está", "fue", "estuvo"], translation: "The table is made of wood.", explanation: "Material → ser." },
      { sentence: "El niño ___ enfermo ayer.", answer: "estuvo", options: ["estuvo", "fue", "era", "es"], translation: "The boy was sick yesterday.", explanation: "A temporary condition that started/ended → estar, preterite." },
      { sentence: "Vosotros ___ mis mejores amigos.", answer: "sois", options: ["sois", "estáis", "fuisteis", "erais"], translation: "You all are my best friends.", explanation: "Relationship/identity → ser." },
      { sentence: "Ustedes ___ muy ocupados esta semana.", answer: "están", options: ["están", "son", "estuvieron", "fueron"], translation: "You all are very busy this week.", explanation: "Temporary condition, present → estar." }
    ]
  }
];
