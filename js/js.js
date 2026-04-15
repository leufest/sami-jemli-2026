const nomLink = document.querySelector('.nom');
const contenus = document.querySelector('.contenus');

let boutons = [];
let scrollingToTop = false; // flag pour ignorer l'observer pendant le scroll

const toutRetirerPosition = () => {
  boutons.forEach(b => b.classList.remove('position'));
  if (nomLink) nomLink.classList.remove('position');
};

if (nomLink) {
  nomLink.addEventListener('click', (e) => {
    e.preventDefault();
    scrollingToTop = true;
    contenus.scrollTo({ top: 0, behavior: 'smooth' });
    toutRetirerPosition();
    nomLink.classList.add('position');

    // Désactive le flag une fois le scroll terminé
    setTimeout(() => { scrollingToTop = false; }, 800);
  });
}

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const navigation = document.querySelector('.navigation');

    data.forEach(projet => {
      const bouton = document.createElement('div');
      bouton.classList.add('bouton_scroll');
      bouton.innerHTML = `<p>${projet.titre}</p>`;
      bouton.addEventListener('click', () => {
        const section = document.querySelector(`#projet-${projet.id}`);
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      navigation.appendChild(bouton);
      boutons.push(bouton);

      const section = document.createElement('section');
      section.classList.add('projet');
      section.id = `projet-${projet.id}`;
      const mots_cles = projet.mots_cles.map(mot => `<p>${mot}</p>`).join('');
      const date = `<p class="date">${projet.date}</p>`;
      const figures = projet.figures.map(fig => `<div class="figure"><img src="${fig}" alt="${projet.titre}"></div>`).join('');
      section.innerHTML = `
        <div class="textes">
          <div class="keywords">
            <div class="mots_cles">${mots_cles}${date}</div>
          </div>
          <p class="description">${projet.description}</p>
        </div>
        <div class="figures">
          ${figures}
        </div>
      `;
      contenus.appendChild(section);
    });

    // --- Initialisation ---
    nomLink.classList.add('position');

    // --- Options communes ---
    const observerOptions = {
      root: contenus,
      rootMargin: '-1px 0px -99% 0px',
      threshold: 0
    };

    // --- Observer les sections projets ---
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !scrollingToTop) { // ignore si scroll vers le haut en cours
          const id = entry.target.id;
          const index = data.findIndex(p => `projet-${p.id}` === id);
          toutRetirerPosition();
          if (index !== -1) {
            boutons[index].classList.add('position');
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll('.projet').forEach(section => {
      observer.observe(section);
    });

    // --- Observer la présentation ---
    const presentation = document.querySelector('.presentation');
    if (presentation) {
      const observerPresentation = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            toutRetirerPosition();
            nomLink.classList.add('position');
          }
        });
      }, observerOptions);

      observerPresentation.observe(presentation);
    }

  });