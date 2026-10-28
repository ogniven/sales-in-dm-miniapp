"use strict";

// Вставьте публичный username ЛИЧНОГО аккаунта, без @ и без ссылки.
const TELEGRAM_USERNAME = "smart_lana";

const situations = [
  "Спросил цену и исчез", "Сказал «дорого»", "Написал «я подумаю»",
  "Просто перестал/а отвечать", "Другая ситуация"
];
const hypotheses = [
  "Когда назвал/а цену", "Когда клиент начал сомневаться",
  "Когда стал/а слишком много объяснять", "Когда перестал/а писать",
  "Не понимаю", "Другое"
];

const telegram = window.Telegram?.WebApp;
const insideTelegram = Boolean(telegram && telegram.platform && telegram.platform !== "unknown");
// Только оперативная память: не сохраняем и не отправляем источник или ответы.
const state = {
  step: 0, situation: "", hypothesis: "",
  source: telegram?.initDataUnsafe?.start_param || new URLSearchParams(window.location.search).get("startapp") || ""
};
const screen = document.getElementById("screen");
const next = document.getElementById("next");
const back = document.getElementById("back");
const notice = document.getElementById("notice");
const finalActions = document.getElementById("final-actions");
const sendLink = document.getElementById("send-link");
const copyStatus = document.getElementById("copy-status");

// Изменяйте тексты здесь, сохраняя HTML-теги и порядок экранов.
const pages = [
  `<p class="eyebrow">ИСТЕРОИДНЫЕ ПРОДАЖИ</p><p class="brand-caption">профайлинг клиента в переписке</p><h1 tabindex="-1">Где вы потеряли клиента?</h1><p class="lead">Вам уже пишут потенциальные клиенты. Давайте посмотрим, что произошло между интересом и оплатой и какие сигналы клиента вы могли пропустить.</p>`,
  `<h1 id="question" tabindex="-1">Что произошло?</h1>`,
  `<h1 id="question" tabindex="-1">Как вам кажется, где всё пошло не туда?</h1>`,
  `<h1 tabindex="-1">Возможно, вы потеряли клиента не там, где думаете</h1><p>Большинство начинает анализировать последнее сообщение клиента: «дорого», «я подумаю» или молчание.</p><p class="emphasis">Я сначала смотрю, что происходило раньше.</p><p>Иногда проблема не в последней фразе клиента.</p><p>Иногда раньше уже появились сигналы:</p><ul><li>клиенту не хватало ясности;</li><li>он задавал вопросы, на которые не получил нужного ответа;</li><li>вы начали слишком много объяснять;</li><li>испугались реакции клиента;</li><li>стали снижать цену;</li><li>закончили продажу за него.</li></ul><blockquote>Клиент мог начать уходить раньше, чем вам показалось.</blockquote>`,
  `<h1 tabindex="-1">Что я НЕ сделаю</h1><ul class="limits"><li>Не приведу вам новых клиентов.</li><li>Не дам скрипт, который «закрывает любого».</li><li>Не определю психотип клиента по двум сообщениям.</li><li>Не избавлю вас от «дорого», сомнений и отказов.</li><li>Не научу продавать каждому.</li></ul><blockquote>Я разбираю, почему не покупают те, кто уже вам написал.</blockquote>`,
  `<h1 tabindex="-1">Что я посмотрю в вашей переписке</h1><p>В бесплатном микроразборе я беру один значимый эпизод.</p><ul><li>где разговор начал менять направление;</li><li>какие сигналы клиента вы могли пропустить;</li><li>что для него, вероятно, было важно в этот момент;</li><li>где вы ответили из своей тревоги, а не из ситуации клиента;</li><li>каким вопросом можно было проверить гипотезу;</li><li>что стоило написать дальше.</li></ul><p class="emphasis">Я не ставлю клиенту психотип по трём сообщениям.</p><blockquote>Сначала сигналы.<br>Потом гипотеза.<br>Потом проверка.</blockquote><p>Только после этого решаем, что писать дальше.</p><p class="boundary">Это не полный аудит продаж. В микроразборе я разбираю одну значимую точку.</p>`,
  `<h1 tabindex="-1">Покажите переписку, где вы потеряли клиента</h1><p class="lead">Пришлите 5–15 последних сообщений.</p><p class="privacy">Перед отправкой закройте имя, фото, телефон и другие личные данные клиента.</p><p>Не пересказывайте переписку. Покажите её.</p>`
];
const buttons = ["НАЧАТЬ", "ДАЛЬШЕ", "ДАЛЬШЕ", "ДАЛЬШЕ", "ДА, ЭТО МОЯ ПРОБЛЕМА", "ПОКАЗАТЬ ПЕРЕПИСКУ", "ОТПРАВИТЬ ПЕРЕПИСКУ"];

function telegramCall(callback) {
  try { callback(); } catch { /* Браузер и старые клиенты сохраняют обычную навигацию. */ }
}

function updateViewport() {
  if (!insideTelegram) return;
  const style = document.documentElement.style;
  if (telegram.viewportStableHeight > 0) style.setProperty("--app-height", `${telegram.viewportStableHeight}px`);
  for (const side of ["top", "bottom", "left", "right"]) {
    const inset = (telegram.safeAreaInset?.[side] || 0) + (telegram.contentSafeAreaInset?.[side] || 0);
    style.setProperty(`--safe-${side}`, `${inset}px`);
  }
}

function render(focus = true) {
  screen.innerHTML = pages[state.step];
  screen.className = state.step === 0 ? "start" : "";
  notice.hidden = true;
  const isFinal = state.step === pages.length - 1;
  next.hidden = isFinal;
  finalActions.hidden = !isFinal;
  copyStatus.hidden = true;
  if (isFinal) updateChatLink();
  back.hidden = state.step === 0;
  next.textContent = buttons[state.step];
  next.disabled = (state.step === 1 && !state.situation) || (state.step === 2 && !state.hypothesis);
  document.getElementById("progress").textContent = `${state.step + 1} из 7`;
  document.getElementById("progress-fill").style.width = `${(state.step + 1) / 7 * 100}%`;

  if (state.step === 1 || state.step === 2) {
    const key = state.step === 1 ? "situation" : "hypothesis";
    const options = state.step === 1 ? situations : hypotheses;
    const group = document.createElement("fieldset");
    group.className = "choices";
    group.setAttribute("aria-labelledby", "question");
    options.forEach((answer) => {
      const label = document.createElement("label");
      label.className = "choice";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = key;
      input.value = answer;
      input.checked = state[key] === answer;
      input.addEventListener("change", () => { state[key] = answer; next.disabled = false; });
      const text = document.createElement("span");
      text.textContent = answer;
      label.append(input, text);
      group.append(label);
    });
    screen.append(group);
  }
  if (insideTelegram) telegramCall(() => state.step ? telegram.BackButton?.show() : telegram.BackButton?.hide());
  if (focus) {
    screen.querySelector("h1").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function buildMessage(answers) {
  const lines = ["ИСТЕРОИДНЫЕ ПРОДАЖИ | МИКРОРАЗБОР", "", "Мини-диагностика пройдена."];
  if (answers.situation) lines.push(`Ситуация: ${answers.situation}.`);
  if (answers.hypothesis) lines.push(`Мне кажется, всё пошло не туда: ${answers.hypothesis}.`);
  lines.push("", "Посмотрите, пожалуйста, какие сигналы клиента я мог/ла пропустить и что происходило с моей стороны в этой точке.", "", "Сейчас пришлю обезличенные скрины.");
  return lines.join("\n");
}

function updateChatLink() {
  const username = TELEGRAM_USERNAME.trim().replace(/^@/, "");
  if (username === "YOUR_TELEGRAM_USERNAME" || !/^[a-zA-Z][a-zA-Z0-9_]{3,31}$/.test(username)) {
    notice.textContent = "Переход в чат пока не настроен. Владелец приложения скоро добавит ссылку.";
    notice.hidden = false;
    sendLink.removeAttribute("href");
    return;
  }
  const text = encodeURIComponent(buildMessage(state));
  sendLink.href = `https://t.me/${username}?text=${text}`;
}

document.getElementById("copy-text").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(buildMessage(state));
    copyStatus.textContent = "Текст скопирован.";
  } catch {
    copyStatus.textContent = "Не удалось скопировать текст. Напишите @smart_lana по ссылке выше.";
  }
  copyStatus.hidden = false;
});

function goBack() {
  if (state.step > 0) { state.step -= 1; render(); }
}
back.addEventListener("click", goBack);
next.addEventListener("click", () => {
  if (next.disabled) return;
  if (state.step === pages.length - 1) return;
  state.step += 1;
  render();
});

render(false);
telegramCall(() => telegram?.ready?.());
if (insideTelegram) {
  telegramCall(() => telegram.expand?.());
  telegramCall(() => telegram.BackButton?.onClick(goBack));
  for (const event of ["viewportChanged", "safeAreaChanged", "contentSafeAreaChanged"]) {
    telegramCall(() => telegram.onEvent?.(event, updateViewport));
  }
  telegramCall(() => telegram.setHeaderColor?.("#f6f5f0"));
  telegramCall(() => telegram.setBackgroundColor?.("#f6f5f0"));
  updateViewport();
}
