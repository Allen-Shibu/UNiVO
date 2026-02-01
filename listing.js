import { supabase } from "./supabaseClient.js";

async function fetchMyListings() {
  const ProductGrid = document.getElementById('product-grid');
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
  
//Delete button
  if (products.length === 0||!products) {
    ProductGrid.innerHTML = `<p class="dark:text-white text-gray-500 text-lg">Nothing to see here</p>`;
    return
  }




  ProductGrid.innerHTML = products
    .map(
      (product) => `
      <div class="listing-card flex flex-col relative overflow-hidden rounded-2xl">
          <div class="group flex flex-col relative overflow-hidden rounded-2xl">
          <img src="${product.image_url[0]}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
          <a href="sellingpage.html?id=${product.id}" class=" opacity-0 group-hover:opacity-100 absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:text-blue-500 transition-colors shadow-sm" data-id="${product.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </a>
              
              <button class="del-btn opacity-0 group-hover:opacity-100 absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:text-red-500 transition-colors shadow-sm" data-id="${product.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
              </button>
          </div>

          <div class="mt-3">
            <p class="font-bold text-lg dark:text-white">${product.title}</p>
            <span class="font-bold text-lg text-green-600">₹${product.price}</span>
      </div>
       </div>`,
    )
    .join("");

}

  const ProductGrid = document.getElementById("product-grid");
  ProductGrid.addEventListener("click", async (e) => {
    const btn=e.target.closest(".del-btn")
    const productID = btn.dataset.id;
    e.preventDefault()
    if (! confirm("Are you sure you want to delete this")) {  
      return;
    }
    const { error:DelError } = await supabase
      .from("products")
      .delete("*")
      .eq("id", productID);
    
    if (DelError) alert(DelError)
    
    else btn.closest(".listing-card").remove(); //Not added in whishlist logic
    


  })
fetchMyListings();