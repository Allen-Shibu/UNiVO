import { supabase } from "./supabaseClient.js";
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repasswordInput = document.getElementById("repassword");
const SignupBtn = document.querySelector(".registerbtn");
const LoginBtn = document.getElementById("loginbtn");
const phoneInput=document.getElementById('phone')
const Failnotify = document.getElementById("fail-notification");



async function signup() {
  const name = nameInput.value;
  const email = emailInput.value;
    if (!email.endsWith("@gectcr.ac.in")) {
        alert("Access Denied: You must use a valid GEC College email (@gectcr.ac.in)");
        return;
    }
  const phone = iti.getNumber();
  if (!iti.isValidNumber()) {
    alert("Please enter a valid phone number for your country.");
    return;
  }
  const password = passwordInput.value;
  const siteUrl = window.location.origin;
      console.log(siteUrl);

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${siteUrl}/login.html`,
      data: {
        display_name: name,
        Phone: phone,
      },
    },
  });

  if (error) {
    alert("Sign Up Failed!" + error.message);
  } else {
    
    alert(
      "Verification email sent! Please check your inbox to activate your account.",
      
    );
    
    nameInput.value = ""
    repasswordInput.value=""
    emailInput.value = "";
    passwordInput.value = "";
    phoneInput.value = "";
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
    console.log("Login Failed!"+error.message);
    FailNotification(); 
    
  } else {
    window.location.href="market-place.html"

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

const iti = window.intlTelInput(phoneInput, {
  initialCountry: "in", // Default to India
  separateDialCode: true, // Shows the +91 outside the input box
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js", // For validation
});


// function FailNotification() {
//   Adnotify.classList.remove("hidden");

//   if (timeoutId) {
//     //clear any existing timer
//     clearTimeout(timeoutId);
//   }

//   timeoutId = setTimeout(() => {
//     Failnotify.classList.add("hidden");
//   }, 2000);
// }