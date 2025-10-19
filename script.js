// Global variables
let currentInput = document.getElementById('current-input');
let calculationString = '';
let waitingForNewInput = false;

function prepareCalculationString(str) {
  let safeStr = str.replace(/×/g, '*').replace(/÷/g, '/');
  if (safeStr.endsWith('%')) {
    safeStr = '(' + safeStr.slice(0, -1) + ') / 100';
  }
  return safeStr;
}

function appendInput(value) {
  if (value === '±') {
    toggleSign();
    return;
  }
  if (value === '%') {
    applyPercentage();
    return;
  }

  if (waitingForNewInput) {
    if (!['+', '-', '×', '÷'].includes(value)) {
      calculationString = '';
    }
    waitingForNewInput = false;
  }

  const lastChar = calculationString.slice(-1);
  const isOperator = ['+', '-', '×', '÷'].includes(value);
  const lastCharIsOperator = ['+', '-', '×', '÷'].includes(lastChar);

  if (isOperator && lastCharIsOperator) {
    if (value === '-' && (lastChar === '×' || lastChar === '÷')) {
    } else if (value === '-' && lastChar === '-') {
    } else {
      calculationString = calculationString.slice(0, -1) + value;
    }
  } else if (value === '.') {
    const operatorIndex = calculationString.search(/[\+\-×÷](?!.*[\+\-×÷])/);
    const currentNumberSegment =
      operatorIndex === -1
        ? calculationString
        : calculationString.substring(operatorIndex + 1);

    if (currentNumberSegment.includes('.')) return;

    if (calculationString === '' || lastCharIsOperator) {
      calculationString += '0.';
    } else {
      calculationString += value;
    }
  } else if (isOperator && calculationString === '') {
    if (value === '-') calculationString += value;
    return;
  } else {
    calculationString += value;
  }

  currentInput.textContent = calculationString || '0';
}

function toggleSign() {
  if (calculationString === '' || waitingForNewInput) return;

  const regex = /(-?\d+\.?\d*)$/;
  const match = calculationString.match(regex);

  if (match) {
    const numberStr = match[0];
    const start = match.index;
    calculationString =
      calculationString.substring(0, start) + parseFloat(numberStr) * -1;
  }

  currentInput.textContent = calculationString || '0';
}

function applyPercentage() {
  if (calculationString === '' || waitingForNewInput) return;

  const regex = /(-?\d+\.?\d*)$/;
  const match = calculationString.match(regex);

  if (match) {
    const numberStr = match[0];
    const start = match.index;
    const percentValue = parseFloat(numberStr) / 100;
    calculationString = calculationString.substring(0, start) + percentValue;
  }

  currentInput.textContent = calculationString || '0';
}

function calculate() {
  if (calculationString === '' || waitingForNewInput) return;

  const expressionToEvaluate = prepareCalculationString(calculationString);
  try {
    const result = new Function('return ' + expressionToEvaluate)();
    if (isFinite(result)) {
      const finalResult = parseFloat(result.toFixed(10));
      currentInput.textContent = finalResult;
      calculationString = String(finalResult);
    } else {
      currentInput.textContent = 'Error';
      calculationString = '';
    }
  } catch {
    currentInput.textContent = 'Error';
    calculationString = '';
  }
  waitingForNewInput = true;
}

function clearDisplay() {
  calculationString = '';
  currentInput.textContent = '0';
  waitingForNewInput = false;
}

function deleteLast() {
  if (waitingForNewInput) {
    clearDisplay();
    return;
  }

  calculationString = calculationString.slice(0, -1);
  currentInput.textContent = calculationString || '0';
}

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/[0-9]/.test(key)) {
    event.preventDefault();
    appendInput(key);
  } else if (key === '.') {
    event.preventDefault();
    appendInput('.');
  } else if (key === '+') {
    event.preventDefault();
    appendInput('+');
  } else if (key === '-') {
    event.preventDefault();
    appendInput('-');
  } else if (key === '*' || key.toLowerCase() === 'x') {
    event.preventDefault();
    appendInput('×');
  } else if (key === '/') {
    event.preventDefault();
    appendInput('÷');
  } else if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
  } else if (key === 'Backspace') {
    event.preventDefault();
    deleteLast();
  } else if (key.toLowerCase() === 'c' || key.toLowerCase() === 'a') {
    event.preventDefault();
    clearDisplay();
  }
});

window.onload = () => {
  currentInput.textContent = calculationString || '0';
};
