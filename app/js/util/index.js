'use strict';
export default {
  getFormData,
  switcher,
  round: R.curry(round)
};

function getFormData (form) {
  return R.pipe(
    R.invoke('querySelectorAll', ['[name]']),
    R.map(switcher(basicInputs, checkbox, radio)),
    R.fromPairs)(form);

    function basicInputs (field) {
      if (R.contains(field.type, ['email', 'password', 'text', 'textarea', 'select-one'])) {
        return [field.name, field.value]
      }
    }
    function checkbox (field) {
      if (field.type === 'checkbox') {
        return [field.name, field.checked]
      }
    }
    function radio (field) {
      if (field.type === 'radio' && field.checked) {
        return [field.name, field.value]
      }
    }
}

function switcher () {
  var functions = Array.prototype.slice.call(arguments);
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var i;
    var result = null;
    var func;
    for(i = 0; i < functions.length; i ++) {
      func = functions[i];
      result = func.apply(func, args);
      if (result) {
        return result;
      }
    }
    return null;
  };
}

function round (decimal, number) {
  let decimalMultiplier = Math.pow(10, decimal);
  return Math.round(number * decimalMultiplier) / decimalMultiplier;
}
