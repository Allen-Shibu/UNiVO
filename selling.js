const SideBar = document.getElementById('sidebar');
const Sidebar_Logo = document.getElementById('sidebar-logo');
const ToggleBtn = document.getElementById('sidebar-btn')
const navTexts = document.querySelectorAll(".nav-text");
const header = document.getElementById("sidebar-header");
const SidebarText=document.getElementById("sidebar_text")


ToggleBtn.addEventListener('click', () => {
    const isOpen = SideBar.classList.contains("w-64");
    if (isOpen) {
        
        SideBar.classList.remove('w-64', 'px-10')
        SideBar.classList.add('w-29', "px-9.5")
        
        Sidebar_Logo.classList.add('hidden')
        SidebarText.classList.add("hidden");

        header.classList.remove('gap-16')
        header.classList.add('justify-center')

        navTexts.forEach((text) => {
            text.classList.add("hidden");
            text.parentElement.classList.add("justify-center");
        });
    }

    else {
        SideBar.classList.remove('w-28', 'px-2')
        SideBar.classList.add('w-64', 'px-10')
        
        Sidebar_Logo.classList.remove('hidden')
        SidebarText.classList.remove("hidden");

        header.classList.add('gap-16')
        header.classList.remove('justify-center')

        navTexts.forEach((text) => {
            text.classList.remove('hidden');
            text.parentElement.classList.remove("justify-center");
        });
    }
})
document.addEventListener("DOMContentLoaded", () => {
    const ThemeToggle = document.getElementById("theme-toggle");
    const ThemeToggleDark = document.getElementById("theme-toggle-dark-icon");
    const ThemeToggleLight = document.getElementById("theme-toggle-light-icon");

    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      ThemeToggleLight.classList.remove("hidden");
      ThemeToggleDark.classList.add("hidden");
    } else {
      document.documentElement.classList.remove("dark");
      ThemeToggleLight.classList.add("hidden");
      ThemeToggleDark.classList.remove("hidden");
    }

    ThemeToggle.addEventListener("click", function () {
      // toggle icons inside button
      ThemeToggleDark.classList.toggle("hidden");
      ThemeToggleLight.classList.toggle("hidden");

      // if set via local storage previously
      if (document.documentElement.classList.contains("dark")) {
        // Switch to Light
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        // Switch to Dark
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    });
})


const preview = document.getElementById('imageuploads');
const imageInput = document.getElementById('file-input');
imageInput.addEventListener('change', ()=> {
  if(imageInput.files.length <=3){
  [...imageInput.files].forEach(file=>{
    const img = document.createElement("img")
    img.src = URL.createObjectURL(file);
    img.className = "ml-3 h-50 w-full object-cover rounded-lg";
    if(preview.childElementCount<3){
      preview.appendChild(img);
    }else{
      alert('maximum upload limit reached')
    }
    })}
  else{
    alert('maximum upload limit reached');
  }})

const postbtn = document.getElementById('postbtn');
postbtn.addEventListener('change', ()=>{

})