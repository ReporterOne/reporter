import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components';
import GlobalStyle from '~/components/GlobalStyles.js';
import Calender from '~/components/Calendar'

const App = (props) => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    `;

  return (
    <>
      <GlobalStyle />
      <Container>
        <Router>
          <Switch>
            <Route path="/">
              {/* <Dashboard /> */}
              <Calender />
            </Route>
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
