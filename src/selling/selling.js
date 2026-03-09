import { supabase } from "/src/shared/supabaseClient.js";
import { PassNotify, FailNotify } from "/src/shared/loader.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const preview = document.getElementById("imageuploads");
const imageInput = document.getElementById("file-input");

async function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;

        if (img.width > MAX_WIDTH) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.7,
        );
      };
    };
  });
}

imageInput.addEventListener("change", () => {
  [...imageInput.files].forEach((file) => {
    const box = document.createElement("div");
    box.className = "relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm aspect-square bg-gray-50 dark:bg-[#0B0C0F] flex items-center justify-center";
    const img = document.createElement("img");
    const delbtn = document.createElement("button");
    delbtn.className = "absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md";
    delbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

    delbtn.addEventListener("click", () => {
      box.remove();
      imageInput.value = "";
    });

    img.src = URL.createObjectURL(file);
    img.className = "w-full h-full object-cover";
    box.appendChild(img);
    box.appendChild(delbtn);
    if (preview.childElementCount < 4) {
      preview.appendChild(box);
    }
  });
});

let existingUrl = [];

const postbtn = document.getElementById("post-btn");
postbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const Title = document.getElementById("title").value;
  const Descp = document.getElementById("description").value;
  const Price = document.getElementById("price").value;
  const Details = document.getElementById("details").value;
  const Nos = document.getElementById("quantity").value;

  const files = imageInput.files;
  if ((!Title || !Descp || !Price || files.length == 0) && !productId) {
    FailNotify("Please fill in Name, Price, and select an Image!");
    return;
  }

  try {
    let finalUrls = [];
    if (files.length > 0) {
      PassNotify("Optimizing images...");
      for (const file of files) {
        const compressedBlob = await compressImage(file);
        const filename = `${Date.now()}-${file.name.split(".")[0]}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("Uploaded_Images")
          .upload(filename, file, {
            contentType: "image/jpeg",
          });

        if (uploadError) {
          FailNotify("Upload Failed: " + uploadError.message);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("Uploaded_Images").getPublicUrl(filename);
        finalUrls.push(publicUrl);
      }
    } else {
      finalUrls = existingUrl;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      FailNotify("You must be logged in to post!");
      return;
    }

    const productData = {
      title: Title,
      price: Price,
      description: Descp,
      quantity: Nos,
      details: Details,
      image_url: finalUrls,
      seller_id: user.id,
    };

    if (productId) productData.id = productId;

    const { error: dbError } = await supabase
      .from("products")
      .upsert(productData);

    if (dbError) throw dbError;

    PassNotify("Item posted Successfully");
    const siteUrl = window.location.origin;
    window.location.href = `${siteUrl}/src/marketplace/market-place.html`;
  } catch (error) {
    FailNotify(error.message);
  }
});

async function CheckEdit() {
  if (productId) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (data) {
      document.getElementById("title").value = data.title;
      document.getElementById("price").value = data.price;
      document.getElementById("description").value = data.description;
      document.getElementById("details").value = data.details;
      document.getElementById("quantity").value = data.quantity;

      existingUrl = data.image_url || [];

      existingUrl.forEach((url) => {
        const box = document.createElement("div");
        box.className = "relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm aspect-square bg-gray-50 dark:bg-[#0B0C0F] flex items-center justify-center";
        const img = document.createElement("img");
        const preview = document.getElementById("imageuploads");
        const delbtn = document.createElement("button");
        delbtn.className = "absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md";
        delbtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

        delbtn.addEventListener("click", () => {
          box.remove();
          imageInput.value = "";
        });

        img.src = url;
        img.className = "w-full h-full object-cover";
        box.appendChild(img);
        box.appendChild(delbtn);
        if (preview.childElementCount < 4) {
          preview.appendChild(box);
        }
      });
    }
  }
}

CheckEdit();
