let currentTopic = TOPICS[0];
let queue = [];
let masteredCount = 0;
let currentDrill = null;
let answered = false;
let exampleMode = "all"; // "all" | "select"
let selectedCells = new Set(); // keys like "estar|preterite|2"

const topicSelect = document.getElementById("topic-select");
const chartContent = document.getElementById("chart-content");
const examplesChartContent = document.getElementById("examples-chart-content");
const examplesList = document.getElementById("examples-list");
const selectHint = document.getElementById("select-hint");
const promptText = document.getElementById("prompt-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const statMastered = document.getElementById("stat-mastered");
const statQueue = document.getElementById("stat-queue");

function cellKey(verb, tense, pronoun) {
  return `${verb}|${tense}|${pronoun}`;
}

function init() {
  TOPICS.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.title;
    topicSelect.appendChild(opt);
  });

  topicSelect.addEventListener("change", () => {
    currentTopic = TOPICS[topicSelect.value];
    selectedCells = new Set();
    renderAll();
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
      document.getElementById(btn.dataset.view + "-view").classList.add("active");
    });
  });

  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      exampleMode = btn.dataset.mode;
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyExampleModeUI();
      renderExampleList();
    });
  });

  renderAll();
}

function renderAll() {
  renderChartView();
  renderExamplesView();
  startPractice();
}

// Builds one comparison table: rows = pronouns, columns grouped by tense,
// each tense split into Ser / Estar so the two verbs sit side by side.
function buildCombinedTable(topic) {
  const table = document.createElement("table");
  table.className = "conj-combined";

  const thead = document.createElement("thead");
  const tenseHeaderRow = document.createElement("tr");
  tenseHeaderRow.innerHTML = `<th class="corner" rowspan="2">Pronoun</th>`;
  topic.tenseOrder.forEach(tenseKey => {
    const label = topic.verbs[0].tenses[tenseKey].label;
    const meta = topic.tenseMeta && topic.tenseMeta[tenseKey];
    const th = document.createElement("th");
    th.colSpan = topic.verbs.length;
    th.className = "tense-head";
    th.innerHTML = meta
      ? `${label}<span class="tense-hint"><span class="tense-icon">${meta.icon}</span>${meta.hint}</span>`
      : label;
    tenseHeaderRow.appendChild(th);
  });
  thead.appendChild(tenseHeaderRow);

  const verbHeaderRow = document.createElement("tr");
  topic.tenseOrder.forEach(() => {
    topic.verbs.forEach(verb => {
      const th = document.createElement("th");
      th.className = "verb-head";
      th.textContent = verb.label;
      verbHeaderRow.appendChild(th);
    });
  });
  thead.appendChild(verbHeaderRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  topic.pronouns.forEach((pronoun, pIdx) => {
    const tr = document.createElement("tr");
    const pronounTd = document.createElement("td");
    pronounTd.className = "pronoun";
    pronounTd.textContent = pronoun;
    tr.appendChild(pronounTd);

    topic.tenseOrder.forEach(tenseKey => {
      topic.verbs.forEach(verb => {
        const td = document.createElement("td");
        td.className = "form";
        td.textContent = verb.tenses[tenseKey].forms[pIdx];
        td.dataset.verb = verb.key;
        td.dataset.tense = tenseKey;
        td.dataset.pronoun = pIdx;
        tr.appendChild(td);
      });
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

function renderChartView() {
  chartContent.innerHTML = "";

  const tableBlock = document.createElement("div");
  tableBlock.className = "chart-block";
  const h2 = document.createElement("h2");
  h2.textContent = "Compare all forms at a glance";
  tableBlock.appendChild(h2);
  const tableWrap = document.createElement("div");
  tableWrap.className = "table-scroll";
  tableWrap.appendChild(buildCombinedTable(currentTopic));
  tableBlock.appendChild(tableWrap);
  chartContent.appendChild(tableBlock);

  const usageBlock = document.createElement("div");
  usageBlock.className = "usage-columns";
  currentTopic.verbs.forEach(verb => {
    const col = document.createElement("div");
    col.className = "chart-block usage-col";
    const vh = document.createElement("h2");
    vh.textContent = `When to use ${verb.label}`;
    col.appendChild(vh);
    const ul = document.createElement("ul");
    ul.className = "usage-list";
    verb.usage.forEach(u => {
      const li = document.createElement("li");
      li.textContent = u;
      ul.appendChild(li);
    });
    col.appendChild(ul);
    usageBlock.appendChild(col);
  });
  chartContent.appendChild(usageBlock);
}

function renderExamplesView() {
  examplesChartContent.innerHTML = "";
  examplesChartContent.appendChild(buildCombinedTable(currentTopic));
  applyExampleModeUI();
  renderExampleList();
}

// Wires up (or tears down) click-to-select on chart cells depending on
// exampleMode, and paints the depressed/shaded look for already-selected cells.
function applyExampleModeUI() {
  const isSelect = exampleMode === "select";
  selectHint.style.display = isSelect ? "block" : "none";

  examplesChartContent.querySelectorAll("td.form").forEach(td => {
    td.classList.toggle("selectable", isSelect);
    const key = cellKey(td.dataset.verb, td.dataset.tense, td.dataset.pronoun);
    td.classList.toggle("selected-cell", isSelect && selectedCells.has(key));
    td.onclick = isSelect ? () => toggleCellSelection(td) : null;
  });
}

function toggleCellSelection(td) {
  const key = cellKey(td.dataset.verb, td.dataset.tense, td.dataset.pronoun);
  if (selectedCells.has(key)) {
    selectedCells.delete(key);
    td.classList.remove("selected-cell");
  } else {
    selectedCells.add(key);
    td.classList.add("selected-cell");
  }
  renderExampleList();
}

function renderExampleList() {
  examplesList.innerHTML = "";

  let drills = currentTopic.drills;
  if (exampleMode === "select") {
    drills = drills.filter(d => selectedCells.has(cellKey(d.verb, d.tense, d.pronounIndex)));
  }

  if (exampleMode === "select" && drills.length === 0) {
    const msg = document.createElement("p");
    msg.className = "select-empty";
    msg.textContent = selectedCells.size === 0
      ? "Tap forms in the chart above to build your practice list."
      : "No example sentences yet for the selected forms — try selecting others.";
    examplesList.appendChild(msg);
    return;
  }

  drills.forEach(drill => {
    const card = document.createElement("div");
    card.className = "example-card";
    card.dataset.verb = drill.verb;
    card.dataset.tense = drill.tense;
    card.dataset.pronoun = drill.pronounIndex;

    const filled = drill.sentence.replace("___", `<strong class="filled">${drill.answer}</strong>`);
    card.innerHTML = `
      <p class="example-sentence">${filled}</p>
      <p class="example-translation">${drill.translation}</p>
      <p class="example-explanation">${drill.explanation}</p>
    `;
    card.addEventListener("click", () => {
      const { verb, tense, pronoun } = card.dataset;
      highlightChartCell(verb, tense, pronoun);
      examplesList.querySelectorAll(".example-card").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
    examplesList.appendChild(card);
  });

  const firstCard = examplesList.querySelector(".example-card");
  if (firstCard) firstCard.click();
}

function highlightChartCell(verb, tense, pronoun) {
  examplesChartContent.querySelectorAll("td.form").forEach(td => td.classList.remove("highlight-cell"));
  const cell = examplesChartContent.querySelector(
    `td[data-verb="${verb}"][data-tense="${tense}"][data-pronoun="${pronoun}"]`
  );
  if (cell) cell.classList.add("highlight-cell");
}

function startPractice() {
  queue = shuffle([...currentTopic.drills]);
  masteredCount = 0;
  updateStats();
  nextDrill();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function updateStats() {
  statMastered.textContent = `Mastered: ${masteredCount}`;
  statQueue.textContent = `Left this round: ${queue.length}`;
}

function nextDrill() {
  answered = false;
  feedbackEl.innerHTML = "";

  if (queue.length === 0) {
    promptText.textContent = "";
    choicesEl.innerHTML = `<p class="done-msg">🎉 Round complete! Every sentence answered correctly.</p>`;
    const restartBtn = document.createElement("button");
    restartBtn.className = "next-btn";
    restartBtn.textContent = "Practice again";
    restartBtn.addEventListener("click", startPractice);
    choicesEl.appendChild(restartBtn);
    return;
  }

  currentDrill = queue.shift();
  updateStats();

  promptText.innerHTML = currentDrill.sentence.replace("___", '<span class="blank">___</span>');

  choicesEl.innerHTML = "";
  const opts = shuffle([...currentDrill.options]);
  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(opt, btn));
    choicesEl.appendChild(btn);
  });
}

function handleAnswer(choice, btn) {
  if (answered) return;
  answered = true;

  const correct = choice === currentDrill.answer;
  const allButtons = choicesEl.querySelectorAll(".choice-btn");
  allButtons.forEach(b => {
    b.disabled = true;
    if (b.textContent === currentDrill.answer) b.classList.add("correct");
    else if (b === btn) b.classList.add("incorrect");
  });

  if (correct) {
    masteredCount++;
  } else {
    // requeue a few slots later so it comes back around for repetition
    const reinsertAt = Math.min(queue.length, 3);
    queue.splice(reinsertAt, 0, currentDrill);
  }
  updateStats();

  feedbackEl.innerHTML = `
    <p class="translation">"${currentDrill.sentence.replace("___", currentDrill.answer)}" — ${currentDrill.translation}</p>
    <p class="explanation">${currentDrill.explanation}</p>
  `;
  const nextBtn = document.createElement("button");
  nextBtn.className = "next-btn";
  nextBtn.textContent = "Next →";
  nextBtn.addEventListener("click", nextDrill);
  feedbackEl.appendChild(nextBtn);
}

init();
