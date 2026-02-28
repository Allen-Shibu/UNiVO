import { supabase } from "/src/shared/supabaseClient.js";

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
  const NotifyView = document.getElementById("notify-view");
  const NotifyBtn = document.getElementById("notification-btn");
  const NotifySvg = document.getElementById("notify-svg");

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
        const name =
          user.user_metadata.display_name || user.user_metadata.full_name;
        ProfileInfo.innerHTML = `${name} <br> ${user.email}`;
      }

      if (error) FailNotify(error);

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
      if (error) FailNotify(error);
      else {
        PassNotify("Logged Out successfully");
        window.location.href = "/src/auth/login.html";
      }
    });
  }

  function closeSidebar() {
    if (ProfileView) ProfileView.classList.add("hidden");
    if (Notify - view) no;
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
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
        ThemeToggleDark.classList.remove("hidden");
        ThemeToggleLight.classList.add("hidden");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
        ThemeToggleDark.classList.add("hidden");
        ThemeToggleLight.classList.remove("hidden");
      }
    });
  }
  NotifyBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent the click from bubbling to document

    const isHidden = NotifyView.classList.contains("hidden");

    if (isHidden) {
      NotifyView.classList.remove("hidden");
      NotifySvg.classList.add("text-amber-400");

      setTimeout(() => {
        document.addEventListener("click", closeNotify);
      }, 0);
    }
  });

  function closeNotify() {
    NotifyView.classList.add("hidden");
    NotifySvg.classList.remove("text-amber-400");
    document.removeEventListener("click", closeNotify);
  }

  const ProfileTab = document.getElementById("profile-tab");
  const ProfilePage = document.getElementById("profile-page");
  const CloseProfile = document.getElementById("close-profile");
  const ProfileName = document.getElementById("profile-display-name");
  const ProfileEmail = document.getElementById("profile-display-email");
  const ProfilePhone = document.getElementById("profile-display-phone");
  const ResetPwd = document.getElementById("reset-password-btn");
  const DelBtn = document.getElementById("delete-account-button");

  ProfileTab.addEventListener("click", async (e) => {
    ProfilePage.classList.remove("hidden");

    if (ProfilePage) {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      const phonenumber = user.user_metadata.Phone;
      console.log(phonenumber);

      const name =
        user.user_metadata.display_name || user.user_metadata.full_name;
      ProfileName.innerHTML = `${name}`;
      ProfileEmail.innerHTML = `${user.email}`;
      ProfilePhone.innerHTML = `${phonenumber}`;

      if (error) FailNotify(error);

      ResetPwd.addEventListener("click", async (e) => {
        window.location.href = "/src/auth/get_mail.html";
      });
    }
  });

  const DeleteAcc = document.getElementById("delete-account-btn");
  DeleteAcc.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmed = await showConfirm();
    if (!confirmed) return;
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    console.log(session);
    
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/delete_user`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    const result = await response.json();
    if (response.ok) window.location.href="/src/auth/inde.html";
    else {
      FailNotify(error);
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadComponent("navigation-container", "/src/shared/main.html");
});

async function loadmess(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadmess("notification-container", "/src/shared/notifications.html");
});

let timeoutId;

export function PassNotify(message) {
  const notify = document.getElementById("fail-notification");
  const GreenNotify = document.getElementById("good-notification");
  const textElement = document.getElementById("pass-msg");
  GreenNotify.classList.remove("hidden");

  textElement.innerText = message;

  if (timeoutId) {
    notify.classList.add("hidden");
    //clear any existing timer
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    GreenNotify.classList.add("hidden");
  }, 2000);
}

export function FailNotify(message) {
  const GreenNotify = document.getElementById("good-notification");
  const notify = document.getElementById("fail-notification");
  const textElement = document.getElementById("fail-msg");
  notify.classList.remove("hidden");
  textElement.innerText = message;

  if (timeoutId) {
    GreenNotify.classList.add("hidden");
    //clear any existing timer
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    notify.classList.add("hidden");
  }, 2000);
}

document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("/src/shared/loading.html"); //fetched ../shared/loading.html and reads its context as plain text string
  const spinnerHTML = await response.text();

  const loaderDiv = document.createElement("div");
  loaderDiv.id = "page-loader";
  loaderDiv.style.cssText =
    "display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,1); justify-content:center; align-items:center;";
  loaderDiv.innerHTML = spinnerHTML; //loads the plain string to inside the div
  document.body.appendChild(loaderDiv);

  initloader();
});

function initloader() {
  const loader = document.getElementById("page-loader");

  window.addEventListener("load", () => {
    loader.style.display = "none";
  });

  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;
    if (
      link.hostname === window.location.hostname &&
      link.href &&
      !link.href.startsWith("#")
    ) {
      e.preventDefault();
      loader.style.display = "flex";
      const href = link.href;
      setTimeout(() => {
        window.location.href = href;
      }, 500);
    }
  });
}

function showConfirm() {
  return new Promise((resolve) => {
    //use to stop the waiting and send the answer as signal
    const overlay = document.createElement("div");
    overlay.innerHTML = `
      <div style="position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5)">
        <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-80 flex flex-col gap-4">
          <p class="text-lg font-bold dark:text-white text-center">Are you sure you want to delete your account?</p>
          <div class="flex justify-center gap-3">
            <button id="confirm-no"  class="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white font-semibold hover:bg-gray-300 transition">No</button>
            <button id="confirm-yes" class="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">Yes, Delete</button>
          </div>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector("#confirm-yes").onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };
    overlay.querySelector("#confirm-no").onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };
  });
}
