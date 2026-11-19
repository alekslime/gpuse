document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('gpuse_current_user') || 'null');
  const headerNav = document.querySelector('header.nav');
  const authBtn = headerNav ? headerNav.querySelector('a.btn-primary[href="login.html"], a[href="login.html"]') : null;

  if (currentUser && authBtn) {
    const userContainer = document.createElement('div');
    userContainer.style.display = 'flex';
    userContainer.style.alignItems = 'center';
    userContainer.style.gap = '10px';

    const displayName = currentUser.handle || currentUser.name || currentUser.email.split('@')[0];
    userContainer.innerHTML = `
      <span style="font-size: 14px; font-weight: 600; color: #fff;">${displayName}</span>
      <button id="logout-btn" class="btn" style="cursor: pointer; padding: 6px 12px; font-size: 13px;">Log out</button>
    `;

    authBtn.replaceWith(userContainer);

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('gpuse_current_user');
      window.location.reload();
    });
  }

  const searchInput = document.querySelector('.search-input');
  const findGpuBtn = document.querySelector('.search-row .btn-primary');
  const chips = document.querySelectorAll('.chips a');
  const cards = Array.from(document.querySelectorAll('.card-host'));
  const noteEl = document.querySelector('.note');

  let activeFilter = 'All';

  let noResultsEl = document.getElementById('no-gpus-found');
  if (!noResultsEl) {
    noResultsEl = document.createElement('p');
    noResultsEl.id = 'no-gpus-found';
    noResultsEl.textContent = 'No GPUs match your search or filter criteria.';
    noResultsEl.style.display = 'none';
    noResultsEl.style.padding = '40px 20px';
    noResultsEl.style.textAlign = 'center';
    noResultsEl.style.color = '#888';
    noResultsEl.style.fontSize = '15px';
    const cardsContainer = document.querySelector('.cards3');
    if (cardsContainer) {
      cardsContainer.parentNode.insertBefore(noResultsEl, noteEl);
    }
  }

  function parsePrice(card) {
    const priceText = card.querySelector('.price')?.textContent || '';
    const match = priceText.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 999;
  }

  function filterGPUs() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    let visibleCount = 0;

    cards.forEach((card) => {
      const handle = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const gpuModel = (card.querySelector('.gpu')?.textContent || '').toLowerCase();
      const meta = (card.querySelector('.meta')?.textContent || '').toLowerCase();
      const priceText = (card.querySelector('.price')?.textContent || '').toLowerCase();
      const badgeText = (card.querySelector('.badge')?.textContent || '').trim().toLowerCase();

      const fullContent = `${handle} ${gpuModel} ${meta} ${priceText}`;

      const matchesSearch = !query || fullContent.includes(query);

      let matchesChip = true;
      if (activeFilter === 'All') {
        matchesChip = true;
      } else if (activeFilter === 'Online now') {
        // Matches available hosts (not busy)
        matchesChip = badgeText.includes('available');
      } else if (activeFilter === 'Under $0.05') {
        matchesChip = parsePrice(card) < 0.05;
      } else {

        matchesChip = meta.includes(activeFilter.toLowerCase());
      }

      if (matchesSearch && matchesChip) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      noResultsEl.style.display = 'block';
      if (noteEl) noteEl.style.display = 'none';
    } else {
      noResultsEl.style.display = 'none';
      if (noteEl) {
        noteEl.style.display = '';
        noteEl.textContent = `Showing ${visibleCount} of ${cards.length} GPUs · Prices are set by hosts and shown before you run a job.`;
      }
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();

      chips.forEach((c) => {
        c.classList.remove('btn-primary');
        c.classList.add('btn');
      });
      chip.classList.remove('btn');
      chip.classList.add('btn-primary');

      // Update current active filter
      activeFilter = chip.textContent.trim();
      filterGPUs();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterGPUs);

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterGPUs();
      }
    });
  }

  if (findGpuBtn) {
    findGpuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterGPUs();
    });
  }

  cards.forEach((card) => {
    const viewBtn = card.querySelector('.card-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        const selectedGpu = {
          host: card.querySelector('h3')?.textContent.trim() || '',
          gpu: card.querySelector('.gpu')?.textContent.trim() || '',
          meta: card.querySelector('.meta')?.textContent.trim() || '',
          price: card.querySelector('.price')?.textContent.trim() || ''
        };
        localStorage.setItem('gpuse_selected_gpu', JSON.stringify(selectedGpu));
      });
    }
  });

  // Initial trigger
  filterGPUs();
});