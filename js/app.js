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

  // ==========================================================================
  // 6. VALIDACE & ANIMACE ODESLÁNÍ KONTAKTNÍHO DOPISU
  // ==========================================================================
  const contactForm = document.getElementById('js-contact-form');
  const formStatus = document.getElementById('js-form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');
      const submitBtn = contactForm.querySelector('.contact-form__submit');

      // Reset stavu
      formStatus.className = 'contact-form__status';
      formStatus.textContent = '';

      // Jednoduchá klientská validace
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        formStatus.textContent = 'Prosím, vyplňte všechna pole, aby dopis mohl odletět.';
        formStatus.classList.add('contact-form__status--error');
        return;
      }

      if (!validateEmail(emailInput.value)) {
        formStatus.textContent = 'Adresa e-mailu se zdá být neúplná. Zkontrolujte ji prosím.';
        formStatus.classList.add('contact-form__status--error');
        return;
      }

      // Simulace plynulého odeslání s vizuálním stavem
      submitBtn.textContent = 'Pečetění dopisu...';
      submitBtn.style.opacity = '0.7';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitBtn.textContent = 'Dopis odeslán';
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';

        formStatus.textContent = 'Váš dopis byl tence položen na hladinu. Brzy se vám ozvu zpět.';
        formStatus.classList.add('contact-form__status--success');

        // Vyčištění formuláře
        contactForm.reset();
        
        // Vyčištění textu po nějaké době
        setTimeout(() => {
          formStatus.style.opacity = '0';
          setTimeout(() => {
            formStatus.textContent = '';
            formStatus.style.opacity = '1';
            submitBtn.textContent = 'Odeslat dopis';
          }, 500);
        }, 6000);

      }, 1800);
    });
  }

  // Pomocná funkce pro validaci e-mailu
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

});
