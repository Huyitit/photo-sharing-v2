const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const User = require("../db/userModel");
router.post("/", async (request, response) => {
  
});



// /photosOfUser/:id - Return the photos of the user with _id of id. This call generates all the model data needed for the photos view including all the photos of the user as well as the comments on the photos. The photos properties should be (_id, user_id, comments, file_name, date_time) and the comments array elements should have (comment, date_time, _id, user) and only the minimum user object information (_id, first_name, last_name). If something other than the id of a User is provided, the response should be an HTTP status of 400 and an informative message. Note this API will need some assembling from multiple different objects in the database. The asynchronous interface to the database provided by Mongoose means these multiple object fetches can be done concurrently. 
router.get("/:id", async (request, response) => {
  const userId = request.params.id;
try {
  const user = await User.findById(userId).select('_id first_name last_name');
  if (!user) {
    return response.status(400).json("User not found");
  }

  const photos = await Photo.find({ user_id: userId })
    .select('_id date_time file_name location comments')
    .lean(); // 👈 converts to plain JS objects so we can modify them

  const photosWithUsers = await Promise.all(
    photos.map(async (photo) => ({
      ...photo,
      comments: await Promise.all(
        photo.comments.map(async (comment) => {
          const commentUser = await User.findById(comment.user_id)
            .select('_id first_name last_name');
          return {
            ...comment,
            user: commentUser  
        };
        })
      )
    }))
  );

  response.status(200).json(photosWithUsers);
}
  catch(e){
    console.log(e.message);
    response.status(400).json(e.message);
  }
});

module.exports = router;
