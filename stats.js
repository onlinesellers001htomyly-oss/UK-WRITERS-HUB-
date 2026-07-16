function random(min,max){

return Math.floor(Math.random()*(max-min+1))+min;

}

function updateStats(){

document.getElementById("onlineUsers").textContent=
random(12000,18000).toLocaleString();

document.getElementById("activeWriters").textContent=
random(7000,12000).toLocaleString();

document.getElementById("availableProjects").textContent=
random(2000,6000).toLocaleString();

document.getElementById("completedToday").textContent=
random(500,2000).toLocaleString();

document.getElementById("paymentsToday").textContent=
"$"+random(25000,120000).toLocaleString();

}

updateStats();

setInterval(updateStats,5000);
