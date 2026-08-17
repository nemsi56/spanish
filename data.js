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
// drills[] is generated (not hand-written): for every verb/tense/pronoun cell
// we combine a handful of usage categories (profession, origin, location...)
// with a small vocabulary list, so each cell gets ~24 sentences instead of
// one or two. drill = { sentence, answer, options[], translation, explanation,
// verb, tense, pronounIndex } — verb/tense/pronounIndex point at the exact
// chart cell this drill exercises, so the Examples view can highlight it.

const SUBJECT_ES = ["Yo", "Tú", "Él/Ella/Usted", "Nosotros", "Ellos/Ustedes"];
const SUBJECT_ES_LOWER = ["yo", "tú", "él/ella/usted", "nosotros", "ellos/ustedes"];
const SUBJECT_EN = ["I", "You", "He/She/You", "We", "They/You all"];
const SUBJECT_EN_LOWER = ["I", "you", "he/she/you", "we", "they/you all"]; // "I" always stays capitalized in English
const BE_PRESENT_EN = ["am", "are", "is", "are", "are"];
const BE_PAST_EN = ["was", "were", "was", "were", "were"];

// Imperfect and preterite conjugate the same underlying idea ("was/were") in
// English, so the sentence itself needs a visible cue for WHY one tense was
// chosen over the other — these are the same signal words/phrases textbooks
// teach learners to watch for. Prepending one to every past-tense sentence
// makes the imperfect/preterite contrast visible in the example itself, not
// just in the explanation text below it.
const IMPERFECT_CUES = [
  { es: "Antes", en: "Before" },
  { es: "De niño/a", en: "As a kid" },
  { es: "Todos los días", en: "Every day" },
  { es: "Siempre", en: "Always" },
  { es: "En esa época", en: "Back then" },
  { es: "Normalmente", en: "Normally" }
];
const PRETERITE_CUES = [
  { es: "Ayer", en: "Yesterday" },
  { es: "Una vez", en: "Once" },
  { es: "El año pasado", en: "Last year" },
  { es: "De repente", en: "Suddenly" },
  { es: "Esa tarde", en: "That afternoon" },
  { es: "Por un tiempo", en: "For a while" }
];

// Vocabulary is gender-invariant wherever possible (words ending in -e/-a/-ista/
// -iense etc.) so the same item works for any subject without needing separate
// masculine/feminine forms. sg/pl covers subject-number agreement instead.
const SER_PROFESSION = [
  { sg: "estudiante", pl: "estudiantes", en: "a student", enPl: "students" },
  { sg: "artista", pl: "artistas", en: "an artist", enPl: "artists" },
  { sg: "dentista", pl: "dentistas", en: "a dentist", enPl: "dentists" },
  { sg: "periodista", pl: "periodistas", en: "a journalist", enPl: "journalists" },
  { sg: "gerente", pl: "gerentes", en: "a manager", enPl: "managers" },
  { sg: "cantante", pl: "cantantes", en: "a singer", enPl: "singers" }
];
const SER_ORIGIN = [
  { es: "México", en: "Mexico" },
  { es: "Perú", en: "Peru" },
  { es: "España", en: "Spain" },
  { es: "Colombia", en: "Colombia" },
  { es: "Argentina", en: "Argentina" },
  { es: "Chile", en: "Chile" }
];
const SER_NATIONALITY = [
  { sg: "canadiense", pl: "canadienses", en: "Canadian", enPl: "Canadian" },
  { sg: "estadounidense", pl: "estadounidenses", en: "American", enPl: "American" },
  { sg: "costarricense", pl: "costarricenses", en: "Costa Rican", enPl: "Costa Rican" },
  { sg: "nicaragüense", pl: "nicaragüenses", en: "Nicaraguan", enPl: "Nicaraguan" },
  { sg: "marroquí", pl: "marroquíes", en: "Moroccan", enPl: "Moroccan" },
  { sg: "israelí", pl: "israelíes", en: "Israeli", enPl: "Israeli" }
];
const SER_CHARACTERISTIC = [
  { sg: "inteligente", pl: "inteligentes", en: "smart", enPl: "smart" },
  { sg: "amable", pl: "amables", en: "kind", enPl: "kind" },
  { sg: "paciente", pl: "pacientes", en: "patient", enPl: "patient" },
  { sg: "responsable", pl: "responsables", en: "responsible", enPl: "responsible" },
  { sg: "puntual", pl: "puntuales", en: "punctual", enPl: "punctual" },
  { sg: "valiente", pl: "valientes", en: "brave", enPl: "brave" }
];
const ESTAR_LOCATION = [
  { es: "la oficina", en: "the office" },
  { es: "el parque", en: "the park" },
  { es: "la escuela", en: "school" },
  { es: "la playa", en: "the beach" },
  { es: "el hospital", en: "the hospital" },
  { es: "la biblioteca", en: "the library" }
];
const ESTAR_CONDITION = [
  { sg: "cansado", pl: "cansados", en: "tired", enPl: "tired" },
  { sg: "ocupado", pl: "ocupados", en: "busy", enPl: "busy" },
  { sg: "enfermo", pl: "enfermos", en: "sick", enPl: "sick" },
  { sg: "nervioso", pl: "nerviosos", en: "nervous", enPl: "nervous" },
  { sg: "preocupado", pl: "preocupados", en: "worried", enPl: "worried" },
  { sg: "emocionado", pl: "emocionados", en: "excited", enPl: "excited" }
];
const ESTAR_ACTIVITY = [
  { es: "trabajando", en: "working" },
  { es: "estudiando", en: "studying" },
  { es: "cocinando", en: "cooking" },
  { es: "viajando", en: "traveling" },
  { es: "leyendo", en: "reading" },
  { es: "durmiendo", en: "sleeping" }
];
const ESTAR_SITUATION = [
  { es: "de vacaciones", en: "on vacation" },
  { es: "de viaje", en: "traveling" },
  { es: "de compras", en: "shopping" },
  { es: "de acuerdo", en: "in agreement" },
  { es: "a dieta", en: "on a diet" },
  { es: "de guardia", en: "on duty" }
];

// Each category has one explanation PER TENSE, not just a category label with
// the tense name stapled on — the point is to say why that tense fits this
// kind of sentence specifically. A tense with no entry here is skipped for
// that category: e.g. ser-preterite is omitted for origin/nationality
// because "fui de Chile" isn't how Spanish actually expresses a change of
// origin or nationality — forcing it would just produce a confusing example.
const SER_CATEGORIES = [
  {
    items: SER_PROFESSION,
    es: (item, pl) => (pl ? item.pl : item.sg),
    en: (item, pl) => (pl ? item.enPl : item.en),
    explanations: {
      present: "Profession stated as a current fact.",
      imperfect: "An ongoing profession in the past — background information, like scene-setting in a story, with no specific end in mind.",
      preterite: "The profession is framed as a finished chapter — a former job, clearly over."
    }
  },
  {
    items: SER_ORIGIN,
    es: item => `de ${item.es}`,
    en: item => `from ${item.en}`,
    explanations: {
      present: "Where someone is from — a lasting fact about identity.",
      imperfect: "Origin given as background at some point in the past, e.g. setting a scene, not describing a change."
      // no preterite: origin doesn't "complete" — real speakers don't say "fui de Chile" to mean this.
    }
  },
  {
    items: SER_NATIONALITY,
    es: (item, pl) => (pl ? item.pl : item.sg),
    en: (item, pl) => (pl ? item.enPl : item.en),
    explanations: {
      present: "Nationality — treated as an inherent trait.",
      imperfect: "Nationality given as background information about the past."
      // no preterite: nationality doesn't naturally "complete" as an event.
    }
  },
  {
    items: SER_CHARACTERISTIC,
    es: (item, pl) => `muy ${pl ? item.pl : item.sg}`,
    en: (item, pl) => `very ${pl ? item.enPl : item.en}`,
    explanations: {
      present: "An inherent personality trait, true in general.",
      imperfect: "An ongoing trait or general truth about someone at a past time.",
      preterite: "A one-off instance of behaving this way, not a general trait — a single completed moment."
    }
  }
];
const ESTAR_CATEGORIES = [
  {
    items: ESTAR_LOCATION,
    es: item => `en ${item.es}`,
    en: item => `at ${item.en}`,
    explanations: {
      present: "Where someone or something physically is, right now.",
      imperfect: "Ongoing location at a past moment — background to a story, not a single event.",
      preterite: "A completed stay in a place, with a clear start and end."
    }
  },
  {
    items: ESTAR_CONDITION,
    es: (item, pl) => `muy ${pl ? item.pl : item.sg}`,
    en: (item, pl) => `very ${pl ? item.enPl : item.en}`,
    explanations: {
      present: "A temporary mood or condition, true right now.",
      imperfect: "A temporary mood or condition that was in progress at a past moment.",
      preterite: "A temporary mood or condition with a clear start and end — it kicked in and then passed."
    }
  },
  {
    items: ESTAR_ACTIVITY,
    es: item => item.es,
    en: item => item.en,
    explanations: {
      present: "estar + gerund: an action in progress right now.",
      imperfect: "estar + gerund: an action that was in progress at a past moment — often interrupted by something else.",
      preterite: "estar + gerund: an action that took place over one specific, completed stretch of time."
    }
  },
  {
    items: ESTAR_SITUATION,
    es: item => item.es,
    en: item => item.en,
    explanations: {
      present: "A temporary situation, true right now.",
      imperfect: "A temporary situation that was ongoing at a past moment.",
      preterite: "A temporary situation with a clear start and end."
    }
  }
];

function allFormsForPronoun(topic, pIdx) {
  const forms = [];
  topic.verbs.forEach(verb => {
    topic.tenseOrder.forEach(tenseKey => forms.push(verb.tenses[tenseKey].forms[pIdx]));
  });
  return forms;
}

function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildOptions(topic, pIdx, answer) {
  const distractors = shuffleCopy(allFormsForPronoun(topic, pIdx).filter(f => f !== answer)).slice(0, 3);
  return [answer, ...distractors];
}

// Combines each usage category with its vocabulary to produce sentences for
// every verb/tense/pronoun cell. A category is skipped for a tense it has no
// explanation for (see SER_CATEGORIES/ESTAR_CATEGORIES) rather than forcing
// a combination that isn't how Spanish is actually used.
function generateDrills(topic) {
  const drills = [];
  const categoriesByVerb = { ser: SER_CATEGORIES, estar: ESTAR_CATEGORIES };

  topic.verbs.forEach(verb => {
    const categories = categoriesByVerb[verb.key];
    topic.tenseOrder.forEach(tenseKey => {
      topic.pronouns.forEach((_, pIdx) => {
        const isPlural = pIdx === 3 || pIdx === 4;
        const verbForm = verb.tenses[tenseKey].forms[pIdx];
        const beEn = tenseKey === "present" ? BE_PRESENT_EN[pIdx] : BE_PAST_EN[pIdx];

        categories.forEach(cat => {
          const explanation = cat.explanations[tenseKey];
          if (!explanation) return;

          const cues = tenseKey === "imperfect" ? IMPERFECT_CUES : tenseKey === "preterite" ? PRETERITE_CUES : null;

          cat.items.forEach((item, itemIdx) => {
            const complementEs = cat.es(item, isPlural);
            const complementEn = cat.en(item, isPlural);
            let sentence, translation, cueNote;

            if (cues) {
              const cue = cues[itemIdx % cues.length];
              sentence = `${cue.es}, ${SUBJECT_ES_LOWER[pIdx]} ___ ${complementEs}.`;
              translation = `${cue.en}, ${SUBJECT_EN_LOWER[pIdx]} ${beEn} ${complementEn}.`;
              cueNote = ` Signal phrase "${cue.es}" is why this is ${verb.tenses[tenseKey].label.toLowerCase()}, not the other past tense.`;
            } else {
              sentence = `${SUBJECT_ES[pIdx]} ___ ${complementEs}.`;
              translation = `${SUBJECT_EN[pIdx]} ${beEn} ${complementEn}.`;
              cueNote = "";
            }

            drills.push({
              sentence,
              answer: verbForm,
              options: buildOptions(topic, pIdx, verbForm),
              translation,
              explanation: explanation + cueNote,
              verb: verb.key,
              tense: tenseKey,
              pronounIndex: pIdx
            });
          });
        });
      });
    });
  });

  return drills;
}

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
    ]
  }
];

TOPICS.forEach(topic => {
  topic.drills = generateDrills(topic);
});
