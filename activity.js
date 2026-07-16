const firstNames = [
"James","John","Michael","David","Daniel","Joseph","Samuel","Peter","Paul","Mark",
"Grace","Mary","Faith","Mercy","Sarah","Sophia","Olivia","Emma","Linda","Joy",
"Kevin","Brian","Charles","George","Anthony","Andrew","Collins","Dennis","Victor","Wilson",
"Emily","Alice","Cynthia","Janet","Lucy","Ruth","Beatrice","Diana","Caroline","Brenda"
];

const countries = [
"Kenya","Uganda","Tanzania","Rwanda","Burundi","South Africa","Nigeria","Ghana",
"United Kingdom","United States","Canada","Australia","Germany","France","Italy",
"Spain","Netherlands","Belgium","Sweden","Norway","Denmark","Finland","Ireland",
"India","Pakistan","China","Japan","South Korea","Brazil","Mexico","Argentina",
"UAE","Saudi Arabia","Qatar","Oman","Egypt","Morocco","Ethiopia","Zambia","Zimbabwe"
];

const projects = [
"Academic Writing",
"Research Writing",
"Article Writing",
"Essay Writing",
"Business Proposal",
"Case Study",
"Technical Writing",
"SEO Blog",
"Resume Writing",
"Dissertation"
];

window.addEventListener("DOMContentLoaded",()=>{

const container=document.getElementById("activityContainer");
const searchBox=document.getElementById("searchActivity");
const filter=document.getElementById("activityFilter");

if(!container || !searchBox || !filter){
return;
}

let activities = [];

function randomItem(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

function randomAmount(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

function generateActivity(){

const name=randomItem(firstNames);

const country=randomItem(countries);

const type=Math.floor(Math.random()*5);

let text="";
let category="";

switch(type){

case 0:

text=`🟢 <strong>${name}</strong> from <strong>${country}</strong> earned <strong>$${randomAmount(20,850)}</strong>`;
category="Earned";
break;

case 1:

text=`💸 <strong>${name}</strong> from <strong>${country}</strong> withdrew <strong>$${randomAmount(50,1500)}</strong>`;
category="Withdraw";
break;

case 2:

text=`🎉 <strong>${name}</strong> from <strong>${country}</strong> joined through a referral`;
category="Referral";
break;

case 3:

text=`✅ <strong>${name}</strong> from <strong>${country}</strong> completed a <strong>${randomItem(projects)}</strong> project`;
category="Project";
break;

case 4:

text=`📢 A client posted a <strong>$${randomAmount(80,1200)}</strong> ${randomItem(projects)} project`;
category="Joined";
break;

}

activities.unshift({

text,

category,

time:"Just now"

});

if(activities.length>100){

activities.pop();

}

renderActivities();

}

function renderActivities(){

const keyword=searchBox.value.toLowerCase();

const selected=filter.value;

container.innerHTML="";

activities.forEach(item=>{

if(selected!=="All" && item.category!==selected){

return;

}

if(!item.text.toLowerCase().includes(keyword)){

return;

}

const card = document.createElement("div");

card.className = "activity-card";

const message = document.createElement("div");
message.innerHTML = item.text;

const time = document.createElement("div");
time.className = "activity-time";
time.textContent = item.time;

card.appendChild(message);
card.appendChild(time);

container.appendChild(card);

});

}

for(let i=0;i<20;i++){

generateActivity();

}

setInterval(generateActivity,4000);

searchBox.addEventListener("input",renderActivities);

filter.addEventListener("change",renderActivities);
