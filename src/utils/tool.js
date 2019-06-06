export function deepClone (obj) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let objArray = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 如果obj的属性是对象，递归操作
        if (obj[key] && typeof obj[key] === 'object') {
          objArray[key] = deepClone(obj[key])
        } else {
          objArray[key] = obj[key]
        }
      }
    }
  }
  return objArray
}

export function isEmpty(obj) {
  // 判断字符是否为空的方法
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true
  }
  return false
}
export function isRepeat(arr) {
  var hash = {}
  for (var i in arr) {
    if (hash[arr[i]]) {
      return true
    }
    hash[arr[i]] = true
  }
  return false
}
export function throttle(func, deltaX) {
  let lastCalledAt = new Date().getTime()
  return function() {
    if(new Date().getTime() - lastCalledAt >= deltaX) {
      func.apply(this, arguments)
      lastCalledAt = new Date().getTime()
    }
  }
}