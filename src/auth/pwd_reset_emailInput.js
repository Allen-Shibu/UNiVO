import { supabase } from "/src/shared/supabaseClient.js";
import { PassNotify, FailNotify } from "/src/shared/loader.js";

const SubmitBtn = document.getElementById("submit-btn");
const Email = document.getElementById("email");


    const MailReq = document.getElementById("mail-req");
    Email.addEventListener("input", (event) => {
    const value = event.target.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value !== "" && !emailPattern.test(value)) {
        MailReq.classList.replace("hidden", "block");
    } else {
        MailReq.classList.replace("block", "hidden");
    }
    });


SubmitBtn.addEventListener("click", async (e) => {
    const Mail=Email.value
    e.preventDefault();
    console.log(Mail);

    const siteUrl = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(Mail, {
    redirectTo: `${siteUrl}/src/auth/reset_password.html`,
    });
    if (error) FailNotify("Failed " +""+ error.message);
    else PassNotify("Reset link sent! Check your inbox.");
});
