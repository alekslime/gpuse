var sharingPanel = document.querySelector('.panel-online');
var sharingStatus = sharingPanel && sharingPanel.querySelector('.flabel');
var sharingHeading = sharingPanel && sharingPanel.querySelector('h3');
var sharingButton = sharingPanel && sharingPanel.querySelector('a.btn');
var dashboardStatus = document.querySelector('.page-head .sub');
var walletPanel = document.querySelector('.grid2 > .panel');
var withdrawButton = walletPanel && walletPanel.querySelector('a.btn-primary');

function showNotice(container, message) {
  if (!container) {
    return;
  }

  var notice = container.querySelector('[data-js-notice]');
  if (!notice) {
    notice = document.createElement('p');
    notice.className = 'panel-sub';
    notice.setAttribute('data-js-notice', '');
    notice.setAttribute('role', 'status');
    container.appendChild(notice);
  }
  notice.textContent = message;
}

function updateSharing(isOnline) {
  if (!sharingStatus || !sharingHeading || !sharingButton) {
    return;
  }

  sharingStatus.textContent = isOnline ? 'SHARING — ONLINE' : 'SHARING — OFFLINE';
  sharingStatus.classList.toggle('lime', isOnline);
  sharingHeading.textContent = isOnline
    ? 'RTX 4090 is accepting jobs'
    : 'RTX 4090 is not accepting jobs';
  sharingButton.textContent = isOnline ? 'Stop sharing' : 'Start sharing';
  if (sharingPanel) {
    sharingPanel.classList.toggle('panel-online', isOnline);
  }
  if (dashboardStatus) {
    dashboardStatus.textContent = isOnline
      ? 'Good evening, @pixelforge. Your PC is online and ready for jobs.'
      : 'Good evening, @pixelforge. Your PC is offline and not accepting jobs.';
  }
}

if (sharingStatus && sharingHeading && sharingButton) {
  var sharingEnabled = true;

  try {
    var savedSharingState = window.localStorage.getItem('gpuse.hosting.enabled');
    if (savedSharingState !== null) {
      sharingEnabled = savedSharingState === 'true';
    }
  } catch (error) {
    showNotice(sharingPanel, 'Sharing state could not be loaded from browser storage.');
  }

  updateSharing(sharingEnabled);
  sharingButton.addEventListener('click', function (event) {
    event.preventDefault();
    sharingEnabled = !sharingEnabled;
    updateSharing(sharingEnabled);

    try {
      window.localStorage.setItem('gpuse.hosting.enabled', String(sharingEnabled));
    } catch (error) {
      showNotice(sharingPanel, 'Sharing changed for this page, but could not be saved in browser storage.');
    }
  });
}

if (withdrawButton) {
  withdrawButton.addEventListener('click', function (event) {
    event.preventDefault();
    showNotice(walletPanel, 'Withdrawals are not connected in this demo; no money was moved.');
  });
}
