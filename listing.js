import { supabase } from "./supabaseClient.js";

async function fetchMyListings() {
  const ProductGrid=document.getElementById('product-grid');
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("You must be logged in to see your listings!");
    return;
  }

  const { data: products, error } = await supabase.from("products").select("*")
    .eq("seller_id", user.id); //filtering the 'products' table
  
  if (error) {
    alert(error);
  } 
  
  // ProductGrid.innerHTML = "";
  // if (products.length === 0) {
  //   const card = document.createElement("div");
  //   card.innerHTML = `<p class="dark:text-white text-gray-500 text-lg">Nothing to see here</p>`;

  //   ProductGrid.appendChild(card);
  // }

  
  else {
    products.forEach((products) => {
      const card = document.createElement("div");

      card.innerHTML = `<div class="flex flex-row relative overflow-hidden rounded-2xl">
            <img src="${products.image_url[0]}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
            </div>
            <div class="mt-3">
                <p class="font-bold text-lg dark:text-white">${products.title}</p>
                <span class="font-bold text-lg text-green-600">${products.price}</span>
            </div>`;

      ProductGrid.appendChild(card);
    });
  }
}

fetchMyListings();
