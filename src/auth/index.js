import { supabase } from "/src/shared/supabaseClient.js";

import { PassNotify, FailNotify } from "/src/shared/loader.js";

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const repasswordInput = document.getElementById("repassword");
const SignupBtn = document.querySelector(".registerbtn");
const LoginBtn = document.getElementById("loginbtn");
const phoneInput=document.getElementById('phone')
const Failnotify = document.getElementById("fail-notification");
const GBtn=document.getElementById('GSign')



async function signup() {
  const name = nameInput.value;
  const email = emailInput.value;
    if (!email.endsWith("@gectcr.ac.in")) {
        FailNotify("Access Denied: You must use a valid GEC College email (@gectcr.ac.in)");
        return;
    }
  const phone = iti.getNumber();
  if (!iti.isValidNumber()) {
    FailNotify("Please enter a valid phone number for your country.");
    return;
  }
  const password = passwordInput.value;
  const siteUrl = window.location.origin;
      console.log(siteUrl);

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: `${siteUrl}/../auth/login.html`,
      data: {
        display_name: name,
        Phone: phone,
      },
    },
  });

  if (error) {
    FailNotify("Sign Up Failed!"  +error.message);
  } else {
    
    PassNotify(
      "Verification email sent! Please check your inbox to activate your account.",
      
    );
    
    nameInput.value = ""
    repasswordInput.value=""
    emailInput.value = "";
    passwordInput.value = "";
    phoneInput.value = "";
  }
}

GBtn.addEventListener('click',async()=> {
  const siteUrl = window.location.origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${siteUrl}/../marketplace/market-place.html`,
    },
  });

  if(error) FailNotify("Sign in Failed "+error)
})



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
    window.location.href="../marketplace/market-place.html"

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

const MailReq=document.getElementById('mail-req')
emailInput.addEventListener('input', (event) => {
  const value = event.target.value;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value !== "" && !emailPattern.test(value)) {
    MailReq.classList.replace('hidden','block');
  } else {
    MailReq.classList.replace('block', 'hidden');
  }
})

const PwdEye = document.querySelectorAll('.pwd-eye')
PwdEye.forEach((eyeBtn) => {
  eyeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const wrapper = eyeBtn.closest(".input-wrapper");
    const input = wrapper.querySelector("input");
    const ShowPwd = wrapper.querySelector('.show-pwd') 
    const HidePwd = wrapper.querySelector('.hide-pwd')
  
    if (input.type==='password') {
    
      input.type = 'text'
      if(HidePwd)HidePwd.classList.replace('block','hidden')

      if(ShowPwd)ShowPwd.classList.replace("hidden",'block');
    }

    else {
      input.type = 'password'
      if(HidePwd)HidePwd.classList.replace("hidden",'block');
    
      if(ShowPwd)ShowPwd.classList.replace("block",'hidden');
    
    }
  })
})

const matchPassword = document.getElementById("match");
repasswordInput.addEventListener("input", (event) => {
  const value = event.target.value;

  if (value.length && value != passwordInput.value) {
    matchPassword.classList.remove("hidden");
  } else {
    matchPassword.classList.add("hidden");
  }
});

const updateRequirement = (id, isValid) => {
  const requirement = document.getElementById(id);
  const icon=requirement.querySelector('.icon')
  if (isValid) {
    requirement.classList.replace("text-red-500", "text-green-600");  
    icon.textContent = "✓";
  }
  else {
    requirement.classList.replace("text-green-600", "text-red-500");   
    icon.textContent = "✕";
  }
}

passwordInput.addEventListener("input", (event) => {
  const PwdReq=document.getElementById('pwd-req')
  const value = event.target.value;

  if (value.length === 0) PwdReq.classList.add('hidden')
  
  else {
    PwdReq.classList.remove("hidden"); 
  }
  
  updateRequirement("length", value.length >= 8);
  updateRequirement("lowercase", /[a-z]/.test(value));
  updateRequirement("uppercase", /[A-Z]/.test(value));
  updateRequirement("number", /\d/.test(value));
  updateRequirement("characters", /[#.?!@$%^&*-]/.test(value));
});
