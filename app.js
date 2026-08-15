let currentTopic = TOPICS[0];
let queue = [];
let masteredCount = 0;
let currentDrill = null;
let answered = false;

const topicSelect = document.getElementById("topic-select");
const chartContent = document.getElementById("chart-content");
const promptText = document.getElementById("prompt-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const statMastered = document.getElementById("stat-mastered");
const statQueue = document.getElementById("stat-queue");

function init() {
  TOPICS.forEach((t, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.title;
    topicSelect.appendChild(opt);
  });

  topicSelect.addEventListener("change", () => {
    currentTopic = TOPICS[topicSelect.value];
    renderChart();
    startPractice();
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
      document.getElementById(btn.dataset.view + "-view").classList.add("active");
    });
  });

  renderChart();
  startPractice();
}

function renderChart() {
  chartContent.innerHTML = "";
  currentTopic.charts.forEach(chart => {
    const block = document.createElement("div");
    block.className = "chart-block";

    const h2 = document.createElement("h2");
    h2.textContent = chart.verb;
    block.appendChild(h2);

    const ul = document.createElement("ul");
    ul.className = "usage-list";
    chart.usage.forEach(u => {
      const li = document.createElement("li");
      li.textContent = u;
      ul.appendChild(li);
    });
    block.appendChild(ul);

    Object.entries(chart.tenses).forEach(([tenseName, tenseData]) => {
      const h3 = document.createElement("p");
      h3.className = "usage";
      h3.style.fontWeight = "600";
      h3.style.color = "var(--ink)";
      h3.textContent = tenseName;
      block.appendChild(h3);

      const table = document.createElement("table");
      table.className = "conj";
      tenseData.rows.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td class="pronoun">${row.pronoun}</td><td class="form">${row.form}</td>`;
        table.appendChild(tr);
      });
      block.appendChild(table);
    });

    chartContent.appendChild(block);
  });
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
