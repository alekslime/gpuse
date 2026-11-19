var downloadButton = document.querySelector('.result .btn-row .btn');

if (downloadButton) {
  downloadButton.addEventListener('click', function (event) {
    event.preventDefault();
    var file = new Blob(
      ['This is a placeholder for your generated result.'],
      { type: 'text/plain' }
    );
    var fileUrl = URL.createObjectURL(file);
    var link = document.createElement('a');

    link.href = fileUrl;
    link.download = 'gpuse-result-placeholder.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(fileUrl);
    }, 1000);
  });
}
