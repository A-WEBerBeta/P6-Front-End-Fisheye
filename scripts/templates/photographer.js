function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  // Fonction pour générer la card sur la homepage
  function getUserCardDOM() {
    const article = document.createElement("article");

    // création du lien
    const linkPhotographer = document.createElement("a");
    linkPhotographer.href = `photographer.html?id=${id}`;
    linkPhotographer.setAttribute("aria-label", `Voir le profil de ${name}`);

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.alt = `Profil de ${name}`;

    const h2 = document.createElement("h2");
    h2.textContent = name;

    // Ajout de l'image et du nom dans le lien
    linkPhotographer.appendChild(img);
    linkPhotographer.appendChild(h2);

    const localisation = document.createElement("h3");
    localisation.textContent = `${city}, ${country}`;

    const tagElement = document.createElement("p");
    tagElement.textContent = tagline;

    const priceElement = document.createElement("p");
    priceElement.textContent = `${price}€/jour`;

    // Rattachement des balises au DOM
    article.appendChild(linkPhotographer);
    article.appendChild(localisation);
    article.appendChild(tagElement);
    article.appendChild(priceElement);
    return article;
  }

  // Fonction pour générer le header de la page photographer
  function getUserHeaderDOM() {
    const photographHeader = document.createElement("div");
    photographHeader.classList.add("header-content");

    const textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    const h1 = document.createElement("h1");
    h1.textContent = name;

    const localisation = document.createElement("h2");
    localisation.textContent = `${city}, ${country}`;

    const tagElement = document.createElement("p");
    tagElement.textContent = tagline;

    textContainer.appendChild(h1);
    textContainer.appendChild(localisation);
    textContainer.appendChild(tagElement);

    // Récupération du bouton contact
    const contactBtn = document.querySelector(".contact_button");

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.alt = `Profil de ${name}`;

    photographHeader.appendChild(textContainer);
    photographHeader.appendChild(contactBtn);
    photographHeader.appendChild(img);

    return photographHeader;
  }

  return { name, picture, getUserCardDOM, getUserHeaderDOM };
}
