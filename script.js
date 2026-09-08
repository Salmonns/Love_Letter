const screens = ["welcome", "letter", "stats", "heart"];
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

function daysSince(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((today.getTime() - date.getTime()) / 86400000));
}

function updateLoveStats() {
  const loveDays = daysSince(new Date(2026, 7, 8));
  const knownDays = daysSince(new Date(2026, 7, 6));
  $("loveDays").textContent = loveDays;
  $("knownDays").textContent = knownDays;
  $("loveDaysNote").textContent = loveDays;
}

function updateTimer() {
  const birthday = new Date("2026-09-09T00:00:00");
  const days = Math.ceil((birthday.getTime() - Date.now()) / 86400000);
  $("loveTimer").textContent = days > 0 ? `Còn ${days} ngày nữa là đến sinh nhật cậu 🎂` : "Hôm nay là ngày đặc biệt của cậu 🎂";
}

$("openEnvelope").addEventListener("click", () => {
  startMusic();
  $("openEnvelope").classList.add("open");
  window.setTimeout(() => showScreen("letter"), 650);
});
$("continueButton").addEventListener("click", () => showScreen("stats"));
$("restartButton").addEventListener("click", () => { $("openEnvelope").classList.remove("open"); showScreen("welcome"); });
$("letterBackButton").addEventListener("click", () => { $("openEnvelope").classList.remove("open"); showScreen("welcome"); });
$("statsBackButton").addEventListener("click", () => showScreen("letter"));
$("statsNextButton").addEventListener("click", () => showScreen("heart"));
$("heartBackButton").addEventListener("click", () => showScreen("stats"));
$("heartRestartButton").addEventListener("click", () => { $("openEnvelope").classList.remove("open"); showScreen("welcome"); });

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
      : "Sai ròi công chúa ơi, thử lại đi ạ";
    flowerMessage.classList.remove("wrong");
    void flowerMessage.offsetWidth;
    flowerMessage.classList.add("wrong");
    flowerCode.select();
  }
});

/* Particle-heart experiment removed from the final experience.
const heartCanvas = $("heartCanvas");
const heartContext = heartCanvas.getContext("2d", { alpha: false });
const heartParticles = [];
const diskParticles = [];
const streamParticles = [];
const orbitParticles = [];
let heartAnimationRunning = false;
let heartAnimationFrame = 0;
let heartStartTime = 0;
const heartPoint = (t) => {
  const x = 16.8 * Math.sin(t) ** 3;
  const rawY = 12.4 * Math.cos(t) - 4.2 * Math.cos(2 * t) - 1.35 * Math.cos(3 * t) - .45 * Math.cos(4 * t);
  const y = rawY < 0 ? rawY * .88 : rawY;
  return { x, y };
};

function randomHeartParticle(region = "all") {
  let point;
  do {
    point = heartPoint(Math.random() * Math.PI * 2);
  } while ((region === "upper" && point.y < 0) || (region === "lower" && point.y >= 0));
  const fill = region === "lower"
    ? 0.12 + Math.sqrt(Math.random()) * 0.88
    : 0.12 + Math.pow(Math.random(), 1.4) * 0.88;
  return {
    x: point.x * fill,
    y: point.y * fill,
    z: (Math.random() * 2 - 1) * (1.8 - fill * .45),
    startX: (Math.random() * 2 - 1) * 23,
    startY: (Math.random() * 2 - 1) * 18,
    startZ: (Math.random() * 2 - 1) * 2.2,
    size: 0.45 + Math.random() * 1.8,
    phase: Math.random() * 8,
    speed: 0.5 + Math.random() * 1.4
  };
}

function setupHeartParticles() {
  heartParticles.length = 0;
  diskParticles.length = 0;
  streamParticles.length = 0;
  orbitParticles.length = 0;
  for (let i = 0; i < 900; i += 1) heartParticles.push(randomHeartParticle("all"));
  for (let i = 0; i < 360; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random());
    diskParticles.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: (Math.random() * 2 - 1) * radius, size: .35 + Math.random() * 1.35, phase: Math.random() * 8 });
  }
  for (let i = 0; i < 320; i += 1) {
    streamParticles.push({ x: Math.random() * 2 - 1, targetY: (Math.random() * 2 - 1) * .055, size: .35 + Math.random() * 1.25, phase: Math.random() * 8, speed: .00018 + Math.random() * .00022 });
  }
  for (let i = 0; i < 150; i += 1) {
    orbitParticles.push({ angle: Math.random() * Math.PI * 2, radius: .98 + Math.random() * .22, z: Math.random() * 2 - 1, size: .35 + Math.random() * 1.15, phase: Math.random() * 8 });
  }
}

function drawHeartScene(time = 0) {
  if (!heartAnimationRunning) return;
  const elapsed = Math.max(0, time - heartStartTime);
  const width = heartCanvas.clientWidth || 430;
  const height = heartCanvas.clientHeight || 620;
  const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
  if (heartCanvas.width !== Math.floor(width * ratio) || heartCanvas.height !== Math.floor(height * ratio)) {
    heartCanvas.width = Math.floor(width * ratio);
    heartCanvas.height = Math.floor(height * ratio);
    heartContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  const ctx = heartContext;
  ctx.clearRect(0, 0, width, height);
  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#030407");
  background.addColorStop(.72, "#060b13");
  background.addColorStop(1, "#061d2a");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  const completion = Math.min(1, Math.max(0, (elapsed - 5200) / 1800));
  const formationRaw = Math.min(1, Math.max(0, (elapsed - 260) / 4700));
  const formation = formationRaw * formationRaw * (3 - 2 * formationRaw);
  const beatWave = Math.max(0, Math.sin(time * .008));
  const pulse = 1 + completion * beatWave * .065;
  const rotation = 0;
  const tilt = 0;
  const scale = Math.min(width, height) / 39;
  const centerX = width / 2;
  const centerY = height * .42;
  ctx.globalCompositeOperation = "lighter";
  heartParticles.forEach((particle) => {
    const shimmer = .65 + .35 * Math.sin(particle.phase);
    const wobble = 0;
    const currentX = particle.startX * (1 - formation) + particle.x * formation;
    const currentY = particle.startY * (1 - formation) + particle.y * formation;
    const currentZ = particle.startZ * (1 - formation) + particle.z * formation;
    const rotatedX = currentX * Math.cos(rotation) - currentZ * Math.sin(rotation);
    const rotatedZ = currentX * Math.sin(rotation) + currentZ * Math.cos(rotation);
    const liftedY = currentY * Math.cos(tilt) - rotatedZ * Math.sin(tilt);
    const depth = 1 / (1 + rotatedZ * .12);
    const x = centerX + rotatedX * scale * pulse * depth + wobble;
    const y = centerY - liftedY * scale * pulse * depth;
    const radius = particle.size * (.75 + shimmer * .5) * depth;
    const depthLight = Math.max(0, Math.min(1, .5 + rotatedZ * .11));
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, ${55 + Math.floor(shimmer * 95 + depthLight * 30)}, ${135 + Math.floor(shimmer * 75 + depthLight * 35)}, ${.28 + shimmer * .7})`;
    ctx.shadowBlur = 0;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  const orbitAngle = time * .00055;
  orbitParticles.forEach((particle) => {
    const angle = particle.angle + orbitAngle;
    const depth = 1 / (1 + Math.sin(angle) * particle.z * .16);
    const orbitX = centerX + Math.cos(angle) * scale * 20.5 * particle.radius * depth;
    const orbitY = centerY - Math.sin(angle) * scale * 16.5 * particle.radius * depth;
    const orbitGlow = .45 + .45 * Math.max(0, Math.sin(angle + particle.phase));
    ctx.beginPath();
    ctx.fillStyle = `rgba(${190 + Math.floor(orbitGlow * 60)}, ${105 + Math.floor(orbitGlow * 80)}, ${190 + Math.floor(orbitGlow * 55)}, ${.18 + orbitGlow * .52})`;
    ctx.arc(orbitX, orbitY, particle.size * depth, 0, Math.PI * 2);
    ctx.fill();
  });
  const diskCenterY = height * .81;
  if (completion >= 1) {
    streamParticles.forEach((particle) => {
      const streamTime = Math.max(0, elapsed - 7000);
      const progress = (streamTime * particle.speed + particle.phase * .04) % 1;
      const ease = progress * progress * (3 - 2 * progress);
      const wave = Math.sin(streamTime * .0016 + particle.phase) * (8 + ease * 12);
      const startX = centerX + particle.x * width * .48;
      const startY = height * .99;
      const targetX = centerX + particle.x * width * .52;
      const targetY = diskCenterY + particle.targetY * height;
      const x = startX * (1 - ease) + targetX * ease + wave;
      const y = startY * (1 - ease) + targetY * ease;
      const glow = Math.sin(progress * Math.PI);
      ctx.beginPath();
      ctx.fillStyle = `rgba(${55 + Math.floor(glow * 80)}, ${165 + Math.floor(glow * 70)}, 255, ${.15 + glow * .72})`;
      ctx.arc(x, y, particle.size * (1 + glow * .35), 0, Math.PI * 2);
      ctx.fill();
    });
  }
  diskParticles.forEach((particle) => {
    const diskDepth = 1 / (1 + particle.z * .16);
    const x = centerX + particle.x * width * .52 * diskDepth;
    const y = diskCenterY + particle.y * height * .055 * diskDepth - particle.z * 10;
    const sparkle = .7;
    const depthLight = Math.max(0, Math.min(1, .5 + particle.z * .3));
    ctx.beginPath();
    ctx.fillStyle = `rgba(${38 + Math.floor(depthLight * 42)}, ${155 + Math.floor(sparkle * 55 + depthLight * 35)}, 255, ${.35 + sparkle * .45})`;
    ctx.arc(x, y, particle.size * diskDepth, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = "source-over";
  heartAnimationFrame = window.requestAnimationFrame(drawHeartScene);
}

function startHeartAnimation() {
  if (heartAnimationRunning) return;
  setupHeartParticles();
  heartStartTime = performance.now();
  heartAnimationRunning = true;
  heartAnimationFrame = window.requestAnimationFrame(drawHeartScene);
}

function stopHeartAnimation() {
  heartAnimationRunning = false;
  if (heartAnimationFrame) window.cancelAnimationFrame(heartAnimationFrame);
  heartAnimationFrame = 0;
}

setupHeartParticles();
*/

const music = $("bgMusic");
music.classList.add("music-only");
music.volume = 0.5;
function startMusic() {
  music.play().then(() => {
    $("musicButton").classList.add("playing");
    $("musicButton").setAttribute("aria-pressed", "true");
  }).catch(() => {});
}
window.addEventListener("load", startMusic);
document.addEventListener("pointerdown", startMusic, { once: true, passive: true });
$("musicButton").addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      $("musicButton").classList.add("playing");
      $("musicButton").setAttribute("aria-pressed", "true");
    } else {
      music.pause();
      $("musicButton").classList.remove("playing");
      $("musicButton").setAttribute("aria-pressed", "false");
    }
  } catch { alert("Muốn có nhạc nền, hãy đặt một file tên music.mp3 cạnh index.html rồi bấm lại nút ♫ nhé."); }
});

startPetals();
updateLoveStats();
window.setInterval(updateLoveStats, 60000);
