const lightbox = document.querySelector(".lightbox");
const lightboxMedia = document.querySelector(".lightbox-media");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const closeLightboxBtn = document.querySelector(".close-lightbox");
const title = document.querySelector(".lightbox-title");
const pageContent = document.querySelector(".page-content");
let lastFocusedElement;

// Fonction pour ouvrir la lightbox
export function openLightbox(mediaData, index) {
  lastFocusedElement = document.activeElement; // Sauvegarde du dernier élément ayant le focus

  // effacer le contenu précédent de la lightbox
  lightboxMedia.innerHTML = "";

  const media = mediaData[index];

  let mediaElement;

  if (media.image) {
    mediaElement = document.createElement("img");
    mediaElement.src = `assets/images/${media.photographerId}/${media.image}`;
    mediaElement.alt = `${media.title}, closeup view`;
  } else {
    mediaElement = document.createElement("video");
    mediaElement.src = `assets/images/${media.photographerId}/${media.video}`;
    mediaElement.setAttribute("controls", "true");
    mediaElement.setAttribute("aria-label", `${media.title}, closeup view`);
  }

  // Ajout du média dans la lightbox
  lightboxMedia.appendChild(mediaElement);

  // Affichage de la lightbox
  lightbox.style.display = "flex";

  // Désactivation de l'interaction avec la page en arrière plan
  pageContent.setAttribute("inert", "true");

  // Gestion des boutons suivant/précédent avec mediaData
  prevBtn.onclick = () => {
    const prevIndex = index === 0 ? mediaData.length - 1 : index - 1;
    openLightbox(mediaData, prevIndex);
  };

  nextBtn.onclick = () => {
    const nextIndex = index === mediaData.length - 1 ? 0 : index + 1;
    openLightbox(mediaData, nextIndex);
  };

  // Gestion du titre sous le média
  title.textContent = media.title;

  // Mettre le focus sur la lightbox pour la navigation clavier
  setTimeout(() => {
    nextBtn.focus();
  }, 50);
  document.querySelector(".lightbox-content").setAttribute("tabindex", "-1");
  document.querySelector(".lightbox-content").focus();
}

// Fonction pour fermer la lightbox
function closeLightbox() {
  lightbox.style.display = "none";

  // Renvoyer le focus à l'élément qui a ouvert la lightbox
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

  // Réactivation de l'interactivité de la page après fermeture de la lightbox
  pageContent.removeAttribute("inert");
}

// Ajout de la fermeture de la lightbox au bouton
closeLightboxBtn.addEventListener("click", closeLightbox);

// Fermeture et navigation au clavier
// document.addEventListener("keydown", function (e) {
//   if (lightbox.style.display === "flex") {
//     if (e.key === "Escape") {
//       closeLightbox();
//     } else if (e.key === "ArrowLeft") {
//       prevBtn.click();
//     } else if (e.key === "ArrowRight") {
//       nextBtn.click();
//     }
//   }
// });
document.addEventListener("keydown", function (e) {
  const isLightboxOpen = lightbox.style.display === "flex";
  const isFocusInsideLightbox = lightbox.contains(document.activeElement);

  if (!isLightboxOpen || !isFocusInsideLightbox) return;

  switch (e.key) {
    case "Escape":
      e.preventDefault();
      closeLightbox();
      break;
    case "ArrowLeft":
      e.preventDefault();
      prevBtn.click();
      break;
    case "ArrowRight":
      e.preventDefault();
      nextBtn.click();
      break;
  }
});
