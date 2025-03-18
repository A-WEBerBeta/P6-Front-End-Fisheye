function MediaFactory(data) {
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
      likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;

      // Ajout de l'interactivité au bouton (toggle du like à chaque click)
      likeBtn.addEventListener("click", () => {
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
