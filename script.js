const box=document.getElementById('v');
const R=new THREE.WebGLRenderer({antialias:true});
R.shadowMap.enabled=true;
box.appendChild(R.domElement);
R.domElement.style.touchAction='none';

function lights(s){
  s.add(new THREE.AmbientLight(0xffffff,.55));
  const d=new THREE.DirectionalLight(0xffffff,.9);
  d.position.set(6,12,8);d.castShadow=true;
  const c=d.shadow.camera;c.left=-14;c.right=14;c.top=14;c.bottom=-14;
  s.add(d);
}
function ground(s){
  const g=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshStandardMaterial({color:0x5b8c5a}));
  g.rotation.x=-Math.PI/2;g.receiveShadow=true;s.add(g);
}
function cam(r,th,ph,ty){return{r,th,ph,t:new THREE.Vector3(0,ty,0)}}

// 1) Bouncing ball
function ballScene(){
  const s=new THREE.Scene();s.background=new THREE.Color(0x9fd3f5);
  lights(s);ground(s);
  const ball=new THREE.Mesh(new THREE.SphereGeometry(1,40,40),new THREE.MeshStandardMaterial({color:0xe53935,roughness:.3}));
  ball.castShadow=true;s.add(ball);
  return{s,cam:cam(14,0.6,1.2,2),cap:'Bouncing ball: height follows |sin(time)|, and the ball squashes slightly when it hits the ground.',
    update(t){
      const h=Math.abs(Math.sin(t*2.5));
      ball.position.y=1+5*h;
      const sq=Math.max(0,1-h*6)*0.3;
      ball.scale.set(1+sq/2,1-sq,1+sq/2);
    }};
}

// 2) Car moving to and fro
function carScene(){
  const s=new THREE.Scene();s.background=new THREE.Color(0xbfe3ff);
  lights(s);ground(s);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(40,4),new THREE.MeshStandardMaterial({color:0x333338}));
  road.rotation.x=-Math.PI/2;road.position.y=.01;road.receiveShadow=true;s.add(road);
  const car=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(3.2,.8,1.6),new THREE.MeshStandardMaterial({color:0x1e88e5}));
  body.position.y=.8;body.castShadow=true;car.add(body);
  const top=new THREE.Mesh(new THREE.BoxGeometry(1.6,.7,1.4),new THREE.MeshStandardMaterial({color:0x90caf9}));
  top.position.set(-.2,1.55,0);top.castShadow=true;car.add(top);
  const wheels=[];
  const wg=new THREE.CylinderGeometry(.4,.4,.3,24);wg.rotateX(Math.PI/2);
  [[1,.85],[1,-.85],[-1,.85],[-1,-.85]].forEach(p=>{
    const w=new THREE.Mesh(wg,new THREE.MeshStandardMaterial({color:0x111111}));
    w.position.set(p[0]*1.05,.4,p[1]);w.castShadow=true;
    const hub=new THREE.Mesh(new THREE.BoxGeometry(.5,.12,.34),new THREE.MeshStandardMaterial({color:0xcccccc}));
    w.add(hub);car.add(w);wheels.push(w);
  });
  s.add(car);
  let last=0,yaw=0;
  return{s,cam:cam(16,0.3,1.2,1),cap:'Car to and fro: x = sin(time) × distance. The car turns around when its direction flips, and the wheels spin.',
    update(t){
      const x=Math.sin(t*.8)*8, dx=x-car.position.x, dt=Math.max(t-last,.001);last=t;
      car.position.x=x;
      const target=Math.cos(t*.8)>=0?0:Math.PI;
      yaw+=(target-yaw)*.12;car.rotation.y=yaw;
      wheels.forEach(w=>w.rotation.z-=Math.abs(dx)/.4);
    }};
}

// 3) Moon orbiting Earth
function moonScene(){
  const s=new THREE.Scene();s.background=new THREE.Color(0x03030a);
  s.add(new THREE.AmbientLight(0xffffff,.35));
  const sun=new THREE.PointLight(0xffffff,1.4);sun.position.set(25,8,15);s.add(sun);
  const earth=new THREE.Mesh(new THREE.SphereGeometry(2,48,48),new THREE.MeshStandardMaterial({color:0x2a6fdb,roughness:.8}));
  const land=new THREE.Mesh(new THREE.IcosahedronGeometry(2.04,1),new THREE.MeshStandardMaterial({color:0x3f9b4b,flatShading:true,transparent:true,opacity:.55}));
  earth.add(land);s.add(earth);
  const moon=new THREE.Mesh(new THREE.SphereGeometry(.55,32,32),new THREE.MeshStandardMaterial({color:0xbdbdbd,roughness:1}));
  s.add(moon);
  const pts=[];for(let i=0;i<=128;i++){const a=i/128*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*6,Math.sin(a)*.9,Math.sin(a)*6))}
  s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0x666688})));
  const sp=[];for(let i=0;i<600;i++){const v=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(60+Math.random()*30);sp.push(v)}
  s.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(sp),new THREE.PointsMaterial({color:0xffffff,size:.5})));
  return{s,cam:cam(16,0.5,1.1,0),cap:'Moon orbit: angle grows with time, position = (cos·radius, sin·tilt, sin·radius). The Earth spins on its own axis.',
    update(t){
      const a=t*.7;
      moon.position.set(Math.cos(a)*6,Math.sin(a)*.9,Math.sin(a)*6);
      moon.rotation.y=-a;earth.rotation.y=t*.5;
    }};
}

const makers=[['Bouncing ball',ballScene],['Moving car',carScene],['Moon & Earth',moonScene]];
const nav=document.getElementById('nav'),cap=document.getElementById('cap');
const scenes=[];let cur=null;
makers.forEach((m,i)=>{
  const b=document.createElement('button');b.textContent=m[0];
  b.onclick=()=>pick(i);nav.appendChild(b);
});
function pick(i){
  if(!scenes[i])scenes[i]=makers[i][1]();
  cur=scenes[i];cap.textContent=cur.cap;
  [...nav.children].forEach((b,j)=>b.classList.toggle('on',i===j));
  size();
}
const camera=new THREE.PerspectiveCamera(50,1,.1,500);
function size(){
  const w=box.clientWidth,h=box.clientHeight;if(!w||!h)return;
  R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(w,h);
  camera.aspect=w/h;camera.updateProjectionMatrix();
}
new ResizeObserver(size).observe(box);

// drag to rotate the view
let drag=false,px=0,py=0;
R.domElement.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY});
addEventListener('pointerup',()=>drag=false);
addEventListener('pointermove',e=>{
  if(!drag||!cur)return;
  cur.cam.th-=(e.clientX-px)*.01;
  cur.cam.ph=Math.min(1.5,Math.max(.15,cur.cam.ph-(e.clientY-py)*.01));
  px=e.clientX;py=e.clientY;
});

const clock=new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  if(!cur)return;
  const t=clock.getElapsedTime(),c=cur.cam;
  cur.update(t);
  camera.position.set(
    c.t.x+c.r*Math.sin(c.ph)*Math.sin(c.th),
    c.t.y+c.r*Math.cos(c.ph),
    c.t.z+c.r*Math.sin(c.ph)*Math.cos(c.th));
  camera.lookAt(c.t);
  R.render(cur.s,camera);
}
pick(0);loop();