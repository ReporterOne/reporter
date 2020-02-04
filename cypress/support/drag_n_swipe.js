const getCoords = ($el) => {
  const domRect = $el[0].getBoundingClientRect();
  const coords = {
    x: domRect.left + (domRect.width / 2 || 0),
    y: domRect.top + (domRect.height / 2 || 0)
  };

  return coords
};

function drag(subject, to, opts, _log) {
  const win = subject[0].ownerDocument.defaultView;
  const elFromCoords = (coords) => win.document.elementFromPoint(coords.x, coords.y);
  const winMouseEvent = win.MouseEvent;
  const winPointerEvent = win.PointerEvent;
  const send = (type, coords, el) => {
    el = el || elFromCoords(coords);
    if (!el) return;
    el.dispatchEvent(
      new winMouseEvent(`mouse${type}`, Object.assign({}, {
        clientX: coords.x,
        clientY: coords.y
      }, {bubbles: true, cancelable: true}))
    );
    el.dispatchEvent(
      new winPointerEvent(`pointer${type}`, Object.assign({}, {
        clientX: coords.x,
        clientY: coords.y
      }, {bubbles: true, cancelable: true}))
    )
  };
  const from = getCoords(subject);
  const fromEl = elFromCoords(from);
  _log.snapshot('before', {next: 'after', at: 0});
  _log.set({coords: to});
  send('over', from, fromEl);
  send('down', from, fromEl);
  cy.then(() => {

    return Cypress.Promise.try(() => {
      let steps = opts.steps || 1;
      if (steps > 0) {
        const dx = (to.x - from.x) / steps;
        const dy = (to.y - from.y) / steps;
        return Cypress.Promise.map(Array(steps).fill(), (v, i) => {
          i = steps - 1 - i;
          let _to = {
            x: from.x + dx * (i),
            y: from.y + dy * (i),
          };
          send('move', _to, fromEl);
          return Cypress.Promise.delay(opts.delay);
        }, {concurrency: 1})
      }
    })
      .then(() => {
        send('move', to, fromEl);
        send('over', to);
        send('move', to);
        send('up', to);
        return Cypress.Promise.delay(opts.delayAfter);
      }).then(() => {
        _log.snapshot('after', {at: 1}).end();
        const releasedPos = getCoords(subject);
        send('up', releasedPos);
        return subject;
      })
  })
}

const dragTo = (subject, to, opts) => {
  opts = Cypress._.defaults(opts, {
    // delay inbetween steps
    delay: 10,
    delayAfter: 10,
    // interpolation between coords
    steps: 0,
    // >=10 steps
    smooth: false,
  });

  if (opts.smooth) {
    opts.steps = Math.max(opts.steps, 10)
  }

  const $el = subject;
  const fromCoords = getCoords($el);
  const toCoords = getCoords(cy.$$(to));
  const _log = Cypress.log({
    $el,
    name: 'drag to',
    message: to,
  });

  drag(subject, fromCoords, toCoords, opts, _log)
};

const stringToCoords = {
  up: {x: 0, y: -250},
  down: {x: 0, y: 250},
  left: {x: -250, y: 0},
  right: {x: 250, y: 0}
};

const swipe = (subject, to, opts) => {
  opts = Cypress._.defaults(opts, {
    // delay inbetween steps
    delay: 10,
    delayAfter: 10,
    // interpolation between coords
    steps: 0,
    // >=10 steps
    smooth: true,
  });

  if (typeof(to) === "string") {
    to = stringToCoords[to];
  }

  if (opts.smooth) {
    opts.steps = Math.max(opts.steps, 10)
  }

  const fromCoords = getCoords(subject);
  const toCoords = {
    x: fromCoords.x + to.x,
    y: fromCoords.y + to.y
  };
  const _log = Cypress.log({
    $el: subject,
    name: 'swipe by',
    message: to,
  });
  drag(subject, toCoords, opts, _log)
};

Cypress.Commands.addAll(
  {prevSubject: 'element'},
  {
    dragTo,
    swipe,
    slowSwipe: (subject, to, opts) => {
      opts = Cypress._.defaults(opts, {
        delayAfter: 400,
      });
      swipe(subject, to, opts)
    }
  }
);
