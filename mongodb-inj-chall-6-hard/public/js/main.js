// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Dynamic navbar behavior
const navbar = document.querySelector(".navbar");
window.onscroll = () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
};

// Toast notification system
const showNotification = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }, 100);
};

// Form validation
const validateForm = (formElement) => {
  const inputs = formElement.querySelectorAll("input[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("error");
    } else {
      input.classList.remove("error");
    }
  });

  return isValid;
};

// Loading state handler
const setLoading = (button, isLoading) => {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Loading...";
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText;
  }
};

// Speaker search functionality enhancement
let searchTimeout;
const searchSpeakers = async () => {
  const searchBtn = document.querySelector(".btn-search");
  const query = document.getElementById("speakerSearch").value;

  setLoading(searchBtn, true);

  try {
    const response = await fetch("/api/speakers/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{"name": "${query}"}`,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    displaySpeakers(data);
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    setLoading(searchBtn, false);
  }
};

// Debounced search
const debouncedSearch = (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchSpeakers();
  }, 500);
};

// Initialize tooltips
const initTooltips = () => {
  const tooltips = document.querySelectorAll("[data-tooltip]");
  tooltips.forEach((tooltip) => {
    tooltip.addEventListener("mouseenter", (e) => {
      const tip = document.createElement("div");
      tip.className = "tooltip";
      tip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tip);

      const rect = e.target.getBoundingClientRect();
      tip.style.top = `${rect.top - tip.offsetHeight - 10}px`;
      tip.style.left = `${rect.left + rect.width / 2 - tip.offsetWidth / 2}px`;
    });

    tooltip.addEventListener("mouseleave", () => {
      const tips = document.querySelectorAll(".tooltip");
      tips.forEach((tip) => tip.remove());
    });
  });
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initTooltips();
});
