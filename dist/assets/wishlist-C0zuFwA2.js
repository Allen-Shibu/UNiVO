import{s as e}from"./supabaseClient-CvA8JclF.js";/* empty css                     */import"./session-B18mxFlL.js";async function l(){const a=document.getElementById("product-grid"),{data:{user:n}}=await e.auth.getUser();n||alert("You must be logged in to view your wishlist");const{data:d,error:r}=await e.from("wishlist").select("product_id");if(r){alert("Error fetching wishlist:",r.message);return}const c=d.map(o=>o.product_id),{data:m,error:s}=await e.from("products").select("*").in("id",c);s?alert(s):(a.innerHTML=m.map(t=>`
        <div class="flex flex-col relative overflow-hidden rounded-2xl">
            <img src="${t.image_url}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
            <button class="del-btn absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:text-red-500 transition-colors shadow-sm" data-id="${t.id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>

        <div class="mt-3">
          <p class="font-bold text-lg dark:text-white">${t.title}</p>
          <span class="font-bold text-lg text-green-600">₹${t.price}</span>
        </div>`).join(""),document.querySelectorAll(".del-btn")[0].addEventListener("click",async t=>{const u=t.target.closest(".del-btn").dataset.id,{error:i}=await e.from("wishlist").delete().eq("product_id",u);i?console.error("Error deleting:",i.message):l()}))}l();
