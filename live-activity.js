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

const names=[

"Member 1245",

"Member 2864",

"Member 3471",

"Member 5219",

"Member 6842",

"Member 7033",

"Member 8127",

"Member 9518"

];

setInterval(()=>{

const member=
names[Math.floor(Math.random()*names.length)];

const service=
services[Math.floor(Math.random()*services.length)];

const amount=
Math.floor(Math.random()*80)+20;

document.getElementById("liveEarn").innerHTML=

`🔥 ${member} earned <strong>$${amount}</strong> from ${service}.`;

},2500);

setInterval(()=>{

const member=
names[Math.floor(Math.random()*names.length)];

const amount=
Math.floor(Math.random()*250)+50;

document.getElementById("liveWithdraw").innerHTML=

`💸 ${member} successfully withdrew <strong>$${amount}</strong>.`;

},3000);
