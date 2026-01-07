import _extends from "@babel/runtime/helpers/extends";

function mergeObject(obj1, obj2) {
  var result = {};
  Object.keys(obj1).forEach(function (k) {
    if (typeof obj2[k] === 'undefined') {
      result[k] = obj1[k];
      return;
    }

    if (typeof obj2[k] === 'object') {
      if (Array.isArray(obj2[k])) {
        result[k] = [].concat(obj2[k]);
      } else {
        result[k] = mergeObject(obj1[k], obj2[k]);
      }

      return;
    }

    result[k] = obj2[k];
  });
  return result;
}

export default function (defaultConfig) {
  var res = _extends({}, defaultConfig);

  for (var _len = arguments.length, configs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    configs[_key - 1] = arguments[_key];
  }

  configs.forEach(function (conf) {
    // only object
    if (typeof conf !== 'object') {
      return;
    }

    res = mergeObject(res, conf);
  });
  return res;
}