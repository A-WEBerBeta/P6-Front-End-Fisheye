import { openLightbox } from "../utils/lightbox.js";

export function MediaFactory(data, index, mediaData) {
  return {
    id: data.id,
    photographerId: data.photographerId,
    title: data.title,
    image: data.image,
    video: data.video,
    likes: data.likes,
    date: data.date,

    getMediaDOM() {
      const mediaElement = document.createElement("div");
      mediaElement.classList.add("gallery-item");

      let media;
      if (this.image) {
        // Image
        media = document.createElement("img");
        media.src = `assets/images/${this.photographerId}/${this.image}`;
        media.alt = this.title;
      } else {
        // Vidéo
        media = document.createElement("video");
        media.src = `assets/images/${this.photographerId}/${this.video}`;
      }

      // Ajout d'un attribut data-index au média pour pouvoir retrouver l'index dans la galerie
      media.dataset.index = index;
      media.setAttribute("tabindex", "0");

      // Création des éléments de média pour la lightbox
      media.addEventListener("click", () => {
        openLightbox(mediaData, index); // on passe l'index à openLightbox
      });

      // Ouvrir la lightbox avec "Enter" uniquement si ce n'est pas un like
      media.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          openLightbox(mediaData, index);
        }
      });

      // Conteneur pour le titre et les likes
      const infoContainer = document.createElement("div");
      infoContainer.classList.add("info");

      // Titre à gauche
      const title = document.createElement("p");
      title.textContent = this.title;

      // Conteneur des likes (nombre + bouton)
      const likesContainer = document.createElement("div");
      likesContainer.classList.add("likes-container");

      // Nombre de likes
      const likeCount = document.createElement("span");
      likeCount.textContent = this.likes;
      likeCount.classList.add("like-count");

      // Bouton like avec icône coeur Font Awesome
      const likeBtn = document.createElement("button");
      likeBtn.classList.add("like-btn");
      likeBtn.setAttribute("aria-label", "Ajouter un like");
      likeBtn.innerHTML = `<span class="fa-solid fa-heart" role="img" aria-label="Cœur"></span>`;

      // Ajout de l'interactivité au bouton (toggle du like à chaque click)
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // empêche la lightbox de s'ouvrir

        if (this.isLiked) {
          // Si l'image est déjà like, on retire le like
          this.likes--; // diminue le nombre de likes
          likeCount.textContent = this.likes; // MAJ affichage
          this.isLiked = false; // marque l'image comme non like
        } else {
          // Si l'image n'est pas like, on ajoute un like
          this.likes++; // augmente le nombre de likes
          likeCount.textContent = this.likes; // MAJ affichage
          this.isLiked = true; // marque l'image comme like
        }

        // MAJ de l'affichage du total de likes dans l'encart
        const totalLikesElement = document.getElementById("total-likes");
        let totalLikes = parseInt(totalLikesElement.textContent, 10); // système décimal base 10 (standard pour les nombres)
        if (this.isLiked) {
          totalLikes++; // augmente le total si un like est ajouté
        } else {
          totalLikes--; // diminue le total si un like est retiré
        }
        totalLikesElement.textContent = totalLikes; // MAJ affiche du nb total de likes
      });

      // Empêcher la lightbox de s'ouvrir quand on appuie sur "Enter" sur le bouton like
      likeBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          likeBtn.click();
        }
      });

      // Ajout des éléments dans le conteneur de likes
      likesContainer.appendChild(likeCount);
      likesContainer.appendChild(likeBtn);

      // Ajout des éléments à la div info
      infoContainer.appendChild(title);
      infoContainer.appendChild(likesContainer);

      // Ajout des éléments au conteneur principal
      mediaElement.appendChild(media);
      mediaElement.appendChild(infoContainer);

      return mediaElement;
    },
  };
}

// Fonction pour récupérer un photographe par ID
export async function getPhotographerById(id) {
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
