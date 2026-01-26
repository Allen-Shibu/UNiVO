import { supabase } from "./supabaseClient.js";

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repasswordInput = document.getElementById("repassword");
const SignupBtn = document.querySelector(".registerbtn");
const LoginBtn = document.getElementById("loginbtn");
const Failnotify = document.getElementById("fail-notification");
const verifybtn = document.getElementById('verifymail');



async function signup() {
    const email = emailInput.value;
    if (!email.endsWith("@gectcr.ac.in")) {
        alert("Access Denied: You must use a valid GEC College email (@gectcr.ac.in)");
        return;
    }
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    alert("Sign Up Failed!", error.message);
  } else {
    document.getElementById("success-notification").classList.remove('hidden')
    window.location.href = "market-place.html";
  }
}

async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log("Supabase Error", error);
    FailNotification(); 
    
  } else {
    alert("Login successful");

    window.location.href ="market-place.html";
  }
}

if (SignupBtn)
  SignupBtn.addEventListener("click", (e) => {
    e.preventDefault(); //stops from refreshing the page
    signup();
  });

if (LoginBtn)
  LoginBtn.addEventListener("click", (e) => {
    e.preventDefault(); //stops from refreshing the page
    login();
  });

function FailNotification() {
  Adnotify.classList.remove("hidden");

  if (timeoutId) {
    //clear any existing timer
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    Failnotify.classList.add("hidden");
  }, 2000);
}