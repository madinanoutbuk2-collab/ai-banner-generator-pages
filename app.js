const app = document.querySelector(".app");
const bannerForm = document.querySelector("#bannerForm");
const quickGenerate = document.querySelector("#quickGenerate");
const message = document.querySelector("#message");
const promptPreview = document.querySelector("#promptPreview");
const previewAdType = document.querySelector("#previewAdType");
const previewHeadline = document.querySelector("#previewHeadline");
const previewSubtitle = document.querySelector("#previewSubtitle");
const previewPrice = document.querySelector("#previewPrice");
const actions = [...document.querySelectorAll(".actions button")];
const zoomBtn = document.querySelector("#zoomBtn");
const pngBtn = document.querySelector("#pngBtn");
const jpgBtn = document.querySelector("#jpgBtn");
const pdfBtn = document.querySelector("#pdfBtn");
const repeatBtn = document.querySelector("#repeatBtn");
const editBtn = document.querySelector("#editBtn");
const zoomDialog = document.querySelector("#zoomDialog");
const closeDialog = document.querySelector("#closeDialog");
const tariffForm = document.querySelector("#tariffForm");
const tariffList = document.querySelector("#tariffList");
const historyList = document.querySelector("#historyList");
const templateButtons = [...document.querySelectorAll(".template")];

function field(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function buildPrompt() {
  return [
    "Create a finished telecom advertising banner, not only background.",
    `Ad type: ${field("adType")}`,
    `Headline: ${field("headline")}`,
    `Subtitle: ${field("subtitle")}`,
    `Speed: ${field("speed")}`,
    `Price: ${field("price")}`,
    `Promo: ${field("promo")}`,
    `Benefits: ${field("benefits")}`,
    `Phone: ${field("phone")}`,
    `QR: ${field("qr")}`,
    `Size: ${field("size")}`,
    "Brand colors: #0087E6, #FFFFFF, #F4F6F9, #005EB8, accents #FF8A00 and #68C23A.",
    `Marketing request: ${field("promptText")}`
  ].join("\n");
}

function setActions(enabled) {
  actions.forEach((button) => {
    button.disabled = !enabled;
  });
}

function syncPreview() {
  previewAdType.textContent = field("adType");
  previewHeadline.textContent = field("headline");
  previewSubtitle.textContent = field("subtitle");
  previewPrice.textContent = field("price");
  promptPreview.textContent = buildPrompt();
}

function addHistory(status) {
  const item = document.createElement("li");
  item.innerHTML = `<span>${field("headline")}</span><strong>${field("size")} · ${status}</strong>`;
  historyList.prepend(item);
}

function generate(event) {
  event.preventDefault();
  syncPreview();
  setActions(false);
  app.classList.add("is-generating");
  message.textContent = "Generating with GPT Image API... saving to generated/";

  window.setTimeout(() => {
    app.classList.remove("is-generating");
    setActions(true);
    message.textContent = "Success: banner contains text, preview is ready, PNG/JPG/PDF exports enabled.";
    addHistory("Success");
  }, 950);
}

function downloadMock(type) {
  const blob = new Blob([`AI Telecom Banner Generator ${type} export placeholder`], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `telecom-banner.${type.toLowerCase()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

bannerForm.addEventListener("submit", generate);
quickGenerate.addEventListener("click", () => bannerForm.requestSubmit());
repeatBtn.addEventListener("click", () => bannerForm.requestSubmit());
editBtn.addEventListener("click", () => document.querySelector("#headline").focus());
zoomBtn.addEventListener("click", () => zoomDialog.showModal());
closeDialog.addEventListener("click", () => zoomDialog.close());
pngBtn.addEventListener("click", () => downloadMock("PNG"));
jpgBtn.addEventListener("click", () => downloadMock("JPG"));
pdfBtn.addEventListener("click", () => downloadMock("PDF"));

tariffForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const item = document.createElement("li");
  item.innerHTML = `<span>${field("tariffName")}</span><strong>${field("tariffPrice")} · ${field("tariffStatus")}</strong>`;
  tariffList.prepend(item);
  tariffForm.reset();
});

templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    templateButtons.forEach((item) => item.classList.remove("active-template"));
    button.classList.add("active-template");
    message.textContent = `Template selected: ${button.dataset.template}`;
    promptPreview.textContent = `${buildPrompt()}\nTemplate: ${button.dataset.template}`;
  });
});

["adType", "headline", "subtitle", "speed", "price", "promo", "benefits", "phone", "qr", "size", "promptText"].forEach((id) => {
  document.querySelector(`#${id}`).addEventListener("input", syncPreview);
});

setActions(false);
syncPreview();
