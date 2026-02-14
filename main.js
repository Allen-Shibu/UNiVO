import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://opzechnwukuqfvfaytfx.supabase.co";
const supabaseKey = "sb_publishable_w87ezT-fcldEAO653BOpwQ_UvJtX51_";
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {
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
  const MainContent = document.getElementById("main");
  const BackDrop = document.getElementById("sidebar-backdrop");
  const Header = document.getElementById("header");
  const MobileWidth = document.getElementById("mobilelesswidth");

  if (window.innerWidth < 400) {
    MobileWidth.classList.replace("gap-5", "gap-3");
  }

  ProfileBtn.addEventListener("click", async (e) => {
    ProfileBtn.classList.replace("dark:text-white", "text-amber-400");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    ProfileInfo.innerHTML = `${user.user_metadata.display_name} <br> ${user.email}`;

    if (error) alert(error);

    e.stopPropagation();
    ProfileView.classList.toggle("hidden");
  });

  //to close if the user clicks outside the dialog
  document.addEventListener("click", () => {
    ProfileView.classList.add("hidden");
    ProfileBtn.classList.replace("text-amber-400", "dark:text-white");
  });

  // to prevent the closing when the user clicks inside the dialog
  ProfileView.addEventListener("click", async (e) => {
    e.stopPropagation();
  });

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
    //not hidden
    ProfileView.classList.add("hidden");
    SideBar.classList.remove("translate-x-0");
    SideBar.classList.add("-translate-x-full");
    BackDrop.classList.add("hidden");
    document.body.style.overflow = ""; //Re-enable Scrolling

    ProfileView.classList.remove("hidden");
  }

  SidebarMob.addEventListener("click", async (e) => {
    e.stopPropagation();
    console.log("Sidebar Worked?");

    const isHidden = SideBar.classList.contains("-translate-x-full");

    if (isHidden) {
      //it is hidden
      BackDrop.classList.remove("hidden");
      SideBar.classList.remove("-translate-x-full");
      SideBar.classList.add("translate-x-0");
      document.body.style.overflow = "hidden"; //Prevent scrolling behind Sidebar
      ProfileView.classList.add("hidden");
    } else {
      closeSidebar();
    }
  });

  BackDrop.addEventListener("click", () => {
    closeSidebar();
  });

  if (ToggleBtn) {
    ToggleBtn.addEventListener("click", () => {
      const isOpen = SideBar.classList.contains("w-64", "md:left-64");

      if (isOpen) {
        console.log("Taskbar closing");

        ToggleBtn.classList.add("md:-mx-8");

        SideBar.classList.remove("w-64", "px-10");
        SideBar.classList.add("w-28", "px-8");

        MainContent.classList.remove("md:ml-64");
        MainContent.classList.add("ml-28");

        SidebarText.classList.add("hidden");

        Header.classList.remove("gap-9");
        Header.classList.add("justify-center");
        Header.classList.replace("md:left-64", "md:left-28");

        navTexts.forEach((text) => {
          text.classList.add("hidden");
          text.parentElement.classList.add("justify-center");
        });
      } else {
        ToggleBtn.classList.remove("md:-mx-8");

        SideBar.classList.remove("w-28", "px-2");
        SideBar.classList.add("w-64", "px-10");

        MainContent.classList.add("md:ml-64");
        MainContent.classList.remove("ml-28");

        SidebarText.classList.remove("hidden");

        Header.classList.add("gap-9");
        Header.classList.remove("justify-center");
        Header.classList.replace("md:left-28", "md:left-64");

        navTexts.forEach((text) => {
          text.classList.remove("hidden");
          text.parentElement.classList.remove("justify-center");
        });
      }
    });
  }

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
    // toggle icons inside button
    ThemeToggleDark.classList.toggle("hidden");
    ThemeToggleLight.classList.toggle("hidden");

    // if set via local storage previously
    if (document.documentElement.classList.contains("dark")) {
      // Switch to Light
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      // Switch to Dark
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  });
});

let timeoutId;
const GreenNotify = document.getElementById("good-notification");
const notify = document.getElementById("fail-notification");

function PassNotify() {
  GreenNotify.classList.remove("hidden");

  if (timeoutId) {
    notify.classList.add("hidden");
    //clear any existing timer
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    GreenNotify.classList.add("hidden");
  }, 2000);
}

function FailNotify() {
  notify.classList.remove("hidden");

  if (timeoutId) {
    GreenNotify.classList.add("hidden");
    //clear any existing timer
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    notify.classList.add("hidden");
  }, 2000);
}

const productSearch = document.getElementById("search_input");

if (productSearch) {
  productSearch.addEventListener("keydown", (e) => {
    const ProductGrid = document.getElementById("product-grid");
    const noresult = document.getElementById("noresultsfound");
    const searchText = productSearch.value.toLowerCase();
    let visibility = 0;
    if (e.key == "Enter") {
      e.preventDefault();

      Array.from(ProductGrid.children).forEach((card) => {
        // find the title <p> (paragraphhhh) inside this card
        const titleEl = card.querySelector("p");

        if (!titleEl) return;
        const titleText = titleEl.innerText.toLowerCase();
        console.log(titleText);

        if (titleText.includes(searchText)) {
          card.style.display = "block";
          visibility++;
        } else {
          card.style.display = "none";
        }
        if (visibility == 0) {
          noresult.style.display = "block";
        } else {
          noresult.style.display = "none";
        }
      });
    }
  });
}

const SearchInput = document.querySelector(".search-input");
if (SearchInput) {
  SearchInput.addEventListener("change", async () => {
    const search = SearchInput.value;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .textSearch("fts", search, {
        type: "websearch",
        config: "english",
      });
    if (data) loadProducts(data);
  });
}