export function deepClone(obj: any) {
  if (!obj || typeof obj !== 'object') {
    return obj
  }
  let objArray: any = Array.isArray(obj) ? [] : {}
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

export function isEmpty(obj: any) {
  // 判断字符是否为空的方法
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true
  }
  return false
}

export function isRepeat(arr: any[]) {
  const hash: any = {};
  for (const i in arr) {
    if (hash[arr[i]]) {
      return true
    }
    hash[arr[i]] = true
  }
  return false
}

export function throttle(func: any, deltaX: number) {
  let lastCalledAt = new Date().getTime()
  return function(this: any) {
    if (new Date().getTime() - lastCalledAt >= deltaX) {
      func.apply(this, arguments)
      lastCalledAt = new Date().getTime()
    }
  }
}