import { supabase } from "/src/shared/supabaseClient.js";

import { PassNotify, FailNotify } from "/src/shared/loader.js";


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const SignupBtn = document.querySelector(".registerbtn");
const LoginBtn = document.getElementById("loginbtn");

async function signup() {
    const email = emailInput.value;
    if (!email.endsWith("@gectcr.ac.in")) {
        FailNotify("Access Denied: You must use a valid GEC College email (@gectcr.ac.in)");
        return;
    }
  const password = passwordInput.value;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    FailNotify("Sign Up Failed!", error.message);
  } else {
    document.getElementById("success-notification").classList.remove('hidden')
    window.location.href = "../marketplace/market-place.html";
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
    FailNotify("Invalid Login Credentials");
    
  } else {
    PassNotify("Login successful");

    const loader = document.getElementById("page-loader");
    if (loader) loader.style.display = "flex";
    setTimeout(() => {
      window.location.href ="../marketplace/market-place.html";
    }, 500);
    
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


passwordInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    window.location.href = "../marketplace/market-place.html";
  }
});


const MailReq = document.getElementById("mail-req");
emailInput.addEventListener("input", (event) => {
  const value = event.target.value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value !== "" && !emailPattern.test(value)) {
    MailReq.classList.replace("hidden", "block");
  } else {
    MailReq.classList.replace("block", "hidden");
  }
});