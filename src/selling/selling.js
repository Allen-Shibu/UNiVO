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
    box.className = "relative w-full h-48 ";
    const img = document.createElement("img");
    const delbtn = document.createElement("button");
    delbtn.innerHTML = `<button id='delbtn' class="cursor-pointer relative px-1 -top-47 -right-54 w-8 h-8 bg-white/60 rounded-4xl backdrop-blur-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 6h18"></path>
  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  <line x1="10" y1="11" x2="10" y2="17"></line>
  <line x1="14" y1="11" x2="14" y2="17"></line>
</svg></button>`;
    delbtn.addEventListener("click", () => {
      box.remove();
      imageInput.value = "";
    });

    img.src = URL.createObjectURL(file);
    img.className = "ml-3 h-50 w-full object-cover rounded-lg";
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
        box.className = "relative w-full h-48";
        const img = document.createElement("img");
        const preview = document.getElementById("imageuploads");
        const delbtn = document.createElement("button");
        delbtn.innerHTML = `<button id='delbtn' class="cursor-pointer relative px-2 top-2 right-2 w-8 h-8 bg-white/60 rounded-4xl backdrop-blur-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg></button>`;
        delbtn.addEventListener("click", () => {
          box.remove();
          imageInput.value = "";
        });

        img.src = url;
        img.className = "ml-3 h-50 w-full object-cover rounded-lg";
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
