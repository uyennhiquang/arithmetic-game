"use strict";

// TODO:
// Timer buttons
// New highscore note
// Clarification that enter = submitting answer

// Buton elements
const buttonStart = document.querySelector(".start");
const buttonResetHighscore = document.querySelector(".reset-highscore");
const buttonHowTo = document.querySelector(".how-to");

// Question elements
const questionEl = document.querySelector(".question");
const operandOneEl = document.querySelector(".operand--0");
const operandTwoEl = document.querySelector(".operand--1");
const operatorEl = document.querySelector(".operator");
const operatorArr = ["+", "-", "*", "÷"];

// Answer input elements
const answerInputEl = document.querySelector(".answer-input");
const answerForm = document.querySelector(".answer-form");

// Score elements
const scoreCurrentEl = document.querySelector(".current-score");
let scoreCurrent = 0;
const highscoreEl = document.querySelector(".highscore");
let highscore = 0;

// Misc variables
let operatorCurrent, playing;

// Timer elements/variables
const startingMinutes = 10 / 60;
let time = startingMinutes * 60;

const timerEl = document.querySelector(".timer");

// Toggle how-to modal elements
const modalEl = document.querySelector(".modal");
const modalCloseEl = document.querySelector(".close-modal");
const modalOverlayEl = document.querySelector(".overlay");

// Show localStorage highscore only when it's higher than 0
if (localStorage.getItem("highscoreValue") > 0) {
  highscoreEl.textContent = localStorage.getItem("highscoreValue");
  highscore = Number(localStorage.getItem("highscoreValue"));
} else highscoreEl.textContent = 0;

// Start game
buttonStart.addEventListener("click", function () {
  if (!playing) {
    playing = true;

    // Autofocus onclick
    answerInputEl.focus();

    // Clear input field
    answerInputEl.value = "";

    // Set starting time
    time = startingMinutes * 60;
    timerEl.textContent = "0:10";
    let timerInterval = setInterval(updateTimer, 1000);

    // Remove styling
    document.querySelector("#blurb").classList.add("hidden");
    questionEl.classList.remove("hidden");
    document.querySelector(".time-up").classList.add("hidden");
    document.querySelector("body").style.removeProperty("background");
    questionEl.style.removeProperty("color");
    answerInputEl.style.removeProperty("color");

    // Reset score
    scoreCurrent = 0;
    scoreCurrentEl.textContent = scoreCurrent;

    // Start timer
    timerInterval;
    function updateTimer() {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;

      seconds = seconds < 10 ? "0" + seconds : seconds;
      timerEl.innerHTML = `${minutes}:${seconds}`;
      if (time > 0) time--;
      // When timeup
      else if (time === 0) {
        playing = false;

        // Reset timer
        clearInterval(timerInterval);

        // Show timeup styling
        document.querySelector(".time-up").classList.remove("hidden");
        document.querySelector("body").style.background = "#60b347";

        // Set highscore
        if (scoreCurrent > highscore) {
          // highscore = scoreCurrent;
          highscore = scoreCurrent;
          localStorage.setItem("highscoreValue", highscore);
          highscoreEl.textContent = localStorage.getItem("highscoreValue");
        }
      }
    }

    // Generate random operator
    operatorCurrent =
      operatorArr[Math.trunc(Math.random() * operatorArr.length)];
    operatorEl.textContent = operatorCurrent;

    // Generate random operands
    // Allow non-decimal questions
    if (operatorCurrent === "÷") {
      operandTwoEl.textContent = Math.trunc(Math.random() * 10) + 1;
      operandOneEl.textContent =
        operandTwoEl.textContent * (Math.trunc(Math.random() * 10) + 1);
    } else {
      operandOneEl.textContent = Math.trunc(Math.random() * 10) + 1;
      operandTwoEl.textContent = Math.trunc(Math.random() * 10) + 1;
    }
  }
});

// Check for answer
answerForm.addEventListener("submit", (e) => {
  if (playing) {
    let answerInput = Number(answerInputEl.value);
    let answerActual = null;
    // Generate answer based on operator (Forgive me God)
    if (operatorCurrent === "+") {
      answerActual =
        Number(operandOneEl.textContent) + Number(operandTwoEl.textContent);
    } else if (operatorCurrent === "-") {
      answerActual =
        Number(operandOneEl.textContent) - Number(operandTwoEl.textContent);
    } else if (operatorCurrent === "*") {
      answerActual =
        Number(operandOneEl.textContent) * Number(operandTwoEl.textContent);
    } else if (operatorCurrent === "÷") {
      answerActual =
        Number(operandOneEl.textContent) / Number(operandTwoEl.textContent);
    }

    // If Correct answer
    if (answerInput === answerActual) {
      // Increase score by 1
      scoreCurrent++;
      scoreCurrentEl.textContent = scoreCurrent;

      // Generate random operator
      operatorCurrent =
        operatorArr[Math.trunc(Math.random() * operatorArr.length)];
      operatorEl.textContent = operatorCurrent;

      // Generate random operands
      // Allow non-decimal questions
      if (operatorCurrent === "÷") {
        operandTwoEl.textContent = Math.trunc(Math.random() * 10) + 1;
        operandOneEl.textContent =
          operandTwoEl.textContent * (Math.trunc(Math.random() * 10) + 1);
      } else {
        operandOneEl.textContent = Math.trunc(Math.random() * 10) + 1;
        operandTwoEl.textContent = Math.trunc(Math.random() * 10) + 1;
      }

      // Clear input field
      answerInputEl.value = "";

      // Remove wrong styling if previously incorrect
      questionEl.style.removeProperty("color");
      answerInputEl.style.removeProperty("color");
    }

    // If Wrong answer
    else {
      // Make text red
      questionEl.style.color = "#FA0415";
      answerInputEl.style.color = "#FA0415";

      // Subtract points
      if (scoreCurrent > 0) {
        scoreCurrent--;
        scoreCurrentEl.textContent = scoreCurrent;
      }
    }
  }
  e.preventDefault();
});

// Clear highscore
buttonResetHighscore.addEventListener("click", function () {
  highscore = 0;
  localStorage.removeItem("highscoreValue");
  highscoreEl.textContent = 0;
});

// Show How-to modal
buttonHowTo.addEventListener("click", function () {
  modalEl.classList.remove("hidden");
  modalOverlayEl.classList.remove("hidden");
});

// Close modal
const closeModal = function () {
  modalEl.classList.add("hidden");
  modalOverlayEl.classList.add("hidden");
};

modalCloseEl.addEventListener("click", closeModal);
modalOverlayEl.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modalEl.classList.contains("hidden")) {
    closeModal();
  }
});

//paste this code under the head tag or in a separate js file.
// Wait for window load
$(window).load(function () {
  // Animate loader off screen
  $(".se-pre-con").fadeOut("slow");
});
