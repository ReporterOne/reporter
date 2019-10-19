import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import styled from 'styled-components';
import GlobalStyle from '~/components/GlobalStyles';


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
            </Route>
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
