import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Menu from '~/components/Menu'
import { GlobalStyle, Container, theme } from '~/components/common';
import Dashboard from '@/Dashboard';


const App = (props) => {

  return (
    <>
      <GlobalStyle />
      <Container stretched background={theme.main}>
        <Menu/>
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
