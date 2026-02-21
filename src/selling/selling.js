import { supabase } from "/src/shared/supabaseClient.js";

import { PassNotify, FailNotify, }
  from "/src/shared/loader.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const preview = document.getElementById("imageuploads");
const imageInput = document.getElementById("file-input");
imageInput.addEventListener("change", () => {
  // preview.innerHTML = "";

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

const delbtn = document.getElementById("delbtn");
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

  //Image Upload to Storage and Database\\

  try {
    const UploadedUrls = [];

    let finalUrls = [];
    if (files.length > 0) {
      for (const file of files) {
        const filename = `${Date.now()}-${file.name}`; // filename given
        const { data: uploadData, error: uploadError } = await supabase.storage //splitting the package into success and failure
          .from("Uploaded_Images")
          .upload(filename, file);

        if (uploadError) {
          FailNotify("Upload Failed1" + uploadError.message);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("Uploaded_Images").getPublicUrl(filename);

        finalUrls.push(publicUrl);

        console.log("Success");
      }
    }
    //Saving the list to db
    else {
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

    if (productId) {
      productData.id = productId;
    }

    const { error: dbError } = await supabase
      .from("products")
      .upsert(productData);

    if (dbError) throw dbError;
    else {
      PassNotify("Item posted Successfully");
      const siteUrl = window.location.origin;
      console.log(siteUrl);

      window.location.href = `${siteUrl}/src/marketplace/market-place.html`;
    }
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
      .single(); //to give aonly a single data

    if (data) {
      document.getElementById("title").value = data.title;
      document.getElementById("price").value = data.price;
      document.getElementById("description").value = data.description;
      document.getElementById("details").value = data.details;
      document.getElementById("quantity").value = data.quantity;
      document.getElementById("file-input").src = data.image_url;

      existingUrl = data.image_url || [];

      // Render existing previews
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
    } //if data exist
  }
}

CheckEdit();
