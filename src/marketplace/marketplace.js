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
let currentImages = [];

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
// Image Dots
// ============================

function updateImageDots(total, current) {
  const container = document.getElementById("image-indicators");
  if (!container) return;

  container.innerHTML = "";
  if (total <= 1) return;

  for (let idx = 0; idx < total; idx++) {
    const dot = document.createElement("div");
    dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-200 ${
      idx === current ? "bg-white scale-110" : "bg-white/40"
    }`;
    container.appendChild(dot);
  }
}

// ============================
// Load Products
// ============================

async function loadProducts() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase.from("products").select("*");

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

    savedIds = wishlist ? wishlist.map((w) => String(w.product_id)) : [];
  }

  products.forEach((product) => {
    const isLiked = savedIds.includes(String(product.id));

    const card = document.createElement("div");

    card.innerHTML = `
    <div class="border border-gray-400 p-5 rounded-2xl dark:bg-[#191b1f] bg-gray-100/70">

      <div class="relative overflow-hidden rounded-2xl">

        <img src="${product.image_url[0] || product.image_url}"
          class="product-image w-full md:h-64 h-50 object-cover cursor-pointer"
          data-id="${product.id}">

        <button
          class="wishlist-btn absolute top-3 right-3
          w-9 h-9 flex items-center justify-center text-lg
          rounded-full bg-black/40 backdrop-blur-sm shadow-md
          ${isLiked ? "text-red-500" : "text-white hover:text-red-400"}
          transition-colors duration-150"
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
// Wishlist Toggle (Cards)
// ============================

productGrid.addEventListener("click", async (e) => {
  const btn = e.target.closest(".wishlist-btn");
  if (!btn) return;

  e.stopPropagation();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    FailNotify();
    return;
  }

  const productId = btn.dataset.id;
  const isLiked = btn.classList.contains("text-red-500");

  if (isLiked) {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      FailNotify();
      return;
    }

    btn.classList.remove("text-red-500");
    btn.classList.add("text-white");
  } else {
    const { error } = await supabase
      .from("wishlist")
      .insert({ user_id: user.id, product_id: productId });

    if (error) {
      FailNotify();
      return;
    }

    btn.classList.remove("text-white");
    btn.classList.add("text-red-500");
  }

  PassNotify();
});

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
  currentImages = Array.isArray(data.image_url)
    ? data.image_url
    : [data.image_url];
  imageIndex = 0;

  popup.classList.remove("hidden");

  document.getElementById("productpageuploadimage").src = currentImages[0];
  document.getElementById("productname").textContent = data.title;
  document.getElementById("productprice").textContent = "₹" + data.price;
  document.getElementById("productdescription").textContent = data.description;
  document.getElementById("otherdetails").textContent = data.details;

  updateImageDots(currentImages.length, imageIndex);

  // ============================
  // MARK AS SOLD LOGIC
  // ============================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const markSoldBtn = document.getElementById("marksoldbtn");
  const wishlistBtn = document.getElementById("productpageaddtowishlistbtn");

  if (user && user.id === data.seller_id) {
    wishlistBtn.style.display = "none";
    markSoldBtn.style.display = "block";
    wishlistBtn.disabled = true;
    wishlistBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    markSoldBtn.style.display = "none";
    wishlistBtn.style.display = "block";
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

document
  .getElementById("contactsellerbutton")
  .addEventListener("click", async () => {
    const {
      data: { user },
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

document.getElementById("nextimgbtn").addEventListener("click", () => {
  if (imageIndex < currentImages.length - 1) {
    imageIndex++;
    document.getElementById("productpageuploadimage").src =
      currentImages[imageIndex];
    updateImageDots(currentImages.length, imageIndex);
  }
});

document.getElementById("previousimgbtn").addEventListener("click", () => {
  if (imageIndex > 0) {
    imageIndex--;
    document.getElementById("productpageuploadimage").src =
      currentImages[imageIndex];
    updateImageDots(currentImages.length, imageIndex);
  }
});
