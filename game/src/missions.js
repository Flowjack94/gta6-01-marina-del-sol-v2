const missions=[
 {title:'A crate for Carmen',brief:'Pick up a blue parcel outside Sol Market.',target:{x:520,y:235},reward:280,kind:'pickup'},
 {title:'No questions asked',brief:'Take the parcel to the Seaglass guesthouse.',target:{x:1110,y:1040},reward:420,kind:'deliver'},
 {title:'Borrowed wheels',brief:'Find a car and bring it to Carmen’s lot.',target:{x:1120,y:1500},reward:620,kind:'car'},
 {title:'The long way home',brief:'Shake the patrol and reach Pelican Marina.',target:{x:1740,y:450},reward:760,kind:'chase'},
 {title:'Last light',brief:'Drive the final envelope to the pier before sunset.',target:{x:1960,y:230},reward:1200,kind:'finale'},
];
export function currentMission(s){return missions[s.missionIndex]||{title:'Route complete',brief:'The waterfront knows your name. Explore or take a side fare.',reward:0,target:null,kind:'done'}}
function resetMissionPressure(s){const m=currentMission(s);s.missionTime=m.kind==='chase'||m.kind==='finale'?180*60:0;if(s.thugsMissionIndex!==s.missionIndex){s.thugsMissionIndex=s.missionIndex;s.thugs=s.missionIndex>=2?[{x:m.target.x+85,y:m.target.y+55,hp:100,color:'#5f394c',cooldown:80},{x:m.target.x-70,y:m.target.y+95,hp:100,color:'#a3483f',cooldown:130}]:[]}}
export function startMission(s){const m=currentMission(s);if(m.kind==='done')return;s.missionStarted=true;s.missionTarget={...m.target};resetMissionPressure(s);s.toast=m.brief}
export function updateMissions(s,dt){if(!s.missionStarted)startMission(s);const m=currentMission(s);if(m.kind==='done'||!s.missionTarget)return;if(s.thugsMissionIndex!==s.missionIndex)resetMissionPressure(s);const d=Math.hypot(s.player.x-s.missionTarget.x,s.player.y-s.missionTarget.y);if(s.missionTime>0){s.missionTime-=dt;if(s.missionTime<=0){s.player.x=1750;s.player.y=1040;const car=s.cars.find(v=>v.id===s.player.carId);if(car){car.x=s.player.x;car.y=s.player.y;car.v=0}s.missionTime=180*60;s.toast='Carmen’s route is still open. Try the marina run again.'}}
 for(const thug of s.thugs||[]){const tx=s.player.x-thug.x,ty=s.player.y-thug.y,td=Math.hypot(tx,ty);if(td<250){thug.a=Math.atan2(ty,tx);thug.x+=Math.cos(thug.a)*.17*dt;thug.y+=Math.sin(thug.a)*.17*dt}thug.cooldown-=dt;if(td<190&&thug.cooldown<=0){thug.cooldown=110;s.player.hp-=4;s.effects.push({x:s.player.x,y:s.player.y,life:18,type:'spark'});if(s.player.hp<=0)s.phase='gameover'}}
 if(d<46&&(!m.kind.includes('car')||s.player.carId)&&!(m.kind==='chase'&&s.wanted>0)){s.cash+=m.reward;s.missionIndex++;s.missionTarget=currentMission(s).target?{...currentMission(s).target}:null;resetMissionPressure(s);s.toast=`${m.title} complete · +$${m.reward}`;s.audio?.play('coin');saveGame(s)}}
export function saveGame(s){try{localStorage.setItem('marina-save',JSON.stringify({cash:s.cash,missionIndex:s.missionIndex}))}catch{}}
export function loadGame(){try{return JSON.parse(localStorage.getItem('marina-save')||'{}')}catch{return {}}}
export function startGig(s){s.gigTarget={x:470+Math.random()*1300,y:440+Math.random()*1000};s.toast='Side fare: meet the green marker for a quick cash bonus.'}
export function updateGig(s){if(s.gigTarget&&Math.hypot(s.player.x-s.gigTarget.x,s.player.y-s.gigTarget.y)<48){s.cash+=180;s.gigTarget=null;s.toast='Fare delivered · +$180';saveGame(s)}}
