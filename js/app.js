const navEl = document.getElementById("nav");
const contentEl = document.getElementById("content");
const searchEl = document.getElementById("search");
const sidebarEl = document.getElementById("sidebar");
const appEl = document.getElementById("app");
const sideToggle = document.getElementById("sideToggle");
if (localStorage.getItem("theme") === "dark") document.documentElement.setAttribute("data-theme", "dark");
if (localStorage.getItem("nav") === "off") appEl.classList.add("collapsed");
function renderNav(filter = "") {
  const q = filter.trim().toLowerCase();
  const match = l => !q || l.title.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
  const s1 = LECTURES.filter(l => l.sem === 1 && match(l));
  const s2 = LECTURES.filter(l => l.sem === 2 && match(l));
  navEl.innerHTML = `<div class="sem-title">1-semestr</div>${s1.map(itemBtn).join("")}<div class="sem-title">2-semestr</div>${s2.map(itemBtn).join("")}`;
}
function itemBtn(l) {
  const active = location.hash === `#${l.id}` ? "active" : "";
  return `<button class="nav-item ${active}" data-id="${l.id}">${l.code}. ${l.title}</button>`;
}
function toolsBar() {
  return `<div class="tools"><button class="icon-btn" id="navBtn" type="button">Mavzular</button><button class="icon-btn" id="themeBtn" type="button">Rejim</button><button class="icon-btn" id="fsBtn" type="button">A+ / A-</button></div>`;
}
function homePage() {
  return `${toolsBar()}<section class="hero-panel"><span class="kicker">AIFU</span><h2>Dasturlash fani</h2><p class="lead">Chapdan mavzuni tanlang.</p></section>`;
}
function lecturePage(l) {
  const idx = LECTURES.findIndex(x => x.id === l.id);
  const prev = LECTURES[idx - 1];
  const next = LECTURES[idx + 1];
  return `${toolsBar()}<section class="hero-panel"><span class="kicker">${l.code}</span><h2>${l.title}</h2><p class="lead">${l.lead}</p></section><article class="lecture">${l.html}<div class="nav-buttons"><button class="btn" ${prev ? `onclick="location.hash='#${prev.id}'"` : "disabled"}>← Oldingi</button><button class="btn primary" ${next ? `onclick="location.hash='#${next.id}'"` : "disabled"}>Keyingi →</button></div></article>`;
}
function toggleNav() {
  if (window.matchMedia("(max-width: 980px)").matches) { sidebarEl.classList.toggle("open"); return; }
  appEl.classList.toggle("collapsed");
  localStorage.setItem("nav", appEl.classList.contains("collapsed") ? "off" : "on");
}
function enhance() {
  document.querySelectorAll("pre").forEach(pre => {
    if (pre.querySelector(".copy")) return;
    const btn = document.createElement("button");
    btn.className = "copy"; btn.type = "button"; btn.textContent = "Nusxa";
    btn.onclick = () => { navigator.clipboard.writeText(pre.innerText.replace("Nusxa","").trim()); };
    pre.appendChild(btn);
  });
  document.querySelectorAll(".quiz button").forEach(btn => { btn.onclick = () => btn.closest(".quiz").classList.toggle("open"); });
  const themeBtn = document.getElementById("themeBtn");
  if (themeBtn) themeBtn.onclick = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) { document.documentElement.removeAttribute("data-theme"); localStorage.setItem("theme","light"); }
    else { document.documentElement.setAttribute("data-theme","dark"); localStorage.setItem("theme","dark"); }
  };
  const fsBtn = document.getElementById("fsBtn");
  if (fsBtn) fsBtn.onclick = () => {
    const cur = parseFloat(getComputedStyle(document.body).fontSize);
    document.body.style.fontSize = (cur >= 20 ? 16 : cur + 2) + "px";
  };
  const navBtn = document.getElementById("navBtn");
  if (navBtn) navBtn.onclick = toggleNav;
}
function render() {
  const id = location.hash.replace("#", "");
  const lecture = LECTURES.find(l => l.id === id);
  contentEl.innerHTML = lecture ? lecturePage(lecture) : homePage();
  renderNav(searchEl.value);
  window.scrollTo(0, 0);
  enhance();
}
navEl.addEventListener("click", e => {
  const btn = e.target.closest("[data-id]");
  if (btn) location.hash = btn.dataset.id;
});
searchEl.addEventListener("input", () => renderNav(searchEl.value));
window.addEventListener("hashchange", render);
sideToggle.addEventListener("click", toggleNav);
render();
