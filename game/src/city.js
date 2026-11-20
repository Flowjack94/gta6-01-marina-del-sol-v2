export const WORLD={w:2400,h:1800};
export const ROADS_X=[150,470,790,1110,1430,1750,2070];
export const ROADS_Y=[140,440,740,1040,1340,1640];
const colors=['#efc991','#f2d6a1','#c98466','#b9c8a0','#e6a46f','#d9c790','#cc8068'];
const names=['Sol Market','Coral House','Palma Café','Blue Tile','Casa Naranja','Luna Laundry','Bay Garage','Citrus Court','Port Office','Marlin Supply'];
export const buildings=[];
export const props=[];
for(let row=0;row<ROADS_Y.length-1;row++)for(let col=0;col<ROADS_X.length-1;col++){
  const left=ROADS_X[col]+48,top=ROADS_Y[row]+42,w=276,h=258,idx=(row*7+col*3)%names.length;
  if(row===4&&col>=4)continue;
  const type=(row===0&&col<2)?'shops':(col===5&&row>1?'marina':((row+col)%6===0?'park':'block'));
  if(type==='park'){props.push({x:left,y:top,w,h,type:'park'});continue}
  buildings.push({x:left,y:top,w,h,type,color:colors[idx%colors.length],name:names[idx],accent:colors[(idx+2)%colors.length]});
}
// Promenade, beach, marina piers, parking courts, and street furniture form a recognizable coastal edge.
export const landmarks=[
 {x:1790,y:80,w:530,h:340,type:'marina',name:'Pelican Marina'},
 {x:1790,y:440,w:530,h:650,type:'beach',name:'South Beach'},
 {x:1790,y:1120,w:530,h:570,type:'park',name:'Seaglass Park'},
 {x:850,y:1400,w:760,h:210,type:'parking',name:'Carmen’s lot'},
 {x:490,y:755,w:260,h:255,type:'park',name:'Palm Garden'},
];
for(let i=0;i<24;i++){
 const lane=i%4, row=Math.floor(i/4), bx=180+row*290, by=170+lane*390;
 props.push({x:bx,y:by,type:i%3===0?'lamp':i%3===1?'palm':'bench'});
}
export function roadAt(x,y){return ROADS_X.some(rx=>Math.abs(rx-x)<52)||ROADS_Y.some(ry=>Math.abs(ry-y)<48)}
export function collidesBuilding(x,y,r=13){
 // The outer eave/apron is driveable pavement; only the solid building core blocks movement.
 const inset=24;
 return buildings.some(b=>x+r>b.x+inset&&x-r<b.x+b.w-inset&&y+r>b.y+inset&&y-r<b.y+b.h-inset);
}
export function nearestService(x,y){return Math.min(Math.hypot(x-1110,y-1040),Math.hypot(x-1120,y-1500))<88}
export function drawCity(ctx,time){
  ctx.fillStyle='#6fa99c';ctx.fillRect(0,0,WORLD.w,WORLD.h);
  // Coastal water on the east and south, with a striped shallow-water shelf.
  ctx.fillStyle='#368f9d';ctx.fillRect(2110,0,290,1800);ctx.fillRect(0,1690,2400,110);
  ctx.fillStyle='#f0cf96';ctx.fillRect(1790,440,320,650);ctx.fillRect(0,1690,2110,26);
  for(let i=0;i<12;i++){ctx.globalAlpha=.13;ctx.strokeStyle='#dcfff0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(2120+i*24,0);ctx.lineTo(2120+i*24,1800);ctx.stroke();ctx.beginPath();ctx.moveTo(0,1700+i*10);ctx.lineTo(2110,1700+i*10);ctx.stroke();}ctx.globalAlpha=1;
  ctx.fillStyle='#d9c493';for(const y of ROADS_Y)ctx.fillRect(0,y-49,2110,98);for(const x of ROADS_X)ctx.fillRect(x-53,0,106,1690);
  ctx.strokeStyle='#fff0c9';ctx.lineWidth=2;ctx.setLineDash([18,18]);
  for(const y of ROADS_Y){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2110,y);ctx.stroke()}
  for(const x of ROADS_X){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1690);ctx.stroke()}ctx.setLineDash([]);
  // Sidewalks and crosswalks.
  ctx.fillStyle='#ead7b1';for(const y of ROADS_Y){ctx.fillRect(0,y-58,2110,8);ctx.fillRect(0,y+50,2110,8)}for(const x of ROADS_X){ctx.fillRect(x-62,0,8,1690);ctx.fillRect(x+54,0,8,1690)}
  for(const b of buildings){
    ctx.fillStyle='#607d70';ctx.fillRect(b.x+9,b.y+12,b.w,b.h);ctx.fillStyle=b.color;ctx.fillRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle=b.accent;ctx.fillRect(b.x,b.y,b.w,15);ctx.fillStyle='#80664c';ctx.fillRect(b.x+b.w*.42,b.y+b.h-30,34,30);
    ctx.fillStyle='#69a7a8';for(let wx=b.x+23;wx<b.x+b.w-12;wx+=48){ctx.fillRect(wx,b.y+42,23,20);ctx.fillRect(wx,b.y+96,23,20)}
    ctx.fillStyle='#f9edcf';ctx.font='bold 11px system-ui';ctx.fillText(b.name,b.x+12,b.y+33);
    ctx.fillStyle='#ffffff18';ctx.fillRect(b.x+10,b.y+22,b.w-20,5);
    if(b.type==='marina'){ctx.fillStyle='#d7b88b';for(let q=0;q<4;q++)ctx.fillRect(b.x+30+q*56,b.y+b.h-20,30,12)}
  }
  for(const p of props){if(p.type==='park'){ctx.fillStyle='#55916e';ctx.fillRect(p.x,p.y,p.w,p.h);for(let i=0;i<8;i++){const tx=p.x+30+(i*73)%220,ty=p.y+30+(i*47)%210;ctx.fillStyle='#816b4d';ctx.fillRect(tx-3,ty,6,14);ctx.fillStyle='#367452';ctx.beginPath();ctx.arc(tx,ty,17,0,Math.PI*2);ctx.fill();ctx.fillStyle='#72aa6b';ctx.beginPath();ctx.arc(tx-5,ty-5,9,0,Math.PI*2);ctx.fill()}} else drawProp(ctx,p,time)}
  for(const l of landmarks)drawLandmark(ctx,l,time);
}
function drawProp(c,p,t){c.save();c.translate(p.x,p.y);if(p.type==='palm'){c.strokeStyle='#926b45';c.lineWidth=6;c.beginPath();c.moveTo(0,18);c.quadraticCurveTo(4,0,0,-14);c.stroke();c.fillStyle='#287b62';for(let a=-2;a<=2;a++){c.beginPath();c.ellipse(a*9,-15-Math.abs(a)*2,15,4,a*.35,0,Math.PI*2);c.fill()}}else if(p.type==='lamp'){c.fillStyle='#47545a';c.fillRect(-2,-16,4,30);c.fillStyle='#ffe6a2';c.beginPath();c.arc(0,-17,5,0,Math.PI*2);c.fill()}else{c.fillStyle='#8b6447';c.fillRect(-12,-3,24,6);c.fillRect(-9,-1,3,10);c.fillRect(6,-1,3,10)}c.restore()}
function drawLandmark(c,l,t){c.save();if(l.type==='marina'){c.fillStyle='#63aeb1';c.fillRect(l.x,l.y,l.w,l.h);c.fillStyle='#cba67a';c.fillRect(l.x,l.y+70,l.w,30);for(let j=0;j<5;j++){c.fillStyle='#ba8f61';c.fillRect(l.x+40+j*85,l.y+95,15,210);c.fillStyle=['#f7f4e7','#dc735a','#4b7184'][j%3];c.beginPath();c.moveTo(l.x+38+j*85,l.y+155);c.lineTo(l.x+86+j*85,l.y+155);c.lineTo(l.x+76+j*85,l.y+174);c.lineTo(l.x+48+j*85,l.y+174);c.fill()}c.fillStyle='#fff4ce';c.font='bold 18px system-ui';c.fillText(l.name,l.x+25,l.y+40)}else if(l.type==='beach'){c.fillStyle='#e9ce91';c.fillRect(l.x,l.y,l.w,l.h);for(let j=0;j<13;j++){c.globalAlpha=.2;c.fillStyle=j%2?'#fff':'#c89164';c.beginPath();c.ellipse(l.x+40+(j*97)%480,l.y+30+(j*83)%580,16,7,0,0,Math.PI*2);c.fill()}c.globalAlpha=1;c.fillStyle='#fff5d4';c.font='bold 18px system-ui';c.fillText(l.name,l.x+25,l.y+35)}else if(l.type==='park'){c.fillStyle='#55916e';c.fillRect(l.x,l.y,l.w,l.h);for(let j=0;j<20;j++){const x=l.x+24+(j*71)%l.w,y=l.y+25+(j*113)%l.h;c.fillStyle='#397657';c.beginPath();c.arc(x,y,12+(j%3)*3,0,7);c.fill();c.fillStyle='#88704b';c.fillRect(x-2,y+7,4,12)}}else{c.fillStyle='#beb392';c.fillRect(l.x,l.y,l.w,l.h);c.strokeStyle='#f4ead2';c.setLineDash([12,8]);for(let x=l.x+20;x<l.x+l.w;x+=62){c.beginPath();c.moveTo(x,l.y+10);c.lineTo(x,l.y+l.h-10);c.stroke()}c.setLineDash([]);c.fillStyle='#5b6e68';c.font='bold 14px system-ui';c.fillText(l.name,l.x+12,l.y+25)}c.restore()}
