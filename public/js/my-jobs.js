document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('gpuse_current_user') || 'null');
  const headerNav = document.querySelector('header.nav');
  const actionBtn = headerNav ? headerNav.querySelector('a.btn') : null;

  if (currentUser && actionBtn) {
    const userContainer = document.createElement('div');
    userContainer.style.display = 'flex';
    userContainer.style.alignItems = 'center';
    userContainer.style.gap = '10px';

    const displayName = currentUser.handle || currentUser.name || currentUser.email.split('@')[0];
    userContainer.innerHTML = `
      <span style="font-size: 14px; font-weight: 600; color: #fff;">${displayName}</span>
      <button id="logout-btn" class="btn" style="cursor: pointer; padding: 6px 12px; font-size: 13px;">Log out</button>
    `;

    actionBtn.insertAdjacentElement('afterend', userContainer);

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('gpuse_current_user');
      window.location.reload();
    });
  }

  const tableWrap = document.querySelector('.table-wrap');
  const table = tableWrap ? tableWrap.querySelector('table') : null;
  const actionsWrap = document.querySelector('.actions');
  const emptyPanel = document.querySelector('.panel.empty');
  const downloadBtn = actionsWrap ? actionsWrap.querySelectorAll('a.btn')[0] : null;

  let jobs = JSON.parse(localStorage.getItem('gpuse_jobs') || 'null');

  // Seed default jobs if never saved before
  if (!jobs) {
    jobs = [
      { id: '#2043', name: 'Image · Lighthouse prompt', host: '@pixelforge · RTX 4090', time: '24 sec', cost: '$0.04', status: 'Running' },
      { id: '#2040', name: 'Image · Flux.1 dev', host: '@darkroom_pc · RTX 3090', time: '11 sec', cost: '$0.01', status: 'Done' },
      { id: '#2039', name: 'Video · Wan 2.2 clip', host: '@nightowl_render · RTX 3090', time: '40 sec', cost: '$0.06', status: 'Done' },
      { id: '#2038', name: 'Audio · XTTS voice', host: '@synthwave_studio · RTX 4090', time: '15 sec', cost: '$0.02', status: 'Done' },
      { id: '#2037', name: '3D · TripoSR model', host: '@meshmaker · RTX 4070 Ti', time: '25 sec', cost: '$0.04', status: 'Done' }
    ];
    localStorage.setItem('gpuse_jobs', JSON.stringify(jobs));
  }

  function renderJobs() {
    const currentJobs = JSON.parse(localStorage.getItem('gpuse_jobs') || '[]');

    if (!currentJobs || currentJobs.length === 0) {
      if (tableWrap) tableWrap.style.display = 'none';
      if (actionsWrap) actionsWrap.style.display = 'none';
      if (emptyPanel) emptyPanel.style.display = 'block';
      return;
    }

    if (emptyPanel) emptyPanel.style.display = 'none';
    if (tableWrap) tableWrap.style.display = 'block';
    if (actionsWrap) actionsWrap.style.display = 'flex';

    if (!table) return;

    // Retain colgroup & header row
    const colgroup = table.querySelector('colgroup')?.outerHTML || '';
    const headerRow = `
      <tr>
        <th>JOB</th>
        <th>WHAT YOU MADE</th>
        <th>HOST / GPU</th>
        <th>TIME</th>
        <th>COST</th>
        <th>STATUS</th>
      </tr>
    `;

    // Build job rows
    const rowsHtml = currentJobs.map((j) => {
      const isRunning = j.status.toLowerCase() === 'running';
      const statusStyle = isRunning ? 'color: #38bdf8;' : 'color: #22c55e;';
      return `
        <tr>
          <td>${j.id}</td>
          <td>${j.name}</td>
          <td>${j.host}</td>
          <td>${j.time}</td>
          <td>${j.cost}</td>
          <td class="st" style="${statusStyle}">${j.status}</td>
        </tr>
      `;
    }).join('');

    table.innerHTML = colgroup + headerRow + rowsHtml;
  }

  function checkRunningJobs() {
    const currentJobs = JSON.parse(localStorage.getItem('gpuse_jobs') || '[]');
    let updated = false;

    currentJobs.forEach((j) => {
      if (j.status.toLowerCase() === 'running') {
        j.status = 'Done';
        updated = true;
      }
    });

    if (updated) {
      setTimeout(() => {
        localStorage.setItem('gpuse_jobs', JSON.stringify(currentJobs));
        renderJobs();
      }, 4000); // Transitions to 'Done' after 4 seconds
    }
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentJobs = JSON.parse(localStorage.getItem('gpuse_jobs') || '[]');
      const doneJobs = currentJobs.filter((j) => j.status.toLowerCase() === 'done');

      if (doneJobs.length === 0) {
        alert('No completed jobs available to download.');
        return;
      }

      const lastJob = doneJobs[0];
      const fileData = `GPUse Job Result\n------------------\nJob ID: ${lastJob.id}\nItem: ${lastJob.name}\nHost: ${lastJob.host}\nRender Time: ${lastJob.time}\nCost: ${lastJob.cost}\nStatus: Completed`;
      
      const blob = new Blob([fileData], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gpuse-result-${lastJob.id.replace('#', '')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Initial render
  renderJobs();
  checkRunningJobs();
});