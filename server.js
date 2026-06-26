const withdrawalsRouter = require("./withdrawals");
const db = require("./database");
const express = require("express");
const cors = require("cors");
const depositsRouter = require("./deposits");
const usersRouter = require("./users");
const { generateReferralCode } = require("./referral");
const app = express();
const usersRouter = require("./users");

app.use(cors());
app.use(express.json());
app.use("/deposits", depositsRouter);
app.use("/users", usersRouter);
app.use("/withdrawals", withdrawalsRouter);

db.users = db.users || [];

app.get("/", (req, res) => {
    res.send("UK WRITERS HUB Backend is Running...");
});

app.post("/register", (req, res) => {

    const {fullname,email,password,referral} = req.body;
    const user = {

        id: users.length + 1,

        fullname,

        email,

        password,

        referral,

        balance:0,

        referralEarnings:0,

        taskEarnings:0,

        referrals:0,

        status:"Pending"

    };

    db.users.push(user);

    res.json({

        success:true,

        message:"Registration successful.",

        user

    });

});

app.post("/login",(req,res)=>{

    const {email,password}=req.body;

    const user = db.users.find(...)

        u=>u.email===email && u.password===password

    );

    if(!user){

        return res.json({

            success:false,

            message:"Invalid email or password."

        });

    }

    res.json({

        success:true,

        message:"Login successful.",

        user

    });

});

const PORT=3000;

app.listen(PORT,()=>{

console.log(`Server running on port ${PORT}`);

});

