import React from 'react';
import { StylesProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { DrawerMenu, Drawer, DrawerContent } from '~/components/Menu';
import { GlobalStyle, theme } from '~/components/common';
import { Dashboard } from '~/screens';
import AppContext from './AppContext.jsx';


const App = (props) => {

  return (
    <>
      <StylesProvider injectFirst>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{}}>
            <Drawer>
              <DrawerMenu>
              </DrawerMenu>
              <DrawerContent>
                <Router>
                  <Switch>
                    <Route path="/">
                      <Dashboard />
                    </Route>
                  </Switch>
                </Router>
              </DrawerContent>
            </Drawer>
          </AppContext.Provider>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

export default App;
