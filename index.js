const questionEl = document.getElementById("question");
const questionFormEl = document.getElementById("questionForm");
const scoreEl = document.getElementById("score");
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
