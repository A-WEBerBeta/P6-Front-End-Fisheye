// DOM Elements
const modal = document.getElementById("contact_modal");
const openModalBtn = document.querySelector(".open-btn");
const closeModalBtn = document.querySelector(".close-btn");
const form = document.getElementById("contact-form");

function displayModal() {
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("first-name").focus();
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  openModalBtn.focus();
}

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

  closeModal();
});
