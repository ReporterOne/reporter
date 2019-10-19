import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import {GlobalStyle, Container} from '~/components/common';
import {Dashboard} from '~/screens';


const App = (props) => {

  return (
    <>
      <GlobalStyle />
      <Container stretched>
        <Router>
          <Switch>
            <Route path="/">
              <Dashboard />
            </Route>
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
