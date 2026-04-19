/**
 * TopBar Component
 * Displays header with context-aware information based on current route
 * Left: App title
 * Right: Current context (user name or photo of user name)
 */

import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { fetchModel } from "../../lib/fetchModelData"; // eslint-disable-next-line no-unused-vars

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: "#1976d2",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  contextInfo: {
    fontSize: "1rem",
    fontWeight: 500,
  },
}));

export default function TopBar() {
  const classes = useStyles();
  const location = useLocation();
  const params = useParams();
  const [contextText, setContextText] = useState("");

  useEffect(() => {
    // Determine context based on current route
    const path = location.pathname;

    if (path.includes("/photos")) {
      // Route: /users/:userId/photos
      if (params.userId) {
        fetchModel(`/user/${params.userId}`)
          .then((user) => {
            setContextText(`Photos of ${user.firstName} ${user.lastName}`);
          })
          .catch(() => {
            setContextText("Photos");
          });
      }
    } else if (path.includes("/users/") && params.userId) {
      // Route: /users/:userId (detail page)
      fetchModel(`/user/${params.userId}`)
        .then((user) => {
          setContextText(`${user.firstName} ${user.lastName}`);
        })
        .catch(() => {
          setContextText("User");
        });
    } else {
      // Route: /users (list page)
      setContextText("Users");
    }
  }, [location.pathname, params.userId]);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            📸 Photo Sharing
          </Typography>
          <Typography variant="body1" className={classes.contextInfo}>
            {contextText}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
