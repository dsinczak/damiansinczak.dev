(() => {
  try {
    const preference = localStorage.getItem("theme-preference");
    if (preference === "light" || preference === "dark") document.documentElement.dataset.theme = preference;
  } catch {
    // Storage can be unavailable; CSS then follows the system preference.
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mobileMenu = document.querySelector(".topbar__menu");
    const themeMenu = document.querySelector(".theme-menu");
    const themeOptions = document.querySelectorAll("[data-theme-option]");
    const root = document.documentElement;

    function selectedTheme() {
      return root.dataset.theme === "light" || root.dataset.theme === "dark" ? root.dataset.theme : "system";
    }

    function updateThemeControls() {
      const selected = selectedTheme();
      themeOptions.forEach((option) => option.setAttribute("aria-pressed", String(option.dataset.themeOption === selected)));
    }

    updateThemeControls();

    themeOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const preference = option.dataset.themeOption;
        if (preference !== "light" && preference !== "dark" && preference !== "system") return;
        if (preference === "system") delete root.dataset.theme;
        else root.dataset.theme = preference;

        try {
          localStorage.setItem("theme-preference", preference);
        } catch {
          // The selected theme still applies for the current page view.
        }
        updateThemeControls();
        if (themeMenu) themeMenu.open = false;
        if (mobileMenu) mobileMenu.open = false;
      });
    });

    document.addEventListener("click", (event) => {
      if (mobileMenu?.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
      if (themeMenu?.open && !themeMenu.contains(event.target)) themeMenu.open = false;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (mobileMenu) mobileMenu.open = false;
      if (themeMenu) themeMenu.open = false;
    });
  });
})();
