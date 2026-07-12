/* ===================== STATE ===================== */
const STORAGE_KEY = "resumeforge_data_v1";
const LIST_KEY = "resumeforge_list_v1";

function getDefaultState() {
  return {
    template: "sage",
    ats: false,
    sectionOrder: ["experience", "education", "skills", "projects", "extras"],
    hiddenSections: [],
    personal: {
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      summary: "",
      photo: "",
    },
    education: [
      { school: "", degree: "", field: "", start: "", end: "", grade: "" },
    ],
    experience: [
      {
        company: "",
        role: "",
        start: "",
        end: "",
        current: false,
        location: "",
        bullets: "",
      },
    ],
    skills: [],
    projects: [{ name: "", link: "", tech: "", desc: "" }],
    extras: { certifications: "", languages: "", achievements: "" },
    academic: {
      publications: "",
      research: "",
      conferences: "",
      teaching: "",
      grants: "",
    },
  };
}

let state = getDefaultState();

const TEMPLATES = {
  sage: {
    label: "Sage",
    color: "#2f5d50",
    font: "'Fraunces', serif",
    body: "'Inter', sans-serif",
  },
  midnight: {
    label: "Midnight",
    color: "#1d2b4f",
    font: "'Sora', sans-serif",
    body: "'Inter', sans-serif",
  },
  clay: {
    label: "Clay",
    color: "#b5502f",
    font: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
  slate: {
    label: "Slate",
    color: "#374151",
    font: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },
  gold: {
    label: "Gold",
    color: "#8a6d1f",
    font: "'Fraunces', serif",
    body: "'Inter', sans-serif",
  },
  mono: {
    label: "Mono",
    color: "#111111",
    font: "'IBM Plex Mono', monospace",
    body: "'Inter', sans-serif",
  },
  academic: {
    label: "Academic",
    color: "#4a3728",
    font: "'Playfair Display', serif",
    body: "'Inter', sans-serif",
  },
};

const SAMPLE = {
  template: "sage",
  ats: false,
  sectionOrder: ["experience", "education", "skills", "projects", "extras"],
  hiddenSections: [],
  personal: {
    name: "Aisha Verma",
    role: "Product Designer",
    email: "aisha.verma@email.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    website: "aishaverma.design",
    linkedin: "linkedin.com/in/aishaverma",
    summary:
      "Product designer with 5+ years crafting user-centered digital experiences for fintech and healthtech products. Led design for a payments app used by 2M+ users, improving checkout completion by 34%. Passionate about accessible, research-driven design systems.",
    photo: "",
  },
  education: [
    {
      school: "National Institute of Design, Ahmedabad",
      degree: "Bachelor of Design",
      field: "Interaction Design",
      start: "2015-07",
      end: "2019-05",
      grade: "8.7 CGPA",
    },
  ],
  experience: [
    {
      company: "Finzo Technologies",
      role: "Senior Product Designer",
      start: "2022-03",
      end: "",
      current: true,
      location: "Bengaluru",
      bullets:
        "Led end-to-end design for the flagship payments app used by 2M+ monthly active users\nImproved checkout completion rate by 34% through simplified flow and micro-interactions\nBuilt and maintained a design system adopted across 4 product teams\nMentored 2 junior designers and ran weekly design critique sessions",
    },
    {
      company: "Studio Loop",
      role: "UI/UX Designer",
      start: "2019-06",
      end: "2022-02",
      current: false,
      location: "Mumbai",
      bullets:
        "Designed interfaces for 8+ client products across healthtech and edtech\nConducted user research and usability testing to inform design decisions\nCollaborated directly with engineering teams to ship pixel-perfect implementations",
    },
  ],
  skills: [
    { name: "Figma", level: 5 },
    { name: "User Research", level: 4 },
    { name: "Prototyping", level: 5 },
    { name: "Design Systems", level: 4 },
    { name: "HTML/CSS", level: 3 },
    { name: "Motion Design", level: 3 },
  ],
  projects: [
    {
      name: "PayEase Redesign",
      link: "behance.net/payease",
      tech: "Figma, Principle",
      desc: "Complete redesign of a payments app checkout flow, reducing drop-off by a third through progressive disclosure and clearer error states.",
    },
    {
      name: "HealthTrack Design System",
      link: "",
      tech: "Figma, Storybook",
      desc: "Built a cross-platform component library used across web and mobile apps, cutting design-to-dev handoff time by 40%.",
    },
  ],
  extras: {
    certifications:
      "Google UX Design Certificate (2020)\nNN/g UX Certification (2021)",
    languages: "English (Fluent), Hindi (Native), Kannada (Conversational)",
    achievements:
      "Speaker at UX India Conference 2023\nDesign mentor at ADPList",
  },
  academic: {
    publications:
      "Verma, A. & Rao, S. (2023). Trust signals in fintech onboarding flows. Journal of Human-Computer Interaction, 41(2), 118-134.\nVerma, A. (2021). Designing for financial inclusion in rural India. UX India Proceedings, 22-29.",
    research:
      "Human-centered design for financial inclusion, trust and transparency in fintech interfaces, accessible design for low-literacy users",
    conferences:
      "Invited speaker, UX India Conference, Bengaluru, 2023\nPanelist, Design for Bharat Summit, 2022",
    teaching:
      "Guest Lecturer, Interaction Design, National Institute of Design, 2022-Present",
    grants: "NID Research Fellowship, 2018-2019",
  },
};

let currentStep = 0;
const STEPS = [
  { id: "personal", label: "Personal", icon: "👤" },
  { id: "summary", label: "Summary", icon: "📝" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "⚡" },
  { id: "projects", label: "Projects", icon: "🧩" },
  { id: "extras", label: "Extras", icon: "🏆" },
  { id: "layout", label: "Layout", icon: "🧱" },
];

/* ===================== INIT ===================== */
// Deep-merges saved data ONTO a fresh default object, field by field.
// This means if a future update adds a new field (like sectionOrder, or a
// future one), anyone with old saved data still gets a safe default for it
// instead of `undefined` — which is what was causing "Cannot read
// properties of undefined" crashes.
function deepMergeDefaults(defaults, saved) {
  if (Array.isArray(defaults)) {
    return Array.isArray(saved) ? saved : defaults;
  }
  if (defaults && typeof defaults === "object") {
    const out = {};
    for (const key in defaults) {
      if (saved && typeof saved === "object" && key in saved) {
        out[key] = deepMergeDefaults(defaults[key], saved[key]);
      } else {
        out[key] = defaults[key];
      }
    }
    return out;
  }
  return saved !== undefined && saved !== null ? saved : defaults;
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state = deepMergeDefaults(getDefaultState(), saved);
    } else {
      state = getDefaultState();
    }
  } catch (e) {
    state = getDefaultState();
  }
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function launchApp(sample) {
  if (sample) {
    state = deepMergeDefaults(
      getDefaultState(),
      JSON.parse(JSON.stringify(SAMPLE)),
    );
    saveState();
  }
  document.getElementById("landing").style.display = "none";
  document.getElementById("app").classList.add("active");
  renderSteps();
  renderTemplateSwitcher();
  goStep(0);
  renderPreview();
  updateScore();
  showToast(sample ? "✨ Sample resume loaded" : "👋 Let's build your resume");
}
function goLanding() {
  document.getElementById("landing").style.display = "flex";
  document.getElementById("app").classList.remove("active");
}

/* ===================== STEP NAV ===================== */
function renderSteps() {
  const nav = document.getElementById("stepsNav");
  nav.innerHTML = STEPS.map(
    (s, i) => `
    <div class="step-chip ${
      i === currentStep ? "active"
      : isStepFilled(i) ? "done"
      : ""
    }" onclick="goStep(${i})">
      <span>${s.icon}</span> ${s.label}
    </div>`,
  ).join("");
}
function isStepFilled(i) {
  const id = STEPS[i].id;
  if (id === "personal") return !!state.personal.name;
  if (id === "summary") return !!state.personal.summary;
  if (id === "experience") return state.experience.some((e) => e.company);
  if (id === "education") return state.education.some((e) => e.school);
  if (id === "skills") return state.skills.length > 0;
  if (id === "projects") return state.projects.some((p) => p.name);
  if (id === "extras")
    return !!(
      state.extras.certifications ||
      state.extras.languages ||
      state.extras.achievements
    );
  if (id === "layout") return true;
  return false;
}
function goStep(i) {
  currentStep = i;
  renderSteps();
  renderFormStep();
  document.getElementById("prevBtn").style.visibility =
    i === 0 ? "hidden" : "visible";
  document.getElementById("nextBtn").textContent =
    i === STEPS.length - 1 ? "Finish ✓" : "Next →";
  document.getElementById("formScroll").scrollTop = 0;
}
function nextStep() {
  if (currentStep < STEPS.length - 1) goStep(currentStep + 1);
  else showToast("🎉 Your resume is ready — download it anytime");
}
function prevStep() {
  if (currentStep > 0) goStep(currentStep - 1);
}

/* ===================== FORM RENDERING ===================== */
function renderFormStep() {
  const id = STEPS[currentStep].id;
  const el = document.getElementById("formScroll");
  el.innerHTML = FORM_RENDERERS[id]();
  attachFormListeners(id);
}

function field(label, value, attrs, opt) {
  return `<div class="field-group">
    <label class="field-label">${label} ${opt ? '<span class="opt">(optional)</span>' : ""}</label>
    ${wrapMic(attrs)}
  </div>`;
}
// Wraps a single input/textarea markup string with a mic button that fills
// that same field via the Web Speech API. Only wraps text-like fields
// (skips checkboxes, month/date pickers, selects) since dictation doesn't
// make sense there.
function wrapMic(attrsHtml) {
  const m = attrsHtml.match(/data-bind="([^"]+)"/);
  const isTextLike = /<input type="(text|email|tel|url)"|<textarea/.test(
    attrsHtml,
  );
  if (!m || !isTextLike) return attrsHtml;
  const path = m[1];
  return `<div class="mic-field-wrap">${attrsHtml}<button type="button" class="mic-btn" title="Speak to fill this field" data-mic-target="${path}" onclick="startVoiceInput(this)">🎤</button></div>`;
}

const FORM_RENDERERS = {
  personal: () => `
    <h2 class="section-title">Personal details</h2>
    <p class="section-desc">This appears at the top of every template.</p>
    <div class="photo-upload">
      <div class="photo-preview" id="photoPreview">${state.personal.photo ? `<img src="${state.personal.photo}">` : "📷"}</div>
      <div class="upload-btns">
        <label class="btn-sm" style="cursor:pointer;">Upload photo<input type="file" accept="image/*" id="photoInput" style="display:none"></label>
        ${state.personal.photo ? '<button class="btn-sm danger" onclick="removePhoto()">Remove</button>' : ""}
      </div>
    </div>
    ${field("Full name", "", `<input type="text" data-bind="personal.name" placeholder="Aisha Verma" value="${esc(state.personal.name)}">`)}
    ${field("Professional title", "", `<input type="text" data-bind="personal.role" placeholder="Product Designer" value="${esc(state.personal.role)}">`)}
    <div class="field-row">
      ${field("Email", "", `<input type="email" data-bind="personal.email" placeholder="you@email.com" value="${esc(state.personal.email)}">`)}
      ${field("Phone", "", `<input type="tel" data-bind="personal.phone" placeholder="+91 98765 43210" value="${esc(state.personal.phone)}">`)}
    </div>
    <div class="field-row">
      ${field("Location", "", `<input type="text" data-bind="personal.location" placeholder="Bengaluru, India" value="${esc(state.personal.location)}">`)}
      ${field("Website / Portfolio", "", `<input type="url" data-bind="personal.website" placeholder="yourname.com" value="${esc(state.personal.website)}">`, true)}
    </div>
    ${field("LinkedIn", "", `<input type="text" data-bind="personal.linkedin" placeholder="linkedin.com/in/you" value="${esc(state.personal.linkedin)}">`, true)}
  `,
  summary: () => `
    <h2 class="section-title">Professional summary</h2>
    <p class="section-desc">2–4 sentences on who you are and what you bring. This is the first thing recruiters read.</p>
    ${field("Summary", "", `<textarea data-bind="personal.summary" rows="7" placeholder="Product designer with 5+ years crafting user-centered digital experiences...">${esc(state.personal.summary)}</textarea>`)}
  `,
  experience: () => `
    <h2 class="section-title">Work experience</h2>
    <p class="section-desc">Start with your most recent role. Use bullet points for impact.</p>
    <div id="expList">${state.experience.map((e, i) => experienceCard(e, i)).join("")}</div>
    <button class="add-btn" onclick="addExperience()">+ Add another role</button>
  `,
  education: () => `
    <h2 class="section-title">Education</h2>
    <p class="section-desc">Your academic background, most recent first.</p>
    <div id="eduList">${state.education.map((e, i) => educationCard(e, i)).join("")}</div>
    <button class="add-btn" onclick="addEducation()">+ Add another degree</button>
  `,
  skills: () => `
    <h2 class="section-title">Skills</h2>
    <p class="section-desc">Add skills one at a time — press Enter or click Add. Click the dots to set proficiency.</p>
    <div class="skill-tag-input-wrap">
      <div class="mic-field-wrap" style="flex:1;">
        <input type="text" id="skillInput" placeholder="e.g. Figma, Python, Public Speaking" style="width:100%">
        <button type="button" class="mic-btn" title="Speak a skill" data-mic-target="__skillInput" onclick="startVoiceInput(this)">🎤</button>
      </div>
      <button class="btn-sm" onclick="addSkillFromInput()">Add</button>
    </div>
    <div class="skill-tags" id="skillTags">${state.skills.map((s, i) => skillTag(s, i)).join("")}</div>
    ${state.skills.length === 0 ? '<p class="empty-hint">No skills added yet — type above to add your first one.</p>' : ""}
  `,
  projects: () => `
    <h2 class="section-title">Projects</h2>
    <p class="section-desc">Personal, academic, or freelance projects worth showing off.</p>
    <div id="projList">${state.projects.map((p, i) => projectCard(p, i)).join("")}</div>
    <button class="add-btn" onclick="addProject()">+ Add another project</button>
  `,
  extras: () => `
    <h2 class="section-title">Extras</h2>
    <p class="section-desc">Certifications, languages, and achievements — one per line.</p>
    ${field("Certifications", "", `<textarea data-bind="extras.certifications" rows="3" placeholder="Google UX Design Certificate (2020)">${esc(state.extras.certifications)}</textarea>`, true)}
    ${field("Languages", "", `<textarea data-bind="extras.languages" rows="2" placeholder="English (Fluent), Hindi (Native)">${esc(state.extras.languages)}</textarea>`, true)}
    ${field("Achievements & Awards", "", `<textarea data-bind="extras.achievements" rows="3" placeholder="Speaker at UX India Conference 2023">${esc(state.extras.achievements)}</textarea>`, true)}
    ${academicExtrasHTML()}
  `,
  layout: () => `
    <h2 class="section-title">Section order</h2>
    <p class="section-desc">Drag to reorder how sections appear on your resume. Toggle off any section to hide it without deleting the data.</p>
    <div class="reorder-list" id="reorderList">${state.sectionOrder.map((id) => reorderItem(id)).join("")}</div>
  `,
};

const SECTION_META = {
  experience: { label: "Experience", icon: "💼" },
  education: { label: "Education", icon: "🎓" },
  skills: { label: "Skills", icon: "⚡" },
  projects: { label: "Projects", icon: "🧩" },
  extras: { label: "Extras", icon: "🏆" },
};
function reorderItem(id) {
  const m = SECTION_META[id];
  const hidden = state.hiddenSections.includes(id);
  return `<div class="reorder-item" draggable="true" data-id="${id}" ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="dragDrop(event)" ondragend="dragEnd(event)">
    <span class="reorder-handle">⠿</span> ${m.icon} ${m.label}
    <span class="toggle-visible toggle-switch ${hidden ? "" : "on"}" onclick="toggleSectionVisible('${id}')"></span>
  </div>`;
}

function experienceCard(e, i) {
  return `<div class="repeat-card">
    <div class="repeat-card-head"><span class="repeat-card-title">ROLE ${i + 1}</span>${state.experience.length > 1 ? `<button class="remove-x" onclick="removeExperience(${i})">✕</button>` : ""}</div>
    ${field("Company", "", `<input type="text" data-bind="experience.${i}.company" placeholder="Finzo Technologies" value="${esc(e.company)}">`)}
    ${field("Job title", "", `<input type="text" data-bind="experience.${i}.role" placeholder="Senior Product Designer" value="${esc(e.role)}">`)}
    <div class="field-row">
      ${field("Start date", "", `<input type="month" data-bind="experience.${i}.start" value="${esc(e.start)}">`)}
      ${field("End date", "", `<input type="month" data-bind="experience.${i}.end" value="${esc(e.end)}" ${e.current ? "disabled" : ""}>`)}
    </div>
    <label style="display:flex;align-items:center;gap:8px;font-size:13px;margin:-8px 0 18px;color:var(--muted);">
      <input type="checkbox" data-bind="experience.${i}.current" ${e.current ? "checked" : ""} style="width:auto;"> Currently working here
      ${calcDuration(e.start, e.end, e.current) ? `<span class="duration-badge">${calcDuration(e.start, e.end, e.current)}</span>` : ""}
    </label>
    ${field("Location", "", `<input type="text" data-bind="experience.${i}.location" placeholder="Bengaluru" value="${esc(e.location)}">`, true)}
    ${field("Key achievements", "", `<textarea data-bind="experience.${i}.bullets" rows="4" placeholder="One achievement per line...">${esc(e.bullets)}</textarea>`)}
  </div>`;
}
function educationCard(e, i) {
  return `<div class="repeat-card">
    <div class="repeat-card-head"><span class="repeat-card-title">EDUCATION ${i + 1}</span>${state.education.length > 1 ? `<button class="remove-x" onclick="removeEducation(${i})">✕</button>` : ""}</div>
    ${field("School / University", "", `<input type="text" data-bind="education.${i}.school" placeholder="National Institute of Design" value="${esc(e.school)}">`)}
    <div class="field-row">
      ${field("Degree", "", `<input type="text" data-bind="education.${i}.degree" placeholder="Bachelor of Design" value="${esc(e.degree)}">`)}
      ${field("Field of study", "", `<input type="text" data-bind="education.${i}.field" placeholder="Interaction Design" value="${esc(e.field)}">`, true)}
    </div>
    <div class="field-row">
      ${field("Start date", "", `<input type="month" data-bind="education.${i}.start" value="${esc(e.start)}">`)}
      ${field("End date", "", `<input type="month" data-bind="education.${i}.end" value="${esc(e.end)}">`)}
    </div>
    ${field("Grade / CGPA", "", `<input type="text" data-bind="education.${i}.grade" placeholder="8.7 CGPA" value="${esc(e.grade)}">`, true)}
  </div>`;
}
function projectCard(p, i) {
  return `<div class="repeat-card">
    <div class="repeat-card-head"><span class="repeat-card-title">PROJECT ${i + 1}</span>${state.projects.length > 1 ? `<button class="remove-x" onclick="removeProject(${i})">✕</button>` : ""}</div>
    ${field("Project name", "", `<input type="text" data-bind="projects.${i}.name" placeholder="PayEase Redesign" value="${esc(p.name)}">`)}
    <div class="field-row">
      ${field("Link", "", `<input type="url" data-bind="projects.${i}.link" placeholder="github.com/you/project" value="${esc(p.link)}">`, true)}
      ${field("Tech used", "", `<input type="text" data-bind="projects.${i}.tech" placeholder="Figma, React" value="${esc(p.tech)}">`, true)}
    </div>
    ${field("Description", "", `<textarea data-bind="projects.${i}.desc" rows="3" placeholder="What it does and the impact it had...">${esc(p.desc)}</textarea>`)}
  </div>`;
}
function skillTag(s, i) {
  let dots = "";
  for (let d = 1; d <= 5; d++)
    dots += `<span class="${d <= s.level ? "on" : ""}" onclick="setSkillLevel(${i},${d})"></span>`;
  return `<div class="skill-tag">${esc(s.name)}<div class="skill-level">${dots}</div><button onclick="removeSkill(${i})">✕</button></div>`;
}

function esc(str) {
  return (str || "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

/* ===================== BIND / EVENTS ===================== */
function attachFormListeners(stepId) {
  document.querySelectorAll("[data-bind]").forEach((inp) => {
    const path = inp.getAttribute("data-bind");
    const evt =
      (
        inp.tagName === "SELECT" ||
        inp.type === "checkbox" ||
        inp.type === "month"
      ) ?
        "change"
      : "input";
    inp.addEventListener(evt, () => {
      setPath(path, inp.type === "checkbox" ? inp.checked : inp.value);
      if (path.endsWith(".current")) {
        renderFormStep();
      }
      saveState();
      renderPreview();
      renderSteps();
      updateScore();
    });
  });

  if (stepId === "personal") {
    const pi = document.getElementById("photoInput");
    if (pi) pi.addEventListener("change", handlePhotoUpload);
  }
  if (stepId === "skills") {
    const si = document.getElementById("skillInput");
    if (si)
      si.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addSkillFromInput();
        }
      });
  }
}

function setPath(path, value) {
  const parts = path.split(".");
  let obj = state;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = isFinite(parts[i]) ? parseInt(parts[i]) : parts[i];
    obj = obj[p];
  }
  const last =
    isFinite(parts[parts.length - 1]) ?
      parseInt(parts[parts.length - 1])
    : parts[parts.length - 1];
  obj[last] = value;
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) {
    showToast("⚠️ Image too large — please use one under 4MB");
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    state.personal.photo = ev.target.result;
    saveState();
    renderFormStep();
    renderPreview();
    updateScore();
  };
  reader.readAsDataURL(file);
}
function removePhoto() {
  state.personal.photo = "";
  saveState();
  renderFormStep();
  renderPreview();
  updateScore();
}

/* Experience */
function addExperience() {
  state.experience.push({
    company: "",
    role: "",
    start: "",
    end: "",
    current: false,
    location: "",
    bullets: "",
  });
  saveState();
  renderFormStep();
  renderPreview();
}
function removeExperience(i) {
  state.experience.splice(i, 1);
  saveState();
  renderFormStep();
  renderPreview();
  updateScore();
}
/* Education */
function addEducation() {
  state.education.push({
    school: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    grade: "",
  });
  saveState();
  renderFormStep();
  renderPreview();
}
function removeEducation(i) {
  state.education.splice(i, 1);
  saveState();
  renderFormStep();
  renderPreview();
  updateScore();
}
/* Projects */
function addProject() {
  state.projects.push({ name: "", link: "", tech: "", desc: "" });
  saveState();
  renderFormStep();
  renderPreview();
}
function removeProject(i) {
  state.projects.splice(i, 1);
  saveState();
  renderFormStep();
  renderPreview();
  updateScore();
}
/* Skills */
function addSkillFromInput() {
  const inp = document.getElementById("skillInput");
  const val = inp.value.trim();
  if (!val) return;
  state.skills.push({ name: val, level: 3 });
  inp.value = "";
  saveState();
  renderFormStep();
  renderPreview();
  updateScore();
  document.getElementById("skillInput").focus();
}
function removeSkill(i) {
  state.skills.splice(i, 1);
  saveState();
  renderFormStep();
  renderPreview();
  updateScore();
}
function setSkillLevel(i, lvl) {
  state.skills[i].level = lvl;
  saveState();
  renderFormStep();
  renderPreview();
}

/* ===================== SAMPLE / RESET ===================== */
function fillSample() {
  state = deepMergeDefaults(
    getDefaultState(),
    JSON.parse(JSON.stringify(SAMPLE)),
  );
  saveState();
  renderSteps();
  renderFormStep();
  renderPreview();
  updateScore();
  showToast("✨ Sample data filled in");
}
function resetAll() {
  if (!confirm("Clear all fields and start fresh?")) return;
  const keepTemplate = state.template;
  state = getDefaultState();
  state.template = keepTemplate;
  saveState();
  renderSteps();
  renderFormStep();
  renderTemplateSwitcher();
  renderPreview();
  updateScore();
  showToast("↺ Cleared — starting fresh");
}

/* ===================== TOAST ===================== */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ===================== MOBILE TABS ===================== */
function mobileTab(which) {
  document
    .getElementById("formPane")
    .classList.toggle("mshow", which === "form");
  document
    .getElementById("previewPane")
    .classList.toggle("mshow", which === "preview");
  document
    .getElementById("mtabForm")
    .classList.toggle("active", which === "form");
  document
    .getElementById("mtabPreview")
    .classList.toggle("active", which === "preview");
  // The preview pane's width is 0 while it's display:none, so re-measure
  // and re-scale the paper the moment it becomes visible again.
  if (which === "preview") requestAnimationFrame(adjustPaperScale);
}

/* ===================== ATS TOGGLE ===================== */
function toggleATS() {
  state.ats = !state.ats;
  document.getElementById("atsBtn").textContent =
    `🧩 ATS mode: ${state.ats ? "On" : "Off"}`;
  saveState();
  renderPreview();
}

/* ===================== INIT ON LOAD ===================== */
window.addEventListener("DOMContentLoaded", () => {
  loadState();
});

/* ===================== COMPLETENESS SCORE ===================== */
function updateScore() {
  let total = 0,
    filled = 0;
  const p = state.personal;
  ["name", "role", "email", "phone", "location", "summary"].forEach((k) => {
    total++;
    if (p[k]) filled++;
  });
  total++;
  if (p.photo) filled++;
  total++;
  if (state.experience.some((e) => e.company && e.bullets)) filled++;
  total++;
  if (state.education.some((e) => e.school)) filled++;
  total++;
  if (state.skills.length >= 3) filled++;
  total++;
  if (state.projects.some((pr) => pr.name)) filled++;
  const pct = Math.round((filled / total) * 100);
  document.getElementById("scoreRing").style.setProperty("--pct", pct);
  document.getElementById("scoreText").textContent = pct + "% complete";
}

/* ===================== TEMPLATE SWITCHER ===================== */
function renderTemplateSwitcher() {
  const el = document.getElementById("templateSwitcher");
  el.innerHTML = Object.entries(TEMPLATES)
    .map(
      ([key, t]) => `
    <div class="tpl-dot ${state.template === key ? "active" : ""}" style="background:${t.color}" title="${t.label}" onclick="setTemplate('${key}')">
      ${t.label[0]}
    </div>`,
    )
    .join("");
}
function setTemplate(key) {
  state.template = key;
  saveState();
  renderTemplateSwitcher();
  renderPreview();
  showToast(`🎨 Switched to ${TEMPLATES[key].label} template`);
}

/* ===================== HELPERS ===================== */
function fmtMonth(m) {
  if (!m) return "";
  const [y, mo] = m.split("-");
  const names = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return mo ? `${names[parseInt(mo) - 1]} ${y}` : y;
}
function dateRange(start, end, current) {
  const s = fmtMonth(start);
  const e = current ? "Present" : fmtMonth(end);
  if (!s && !e) return "";
  return `${s}${s && e ? " — " : ""}${e}`;
}
function linesToList(text) {
  return (text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
function hasAny() {
  return (
    state.personal.name ||
    state.personal.summary ||
    state.experience.some((e) => e.company) ||
    state.education.some((e) => e.school) ||
    state.skills.length ||
    state.projects.some((p) => p.name)
  );
}

/* ===================== PREVIEW RENDER ===================== */
function renderPreview() {
  const out = document.getElementById("resumeOutput");
  if (!hasAny()) {
    out.innerHTML = emptyState();
  } else {
    const renderer =
      TEMPLATE_RENDERERS[state.template] || TEMPLATE_RENDERERS.sage;
    out.innerHTML = renderer(state);
  }
  // Re-fit the resume paper to the screen on phones after every content change,
  // since resume height is dynamic (more experience = taller page).
  requestAnimationFrame(adjustPaperScale);
}

/* ===================== MOBILE PAPER SCALING ===================== */
// On phones the resume is rendered at its real A4-ish width (850px) so the
// template layout never breaks, then visually scaled down to fit the
// viewport. We compute the scale from the actual container width and the
// actual rendered content height (not a fixed guess), so both short and
// long resumes fit without blank space or clipping.
function adjustPaperScale() {
  const scaler = document.getElementById("paperScaler");
  const paper = document.getElementById("paper");
  if (!scaler || !paper) return;

  if (window.innerWidth > 640) {
    paper.style.transform = "";
    scaler.style.height = "";
    return;
  }

  const containerWidth = scaler.clientWidth || scaler.parentElement.clientWidth;
  const paperNaturalWidth = 850;
  const scale = Math.max(0.28, Math.min(1, containerWidth / paperNaturalWidth));

  paper.style.transform = `scale(${scale})`;
  const scaledHeight = paper.scrollHeight * scale;
  scaler.style.height = scaledHeight + "px";
}

let _resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(adjustPaperScale, 150);
});
window.addEventListener("orientationchange", () => {
  setTimeout(adjustPaperScale, 300);
});

function emptyState() {
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:600px;color:#c2bfb2;gap:14px;text-align:center;padding:40px;">
    <div style="font-size:44px;">📄</div>
    <div style="font-family:'Fraunces',serif;font-size:20px;color:#8a877a;">Your resume will appear here</div>
    <div style="font-size:13px;max-width:280px;">Start filling in your details on the left — every field shows up here instantly.</div>
  </div>`;
}

function sectionLabel(text, color) {
  return `<div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;color:${color};margin:0 0 10px;">${text}</div>`;
}

/* ---------- Shared block builders (used across templates) ---------- */
function expBlock(color) {
  return state.experience
    .filter((e) => e.company || e.role)
    .map(
      (e) => `
    <div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;">
        <div style="font-weight:700;font-size:14.5px;">${esc(e.role) || "Role"}${e.company ? ` · <span style="font-weight:600;color:${color}">${esc(e.company)}</span>` : ""}</div>
        <div style="font-size:12px;color:#7a7a7a;font-family:'IBM Plex Mono',monospace;">${dateRange(e.start, e.end, e.current)}${calcDuration(e.start, e.end, e.current) ? ` <span style="opacity:0.65;">· ${calcDuration(e.start, e.end, e.current)}</span>` : ""}</div>
      </div>
      ${e.location ? `<div style="font-size:12px;color:#9a9a9a;margin-top:1px;">${esc(e.location)}</div>` : ""}
      ${
        e.bullets ?
          `<ul style="margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.65;color:#3a3a3a;">${linesToList(
            e.bullets,
          )
            .map((b) => `<li>${esc(b)}</li>`)
            .join("")}</ul>`
        : ""
      }
    </div>
  `,
    )
    .join("");
}
function eduBlock() {
  return state.education
    .filter((e) => e.school)
    .map(
      (e) => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;">
        <div style="font-weight:700;font-size:14px;">${esc(e.school)}</div>
        <div style="font-size:12px;color:#7a7a7a;font-family:'IBM Plex Mono',monospace;">${dateRange(e.start, e.end, false)}</div>
      </div>
      <div style="font-size:13px;color:#555;">${esc(e.degree)}${e.field ? ", " + esc(e.field) : ""}${e.grade ? ` · ${esc(e.grade)}` : ""}</div>
    </div>
  `,
    )
    .join("");
}
function projBlock(color) {
  return state.projects
    .filter((p) => p.name)
    .map(
      (p) => `
    <div style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px;">
        <div style="font-weight:700;font-size:14px;">${esc(p.name)}${p.link ? ` <span style="font-weight:400;color:${color};font-size:11.5px;">(${esc(p.link)})</span>` : ""}</div>
      </div>
      ${p.tech ? `<div style="font-size:11.5px;color:#9a9a9a;font-family:'IBM Plex Mono',monospace;margin:2px 0;">${esc(p.tech)}</div>` : ""}
      ${p.desc ? `<div style="font-size:13px;color:#3a3a3a;line-height:1.6;">${esc(p.desc)}</div>` : ""}
    </div>
  `,
    )
    .join("");
}
function skillsInline(color, bg) {
  return state.skills
    .map(
      (s) =>
        `<span style="display:inline-block;background:${bg};color:${color};font-size:11.5px;font-weight:600;padding:5px 12px;border-radius:100px;margin:0 6px 6px 0;">${esc(s.name)}</span>`,
    )
    .join("");
}
function extrasBlock(color) {
  let html = "";
  if (state.extras.certifications)
    html += `<div style="margin-bottom:10px;"><div style="font-weight:700;font-size:12.5px;color:${color};margin-bottom:4px;">Certifications</div>${linesToList(
      state.extras.certifications,
    )
      .map(
        (l) => `<div style="font-size:12.5px;color:#3a3a3a;">${esc(l)}</div>`,
      )
      .join("")}</div>`;
  if (state.extras.languages)
    html += `<div style="margin-bottom:10px;"><div style="font-weight:700;font-size:12.5px;color:${color};margin-bottom:4px;">Languages</div><div style="font-size:12.5px;color:#3a3a3a;">${esc(state.extras.languages)}</div></div>`;
  if (state.extras.achievements)
    html += `<div><div style="font-weight:700;font-size:12.5px;color:${color};margin-bottom:4px;">Achievements</div>${linesToList(
      state.extras.achievements,
    )
      .map(
        (l) => `<div style="font-size:12.5px;color:#3a3a3a;">${esc(l)}</div>`,
      )
      .join("")}</div>`;
  return html;
}
function contactLine() {
  const p = state.personal;
  const items = [p.email, p.phone, p.location, p.website, p.linkedin].filter(
    Boolean,
  );
  return items.map(esc).join("  ·  ");
}
function secOn(id) {
  return !state.hiddenSections.includes(id);
}
function orderIdx(id) {
  const i = state.sectionOrder.indexOf(id);
  return i === -1 ? 99 : i;
}

/* ===================== TEMPLATE RENDERERS ===================== */
const TEMPLATE_RENDERERS = {
  /* ---- 1. SAGE: elegant serif, two-column ---- */
  sage: (s) => {
    const c = TEMPLATES.sage.color;
    return `<div style="font-family:'Inter',sans-serif;color:#222;padding:0;">
      <div style="background:${c};color:#fff;padding:40px 44px 32px;display:flex;align-items:center;gap:22px;">
        ${s.personal.photo ? `<img src="${s.personal.photo}" style="width:84px;height:84px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.4);flex-shrink:0;">` : ""}
        <div>
          <div style="font-family:'Fraunces',serif;font-size:30px;font-weight:600;">${esc(s.personal.name) || "Your Name"}</div>
          <div style="font-size:14px;opacity:0.9;margin-top:2px;letter-spacing:0.02em;">${esc(s.personal.role) || "Your Professional Title"}</div>
          <div style="font-size:11.5px;opacity:0.8;margin-top:10px;">${contactLine()}</div>
        </div>
      </div>
      <div style="padding:32px 44px 44px;">
        ${s.personal.summary ? `<div style="margin-bottom:24px;font-size:13.5px;line-height:1.7;color:#3a3a3a;border-left:3px solid ${c};padding-left:16px;">${esc(s.personal.summary)}</div>` : ""}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;">
          <div>
            ${secOn("experience") && s.experience.some((e) => e.company) ? `${sectionLabel("Experience", c)}${expBlock(c)}` : ""}
            ${secOn("projects") && s.projects.some((p) => p.name) ? `<div style="margin-top:20px">${sectionLabel("Projects", c)}${projBlock(c)}</div>` : ""}
          </div>
          <div>
            ${secOn("education") && s.education.some((e) => e.school) ? `${sectionLabel("Education", c)}${eduBlock()}` : ""}
            ${secOn("skills") && s.skills.length ? `<div style="margin-top:20px">${sectionLabel("Skills", c)}${skillsInline(c, "#e4efe9")}</div>` : ""}
            ${secOn("extras") && (s.extras.certifications || s.extras.languages || s.extras.achievements) ? `<div style="margin-top:20px">${sectionLabel("More", c)}${extrasBlock(c)}</div>` : ""}
          </div>
        </div>
      </div>
    </div>`;
  },

  /* ---- 2. MIDNIGHT: bold sidebar, navy ---- */
  midnight: (s) => {
    const c = TEMPLATES.midnight.color;
    return `<div style="font-family:'Inter',sans-serif;display:grid;grid-template-columns:220px 1fr;min-height:1100px;color:#222;">
      <div style="background:${c};color:#fff;padding:36px 26px;">
        ${s.personal.photo ? `<img src="${s.personal.photo}" style="width:96px;height:96px;border-radius:14px;object-fit:cover;margin-bottom:18px;">` : `<div style="width:96px;height:96px;border-radius:14px;background:rgba(255,255,255,0.12);margin-bottom:18px;"></div>`}
        <div style="font-family:'Sora',sans-serif;font-size:21px;font-weight:700;line-height:1.2;">${esc(s.personal.name) || "Your Name"}</div>
        <div style="font-size:12.5px;opacity:0.75;margin-top:4px;">${esc(s.personal.role) || "Your Title"}</div>
        <div style="height:1px;background:rgba(255,255,255,0.2);margin:20px 0;"></div>
        <div style="font-size:11px;line-height:2;opacity:0.85;word-break:break-word;">
          ${s.personal.email ? `✉ ${esc(s.personal.email)}<br>` : ""}
          ${s.personal.phone ? `☎ ${esc(s.personal.phone)}<br>` : ""}
          ${s.personal.location ? `📍 ${esc(s.personal.location)}<br>` : ""}
          ${s.personal.website ? `🔗 ${esc(s.personal.website)}<br>` : ""}
          ${s.personal.linkedin ? `in ${esc(s.personal.linkedin)}` : ""}
        </div>
        ${secOn("skills") && s.skills.length ? `<div style="height:1px;background:rgba(255,255,255,0.2);margin:20px 0;"></div><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:10px;opacity:0.9;">Skills</div>${s.skills.map((sk) => `<div style="font-size:12px;margin-bottom:7px;">${esc(sk.name)}<div style="height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin-top:3px;"><div style="height:100%;width:${sk.level * 20}%;background:#fff;border-radius:2px;"></div></div></div>`).join("")}` : ""}
        ${s.extras.languages ? `<div style="height:1px;background:rgba(255,255,255,0.2);margin:20px 0;"></div><div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;margin-bottom:8px;opacity:0.9;">Languages</div><div style="font-size:11.5px;opacity:0.85;line-height:1.6;">${esc(s.extras.languages)}</div>` : ""}
      </div>
      <div style="padding:36px 40px;">
        ${s.personal.summary ? `<div style="margin-bottom:22px;font-size:13.5px;line-height:1.7;color:#3a3a3a;">${esc(s.personal.summary)}</div>` : ""}
        ${secOn("experience") && s.experience.some((e) => e.company) ? `${sectionLabel("Experience", c)}${expBlock(c)}` : ""}
        ${secOn("education") && s.education.some((e) => e.school) ? `<div style="margin-top:20px">${sectionLabel("Education", c)}${eduBlock()}</div>` : ""}
        ${secOn("projects") && s.projects.some((p) => p.name) ? `<div style="margin-top:20px">${sectionLabel("Projects", c)}${projBlock(c)}</div>` : ""}
        ${secOn("extras") && (s.extras.certifications || s.extras.achievements) ? `<div style="margin-top:20px">${sectionLabel("More", c)}${extrasBlock(c)}</div>` : ""}
      </div>
    </div>`;
  },

  /* ---- 3. CLAY: warm editorial, centered header ---- */
  clay: (s) => {
    const c = TEMPLATES.clay.color;
    return `<div style="font-family:'Inter',sans-serif;color:#2a2a2a;padding:44px;">
      <div style="text-align:center;margin-bottom:28px;">
        ${s.personal.photo ? `<img src="${s.personal.photo}" style="width:88px;height:88px;border-radius:50%;object-fit:cover;margin-bottom:14px;border:3px solid ${c};">` : ""}
        <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;color:${c};">${esc(s.personal.name) || "Your Name"}</div>
        <div style="font-size:13.5px;color:#7a7a7a;letter-spacing:0.05em;margin-top:4px;text-transform:uppercase;">${esc(s.personal.role) || "Your Title"}</div>
        <div style="font-size:11.5px;color:#9a9a9a;margin-top:12px;">${contactLine()}</div>
      </div>
      <div style="height:1.5px;background:${c};width:60px;margin:0 auto 28px;"></div>
      ${s.personal.summary ? `<div style="text-align:center;max-width:560px;margin:0 auto 30px;font-size:13.5px;line-height:1.75;color:#4a4a4a;font-style:italic;">${esc(s.personal.summary)}</div>` : ""}
      ${secOn("experience") && s.experience.some((e) => e.company) ? `<div style="margin-bottom:26px">${sectionLabel("Experience", c)}${expBlock(c)}</div>` : ""}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;">
        <div>${secOn("education") && s.education.some((e) => e.school) ? `${sectionLabel("Education", c)}${eduBlock()}` : ""}</div>
        <div>${secOn("skills") && s.skills.length ? `${sectionLabel("Skills", c)}${skillsInline(c, "#f5e6de")}` : ""}</div>
      </div>
      ${secOn("projects") && s.projects.some((p) => p.name) ? `<div style="margin-top:24px">${sectionLabel("Projects", c)}${projBlock(c)}</div>` : ""}
      ${secOn("extras") && (s.extras.certifications || s.extras.languages || s.extras.achievements) ? `<div style="margin-top:24px">${sectionLabel("More", c)}${extrasBlock(c)}</div>` : ""}
    </div>`;
  },

  /* ---- 4. SLATE: clean minimal ATS-safe ---- */
  slate: (s) => {
    const c = TEMPLATES.slate.color;
    return `<div style="font-family:'Inter',sans-serif;color:#1c1c1c;padding:44px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid ${c};padding-bottom:18px;margin-bottom:24px;">
        <div>
          <div style="font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;">${esc(s.personal.name) || "Your Name"}</div>
          <div style="font-size:13.5px;color:${c};font-weight:600;margin-top:2px;">${esc(s.personal.role) || "Your Title"}</div>
        </div>
        ${!state.ats && s.personal.photo ? `<img src="${s.personal.photo}" style="width:64px;height:64px;border-radius:8px;object-fit:cover;">` : ""}
        ${state.ats ? `<div style="text-align:right;font-size:11px;color:#666;line-height:1.7;">${contactLine()}</div>` : ""}
      </div>
      ${!state.ats ? `<div style="font-size:11.5px;color:#666;margin:-14px 0 22px;">${contactLine()}</div>` : ""}
      ${s.personal.summary ? `<div style="margin-bottom:22px;font-size:13.5px;line-height:1.7;color:#3a3a3a;">${esc(s.personal.summary)}</div>` : ""}
      ${secOn("experience") && s.experience.some((e) => e.company) ? `<div style="margin-bottom:22px">${sectionLabel("Experience", c)}${expBlock(c)}</div>` : ""}
      ${secOn("education") && s.education.some((e) => e.school) ? `<div style="margin-bottom:22px">${sectionLabel("Education", c)}${eduBlock()}</div>` : ""}
      ${secOn("skills") && s.skills.length ? `<div style="margin-bottom:22px">${sectionLabel("Skills", c)}<div style="font-size:13px;color:#3a3a3a;">${s.skills.map((sk) => esc(sk.name)).join("  •  ")}</div></div>` : ""}
      ${secOn("projects") && s.projects.some((p) => p.name) ? `<div style="margin-bottom:22px">${sectionLabel("Projects", c)}${projBlock(c)}</div>` : ""}
      ${secOn("extras") && (s.extras.certifications || s.extras.languages || s.extras.achievements) ? `<div>${sectionLabel("Additional", c)}${extrasBlock(c)}</div>` : ""}
    </div>`;
  },

  /* ---- 5. GOLD: luxury, refined lines ---- */
  gold: (s) => {
    const c = TEMPLATES.gold.color;
    return `<div style="font-family:'Inter',sans-serif;color:#232323;padding:44px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="font-family:'Fraunces',serif;font-size:34px;font-weight:600;">${esc(s.personal.name) || "Your Name"}</div>
        ${s.personal.photo ? `<img src="${s.personal.photo}" style="width:78px;height:78px;border-radius:50%;object-fit:cover;">` : ""}
      </div>
      <div style="font-size:13px;color:${c};letter-spacing:0.08em;text-transform:uppercase;font-weight:600;margin-bottom:14px;">${esc(s.personal.role) || "Your Title"}</div>
      <div style="height:1px;background:linear-gradient(90deg,${c},transparent);margin-bottom:14px;"></div>
      <div style="font-size:11.5px;color:#8a8a8a;margin-bottom:24px;">${contactLine()}</div>
      ${s.personal.summary ? `<div style="margin-bottom:26px;font-size:13.5px;line-height:1.75;color:#3a3a3a;">${esc(s.personal.summary)}</div>` : ""}
      ${secOn("experience") && s.experience.some((e) => e.company) ? `<div style="margin-bottom:24px">${sectionLabel("Experience", c)}${expBlock(c)}</div>` : ""}
      <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:34px;">
        <div>${secOn("education") && s.education.some((e) => e.school) ? `${sectionLabel("Education", c)}${eduBlock()}` : ""}
          ${secOn("projects") && s.projects.some((p) => p.name) ? `<div style="margin-top:20px">${sectionLabel("Projects", c)}${projBlock(c)}</div>` : ""}
        </div>
        <div>${secOn("skills") && s.skills.length ? `${sectionLabel("Skills", c)}${skillsInline(c, "#f3ead3")}` : ""}
          ${secOn("extras") && (s.extras.certifications || s.extras.languages || s.extras.achievements) ? `<div style="margin-top:20px">${sectionLabel("More", c)}${extrasBlock(c)}</div>` : ""}
        </div>
      </div>
    </div>`;
  },

  /* ---- 6. MONO: developer / technical style ---- */
  mono: (s) => {
    const c = TEMPLATES.mono.color;
    return `<div style="font-family:'IBM Plex Mono',monospace;color:#1a1a1a;padding:40px;font-size:12.5px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:24px;font-weight:600;">${esc(s.personal.name) || "your_name"}</div>
          <div style="font-size:12.5px;color:#666;margin-top:2px;">// ${esc(s.personal.role) || "your_title"}</div>
        </div>
        ${s.personal.photo ? `<img src="${s.personal.photo}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;">` : ""}
      </div>
      <div style="font-size:11px;color:#666;margin:10px 0 20px;">${contactLine()}</div>
      ${s.personal.summary ? `<div style="margin-bottom:20px;padding:12px 14px;background:#f4f4f4;border-left:3px solid ${c};font-size:12px;line-height:1.6;">${esc(s.personal.summary)}</div>` : ""}
      ${secOn("experience") && s.experience.some((e) => e.company) ? `<div style="margin-bottom:20px"><div style="font-size:11.5px;font-weight:700;color:${c};margin-bottom:10px;">$ experience</div>${expBlock(c)}</div>` : ""}
      ${secOn("education") && s.education.some((e) => e.school) ? `<div style="margin-bottom:20px"><div style="font-size:11.5px;font-weight:700;color:${c};margin-bottom:10px;">$ education</div>${eduBlock()}</div>` : ""}
      ${secOn("skills") && s.skills.length ? `<div style="margin-bottom:20px"><div style="font-size:11.5px;font-weight:700;color:${c};margin-bottom:10px;">$ skills</div><div>${s.skills.map((sk) => `<span style="display:inline-block;background:#eee;padding:4px 9px;border-radius:4px;margin:0 6px 6px 0;font-size:11px;">${esc(sk.name)}</span>`).join("")}</div></div>` : ""}
      ${secOn("projects") && s.projects.some((p) => p.name) ? `<div style="margin-bottom:20px"><div style="font-size:11.5px;font-weight:700;color:${c};margin-bottom:10px;">$ projects</div>${projBlock(c)}</div>` : ""}
      ${secOn("extras") && (s.extras.certifications || s.extras.languages || s.extras.achievements) ? `<div><div style="font-size:11.5px;font-weight:700;color:${c};margin-bottom:10px;">$ more</div>${extrasBlock(c)}</div>` : ""}
    </div>`;
  },

  /* ---- 7. ACADEMIC: dense, formal, publication-first CV ---- */
  // Academic committees read top-to-bottom, not a 6-second scan, so this
  // trades the colourful header blocks of the other templates for a plain
  // formal document look: centered name, a thin double rule, single column,
  // and a numbered publications list — the one section no other template
  // has, and the one every academic CV is judged on first.
  academic: (s) => {
    const c = TEMPLATES.academic.color;
    const a = s.academic || {
      publications: "",
      research: "",
      conferences: "",
      teaching: "",
      grants: "",
    };
    const pubList = linesToList(a.publications);
    return `<div style="font-family:'Inter',sans-serif;color:#242018;padding:46px 50px;">
      <div style="text-align:center;margin-bottom:6px;">
        <div style="font-family:'Playfair Display',serif;font-size:27px;font-weight:700;letter-spacing:0.01em;">${esc(s.personal.name) || "Your Name"}</div>
        ${s.personal.role ? `<div style="font-size:12.5px;color:${c};margin-top:3px;font-style:italic;">${esc(s.personal.role)}</div>` : ""}
      </div>
      <div style="text-align:center;font-size:11px;color:#726a5c;margin-bottom:10px;">${contactLine()}</div>
      <div style="height:1px;background:${c};margin-bottom:2px;"></div>
      <div style="height:1px;background:${c};margin-bottom:22px;opacity:0.35;"></div>

      ${s.personal.summary ? `<div style="margin-bottom:22px;font-size:12.5px;line-height:1.75;color:#3a3428;">${esc(s.personal.summary)}</div>` : ""}

      ${
        secOn("education") && s.education.some((e) => e.school) ?
          `
        <div style="margin-bottom:22px;">
          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${c};border-bottom:1px solid ${c};padding-bottom:4px;margin-bottom:12px;">Education</div>
          ${s.education
            .filter((e) => e.school)
            .map(
              (e) => `
            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">
                <div style="font-weight:700;font-size:13px;">${esc(e.degree)}${e.field ? ", " + esc(e.field) : ""}</div>
                <div style="font-size:11px;color:#726a5c;font-family:'IBM Plex Mono',monospace;">${dateRange(e.start, e.end, false)}</div>
              </div>
              <div style="font-size:12px;font-style:italic;color:#4a4335;">${esc(e.school)}${e.grade ? " · " + esc(e.grade) : ""}</div>
            </div>
          `,
            )
            .join("")}
        </div>`
        : ""
      }

      ${
        pubList.length ?
          `
        <div style="margin-bottom:22px;">
          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${c};border-bottom:1px solid ${c};padding-bottom:4px;margin-bottom:12px;">Publications</div>
          <ol style="margin:0;padding-left:20px;">
            ${pubList.map((p) => `<li style="font-size:12px;line-height:1.65;margin-bottom:8px;color:#3a3428;">${esc(p)}</li>`).join("")}
          </ol>
        </div>`
        : ""
      }

      ${
        secOn("experience") && s.experience.some((e) => e.company) ?
          `
        <div style="margin-bottom:22px;">
          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${c};border-bottom:1px solid ${c};padding-bottom:4px;margin-bottom:12px;">Academic & Professional Experience</div>
          ${s.experience
            .filter((e) => e.company || e.role)
            .map(
              (e) => `
            <div style="margin-bottom:13px;">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;">
                <div style="font-weight:700;font-size:13px;">${esc(e.role) || "Role"}, <span style="font-style:italic;font-weight:400;">${esc(e.company)}</span></div>
                <div style="font-size:11px;color:#726a5c;font-family:'IBM Plex Mono',monospace;">${dateRange(e.start, e.end, e.current)}</div>
              </div>
              ${
                e.bullets ?
                  `<ul style="margin:6px 0 0;padding-left:18px;font-size:12px;line-height:1.6;color:#3a3428;">${linesToList(
                    e.bullets,
                  )
                    .map((b) => `<li>${esc(b)}</li>`)
                    .join("")}</ul>`
                : ""
              }
            </div>
          `,
            )
            .join("")}
        </div>`
        : ""
      }

      ${
        a.teaching ?
          `
        <div style="margin-bottom:22px;">
          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${c};border-bottom:1px solid ${c};padding-bottom:4px;margin-bottom:12px;">Teaching Experience</div>
          ${linesToList(a.teaching)
            .map(
              (t) =>
                `<div style="font-size:12px;line-height:1.6;color:#3a3428;margin-bottom:4px;">${esc(t)}</div>`,
            )
            .join("")}
        </div>`
        : ""
      }

      ${
        a.conferences ?
          `
        <div style="margin-bottom:22px;">
          <div style="font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:${c};border-bottom:1px solid ${c};padding-bottom:4px;margin-bottom:12px;">Conferences &amp; Presentations</div>
          ${linesToList(a.conferences)
            .map(
              (t) =>
                `<div style="font-size:12px;line-height:1.6;color:#3a3428;margin-bottom:4px;">${esc(t)}</div>`,
            )
            .join("")}
        </div>`
        : ""
      }

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;">
        <div>
          ${
            a.research ?
              `
            <div style="margin-bottom:18px;">
              <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${c};margin-bottom:8px;">Research Interests</div>
              <div style="font-size:12px;line-height:1.65;color:#3a3428;">${esc(a.research)}</div>
            </div>`
            : ""
          }
          ${
            a.grants ?
              `
            <div>
              <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${c};margin-bottom:8px;">Grants &amp; Funding</div>
              ${linesToList(a.grants)
                .map(
                  (t) =>
                    `<div style="font-size:12px;line-height:1.6;color:#3a3428;">${esc(t)}</div>`,
                )
                .join("")}
            </div>`
            : ""
          }
        </div>
        <div>
          ${
            secOn("skills") && s.skills.length ?
              `
            <div style="margin-bottom:18px;">
              <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${c};margin-bottom:8px;">Skills</div>
              <div style="font-size:12px;line-height:1.8;color:#3a3428;">${s.skills.map((sk) => esc(sk.name)).join(" · ")}</div>
            </div>`
            : ""
          }
          ${
            (
              secOn("extras") &&
              (s.extras.certifications ||
                s.extras.languages ||
                s.extras.achievements)
            ) ?
              `
            <div>
              <div style="font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:${c};margin-bottom:8px;">Additional</div>
              ${extrasBlock(c)}
            </div>`
            : ""
          }
        </div>
      </div>
    </div>`;
  },
};

/* ===================== PDF EXPORT ===================== */
async function downloadPDF() {
  if (!hasAny()) {
    showToast("⚠️ Fill in some details first");
    return;
  }
  const paper = document.getElementById("paper");
  const scaler = document.getElementById("paperScaler");
  showToast("📥 Preparing your PDF...");

  // On phones the paper is visually shrunk (transform: scale) to fit the
  // screen. html2canvas would otherwise capture that shrunk-down version,
  // producing a blurry PDF. Reset to full size just for the capture, then
  // restore the on-screen mobile scale afterward.
  const prevTransform = paper.style.transform;
  const prevHeight = scaler ? scaler.style.height : "";
  paper.style.transform = "";
  if (scaler) scaler.style.height = "";

  try {
    const canvas = await html2canvas(paper, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210,
      pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    const fname = (state.personal.name || "resume").trim().replace(/\s+/g, "_");
    pdf.save(`${fname}_Resume.pdf`);
    showToast("✅ Resume downloaded successfully");
  } catch (err) {
    console.error(err);
    showToast("⚠️ Something went wrong — please try again");
  } finally {
    // Restore the on-screen mobile scale exactly as it was before capture.
    paper.style.transform = prevTransform;
    if (scaler) scaler.style.height = prevHeight;
  }
}

/* ===================== MULTI-RESUME MANAGER ===================== */
function getResumeList() {
  try {
    return JSON.parse(localStorage.getItem(LIST_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveResumeList(list) {
  localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

function openManager() {
  const list = getResumeList();
  const overlay = document.createElement("div");
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(28,35,33,0.55);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;";
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;max-width:480px;width:100%;max-height:80vh;overflow-y:auto;padding:28px;font-family:'Inter',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
        <div style="font-family:'Fraunces',serif;font-size:20px;font-weight:600;">Saved resumes</div>
        <button onclick="this.closest('div[style*=fixed]').remove()" style="border:none;background:#f0efe9;width:30px;height:30px;border-radius:8px;cursor:pointer;font-size:15px;">✕</button>
      </div>
      <button class="btn-sm" style="width:100%;margin-bottom:16px;padding:11px;" onclick="saveCurrentAs()">💾 Save current as new</button>
      <div id="resumeListWrap">
        ${
          list.length === 0 ?
            '<p style="font-size:13px;color:#888;text-align:center;padding:20px 0;">No saved resumes yet. Save your current progress to manage multiple versions.</p>'
          : list
              .map(
                (r, i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border:1.5px solid #e4e1d8;border-radius:10px;margin-bottom:8px;">
            <div>
              <div style="font-weight:600;font-size:13.5px;">${esc(r.title)}</div>
              <div style="font-size:11px;color:#999;">${new Date(r.savedAt).toLocaleDateString()}</div>
            </div>
            <div style="display:flex;gap:6px;">
              <button class="btn-sm" onclick="loadResumeFromList(${i})">Open</button>
              <button class="btn-sm danger" onclick="deleteResumeFromList(${i})">Delete</button>
            </div>
          </div>
        `,
              )
              .join("")
        }
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
function saveCurrentAs() {
  const title = prompt(
    'Name this resume (e.g. "Design roles", "Frontend v2"):',
    state.personal.name ? `${state.personal.name}'s Resume` : "My Resume",
  );
  if (!title) return;
  const list = getResumeList();
  list.push({
    title,
    savedAt: Date.now(),
    data: JSON.parse(JSON.stringify(state)),
  });
  saveResumeList(list);
  document
    .querySelectorAll('div[style*="position:fixed"]')
    .forEach((el) => el.remove());
  showToast("💾 Saved as a new resume");
}
function loadResumeFromList(i) {
  const list = getResumeList();
  state = deepMergeDefaults(getDefaultState(), list[i].data);
  saveState();
  document
    .querySelectorAll('div[style*="position:fixed"]')
    .forEach((el) => el.remove());
  renderSteps();
  renderFormStep();
  renderTemplateSwitcher();
  renderPreview();
  updateScore();
  showToast(`📂 Loaded "${list[i].title}"`);
}
function deleteResumeFromList(i) {
  const list = getResumeList();
  if (!confirm(`Delete "${list[i].title}"?`)) return;
  list.splice(i, 1);
  saveResumeList(list);
  document
    .querySelectorAll('div[style*="position:fixed"]')
    .forEach((el) => el.remove());
  openManager();
}

/* ===================== DARK MODE ===================== */
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("resumeforge_dark", isDark ? "1" : "0");
  document.getElementById("darkModeBtn").textContent = isDark ? "☀️" : "🌙";
  showToast(isDark ? "🌙 Dark mode on" : "☀️ Light mode on");
}
function initDarkMode() {
  const saved = localStorage.getItem("resumeforge_dark");
  if (saved === "1") {
    document.documentElement.classList.add("dark");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "☀️";
  }
}

/* ===================== COPY RESUME AS TEXT (ATS) ===================== */
function buildPlainTextResume() {
  const p = state.personal;
  let lines = [];
  lines.push(p.name || "Your Name");
  if (p.role) lines.push(p.role);
  lines.push(
    [p.email, p.phone, p.location, p.website, p.linkedin]
      .filter(Boolean)
      .join(" | "),
  );
  lines.push("");
  if (p.summary) {
    lines.push("SUMMARY");
    lines.push(p.summary);
    lines.push("");
  }
  if (state.experience.some((e) => e.company)) {
    lines.push("EXPERIENCE");
    state.experience
      .filter((e) => e.company || e.role)
      .forEach((e) => {
        lines.push(
          `${e.role || ""} - ${e.company || ""} (${dateRange(e.start, e.end, e.current)})`,
        );
        if (e.location) lines.push(e.location);
        linesToList(e.bullets).forEach((b) => lines.push("- " + b));
        lines.push("");
      });
  }
  if (state.education.some((e) => e.school)) {
    lines.push("EDUCATION");
    state.education
      .filter((e) => e.school)
      .forEach((e) => {
        lines.push(
          `${e.degree || ""} ${e.field ? "in " + e.field : ""} - ${e.school} (${dateRange(e.start, e.end, false)})`,
        );
        if (e.grade) lines.push(e.grade);
        lines.push("");
      });
  }
  if (state.skills.length) {
    lines.push("SKILLS");
    lines.push(state.skills.map((s) => s.name).join(", "));
    lines.push("");
  }
  if (state.projects.some((pr) => pr.name)) {
    lines.push("PROJECTS");
    state.projects
      .filter((pr) => pr.name)
      .forEach((pr) => {
        lines.push(`${pr.name}${pr.link ? " - " + pr.link : ""}`);
        if (pr.tech) lines.push(pr.tech);
        if (pr.desc) lines.push(pr.desc);
        lines.push("");
      });
  }
  if (state.extras.certifications) {
    lines.push("CERTIFICATIONS");
    lines.push(state.extras.certifications);
    lines.push("");
  }
  if (state.extras.languages) {
    lines.push("LANGUAGES");
    lines.push(state.extras.languages);
    lines.push("");
  }
  if (state.extras.achievements) {
    lines.push("ACHIEVEMENTS");
    lines.push(state.extras.achievements);
  }
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
async function copyResumeText() {
  if (!hasAny()) {
    showToast("⚠️ Fill in some details first");
    return;
  }
  const text = buildPlainTextResume();
  try {
    await navigator.clipboard.writeText(text);
    showToast("📋 Plain-text resume copied — paste into any ATS form");
  } catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast("📋 Copied to clipboard");
  }
}

/* ===================== COVER LETTER GENERATOR ===================== */
function generateCoverLetter(company, roleTitle) {
  const p = state.personal;
  const topExp = state.experience.find((e) => e.company);
  const topSkills = state.skills
    .slice(0, 4)
    .map((s) => s.name)
    .join(", ");
  const role = roleTitle || p.role || "this role";
  const co = company || "your company";
  let body = `Dear Hiring Manager,\n\n`;
  body += `I'm writing to apply for ${role} at ${co}. `;
  if (p.summary) {
    body += p.summary + " ";
  }
  if (topExp) {
    body += `\n\nIn my current role as ${topExp.role || "a professional"} at ${topExp.company}, I've focused on delivering measurable results`;
    const firstBullet = linesToList(topExp.bullets)[0];
    if (firstBullet) body += ` — for example, ${firstBullet.toLowerCase()}`;
    body += `.`;
  }
  if (topSkills)
    body += `\n\nMy core strengths include ${topSkills}, which I believe align well with what you're looking for in this position.`;
  body += `\n\nI'd welcome the opportunity to discuss how my background could contribute to your team. Thank you for your time and consideration.\n\nSincerely,\n${p.name || "Your Name"}`;
  return body;
}
function openCoverLetter() {
  if (!hasAny()) {
    showToast("⚠️ Fill in some resume details first");
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <div class="modal-title">📃 Cover letter</div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <div class="field-row" style="margin-bottom:12px;">
        <input type="text" id="clCompany" placeholder="Company name (optional)">
        <input type="text" id="clRole" placeholder="Role title (optional)">
      </div>
      <textarea class="modal-textarea" id="clOutput">${esc(generateCoverLetter())}</textarea>
      <div class="modal-actions">
        <button class="btn-sm" onclick="regenCoverLetter()">🔄 Regenerate</button>
        <button class="btn-sm" onclick="copyCoverLetter()">📋 Copy text</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
function regenCoverLetter() {
  const co = document.getElementById("clCompany").value.trim();
  const role = document.getElementById("clRole").value.trim();
  document.getElementById("clOutput").value = generateCoverLetter(co, role);
}
async function copyCoverLetter() {
  const text = document.getElementById("clOutput").value;
  try {
    await navigator.clipboard.writeText(text);
    showToast("📋 Cover letter copied");
  } catch (e) {
    showToast("⚠️ Could not copy — select and copy manually");
  }
}

/* ===================== SHARE RESUME LINK ===================== */
function openShare() {
  if (!hasAny()) {
    showToast("⚠️ Fill in some resume details first");
    return;
  }
  let url = "";
  try {
    const packed = btoa(encodeURIComponent(JSON.stringify(state)));
    url = `${location.origin}${location.pathname}#data=${packed}`;
  } catch (e) {
    url = "";
  }
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <div class="modal-title">🔗 Share your resume</div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
      </div>
      <p style="font-size:13px;color:var(--muted);line-height:1.6;margin-top:0;">
        This link carries your resume data inside the URL itself — no server, no account.
        Anyone who opens it sees this exact resume in ResumeForge and can download the PDF.
        Long resumes make a long link; that's normal.
      </p>
      <textarea class="modal-textarea" style="min-height:100px;" readonly id="shareUrl">${url}</textarea>
      <div class="modal-actions">
        <button class="btn-sm" onclick="copyShareLink()">📋 Copy link</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
async function copyShareLink() {
  const text = document.getElementById("shareUrl").value;
  try {
    await navigator.clipboard.writeText(text);
    showToast("🔗 Link copied");
  } catch (e) {
    showToast("⚠️ Could not copy — select and copy manually");
  }
}
function loadFromShareLink() {
  if (location.hash.startsWith("#data=")) {
    try {
      const packed = location.hash.replace("#data=", "");
      const data = JSON.parse(decodeURIComponent(atob(packed)));
      state = deepMergeDefaults(getDefaultState(), data);
      saveState();
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

/* ===================== EXPERIENCE DURATION BADGE ===================== */
function calcDuration(start, end, current) {
  if (!start) return "";
  const [sy, sm] = start.split("-").map(Number);
  let ey, em;
  if (current || !end) {
    const now = new Date();
    ey = now.getFullYear();
    em = now.getMonth() + 1;
  } else {
    [ey, em] = end.split("-").map(Number);
  }
  let months = (ey - sy) * 12 + (em - sm);
  if (months < 0) months = 0;
  const y = Math.floor(months / 12),
    m = months % 12;
  if (y === 0 && m === 0) return "";
  let parts = [];
  if (y > 0) parts.push(`${y} yr${y > 1 ? "s" : ""}`);
  if (m > 0) parts.push(`${m} mo${m > 1 ? "s" : ""}`);
  return parts.join(" ");
}

/* ===================== KEYBOARD SHORTCUTS ===================== */
document.addEventListener("keydown", (e) => {
  const appActive = document.getElementById("app").classList.contains("active");
  if (!appActive) return;
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    saveState();
    showToast("💾 Progress saved");
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "p") {
    e.preventDefault();
    downloadPDF();
  }
});

/* ===================== INIT OVERRIDE ===================== */
const _origLaunchApp = launchApp;
window.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  if (loadFromShareLink()) {
    launchApp();
    showToast("🔗 Loaded resume from shared link");
  }
});

/* ===================== SECTION REORDER (drag & drop) ===================== */
let _dragId = null;
function dragStart(e) {
  _dragId = e.currentTarget.getAttribute("data-id");
  e.currentTarget.classList.add("dragging");
  e.dataTransfer.effectAllowed = "move";
}
function dragOver(e) {
  e.preventDefault();
  const item = e.currentTarget;
  document
    .querySelectorAll(".reorder-item")
    .forEach((el) => el.classList.remove("drag-over"));
  if (item.getAttribute("data-id") !== _dragId) item.classList.add("drag-over");
}
function dragDrop(e) {
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute("data-id");
  if (!_dragId || targetId === _dragId) return;
  const order = state.sectionOrder;
  const fromIdx = order.indexOf(_dragId);
  const toIdx = order.indexOf(targetId);
  order.splice(fromIdx, 1);
  order.splice(toIdx, 0, _dragId);
  saveState();
  renderFormStep();
  renderPreview();
}
function dragEnd(e) {
  document.querySelectorAll(".reorder-item").forEach((el) => {
    el.classList.remove("dragging");
    el.classList.remove("drag-over");
  });
  _dragId = null;
}
function toggleSectionVisible(id) {
  const i = state.hiddenSections.indexOf(id);
  if (i === -1) state.hiddenSections.push(id);
  else state.hiddenSections.splice(i, 1);
  saveState();
  renderFormStep();
  renderPreview();
}

/* ===================== VOICE INPUT (Web Speech API) ===================== */
// Fully client-side dictation — no server, no API key. Works in Chrome/Edge/
// Safari (desktop & mobile). Falls back gracefully with a toast if the
// browser doesn't support it (e.g. Firefox).
let _recognition = null;
let _micActiveBtn = null;
let voiceLang = localStorage.getItem("resumeforge_voice_lang") || "en-IN";

function getSpeechAPI() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function startVoiceInput(btn) {
  const SpeechAPI = getSpeechAPI();
  if (!SpeechAPI) {
    showToast("⚠️ Voice input isn't supported in this browser — try Chrome");
    return;
  }

  // Tapping the mic again while it's listening stops it.
  if (_recognition && _micActiveBtn === btn) {
    _recognition.stop();
    return;
  }
  // If a different field's mic was listening, stop that one first.
  if (_recognition) {
    _recognition.stop();
  }

  const target = btn.getAttribute("data-mic-target");
  _recognition = new SpeechAPI();
  _recognition.lang = voiceLang;
  _recognition.interimResults = false;
  _recognition.maxAlternatives = 1;
  _micActiveBtn = btn;
  btn.classList.add("listening");
  btn.textContent = "⏺";

  _recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.trim();
    if (!transcript) return;
    applyVoiceTranscript(target, transcript);
  };
  _recognition.onerror = (e) => {
    if (e.error === "no-speech") {
      showToast("🎤 Didn't catch that — try again");
    } else if (e.error === "not-allowed" || e.error === "permission-denied") {
      showToast(
        "⚠️ Microphone permission blocked — allow it in browser settings",
      );
    } else {
      showToast("⚠️ Voice input error — please try again");
    }
  };
  _recognition.onend = () => {
    btn.classList.remove("listening");
    btn.textContent = "🎤";
    _recognition = null;
    _micActiveBtn = null;
  };
  try {
    _recognition.start();
    showToast("🎤 Listening... speak now");
  } catch (e) {
    showToast("⚠️ Could not start microphone");
  }
}

function applyVoiceTranscript(target, transcript) {
  // Special case: the free-standing "add a skill" input isn't part of the
  // bound state object, so we fill the DOM input directly instead of setPath.
  if (target === "__skillInput") {
    const inp = document.getElementById("skillInput");
    if (inp) {
      inp.value = transcript;
      inp.focus();
    }
    showToast('🎤 Heard: "' + transcript + '" — tap Add');
    return;
  }

  // For long-form fields (summary, bullets, descriptions) append with a
  // newline/space instead of overwriting, so multiple dictation passes build
  // up naturally. For short fields (name, email, etc.) just replace.
  const isLongField =
    /summary|bullets|desc|certifications|languages|achievements/.test(target);
  const parts = target.split(".");
  let obj = state;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = isFinite(parts[i]) ? parseInt(parts[i]) : parts[i];
    obj = obj[p];
  }
  const lastKey =
    isFinite(parts[parts.length - 1]) ?
      parseInt(parts[parts.length - 1])
    : parts[parts.length - 1];
  const existing = obj[lastKey] || "";

  if (isLongField && existing) {
    obj[lastKey] =
      existing + (target.includes("bullets") ? "\n" : " ") + transcript;
  } else {
    obj[lastKey] = transcript;
  }

  saveState();
  renderFormStep(); // re-render so the input reflects the new value
  renderPreview();
  renderSteps();
  updateScore();
  showToast("🎤 Field filled from voice");
}

function toggleVoiceLang() {
  voiceLang = voiceLang === "en-IN" ? "hi-IN" : "en-IN";
  localStorage.setItem("resumeforge_voice_lang", voiceLang);
  showToast(
    voiceLang === "hi-IN" ?
      "🎤 Voice input set to Hindi"
    : "🎤 Voice input set to English",
  );
}

/* ===================== RECRUITER SCAN SIMULATION ===================== */
// Simulates the well-documented "6-second resume scan" recruiters do.
// It overlays a moving attention heatmap on the live preview in the order
// research shows recruiters actually look (name -> title -> most recent
// role -> dates -> skills), then gives a plain checklist of what a scanner
// would and wouldn't have caught in that window.
function openRecruiterScan() {
  if (!hasAny()) {
    showToast("⚠️ Fill in some resume details first");
    return;
  }
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-box scan-modal-box">
      <div class="modal-head">
        <div class="modal-title">👁️ Recruiter scan simulation</div>
        <button class="modal-close" onclick="stopScanAndClose(this)">✕</button>
      </div>
      <p class="scan-intro">Recruiters spend about <strong>6 seconds</strong> on a first pass. This replays that scan on your resume — watch where the "eyes" land, then see what did and didn't get noticed in that window.</p>
      <div class="scan-timer" id="scanTimer">6.0s</div>
      <div class="scan-progress-track"><div class="scan-progress-fill" id="scanProgress"></div></div>
      <div class="scan-stage">
        <div class="scan-paper-wrap" id="scanPaperWrap">
          <div class="paper" id="scanPaper" style="min-height:auto;"></div>
        </div>
      </div>
      <div class="scan-summary" id="scanSummary" style="display:none;"></div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay)
      stopScanAndClose(overlay.querySelector(".modal-close"));
  });

  // Render the resume fresh into the scan modal (uses the same template renderer).
  const renderer =
    TEMPLATE_RENDERERS[state.template] || TEMPLATE_RENDERERS.sage;
  document.getElementById("scanPaper").innerHTML = renderer(state);

  runRecruiterScan();
}
function stopScanAndClose(closeBtn) {
  clearInterval(_scanInterval);
  _scanInterval = null;
  closeBtn.closest(".modal-overlay").remove();
}

let _scanInterval = null;
function runRecruiterScan() {
  const wrap = document.getElementById("scanPaperWrap");
  const paper = document.getElementById("scanPaper");
  const timerEl = document.getElementById("scanTimer");
  const progressEl = document.getElementById("scanProgress");
  if (!wrap || !paper) return;

  const paperRect = paper.getBoundingClientRect();
  const scale = paperRect.height / paper.scrollHeight; // in case anything scaled it
  const h = paper.scrollHeight;

  // Attention zones as % of resume height, roughly matching real eye-tracking
  // studies: name/header first, then most recent job title, then skills.
  const zones = [
    { top: 0.0, height: 0.1, left: "5%", width: "55%" }, // name/header
    { top: 0.1, height: 0.06, left: "5%", width: "40%" }, // title/contact
    { top: 0.18, height: 0.1, left: "5%", width: "90%" }, // most recent role
    { top: 0.4, height: 0.1, left: "5%", width: "70%" }, // dates / next role
    { top: 0.65, height: 0.1, left: "5%", width: "60%" }, // skills
  ];
  zones.forEach((z, i) => {
    const el = document.createElement("div");
    el.className = "scan-zone";
    el.id = "scanZone" + i;
    el.style.top = z.top * 100 + "%";
    el.style.height = z.height * 100 + "%";
    el.style.left = z.left;
    el.style.width = z.width;
    wrap.appendChild(el);
  });

  const totalMs = 6000;
  const stepMs = 100;
  let elapsed = 0;
  const zoneCount = zones.length;
  const perZoneMs = totalMs / zoneCount;

  clearInterval(_scanInterval);
  _scanInterval = setInterval(() => {
    elapsed += stepMs;
    const remaining = Math.max(0, (totalMs - elapsed) / 1000).toFixed(1);
    timerEl.textContent = remaining + "s";
    progressEl.style.width = Math.min(100, (elapsed / totalMs) * 100) + "%";

    const activeZoneIdx = Math.min(
      zoneCount - 1,
      Math.floor(elapsed / perZoneMs),
    );
    zones.forEach((z, i) => {
      const el = document.getElementById("scanZone" + i);
      if (el) el.classList.toggle("on", i === activeZoneIdx);
    });

    if (elapsed >= totalMs) {
      clearInterval(_scanInterval);
      zones.forEach((z, i) => {
        const el = document.getElementById("scanZone" + i);
        if (el) el.classList.remove("on");
      });
      showScanSummary();
    }
  }, stepMs);
}

function showScanSummary() {
  const summary = document.getElementById("scanSummary");
  if (!summary) return;
  const checks = buildScanChecklist();
  summary.style.display = "block";
  summary.innerHTML = `
    <div style="font-family:'Fraunces',serif;font-size:17px;font-weight:600;margin-bottom:6px;">What a 6-second scan caught</div>
    ${checks
      .map(
        (c) => `
      <div class="scan-row">
        <span>${c.label}</span>
        <span class="scan-badge ${c.status}">${c.badgeText}</span>
      </div>
    `,
      )
      .join("")}
    <div style="text-align:center;margin-top:16px;">
      <button class="btn-sm" onclick="runRecruiterScan(); document.getElementById('scanSummary').style.display='none';">🔄 Replay scan</button>
    </div>
  `;
}
function buildScanChecklist() {
  const p = state.personal;
  const topExp = state.experience.find((e) => e.company);
  const checks = [];
  checks.push({
    label: "Name is clear at the top",
    status: p.name ? "good" : "bad",
    badgeText: p.name ? "Caught" : "Missing",
  });
  checks.push({
    label: "Job title / headline visible early",
    status: p.role ? "good" : "warn",
    badgeText: p.role ? "Caught" : "Add one",
  });
  checks.push({
    label: "Most recent role stands out",
    status: topExp && topExp.role ? "good" : "bad",
    badgeText: topExp && topExp.role ? "Caught" : "Missing",
  });
  const hasMetric = topExp && /\d/.test(topExp.bullets || "");
  checks.push({
    label: "A number/metric in top bullet (grabs attention)",
    status: hasMetric ? "good" : "warn",
    badgeText: hasMetric ? "Found" : "None found",
  });
  checks.push({
    label: "Skills visible without scrolling far",
    status: state.skills.length >= 3 ? "good" : "warn",
    badgeText: state.skills.length >= 3 ? "Caught" : "Add more",
  });
  const longBullets = state.experience.some((e) =>
    linesToList(e.bullets).some((b) => b.split(" ").length > 28),
  );
  checks.push({
    label: "Bullet points are scan-friendly length",
    status: longBullets ? "warn" : "good",
    badgeText: longBullets ? "Too long" : "Good",
  });
  return checks;
}

/* ===================== ACADEMIC CV FORM EXTRAS ===================== */
// Academic CVs need publications and research fields that a normal resume
// doesn't. Rather than force every user through these fields, they only
// appear in the Extras step when the Academic template is selected, and the
// data lives in state.academic so switching back to a regular template
// never loses it.
function academicExtrasHTML() {
  if (state.template !== "academic") return "";
  const a = state.academic;
  return `
    <div style="height:1px;background:var(--line);margin:22px 0;"></div>
    <h3 style="font-family:'Fraunces',serif;font-size:16px;font-weight:600;margin:0 0 4px;">Academic details</h3>
    <p class="section-desc">Shown only in the Academic CV template.</p>
    ${field("Publications", "", `<textarea data-bind="academic.publications" rows="4" placeholder="Author, A. (2023). Title of paper. Journal Name, Vol(Issue), pages.\\nOne citation per line">${esc(a.publications)}</textarea>`, true)}
    ${field("Research interests", "", `<textarea data-bind="academic.research" rows="3" placeholder="Machine learning fairness, natural language processing, ...">${esc(a.research)}</textarea>`, true)}
    ${field("Conferences & presentations", "", `<textarea data-bind="academic.conferences" rows="3" placeholder="Presented at XYZ Conference, 2023\\nOne per line">${esc(a.conferences)}</textarea>`, true)}
    ${field("Teaching experience", "", `<textarea data-bind="academic.teaching" rows="3" placeholder="Teaching Assistant, Course Name, Semester">${esc(a.teaching)}</textarea>`, true)}
    ${field("Grants & funding", "", `<textarea data-bind="academic.grants" rows="2" placeholder="Grant name, funding body, year">${esc(a.grants)}</textarea>`, true)}
  `;
}
