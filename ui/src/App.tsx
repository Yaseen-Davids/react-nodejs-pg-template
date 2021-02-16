import React, { FC, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import styled from "styled-components";
import SnackbarProvider from "react-simple-snackbar";

import { Login } from "./pages/Login";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { LoginGuard } from "./pages/Login/LoginGuard";
import { Loading } from "./models/loading";
import { LoginProvider } from "./contexts/LoginContext";
import { PageHeader } from "./components/PageHeader";
import { PermissionsProvider } from "./contexts/PermissionsContext";
import { Register } from "./pages/Register";
import { TokenLoginProvider } from "./contexts/TokenLoginContext";

const shouldLoad = (loading: Loading) => {
  return !loading.loading && !loading.loaded && !loading.error;
};

export const HydrateUser = () => {
  const { loading, hydrateUser } = React.useContext(UserContext);
  React.useEffect(() => {
    if (shouldLoad(loading)) {
      hydrateUser();
    }
  }, [loading]);
  return null;
};

const App: FC = () => {
  useEffect(() => {
    const resizeWindow = () => {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      let vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    window.addEventListener("resize", resizeWindow);
  }, []);

  return (
    <Router>
      <TokenLoginProvider>
        <LoginProvider>
          <Route component={LoginGuard} />
          <UserProvider>
            <Route component={HydrateUser} />
            <SnackbarProvider>
              <Route
                render={() => (
                  <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <PermissionsProvider>
                      <Container>
                        <PageHeader />
                        <Content>
                          <Route path="/" exact>
                            <Container></Container>
                          </Route>
                        </Content>
                      </Container>
                    </PermissionsProvider>
                  </Switch>
                )}
              />
            </SnackbarProvider>
          </UserProvider>
        </LoginProvider>
      </TokenLoginProvider>
    </Router>
  )
};

const Container = styled.div`
  height: 100vh;
  display: grid;
  grid-template-areas: 
    "header"
    "content"
  ;
  grid-template-rows: min-content 1fr;
  background-color: #121212;
`;

const Content = styled.div`
  grid-area: content;
  overflow: hidden;
`;

export default App;
