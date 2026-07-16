const writers = [

{
name:"Grace Wanjiku",
country:"🇰🇪 Kenya",
earnings:2450,
projects:32,
rating:5,
badge:"👑 Elite Writer"
},

{
name:"James Smith",
country:"🇬🇧 United Kingdom",
earnings:2180,
projects:28,
rating:5,
badge:"💎 Pro Writer"
},

{
name:"Sarah Johnson",
country:"🇺🇸 United States",
earnings:1960,
projects:24,
rating:4.9,
badge:"⭐ Rising Star"
},

{
name:"Michael Otieno",
country:"🇰🇪 Kenya",
earnings:1750,
projects:21,
rating:4.8,
badge:"🔥 Active Writer"
},

{
name:"Emily Brown",
country:"🇨🇦 Canada",
earnings:1500,
projects:18,
rating:4.8,
badge:"⭐ Professional"
}

];


const container =
document.getElementById("leaderboardContainer");


writers
.sort((a,b)=>b.earnings-a.earnings)
.forEach((writer,index)=>{


container.innerHTML += `

<div class="leader-card">


<h2>
${index+1} ${writer.badge}
</h2>


<h3>
${writer.name}
</h3>


<p>
🌍 ${writer.country}
</p>


<p>
💰 Earnings:
<strong>
$${writer.earnings}
</strong>
</p>


<p>
📝 Completed Projects:
${writer.projects}
</p>


<p>
⭐ Rating:
${writer.rating}/5
</p>


</div>

`;

});
