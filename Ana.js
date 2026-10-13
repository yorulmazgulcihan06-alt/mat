var DB="https://renk-95728-default-rtdb.firebaseio.com";
var RK=["#2196F3","#4CAF50","#F44336","#222222"],IS=["Mavi","Yesil","Kirmizi","Siyah"];
var puan=[0,0,0,0],deneme=0,rot=0,bitti=false,secY=0,aktifMesaj=null;
var c=document.getElementById("cark"),cx=c.getContext("2d"),M=150,R=145;

function ciz(){for(var i=0;i<4;i++){var b1=i*Math.PI/2,b2=(i+1)*Math.PI/2;cx.beginPath();cx.moveTo(M,M);cx.arc(M,M,R,b1,b2);cx.closePath();cx.fillStyle=RK[i];cx.fill();cx.strokeStyle="rgba(255,255,255,.7)";cx.lineWidth=3;cx.stroke();var oa=b1+Math.PI/4,tx=M+Math.cos(oa)*R*.6,ty=M+Math.sin(oa)*R*.6;cx.save();cx.translate(tx,ty);cx.fillStyle="#fff";cx.font="bold 14px sans-serif";cx.textAlign="center";cx.textBaseline="middle";cx.fillText(IS[i],0,0);cx.restore();}cx.beginPath();cx.arc(M,M,R,0,Math.PI*2);cx.strokeStyle="gold";cx.lineWidth=6;cx.stroke();}
function dondur(a){cx.clearRect(0,0,300,300);cx.save();cx.translate(M,M);cx.rotate(a*Math.PI/180);cx.translate(-M,-M);ciz();cx.restore();}
function dilim(d){var ha=d*90+45,ir=((270-ha)%360+360)%360,mr=((rot%360)+360)%360,f=((ir-mr)%360+360)%360;rot+=360+f;dondur(rot);}
function gunc(){for(var i=0;i<4;i++)document.getElementById("s"+i).textContent=puan[i];document.getElementById("deneme").textContent=deneme;}
function esit(){return puan[0]===puan[1]&&puan[1]===puan[2]&&puan[2]===puan[3];}
function tekCevir(){if(bitti)return;ses("tik");var h=Math.floor(Math.random()*4);puan[h]++;deneme++;gunc();dilim(h);if(esit())bitir();}
function otomatikCevir(){if(bitti)return;document.getElementById("cevirBtn").disabled=true;document.getElementById("otoBtn").disabled=true;document.getElementById("hizYazi").textContent="Hesaplaniyor...";var g=0;while(true){g++;var s;if(Math.random()<0.8){s=Math.floor(Math.random()*4);}else{var ek=Math.min(puan[0],puan[1],puan[2],puan[3]),a=[];for(var i=0;i<4;i++)if(puan[i]===ek)a.push(i);s=a[Math.floor(Math.random()*a.length)];}puan[s]++;deneme++;if(esit())break;if(g>5000000)break;}gunc();ses("ding");dilim(Math.floor(Math.random()*4));bitir();}

function bitir(){
bitti=true;
document.getElementById("hizYazi").textContent="Bitti!";
document.getElementById("sDeneme").textContent=deneme+" deneme";
var os=parseInt(localStorage.getItem("oyunSayisi")||"0")+1;
localStorage.setItem("oyunSayisi",os);
var esk=parseInt(localStorage.getItem("rekor")||"999999");
if(deneme<esk){localStorage.setItem("rekor",deneme);document.getElementById("sBaslik").textContent="YENI REKOR!";konfetiBas();setTimeout(konfetiBas,600);}
rekorG();
if(typeof rozetKontrol==="function")rozetKontrol();
document.getElementById("sonucPanel").classList.remove("hidden");
document.getElementById("sonucPanel").scrollIntoView({behavior:"smooth"});
}

function rekorG(){var r=localStorage.getItem("rekor");if(r)document.getElementById("rekorGoster").innerHTML="Rekorun: <b>"+r+" deneme</b>";}

var YZ={1:"Uhuhuhu...",2:"Yanii...",3:"Olurr!",4:"Huhuu!",5:"Tesekkurler!"};
var st=document.querySelectorAll("#yildizSecici span");
for(var i=0;i<st.length;i++){st[i].onclick=function(){secY=parseInt(this.getAttribute("data-y"));var s=document.querySelectorAll("#yildizSecici span");for(var j=0;j<s.length;j++){if(j<secY)s[j].classList.add("on");else s[j].classList.remove("on");}document.getElementById("yildizYazi").textContent=secY+" yildiz - "+YZ[secY];ses("yildiz");if(secY===5)konfetiBas();kontrol();};}
document.getElementById("isimInput").oninput=kontrol;
function kontrol(){var a=document.getElementById("isimInput").value.trim();document.getElementById("gonderBtn").disabled=!(secY>0&&a.length>0);}

function gonder(){
var a=document.getElementById("isimInput").value.trim();
if(!a||!secY)return;
if(secY===5){var by=parseInt(localStorage.getItem("besYildiz")||"0")+1;localStorage.setItem("besYildiz",by);}
var b=document.getElementById("gonderBtn");b.disabled=true;b.textContent="Gonderiliyor...";
var m=document.getElementById("bildirim");m.classList.add("hidden");
fetch(DB+"/kayitlar.json",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({isim:a,yildiz:secY,deneme:deneme,yorum:document.getElementById("yorumInput").value.trim(),tarih:new Date().toISOString()})}).then(function(r){
if(!r.ok)throw new Error("HTTP "+r.status);
m.className="msg msg-ok";m.textContent="Gonderildi!";m.classList.remove("hidden");
ses("ding");
if(typeof rozetKontrol==="function")rozetKontrol();
setTimeout(function(){window.location.href="tablo.html";},1500);
}).catch(function(e){m.className="msg msg-err";m.textContent="Hata: "+e.message;m.classList.remove("hidden");b.disabled=false;b.textContent="GONDER";});
}

function paylasWA(){var u=window.location.href;window.open("https://wa.me/?text="+encodeURIComponent("Renk Carki oyununu dene! "+u),"_blank");}
function paylasTG(){var u=window.location.href;window.open("https://t.me/share/url?url="+encodeURIComponent(u)+"&text="+encodeURIComponent("Renk Carki oyununu dene!"),"_blank");}
function linkKopyala(){var u=window.location.href;if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){alert("Link kopyalandi!");});}else{var t=document.createElement("textarea");t.value=u;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t);alert("Link kopyalandi!");}}
function temaDegistir(){document.body.classList.toggle("light");var l=document.body.classList.contains("light");document.getElementById("temaBtn").innerHTML=l?"&#9728;&#65039;":"&#127769;";localStorage.setItem("tema",l?"light":"dark");ses("tik");}
if(localStorage.getItem("tema")==="light"){document.body.classList.add("light");document.getElementById("temaBtn").innerHTML="&#9728;&#65039;";}

var AC=null;
function ses(t){try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();var o=AC.createOscillator(),g=AC.createGain();o.connect(g);g.connect(AC.destination);if(t==="tik"){o.frequency.value=800;o.type="square";g.gain.setValueAtTime(.06,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.06);o.start();o.stop(AC.currentTime+.06);}else if(t==="ding"){o.frequency.value=1000;o.type="sine";g.gain.setValueAtTime(.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.8);o.start();o.stop(AC.currentTime+.8);}else if(t==="yildiz"){o.frequency.setValueAtTime(600,AC.currentTime);o.frequency.linearRampToValueAtTime(1500,AC.currentTime+.3);o.type="triangle";g.gain.setValueAtTime(.1,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.3);o.start();o.stop(AC.currentTime+.3);}}catch(e){}}

var kC=document.createElement("canvas");kC.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;";document.body.appendChild(kC);var kX=kC.getContext("2d"),konf=[],kA=false;
function kbA(){kC.width=window.innerWidth;kC.height=window.innerHeight;}kbA();window.addEventListener("resize",kbA);
function konfetiBas(){konf=[];var rk=["#ffd700","#ff512f","#dd2476","#00c853","#2196F3","#9c27b0"];for(var i=0;i<120;i++)konf.push({x:Math.random()*kC.width,y:-20-Math.random()*300,w:6+Math.random()*8,h:4+Math.random()*5,vy:2+Math.random()*4,vx:-1+Math.random()*2,r:rk[Math.floor(Math.random()*rk.length)],a:Math.random()*Math.PI*2,da:-0.15+Math.random()*0.3});if(!kA){kA=true;kd();}}
function kd(){kX.clearRect(0,0,kC.width,kC.height);var g=true;for(var i=0;i<konf.length;i++){var k=konf[i];k.y+=k.vy;k.x+=k.vx;k.a+=k.da;if(k.y<kC.height+50)g=false;kX.save();kX.translate(k.x,k.y);kX.rotate(k.a);kX.fillStyle=k.r;kX.fillRect(-k.w/2,-k.h/2,k.w,k.h);kX.restore();}if(!g){requestAnimationFrame(kd);}else{kA=false;kX.clearRect(0,0,kC.width,kC.height);}}

function mesajKontrol(){fetch(DB+"/mesajlar.json").then(function(r){return r.json();}).then(function(d){if(!d)return;var ok=JSON.parse(localStorage.getItem("okunanMesajlar")||"[]");for(var id in d){if(ok.indexOf(id)===-1){aktifMesaj={id:id,metin:d[id].metin,tarih:d[id].tarih};document.getElementById("banner").classList.add("show");return;}}}).catch(function(e){});}
function mesajAc(){if(!aktifMesaj)return;document.getElementById("mMetin").textContent=aktifMesaj.metin;document.getElementById("mTarih").textContent=new Date(aktifMesaj.tarih).toLocaleString("tr-TR");document.getElementById("modal").classList.add("show");}
function mesajKapat(){if(aktifMesaj){var ok=JSON.parse(localStorage.getItem("okunanMesajlar")||"[]");ok.push(aktifMesaj.id);localStorage.setItem("okunanMesajlar",JSON.stringify(ok));}document.getElementById("modal").classList.remove("show");document.getElementById("banner").classList.remove("show");aktifMesaj=null;setTimeout(mesajKontrol,3000);}

setTimeout(mesajKontrol,1500);setInterval(mesajKontrol,300000);
setTimeout(function(){var u=window.location.href;document.getElementById("qrUrl").textContent=u;document.getElementById("qrImg").src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+encodeURIComponent(u);document.getElementById("qrBox").classList.add("show");},300);
dondur(0);rekorG();
if(typeof rozetCiz==="function")rozetCiz();

if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("service-worker.js").catch(function(e){});});}

setTimeout(function(){try{var dv=localStorage.getItem("devid");if(!dv){dv="dev_"+Math.random().toString(36).substring(2)+Date.now();localStorage.setItem("devid",dv);}fetch("https://api.ipify.org?format=json").then(function(r){return r.json();}).then(function(d){var n=new Date().toISOString(),il=localStorage.getItem("ilk")||n;localStorage.setItem("ilk",il);var ua=navigator.userAgent,mk="Bilinmiyor";if(/iPhone/i.test(ua))mk="iPhone";else if(/Samsung|SM-/i.test(ua))mk="Samsung";else if(/Xiaomi|Redmi/i.test(ua))mk="Xiaomi";else if(/Windows/i.test(ua))mk="Windows";else if(/Android/i.test(ua))mk="Android";var os="?",om=ua.match(/(Android [\d.]+|iPhone OS [\d_]+)/);if(om)os=om[1].replace(/_/g,".");var br="?";if(/Chrome/i.test(ua))br="Chrome";else if(/Firefox/i.test(ua))br="Firefox";else if(/Safari/i.test(ua))br="Safari";fetch(DB+"/presence/"+dv+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({deviceId:dv,ip:d.ip,lastSeen:n,firstSeen:il,bilgi:{marka:mk,os:os,tarayici:br,ekran:screen.width+"x"+screen.height,dil:navigator.language,mobil:/Mobi|Android|iPhone/i.test(ua)}})});});}catch(e){}},1000);
