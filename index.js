const questionEl = document.getElementById("question");
const questionFormEl = document.getElementById("questionForm");
const scoreEl = document.getElementById("score");
const answerInputEl = document.getElementById("answerInput");
const micBtn = document.getElementById("micQuestion");

let storedAnswer;
let score = parseInt(localStorage.getItem("score")) || 0;

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateQuestion = () => {
  let num1 = randomNumber(1, 10);
  let num2 = randomNumber(1, 10);
  const types = ["*", "+", "-", "/"];
  let type = types[randomNumber(0, 3)];
  
  if (type === "-" || type === "/") {
    if (num1 < num2) [num1, num2] = [num2, num1];
  }
  
  storedAnswer = eval(`${num1} ${type} ${num2}`);
  questionEl.innerText = `Q. What is ${num1} ${type} ${num2} ?`;
  scoreEl.innerText = score;
};

generateQuestion();

questionFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const userAnswer = +event.target.answer.value;
  
  if (userAnswer === storedAnswer) {
    score++;
    Toastify({ text: `Correct!`, style: { background: "green" } }).showToast();
  } else {
    score--;
    Toastify({ text: `Wrong! True Answer is : ${storedAnswer}` , style: { background: "red" } }).showToast();
  }
  
  localStorage.setItem("score", score);
  event.target.reset();
  generateQuestion();
});

document.getElementById("resetScore").addEventListener("click", () => {
  score = 0;
  localStorage.setItem("score", score);
  scoreEl.innerText = score;
  Toastify({ text: "Score reset to 0", style: { background: "blue" } }).showToast();
});

document.getElementById("speakQuestion").addEventListener("click", () => {
  let speech = new SpeechSynthesisUtterance(questionEl.innerText);
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;
  speechSynthesis.speak(speech);
});

// Chuyển đổi giọng nói thành văn bản (Speech-to-Text)
micBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    answerInputEl.value = transcript.replace(/[^0-9]/g, ""); // Chỉ lấy số
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    Toastify({ text: "Speech recognition error!", style: { background: "orange" } }).showToast();
  };
});
