const SideBar = document.getElementById('sidebar');
const Sidebar_Logo = document.getElementById('sidebar-logo');
const ToggleBtn = document.getElementById('sidebar-btn')
const navTexts = document.querySelectorAll(".nav-text");
const header = document.getElementById("sidebar-header");
const SidebarText=document.getElementById("sidebar_text")

ToggleBtn.addEventListener('click', () => {
    if (SideBar.classList.contains('w-64')) {
        
        SideBar.classList.remove('w-64', 'px-10')
        SideBar.classList.add('w-24', "px-7")
        
        Sidebar_Logo.classList.add('hidden')
        SidebarText.classList.add("hidden");

        header.classList.remove('gap-16')
        header.classList.add('justify-center')

        navTexts.forEach((text) => text.classList.add("hidden"));
    }

    else {
        SideBar.classList.replace('w-24', 'px-2')
        SideBar.classList.replace('w-64', 'px-10')
        
        Sidebar_Logo.classList.remove('hidden')
        SidebarText.classList.remove("hidden");

        header.classList.add('gap-16')
        header.classList.remove('justify-center')
    }
})