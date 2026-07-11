const services=[

"Academic Writing",

"Essay Writing",

"Research Project",

"Data Entry",

"Virtual Assistant",

"Graphic Design",

"Programming",

"Translation",

"AI Services",

"Blog Writing",

"SEO Writing",

"Digital Marketing"

];

function randomMember(){

return "Member " +

String(

Math.floor(Math.random()*999999)+1

).padStart(6,"0");

}

setInterval(()=>{

const member = randomMember();

const service=
services[Math.floor(Math.random()*services.length)];

const amount=
Math.floor(Math.random()*80)+20;

document.getElementById("liveEarn").innerHTML=

`🔥 ${member} earned <strong>$${amount}</strong> from ${service}.`;

},2500);

setInterval(()=>{

const member = randomMember();

const amount=
Math.floor(Math.random()*250)+50;

document.getElementById("liveWithdraw").innerHTML=

`💸 ${member} successfully withdrew <strong>$${amount}</strong>.`;

},3000);
