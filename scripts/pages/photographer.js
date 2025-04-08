import {
  MediaFactory,
  getPhotographerById,
} from "../templates/MediaFactory.js";
import { photographerTemplate } from "../templates/photographer.js";
import { openLightbox } from "../utils/lightbox.js";

// Fonction pour afficher le header du photographe
async function displayPhotoPage() {
  // Récupération de l'ID du photographe depuis l'URL
  const url = new URL(window.location);
  const photographerId = url.searchParams.get("id"); // utilisation de la méthode searchParams pour récupérer l'ID

  // Récupération des infos du photographe
  const photographer = await getPhotographerById(photographerId);

  // Affichage des informations du photographe
  const photographerHeader = document.querySelector(".photograph-header");
  const photographerModel = photographerTemplate(photographer);
  const photographerHeaderDOM = photographerModel.getUserHeaderDOM();

  photographerHeader.innerHTML = ""; // Efface le contenu existant
  photographerHeader.appendChild(photographerHeaderDOM);
}

// Fonction pour récupérer les médias par ID de photographe
async function getMediaPhotographerId(photographerId) {
  const response = await fetch("./data/photographers.json");
  const data = await response.json();

  return data.media.filter((media) => media.photographerId == photographerId);
}

// Fonction pour afficher la galerie avec le tri des médias
async function displayPhotoGallery() {
  const url = new URL(window.location);
  const photographerId = url.searchParams.get("id");

  // Récupération des médias du photographe
  const mediaData = await getMediaPhotographerId(photographerId);

  const galleryContainer = document.querySelector(".photo-gallery");
  galleryContainer.innerHTML = ""; // permet de nettoyer la galerie avant d'ajouter le contenu

  mediaData.forEach((mediaItem, index) => {
    const media = MediaFactory(mediaItem, index, mediaData);
    const mediaDOM = media.getMediaDOM();

    // Ouvrir la lightbox au click
    mediaDOM.addEventListener("click", () => {
      openLightbox(mediaData, index);
    });

    // Ouvrir la lightbox avec touche "Enter"
    mediaDOM.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        openLightbox(mediaData, index);
      }
    });

    galleryContainer.appendChild(mediaDOM);
  });

  // Gestion des filtres avec les boutons après avoir récupéré les médias
  handleDropdownFilter(mediaData);
}

// Fonction pour gérer le tri
function handleSort(mediaArray, sortBy) {
  if (sortBy === "popularity") {
    return mediaArray.sort((a, b) => b.likes - a.likes);
  } else if (sortBy === "date") {
    return mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "title") {
    return mediaArray.sort((a, b) => a.title.localeCompare(b.title));
  }
}

// Fonction pour afficher la galerie avec les médias triés
function updateGallery(mediaArray) {
  const galleryContainer = document.querySelector(".photo-gallery");
  galleryContainer.innerHTML = ""; // on vide la galerie avant l'affichage du tri

  mediaArray.forEach((mediaItem, index) => {
    const mediaElement = MediaFactory(
      mediaItem,
      index,
      mediaArray
    ).getMediaDOM();

    mediaElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        openLightbox(mediaArray, index);
      }
    });

    galleryContainer.appendChild(mediaElement);
  });
}

// Fonction pour gérer le menu déroulant pour filtrer les médias
function handleDropdownFilter(mediaArray) {
  const dropdown = document.querySelector(".dropdown");
  const toggleBtn = document.querySelector(".dropdown-toggle");
  const filterOptions = document.querySelectorAll(".filter-btn");

  // Ouvrir/fermer le menu déroulant + change l'icône du chevron
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = dropdown.classList.toggle("active");

    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

    const chevronIcon = toggleBtn.querySelector(
      ".fa-chevron-up, .fa-chevron-down"
    );

    if (isOpen) {
      chevronIcon.classList.replace("fa-chevron-down", "fa-chevron-up");
    } else {
      chevronIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
    }
  });

  // Gestion du choix de tri selon le bouton cliqué
  filterOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      const selectedOption = e.target;

      // MAJ aria-selected pour chaque option
      filterOptions.forEach((opt, index) => {
        opt.setAttribute("aria-selected", "false");
        opt.parentElement.style.order = index;
      });
      selectedOption.setAttribute("aria-selected", "true");

      // MAJ aria-activedescendant sur le bouton
      toggleBtn.setAttribute("aria-activedescendant", selectedOption.id);

      // MAJ du bouton principal avec la sélection
      toggleBtn.innerHTML = `<span class="fa-solid fa-chevron-down"></span>`;

      // Fermer le menu après sélection
      dropdown.classList.remove("active");
      toggleBtn.setAttribute("aria-expanded", "false");
      selectedOption.parentElement.style.order = "-1";

      // Remettre le focus sur le bouton toggle
      toggleBtn.focus();

      // Trier et MAJ de la galerie
      const sortBy = selectedOption.dataset.sort;
      const sortedMedia = handleSort(mediaArray, sortBy);
      updateGallery(sortedMedia);
    });
  });

  // Ferme le menu déroulant si click ailleurs sur la page
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
      dropdown.classList.remove("active");

      const chevronIcon = toggleBtn.querySelector(
        ".fa-chevron-up, .fa-chevron-down"
      );
      chevronIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
    }
  });
}

// Gestion de la navigation au clavier
document.addEventListener("keydown", (e) => {
  const dropdown = document.querySelector(".dropdown");
  if (!dropdown.classList.contains("active")) return;

  const options = document.querySelectorAll(".filter-btn");
  let focused = document.activeElement;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      moveFocus(options, "next", focused);
      break;
    case "ArrowUp":
      e.preventDefault();
      moveFocus(options, "prev", focused);
      break;
    case "Enter":
      e.preventDefault();
      focused.click();
      document.querySelector(".dropdown-toggle").focus();
      break;
    case "Escape":
      dropdown.classList.remove("active");
      document.querySelector(".dropdown-toggle").focus();
      break;
  }
});

const toggleBtn = document.querySelector(".dropdown-toggle");

toggleBtn.addEventListener("keypress", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleBtn.click();
  }
});

// Fonction pour déplacer le focus
function moveFocus(options, direction, focused) {
  let optionsArray = Array.from(options);
  let currentIndex = optionsArray.indexOf(focused);
  let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

  if (nextIndex >= optionsArray.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = optionsArray.length - 1;

  optionsArray[nextIndex].focus();
}

document.addEventListener("DOMContentLoaded", async function () {
  const url = new URL(window.location);
  const photographerId = url.searchParams.get("id");

  // Chargement des données du photographe et ses médias
  const response = await fetch("./data/photographers.json");
  const data = await response.json();

  const photographer = data.photographers.find((p) => p.id == photographerId);
  const media = data.media.filter((m) => m.photographerId == photographerId);

  // Affichage du prix journalier
  if (photographer) {
    document.getElementById("price").textContent = photographer.price;
  }

  // Calcul du nombre total de likes
  let totalLikes = media.reduce((sum, item) => sum + item.likes, 0);
  document.getElementById("total-likes").textContent = totalLikes;
});

// Lancement du script
async function run() {
  await displayPhotoPage();
  await displayPhotoGallery();
}

run();
