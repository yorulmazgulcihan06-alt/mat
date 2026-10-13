var DB="https://renk-95728-default-rtdb.firebaseio.com";
var RENKLER=["#2196F3","#4CAF50","#F44336","#222222"];
var ISIMLER=["Mavi","Yesil","Kirmizi","Siyah"];
var puan=[0,0,0,0],deneme=0,rot=0,bitti=false,secYildiz=0;
var c=document.getElementById("cark"),cx=c.getContext("2d"),M=150,R=145;

function ciz(){
for(var i=0;i<4;i++){
var b1=i*Math.PI/2,b2=(i+1)*Math.PI/2;
cx.beginPath();cx.moveTo(M,M);cx.arc(M,M,R,b1,b2);cx.closePath();
cx.fillStyle=RENKLER[i];cx.fill();
cx.strokeStyle="rgba(255,255,255,0.7)";cx.lineWidth=3;cx.stroke();
var oa=b1+Math.PI/4,tx=M+Math.cos(oa)*R*0.6,ty=M+Math.sin(oa)*R*0.6;
cx.save();cx.translate(tx,ty);cx.fillStyle="#fff";cx.font="bold 14px sans-serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText(ISIMLER[i],0,0);cx.restore();
}
cx.beginPath();cx.arc(M,M,R,0,Math.PI*2);cx.strokeStyle="gold";cx.lineWidth=6;cx.stroke();
}

function dondur(a){
cx.clearRect(0,0,300,300);
cx.save();cx.translate(M,M);cx.rotate(a*Math.PI/180);cx.translate(-M,-M);ciz();cx.restore();
}

function dilim(d){
var ha=d*90+45,ir=((270-ha)%360+360)%360,mr=((rot%360)+360)%360,f=((ir-mr)%360+360)%360;
rot=rot+360+f;dondur(rot);
}

function flashCak(){
var f=document.getElementById("flash");f.classList.remove("on");void f.offsetWidth;f.classList.add("on");
}

function vurgula(i){
var el=document.getElementById("st"+i);el.classList.add("active");
setTimeout(function(){el.classList.remove("active");},600);
}

function guncelle(){
for(var i=0;i<4;i++)document.getElementById("s"+i).textContent=puan[i];
document.getElementById("deneme").textContent=deneme;
}

function hepsiEsit(){return puan[0]===puan[1]&&puan[1]===puan[2]&&puan[2]===puan[3];}

function tekCevir(){
if(bitti)return;
flashCak();sesCal("tik");
var h=Math.floor(Math.random()*4);
puan[h]=puan[h]+1;deneme=deneme+1;
guncelle();dilim(h);vurgula(h);
if(hepsiEsit())bitir();
}

function otomatikCevir(){
if(bitti)return;
document.getElementById("cevirBtn").disabled=true;
document.getElementById("otoBtn").disabled=true;
document.getElementById("hizYazi").textContent="Hesaplaniyor...";
var guv=0;
while(true){
guv=guv+1;
var sec;
if(Math.random()<0.80){sec=Math.floor(Math.random()*4);}
else{
var ek=Math.min(puan[0],puan[1],puan[2],puan[3]),aday=[];
for(var i=0;i<4;i++)if(puan[i]===ek)aday.push(i);
sec=aday[Math.floor(Math.random()*aday.length)];
}
puan[sec]=puan[sec]+1;deneme=deneme+1;
if(hepsiEsit())break;
if(guv>5000000)break;
}
flashCak();guncelle();sesCal("ding");
var son=Math.floor(Math.random()*4);dilim(son);
for(var i=0;i<4;i++)vurgula(i);
bitir();
}

function bitir(){
bitti=true;
document.getElementById("hizYazi").textContent="Bitti! Yildizini sec";
document.getElementById("sonucDeneme").textContent=deneme+" deneme";
document.getElementById("sonucPanel").classList.remove("hidden");
document.getElementById("sonucPanel").scrollIntoView({behavior:"smooth"});
}

var yildizYazi={1:"Uhuhuhu...",2:"Yanii...",3:"Olurr!",4:"Huhuu!",5:"Tesekkurler!"};
var stars=document.querySelectorAll("#yildizSecici span");
for(var i=0;i<stars.length;i++){
stars[i].onclick=function(){
secYildiz=parseInt(this.getAttribute("data-y"));
var s=document.querySelectorAll("#yildizSecici span");
for(var j=0;j<s.length;j++){
if(j<secYildiz)s[j].classList.add("on");else s[j].classList.remove("on");
}
document.getElementById("yildizYazi").textContent=secYildiz+" yildiz - "+yildizYazi[secYildiz];
sesCal("yildiz");
if(secYildiz===5)konfetiBaslat();
kontrol();
};
}

document.getElementById("isimInput").oninput=kontrol;

function kontrol(){
var a=document.getElementById("isimInput").value.trim();
document.getElementById("gonderBtn").disabled=!(secYildiz>0&&a.length>0);
}

function gonder(){
var a=document.getElementById("isimInput").value.trim();
if(!a||!secYildiz)return;
var b=document.getElementById("gonderBtn");
b.disabled=true;b.textContent="Gonderiliyor...";
var m=document.getElementById("bildirim");m.classList.add("hidden");
fetch(DB+"/kayitlar.json",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({isim:a,yildiz:secYildiz,deneme:deneme,yorum:document.getElementById("yorumInput").value.trim(),tarih:new Date().toISOString()})}).then(function(r){
if(!r.ok)throw new Error("HTTP "+r.status);
m.className="msg msg-ok";m.textContent="Gonderildi! Tabloya gidiliyor...";m.classList.remove("hidden");
sesCal("ding");
setTimeout(function(){window.location.href="tablo.html";},1200);
}).catch(function(e){
m.className="msg msg-err";m.textContent="Hata: "+e.message;m.classList.remove("hidden");
b.disabled=false;b.textContent="GONDER";
});
}

function temaDegistir(){
document.body.classList.toggle("light");
var l=document.body.classList.contains("light");
if(l){document.getElementById("temaBtn").innerHTML="&#9728;&#65039;";}
else{document.getElementById("temaBtn").innerHTML="&#127769;";}
localStorage.setItem("tema",l?"light":"dark");
sesCal("tik");
}

if(localStorage.getItem("tema")==="light"){
document.body.classList.add("light");
document.getElementById("temaBtn").innerHTML="&#9728;&#65039;";
}

var audioCtx=null;
function sesCal(tip){
try{
if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();
var osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
osc.connect(gain);gain.connect(audioCtx.destination);
if(tip==="tik"){
osc.frequency.value=800;osc.type="square";
gain.gain.setValueAtTime(0.06,audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.06);
osc.start();osc.stop(audioCtx.currentTime+0.06);
}else if(tip==="ding"){
osc.frequency.value=1000;osc.type="sine";
gain.gain.setValueAtTime(0.15,audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.8);
osc.start();osc.stop(audioCtx.currentTime+0.8);
}else if(tip==="yildiz"){
osc.frequency.setValueAtTime(600,audioCtx.currentTime);
osc.frequency.linearRampToValueAtTime(1500,audioCtx.currentTime+0.3);
osc.type="triangle";
gain.gain.setValueAtTime(0.1,audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.3);
osc.start();osc.stop(audioCtx.currentTime+0.3);
}
}catch(e){}
}

var kCanvas=document.createElement("canvas");
kCanvas.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
document.body.appendChild(kCanvas);
var kCx=kCanvas.getContext("2d"),konfetiler=[],konfetiAktif=false;

function kbAyarla(){kCanvas.width=window.innerWidth;kCanvas.height=window.innerHeight;}
kbAyarla();
window.addEventListener("resize",kbAyarla);

function konfetiBaslat(){
konfetiler=[];
var renkler=["#ffd700","#ff512f","#dd2476","#00c853","#2196F3","#9c27b0","#ff9800"];
for(var i=0;i<120;i++){
konfetiler.push({x:Math.random()*kCanvas.width,y:-20-Math.random()*300,w:6+Math.random()*8,h:4+Math.random()*5,vy:2+Math.random()*4,vx:-1+Math.random()*2,renk:renkler[Math.floor(Math.random()*renkler.length)],aci:Math.random()*Math.PI*2,dAci:-0.15+Math.random()*0.3});
}
if(!konfetiAktif){konfetiAktif=true;konfetiDongu();}
}

function konfetiDongu(){
kCx.clearRect(0,0,kCanvas.width,kCanvas.height);
var hepsiGecti=true;
for(var i=0;i<konfetiler.length;i++){
var k=konfetiler[i];
k.y+=k.vy;k.x+=k.vx;k.aci+=k.dAci;
if(k.y<kCanvas.height+50)hepsiGecti=false;
kCx.save();kCx.translate(k.x,k.y);kCx.rotate(k.aci);
kCx.fillStyle=k.renk;kCx.fillRect(-k.w/2,-k.h/2,k.w,k.h);kCx.restore();
}
if(!hepsiGecti){requestAnimationFrame(konfetiDongu);}
else{konfetiAktif=false;kCx.clearRect(0,0,kCanvas.width,kCanvas.height);}
}

setTimeout(function(){
var u=window.location.href;
document.getElementById("qrUrl").textContent=u;
document.getElementById("qrImg").src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+encodeURIComponent(u);
document.getElementById("qrBox").classList.add("show");
},300);

dondur(0);

setTimeout(function(){
try{
var devId=localStorage.getItem("devid");
if(!devId){devId="dev_"+Math.random().toString(36).substring(2)+Date.now();localStorage.setItem("devid",devId);}
fetch("https://api.ipify.org?format=json").then(function(r){return r.json();}).then(function(d){
var now=new Date().toISOString(),ilk=localStorage.getItem("ilk")||now;
localStorage.setItem("ilk",ilk);
var ua=navigator.userAgent,marka="Bilinmiyor";
if(/iPhone/i.test(ua))marka="iPhone";
else if(/Samsung|SM-/i.test(ua))marka="Samsung";
else if(/Huawei/i.test(ua))marka="Huawei";
else if(/Xiaomi|Redmi/i.test(ua))marka="Xiaomi";
else if(/Oppo/i.test(ua))marka="Oppo";
else if(/Windows/i.test(ua))marka="Windows";
else if(/Macintosh/i.test(ua))marka="Mac";
else if(/Linux/i.test(ua))marka="Linux";
else if(/Android/i.test(ua))marka="Android";
var os="Bilinmiyor",om=ua.match(/(Android [\d.]+|iPhone OS [\d_]+|Mac OS X [\d_.]+|Windows NT [\d.]+)/);
if(om)os=om[1].replace(/_/g,".");
var br="Bilinmiyor";
if(/Edg\//i.test(ua))br="Edge";
else if(/Chrome/i.test(ua))br="Chrome";
else if(/Firefox/i.test(ua))br="Firefox";
else if(/Safari/i.test(ua))br="Safari";
var bilgi={marka:marka,os:os,tarayici:br,ekran:screen.width+"x"+screen.height,dil:navigator.language,saatDilimi:"bilinmiyor",mobil:/Mobi|Android|iPhone/i.test(ua),cekirdek:navigator.hardwareConcurrency||"?",dokunmatik:"ontouchstart"in window};
fetch(DB+"/presence/"+devId+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:devId,ip:d.ip,lastSeen:now,firstSeen:ilk,bilgi:bilgi})});
});
}catch(e){}
},1000);
