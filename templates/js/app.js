document.addEventListener('DOMContentLoaded', () => {
  let configData = null;
  let galleryImages = [];
  const maxInitialGallery = 9;
  let galleryShowingAll = false;

  // Initialize App
  init();

  async function init() {
    try {
      const response = await fetch('data/config.json?v=' + new Date().getTime());
      configData = await response.json();
      
      renderDynamicContent();
      setupEventListeners();
      startCountdown();
      renderCalendar();
      setupScrollAnimations();
      initMockGallery();
      loadGuestbook();
    } catch (error) {
      console.error('Error loading configuration:', error);
      // Fallback data if fetch fails (e.g. running directly via file://)
      configData = getFallbackConfig();
      renderDynamicContent();
      setupEventListeners();
      startCountdown();
      renderCalendar();
      setupScrollAnimations();
      initMockGallery();
      loadGuestbook();
    }
  }

  // 1. Render content from Config JSON
  function renderDynamicContent() {
    if (!configData) return;

    const { groom, bride, wedding, accounts, transport } = configData;

    // Names
    document.getElementById('main-groom-name').textContent = groom.firstName;
    document.getElementById('main-bride-name').textContent = bride.firstName;

    // Date & Place
    document.getElementById('main-date-string').innerHTML = formatWeddingDate(wedding.date) + (wedding.hall ? '<br>' + wedding.hall : '');
    document.getElementById('main-place-string').textContent = wedding.place;
    document.getElementById('map-hall-name').textContent = wedding.place + (wedding.hall ? ' ' + wedding.hall : '');
    document.getElementById('map-address-text').textContent = wedding.address;

    // Greeting Section Parents
    const groomParents = [];
    if (groom.father && groom.father.name) groomParents.push(groom.father.name);
    if (groom.mother && groom.mother.name) groomParents.push(groom.mother.name);
    const groomParentsText = groomParents.join(' · ');

    const brideParents = [];
    if (bride.father && bride.father.name) brideParents.push(bride.father.name);
    if (bride.mother && bride.mother.name) {
      brideParents.push(bride.mother.name + (bride.mother.deceased ? ' <span class="deceased">故</span>' : ''));
    }
    const brideParentsText = brideParents.join(' · ');

    const parentsContainer = document.getElementById('greeting-parents-container');
    parentsContainer.innerHTML = `
      <div class="parents-grid">
        <div class="parents-row-centered">
          <span>${groomParentsText}</span>
          <span class="parents-relation-badge">의 아들</span>
          <span class="parents-child-name"><b>${groom.lastName}${groom.firstName}</b></span>
        </div>
        <div class="parents-row-centered">
          <span>${brideParentsText}</span>
          <span class="parents-relation-badge">의 딸</span>
          <span class="parents-child-name"><b>${bride.lastName}${bride.firstName}</b></span>
        </div>
      </div>
    `;

    // Contact Section
    const contactContainer = document.getElementById('contact-container');
    if (contactContainer) {
      contactContainer.innerHTML = `
        <!-- Groom Side -->
        <div class="contact-card groom-side">
          <h4>신랑측 연락처</h4>
          <div class="contact-buttons">
            <div class="contact-row">
              <span>신랑 <b>${groom.firstName}</b></span>
              <div class="contact-actions">
                <a href="tel:${groom.phoneNumber}" class="contact-btn">📞</a>
                <a href="sms:${groom.phoneNumber}" class="contact-btn">✉️</a>
              </div>
            </div>
            ${groom.father && groom.father.name ? `
            <div class="contact-row">
              <span>아버지 <b>${groom.father.name}</b></span>
              <div class="contact-actions">
                <a href="tel:${groom.father.phoneNumber}" class="contact-btn">📞</a>
                <a href="sms:${groom.father.phoneNumber}" class="contact-btn">✉️</a>
              </div>
            </div>
            ` : ''}
            ${groom.mother && groom.mother.name ? `
            <div class="contact-row">
              <span>어머니 <b>${groom.mother.name}</b></span>
              <div class="contact-actions">
                <a href="tel:${groom.mother.phoneNumber}" class="contact-btn">📞</a>
                <a href="sms:${groom.mother.phoneNumber}" class="contact-btn">✉️</a>
              </div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Bride Side -->
        <div class="contact-card bride-side">
          <h4>신부측 연락처</h4>
          <div class="contact-buttons">
            <div class="contact-row">
              <span>신부 <b>${bride.firstName}</b></span>
              <div class="contact-actions">
                <a href="tel:${bride.phoneNumber}" class="contact-btn">📞</a>
                <a href="sms:${bride.phoneNumber}" class="contact-btn">✉️</a>
              </div>
            </div>
            ${bride.father && bride.father.name ? `
            <div class="contact-row">
              <span>아버지 <b>${bride.father.name}</b></span>
              <div class="contact-actions">
                <a href="tel:${bride.father.phoneNumber}" class="contact-btn">📞</a>
                <a href="sms:${bride.father.phoneNumber}" class="contact-btn">✉️</a>
              </div>
            </div>
            ` : ''}
            ${bride.mother && bride.mother.name ? `
            <div class="contact-row">
              <span>어머니 <b>${bride.mother.name}</b></span>
              <div class="contact-actions">
                ${bride.mother.deceased ? '<span style="font-size:0.75rem; color:var(--theme-text-muted);">부재중</span>' : `
                  <a href="tel:${bride.mother.phoneNumber}" class="contact-btn">📞</a>
                  <a href="sms:${bride.mother.phoneNumber}" class="contact-btn">✉️</a>
                `}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      `;
    }

    // Account Lists
    renderAccountList('groom-accounts-list', accounts.groom);
    renderAccountList('bride-accounts-list', accounts.bride);

    // Transport Details
    const transportList = document.getElementById('transport-list');
    transportList.innerHTML = transport.map(item => `
      <div class="transport-item">
        <div class="transport-title">${item.title}</div>
        <div class="transport-body">${item.body}</div>
      </div>
    `).join('');
  }

  function renderAccountList(elementId, accountArray) {
    const listEl = document.getElementById(elementId);
    listEl.innerHTML = accountArray.map(acc => `
      <div class="account-item">
        <div class="account-info">
          <div class="account-meta">${acc.relation} ${acc.owner}</div>
          <div class="account-number">${acc.bank} ${acc.number}</div>
        </div>
        <div class="account-actions">
          <button class="btn-secondary copy-account-btn" data-account="${acc.bank} ${acc.number}">복사</button>
        </div>
      </div>
    `).join('');
  }

  function formatWeddingDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hours should be 12
    
    return `${year}년 ${month}월 ${day}일 ${weekday}요일 ${ampm} ${hours}시 ${minutes.toString().padStart(2, '0')}분`;
  }

  // 2. Countdown and D-Day Calculation
  function startCountdown() {
    if (!configData) return;
    const targetDate = new Date(configData.wedding.date).getTime();

    // Together count (e.g. 2025-04-06)
    const togetherEl = document.getElementById('together-count');
    if (togetherEl) {
      const togetherStart = new Date('2025-04-06').getTime();
      const nowTime = new Date().getTime();
      const diffDays = Math.floor((nowTime - togetherStart) / (1000 * 60 * 60 * 24));
      togetherEl.textContent = diffDays;
    }

    function updateTimer() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById('countdown-box').innerHTML = "<p style='font-size: 1.1rem; color: var(--theme-color-accent); font-weight: 500;'>결혼식이 시작되었습니다! 🎉</p>";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('dday-days').textContent = days.toString().padStart(2, '0');
      document.getElementById('dday-hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('dday-mins').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('dday-secs').textContent = seconds.toString().padStart(2, '0');
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
  }

  // 3. Render Calendar dynamically
  function renderCalendar() {
    if (!configData) return;
    const dateObj = new Date(configData.wedding.date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth(); // 0-indexed
    const targetDay = dateObj.getDate();

    document.getElementById('calendar-title').textContent = `${year}.${(month + 1).toString().padStart(2, '0')}`;

    // Get first day of the month & total days
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const grid = document.getElementById('calendar-grid');

    // Add empty slots for days before 1st of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'cal-date empty';
      grid.appendChild(emptyCell);
    }

    // Add date cells
    for (let day = 1; day <= totalDays; day++) {
      const dateCell = document.createElement('div');
      dateCell.className = 'cal-date';
      dateCell.textContent = day;

      const currentDayOfWeek = (firstDay + day - 1) % 7;
      if (currentDayOfWeek === 0) {
        dateCell.classList.add('sunday');
      }

      if (day === targetDay) {
        dateCell.classList.add('wedding-day');
      }

      grid.appendChild(dateCell);
    }
  }

  // 4. Load Mock Gallery
  function initMockGallery() {
    // 15 gallery images inside images/final/ (01.jpg to 15.jpg)
    const galleryCount = 15;
    galleryImages = Array.from({ length: galleryCount }, (_, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `images/final/${num}.jpg`;
    });

    renderGallery();
  }

  function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    const limit = galleryShowingAll ? galleryImages.length : maxInitialGallery;

    for (let i = 0; i < limit; i++) {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.index = i;
      item.innerHTML = `<img src="${galleryImages[i]}" alt="Moment ${i + 1}" class="gallery-thumb" loading="lazy">`;
      item.addEventListener('click', () => openLightbox(i));
      grid.appendChild(item);
    }

    const moreBtn = document.getElementById('btn-gallery-more');
    if (galleryShowingAll) {
      moreBtn.textContent = '사진 접기';
    } else {
      moreBtn.textContent = '사진 더보기';
    }
  }

  // 5. Lightbox Functionality
  let lightboxIndex = 0;
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = galleryImages[lightboxIndex];
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  function prevLightbox() {
    lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[lightboxIndex];
  }

  function nextLightbox() {
    lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[lightboxIndex];
  }

  // 6. Accordion Toggles
  function setupAccordion(accordionId) {
    const acc = document.getElementById(accordionId);
    acc.querySelector('.accordion-header').addEventListener('click', () => {
      acc.classList.toggle('active');
    });
  }

  // 7. Scroll Fade-in Observer
  function setupScrollAnimations() {
    const faders = document.querySelectorAll('.fade-up');
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    faders.forEach(fader => observer.observe(fader));
  }

  // 8. Clipboard Copy
  function setupCopyButton(btnSelector, textToCopy, successMsg) {
    const btn = document.querySelector(btnSelector);
    if (btn) {
      btn.addEventListener('click', () => {
        copyToClipboard(textToCopy, successMsg);
      });
    }
  }

  function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      if (successMsg) {
        showToast(successMsg);
      }
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }

  function showToast(message) {
    const toast = document.getElementById('toast-container');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // 9. LocalStorage Database for Guestbook and RSVP
  // 9. Database for Guestbook and RSVP
  async function loadGuestbook() {
    const listEl = document.getElementById('guestbook-list');
    if (!listEl) return;
    
    listEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--theme-text-muted);">방명록을 불러오는 중입니다...</div>';
    
    let posts = [];
    if (configData && configData.rsvp_api_url) {
      try {
        const response = await fetch(configData.rsvp_api_url);
        const json = await response.json();
        if (json.result === 'success' && json.data) {
          posts = json.data;
        } else {
          console.error('[Guestbook] Failed to load from sheet:', json.message);
          posts = getInitialGuestbook();
        }
      } catch (error) {
        console.error('[Guestbook] API load error:', error);
        posts = getInitialGuestbook();
      }
    } else {
      posts = getInitialGuestbook();
    }
    
    if (posts.length === 0) {
      listEl.innerHTML = '<div style="text-align:center; padding:20px; color:var(--theme-text-muted);">아직 등록된 축하 메시지가 없습니다. 첫 메시지를 남겨보세요!</div>';
      return;
    }
    
    listEl.innerHTML = posts.map(post => {
      let displayDate = post.date || '';
      if (displayDate.includes('-') && displayDate.includes('T')) {
        try {
          const d = new Date(displayDate);
          displayDate = `${d.getMonth() + 1}.${d.getDate()}`;
        } catch (e) {}
      }
      
      return `
        <div class="guestbook-item">
          <div class="guestbook-meta">
            <span class="guestbook-name">${escapeHTML(post.name)}</span>
            <span style="display:flex; gap:10px;">
              <span>${escapeHTML(displayDate)}</span>
              <span class="delete-gb" data-name="${escapeHTML(post.name)}" data-message="${escapeHTML(post.message)}" style="cursor:pointer; color:var(--theme-text-muted);">삭제</span>
            </span>
          </div>
          <div class="guestbook-content">${escapeHTML(post.message)}</div>
        </div>
      `;
    }).join('');

    // Setup delete actions
    document.querySelectorAll('.delete-gb').forEach(el => {
      el.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        const message = e.target.dataset.message;
        const password = prompt('작성 시 입력한 비밀번호를 입력해주세요:');
        if (password) {
          deleteGuestbookEntry(name, message, password);
        }
      });
    });
  }

  async function deleteGuestbookEntry(name, message, password) {
    if (configData && configData.rsvp_api_url) {
      try {
        const deleteData = {
          type: 'delete_guestbook',
          name,
          message,
          password
        };
        
        const response = await fetch(configData.rsvp_api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(deleteData)
        });
        
        const json = await response.json();
        if (json.result === 'success') {
          showToast('방명록이 삭제되었습니다.');
          loadGuestbook();
        } else {
          alert(json.message || '비밀번호가 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('[Guestbook] Delete failed:', error);
        alert('삭제 작업 중 오류가 발생했습니다.');
      }
    } else {
      alert('API 주소가 설정되지 않았습니다.');
    }
  }

  async function addGuestbookEntry(name, password, message) {
    const now = new Date();
    const dateStr = now.toISOString();
    
    const guestbookData = {
      type: 'guestbook',
      name,
      password,
      message,
      date: dateStr
    };
    
    if (configData && configData.rsvp_api_url) {
      try {
        const response = await fetch(configData.rsvp_api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(guestbookData)
        });
        
        const json = await response.json();
        if (json.result === 'success') {
          showToast('메시지가 등록되었습니다.');
          loadGuestbook();
        } else {
          alert('등록 실패: ' + (json.message || '알 수 없는 오류'));
        }
      } catch (error) {
        console.error('[Guestbook] Write failed:', error);
        alert('메시지 등록에 실패했습니다.');
      }
    } else {
      showToast('메시지가 등록되었습니다 (오프라인 모드).');
    }
  }

  async function submitRSVP(side, name, attend, count, meal, message) {
    const stored = localStorage.getItem('wedding_rsvp');
    const list = stored ? JSON.parse(stored) : [];
    const rsvpData = { 
      type: 'rsvp',
      side: side === 'groom' ? '신랑측' : '신부측', 
      name, 
      attend: attend === 'attend' ? '참석' : '불참', 
      count: attend === 'attend' ? count : 0, 
      meal: attend === 'attend' ? (meal === 'yes' ? '식사함' : meal === 'no' ? '식사안함' : '미정') : '해당없음', 
      message, 
      date: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }) 
    };
    
    list.push(rsvpData);
    localStorage.setItem('wedding_rsvp', JSON.stringify(list));
    
    if (configData && configData.rsvp_api_url) {
      try {
        console.log('[RSVP] Pushing to Google Sheets API...');
        await fetch(configData.rsvp_api_url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(rsvpData)
        });
        console.log('[RSVP] API call triggered successfully.');
      } catch (error) {
        console.error('[RSVP] Failed to push to API:', error);
      }
    }
    
    showToast('참석 여부가 성공적으로 전달되었습니다.');
  }

  // Event Listeners Setup
  function setupEventListeners() {
    // Initialize Kakao SDK if key exists
    if (configData && configData.kakao_app_key && window.Kakao) {
      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(configData.kakao_app_key);
        }
      } catch (err) {
        console.error('Failed to initialize Kakao SDK:', err);
      }
    }

    // Gallery More Toggle
    const moreBtn = document.getElementById('btn-gallery-more');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        galleryShowingAll = !galleryShowingAll;
        renderGallery();
      });
    }

    // Accordions
    setupAccordion('acc-groom-accordion');
    setupAccordion('acc-bride-accordion');

    // Clipboard copy actions (Event delegation for dynamic account list buttons)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('copy-account-btn')) {
        const acc = e.target.dataset.account;
        copyToClipboard(acc, '계좌번호가 복사되었습니다.');
      }
    });

    // Copy Address Button
    if (configData && configData.wedding && configData.wedding.address) {
      setupCopyButton('#btn-copy-address', configData.wedding.address, '주소가 복사되었습니다.');
    }

    // Lightbox Controls
    const btnLbClose = document.getElementById('btn-lightbox-close');
    const btnLbPrev = document.getElementById('btn-lightbox-prev');
    const btnLbNext = document.getElementById('btn-lightbox-next');
    if (btnLbClose) btnLbClose.addEventListener('click', closeLightbox);
    if (btnLbPrev) btnLbPrev.addEventListener('click', prevLightbox);
    if (btnLbNext) btnLbNext.addEventListener('click', nextLightbox);

    // Click outside to close lightbox
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });

      // Touch Swipe Support for Lightbox
      let touchStartX = 0;
      let touchEndX = 0;

      function handleLightboxSwipe() {
        const swipeThreshold = 50; // minimum swipe distance in pixels
        if (touchEndX < touchStartX - swipeThreshold) {
          nextLightbox(); // Swipe left -> Next image
        } else if (touchEndX > touchStartX + swipeThreshold) {
          prevLightbox(); // Swipe right -> Previous image
        }
      }

      lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      lightboxModal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleLightboxSwipe();
      }, { passive: true });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
      if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
          prevLightbox();
        } else if (e.key === 'ArrowRight') {
          nextLightbox();
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
    });

    // RSVP Modal Toggles
    const rsvpModal = document.getElementById('rsvp-modal');
    const rsvpDetails = document.getElementById('rsvp-attendance-details');
    const btnRsvpOpen = document.getElementById('btn-rsvp-open');
    const btnRsvpClose = document.getElementById('btn-rsvp-close');
    const btnRsvpCancel = document.getElementById('btn-rsvp-cancel');
    const btnRsvpSubmit = document.getElementById('btn-rsvp-submit');
    
    if (btnRsvpOpen && rsvpModal) {
      btnRsvpOpen.addEventListener('click', () => {
        rsvpModal.classList.add('active');
        if (rsvpDetails) rsvpDetails.style.display = 'block';
      });
    }
    
    if (btnRsvpClose && rsvpModal) {
      btnRsvpClose.addEventListener('click', () => rsvpModal.classList.remove('active'));
    }
    if (btnRsvpCancel && rsvpModal) {
      btnRsvpCancel.addEventListener('click', () => rsvpModal.classList.remove('active'));
    }
    
    // Toggle details on attendance radio change
    const attendRadios = document.getElementsByName('rsvp_attend');
    attendRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'absent') {
          if (rsvpDetails) rsvpDetails.style.display = 'none';
        } else {
          if (rsvpDetails) rsvpDetails.style.display = 'block';
        }
      });
    });
    
    // RSVP Submit
    if (btnRsvpSubmit && rsvpModal) {
      btnRsvpSubmit.addEventListener('click', () => {
        const form = document.getElementById('rsvp-form');
        if (!form || !form.reportValidity()) return;

        const side = form.elements['rsvp_side'] ? form.elements['rsvp_side'].value : 'groom';
        const attend = form.elements['rsvp_attend'] ? form.elements['rsvp_attend'].value : 'attend';
        const name = document.getElementById('rsvp_name') ? document.getElementById('rsvp_name').value : '';
        
        const count = attend === 'absent' ? 0 : (document.getElementById('rsvp_count') ? document.getElementById('rsvp_count').value : 1);
        const meal = attend === 'absent' ? 'no' : (form.elements['rsvp_meal'] ? form.elements['rsvp_meal'].value : 'yes');
        const message = document.getElementById('rsvp_message') ? document.getElementById('rsvp_message').value : '';

        submitRSVP(side, name, attend, count, meal, message);
        form.reset();
        rsvpModal.classList.remove('active');
      });
    }

    // Guestbook Modal Toggles
    const gbModal = document.getElementById('guestbook-modal');
    const btnGbOpen = document.getElementById('btn-guestbook-open');
    const btnGbClose = document.getElementById('btn-guestbook-close');
    const btnGbCancel = document.getElementById('btn-guestbook-cancel');
    const btnGbSubmit = document.getElementById('btn-guestbook-submit');

    if (btnGbOpen && gbModal) {
      btnGbOpen.addEventListener('click', () => gbModal.classList.add('active'));
    }
    if (btnGbClose && gbModal) {
      btnGbClose.addEventListener('click', () => gbModal.classList.remove('active'));
    }
    if (btnGbCancel && gbModal) {
      btnGbCancel.addEventListener('click', () => gbModal.classList.remove('active'));
    }

    // Guestbook Submit
    if (btnGbSubmit && gbModal) {
      btnGbSubmit.addEventListener('click', () => {
        const form = document.getElementById('guestbook-form');
        if (!form || !form.reportValidity()) return;

        const name = document.getElementById('gb_name') ? document.getElementById('gb_name').value : '';
        const password = document.getElementById('gb_password') ? document.getElementById('gb_password').value : '';
        const message = document.getElementById('gb_message') ? document.getElementById('gb_message').value : '';

        addGuestbookEntry(name, password, message);
        form.reset();
        gbModal.classList.remove('active');
      });
    }

    // Share buttons
    const btnShareLink = document.getElementById('btn-share-link');
    const btnShareNative = document.getElementById('btn-share-native');

    if (btnShareLink) {
      btnShareLink.addEventListener('click', () => {
        copyToClipboard(window.location.href, '');
      });
    }

    if (btnShareNative) {
      btnShareNative.addEventListener('click', () => {
        if (configData && configData.kakao_app_key && window.Kakao && window.Kakao.isInitialized()) {
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: `${configData.groom.firstName} 🤍 ${configData.bride.firstName} 결혼식에 초대합니다`,
              description: `${formatWeddingDate(configData.wedding.date)} / ${configData.wedding.place}`,
              imageUrl: 'https://unoshin.github.io/wedding-card/images/final/new_main.jpg',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
            buttons: [
              {
                title: '모바일 청첩장 보기',
                link: {
                  mobileWebUrl: window.location.href,
                  webUrl: window.location.href,
                },
              },
            ],
          });
        } else if (navigator.share) {
          navigator.share({
            title: `${configData.groom.firstName} 🤍 ${configData.bride.firstName} 결혼식에 초대합니다`,
            text: `${formatWeddingDate(configData.wedding.date)} / ${configData.wedding.place}`,
            url: window.location.href,
          }).catch(err => {
            console.log('Share failed:', err);
            copyToClipboard(window.location.href, '');
          });
        } else {
          copyToClipboard(window.location.href, '');
        }
      });
    }
  }

  // Helpers
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function getInitialGuestbook() {
    return [
      { name: "민우 & 지현", date: "6.14", message: "윤호야, 다연아! 결혼 진심으로 축하해! 평생 행복하고 예쁘게 살아라!! ♥" },
      { name: "김부장님", date: "6.12", message: "윤호 대리 결혼을 축하하네. 인생의 새로운 2막을 응원하네. 행복이 가득하길." },
      { name: "혜원 (플라워샵)", date: "6.10", message: "다연언니! 드디어 가네 ㅠㅠ 너무너무 축하해!! 당일에 세상에서 제일 예쁠 신부 기대할게!" }
    ];
  }

  function getFallbackConfig() {
    return {
      "groom": {
        "lastName": "신", "firstName": "윤호", "phoneNumber": "010-1234-5678",
        "father": { "name": "신재근", "phoneNumber": "010-1111-2222" },
        "mother": { "name": "이정희", "phoneNumber": "010-3333-4444" }
      },
      "bride": {
        "lastName": "이", "firstName": "다연", "phoneNumber": "010-9876-5432",
        "father": { "name": "아버님", "phoneNumber": "010-5555-6666" },
        "mother": { "name": "어머님", "deceased": false, "phoneNumber": "010-7777-8888" }
      },
      "wedding": {
        "date": "2027-01-24T13:10:00+09:00",
        "place": "여의도 웨딩컨벤션", "hall": "",
        "address": "서울특별시 영등포구 여의대로 14"
      },
      "accounts": {
        "groom": [
          { "relation": "신랑", "bank": "신한", "number": "111111111", "owner": "신윤호" },
          { "relation": "어머니", "bank": "국민", "number": "222222222", "owner": "이정희" }
        ],
        "bride": [
          { "relation": "신부", "bank": "신한", "number": "333333333", "owner": "이다연" },
          { "relation": "아버지", "bank": "하나", "number": "4444444444", "owner": "이준호" },
          { "relation": "어머니", "bank": "국민", "number": "555555555", "owner": "조은희" }
        ]
      },
      "transport": [
        { "type": "subway", "title": "지하철", "body": "5호선·9호선 여의도역 1번 출구 도보 8분" }
      ]
    };
  }
});
