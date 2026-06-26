const express=require("express");

const router=express.Router();

const db=require("./database");

router.post("/",(req,res)=>{

const bid={

id:db.bids.length+1,

taskId:req.body.taskId,

userId:req.body.userId,

price:req.body.price,

days:req.body.days,

proposal:req.body.proposal,

status:"Pending",

date:new Date()

};

db.bids.push(bid);

res.json({

success:true,

message:"Bid submitted successfully.",

bid

});

});

router.get("/:taskId",(req,res)=>{

const bids=db.bids.filter(

b=>b.taskId==req.params.taskId

);

res.json(bids);

});

module.exports=router;
