// Fonction pour récupérer un photographe par ID
async function getPhotographerById(id) {
  // Récupération des données du fichier JSON
  const response = await fetch("data/photographers.json");
  // Conversion des données en format JSON
  const data = await response.json();

  // Recherche du photographe avec l'ID dans le tableau "photographers"
  const photographer = data.photographers.find(function (photographer) {
    return photographer.id == id;
  });

  // Retourne le photographe trouvé par ID
  return photographer;
}

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
  const response = await fetch("data/photographers.json");
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

  mediaData.forEach((mediaItem) => {
    const media = MediaFactory(mediaItem);
    const mediaDOM = media.getMediaDOM();
    galleryContainer.appendChild(mediaDOM);
  });

  // Gestion des filtres avec les boutons après avoir récupéré les médias
  handleFilterButtons(mediaData);
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
function updateGallery(mediaArray, photographerFolder) {
  const galleryContainer = document.querySelector(".photo-gallery");
  galleryContainer.innerHTML = ""; // on vide la galerie avant l'affichage du tri

  mediaArray.forEach((mediaItem) => {
    const mediaElement = MediaFactory(
      mediaItem,
      photographerFolder
    ).getMediaDOM();
    galleryContainer.appendChild(mediaElement);
  });
}

// Fonction de gestion des boutons pour filtrer les médias
function handleFilterButtons(mediaArray) {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const sortBy = e.target.dataset.sort;

      // on enlève la classe "active" de tous les boutons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // on ajoute la classe "active" seulement au bouton cliqué
      e.target.classList.add("active");

      // Tri et affichage de la "nouvelle" galerie
      const sortedMedia = handleSort(mediaArray, sortBy);
      updateGallery(sortedMedia);
    });
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  const url = new URL(window.location);
  const photographerId = url.searchParams.get("id");

  // Chargement des données du photographe et ses médias
  const response = await fetch("/data/photographers.json");
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

  // Ajout d'un écouteur d'événement pour mettre à jour les likes quand on clique
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", function () {
      let likeElement = this.previousElementSibling;
    });
  });
});

// Lancement du script
async function run() {
  await displayPhotoPage();
  await displayPhotoGallery();
}

run();
