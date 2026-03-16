import { supabase } from "/src/shared/supabaseClient.js";

let timeoutId;

const GreenNotify = document.getElementById("good-notification");
const notify = document.getElementById("fail-notification");

const productGrid = document.getElementById("product-grid");
const popup = document.getElementById("popupwindow");
const pop = document.getElementById("productdetails");

let clickedProductId = null;
let clickedProductTitle = "";
let imageIndex = 0;


// ============================
// Notifications
// ============================

function PassNotify() {
  GreenNotify.classList.remove("hidden");

  if (timeoutId) {
    notify.classList.add("hidden");
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
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    notify.classList.add("hidden");
  }, 2000);
}


// ============================
// Load Products
// ============================

async function loadProducts() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    FailNotify();
    return;
  }

  productGrid.innerHTML = "";

  let savedIds = [];

  if (user) {
    const { data: wishlist } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", user.id);

    savedIds = wishlist ? wishlist.map(w => String(w.product_id)) : [];
  }

  products.forEach(product => {

    const isLiked = savedIds.includes(String(product.id));

    const card = document.createElement("div");

    card.innerHTML = `
    <div class="border border-gray-400 p-5 rounded-2xl dark:bg-[#191b1f] bg-gray-100/70">

      <div class="relative overflow-hidden rounded-2xl">

        <img src="${product.image_url[0] || product.image_url}"
        class="product-image w-full md:h-64 h-50 object-cover cursor-pointer"
        data-id="${product.id}">

        <button class="wishlist-btn absolute top-3 right-3 p-2 rounded-full
        ${isLiked ? "text-red-500" : "text-gray-400"}"
        data-id="${product.id}">

        ❤

        </button>

      </div>

      <div class="mt-3">
        <p class="font-bold text-lg dark:text-white">${product.title}</p>
        <span class="font-bold text-lg text-green-600">₹${product.price}</span>
      </div>

    </div>
    `;

    productGrid.appendChild(card);

  });

}

loadProducts();


// ============================
// Product Click (OPEN POPUP)
// ============================

productGrid.addEventListener("click", async (e) => {

  const img = e.target.closest(".product-image");
  if (!img) return;

  const productId = img.dataset.id;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) return;

  clickedProductId = data.id;
  clickedProductTitle = data.title;

  popup.classList.remove("hidden");

  document.getElementById("productpageuploadimage").src = data.image_url[0] || data.image_url;

  document.getElementById("productname").textContent = data.title;
  document.getElementById("productprice").textContent = "₹" + data.price;
  document.getElementById("productdescription").textContent = data.description;
  document.getElementById("otherdetails").textContent = data.details;

  imageIndex = 0;

  // ============================
  // MARK AS SOLD LOGIC
  // ============================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const markSoldBtn = document.getElementById("marksoldbtn");
  const wishlistBtn = document.getElementById("productpageaddtowishlistbtn");
  // console.log(user.id);
  // console.log(data.seller_id);
  if (user && user.id === data.seller_id) {
    document.getElementById("productpageaddtowishlistbtn").style.display = "none";
    markSoldBtn.style.display = "block";

    wishlistBtn.disabled = true;
    wishlistBtn.classList.add("opacity-50", "cursor-not-allowed");

  } else {

    markSoldBtn.style.display = "none";
    document.getElementById("productpageaddtowishlistbtn").style.display = "block";

    wishlistBtn.disabled = false;
    wishlistBtn.classList.remove("opacity-50", "cursor-not-allowed");

  }

});


// ============================
// MARK PRODUCT AS SOLD
// ============================

document.getElementById("marksoldbtn").addEventListener("click", async () => {

  if (!clickedProductId) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", clickedProductId);

  if (error) {
    FailNotify();
    return;
  }

  PassNotify();

  popup.classList.add("hidden");

  loadProducts();

});


// ============================
// CLOSE POPUP
// ============================

popup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

pop.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") popup.classList.add("hidden");
});


// ============================
// CONTACT SELLER
// ============================

document.getElementById("contactsellerbutton").addEventListener("click", async () => {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    FailNotify();
    return;
  }

  const { data } = await supabase
    .from("profiles")
    .select("phone")
    .eq("email", user.email)
    .single();

  const phone = data.phone;

  const msg = "Interested in buying this product";

  window.location.href =
    "https://api.whatsapp.com/send?phone=" +
    phone +
    "&text=" +
    encodeURIComponent(msg);

});


// ============================
// IMAGE NAVIGATION
// ============================

document.getElementById("nextimgbtn").addEventListener("click", async () => {

  const { data } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", clickedProductId)
    .single();

  const images = data.image_url;

  if (imageIndex < images.length - 1) {
    imageIndex++;
  }

  document.getElementById("productpageuploadimage").src = images[imageIndex];

});


document.getElementById("previousimgbtn").addEventListener("click", async () => {

  const { data } = await supabase
    .from("products")
    .select("image_url")
    .eq("id", clickedProductId)
    .single();

  const images = data.image_url;

  if (imageIndex > 0) {
    imageIndex--;
  }

  document.getElementById("productpageuploadimage").src = images[imageIndex];

});