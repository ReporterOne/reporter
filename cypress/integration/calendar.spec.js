const login = () => {
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
};

context('Calendar', () => {
  beforeEach(() => {
    login();
    cy.visit('/');
  });

  it('swipe left', () => {
    cy.get(".AttendingHandle")
      .swipe("right");

    cy.get('.CalendarContainer')
      .swipe("left")
      .swipe("left")
      .swipe("left")
      .swipe("right")
      .swipe("right")
      .swipe("right")
  })
});
