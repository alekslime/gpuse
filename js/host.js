var sharingStatus = document.querySelector('.flabel.lime');
var sharingHeading = document.querySelector('.panel-online h3');
var sharingButton = document.querySelector('.panel-online .btn');

if (sharingStatus && sharingHeading && sharingButton) {
  sharingButton.addEventListener('click', function (event) {
    event.preventDefault();
    var isOnline = sharingStatus.textContent.indexOf('ONLINE') !== -1;

    sharingStatus.textContent = isOnline ? 'SHARING — OFFLINE' : 'SHARING — ONLINE';
    sharingHeading.textContent = isOnline
      ? 'RTX 4090 is not accepting jobs'
      : 'RTX 4090 is accepting jobs';
    sharingButton.textContent = isOnline ? 'Start sharing' : 'Stop sharing';
  });
}
