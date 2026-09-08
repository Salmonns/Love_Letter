const screens = ["welcome", "letter", "stats"];
const $ = (id) => document.getElementById(id);

function showScreen(id) {
  screens.forEach((screenId) => {
    const screen = $(screenId);
    const active = screenId === id;
    screen.hidden = !active;
    screen.classList.toggle("active", active);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = Math.random() > 0.45 ? "✿" : "❀";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.fontSize = `${0.65 + Math.random() * 0.8}rem`;
  petal.style.setProperty("--x", `${-100 + Math.random() * 200}px`);
  petal.style.animationDuration = `${7 + Math.random() * 8}s`;
  document.querySelector(".petals").appendChild(petal);
  window.setTimeout(() => petal.remove(), 16000);
}

function startPetals() {
  window.setInterval(createPetal, 650);
  for (let i = 0; i < 12; i += 1) window.setTimeout(createPetal, i * 180);
}

function updateTimer() {
  const birthday = new Date("2026-09-09T00:00:00");
  const days = Math.ceil((birthday.getTime() - Date.now()) / 86400000);
  $("loveTimer").textContent = days > 0 ? `Còn ${days} ngày nữa là đến sinh nhật cậu 🎂` : "Hôm nay là ngày đặc biệt của cậu 🎂";
}

$("openEnvelope").addEventListener("click", () => {
  $("openEnvelope").classList.add("open");
  window.setTimeout(() => showScreen("letter"), 650);
});
$("continueButton").addEventListener("click", () => showScreen("stats"));
$("restartButton").addEventListener("click", () => { $("openEnvelope").classList.remove("open"); showScreen("welcome"); });

const flowerForm = $("flowerForm");
const flowerCode = $("flowerCode");
const flowerMessage = $("flowerMessage");
const birthdayBouquet = $("birthdayBouquet");
let flowerAttempts = 0;
flowerCode.addEventListener("input", () => {
  flowerCode.value = flowerCode.value.replace(/\D/g, "").slice(0, 4);
});
flowerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (flowerCode.value === "0708") {
    $("bouquetLock").classList.add("unlocked");
    flowerMessage.textContent = "Đúng rồi… bó hoa này là của em 💐";
    birthdayBouquet.classList.add("revealed");
    window.setTimeout(() => $("bouquetLock").setAttribute("hidden", ""), 850);
  } else {
    flowerAttempts += 1;
    flowerMessage.textContent = flowerAttempts >= 3
      ? "MK là 07/08 đó ạ, công chúa ngốc ơi"
      : "Chưa đúng rồi, thử nhớ lại ngày của hai đứa nhé ✦";
    flowerMessage.classList.remove("wrong");
    void flowerMessage.offsetWidth;
    flowerMessage.classList.add("wrong");
    flowerCode.select();
  }
});

const music = $("bgMusic");
$("musicButton").addEventListener("click", async () => {
  try {
    if (music.paused) { await music.play(); $("musicButton").classList.add("playing"); }
    else { music.pause(); $("musicButton").classList.remove("playing"); }
  } catch { alert("Muốn có nhạc nền, hãy đặt một file tên music.mp3 cạnh index.html rồi bấm lại nút ♫ nhé."); }
});

startPetals();
