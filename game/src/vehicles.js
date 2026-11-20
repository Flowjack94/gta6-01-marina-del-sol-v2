import {collidesBuilding, WORLD} from './city.js';
export const CAR_TYPES=[
 {name:'Sedan',color:'#d86c52',speed:3.4,turn:.055},
 {name:'Taxi',color:'#efc34f',speed:3.1,turn:.05},
 {name:'Pickup',color:'#6d9c77',speed:2.9,turn:.045},
 {name:'Sports',color:'#54b6c3',speed:4.6,turn:.065},
 {name:'Van',color:'#d9d5bf',speed:2.7,turn:.04},
];
export function makeCar(x,y,type=0,angle=0,extra={}){const spec={...CAR_TYPES[type%CAR_TYPES.length]};return {id:Math.random().toString(36).slice(2),x,y,a:angle,v:0,type:type%5,color:spec.color,spec,health:100,driver:true,police:false,stolen:false,ai:false,turn:0,skid:0,...extra}}
export function spawnCars(){const cars=[];for(let i=0;i<22;i++){const horizontal=i%2===0,y=horizontal?([440,740,1040,1340][Math.floor(i/2)%4]+(i%4<2?-14:14)):80+Math.floor(i/2)*145;const x=horizontal?180+Math.floor(i/2)*172:([470,790,1110,1430,1750][Math.floor(i/2)%5]+(i%4<2?-14:14));const angle=horizontal?(i%4<2?0:Math.PI):(i%4<2?Math.PI/2:-Math.PI/2);cars.push(makeCar(x,y,i%5,angle,{driver:false,ai:true,v:.45+(i%3)*.14}))}return cars}
export function updateVehicles(s,dt){
 const p=s.player,car=s.cars.find(c=>c.id===p.carId);if(!car)return;
 const k=s.keys,acc=((k.w||k.ArrowUp||s.demoDrive)?1:0)-(k.s||k.ArrowDown?1:0);let steer=(k.d||k.ArrowRight?1:0)-(k.a||k.ArrowLeft?1:0);
 if(s.demoDrive&&s.demoRoute?.length){let target=s.demoRoute[s.demoLeg%s.demoRoute.length];if(Math.hypot(target.x-car.x,target.y-car.y)<14){s.demoLeg++;target=s.demoRoute[s.demoLeg%s.demoRoute.length];car.a=Math.atan2(target.y-car.y,target.x-car.x);car.v=Math.min(car.v,1.1)}const desired=Math.atan2(target.y-car.y,target.x-car.x),delta=Math.atan2(Math.sin(desired-car.a),Math.cos(desired-car.a));steer=Math.max(-1,Math.min(1,delta*2.4))}
 car.v+=acc*.12*dt;car.v*=Math.pow(acc?0.992:0.965,dt);car.v=Math.max(-1.7,Math.min(car.spec.speed,car.v));
 const traction=Math.min(1,Math.abs(car.v)/1.2);car.a+=steer*car.spec.turn*traction*Math.sign(car.v||1)*dt;
 const oldX=car.x,oldY=car.y;car.x+=Math.cos(car.a)*car.v*dt;car.y+=Math.sin(car.a)*car.v*dt;
 if(collidesBuilding(car.x,car.y,20)||car.x<18||car.y<18||car.x>WORLD.w-24||car.y>WORLD.h-24){car.x=oldX;car.y=oldY;car.v*=-.42;car.health-=Math.abs(car.v)*3;s.shake=4;s.effects.push({x:car.x,y:car.y,life:22,type:'dust'})}
 for(const other of s.cars){if(other===car)continue;const dx=car.x-other.x,dy=car.y-other.y;if(dx*dx+dy*dy<37*37){if(s.demoDrive&&car.id===p.carId){car.v=Math.max(car.v*.96,2.1);other.v*=.65}else{car.v*=-.35;car.health-=.8;other.v*=.6} s.effects.push({x:car.x,y:car.y,life:16,type:'spark'})}}
 if(Math.abs(car.v)>2.1&&Math.random()<.05)s.effects.push({x:car.x-Math.cos(car.a)*13,y:car.y-Math.sin(car.a)*13,life:30,type:'skid'});
 if(car.health<45&&Math.random()<.16)s.effects.push({x:car.x+(Math.random()-.5)*18,y:car.y-14,life:45,type:'smoke'});
 if(!s.demoDrive&&Math.abs(car.v)>3.8&&Math.random()<.005){s.wanted=Math.min(5,s.wanted+.15);s.lastCrime=Date.now()}
 p.x=car.x;p.y=car.y;p.angle=car.a;s.speed=Math.abs(car.v)*24;
}
export function nearestCar(s){let found=null,dist=55;for(const c of s.cars){const d=Math.hypot(c.x-s.player.x,c.y-s.player.y);if(d<dist){found=c;dist=d}}return found}
export function stealCar(s,car){if(!car||s.player.carId)return false;car.driver=true;car.ai=false;car.stolen=true;s.player.carId=car.id;s.player.x=car.x;s.player.y=car.y;s.wanted=Math.min(5,s.wanted+1);s.lastCrime=Date.now();s.toast=`${car.spec.name} borrowed. Keep it moving.`;s.audio?.play('start');return true}
export function drawCar(c,car){c.save();c.translate(car.x,car.y);c.rotate(car.a);const police=car.police;c.fillStyle='#26333755';c.beginPath();c.ellipse(0,5,23,13,0,0,7);c.fill();c.fillStyle=police?'#f2eee0':car.color;c.beginPath();c.roundRect(-18,-10,36,20,5);c.fill();c.fillStyle=police?'#305c85':'#b6d6d2';c.beginPath();c.roundRect(-8,-7,15,14,3);c.fill();c.fillStyle='#26393b';c.fillRect(-15,-11,8,3);c.fillRect(7,-11,8,3);c.fillRect(-15,8,8,3);c.fillRect(7,8,8,3);c.fillStyle='#fff2b6';c.fillRect(15,-7,3,5);c.fillRect(15,3,3,5);if(police){c.fillStyle='#26343c';c.fillRect(-5,-12,12,4);c.fillStyle=Math.sin(Date.now()/90)>0?'#ec554c':'#66b9e8';c.fillRect(-4,-12,5,4);c.fillStyle=Math.sin(Date.now()/90)>0?'#66b9e8':'#ec554c';c.fillRect(2,-12,5,4)}if(car.health<45){c.fillStyle='#66706caa';c.beginPath();c.arc(-4,-15,5,0,7);c.fill()}c.restore()}
