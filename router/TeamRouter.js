const express=require('express')
const router=express.Router();
const User=require('../models/userModel')
const Team=require('../models/teamModel')

const createTeam=async(req,res)=>{
  if(!(req.body.userIds && req.body.name)){
res.status(404).json({
  "message":"Team name is required or User is missing"
})
return;
  }
    const selectedUserIds = req.body.userIds;

    try {
      // Validate selected users
      const selectedUsers = await User.find({ id: { $in: selectedUserIds } });
  
      // Check for unique domains and availability
      const domainSet = new Set();
  
      for (const user of selectedUsers) {
        if (domainSet.has(user.domain) || !user.available) {
          return res.status(404).json({"message":"domain should be unique and user should be available ", error: 'Invalid user selection' });
        }
        domainSet.add(user.domain);
      }
  
      const teamData = {
        name: req.body.name, 
        users: selectedUsers.map(user => ({ userId: user.id})),
      };
  
      const team = await Team.create(teamData);
  
      res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        res.status(500).json({ "message":"Team name already exits"});
        return;
      }
      console.error('Error creating team:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}



router.route('/create/team').post(createTeam);

const showTeam=async(req,res)=>{
  try{
    const team=await Team.find({});
    res.status(200).json({
      team
    })
  }catch(err){
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
router.route('/team').get(showTeam);

const ShowTeamDetails = async (req, res) => {
  try {
    const teamId = String(req.query.teamId);

    if (!teamId) {
      return res.status(404).json({ "message": "Not Found" });
    }
  
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ "message": "Team Not Found" });
    }

    // Extract user ids from the team
    const userIds = team.users.map(user => user.userId);
    // Find user details in the User model
    const usersDetails = await User.find({ id: { $in: userIds } });
   

    res.status(200).json({
      teamDetails: usersDetails,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// router.route('/team').get(showTeam);
router.route('/showTeamDetails').get(ShowTeamDetails);


module.exports=router;