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
const SUBJECT_EN = ["I", "You", "He/She/You", "We", "They/You all"];
const BE_PRESENT_EN = ["am", "are", "is", "are", "are"];
const BE_PAST_EN = ["was", "were", "was", "were", "were"];

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

const SER_CATEGORIES = [
  { explanation: "Profession = identity", items: SER_PROFESSION, es: (item, pl) => (pl ? item.pl : item.sg), en: (item, pl) => (pl ? item.enPl : item.en) },
  { explanation: "Origin", items: SER_ORIGIN, es: item => `de ${item.es}`, en: item => `from ${item.en}` },
  { explanation: "Nationality", items: SER_NATIONALITY, es: (item, pl) => (pl ? item.pl : item.sg), en: (item, pl) => (pl ? item.enPl : item.en) },
  { explanation: "Characteristic / personality", items: SER_CHARACTERISTIC, es: (item, pl) => `muy ${pl ? item.pl : item.sg}`, en: (item, pl) => `very ${pl ? item.enPl : item.en}` }
];
const ESTAR_CATEGORIES = [
  { explanation: "Location", items: ESTAR_LOCATION, es: item => `en ${item.es}`, en: item => `at ${item.en}` },
  { explanation: "Temporary condition", items: ESTAR_CONDITION, es: (item, pl) => `muy ${pl ? item.pl : item.sg}`, en: (item, pl) => `very ${pl ? item.enPl : item.en}` },
  { explanation: "Ongoing action (estar + gerund)", items: ESTAR_ACTIVITY, es: item => item.es, en: item => item.en },
  { explanation: "Temporary situation", items: ESTAR_SITUATION, es: item => item.es, en: item => item.en }
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

// Combines each usage category with its vocabulary to produce ~24 sentences
// per verb/tense/pronoun cell (4 categories x 6 items each).
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
          cat.items.forEach(item => {
            drills.push({
              sentence: `${SUBJECT_ES[pIdx]} ___ ${cat.es(item, isPlural)}.`,
              answer: verbForm,
              options: buildOptions(topic, pIdx, verbForm),
              translation: `${SUBJECT_EN[pIdx]} ${beEn} ${cat.en(item, isPlural)}.`,
              explanation: `${cat.explanation} → ${verb.label.toLowerCase()}, ${verb.tenses[tenseKey].label.toLowerCase()}.`,
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
