import { supabase } from "./supabaseClient.js";

const SideBar = document.getElementById("sidebar");
const Sidebar_Logo = document.getElementById("sidebar-logo");
const ToggleBtn = document.getElementById("sidebar-btn");
const navTexts = document.querySelectorAll(".nav-text");
const header = document.getElementById("sidebar-header");
const SidebarText = document.getElementById("sidebar_text");
const MainContent = document.getElementById("main");

ToggleBtn.addEventListener("click", () => {
  const isOpen = SideBar.classList.contains("w-64");

  if (isOpen) {
    SideBar.classList.remove("w-64", "px-10");
    SideBar.classList.add("w-29", "px-9.5");

    MainContent.classList.remove("ml-64");
    MainContent.classList.add("ml-28");

    Sidebar_Logo.classList.add("hidden");
    SidebarText.classList.add("hidden");

    header.classList.remove("gap-16");
    header.classList.add("justify-center");

    navTexts.forEach((text) => {
      text.classList.add("hidden");
      text.parentElement.classList.add("justify-center");
    });
  } else {
    SideBar.classList.remove("w-28", "px-2");
    SideBar.classList.add("w-64", "px-10");

    MainContent.classList.add("ml-64");
    MainContent.classList.remove("ml-28");

    Sidebar_Logo.classList.remove("hidden");
    SidebarText.classList.remove("hidden");

    header.classList.add("gap-16");
    header.classList.remove("justify-center");

    navTexts.forEach((text) => {
      text.classList.remove("hidden");
      text.parentElement.classList.remove("justify-center");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const ThemeToggle = document.getElementById("theme-toggle");
  const ThemeToggleDark = document.getElementById("theme-toggle-dark-icon");
  const ThemeToggleLight = document.getElementById("theme-toggle-light-icon");

  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    ThemeToggleLight.classList.remove("hidden");
    ThemeToggleDark.classList.add("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    ThemeToggleLight.classList.add("hidden");
    ThemeToggleDark.classList.remove("hidden");
  }

  ThemeToggle.addEventListener("click", function () {
    // toggle icons inside button
    ThemeToggleDark.classList.toggle("hidden");
    ThemeToggleLight.classList.toggle("hidden");

    // if set via local storage previously
    if (document.documentElement.classList.contains("dark")) {
      // Switch to Light
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      // Switch to Dark
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  });
});

const preview = document.getElementById("imageuploads");
const imageInput = document.getElementById("file-input");
imageInput.addEventListener("change", () => {
  preview.innerHTML = "";
  [...imageInput.files].forEach((file) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.className = "ml-3 h-50 w-full object-cover rounded-lg";
    preview.appendChild(img);
  });
});

const postbtn = document.getElementById("post-btn");
postbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const Title = document.getElementById("title").value;
  const Descp = document.getElementById("description").value;
  const Price = document.getElementById("price").value;
  const Details = document.getElementById("details").value;
  const Nos = document.getElementById("quantity").value;

  const files = imageInput.files;

  if (!Title || !Descp || !Price || files.length == 0) {
    alert("Please fill in Name, Price, and select an Image!");
    return;
  }

  //Image Upload to Storage and Database\\

  try {
    const UploadedUrls = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.name}`; // filename given
      const { data: uploadData, error: uploadError } = await supabase.storage //splitting the package into success and failure
        .from("Uploaded_Images")
        .upload(filename, file);

      if (uploadError) {
        alert("Upload Failed" + uploadError.message);
        return;
      }

      console.log("Success");
      const {
        data: { publicUrl },
      } = supabase.storage.from("Uploaded_Images").getPublicUrl(filename);
      console.log("File Uploaded! Public Link:", publicUrl);

      UploadedUrls.push(publicUrl);
    }
    //Saving the list to db

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(Title);
    console.log(Price);
    console.log("Logged in User ID:", user?.id);
    console.log("Seller ID being sent:", user?.id);
    console.log("Image List:", UploadedUrls);
    if (!user) {
      alert("You must be logged in to post!");
      return;
    }

    const { error: dbError } = await supabase.from("products").insert([
      {
        title: Title,
        price: Price,
        description: Descp,
        quantity: Nos,
        details: Details,
        image_url: UploadedUrls, // Publicaly accessible image url
        seller_id: user.id,
      },
    ]);

    if (dbError) throw dbError;

    alert("Item posted Successfully");
    Title = "";
    Price = "";
    Descp = "";
    Nos = "";
    Details = "";
    //window.location.href = "market -place.html"
  } catch (error) {
    alert("Upload Failed" + error.message);
  }
});
