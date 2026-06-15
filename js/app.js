/* ==========================================================================
   INTERAKTIVNÍ LOGIKA & ANIMACE - PORTFÓLIO POEZIE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. ČTENÁŘSKÝ REŽIM (MODAL / LIGHTBOX) PRO BÁSNĚ
  // ==========================================================================
  const cards = document.querySelectorAll('.poetry-card');
  const modal = document.getElementById('js-poetry-modal');
  const modalTitle = document.getElementById('js-modal-title');
  const modalText = document.getElementById('js-modal-text');
  const modalCloseBtn = document.getElementById('js-modal-close');

  // Funkce pro otevření modálního okna
  function openModal(card) {
    const title = card.querySelector('.poetry-card__title').textContent;
    const fullText = card.querySelector('.poetry-card__fulltext').innerHTML;

    // Naplníme modal daty
    modalTitle.textContent = title;
    modalText.innerHTML = fullText;

    // Zobrazíme dialog a spustíme transition
    modal.showModal();
    
    // Drobná prodleva, aby prohlížeč stačil zaregistrovat zobrazení a vykreslit transition
    requestAnimationFrame(() => {
      modal.classList.add('poetry-modal--open');
    });

    // Zabráníme posunu stránky na pozadí
    document.body.style.overflow = 'hidden';
  }

  // Funkce pro zavření modálního okna s přechodovou animací
  function closeModal() {
    if (!modal.classList.contains('poetry-modal--open')) return;

    modal.classList.remove('poetry-modal--open');

    // Vyčkáme na konec animace, než dialog zavřeme nativně
    const onTransitionEnd = (e) => {
      if (e.target === modal) {
        modal.close();
        document.body.style.overflow = '';
        modal.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    modal.addEventListener('transitionend', onTransitionEnd);
  }

  // Přidáme posluchače na všechny karty v gridu
  cards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card);
    });
    
    // Podpora klávesnice pro přístupnost
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });

    // Sledování pohybu myši pro dynamický světelný efekt (spotlight)
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Zavírací tlačítko
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Zavření při kliknutí na pozadí (backdrop)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Animované zavření při stisku klávesy Escape
  modal.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeModal();
  });

});