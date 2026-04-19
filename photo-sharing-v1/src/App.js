/**
 * Main App Component
 * Sets up React Router for the Photo Sharing Application
 * Renders TopBar on all pages + Route-specific components
 */

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Box } from "@material-ui/core";
import TopBar from "./components/TopBar/TopBar";
import UserList from "./components/UserList/UserList";
import UserDetail from "./components/UserDetail/UserDetail";
import UserPhotos from "./components/UserPhotos/UserPhotos";

function App() {
  return (
    <Router>
      <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* TopBar rendered on all routes */}
        <TopBar />

        {/* Routes */}
        <Box style={{ flex: 1 }}>
          <Switch>
            {/* Default route: /users - User List */}
            <Route exact path="/users" component={UserList} />

            {/* User Detail Page: /users/:userId */}
            <Route exact path="/users/:userId" component={UserDetail} />

            {/* User Photos Page: /users/:userId/photos */}
            <Route exact path="/users/:userId/photos" component={UserPhotos} />

            {/* Root redirect: / -> /users */}
            <Route exact path="/">
              <Redirect to="/users" />
            </Route>

            {/* Catch-all: redirect unknown routes to /users */}
            <Route path="*">
              <Redirect to="/users" />
            </Route>
          </Switch>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
