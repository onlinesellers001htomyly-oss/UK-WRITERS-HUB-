const services=[

"Academic Writing",

"Essay Writing",

"Research Writing",

"Article Writing",

"Blog Writing",

"Copywriting",

"Technical Writing",

"Proofreading",

"Editing",

"Data Entry",

"Virtual Assistant",

"Programming",

"Website Development",

"Mobile App Development",

"Graphic Design",

"Logo Design",

"UI/UX Design",

"Video Editing",

"Animation",

"Translation",

"Transcription",

"Resume Writing",

"Business Plan Writing",

"SEO Writing",

"Digital Marketing",

"Social Media Management",

"Email Marketing",

"Lead Generation",

"AI Prompt Engineering",

"Machine Learning",

"Data Analysis",

"Excel Projects",

"PowerPoint Design",

"Online Tutoring",

"Mathematics Tutoring",

"Chemistry Tutoring",

"Physics Tutoring",

"Survey Tasks",

"Affiliate Marketing",

"E-commerce",

"Customer Support"

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
