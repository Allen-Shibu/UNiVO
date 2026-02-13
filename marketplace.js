import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://opzechnwukuqfvfaytfx.supabase.co';
const supabaseKey = 'sb_publishable_w87ezT-fcldEAO653BOpwQ_UvJtX51_';
const supabase = createClient(supabaseUrl, supabaseKey)



document.addEventListener("DOMContentLoaded", () => {
  const ThemeToggle = document.getElementById("theme-toggle");
  const ThemeToggleDark = document.getElementById("theme-toggle-dark-icon");
  const ThemeToggleLight = document.getElementById("theme-toggle-light-icon");
  const ProfileView = document.getElementById("profile-view");
  const ProfileBtn = document.getElementById("profile-btn");
  const ProfileInfo = document.getElementById("name_email")
  const LogOut = document.getElementById("log-out")
  const SidebarMob = document.getElementById("sidebar-toggle-mobile");
  const SideBar = document.getElementById("sidebar");
  const ToggleBtn = document.getElementById("sidebar-btn");
  const navTexts = document.querySelectorAll(".nav-text");
  const header = document.getElementById("sidebar-header");
  const SidebarText = document.getElementById("sidebar_text");
  const MainContent = document.getElementById("main");
  const BackDrop=document.getElementById("sidebar-backdrop")


  ProfileBtn.addEventListener("click", async (e) => {
    const { data: { user }, error } = await supabase.auth.getUser();
    ProfileInfo.innerHTML = `${user.user_metadata.display_name} <br> ${user.email}`;

    if (error)
      alert(error)



    e.stopPropagation();
    ProfileView.classList.toggle("hidden");
  });

  //to close if the user clicks outside the dialog
  document.addEventListener("click", () => {
    ProfileView.classList.add("hidden");
  });

  // to prevent the closing when the user clicks inside the dialog
  ProfileView.addEventListener("click", async (e) => {
    e.stopPropagation()
  })

  if(LogOut){LogOut.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) alert(error);
    else {
      alert("Logged Out successfully")
      window.location.href = "login.html";
    }


  });
  }
  


    function closeSidebar() {  //not hidden
      ProfileView.classList.add("hidden");
      SideBar.classList.remove("translate-x-0");
      SideBar.classList.add("-translate-x-full");
      BackDrop.classList.add("hidden");
      document.body.style.overflow = ""; //Re-enable Scrolling

      ProfileView.classList.remove("hidden");
    }


  SidebarMob.addEventListener("click",async (e) => {
    e.stopPropagation()
    console.log("Sidebar Worked?");
    
    const isHidden = SideBar.classList.contains("-translate-x-full");

    if (isHidden) {  //it is hidden
      BackDrop.classList.remove("hidden")
      SideBar.classList.remove("-translate-x-full");
      SideBar.classList.add("translate-x-0");
      document.body.style.overflow = "hidden"; //Prevent scrolling behind Sidebar
      ProfileView.classList.add("hidden");

    }

    else {
      closeSidebar();
    }

  })
  
  BackDrop.addEventListener("click", () => {
    closeSidebar()
  })


  if (ToggleBtn) {
    ToggleBtn.addEventListener("click", () => {
      const isOpen = SideBar.classList.contains("w-64");

      if (isOpen) {
        SideBar.classList.remove("w-64", "px-10");
        SideBar.classList.add("w-28", "px-8");

        MainContent.classList.remove("ml-64");
        MainContent.classList.add("ml-28");

        SidebarText.classList.add("hidden");

        header.classList.remove("gap-9");
        header.classList.add("justify-center");

        navTexts.forEach((text) => {
          text.classList.add("hidden");
          text.parentElement.classList.add("justify-center");
        });

      
      } else {

        SideBar.classList.remove("w-28", "px-2");
        SideBar.classList.add("w-64", "px-10");

        MainContent.classList.add("ml-64");
        MainContent.classList.remove("ml-28");

        SidebarText.classList.remove("hidden");

        header.classList.add("gap-9");
        header.classList.remove("justify-center");

        navTexts.forEach((text) => {
          text.classList.remove("hidden");
          text.parentElement.classList.remove("justify-center");
        });
      }
    });
  }

  if (
    localStorage.getItem("color-theme") === "dark" 
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
});


let timeoutId;

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

//loading products to main page\\
async function loadProducts(SearchResults=null) {
  const{data:{user}}=await supabase.auth.getUser()
  const ProductGrid = document.getElementById("product-grid");
  let products;
  let error;

  if(!ProductGrid) return

  if (SearchResults) {
    products=SearchResults
  }

  else {  //If nothing is typed (Search function)
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*");
    products = data || [];
    error = fetchError;
    
  }

  ProductGrid.innerHTML = "";

  if(products.length===0) {ProductGrid.innerHTML = "<p>No products found matching that search.</p>";
  return;}

  // add or remove products from wishlist from the main page
  let savedIds = [];
  if(user){
     const { data: wishlist } = await supabase
    .from("wishlist")
    .select("product_id")
    .eq("user_id", user.id);

    savedIds = wishlist ? wishlist.map((item) => String(item.product_id)) : [];
  }


  if (error) {
    alert(error);
  } else {
    products.forEach((product) => {
      const card = document.createElement("div");
      const isLiked = savedIds.includes(String(product.id));

      card.innerHTML = `
      <div class="flex flex-row relative overflow-hidden rounded-2xl">
          <img src="${product.image_url}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
          <button class="wishlist-btn absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500 transition-colors shadow-sm" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" ${isLiked ? 'fill="currentColor"' : 'fill="none"'} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
      </div>

        <div class="mt-3">
          <p class="font-bold text-lg dark:text-white">${product.title}</p>
          <span class="font-bold text-lg text-green-600">₹${product.price}</span>
        </div>`;

      ProductGrid.appendChild(card);
    });
  }
}
loadProducts();
const productGrid = document.getElementById("product-grid");

productGrid.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    alert("u clicked the image");
  }
});





productSearch.addEventListener("keydown", (e)=>{
  const ProductGrid = document.getElementById("product-grid");
  const noresult = document.getElementById('noresultsfound');
  const searchText = productSearch.value.toLowerCase();
  let visibility = 0;
  if(e.key=="Enter"){

    e.preventDefault();

    Array.from(ProductGrid.children).forEach(card => {
    // find the title <p> (paragraphhhh) inside this card
    const titleEl = card.querySelector("p");

    if (!titleEl) return;
    const titleText = titleEl.innerText.toLowerCase();
    console.log(titleText);

    if (titleText.includes(searchText)) {
      card.style.display = "block"; 
      visibility++;
    } else {
      card.style.display = "none";
    }
    if(visibility==0){
      noresult.style.display = "block"; 
    }else{
      noresult.style.display = "none"; 
    }
  
  });
  }});



function WishistLogic() {
  const ProductGrid = document.getElementById("product-grid");

  ProductGrid.addEventListener("click", async (e) => {
    const btn = e.target.closest(".wishlist-btn")
    if (!btn) return

    e.preventDefault()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) alert("You must be logged in to save the products")
    
    // making the heart button red after click
    const icon = btn.querySelector("svg");
    icon.style.fill = "red";
    icon.style.stroke = "red";

    const productId=btn.dataset.id

    const { error } = await supabase.from("wishlist").insert([
      {
        product_id: productId,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("Item already added to wishlist")
      
    }
    
    else {
      alert("Product added to your wishlist")
      
    }

    if (error && error.code === "23505") {
      const productID = e.target.closest(".del-btn").dataset.id;
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", productID);
          
      if (error) {
        console.error("Error deleting:", error.message);
      }
    }

  })  
}

WishistLogic();

const SearchInput = document.querySelector(".search-input");
  SearchInput.addEventListener("change", async () => {
    const search = SearchInput.value
    const { data, error } = await supabase.from('products').select("*")
      .textSearch('fts', search, {
        type: 'websearch',
        config: 'english'
      })
    if (data) loadProducts(data)
  })

WishistLogic()



