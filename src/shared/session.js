import { supabase } from "/src/shared/supabaseClient.js";

async function UpdateAuthBtn() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const AuthBtn = document.getElementById("auth-btn");
    const authContainer = document.getElementById("auth-container");

  if (!session) {
      //   AuthBtn.classList.remove("hidden");
      authContainer.innerHTML = `
            <div class="flex gap-4 items-center">
                <a href="/src/auth/login.html">
                    <button id="logout-btn" class="btn-sec">
                        Login
                    </button>
                </a>
            </div>
        `;
      
  } 
}

UpdateAuthBtn();
