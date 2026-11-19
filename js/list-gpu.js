var modelRows = Array.prototype.slice.call(document.querySelectorAll('.model-row'));
var saveButton = document.querySelector('.actions .btn-primary');
var actionsPanel = document.querySelector('.actions');

function showListNotice(message) {
  if (!actionsPanel) {
    return;
  }

  var notice = actionsPanel.querySelector('[data-js-notice]');
  if (!notice) {
    notice = document.createElement('p');
    notice.className = 'panel-sub';
    notice.setAttribute('data-js-notice', '');
    notice.setAttribute('role', 'status');
    actionsPanel.appendChild(notice);
  }
  notice.textContent = message;
}

modelRows.forEach(function (row) {
  var checkbox = row.querySelector('.cb');
  var priceField = row.querySelector('.price-field');

  if (!checkbox || !priceField) {
    return;
  }

  var unavailable = checkbox.disabled || priceField.disabled;
  checkbox.disabled = unavailable;
  priceField.disabled = unavailable || !checkbox.checked;

  checkbox.addEventListener('change', function () {
    priceField.disabled = unavailable || !checkbox.checked;
  });
});

if (saveButton) {
  saveButton.addEventListener('click', function (event) {
    event.preventDefault();

    var selectedModels = [];
    for (var index = 0; index < modelRows.length; index += 1) {
      var row = modelRows[index];
      var checkbox = row.querySelector('.cb');
      var priceField = row.querySelector('.price-field');

      if (!checkbox || !priceField || !checkbox.checked) {
        continue;
      }

      var priceMatch = priceField.value.match(/^\s*\$?\s*(\d+(?:\.\d{1,4})?)/);
      var price = priceMatch ? Number(priceMatch[1]) : NaN;
      if (!isFinite(price) || price <= 0) {
        showListNotice('Enter a valid positive price for each selected model.');
        priceField.focus();
        return;
      }

      selectedModels.push({
        name: row.querySelector('.model-name').textContent.trim(),
        price: priceField.value.trim()
      });
    }

    if (selectedModels.length === 0) {
      showListNotice('Select at least one model before starting hosting.');
      return;
    }

    var settings = {
      models: selectedModels,
      available: document.querySelector('#available').value,
      maxHours: document.querySelector('#max-hours').value,
      pauseWhenBusy: document.querySelector('#pause').value
    };

    try {
      window.localStorage.setItem('gpuse.hosting.config', JSON.stringify(settings));
      window.localStorage.setItem('gpuse.hosting.enabled', 'true');
    } catch (error) {
      showListNotice('Your settings could not be saved in browser storage. Nothing was changed.');
      return;
    }

    window.location.href = saveButton.href;
  });
}
