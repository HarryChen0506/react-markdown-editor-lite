export function deepClone(obj: any) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  const objArray: any = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // 如果obj的属性是对象，递归操作
        if (obj[key] && typeof obj[key] === 'object') {
          objArray[key] = deepClone(obj[key]);
        } else {
          objArray[key] = obj[key];
        }
      }
    }
  }
  return objArray;
}

export function isEmpty(obj: any) {
  // 判断字符是否为空的方法
  return typeof obj === 'undefined' || obj === null || obj === '';
}

export function isPromise(obj: any): obj is Promise<any> {
  return (
    obj &&
    (obj instanceof Promise ||
      ((typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'))
  );
}

export function repeat(str: string, num: number) {
  let result = '';
  let n = num;
  while (n--) {
    result += str;
  }
  return result;
}

export function isKeyMatch(event: React.KeyboardEvent<HTMLDivElement>, keyCode: number, key?: string, withKey?: any) {
  if (withKey && withKey.length > 0) {
    for (const it of withKey) {
      // @ts-ignore
      if (typeof event[it] !== 'undefined' && !event[it]) {
        return false;
      }
    }
  } else {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false;
    }
  }
  if (event.key) {
    return event.key === key;
  } else {
    return event.keyCode === keyCode;
  }
}
