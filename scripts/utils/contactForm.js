import { getPhotographerById } from "../templates/MediaFactory.js";

// DOM Elements
const modal = document.getElementById("contact_modal");
const openModalBtn = document.querySelector(".open-btn");
const closeModalBtn = document.querySelector(".close-btn");
const form = document.getElementById("contact-form");
const pageContent = document.querySelector(".page-content");

async function displayModal() {
  const url = new URL(window.location);
  const photographerId = url.searchParams.get("id");

  const photographer = await getPhotographerById(photographerId);
  document.getElementById("photographer-name").textContent = photographer.name;

  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");

  pageContent.setAttribute("aria-hidden", "true");
  pageContent.setAttribute("inert", "true");

  document.getElementById("first-name").focus();

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  pageContent.setAttribute("aria-hidden", "false");
  pageContent.removeAttribute("inert");
  openModalBtn.focus();
}

openModalBtn.addEventListener("click", displayModal);
closeModalBtn.addEventListener("click", closeModal);

// Fonction pour gérer l'envoi du formulaire
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    Prénom: document.getElementById("first-name").value,
    Nom: document.getElementById("last-name").value,
    Email: document.getElementById("email").value,
    Message: document.getElementById("message").value,
  };
  console.log(formData);

  form.reset();

  closeModal();
});
