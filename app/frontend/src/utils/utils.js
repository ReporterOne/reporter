export const HERE = 'here';
export const NOT_ANSWERED = 'not_answered';
export const NOT_HERE = 'not_here';
export const ANSWERED = 'answered';


export const deepCopy = (a) => JSON.parse(JSON.stringify(a));

export const iteratePrevCurrentNext = (iterator, callback) => {
  const toRet = [];
  const len = iterator.length;
  for (let i = 0; i < len; i++) {
    if (i === 0) toRet.push(callback({prev: null, current: iterator[i], next: iterator[i + 1]}, i));
    else if (i === len - 1) toRet.push(callback({prev: iterator[i - 1], current: iterator[i], next: null}, i));
    else toRet.push(callback({prev: iterator[i - 1], current: iterator[i], next: iterator[i + 1]}, i));
  }
  return toRet;
};
