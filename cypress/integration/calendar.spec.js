function move(element, x, y) {
  element
    .wait(100)
    .trigger("pointerdown")
    .wait(100)
    .trigger("pointermove", {pageX: x, pageY: y, clientX: x, clientY: y})
    .wait(100)
    .trigger("pointerup", {force: true})
    .wait(100)
}

function drag(draggable, amount) {
  // const draggable = Cypress.$('#cdk-drop-list-0 > :nth-child(1)')[0]  // Pick up this
  // const droppable = Cypress.$('#cdk-drop-list-1 > :nth-child(4)')[0]  // Drop over this

  // const coords = droppable.getBoundingClientRect()
  draggable.dispatchEvent(new MouseEvent('mousedown'));
  draggable.dispatchEvent(new MouseEvent('mousemove', {clientX: 10, clientY: 0}));
  draggable.dispatchEvent(new MouseEvent('mousemove', {
    clientX: 10 + amount,
    clientY: 10  // A few extra pixels to get the ordering right
  }));
  draggable.dispatchEvent(new MouseEvent('mouseup'));
}

function moveMouse(element, x, y) {
  const pointerEvent = {
    force: true,
    pointerType: 'touch',
    pageX: x,
    pageY: y,
    clientX: x,
    clientY: y,
  };

  element
    .wait(100)
    .trigger("pointerdown", pointerEvent)
    .wait(100)
    .trigger("pointermove", pointerEvent)
    .wait(100)
    .trigger("pointerup", pointerEvent)
}


context('Calendar', () => {
  beforeEach(() => {
    cy.request({
      url: '/api/login',
      method: 'post',
      form: true,
      body: {
        username: 'elran',
        password: '123456'
      }
    }).its('body').then((data) => {
      localStorage.setItem('token', data.access_token)
    });

    cy.viewport('iphone-6');
    cy.visit('/');
    cy.wait(1000) // wait for page load
  });

  it('swipe left', () => {
    // move(cy.get(".AttendingHandle"), 300, 0);

    cy.get(".AttendingHandle").swipe({x: 100, y: 0}, {smooth: false});
    // cy.get(".CalendarContainer").swipe({draw: true}, [[100, 0], [200, 0]])
    // const draggable = Cypress.$('.CalendarContainer')[0]  // Pick up this
    // console.log(draggable);
    // drag(draggable, 300);
    cy.get('.CalendarContainer')
      .swipe({x: 100, y: 0})
      .swipe({x: 100, y: 0})
      .swipe({x: 100, y: 0})
      .swipe({x: 100, y: 0})
  })

});
