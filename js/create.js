var runButton = document.querySelector('.panel .btn-block');
var downloadButton = document.querySelector('.result .btn-row .btn');
var cancelButton = document.querySelector('.result .btn-row .btn:nth-child(2)');
var jobStatus = document.querySelector('.result .running');
var progressFill = document.querySelector('.progress > div');
var hostLine = document.querySelector('.result .host-line');
var previewTitle = document.querySelector('.preview h3');
var previewDescription = document.querySelector('.preview p');
var jobTimer = null;
var progressStep = 2;

function updateJobProgress(step) {
  progressStep = step;

  if (progressFill) {
    progressFill.style.width = (step / 4 * 100) + '%';
  }

  if (jobStatus) {
    jobStatus.textContent = step === 4
      ? 'Complete · 4 of 4 images · demo'
      : 'Running · ' + step + ' of 4 images · demo';
  }
}

function setCancelEnabled(enabled) {
  if (cancelButton) {
    cancelButton.setAttribute('aria-disabled', enabled ? 'false' : 'true');
  }
}

function startDemoJob(startAt) {
  if (jobTimer) {
    window.clearInterval(jobTimer);
  }

  if (previewTitle) {
    previewTitle.textContent = 'Generating placeholder result';
  }
  if (previewDescription) {
    previewDescription.textContent = 'This demo simulates job progress; no GPU job is submitted.';
  }
  if (hostLine) {
    hostLine.textContent = 'Demo job · Generating placeholder progress';
  }
  if (runButton) {
    runButton.textContent = 'Run again on @pixelforge';
  }
  if (cancelButton) {
    cancelButton.textContent = 'Cancel job';
  }

  updateJobProgress(startAt);
  setCancelEnabled(true);

  jobTimer = window.setInterval(function () {
    updateJobProgress(progressStep + 1);

    if (progressStep >= 4) {
      window.clearInterval(jobTimer);
      jobTimer = null;
      setCancelEnabled(false);
      if (cancelButton) {
        cancelButton.textContent = 'Job complete';
      }
      if (previewTitle) {
        previewTitle.textContent = 'Placeholder result ready';
      }
      if (previewDescription) {
        previewDescription.textContent = 'This is a demo result. Download the placeholder file below.';
      }
      if (hostLine) {
        hostLine.textContent = 'Demo job complete · No GPU job was submitted';
      }
    }
  }, 900);
}

if (runButton) {
  runButton.addEventListener('click', function (event) {
    event.preventDefault();
    startDemoJob(0);
  });
}

if (cancelButton) {
  cancelButton.addEventListener('click', function (event) {
    event.preventDefault();
    if (!jobTimer) {
      return;
    }

    window.clearInterval(jobTimer);
    jobTimer = null;
    updateJobProgress(0);
    setCancelEnabled(false);

    if (jobStatus) {
      jobStatus.textContent = 'Canceled';
    }
    if (cancelButton) {
      cancelButton.textContent = 'Job canceled';
    }
    if (hostLine) {
      hostLine.textContent = 'Demo job canceled · No GPU job was submitted';
    }
    if (previewTitle) {
      previewTitle.textContent = 'Job canceled';
    }
    if (previewDescription) {
      previewDescription.textContent = 'Start another demo job or download the placeholder file.';
    }
  });
}

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
    window.setTimeout(function () {
      URL.revokeObjectURL(fileUrl);
    }, 1000);
  });
}

if (jobStatus && jobStatus.textContent.indexOf('Running') !== -1) {
  startDemoJob(progressStep);
}
