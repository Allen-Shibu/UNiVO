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

const ThemeToggle=document.getElementById('')