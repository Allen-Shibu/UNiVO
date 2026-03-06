import { supabase } from "/src/shared/supabaseClient.js";
import { PassNotify, FailNotify } from "/src/shared/loader.js";


const resetBtn = document.getElementById("reset-btn");
const passwordInput = document.getElementById('password');
const repasswordInput = document.getElementById('repassword');
const matchError = document.getElementById('match-error');
repasswordInput.addEventListener('input', () => {
        const mismatch = repasswordInput.value && repasswordInput.value !== passwordInput.value;
        matchError.classList.toggle('hidden', !mismatch);
        if (mismatch) {
            repasswordInput.classList.add('border-red-500/50');
        } else {
            repasswordInput.classList.remove('border-red-500/50');           }
        });
const updateRequirement = (id, isValid) => {
  const requirement = document.getElementById(id);
  const icon = requirement.querySelector(".icon");
  if (isValid) {
    requirement.classList.replace("text-red-500", "text-green-600");
    icon.textContent = "✓";
  } else {
    requirement.classList.replace("text-green-600", "text-red-500");
    icon.textContent = "✕";
  }
};

passwordInput.addEventListener("input", (event) => {
  const PwdReq = document.getElementById("pwd-req");
  const value = event.target.value;

  if (value.length === 0) PwdReq.classList.add("hidden");
  else {
    PwdReq.classList.remove("hidden");
  }

  updateRequirement("length", value.length >= 8);
  updateRequirement("lowercase", /[a-z]/.test(value));
  updateRequirement("uppercase", /[A-Z]/.test(value));
  updateRequirement("number", /\d/.test(value));
  updateRequirement("characters", /[#.?!@$%^&*-]/.test(value));
});

resetBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const Pwd = document.getElementById("password").value;
    const VerifyPwd = document.getElementById("repassword").value;
    const siteUrl = window.location.origin;

    
  const { error } = await supabase.auth.updateUser({
    password: Pwd,
  });

    if (error) FailNotify(error.message);
    else window.location.href = `${siteUrl}/src/marketplace/market-place.html`;
});
