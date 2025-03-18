import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnections = async (req, res) =>{
    try{
        const currentUser = await User.findById(req.user._id).select("connections");

        //find user who are not connected
        const suggestedUser = await User.find({
            _id: {
                $ne:  req.user._id,$nin: currentUser.connections
            }
        }).select("name username profilePicture headline")
        .limit(10);

        res.json(suggestedUser);
    }catch (error){
            console.error("Error in getSuggestedConnections", error);
            res.status(500).json({message: "Server Error"});
    }
};

export const getPublicProfile = async (req, res) =>{ 
    try{
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { $inc: { profileViews: 1 } },
            { new: true }
        ).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found "})
        }
        res.json(user);
    } catch (error){
      console.error("Error in getPublicProfile controller:", error);
      res.status(500).json({message: "server error"});
    }
}; 

export const updateProfile = async (req, res) => {
    try {
      const allowedFields = ["name", "headline","about","location","profilePicture","bannerImg","skills","experience","education"];
      const updateData = {};

      for(const field of allowedFields){
          if(req.body[field] !== undefined){
              updateData[field] = req.body[field];
          }
      }

      if(req.body.profilePicture){
         const result = await cloudinary.uploader.upload(req.body.profilePicture);
         updateData.profilePicture = result.secure_url;
      }
      if(req.body.bannerImg){
          const result = await cloudinary.uploader.upload(req.body.bannerImg);
          updateData.bannerImg = result.secure_url;
      }
      const user = await User.findByIdAndUpdate(req.user._id,{$set: updateData},{new: true}).select("-password");
      res.json(user);
    } catch(error){
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({message: "server error"});
    }
};