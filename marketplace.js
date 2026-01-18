const SideBar = document.getElementById('sidebar');
const Sidebar_Logo = document.getElementById('sidebar-logo');
const ToggleBtn = document.getElementById('sidebar-btn')
const navTexts = document.querySelectorAll(".nav-text");
const header = document.getElementById("sidebar-header");
const SidebarText = document.getElementById("sidebar_text")
const MainContent=document.getElementById('main')


ToggleBtn.addEventListener('click', () => {

    const isOpen = SideBar.classList.contains("w-64");

    if (isOpen) {
        
        SideBar.classList.remove('w-64', 'px-10')
        SideBar.classList.add('w-29', "px-9.5")
        
      MainContent.classList.remove('ml-64')
      MainContent.classList.add('ml-28')
        
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
        
        MainContent.classList.add("ml-64");
        MainContent.classList.remove("ml-28");
        
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


const WishlistBtn = document.querySelectorAll('.wishlist-btn')
const notify = document.getElementById('notification')
const Adnotify=document.getElementById('added-notification')
console.log(WishlistBtn)

let timeoutId;  

WishlistBtn.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation() // prevents open of product details page
    e.preventDefault() //prevent scrolling when clicking the button

    const card = btn.closest('.product-item') // closest() is used to find parent container from child
    
    const product = {
      image: card.querySelector("img").src,

      title: card.querySelector("p.font-bold").innerText,

      price: card.querySelector('.text-green-600').innerText,
    };

    AddtoLocalStorage(product)

    console.log('Thing worked ', product)
  })
})


function showNotification() {
      notify.classList.remove("hidden");

      if (timeoutId) {
            //clear any existing timer
      clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
      notify.classList.add("hidden");
      }, 2000);
    }

function showAdNotification() {
      Adnotify.classList.remove("hidden");

      if (timeoutId) {
        //clear any existing timer
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        Adnotify.classList.add("hidden");
      }, 2000);
    }
    



function AddtoLocalStorage(product) {
      const WishList = JSON.parse(localStorage.getItem("MyWishlist"))||[];
      console.log(WishList);

      const exists = WishList.some((item) => item.title === product.title); //.some() loops through the array and returns true if it finds a match.

      if (!exists) {
        WishList.push(product);
        localStorage.setItem("MyWishlist", JSON.stringify(WishList));
        showNotification()
        console.log("saved");

      }
      
      else {
        notify.classList.add('hidden');
        showAdNotification()
      }
      
    }


    

const WishGrid = document.querySelector('.wishlist-grid')

if (WishGrid) {
  const WishList = JSON.parse(localStorage.getItem("MyWishlist")) || [];

  if(WishList.length == 0){
    WishGrid.innerHTML = `<p class="flex text-gray-500 text-2xl ">Your wishlist is empty.....</p>`;
  }
  else {
    WishList.forEach((product, index) => {
      const card = document.createElement('div')
      
      card.innerHTML = `<div class="flex flex-row relative overflow-hidden rounded-2xl">
                    <img src="${product.image}" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300">
                    
                    <button onclick="removeFromWishlist(${index})" class="absolute top-3 right-3 bg-white p-2 rounded-full text-red-500 shadow-sm hover:bg-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                  </div>
                <div class="mt-3">
                    <p class="font-bold text-lg dark:text-white">${product.title}</p>
                    <span class="font-bold text-lg text-green-600">${product.price}</span>
                </div>`;
      
      WishGrid.appendChild(card);
    })
  }
}

window.removeFromWishlist = function (index) {
  let Wishlist = JSON.parse(localStorage.getItem("MyWishlist")) || [];

  //removes 1 item at the specific index
  Wishlist.splice(index, 1);

  // Save the new list back to storage
  localStorage.setItem("MyWishlist", JSON.stringify(Wishlist));

  // Reload the page to see the changes
  location.reload();
};