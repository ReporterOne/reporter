const login = () => {
  cy.request({
    url: '/api/login',
    method: 'post',
    form: true,
    body: {
      username: 'one_report',
      password: 'one_report'
    }
  }).its('body').then((data) => {
    localStorage.setItem('token', data.access_token)
  });
};

context('Calendar', () => {
  beforeEach(() => {
    login();
    cy.noSWVisit('/');
  });

  it('swipe left', () => {
    cy.get(".AttendingHandle")
      .swipe("right");

    cy.get('.CalendarContainer').swipe("left");
    cy.get('.CalendarContainer').swipe("left");
    cy.get('.CalendarContainer').swipe("left");
    cy.get('.CalendarContainer').swipe("right");
    cy.get('.CalendarContainer').swipe("right");
    cy.get('.CalendarContainer').swipe("left");
  })
});
