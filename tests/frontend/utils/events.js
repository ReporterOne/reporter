export const createBubbledEvent = (type, props = {}) => {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, props);
  return event;
};
