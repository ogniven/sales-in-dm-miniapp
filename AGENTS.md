# AGENTS.md

# Project: «Где вы теряете клиента» — Telegram Mini App MVP

## 0. What this file is

This repository contains the MVP of a Telegram Mini App for the project «Продажи в переписке».

The owner is not a developer. Make implementation choices that minimize maintenance, dependencies, hidden infrastructure, and setup complexity.

When there is a choice between a clever architecture and a simple reliable one, choose the simple reliable one.

Do not expand scope unless explicitly asked.

---

# 1. Product goal

The Mini App is a bridge from Threads content into a real sales conversation.

Primary funnel:

Threads post
→ profile link
→ Telegram Mini App
→ user recognizes their situation
→ user selects what happened with a potential client
→ user understands that the sale may have changed direction earlier than they thought
→ user clicks the final CTA
→ personal Telegram chat opens
→ a prefilled message contains their answers
→ user sends anonymized screenshots of the real conversation
→ author manually gives one free micro-analysis
→ later, when relevant, the author can offer a paid full analysis.

The MVP does NOT need to automate the analysis.

The main product action is:

**Get a relevant person to bring one real sales conversation into Telegram.**

---

# 2. Audience

Experts and specialists who already receive inquiries from potential clients in DMs, but some conversations do not become payments.

Typical situations:

- client asked the price and disappeared;
- client said «дорого»;
- client said «я подумаю»;
- client stopped replying;
- expert is afraid to follow up;
- expert starts over-explaining after doubt or objection;
- expert gives a discount too early;
- expert writes «если будет актуально — напишите» and ends the sale;
- expert knows what they should write, but writes something safer instead.

Do not position this as generic SMM, lead generation, or universal sales scripts.

---

# 3. Core positioning

The central distinction:

**The problem is not always that the person does not know what to write. Sometimes they know, but they cannot tolerate what may happen after they send it: refusal, silence, “дорого”, dissatisfaction, uncertainty, evaluation of their price.**

Key positioning lines:

> Я не помогаю вам найти больше клиентов.  
> Я разбираюсь, почему не покупают те, кто уже вам написал.

And:

> Иногда продавцу не нужен ещё один скрипт.  
> Он уже знает, что написать.  
> Вопрос в том, сможет ли он отправить это сообщение — и выдержать ответ.

The app should communicate this idea through the user flow, not through a long lecture.

---

# 4. Product limitation strategy — “сломанный зонт”

The product should explicitly sell through its limitations.

What the product does NOT do:

1. It does not bring new leads.
2. It does not promise a script that “closes everyone”.
3. It does not eliminate objections, «дорого», pauses, or refusals.
4. It does not teach how to sell to every person.
5. It does not analyze business in general.
6. It does not replace the seller.
7. It does not need a complex AI layer in the MVP.

Why these limitations are valuable:

- it focuses on people who already have real conversations;
- it analyzes the exact point where a conversation changed direction;
- it works with the real context, not generic scripts;
- it distinguishes lack of sales technique from emotional avoidance;
- it aims at one specific result: understand one meaningful point in a real conversation.

---

# 5. MVP technical constraints

Build the first version as a static frontend.

Preferred stack:

- `index.html`
- `styles.css`
- `app.js`
- Telegram Mini Apps JavaScript bridge / official Telegram WebApp interface

Avoid unless explicitly requested:

- React
- Vue
- Next.js
- npm packages
- build tools
- backend
- server
- database
- authentication
- OpenAI API
- AI analysis
- Telegram Bot API backend
- webhooks
- Supabase
- Firebase
- analytics SDKs
- cookies
- user accounts
- file upload
- payment integration

The app must work:

1. inside Telegram as a Mini App;
2. in a normal mobile browser as a fallback.

The project should be deployable as static files over HTTPS, preferably via GitHub Pages for the MVP.

---

# 6. Privacy and data rules

The Mini App itself must NOT collect or store:

- names;
- phone numbers;
- emails;
- screenshots;
- Telegram messages;
- client personal data.

Do not add hidden tracking.

Do not add cookies.

Do not store user answers on a server.

The only temporary state may live in frontend JavaScript during the session.

Before the final CTA, clearly tell the user:

**Перед отправкой закройте имя, фото, телефон и другие личные данные клиента.**

The actual screenshots are sent by the user manually in Telegram after leaving the Mini App.

---

# 7. Telegram integration rules

At startup:

- detect whether `window.Telegram?.WebApp` is available;
- call the appropriate Telegram WebApp readiness method when available;
- adapt the UI to Telegram WebView and safe areas where practical;
- do not fail if Telegram APIs are unavailable.

Support a traffic source parameter where practical.

Target link may use:

`?startapp=threads`

If Telegram provides a start parameter, keep it in frontend state for future analytics, but do not send or store it in the MVP.

The final CTA must open the author's PUBLIC PERSONAL TELEGRAM USERNAME, not the bot chat.

Use the placeholder:

`YOUR_TELEGRAM_USERNAME`

Do not hardcode a fake username.

The prefilled Telegram message must be generated from the user's selected answers.

Example:

> Я из Threads. Хочу микроразбор переписки.  
> Ситуация: спросил цену и исчез.  
> Мне кажется, всё пошло не туда: когда назвала цену.  
> Сейчас пришлю обезличенные скрины.

Use correct URL encoding.

If inside Telegram, use the most appropriate Telegram-supported method for opening the Telegram link.

If outside Telegram, use a standard `https://t.me/...` fallback.

---

# 8. UX principles

This is not a normal website.

It is a short diagnostic flow.

Rules:

- mobile-first;
- optimize primarily for approximately 360–430px viewport width;
- one screen = one main idea;
- one screen = one primary action;
- short paragraphs;
- large tap targets;
- clear progress;
- Back button;
- do not reload between steps;
- user selections persist while navigating backward/forward;
- no menu;
- no footer full of links;
- no distracting secondary CTAs;
- no long biography before the diagnostic flow;
- no newsletter signup;
- no email collection;
- no “learn more” detours.

The user should understand what to do without instructions.

---

# 9. Visual direction

Desired feeling:

- intelligent;
- adult;
- minimalist;
- precise;
- slightly bold;
- human;
- not “infobusiness”.

Use:

- generous spacing;
- strong typography;
- high contrast;
- one restrained accent color;
- cards only when they help selection;
- subtle motion only if it improves orientation.

Avoid:

- stock images;
- decorative AI imagery;
- gradients for decoration;
- neon;
- excessive shadows;
- glossy UI;
- emoji as the visual system;
- fake testimonials;
- fake metrics;
- “10x revenue” language;
- generic SaaS dashboard aesthetics.

Accessibility:

- readable font sizes;
- sufficient contrast;
- visible focus states;
- buttons usable by touch;
- respect reduced-motion preferences.

---

# 10. Screen flow and exact copy

## Screen 1 — Start

Eyebrow / small text if needed:

`Продажи в переписке`

Headline:

**Где вы потеряли клиента?**

Body:

**Вам уже пишут потенциальные клиенты. Давайте посмотрим, что происходит между интересом и оплатой.**

Primary button:

**НАЧАТЬ**

Do not add a biography here.

---

## Screen 2 — Situation

Progress example:

`2 из 7`

Headline:

**Что произошло?**

Selectable cards:

1. **Спросил цену и исчез**
2. **Сказал «дорого»**
3. **Написал «я подумаю»**
4. **Просто перестал отвечать**
5. **Другая ситуация**

On selection:

- save the answer in frontend state;
- enable next step;
- selection should be visually obvious.

---

## Screen 3 — User hypothesis

Headline:

**Как вам кажется, где всё пошло не туда?**

Options:

1. **Когда назвала цену**
2. **Когда клиент начал сомневаться**
3. **Когда я стала слишком много объяснять**
4. **Когда перестала писать**
5. **Не понимаю**
6. **Другое**

If implementing a free-text “Другое” field is simple and clean, it is allowed.

If it creates needless complexity, keep “Другое” as a label without additional data entry in v1.

---

## Screen 4 — Reframe

Headline:

**Возможно, вы потеряли клиента не там, где думаете**

Body:

**Большинство начинает анализировать последнее сообщение клиента: «дорого», «я подумаю» или молчание.**

**Я сначала смотрю, что происходило раньше.**

**Иногда проблема не в том, что написал клиент.**

**Иногда продавцу стало тревожно — и он начал объяснять, оправдываться, снижать цену, исчезать или заканчивать продажу за клиента.**

Primary button:

**ДАЛЬШЕ**

Do not turn this into a long article.

---

## Screen 5 — Product limitations

Headline:

**Что я НЕ сделаю**

Items:

**Не приведу вам новых клиентов.**

**Не дам скрипт, который «закрывает любого».**

**Не избавлю вас от «дорого» и отказов.**

**Не научу продавать каждому.**

Main highlighted statement:

> **Я разбираюсь, почему не покупают те, кто уже вам написал.**

Primary button:

**ДА, ЭТО МОЯ ПРОБЛЕМА**

This screen is a core positioning screen. Keep it strong and uncluttered.

---

## Screen 6 — What the free micro-analysis gives

Headline:

**Что я посмотрю в вашей переписке**

Intro:

**В бесплатном микроразборе я беру один значимый эпизод.**

Points:

- **где разговор мог изменить направление;**
- **что произошло в этой точке;**
- **что можно было написать иначе;**
- **есть ли смысл продолжать разговор сейчас.**

Highlighted question:

> **Вы действительно не знали, что написать — или знали, но вам было трудно столкнуться с тем, что клиент ответит после этого?**

Boundary text, visible but not aggressive:

**Это не полный аудит продаж. В микроразборе я разбираю одну значимую точку.**

Primary button:

**ПОКАЗАТЬ ПЕРЕПИСКУ**

---

## Screen 7 — Final CTA

Headline:

**Покажите мне клиента, которого вы потеряли**

Body:

**Пришлите 5–15 последних сообщений переписки.**

Privacy reminder:

**Перед отправкой закройте имя, фото, телефон и другие личные данные клиента.**

Optional short line:

**Не пересказывайте переписку. Покажите её.**

Primary button:

**ОТПРАВИТЬ ПЕРЕПИСКУ**

On tap:

1. build a Telegram prefilled message from the user's selections;
2. open the author's personal Telegram username;
3. do not send anything automatically;
4. the user must remain in control and press Send themselves.

---

# 11. Prefilled Telegram message

Base template:

`Я из Threads. Хочу микроразбор переписки.
Ситуация: {situation}.
Мне кажется, всё пошло не туда: {hypothesis}.
Сейчас пришлю обезличенные скрины.`

If an answer is missing, do not produce ugly placeholders.

Use a graceful shortened version.

Example:

`Я из Threads. Хочу микроразбор переписки. Сейчас пришлю обезличенные скрины.`

---

# 12. Navigation behavior

Implement:

- progress indicator;
- Back button from screens 2–7;
- forward navigation only after required choice on selection screens;
- preserved state when user goes back;
- no page reload;
- no browser alert boxes for normal UX;
- no accidental loss of answers.

On Screen 1, Back is not required.

On Screen 7, final CTA is primary.

---

# 13. Mobile behavior

Test mentally and technically for:

- 360px width;
- 390px width;
- 430px width;
- long Russian text wrapping;
- Telegram WebView height changes;
- safe area / bottom UI overlap;
- keyboard opening if any text input is used;
- dark mode only if it can be done cleanly; otherwise prioritize a polished light version.

Do not let the final CTA sit underneath Telegram chrome.

---

# 14. Copy rules

Voice:

- short;
- conversational;
- sharp;
- not patronizing;
- no “guru” tone;
- no pressure;
- no manipulation;
- no diagnosis of the user;
- no promise that one message guarantees a sale.

Important nuance:

Do not state as fact that a specific message “killed” a sale.

Use language such as:

- “мог изменить направление”;
- “я бы посмотрела сюда”;
- “возможно”;
- “значимая точка”;
- “что происходило в этот момент”.

Do not promise to “return” every lost client.

---

# 15. Files to create

Minimum:

- `index.html`
- `styles.css`
- `app.js`
- `README.md`

This `AGENTS.md` already exists and should remain the source of project instructions.

Do not overwrite it with a generic generated version.

---

# 16. README requirements

Write README for a non-technical owner.

It must explain in plain Russian:

1. what the project is;
2. how to run it locally;
3. exactly where to replace `YOUR_TELEGRAM_USERNAME`;
4. how to publish to GitHub Pages;
5. how to find the final HTTPS URL;
6. where to put that URL in BotFather for the Mini App;
7. how to form a `t.me/<BOT_USERNAME>?startapp=threads` test link;
8. how to test the full flow on a phone;
9. how to change copy later without breaking logic.

Do not assume terminal knowledge if a GitHub UI path is enough.

---

# 17. Definition of done for MVP

The MVP is done only when all of the following are true:

- static app opens without errors;
- Screen 1 starts the flow;
- all 5 situation options work;
- all hypothesis options work;
- Back works;
- state is preserved;
- progress is correct;
- Screen 5 clearly communicates product limitations;
- Screen 6 clearly sets the free-analysis boundary;
- final CTA constructs a valid message;
- Telegram link is URL-encoded correctly;
- fallback works outside Telegram;
- app does not crash when Telegram WebApp object is absent;
- no user data is sent to a server;
- no screenshots are uploaded in the app;
- no cookies are used;
- mobile layout works at 360–430px;
- there are no obvious console errors;
- README is complete for a non-developer;
- the app can be deployed to GitHub Pages.

---

# 18. First implementation task

Read this entire `AGENTS.md`.

Then implement the complete MVP described here.

Before coding, briefly state:

1. the file structure you will create;
2. any assumption you must make;
3. any Telegram limitation that affects the requested behavior.

Then create the files and run reasonable checks.

Do not ask the owner to choose a framework.

Do not add features not requested here.

At the end, report in simple Russian:

- what was created;
- what remains for the owner to fill in;
- exactly where `YOUR_TELEGRAM_USERNAME` must be replaced;
- how to preview it;
- how to publish it;
- how to connect the published HTTPS URL to the existing Telegram bot.

---

# 19. Future ideas — DO NOT implement in v1

Keep these only as future possibilities:

- automatic Telegram bot intake;
- automatic screenshot collection;
- OCR;
- AI analysis;
- OpenAI API;
- CRM;
- analytics;
- database;
- admin panel;
- payment;
- paid full-analysis checkout;
- user history;
- personalized result pages.

Do not implement them until real usage shows they are needed.

---

# 20. Main product filter

Before making any change, ask:

**Does this reduce the distance between “чёрт, я так и делаю” and “вот моя реальная переписка”?**

If not, it probably does not belong in the MVP.
