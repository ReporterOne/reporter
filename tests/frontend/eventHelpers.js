// function createClientXY(x, y) {
//   return { clientX: x, clientY: y };
// }
//
// export function createStartTouchEventObject({ x = 0, y = 0 }) {
//   return { touches: [createClientXY(x, y)] };
// }
//
// export function createMoveTouchEventObject({ x = 0, y = 0}) {
//   return { changedTouches: [createClientXY(x, y)] };
// }

function createClientXYObject(x, y) {
  return { clientX: x, clientY: y }
}
const preventDefault = () => {}
export function createTouchEventObject({ x, y, ...rest }) {
  return {
    touches: [createClientXYObject(x, y)],
    preventDefault,
    ...rest
  }
}

export function createMouseEventObject({ x, y, ...rest }) {
  return {
    ...createClientXYObject(x, y),
    preventDefault,
    ...rest
  }
}