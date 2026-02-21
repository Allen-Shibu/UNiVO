import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://opzechnwukuqfvfaytfx.supabase.co";
const supabaseKey = "sb_publishable_w87ezT-fcldEAO653BOpwQ_UvJtX51_";
const supabase = createClient(supabaseUrl, supabaseKey);


let timeoutId;
  const GreenNotify = document.getElementById("good-notification");
  const notify = document.getElementById("fail-notification");

function PassNotify() {
  GreenNotify.classList.remove("hidden");

  if (timeoutId) {
    notify.classList.add("hidden");
    //clear any existing timer
    clearTimeout(timeoutId);
  }

    timeoutId = setTimeout(() => {
      GreenNotify.classList.add("hidden");
    }, 2000);
  
}

function FailNotify() {
  notify.classList.remove("hidden");
  

  if (timeoutId) {
    GreenNotify.classList.add("hidden");
    //clear any existing timer
    clearTimeout(timeoutId);
  }

    timeoutId = setTimeout(() => {
      notify.classList.add("hidden");
    }, 2000);

}

//loading products to main page\\
async function loadProducts(SearchResults = null) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const ProductGrid = document.getElementById("product-grid");
  let products;
  let error;

  if (!ProductGrid) return;

  if (SearchResults) {
    products = SearchResults;
  } else {
    //If nothing is typed (Search function)
    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*");
    products = data || [];
    error = fetchError;
  }

  ProductGrid.innerHTML = "";

  if (products.length === 0) {
    ProductGrid.innerHTML = "<p>No products found matching that search.</p>";
    return;
  }

  // add or remove products from wishlist from the main page
  let savedIds = [];
  if (user) {
    const { data: wishlist } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id);

    savedIds = wishlist ? wishlist.map((item) => String(item.product_id)) : [];
  }

  if (error) {
    FailNotify(error.message);
  } else {
    products.forEach((product) => {
      const card = document.createElement("div");
      const isLiked = savedIds.includes(String(product.id));

      card.innerHTML = `
      <div class="border border-gray-900 p-5 rounded-2xl bg-[#191b1f] transition-all duration-3000" id="productbox">
      <div class="flex flex-row relative overflow-hidden rounded-2xl">
          <img src="${product.image_url}" class="w-full md:h-64 h-50 object-cover hover:scale-102 transition-transform duration-300">
          <button class="wishlist-btn cursor-pointer absolute top-3 right-3 bg-white/30 backdrop-blur-sm p-2 rounded-full ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500 transition-colors shadow-sm" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" ${isLiked ? 'fill="currentColor"' : 'fill="none"'} viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 pointer-events-none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>
      </div>

        <div class="mt-3">
          <p class="font-bold text-lg dark:text-white">${product.title}</p>
          <span class="font-bold text-lg text-yellow-400">₹${product.price}</span>
        </div></div>`;

      ProductGrid.appendChild(card);

    })}};

loadProducts();


const productGrid = document.getElementById("product-grid");
const popup = document.getElementById("popupwindow");
const pop = document.getElementById('productdetails');

productGrid.addEventListener("click", async (e) => {
  if (e.target.tagName === "IMG") {
    console.log(e.target)

    document.getElementById("productpageuploadimage").src = e.target.src;

    popup.classList.remove("hidden");
    const {data, error} = await supabase
    .from("products")
    .select("*")
    .contains("image_url", [e.target.src])
    .single()

    document.getElementById("productname").textContent = data.title;
    document.getElementById('productprice').textContent = "₹"+data.price;
    document.getElementById("productdescription").textContent = data.description;
  }
});


// contacting the seller
document.getElementById("contactsellerbutton").addEventListener("click", async (e)=>{
  const { data, error } = await supabase
    .from('profiles')
    .select('phone')
    .eq('email', '25b1161.allen@gectcr.ac.in')
    .single()

  const phonenumber = data.phone;
  var message = "hello this is a msg from UniVO! whatsapp msging works :D";
  var url = "https://api.whatsapp.com/send?phone=" + phonenumber + "&text=" + encodeURIComponent(message);
  window.open(url, "_blank");
})


popup.addEventListener("click", ()=>{
  popup.classList.add("hidden");
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    popup.classList.add("hidden");
  }
});


pop.addEventListener("click", (e)=>{
  e.stopPropagation();
})

const productSearch = document.getElementById("search_input");


// FIXED WISHLIST LOGIC
function WishlistLogic() {
  const ProductGrid = document.getElementById("product-grid");

  ProductGrid.addEventListener("click", async (e) => {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      FailNotify("You must be logged in to save products");
      return;
    }

    const productId = btn.dataset.id;
    const icon = btn.querySelector("svg");

    const { data: existing } = await supabase
      .from("wishlist")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("product_id", productId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error removing from wishlist:", error);
        FailNotify("Failed to remove from wishlist");
      } else {

        icon.setAttribute("fill", "none");
        btn.classList.remove("text-red-500");
        btn.classList.add("text-gray-400");
        FailNotify(); 
      }
    } else {

      const { error } = await supabase.from("wishlist").insert([
        {
          product_id: productId,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error("Error adding to wishlist:", error);
        FailNotify("Failed to add to wishlist");
      } else {
        icon.setAttribute("fill", "currentColor");
        btn.classList.remove("text-gray-400");
        btn.classList.add("text-red-500");
        PassNotify();
      }
    }
  });
}

WishlistLogic();


