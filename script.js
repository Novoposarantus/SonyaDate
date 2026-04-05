const statusText = document.getElementById("status-text");

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-scroll-to");
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function moveInsideArena(button, arena) {
  const padding = 12;
  const rangeX = Math.max(0, arena.clientWidth - button.offsetWidth - padding * 2);
  const rangeY = Math.max(0, arena.clientHeight - button.offsetHeight - padding * 2);
  const nextX = padding + Math.random() * rangeX;
  const nextY = padding + Math.random() * rangeY;

  button.style.left = `${nextX}px`;
  button.style.top = `${nextY}px`;
  button.style.right = "auto";
  button.style.bottom = "auto";
  button.style.transform = "none";
  button.classList.add("is-running");
}

function attachRunaway(button, arena, messages) {
  const dodge = (event) => {
    if (event.cancelable) {
      event.preventDefault();
    }

    moveInsideArena(button, arena);

    if (statusText) {
      const message = messages[Math.floor(Math.random() * messages.length)];
      statusText.textContent = message;
    }
  };

  ["mouseenter", "focus"].forEach((eventName) => {
    button.addEventListener(eventName, dodge);
  });

  ["pointerdown", "touchstart", "click"].forEach((eventName) => {
    button.addEventListener(eventName, dodge, { passive: false });
  });

  return {
    dodge,
    reset() {
      button.removeAttribute("style");
      button.classList.remove("is-running");
    }
  };
}

function launchHeartBurst() {
  const burst = document.getElementById("heart-burst");

  if (!burst) {
    return;
  }

  burst.innerHTML = "";

  const pieces = ["💗", "💖", "💞", "✨", "🎀", "🌸"];

  for (let index = 0; index < 18; index += 1) {
    const piece = document.createElement("span");
    piece.className = "heart-piece";
    piece.textContent = pieces[index % pieces.length];
    piece.style.setProperty("--left", `${8 + Math.random() * 84}%`);
    piece.style.setProperty("--delay", `${Math.random() * 0.28}s`);
    piece.style.setProperty("--shift", `${-90 + Math.random() * 180}px`);
    burst.appendChild(piece);
  }

  setTimeout(() => {
    burst.innerHTML = "";
  }, 1800);
}

const firstPanel = document.getElementById("first-panel");
const secondPanel = document.getElementById("second-panel");
const successCard = document.getElementById("success-card");

const firstStage = document.getElementById("first-stage");
const secondStage = document.getElementById("second-stage");

const firstYes = document.getElementById("first-yes");
const firstNo = document.getElementById("first-no");
const secondYes = document.getElementById("second-yes");
const secondNo = document.getElementById("second-no");

const firstRunaway = attachRunaway(firstYes, firstStage, [
  "Ой, кнопка «Да» застеснялась и убежала 🙈",
  "Слишком быстрое согласие? Нет-нет, сначала немного интриги 💗",
  "Кажется, эта кнопка решила поиграть в догонялки 😌"
]);

attachRunaway(secondNo, secondStage, [
  "Кнопка «Нет» внезапно потеряла уверенность 😏",
  "Похоже, вариант с вкусным обедом ей нравится меньше всего 🍰",
  "Убежать от этого предложения почти невозможно 💞"
]);

firstNo.addEventListener("click", () => {
  firstPanel.hidden = true;
  secondPanel.hidden = false;

  if (statusText) {
    statusText.textContent = "Ладно-ладно, тогда включаю запасной план 😌";
  }

  secondPanel.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    moveInsideArena(secondNo, secondStage);
  }, 180);
});

secondYes.addEventListener("click", () => {
  secondPanel.hidden = true;
  successCard.hidden = false;
  document.body.classList.add("celebrate");

  if (statusText) {
    statusText.textContent = "Вот это уже отличный исход событий 💘";
  }

  successCard.scrollIntoView({ behavior: "smooth", block: "center" });
  launchHeartBurst();
});

window.addEventListener("resize", () => {
  if (!firstPanel.hidden) {
    firstRunaway.reset();
  }

  if (!secondPanel.hidden && secondNo) {
    moveInsideArena(secondNo, secondStage);
  }
});
