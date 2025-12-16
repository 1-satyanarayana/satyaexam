let allQuestions = [];
let currentQuestion = 0;
let answers = {};
let time = 90 * 60;

async function loadQuestions() {
  const files = [
    { file: "questions-math.json", count: 25 },
    { file: "questions-reasoning.json", count: 30 },
    { file: "questions-science.json", count: 25 },
    { file: "questions-gk.json", count: 20 },
  ];

  for (let f of files) {
    const res = await fetch(f.file);
    let data = await res.json();
    data = shuffle(data).slice(0, f.count);
    allQuestions = allQuestions.concat(data);
  }

  showQuestion();
  createQuestionNumbers();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const q = allQuestions[currentQuestion];
  document.getElementById("question-text").innerText =
    currentQuestion + 1 + ". " + q.question;

  const optDiv = document.getElementById("options");
  optDiv.innerHTML = "";

  q.options.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "option";
    label.innerHTML = `
      <input type="radio" name="opt"
      ${answers[currentQuestion] === opt ? "checked" : ""}
      onclick="answers[${currentQuestion}]='${opt}'">
      ${opt}`;
    optDiv.appendChild(label);
  });
}

function nextQuestion() {
  if (currentQuestion < allQuestions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

function createQuestionNumbers() {
  const div = document.getElementById("question-numbers");
  allQuestions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.onclick = () => {
      currentQuestion = i;
      showQuestion();
    };
    div.appendChild(btn);
  });
}

function submitExam() {
  let score = 0;
  let output = "<h2>Result</h2>";

  allQuestions.forEach((q, i) => {
    const user = answers[i];
    if (user === q.answer) score++;

    output += `<p>
      Q${i + 1}: ${q.question}<br>
      Your Answer: <span class="${user === q.answer ? "correct" : "wrong"}">${
      user || "Not Answered"
    }</span><br>
      Correct Answer: <b>${q.answer}</b>
    </p>`;
  });

  output += `<h3>Total Score: ${score} / 100</h3>`;
  document.body.innerHTML = output;
}

setInterval(() => {
  if (time <= 0) submitExam();
  time--;
  let m = Math.floor(time / 60);
  let s = time % 60;
  document.getElementById("timer").innerText = `Time Left: ${m}:${
    s < 10 ? "0" + s : s
  }`;
}, 1000);

loadQuestions();
