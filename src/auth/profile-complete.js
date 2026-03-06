import { supabase } from "/src/shared/supabaseClient.js";
import { PassNotify, FailNotify } from "/src/shared/loader.js";

const siteUrl = window.location.origin;

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  setTimeout(() => {
    window.location.href = `${siteUrl}/src/auth/index.html`;
  }, 1000);
  FailNotify("Please use a valid College ID. Redirecting...");
} else if (!user.email.endsWith("@gectcr.ac.in")) {
  await supabase.auth.signOut();
}

const phone = document.querySelector("#phone");
const submitBtn = document.querySelector("#submit-btn");
const errorMsg = document.querySelector("#error-msg");

const iti = window.intlTelInput(phone, {
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  separateDialCode: true,
  initialCountry: "in",
  preferredCountries: ["in"],
});

const SubmitBtn = document.getElementById("submit-btn");

SubmitBtn.addEventListener("click", async (e) => {
  const phoneInput = iti.getNumber();

  e.preventDefault();
  if (phoneInput == "") errorMsg.classList.remove("hidden");
  console.log(siteUrl);
  console.log(phoneInput);

  const { error } = await supabase.auth.updateUser({
    data: {
      Phone: phoneInput,
    },
  });

  if (error) {
    FailNotify("Sign Up Failed!" + error.message);
  } else {
    PassNotify("SignIn Successfull!");
    window.location.href = `${siteUrl}/src/marketplace/market-place.html`;
  }
});
