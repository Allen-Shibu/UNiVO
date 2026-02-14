import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://opzechnwukuqfvfaytfx.supabase.co";
const supabaseKey = "sb_publishable_w87ezT-fcldEAO653BOpwQ_UvJtX51_";
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;

      initializeNavigation();
    }
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

function initializeNavigation() {
  const ThemeToggle = document.getElementById("theme-toggle");
  const ThemeToggleDark = document.getElementById("theme-toggle-dark-icon");
  const ThemeToggleLight = document.getElementById("theme-toggle-light-icon");
  const ProfileView = document.getElementById("profile-view");
  const ProfileBtn = document.getElementById("profile-btn");
  const ProfileInfo = document.getElementById("name_email");
  const LogOut = document.getElementById("log-out");
  const SidebarMob = document.getElementById("sidebar-toggle-mobile");
  const SideBar = document.getElementById("sidebar");
  const ToggleBtn = document.getElementById("sidebar-btn");
  const navTexts = document.querySelectorAll(".nav-text");
  const SidebarText = document.getElementById("sidebar_text");
  const BackDrop = document.getElementById("sidebar-backdrop");
  const Header = document.getElementById("header");
  const MobileWidth = document.getElementById("mobilelesswidth");

  if (MobileWidth && window.innerWidth < 400) {
    MobileWidth.classList.replace("gap-5", "gap-3");
  }

  if (ProfileBtn && ProfileView) {
    ProfileBtn.addEventListener("click", async (e) => {
      ProfileBtn.classList.replace("dark:text-white", "text-amber-400");

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (ProfileInfo && user) {
        ProfileInfo.innerHTML = `${user.user_metadata.display_name} <br> ${user.email}`;
      }

      if (error) alert(error);

      e.stopPropagation();
      ProfileView.classList.toggle("hidden");
    });

    // Close if the user clicks outside the dialog
    document.addEventListener("click", () => {
      ProfileView.classList.add("hidden");
      ProfileBtn.classList.replace("text-amber-400", "dark:text-white");
    });

    // Prevent closing when the user clicks inside the dialog
    ProfileView.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (LogOut) {
    LogOut.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) alert(error);
      else {
        alert("Logged Out successfully");
        window.location.href = "login.html";
      }
    });
  }

  function closeSidebar() {
    if (ProfileView) ProfileView.classList.add("hidden");
    if (SideBar) {
      SideBar.classList.remove("translate-x-0");
      SideBar.classList.add("-translate-x-full");
    }
    if (BackDrop) BackDrop.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (SidebarMob && SideBar && BackDrop) {
    SidebarMob.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = SideBar.classList.contains("-translate-x-full");

      if (isHidden) {
        BackDrop.classList.remove("hidden");
        SideBar.classList.remove("-translate-x-full");
        SideBar.classList.add("translate-x-0");
        document.body.style.overflow = "hidden";
        if (ProfileView) ProfileView.classList.add("hidden");
      } else {
        closeSidebar();
      }
    });

    BackDrop.addEventListener("click", () => {
      closeSidebar();
    });
  }

  const MainContent = document.getElementById("main");

  if (ToggleBtn && SideBar && navTexts && SidebarText && Header) {
    ToggleBtn.addEventListener("click", () => {
      const isOpen = SideBar.classList.contains("w-64");

      if (isOpen) {
        ToggleBtn.classList.add("md:-mx-8");
        SideBar.classList.remove("w-64", "px-10");
        SideBar.classList.add("w-28", "px-8");
        SidebarText.classList.add("hidden");
        Header.classList.remove("gap-9");
        Header.classList.add("justify-center");
        Header.classList.replace("md:left-64", "md:left-28");
        MainContent.classList.remove("md:ml-64");
        MainContent.classList.add("md:ml-28");

        navTexts.forEach((text) => {
          text.classList.add("hidden");
          if (text.parentElement) {
            text.parentElement.classList.add("justify-center");
          }
        });
      } else {
        ToggleBtn.classList.remove("md:-mx-8");
        SideBar.classList.remove("w-28", "px-2");
        SideBar.classList.add("w-64", "px-10");
        SidebarText.classList.remove("hidden");
        Header.classList.add("gap-9");
        Header.classList.remove("justify-center");
        Header.classList.replace("md:left-28", "md:left-64");
        MainContent.classList.add("md:ml-64");
        MainContent.classList.remove("md:ml-28");

        navTexts.forEach((text) => {
          text.classList.remove("hidden");
          if (text.parentElement) {
            text.parentElement.classList.remove("justify-center");
          }
        });
      }
    });
  }

  if (ThemeToggle && ThemeToggleDark && ThemeToggleLight) {
    if (localStorage.getItem("color-theme") === "dark") {
      document.documentElement.classList.add("dark");
      ThemeToggleLight.classList.remove("hidden");
      ThemeToggleDark.classList.add("hidden");
    } else {
      document.documentElement.classList.remove("dark");
      ThemeToggleLight.classList.add("hidden");
      ThemeToggleDark.classList.remove("hidden");
    }

    ThemeToggle.addEventListener("click", function () {
      ThemeToggleDark.classList.toggle("hidden");
      ThemeToggleLight.classList.toggle("hidden");

      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("navigation-container", "main.html");
});
