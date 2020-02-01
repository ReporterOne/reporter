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
    cy.visitMobile('/', {draw: true});
    cy.wait(1000) // wait for page load
  });

  it('swipe left', () => {
    move(cy.get(".AttendingHandle"), 300, 0);
    cy.get(".CalendarContainer").swipe({draw: true}, [[100, 0], [200, 0]])
  })

});
