document.querySelectorAll('.model-row').forEach(function (row) {
  var checkbox = row.querySelector('.cb');
  var priceField = row.querySelector('.price-field');

  if (!checkbox || !priceField) {
    return;
  }

  var unavailable = priceField.disabled;

  checkbox.addEventListener('change', function () {
    priceField.disabled = unavailable || !checkbox.checked;
  });
});
