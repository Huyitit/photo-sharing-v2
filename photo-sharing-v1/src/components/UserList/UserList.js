/**
 * UserList Component
 * Displays a list of all users with clickable navigation to detail pages
 * Fetches data from /user/list endpoint
 */

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
} from "@material-ui/core"; // eslint-disable-next-line no-unused-vars
import { makeStyles } from "@material-ui/core/styles";
import { fetchModel } from "../../lib/fetchModelData";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  card: {
    marginBottom: theme.spacing(2),
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
  },
  cardContent: {
    paddingBottom: theme.spacing(2),
  },
  userName: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
  },
  userInfo: {
    marginBottom: theme.spacing(0.5),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

export default function UserList() {
  const classes = useStyles();
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchModel("/user/list")
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load users");
        setLoading(false);
      });
  }, []);

  // Handle user card click - navigate to detail page
  const handleUserClick = (userId) => {
    history.push(`/users/${userId}`);
  };

  if (loading) {
    return (
      <Container className={classes.container}>
        <Box className={classes.loadingContainer}>
          <CircularProgress size={50} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Paper style={{ padding: "16px", backgroundColor: "#ffebee", color: "#c62828", marginTop: "20px" }}>
          <Typography variant="body2"><strong>Error:</strong> {error}</Typography>
        </Paper>
      </Container>
    );
  }

  if (users.length === 0) {
    return (
      <Container className={classes.container}>
        <Box className={classes.emptyState}>
          <Typography variant="h6">No users found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      <Box marginBottom={3}>
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Click on a user to view their details and photos
        </Typography>
      </Box>

      {users.map((user) => (
        <Card
          key={user.id}
          className={classes.card}
          onClick={() => handleUserClick(user.id)}
        >
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" className={classes.userName}>
              {user.firstName} {user.lastName}
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.userInfo}
            >
              <strong>Occupation:</strong> {user.occupation}
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.userInfo}
            >
              <strong>Location:</strong> {user.location}
            </Typography>

            <Typography
              variant="body2"
              color="textSecondary"
              className={classes.userInfo}
            >
              <strong>About:</strong> {user.description}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
