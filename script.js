const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearButton = document.querySelector("#clear");
const equalsButton = document.querySelector("#equals");
const deleteButton = document.querySelector("#delete");
const display = document.querySelector("#display");

const DIVIDE_BY_ZERO_ERROR = "Nice try! Can't divide by zero.";
let firstOperand = "";
let secondOperand = "";
let currentOperator = "";
let waitingForSecondOperand = false;
let justEvaluated = false;
let currentUserInput = "";

// Handle number clicks
numberButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (justEvaluated) {
      firstOperand = "";
      secondOperand = "";
      currentOperator = "";
      display.textContent = "";
      justEvaluated = false;
    }
    if (waitingForSecondOperand) {
      display.textContent = "";
      waitingForSecondOperand = false;
    }
    if (!currentOperator) {
      firstOperand += button.textContent;
      display.textContent = firstOperand;
    } else {
      secondOperand += button.textContent;
      display.textContent = secondOperand;
    }
  });
});

// Handle operator click
operatorButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!firstOperand && !justEvaluated) return;
    let op = button.textContent;

    if (currentOperator && secondOperand) {
      let result = operate(currentOperator, firstOperand, secondOperand);
      result = roundResult(result);
      
      const isError = result === DIVIDE_BY_ZERO_ERROR;
      firstOperand = isError ? "" : result.toString();
      display.textContent = result;
      secondOperand = "";
      justEvaluated = result === DIVIDE_BY_ZERO_ERROR;
      if (justEvaluated) {
        currentOperator = "";
        return;
      }
    }
    
    currentOperator = op;
    waitingForSecondOperand = true;
    justEvaluated = false;
  });
});

// Handle equals click
equalsButton.addEventListener("click", () => {
  if (!firstOperand || !currentOperator || !secondOperand) return;

  let result = operate(currentOperator, firstOperand, secondOperand);
  result = roundResult(result);
  display.textContent = result;
  firstOperand = result === DIVIDE_BY_ZERO_ERROR ? "" : result.toString();
  secondOperand = "";
  currentOperator = "";
  justEvaluated = true;
});

// Handle clear click
clearButton.addEventListener("click", () => {
  display.textContent = "";
  firstOperand = "";
  secondOperand = "";
  currentOperator = "";
  justEvaluated = false;
  waitingForSecondOperand = false;
});

// Handle delete click
deleteButton.addEventListener("click", () => {

  if (!currentOperator) {
    firstOperand = firstOperand.slice(0, -1);
    display.textContent = firstOperand || "0";
  } else if (!waitingForSecondOperand) {
    secondOperand = secondOperand.slice(0, -1);
    display.textContent = secondOperand || "0";
  }
});

// Functions

function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) { return (b === 0) ? DIVIDE_BY_ZERO_ERROR : a / b; }


function operate(operator, num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);

  if (operator === "+") return add(num1, num2);
  if (operator === "−") return subtract(num1, num2);
  if (operator === "×") return multiply(num1, num2);
  if (operator === "÷") return divide(num1, num2);
}

function roundResult(number) {
  if (typeof number === "string") return number; 
  return Math.round(number * 1e6) / 1e6;
}