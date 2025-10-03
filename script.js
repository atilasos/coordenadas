import { adventures } from "./adventure_data.js";

const GRID_SIZE = 10;
const TOTAL_MISSIONS = 8;
const MAX_HINTS = 3;
const FULL_ENERGY = 3;
const STREAK_TARGET = 3;

const gridElement = document.querySelector(".grid");
const scoreElement = document.querySelector("#score");
const roundElement = document.querySelector("#round");
const targetCoordinateElement = document.querySelector("#target-coordinate");
const energyLabelElement = document.querySelector("#energy-label");
const energyBarElement = document.querySelector("#energy-bar");
const axisLabelsY = document.querySelector(".axis-labels--y");
const axisLabelsX = document.querySelector(".axis-labels--x");
const feedbackElement = document.querySelector(".feedback");
const hintButton = document.querySelector("#hint-button");
const resetButton = document.querySelector("#reset-button");
const skillButton = document.querySelector("#skill-button");
const adventureButton = document.querySelector("#adventure-button");
const skillModal = document.querySelector("#skill-modal");
const skillModalTitle = document.querySelector("#skill-modal-title");
const skillModalBody = document.querySelector("#skill-modal-body");
const skillItems = document.querySelectorAll(".skill");
const adventureTitleElement = document.querySelector("#adventure-title");
const adventureTextElement = document.querySelector("#adventure-text");
const adventureChoicesElement = document.querySelector("#adventure-choices");
const adventureStatusElement = document.querySelector("#adventure-status");

const state = {
  score: 0,
  mission: 1,
  energy: FULL_ENERGY,
  hintsUsed: 0,
  target: { x: 1, y: 1 },
  locked: false,
  streak: 0,
  activeSkill: null,
  adventure: null,
  storyNode: null,
  storyNodeId: null,
  adventureStarted: false,
  adventureIntroShown: false,
  adventureCompleted: false,
  availableChoices: new Map(),
};

const coordinates = [];

function createGrid() {
  if (!gridElement) {
    return;
  }

  gridElement.innerHTML = "";
  if (axisLabelsY) {
    axisLabelsY.innerHTML = "";
  }
  if (axisLabelsX) {
    axisLabelsX.innerHTML = "";
  }
  coordinates.length = 0;

  for (let y = GRID_SIZE; y >= 1; y -= 1) {
    if (axisLabelsY) {
      const axisLabelY = document.createElement("span");
      axisLabelY.textContent = String(y);
      axisLabelY.className = "axis-label";
      axisLabelY.dataset.axis = "y";
      axisLabelY.dataset.value = String(y);
      axisLabelsY.appendChild(axisLabelY);
    }

    for (let x = 1; x <= GRID_SIZE; x += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cell";
      button.setAttribute("data-x", String(x));
      button.setAttribute("data-y", String(y));
      const baseLabel = `Coordenada (${x}, ${y})`;
      button.dataset.baseLabel = baseLabel;
      button.setAttribute("aria-label", baseLabel);

      const coordinateLabel = document.createElement("span");
      coordinateLabel.textContent = `${x},${y}`;
      coordinateLabel.className = "cell__coords";
      button.appendChild(coordinateLabel);

      button.addEventListener("click", () => handleCellClick(x, y, button));
      button.addEventListener("mouseenter", () => highlightAxes(x, y));
      button.addEventListener("focus", () => highlightAxes(x, y));
      button.addEventListener("mouseleave", clearAxisHighlight);
      button.addEventListener("blur", clearAxisHighlight);

      gridElement.appendChild(button);
      coordinates.push({ x, y, element: button });
    }
  }

  if (axisLabelsX) {
    for (let x = 1; x <= GRID_SIZE; x += 1) {
      const axisLabelX = document.createElement("span");
      axisLabelX.textContent = String(x);
      axisLabelX.className = "axis-label";
      axisLabelX.dataset.axis = "x";
      axisLabelX.dataset.value = String(x);
      axisLabelsX.appendChild(axisLabelX);
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
  roundElement.textContent = `${state.mission} / ${TOTAL_MISSIONS}`;
  if (state.storyNode) {
    targetCoordinateElement.textContent = "Escolhe uma coordenada da crónica";
    targetCoordinateElement.classList.add("target-coordinate--glow");
  } else {
    targetCoordinateElement.textContent = `(${state.target.x}, ${state.target.y})`;
    targetCoordinateElement.classList.remove("target-coordinate--glow");
  }
  energyLabelElement.textContent = `${state.energy} energia${state.energy === 1 ? "" : "s"}`;
  updateEnergyBar();
  const storyActive = Boolean(state.storyNode);
  hintButton.disabled = storyActive || state.hintsUsed >= MAX_HINTS || state.locked || state.energy === 0;
  resetButton.disabled = false;
  skillButton.disabled = storyActive || Boolean(state.activeSkill) || state.locked;
  if (adventureButton) {
    adventureButton.disabled = state.locked || state.adventureCompleted;
    adventureButton.textContent = state.storyNode ? "Aventura em curso" : "Iniciar crónica";
    adventureButton.classList.toggle("btn--story-active", Boolean(state.storyNode));
  }
  skillItems.forEach((item) => {
    item.classList.toggle("skill--active", item.dataset.skill === state.activeSkill);
  });
}

function setFeedback(message, type = "neutral") {
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback feedback--${type}`;
}

function updateEnergyBar() {
  const percentage = (state.energy / FULL_ENERGY) * 100;
  energyBarElement.style.width = `${percentage}%`;
}

function highlightAxes(x, y) {
  if (!axisLabelsX && !axisLabelsY) {
    return;
  }

  clearAxisHighlight();

  if (axisLabelsX) {
    const labelX = axisLabelsX.querySelector(`[data-value="${x}"]`);
    if (labelX) {
      labelX.classList.add("axis-label--active");
    }
  }

  if (axisLabelsY) {
    const labelY = axisLabelsY.querySelector(`[data-value="${y}"]`);
    if (labelY) {
      labelY.classList.add("axis-label--active");
    }
  }
}

function clearAxisHighlight() {
  if (axisLabelsX) {
    axisLabelsX
      .querySelectorAll(".axis-label--active")
      .forEach((label) => label.classList.remove("axis-label--active"));
  }
  if (axisLabelsY) {
    axisLabelsY
      .querySelectorAll(".axis-label--active")
      .forEach((label) => label.classList.remove("axis-label--active"));
  }
}

function clearHighlights() {
  coordinates.forEach(({ element }) => {
    element.classList.remove("cell--correct", "cell--incorrect", "cell--target", "cell--locked");
  });
  clearAxisHighlight();
}

function handleCellClick(x, y, button) {
  if (state.locked) {
    return;
  }

  if (state.storyNode) {
    handleAdventureChoice(x, y, button);
    return;
  }

  const isCorrect = x === state.target.x && y === state.target.y;

  if (!isCorrect) {
    consumeEnergy();
  }

  clearHighlights();
  highlightAxes(x, y);
  button.classList.add(isCorrect ? "cell--correct" : "cell--incorrect");

  if (isCorrect) {
    resolveMissionSuccess();
  } else {
    setFeedback("O feitiço falhou! Observa os eixos e tenta de novo.", "error");
    state.streak = 0;
    if (state.energy === 0) {
      resolveMissionFailure();
    }
  }
}

function finishGame() {
  state.locked = true;
  hintButton.disabled = true;
  skillButton.disabled = true;
  const rank = getRank();
  setFeedback(
    `Campanha concluída! Conquistaste ${state.score} estrelas-guia e recebeste o título "${rank}". Clica em "Nova campanha" para jogar outra vez.`,
    "success"
  );
}

function startRound() {
  clearHighlights();
  pickRandomCoordinate();
  state.energy = FULL_ENERGY;
  state.activeSkill = null;
  state.storyNode = null;
  state.storyNodeId = null;
  state.availableChoices.clear();
  updateUI();
  setFeedback("Observa a marcação-chave e escolhe a casa correta no mapa.");
}

function giveHint() {
  if (state.hintsUsed >= MAX_HINTS || state.locked || state.energy === 0) {
    return;
  }

  state.hintsUsed += 1;
  hintButton.disabled = state.hintsUsed >= MAX_HINTS;

  if (state.activeSkill !== "shield") {
    consumeEnergy({ triggerFailure: false });
  } else {
    setFeedback("Escudo de Quadrícula absorveu o custo da dica!", "info");
  }

  clearHighlights();

  coordinates
    .filter(({ x }) => x === state.target.x)
    .forEach(({ element }) => element.classList.add("cell--target"));

  setFeedback(
    `Dica invocada: a coluna correta é a do número X = ${state.target.x}.`,
    "info"
  );
}

function resetGame() {
  state.score = 0;
  state.mission = 1;
  state.energy = FULL_ENERGY;
  state.hintsUsed = 0;
  state.locked = false;
  state.streak = 0;
  state.activeSkill = null;
  state.adventureStarted = false;
  state.adventureIntroShown = false;
  state.adventureCompleted = false;
  state.storyNode = null;
  state.storyNodeId = null;
  state.availableChoices.clear();
  state.adventure = null;

  clearHighlights();
  startRound();
}

function consumeEnergy({ triggerFailure = true } = {}) {
  if (state.energy > 0) {
    state.energy -= 1;
    updateUI();
  }

  if (state.energy === 0 && triggerFailure) {
    resolveMissionFailure();
  }
}

function resolveMissionSuccess() {
  const starsEarned = computeStarsEarned();
  state.score = parseFloat((state.score + starsEarned).toFixed(1));
  state.streak += 1;
  updateUI();

  if (state.activeSkill === "spark") {
    setFeedback("Faísca de Precisão acertou em cheio! 2 estrelas-guia garantidas.", "success");
  } else if (state.activeSkill === "shield") {
    setFeedback("Escudo de Quadrícula manteve a energia. Estrela-guia assegurada!", "success");
  } else if (state.activeSkill === "bloom" && state.streak >= STREAK_TARGET) {
    triggerBloomAnimation();
    setFeedback("Flor Luminescente floresceu! Sequência perfeita!", "success");
  } else {
    narrateReward(starsEarned);
  }

  if (state.mission >= TOTAL_MISSIONS) {
    finishGame();
    return;
  }

  state.mission += 1;
  state.locked = true;
  setTimeout(() => {
    state.locked = false;
    startRound();
  }, 1100);
}

function resolveMissionFailure() {
  state.locked = true;
  setFeedback("Energia esgotada! Respira fundo e tenta outra missão.", "error");
  setTimeout(() => {
    if (state.mission >= TOTAL_MISSIONS) {
      finishGame();
      return;
    }
    state.mission += 1;
    state.locked = false;
    startRound();
  }, 1300);
}

function computeStarsEarned() {
  if (state.activeSkill === "spark") {
    return 2;
  }

  let stars = 0.5;

  if (state.energy === FULL_ENERGY) {
    stars = 1.5;
  } else if (state.energy === FULL_ENERGY - 1) {
    stars = 1;
  }

  if (state.activeSkill === "shield") {
    stars = Math.max(stars, 1);
  }

  if (state.activeSkill === "bloom" && state.streak >= STREAK_TARGET) {
    stars += 0.5;
  }

  return parseFloat(stars.toFixed(1));
}

function narrateReward(starsEarned) {
  if (starsEarned >= 1.5) {
    setFeedback("Precisão lendária! Ganhaste 1,5 estrelas-guia.", "success");
  } else if (starsEarned >= 1) {
    setFeedback("Boa mira! Mais 1 estrela-guia para a tua coleção.", "success");
  } else {
    setFeedback("Missão cumprida. Ganhaste meia estrela-guia.", "success");
  }
}

function activateSkill() {
  if (state.locked || state.activeSkill) {
    return;
  }

  const availableSkills = getAvailableSkills();
  if (availableSkills.length === 0) {
    setFeedback("As habilidades estão a recarregar. Continua a missão!", "info");
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableSkills.length);
  const skill = availableSkills[randomIndex];

  state.activeSkill = skill;
  updateUI();
  openSkillModal(skill);
  describeSkillActivation(skill);
}

function getAvailableSkills() {
  const skills = ["spark", "shield"];
  if (state.streak >= STREAK_TARGET - 1) {
    skills.push("bloom");
  }
  return skills;
}

function openSkillModal(skill) {
  if (!skillModal) {
    return;
  }

  const descriptions = {
    spark: {
      title: "Faísca de Precisão ativada!",
      body: "Se acertares nesta jogada, recebes 2 estrelas-guia.",
    },
    shield: {
      title: "Escudo de Quadrícula erguido!",
      body: "Usa uma dica nesta jogada sem perder energia e garante 1 estrela.",
    },
    bloom: {
      title: "Flor Luminescente a desabrochar!",
      body: "Acerta mais uma vez para libertar luzes mágicas e ganhar luz extra.",
    },
  };

  const { title, body } = descriptions[skill];
  skillModalTitle.textContent = title;
  skillModalBody.textContent = body;
  if (typeof skillModal.showModal === "function") {
    skillModal.showModal();
  }
}

function describeSkillActivation(skill) {
  const descriptions = {
    spark: "A tua mira fica perfeita nesta jogada.",
    shield: "A próxima dica não consome energia.",
    bloom: "Mantém a sequência e enche o mapa de luz!",
  };

  setFeedback(`Habilidade pronta: ${descriptions[skill]}`, "info");
}

function triggerBloomAnimation() {
  document.body.classList.add("bloom-active");
  setTimeout(() => {
    document.body.classList.remove("bloom-active");
  }, 1600);
}

function getRank() {
  if (state.score >= 12) {
    return "Grande Cartógrafo";
  }
  if (state.score >= 10) {
    return "Guardião das Estrelas";
  }
  if (state.score >= 8) {
    return "Explorador Mestre";
  }
  return "Aprendiz de Coordenadas";
}

hintButton.addEventListener("click", giveHint);
resetButton.addEventListener("click", resetGame);
skillButton.addEventListener("click", activateSkill);

if (skillModal) {
  skillModal.addEventListener("close", () => {
    skillButton.focus();
  });
}

createGrid();
resetGame();

