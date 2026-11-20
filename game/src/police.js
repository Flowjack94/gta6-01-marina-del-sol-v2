import {makeCar,drawCar} from './vehicles.js';
export function updatePolice(s,dt){
 if(s.wanted>0&&s.time>(s.nextSiren||0)){s.audio?.play('siren');s.nextSiren=s.time+1050}
 const seen=s.cars.some(c=>c.police&&Math.hypot(c.x-s.player.x,c.y-s.player.y)<350)||(s.cops||[]).some(c=>Math.hypot(c.x-s.player.x,c.y-s.player.y)<280);
 if(s.wanted>0&&!seen&&Date.now()-s.lastCrime>26000)s.wanted=Math.max(0,s.wanted-.0018*dt);
 s.cops??=[];const footTarget=s.wanted>=2?Math.min(3,Math.floor(s.wanted/2)):0;
 if(s.cops.length<footTarget&&s.copSpawn<=0){const a=Math.random()*Math.PI*2,r=230+Math.random()*90;s.cops.push({x:Math.max(60,Math.min(2040,s.player.x+Math.cos(a)*r)),y:Math.max(60,Math.min(1620,s.player.y+Math.sin(a)*r)),hp:100});s.copSpawn=220}
 s.copSpawn-=dt;for(const cop of s.cops){const dx=s.player.x-cop.x,dy=s.player.y-cop.y,d=Math.hypot(dx,dy);cop.a=Math.atan2(dy,dx);const speed=s.player.carId ? .16 : .72;cop.x+=Math.cos(cop.a)*speed*dt;cop.y+=Math.sin(cop.a)*speed*dt;if(!s.player.carId&&d<22){s.bust+=.035*dt;s.player.hp-=.012*dt;if(s.bust>100||s.player.hp<=0)s.phase='gameover'}}if(!s.wanted)s.cops=[];
 const count=s.cars.filter(c=>c.police).length,target=s.wanted>0?Math.min(4,Math.ceil(s.wanted)):0;
 if(count<target&&s.policeSpawn<=0){const angle=Math.random()*Math.PI*2,d=320+Math.random()*110,x=s.player.x+Math.cos(angle)*d,y=s.player.y+Math.sin(angle)*d;const c=makeCar(Math.max(50,Math.min(2040,x)),Math.max(50,Math.min(1620,y)),0,angle,{police:true,ai:true,v:1.1,health:140,color:'#f1eee3'});s.cars.push(c);s.policeSpawn=130}
 s.policeSpawn-=dt;
 for(const c of s.cars){if(!c.police)continue;const dx=s.player.x-c.x,dy=s.player.y-c.y,dist=Math.hypot(dx,dy);c.a=Math.atan2(dy,dx);c.v=dist>80?Math.min(3.25,c.v+.02*dt):(s.player.carId&&dist<54?0:1.2);c.x+=Math.cos(c.a)*c.v*dt;c.y+=Math.sin(c.a)*c.v*dt;
  if(dist<34){s.player.hp-=.015*dt;if(!s.player.carId)s.bust+=.012*dt;else {const playerCar=s.cars.find(v=>v.id===s.player.carId);if(playerCar)playerCar.health-=.025*dt}if(s.player.hp<=0||s.bust>100)s.phase='gameover'}
 }
 if(s.wanted<=0){s.cars=s.cars.filter(c=>!c.police)}
}
export function drawPolice(c,s){for(const car of s.cars)if(car.police)drawCar(c,car)}
