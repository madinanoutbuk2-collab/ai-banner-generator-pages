const form = document.querySelector("#generatorForm");
const promptField = document.querySelector("#prompt");
const formatField = document.querySelector("#format");
const toneField = document.querySelector("#tone");
const autoRetryField = document.querySelector("#autoRetry");
const queueItems = [...document.querySelectorAll("#queueList li strong")];
const statusPill = document.querySelector("#statusPill");
const app = document.querySelector(".app");
const variants = [...document.querySelectorAll(".variant")];

const variantTitles = [
  "5G launch",
  "Fiber home",
  "Business line",
  "Retry result"
];

function setQueue(step, labels) {
  queueItems.forEach((item, index) => {
    item.textContent = index < step ? "Done" : labels[index] || "Waiting";
  });
}

function summarizePrompt() {
  const text = promptField.value.trim() || "Telecom campaign";
  const compact = text.split(/[.!?]/)[0].trim();
  return compact.length > 54 ? `${compact.slice(0, 54)}...` : compact;
}

function updateVariants() {
  const summary = summarizePrompt();
  variants.forEach((card, index) => {
    const title = card.querySelector(".art strong");
    const body = card.querySelector(".variant-meta p");
    title.textContent = variantTitles[index];
    body.textContent = `${formatField.value} · ${toneField.value} · ${summary}`;
  });
}

function runGeneration(event) {
  event.preventDefault();
  app.classList.add("is-running");
  statusPill.lastChild.textContent = " Running";
  setQueue(0, ["Running", "Waiting", "Waiting", autoRetryField.checked ? "Auto" : "Off"]);

  window.setTimeout(() => setQueue(1, ["Done", "Running", "Waiting", autoRetryField.checked ? "Auto" : "Off"]), 350);
  window.setTimeout(() => setQueue(2, ["Done", "Done", "Running", autoRetryField.checked ? "Auto" : "Off"]), 850);
  window.setTimeout(() => {
    setQueue(autoRetryField.checked ? 4 : 3, ["Done", "Done", "Done", autoRetryField.checked ? "Done" : "Off"]);
    updateVariants();
    app.classList.remove("is-running");
    statusPill.lastChild.textContent = " Ready";
  }, 1450);
}

form.addEventListener("submit", runGeneration);
promptField.addEventListener("input", updateVariants);
formatField.addEventListener("change", updateVariants);
toneField.addEventListener("change", updateVariants);
updateVariants();
