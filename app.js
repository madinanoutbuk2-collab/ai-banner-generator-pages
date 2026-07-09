const layout = document.querySelector(".layout");
const generatorForm = document.querySelector("#generatorForm");
const runButton = document.querySelector("#runGeneration");
const brief = document.querySelector("#brief");
const channel = document.querySelector("#channel");
const tone = document.querySelector("#tone");
const pipeline = [...document.querySelectorAll("#pipeline strong")];
const cards = [...document.querySelectorAll(".banner-card")];
const tariffForm = document.querySelector("#tariffForm");
const tariffList = document.querySelector("#tariffList");

function setPipeline(activeIndex) {
  pipeline.forEach((node, index) => {
    if (index < activeIndex) node.textContent = "Done";
    if (index === activeIndex) node.textContent = "Running";
    if (index > activeIndex) node.textContent = index === 3 ? "Enabled" : "Waiting";
  });
}

function updateCards() {
  const firstLine = brief.value.trim().split(/[.!?]/)[0] || "Новая телеком-кампания";
  cards.forEach((card, index) => {
    const body = card.querySelector(".card-body p");
    body.textContent = `${channel.value} · ${tone.value} · ${firstLine.slice(0, 72)}`;
    if (index === 3) {
      body.textContent = `Auto retry · ${tone.value} · свежая генерация без шаблона`;
    }
  });
}

function runGeneration(event) {
  event.preventDefault();
  layout.classList.add("is-running");
  setPipeline(0);
  window.setTimeout(() => setPipeline(1), 350);
  window.setTimeout(() => setPipeline(2), 850);
  window.setTimeout(() => setPipeline(3), 1250);
  window.setTimeout(() => {
    pipeline.forEach((node) => {
      node.textContent = "Done";
    });
    updateCards();
    layout.classList.remove("is-running");
  }, 1650);
}

function addTariff(event) {
  event.preventDefault();
  const name = document.querySelector("#tariffName").value.trim();
  const speed = document.querySelector("#tariffSpeed").value.trim();
  const price = document.querySelector("#tariffPrice").value.trim();
  if (!name || !speed || !price) return;

  const item = document.createElement("li");
  item.innerHTML = `<span>${name}</span><strong>${speed} · ${price}</strong><button>Изменить</button>`;
  tariffList.prepend(item);
  tariffForm.reset();
}

generatorForm.addEventListener("submit", runGeneration);
runButton.addEventListener("click", runGeneration);
brief.addEventListener("input", updateCards);
channel.addEventListener("change", updateCards);
tone.addEventListener("change", updateCards);
tariffForm.addEventListener("submit", addTariff);
updateCards();
