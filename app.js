const layout = document.querySelector(".layout");
const form = document.querySelector("#generationForm");
const promptField = document.querySelector("#prompt");
const formatField = document.querySelector("#format");
const simulateError = document.querySelector("#simulateError");
const apiStatus = document.querySelector("#apiStatus");
const errorBox = document.querySelector("#errorBox");
const emptyState = document.querySelector("#emptyState");
const previewCard = document.querySelector("#previewCard");
const imageTitle = document.querySelector("#imageTitle");
const imageCopy = document.querySelector("#imageCopy");
const variants = [...document.querySelectorAll(".variant")];
const historyList = document.querySelector("#historyList");
const viewBtn = document.querySelector("#viewBtn");
const pngBtn = document.querySelector("#pngBtn");
const jpgBtn = document.querySelector("#jpgBtn");
const previewDialog = document.querySelector("#previewDialog");
const closeDialog = document.querySelector("#closeDialog");
const tariffForm = document.querySelector("#tariffForm");
const tariffList = document.querySelector("#tariffList");

function nowLabel() {
  return new Date().toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function addHistory(title, status) {
  const item = document.createElement("li");
  const statusClass = status === "Success" ? "success" : "failed";
  item.innerHTML = `<span class="dot ${statusClass}"></span><div><strong>${title}</strong><small>${status} · ${nowLabel()}</small></div>`;
  historyList.prepend(item);
}

function setButtons(enabled) {
  [viewBtn, pngBtn, jpgBtn].forEach((button) => {
    button.disabled = !enabled;
  });
}

function resetVariants() {
  variants.forEach((card, index) => {
    card.className = "variant waiting";
    card.querySelector("strong").textContent = `Generating ${index + 1}`;
    card.querySelector("p").textContent = "Независимый запрос к gpt-image-1";
  });
}

function markSuccess() {
  variants.forEach((card, index) => {
    card.className = "variant success";
    card.querySelector("strong").textContent = `Ready 0${index + 1}`;
    card.querySelector("p").textContent = "Изображение получено, сохранено и доступно в истории";
  });
}

function runGeneration(event) {
  event.preventDefault();
  errorBox.textContent = "";
  setButtons(false);
  emptyState.classList.add("hidden");
  previewCard.classList.remove("hidden");
  layout.classList.add("is-running");
  apiStatus.lastChild.textContent = " Generating";
  resetVariants();

  window.setTimeout(() => {
    const prompt = promptField.value.trim() || "Telecom banner";
    const title = prompt.includes(":") ? prompt.split(":")[0] : prompt.split(/[.!?]/)[0];

    if (simulateError.checked) {
      layout.classList.remove("is-running");
      apiStatus.lastChild.textContent = " Error";
      apiStatus.querySelector("span").style.background = "var(--red)";
      errorBox.textContent = "OpenAI Images API error: request failed before image was saved.";
      variants.forEach((card) => {
        card.className = "variant error-state";
        card.querySelector("strong").textContent = "Failed";
        card.querySelector("p").textContent = "Причина ошибки показана пользователю";
      });
      addHistory(title.slice(0, 48), "Failed");
      return;
    }

    imageTitle.textContent = title.slice(0, 42);
    imageCopy.textContent = `${formatField.value} · изображение сохранено и готово к скачиванию`;
    markSuccess();
    setButtons(true);
    addHistory(title.slice(0, 48), "Success");
    layout.classList.remove("is-running");
    apiStatus.lastChild.textContent = " Ready";
    apiStatus.querySelector("span").style.background = "var(--green)";
  }, 1300);
}

function downloadMock(type) {
  if (pngBtn.disabled) return;
  const blob = new Blob([`AI Telecom Banner Studio ${type} export placeholder`], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ai-telecom-banner.${type.toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function addTariff(event) {
  event.preventDefault();
  const name = document.querySelector("#tariffName").value.trim();
  const price = document.querySelector("#tariffPrice").value.trim();
  if (!name || !price) return;
  const item = document.createElement("li");
  item.innerHTML = `<strong>${name}</strong><span>${price}</span><button>Редактировать</button>`;
  tariffList.prepend(item);
  tariffForm.reset();
}

form.addEventListener("submit", runGeneration);
viewBtn.addEventListener("click", () => previewDialog.showModal());
closeDialog.addEventListener("click", () => previewDialog.close());
pngBtn.addEventListener("click", () => downloadMock("PNG"));
jpgBtn.addEventListener("click", () => downloadMock("JPG"));
tariffForm.addEventListener("submit", addTariff);
