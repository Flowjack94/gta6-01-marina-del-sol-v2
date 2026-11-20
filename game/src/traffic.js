import {makeCar,spawnCars} from './vehicles.js';
import {ROADS_X,ROADS_Y,collidesBuilding,WORLD} from './city.js';
export function initTraffic(){return {cars:spawnCars(),peds:[],nextPed:0}}
export function updateTraffic(s,dt){
 for(const c of s.cars){if(!c.ai||c.driver||c.police)continue;c.x+=Math.cos(c.a)*c.v*dt;c.y+=Math.sin(c.a)*c.v*dt;
  if(Math.random()<.001&&Math.hypot(c.x-s.player.x,c.y-s.player.y)<210)s.audio?.play('horn');
  if(Math.random()<.012){const nearX=ROADS_X.find(x=>Math.abs(c.x-x)<24),nearY=ROADS_Y.find(y=>Math.abs(c.y-y)<22);if(nearX&&nearY&&Math.random()<.5)c.v=.1;else if(Math.random()<.25)c.v=.55}
  if(c.x<20||c.x>WORLD.w-80||c.y<20||c.y>WORLD.h-50||collidesBuilding(c.x,c.y,19)){c.a+=Math.PI/2;c.v=.5}
 }
 s.pedTimer-=dt;if(s.pedTimer<=0&&s.peds.length<34){s.pedTimer=20;const side=Math.random()<.5;const road=side?ROADS_X[Math.floor(Math.random()*ROADS_X.length)]:ROADS_Y[Math.floor(Math.random()*ROADS_Y.length)];s.peds.push({x:side?road+(Math.random()<.5?-58:58):60+Math.random()*1940,y:side?70+Math.random()*1520:road+(Math.random()<.5?-58:58),a:Math.random()*7,v:.28+Math.random()*.18,color:['#bc654d','#406c79','#d5ac5d','#795d87','#e2dec9'][Math.floor(Math.random()*5)],fear:0})}
 for(const ped of s.peds){const dx=s.player.x-ped.x,dy=s.player.y-ped.y,d=Math.hypot(dx,dy);if(d<120&&s.wanted>0)ped.fear=50;if(ped.fear>0){ped.a=Math.atan2(-dy,-dx);ped.fear-=dt} else if(Math.random()<.015)ped.a+=(Math.random()-.5)*1.2;
  ped.x+=Math.cos(ped.a)*ped.v*(ped.fear>0?2:1)*dt;ped.y+=Math.sin(ped.a)*ped.v*(ped.fear>0?2:1)*dt;
  if(collidesBuilding(ped.x,ped.y,8)){ped.a+=Math.PI*.8;ped.x-=Math.cos(ped.a)*ped.v*dt;ped.y-=Math.sin(ped.a)*ped.v*dt}
  const driving=s.player.carId&&Math.abs(s.speed)>15;if(driving&&d<17&&ped.hitCooldown<=0){s.wanted=Math.min(5,s.wanted+1);s.lastCrime=Date.now();ped.fear=120;ped.hitCooldown=90;ped.x+=Math.cos(ped.a)*30;ped.y+=Math.sin(ped.a)*30}
  ped.hitCooldown=Math.max(0,(ped.hitCooldown||0)-dt);
 }
 s.peds=s.peds.filter(p=>p.x>0&&p.y>0&&p.x<WORLD.w&&p.y<WORLD.h);
}
export function seedScene(s,scene){if(scene==='chase'){s.cars=spawnCars();s.player.x=1750;s.player.y=1040;const car=makeCar(1750,1040,3,-Math.PI/2,{driver:true,ai:false,stolen:true,v:1.1});s.cars.push(car);s.player.carId=car.id;s.wanted=3;s.lastCrime=Date.now();s.missionIndex=3;s.missionStarted=true;s.missionTarget={x:1740,y:440};s.cash=2840;s.demoDrive=true;s.demoRoute=[{x:1750,y:440},{x:1430,y:440},{x:1430,y:1040},{x:1750,y:1040}];s.demoLeg=0;for(const [x,y] of [[1600,1320],[1900,1390],[2040,1220]])s.cars.push(makeCar(x,y,0,0,{police:true,ai:true,v:1.25,health:140}));s.peds=[];s.pedTimer=0}
 if(scene==='street'){s.player.x=1530;s.player.y=790;s.player.carId=null;s.wanted=0;s.peds=[];for(let i=0;i<12;i++)s.peds.push({x:1390+(i%4)*58,y:790+Math.floor(i/4)*28,a:i*.7,v:.3,color:['#bd654d','#47788b','#ddbd70'][i%3],fear:0});s.missionIndex=1;s.missionStarted=true;s.missionTarget={x:1110,y:1040}}
 if(scene==='mission'){s.cars=spawnCars();s.player.x=1750;s.player.y=1040;const car=makeCar(1750,1040,2,-Math.PI/2,{driver:true,ai:false,stolen:true,v:1});s.cars.push(car);s.player.carId=car.id;s.wanted=2;s.lastCrime=Date.now();s.missionIndex=3;s.missionStarted=true;s.missionTarget={x:1740,y:440};s.cash=1940;s.demoDrive=true;s.demoRoute=[{x:1750,y:440},{x:1430,y:440},{x:1430,y:1040},{x:1750,y:1040}];s.demoLeg=0;for(const [x,y] of [[1600,1320],[1900,1390]])s.cars.push(makeCar(x,y,0,0,{police:true,ai:true,v:1.2,health:140}))}}
