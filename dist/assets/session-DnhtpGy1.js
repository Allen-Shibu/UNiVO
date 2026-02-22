import{s as e}from"./supabaseClient-BnuRKQFQ.js";async function a(){const{data:{session:t}}=await e.auth.getSession();document.getElementById("auth-btn");const n=document.getElementById("auth-container");t||(n.innerHTML=`
            <div class="flex gap-4 items-center">
                <a href="/src/auth/login.html">
                    <button id="logout-btn" class="btn-sec">
                        Login
                    </button>
                </a>
            </div>
        `)}a();
