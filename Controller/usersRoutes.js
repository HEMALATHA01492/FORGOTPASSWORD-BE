const usersRouter = require("express").Router();
const User = require("../Model/usersModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = require("../utlis/config");

// getting full data

usersRouter.get("/users", (req, res) => {
  User.find({}, {}).then((users) => {
    res.status(200).json(users);
  });
});

// sign up new user

usersRouter.post("/users/signup", async (req, res) => {
  //Get username,email,password from user
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ Err: "Username,email,password are mandotary" });
      return;
    }
    const matchedUser = await User.findOne({ email });
    if (matchedUser) {
      res.status(400).json({ Err: "User already exists" });
      return;
    }
    // password handling
    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new User({
      username,
      email,
      password: hashedPassword,
    });
    newuser.save()
    .then( result =>{
      res.json({
        status:"SUCCESS",
        message: `${newuser.username} SignUp successfully`,
        data:result, });
    })
    .catch(err =>{
      res.json({
        status:"FAILED",
        message: `${newuser.username} SignUp Failed`,
        });
    })

  } catch (error) {
    console.error(error);
  }
});



//sign in user 

usersRouter.post("/users/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == "" || password == "") {
      res.json({
         status:"FAILED",
         message:"email, password are mandotary" 
        });
      }else{
      //check if user exist
      User.find({email})
      .then(data => {
        const hashedPassword =data[0].password;
        bcrypt.compare(password,hashedPassword)
         .then(result =>{
          if(result){
            //password match  
               res.json({
                  status: "SUCCESS",
                  message: `${data[0].username} Signin Successfully`,
                  data:data
                })
              }else{
             //password mismatch
                res.json({
                  status: "FAILED",
                  message: 'Invalid password Entered',
                  data:data
               })
              }
            })
           .catch(err =>{
            res.json({
              status: "FAILED",
              message: 'Error occured while comparing password',
              data:data
            })
          }) 
        })
      }
    } catch (error) {
    console.error(error);
  }
});

//FORGOT PASSWORD 
//1. Creating link for reseting password

usersRouter.put("/users/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ Err: "please enter valid email" });
      return;
    }
    const matchedUser = await User.findOne({ email });
    if (!matchedUser) {
      res.status(400).json({ Err: "user not exists" });
      return;
    }

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = `http://localhost:3000/users/reset/${randomString}`;

    matchedUser.resetToken = randomString;
    await User.findByIdAndUpdate(matchedUser.id, matchedUser);

    //send LINK to email 

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: `"ADMIN" <${EMAIL_ADDRESS}>`,
        to: matchedUser.email,
        subject: "Reset Password Link",
        text: link,
      });
    };

    sendMail()
      .then(() => {
        return res
          .status(201)
          .json({ message: `Password Reset Link send to ${matchedUser.email}` });
      })
      .catch((err) => res.status(500).json(err));
  } catch (error) {
    return res.status(500).json(error);
  }
});

//To Reset password

usersRouter.patch("/users/reset/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const resetToken = id;
    const { password } = req.body;
    const matchedUser = await User.findOne({ resetToken });
    console.log(matchedUser.password);
    if (!matchedUser) {
      res.status(400).json({ Err: "user not found exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    matchedUser.password = hashedPassword;

    await User.findByIdAndUpdate(matchedUser.id, matchedUser);
    console.log(matchedUser.password);
    console.log("Password Changed Successfully")
    res.status(201).json({
      message: `${matchedUser.username} password changed sucessfully`,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = usersRouter;
