
import { supabase } from "/src/shared/supabaseClient.js";

export async function UpdateAuthBtn() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    const AuthBtn = document.getElementById("auth-btn");
    const authContainer = document.getElementById("auth-container");
    const AuthBtns = document.getElementById("mobilelesswidth");


    if (!session) {
        if (AuthBtns) {
            AuthBtns.innerHTML = `
                <div class="flex gap-4 items-center">
                    <div class="dark:text-white mr-2">
                        <button id="theme-toggle" class="size-6 hover:text-yellow-500 transition cursor-pointer pt-1">
                            <svg id="theme-toggle-dark-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hidden">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                            <svg id="theme-toggle-light-icon" class="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z"
                                    fill-rule="evenodd" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>

                    <a href="/src/auth/login.html">
                        <button id="logout-btn" class="btn-primary rounded-3xl h-10 px-6 font-bold flex items-center justify-center">
                            Login
                        </button>
                    </a>
                </div >
    `;

            // Re-bind the theme toggle specifically for the logged-out state since we overwrote its HTML
            const ThemeToggle = document.getElementById("theme-toggle");
            const ThemeToggleDark = document.getElementById("theme-toggle-dark-icon");
            const ThemeToggleLight = document.getElementById("theme-toggle-light-icon");
            if (ThemeToggle && ThemeToggleDark && ThemeToggleLight) {
                if (localStorage.getItem("color-theme") === "dark") {
                    ThemeToggleLight.classList.remove("hidden");
                    ThemeToggleDark.classList.add("hidden");
                } else {
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
        }
    }
}

UpdateAuthBtn();

