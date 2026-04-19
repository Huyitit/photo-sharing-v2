const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {
  
});



router.get("/list", async (request, response)=>{
    try{
        const users = await User.find().select('_id first_name last_name');
        response.status(200).send(users);
    }
    catch (e){
        console.log(e.message);
        response.status(400).json(e.message);
    }
})

// Get by Id
router.get("/:id", async (req, res)=>{
    const id = req.params.id;
    try{
        const curUser = await User.findById(id).select(
            '_id first_name last_name location description occupation');
        res.status(200).json(curUser);
    }
    catch(e){
        console.log(e.message);
        res.status(400).send(e.message);    
    }
})
module.exports = router;