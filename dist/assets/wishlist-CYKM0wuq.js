import{s as e,F as s}from"./loader-BNZq2rkl.js";/* empty css                    */import"./session--oNH02Qd.js";async function n(){const o=document.getElementById("product-grid"),{data:{user:d}}=await e.auth.getUser();d||s("You must be logged in to view your wishlist");const{data:c,error:i}=await e.from("wishlist").select("product_id");if(i){s("Error fetching wishlist:",i.message);return}const u=c.map(l=>l.product_id),{data:r,error:m}=await e.from("products").select("*").in("id",u);if(!r||r.length===0){o.innerHTML='<p class="dark:text-white text-gray-500 text-lg">Nothing to see here</p>';return}m?s(errormessage):(o.innerHTML=r.map(t=>`
        <div class="group listing-card flex flex-col relative overflow-hidden rounded-2xl">
        <div class="flex flex-col relative overflow-hidden rounded-2xl">
            <img src="${t.image_url[0]||t.image_url}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
            <button class="del-btn  absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:text-red-500 transition-colors shadow-sm" data-id="${t.id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>

        <div class="mt-3">
          <p class="font-bold text-lg dark:text-white">${t.title}</p>
          <span class="font-bold text-lg text-green-600">₹${t.price}</span>
        </div>
        </div>`).join(""),document.querySelectorAll(".del-btn")[0].addEventListener("click",async t=>{const g=t.target.closest(".del-btn").dataset.id,{error:a}=await e.from("wishlist").delete().eq("product_id",g);a?console.error("Error deleting:",a.message):n()}))}n();
