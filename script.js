const GRID_SIZE = 10;
const TOTAL_ROUNDS = 10;
const MAX_HINTS = 3;

const gridElement = document.querySelector(".grid");
const scoreElement = document.querySelector("#score");
const roundElement = document.querySelector("#round");
const targetCoordinateElement = document.querySelector("#target-coordinate");
const attemptsElement = document.querySelector("#attempts");
const feedbackElement = document.querySelector(".feedback");
const hintButton = document.querySelector("#hint-button");
const resetButton = document.querySelector("#reset-button");

const state = {
  score: 0,
  round: 1,
  attempts: 0,
  hintsUsed: 0,
  target: { x: 1, y: 1 },
  locked: false,
};

const coordinates = [];

function createGrid() {
  gridElement.innerHTML = "";
  coordinates.length = 0;

  for (let y = GRID_SIZE; y >= 1; y -= 1) {
    for (let x = 1; x <= GRID_SIZE; x += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.setAttribute("data-x", String(x));
      button.setAttribute("data-y", String(y));
      button.setAttribute("aria-label", `Coordenada (${x}, ${y})`);

      const label = document.createElement("span");
      label.textContent = `${x},${y}`;
      button.appendChild(label);

      button.addEventListener("click", () => handleCellClick(x, y, button));

      gridElement.appendChild(button);
      coordinates.push({ x, y, element: button });
    }
  }
}

function pickRandomCoordinate() {
  const available = coordinates.filter(
    ({ x, y }) => !(x === state.target.x && y === state.target.y)
  );
  const randomIndex = Math.floor(Math.random() * available.length);
  const { x, y } = available[randomIndex];
  state.target = { x, y };
}

function updateUI() {
  scoreElement.textContent = String(state.score);
  roundElement.textContent = `${state.round} / ${TOTAL_ROUNDS}`;
  targetCoordinateElement.textContent = `(${state.target.x}, ${state.target.y})`;
  attemptsElement.textContent = String(state.attempts);
  hintButton.disabled = state.hintsUsed >= MAX_HINTS || state.locked;
  resetButton.disabled = false;
}

function setFeedback(message, type = "neutral") {
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback feedback--${type}`;
}

function clearHighlights() {
  coordinates.forEach(({ element }) => {
    element.classList.remove("cell--correct", "cell--incorrect", "cell--target");
  });
}

function handleCellClick(x, y, button) {
  if (state.locked) {
    return;
  }

  state.attempts += 1;
  attemptsElement.textContent = String(state.attempts);

  const isCorrect = x === state.target.x && y === state.target.y;

  clearHighlights();
  button.classList.add(isCorrect ? "cell--correct" : "cell--incorrect");

  if (isCorrect) {
    const starsEarned = state.attempts === 1 ? 1 : state.attempts === 2 ? 0.5 : 0;
    state.score += starsEarned;
    scoreElement.textContent = state.score.toString();

    if (starsEarned === 1) {
      setFeedback("Perfeito! Você ganhou 1 estrela!", "success");
    } else if (starsEarned === 0.5) {
      setFeedback("Boa! Você ganhou meia estrela.", "success");
    } else {
      setFeedback("Acertou! Continue treinando para ganhar mais estrelas.", "success");
    }

    if (state.round >= TOTAL_ROUNDS) {
      finishGame();
    } else {
      state.round += 1;
      state.attempts = 0;
      state.locked = true;
      setTimeout(() => {
        state.locked = false;
        startRound();
      }, 1000);
    }
  } else {
    setFeedback("Ops! Observe os eixos e tente novamente.", "error");
  }
}

function finishGame() {
  state.locked = true;
  hintButton.disabled = true;
  setFeedback(
    `Fim do jogo! Você conquistou ${state.score} estrelas. Clique em "Jogar de novo" para continuar treinando.`,
    "success"
  );
}

function startRound() {
  clearHighlights();
  pickRandomCoordinate();
  updateUI();
  setFeedback("Clique na casa que combina com a coordenada mostrada acima.");
}

function giveHint() {
  if (state.hintsUsed >= MAX_HINTS || state.locked) {
    return;
  }

  state.hintsUsed += 1;
  hintButton.disabled = state.hintsUsed >= MAX_HINTS;

  clearHighlights();

  coordinates
    .filter(({ x }) => x === state.target.x)
    .forEach(({ element }) => element.classList.add("cell--target"));

  setFeedback(
    `Dica: a coluna correta é a do número X = ${state.target.x}.`,
    "info"
  );
}

function resetGame() {
  state.score = 0;
  state.round = 1;
  state.attempts = 0;
  state.hintsUsed = 0;
  state.locked = false;

  clearHighlights();
  startRound();
}

hintButton.addEventListener("click", giveHint);
resetButton.addEventListener("click", resetGame);

createGrid();
resetGame();

