/**
 * UserPhotos Component
 * Displays all photos for a specific user with comments
 * Fetches data from /photosOfUser/:id endpoint
 */

import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Button,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack, Comment as CommentIcon } from "@material-ui/icons";
import { formatDistanceToNow, format } from "date-fns";
import { fetchModel, getUserById } from "../../lib/fetchModelData";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  photoCard: {
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[4],
  },
  cardMedia: {
    height: 400,
    backgroundColor: "#f5f5f5",
  },
  cardContent: {
    paddingBottom: theme.spacing(2),
  },
  photoDate: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    fontSize: "0.875rem",
  },
  commentsSection: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  commentsSectionTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1.5),
  },
  comment: {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    backgroundColor: "#f9f9f9",
    borderRadius: theme.spacing(1),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  commentAuthorLink: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    fontWeight: "bold",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  commentTime: {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(1),
  },
  commentText: {
    marginTop: theme.spacing(0.5),
    color: theme.palette.text.primary,
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
  noComments: {
    fontStyle: "italic",
    color: theme.palette.text.secondary,
    fontSize: "0.875rem",
  },
}));

export default function UserPhotos() {
  const classes = useStyles();
  const { userId } = useParams();
  const history = useHistory();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch photos for the user on component mount or when userId changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchModel(`/photosOfUser/${userId}`)
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load photos");
        setLoading(false);
      });
  }, [userId]);

  // Navigate back to user detail page
  const handleBack = () => {
    history.push(`/users/${userId}`);
  };

  // Navigate to comment author's detail page
  const handleCommentAuthorClick = (authorId) => {
    if (authorId !== userId) {
      history.push(`/users/${authorId}`);
    }
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

  if (photos.length === 0) {
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
        <Box className={classes.emptyState}>
          <Typography variant="h6">No photos found</Typography>
          <Typography variant="body2" color="textSecondary">
            This user hasn't posted any photos yet.
          </Typography>
        </Box>
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
          Back to Profile
        </Button>
      </Box>

      {/* Title */}
      <Typography variant="h4" className={classes.title} gutterBottom>
        Photos
      </Typography>

      {/* Photos Grid */}
      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} key={photo.id}>
            <Card className={classes.photoCard}>
              {/* Photo Image */}
              <CardMedia
                className={classes.cardMedia}
                image={photo.imageUrl}
                title="Photo"
              />

              <CardContent className={classes.cardContent}>
                {/* Photo Creation Date */}
                <Typography variant="body2" className={classes.photoDate}>
                  📅 Posted on {format(new Date(photo.createdDate), "PPP p")}
                </Typography>

                {/* Comments Section */}
                {photo.comments && photo.comments.length > 0 ? (
                  <Box className={classes.commentsSection}>
                    <Typography
                      variant="subtitle2"
                      className={classes.commentsSectionTitle}
                    >
                      <CommentIcon
                        style={{ marginRight: "8px", verticalAlign: "middle" }}
                        fontSize="small"
                      />
                      Comments ({photo.comments.length})
                    </Typography>

                    {photo.comments.map((comment, index) => {
                      const author = getUserById(comment.author);
                      const authorName = author
                        ? `${author.firstName} ${author.lastName}`
                        : "Unknown User";

                      return (
                        <Paper
                          key={index}
                          className={classes.comment}
                          elevation={0}
                        >
                          {/* Comment Header: Author & Time */}
                          <Box className={classes.commentHeader}>
                            <span
                              onClick={() =>
                                comment.author !== userId &&
                                handleCommentAuthorClick(comment.author)
                              }
                              className={classes.commentAuthorLink}
                              style={{
                                cursor:
                                  comment.author !== userId
                                    ? "pointer"
                                    : "default",
                                color:
                                  comment.author !== userId
                                    ? "#1976d2"
                                    : "inherit",
                                fontWeight: "bold",
                              }}
                            >
                              {authorName}
                            </span>
                            <span className={classes.commentTime}>
                              {formatDistanceToNow(
                                new Date(comment.createdDate),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </Box>

                          {/* Comment Text */}
                          <Typography
                            variant="body2"
                            className={classes.commentText}
                          >
                            {comment.text}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                ) : (
                  <Box className={classes.commentsSection}>
                    <Typography
                      variant="body2"
                      className={classes.noComments}
                    >
                      No comments yet. Be the first to comment!
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
