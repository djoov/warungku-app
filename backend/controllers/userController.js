import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"


// login user part

const loginUser = async (req, res) => {
    const {email,password} = req.body;
    try {
        //checking is user already available
        const user = await userModel.findOne({email});
        if(!user){
            //so if no user is not found this hapend
            return res.json({success:false,message:"User not found"})
        }

        const isMatch = await bcrypt.compare(password,user.password); //parse 2 argument password in the database and the user passwrod if the password match then its goin
        if (!isMatch) {
            return res.json({success:false,message:"Password not match"})
        }
        //if the password match
        const token = createToken(user._id);
        res.json({success:true,token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }

}
//basicly we generated one token for user new user
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user 
const registerUser = async (req, res) =>{
    const {name,email,password} = req.body;
    try{
        //checking is user already exis
        const exist = await userModel.findOne({email});
        if(exist){
           return res.json({success:false,message:"User already exist"})
        }

        //validating email format  & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Invalid email format"})
        }

        if (password.length<8){
            return res.json({success:false,message:"Password must be at least 8 characters"})
        }
        //hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);
        
        //for new user
        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token})


    } catch (error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {loginUser,registerUser}