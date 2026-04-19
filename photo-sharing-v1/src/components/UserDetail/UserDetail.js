/**
 * UserDetail Component
 * Displays detailed information about a single user
 * Fetches data from /user/:id endpoint
 */

import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { fetchModel } from "../../lib/fetchModelData";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  card: {
    marginTop: theme.spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  userName: {
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
  },
  infoSection: {
    marginBottom: theme.spacing(2),
  },
  label: {
    fontWeight: "bold",
    marginBottom: theme.spacing(0.5),
  },
  buttonsContainer: {
    marginTop: theme.spacing(3),
    display: "flex",
    gap: theme.spacing(1),
  },
  photosButton: {
    marginRight: theme.spacing(1),
  },
}));

export default function UserDetail() {
  const classes = useStyles();
  const { userId } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details on component mount or when userId changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load user details");
        setLoading(false);
      });
  }, [userId]);

  // Navigate back to user list
  const handleBack = () => {
    history.push("/users");
  };

  // Navigate to user's photos
  const handleViewPhotos = () => {
    history.push(`/users/${userId}/photos`);
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
        <Box className={classes.header}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            className={classes.backButton}
          >
            Back
          </Button>
        </Box>
        <Paper style={{ padding: "16px", backgroundColor: "#ffebee", color: "#c62828", marginTop: "20px" }}>
          <Typography variant="body2"><strong>Error:</strong> {error}</Typography>
        </Paper>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className={classes.container}>
        <Box className={classes.header}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            className={classes.backButton}
          >
            Back
          </Button>
        </Box>
        <Paper style={{ padding: "16px", backgroundColor: "#fff3e0", color: "#e65100", marginTop: "20px" }}>
          <Typography variant="body2"><strong>Warning:</strong> User not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container className={classes.container}>
      {/* Back Button */}
      <Box className={classes.header}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          className={classes.backButton}
        >
          Back to Users
        </Button>
      </Box>

      {/* User Details Card */}
      <Card className={classes.card}>
        <CardContent>
          {/* User Name */}
          <Typography variant="h4" className={classes.userName}>
            {user.firstName} {user.lastName}
          </Typography>

          {/* User Info Sections */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box className={classes.infoSection}>
                <Typography variant="subtitle2" className={classes.label}>
                  Occupation
                </Typography>
                <Typography variant="body1">{user.occupation}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box className={classes.infoSection}>
                <Typography variant="subtitle2" className={classes.label}>
                  Location
                </Typography>
                <Typography variant="body1">{user.location}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box className={classes.infoSection}>
                <Typography variant="subtitle2" className={classes.label}>
                  About
                </Typography>
                <Typography variant="body1">{user.description}</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box className={classes.buttonsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewPhotos}
              className={classes.photosButton}
            >
              View Photos
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
