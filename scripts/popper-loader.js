/**
  Looks like Bootstrap 4 needs a global version of Popper to work! This hackish module gets Popper.js and then puts it in global scope.
*/
define(["popperjs"], function(popper) {
  window.Popper = popper;
  return popper;
});