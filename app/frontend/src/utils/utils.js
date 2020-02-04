export const HERE = 'here';
export const NOT_ANSWERED = 'not_answered';
export const NOT_HERE = 'not_here';


export const iteratePrevCurrentNext = (iterator, callback) => {
  const toRet = {};
  const len = iterator.length;
  for (let i = 0; i < len; i++) {
    if (i === 0) toRet[i + 1] = callback({prev: null, current: iterator[i], next: iterator[i + 1]}, i);
    else if (i === len - 1) toRet[i + 1] = callback({prev: iterator[i - 1], current: iterator[i], next: null}, i);
    else toRet[i + 1] = callback({prev: iterator[i - 1], current: iterator[i], next: iterator[i + 1]}, i);
  }
  return toRet;
};
