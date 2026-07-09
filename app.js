const promptField = document.querySelector("#prompt");
const formatField = document.querySelector("#format");
const styleField = document.querySelector("#style");
const preview = document.querySelector("#preview");
const previewTitle = document.querySelector("#previewTitle");
const previewText = document.querySelector("#previewText");
const historyList = document.querySelector("#historyList");
const tariffForm = document.querySelector("#tariffForm");

const styleBackgrounds = {
  clean: "radial-gradient(circle at 85% 20%, rgba(18, 185, 129, 0.8), transparent 24%), linear-gradient(135deg, #101828 0%, #144f7b 48%, #4fa9ff 100%)",
  retail: "radial-gradient(circle at 86% 18%, rgba(255, 214, 102, 0.9), transparent 24%), linear-gradient(135deg, #14213d 0%, #4fa9ff 52%, #12b981 100%)",
  premium: "radial-gradient(circle at 82% 22%, rgba(124, 92, 255, 0.85), transparent 24%), linear-gradient(135deg, #111827 0%, #25324d 45%, #4fa9ff 100%)"
};

const titleByFormat = {
  wide: "Интернет до 1 Гбит/с",
  square: "Скорость для всей семьи",
  story: "Подключение за один день"
};

function makeBanner() {
  const text = promptField.value.trim() || "Новая промо-кампания для клиентов";
  const firstSentence = text.split(/[.!?]/)[0].trim();
  previewTitle.textContent = titleByFormat[formatField.value];
  previewText.textContent = firstSentence.length > 90 ? `${firstSentence.slice(0, 90)}...` : firstSentence;
  preview.style.background = styleBackgrounds[styleField.value];
  preview.classList.remove("is-ready");
  requestAnimationFrame(() => preview.classList.add("is-ready"));

  const item = document.createElement("li");
  item.innerHTML = `<span>${previewTitle.textContent}</span><small>${formatField.options[formatField.selectedIndex].text} · ${styleField.options[styleField.selectedIndex].text}</small>`;
  historyList.prepend(item);
}

document.querySelector("#generate").addEventListener("click", makeBanner);
document.querySelector("#generateTop").addEventListener("click", makeBanner);

tariffForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#tariffName").value.trim();
  const speed = document.querySelector("#tariffSpeed").value.trim();
  const price = document.querySelector("#tariffPrice").value.trim();
  if (!name || !speed || !price) return;

  const item = document.createElement("li");
  item.innerHTML = `<span>${name}</span><small>${speed} · ${price}</small>`;
  historyList.prepend(item);
  tariffForm.reset();
});
