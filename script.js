const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyPK3ejT3t_DkF26D8dFWy2H1zJVvugg1E8aJeGl_DmWUorOcnyb6EtHonNO74UA69L/exec";
function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  const button = document.querySelector(".menu-dots");

  if (!menu || !button) return;

  const isOpen = menu.classList.toggle("open");
  button.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("click", (event) => {
  const menu = document.getElementById("dropdownMenu");
  const button = document.querySelector(".menu-dots");

  if (!menu || !button) return;

  if (event.target.closest(".dropdown-menu a")) {
    menu.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    return;
  }

  if (!event.target.closest(".menu-dots") && !event.target.closest(".dropdown-menu")) {
    menu.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  }
});

const revealTargets = document.querySelectorAll(
  ".hero-content > *, .section-heading, .stat-item, .feature-card, .process-item, .dashboard-card, .info-card, .track-form, .manifesto-card"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(element);
  });
}

async function handleSubmission({ formId, resultId, payload, successText, label }) {
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);

  if (!form || !result) return;

  result.innerHTML = "Submitting...";

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const responseData = await response.json();

    if (responseData.success) {
      result.innerHTML = `
        <div class="success-message">
          ${successText}<br /><br />
          ${label} ID: <strong>${responseData.id}</strong>
        </div>
      `;
      form.reset();
      return;
    }

    result.innerHTML = "❌ Something went wrong.";
    console.error(responseData.error);
  } catch (error) {
    result.innerHTML = `❌ Unable to submit the ${label.toLowerCase()}.`;
    console.error(error);
  }
}

document.getElementById("issueForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    type: "issue",
    category: document.getElementById("category").value,
    location: document.getElementById("location").value,
    description: document.getElementById("description").value
  };

  await handleSubmission({
    formId: "issueForm",
    resultId: "result",
    payload,
    successText: "✅ Issue submitted successfully!",
    label: "Issue"
  });
});

document.getElementById("ideaForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    type: "idea",
    category: document.getElementById("ideaCategory").value,
    idea: document.getElementById("idea").value
  };

  await handleSubmission({
    formId: "ideaForm",
    resultId: "ideaResult",
    payload,
    successText: "💡 Idea submitted successfully!",
    label: "Idea"
  });
});

document.getElementById("questionForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    type: "question",
    question: document.getElementById("question").value
  };

  await handleSubmission({
    formId: "questionForm",
    resultId: "questionResult",
    payload,
    successText: "❓ Question submitted successfully!",
    label: "Question"
  });
});

async function loadDashboard() {
  const statusEl = document.getElementById("dashboardStatus");

  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();

    if (data.success) {
      document.getElementById("totalIssues").textContent = data.issues;
      document.getElementById("resolvedIssues").textContent = data.resolved;
      document.getElementById("totalIdeas").textContent = data.ideas;
      document.getElementById("totalQuestions").textContent = data.questions;
      statusEl.textContent = "Updated automatically from student submissions.";
      return;
    }

    statusEl.textContent = "Unable to load dashboard.";
    console.error(data.error);
  } catch (error) {
    statusEl.textContent = "Unable to connect to dashboard.";
    console.error(error);
  }
}

loadDashboard();

document.getElementById("trackForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const issueId = document.getElementById("issueId").value.trim().toUpperCase();
  const result = document.getElementById("trackResult");

  if (!result) return;

  result.innerHTML = "🔎 Searching...";

  try {
    const response = await fetch(`${SCRIPT_URL}?id=${encodeURIComponent(issueId)}`);
    const data = await response.json();

    if (data.success && data.found) {
      const issue = data.issue;

      result.innerHTML = `
        <div class="issue-result">
          <h3>Issue ${issue.id}</h3>
          <p><strong>Category:</strong> ${issue.category}</p>
          <p><strong>Location:</strong> ${issue.location}</p>
          <p><strong>Problem:</strong> ${issue.description}</p>
          <div class="status-box"><strong>Status:</strong> ${issue.status}</div>
        </div>
      `;
      return;
    }

    result.innerHTML = `
      <div class="not-found">
        ❌ Issue ID not found.<br />Please check the ID and try again.
      </div>
    `;
  } catch (error) {
    result.innerHTML = "❌ Unable to check issue status.";
    console.error(error);
  }
});
