(function() {
  var el = document.getElementById("referring_site");
  var val = el.value;
  var newval = val.split("?")[0];
  el.value = newval;
})();
