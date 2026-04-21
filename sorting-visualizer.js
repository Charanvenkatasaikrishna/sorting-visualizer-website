const algorithmInfo = {
  bubble: {
    title: "Bubble Sort",
    description:
      "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order.",
    best: "O(n)",
    average: "O(n^2)",
    worst: "O(n^2)",
    space: "O(1)"
  },
  selection: {
    title: "Selection Sort",
    description:
      "Selection Sort repeatedly selects the smallest remaining element and places it in the correct position.",
    best: "O(n^2)",
    average: "O(n^2)",
    worst: "O(n^2)",
    space: "O(1)"
  },
  insertion: {
    title: "Insertion Sort",
    description:
      "Insertion Sort builds the final sorted array one element at a time by inserting each element into its correct position.",
    best: "O(n)",
    average: "O(n^2)",
    worst: "O(n^2)",
    space: "O(1)"
  }
};

const algorithmSelect = document.getElementById("algorithm-select");
const sizeRange = document.getElementById("size-range");
const speedRange = document.getElementById("speed-range");
const customArrayInput = document.getElementById("custom-array");
const generateButton = document.getElementById("generate-button");
const applyButton = document.getElementById("apply-button");
const sortButton = document.getElementById("sort-button");
const resetButton = document.getElementById("reset-button");
const barsContainer = document.getElementById("bars-container");
const arrayValues = document.getElementById("array-values");
const comparisonsLabel = document.getElementById("comparisons-label");
const swapsLabel = document.getElementById("swaps-label");
const statusLabel = document.getElementById("status-label");
const elementsLabel = document.getElementById("elements-label");
const visualizerTitle = document.getElementById("visualizer-title");
const infoTitle = document.getElementById("info-title");
const infoDescription = document.getElementById("info-description");
const bestComplexity = document.getElementById("best-complexity");
const averageComplexity = document.getElementById("average-complexity");
const worstComplexity = document.getElementById("worst-complexity");
const spaceComplexity = document.getElementById("space-complexity");
const messageBox = document.getElementById("message-box");

let currentArray = [];
let originalArray = [];
let comparisons = 0;
let swaps = 0;
let isSorting = false;

function setMessage(text) {
  messageBox.textContent = text;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getDelay() {
  return 1000 - Number(speedRange.value);
}

function randomArray(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 90) + 10);
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  comparisonsLabel.textContent = "0";
  swapsLabel.textContent = "0";
}

function updateStats() {
  comparisonsLabel.textContent = String(comparisons);
  swapsLabel.textContent = String(swaps);
  elementsLabel.textContent = String(currentArray.length);
}

function renderArray(activeIndices = [], sortedIndices = []) {
  barsContainer.innerHTML = "";
  arrayValues.innerHTML = "";

  const maxValue = Math.max(...currentArray, 10);

  currentArray.forEach((value, index) => {
    const bar = document.createElement("div");
    const valueLabel = document.createElement("span");

    bar.className = "bar";
    bar.style.height = `${(value / maxValue) * 100}%`;

    if (activeIndices.includes(index)) {
      bar.classList.add("bar-compare");
    }

    if (sortedIndices.includes(index)) {
      bar.classList.add("bar-sorted");
    }

    valueLabel.className = "value-chip";
    valueLabel.textContent = String(value);

    barsContainer.appendChild(bar);
    arrayValues.appendChild(valueLabel);
  });
}

function updateAlgorithmInfo() {
  const selected = algorithmInfo[algorithmSelect.value];
  visualizerTitle.textContent = `${selected.title} in action`;
  infoTitle.textContent = selected.title;
  infoDescription.textContent = selected.description;
  bestComplexity.textContent = selected.best;
  averageComplexity.textContent = selected.average;
  worstComplexity.textContent = selected.worst;
  spaceComplexity.textContent = selected.space;
}

function setControlsDisabled(disabled) {
  algorithmSelect.disabled = disabled;
  sizeRange.disabled = disabled;
  speedRange.disabled = disabled;
  customArrayInput.disabled = disabled;
  generateButton.disabled = disabled;
  applyButton.disabled = disabled;
  sortButton.disabled = disabled;
  resetButton.disabled = disabled;
}

function loadArray(values) {
  currentArray = [...values];
  originalArray = [...values];
  resetStats();
  statusLabel.textContent = "Ready";
  updateStats();
  renderArray();
}

function generateNewArray() {
  const values = randomArray(Number(sizeRange.value));
  loadArray(values);
  setMessage("New random array generated. Start sorting to visualize the algorithm.");
}

function parseCustomArray() {
  const values = customArrayInput.value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number);

  if (values.length < 2 || values.some((value) => Number.isNaN(value))) {
    setMessage("Enter valid numbers separated by commas. Example: 8, 3, 5, 1, 9");
    return;
  }

  loadArray(values);
  sizeRange.value = Math.min(Math.max(values.length, 5), 20);
  setMessage("Custom array loaded successfully.");
}

async function bubbleSort() {
  const sortedIndices = [];

  for (let i = 0; i < currentArray.length - 1; i += 1) {
    let swapped = false;

    for (let j = 0; j < currentArray.length - i - 1; j += 1) {
      comparisons += 1;
      updateStats();
      renderArray([j, j + 1], sortedIndices);
      await sleep(getDelay());

      if (currentArray[j] > currentArray[j + 1]) {
        [currentArray[j], currentArray[j + 1]] = [currentArray[j + 1], currentArray[j]];
        swaps += 1;
        swapped = true;
        updateStats();
        renderArray([j, j + 1], sortedIndices);
        await sleep(getDelay());
      }
    }

    sortedIndices.push(currentArray.length - i - 1);

    if (!swapped) {
      break;
    }
  }

  return Array.from({ length: currentArray.length }, (_, index) => index);
}

async function selectionSort() {
  const sortedIndices = [];

  for (let i = 0; i < currentArray.length; i += 1) {
    let minIndex = i;

    for (let j = i + 1; j < currentArray.length; j += 1) {
      comparisons += 1;
      updateStats();
      renderArray([minIndex, j], sortedIndices);
      await sleep(getDelay());

      if (currentArray[j] < currentArray[minIndex]) {
        minIndex = j;
        renderArray([i, minIndex], sortedIndices);
        await sleep(getDelay());
      }
    }

    if (minIndex !== i) {
      [currentArray[i], currentArray[minIndex]] = [currentArray[minIndex], currentArray[i]];
      swaps += 1;
      updateStats();
      renderArray([i, minIndex], sortedIndices);
      await sleep(getDelay());
    }

    sortedIndices.push(i);
  }

  return Array.from({ length: currentArray.length }, (_, index) => index);
}

async function insertionSort() {
  const sortedIndices = [0];

  for (let i = 1; i < currentArray.length; i += 1) {
    const key = currentArray[i];
    let j = i - 1;

    renderArray([i], sortedIndices);
    await sleep(getDelay());

    while (j >= 0) {
      comparisons += 1;
      updateStats();
      renderArray([j, j + 1], sortedIndices);
      await sleep(getDelay());

      if (currentArray[j] > key) {
        currentArray[j + 1] = currentArray[j];
        swaps += 1;
        updateStats();
        renderArray([j, j + 1], sortedIndices);
        await sleep(getDelay());
        j -= 1;
      } else {
        break;
      }
    }

    currentArray[j + 1] = key;
    sortedIndices.push(i);
    renderArray([j + 1], sortedIndices);
    await sleep(getDelay());
  }

  return Array.from({ length: currentArray.length }, (_, index) => index);
}

async function startSorting() {
  if (isSorting) return;
  if (currentArray.length < 2) {
    setMessage("Please generate or enter an array first.");
    return;
  }

  isSorting = true;
  setControlsDisabled(true);
  speedRange.disabled = false;
  statusLabel.textContent = "Sorting";
  setMessage(`Running ${algorithmInfo[algorithmSelect.value].title}.`);
  resetStats();

  let sortedIndices = [];

  if (algorithmSelect.value === "bubble") {
    sortedIndices = await bubbleSort();
  } else if (algorithmSelect.value === "selection") {
    sortedIndices = await selectionSort();
  } else {
    sortedIndices = await insertionSort();
  }

  renderArray([], sortedIndices);
  statusLabel.textContent = "Completed";
  setMessage("Sorting completed successfully.");
  setControlsDisabled(false);
  isSorting = false;
}

function resetArray() {
  if (isSorting) return;
  currentArray = [...originalArray];
  resetStats();
  updateStats();
  renderArray();
  statusLabel.textContent = "Ready";
  setMessage("Array reset to the original unsorted state.");
}

algorithmSelect.addEventListener("change", updateAlgorithmInfo);
generateButton.addEventListener("click", generateNewArray);
applyButton.addEventListener("click", parseCustomArray);
sortButton.addEventListener("click", startSorting);
resetButton.addEventListener("click", resetArray);

updateAlgorithmInfo();
generateNewArray();
