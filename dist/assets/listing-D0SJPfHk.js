import{s as o}from"./supabaseClient-CvA8JclF.js";/* empty css                     */import"./session-B18mxFlL.js";async function a(){const i=document.getElementById("product-grid"),{data:{user:e}}=await o.auth.getUser();if(!e){alert("You must be logged in to see your listings!");return}const{data:l,error:r}=await o.from("products").select("*").eq("seller_id",e.id);r?alert(r):l.forEach(t=>{const s=document.createElement("div");s.innerHTML=`<div class="flex flex-row relative overflow-hidden rounded-2xl">
            <img src="${t.image_url[0]}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300">
                <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:text-red-500 transition-colors">
                 <svg data-id="${t.id}" class="wishlist-btn size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                </div>
            </div>
            <div class="mt-3">
                <p class="font-bold text-lg dark:text-white">${t.title}</p>
                <span class="font-bold text-lg text-green-600">${t.price}</span>
            </div>`,i.appendChild(s)})}a();
