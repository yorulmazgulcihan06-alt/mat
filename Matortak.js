var DB_MAT="https://renk-95728-default-rtdb.firebaseio.com";
var MAT_ROZETLER=[
{id:"ilk",isim:"Ilk Adim",emoji:"&#129351;",aciklama:"1 oyun oyna"},
{id:"on",isim:"10 Dogru",emoji:"&#128293;",aciklama:"10 dogru cevap"},
{id:"yuz",isim:"100 Dogru",emoji:"&#128175;",aciklama:"100 dogru cevap"},
{id:"simsek",isim:"Simsek",emoji:"&#9889;",aciklama:"5 saniyede cevap"},
{id:"nisanci",isim:"Keskin Nisanci",emoji:"&#127919;",aciklama:"10 dogru ust uste"},
{id:"kral",isim:"Kral",emoji:"&#128081;",aciklama:"50 oyun oyna"}
];

function matStats(oyunId){
var k="mat_"+oyunId+"_";
return{
oyunSayisi:parseInt(localStorage.getItem(k+"oyun")||"0"),
dogruSayisi:parseInt(localStorage.getItem(k+"dogru")||"0"),
ustUste:parseInt(localStorage.getItem(k+"ustuste")||"0"),
enIyiUstUste:parseInt(localStorage.getItem(k+"eniyi")||"0"),
hizliCevap:localStorage.getItem(k+"hizli")==="1"
};
}

function matRozetKontrol(oyunId){
var s=matStats(oyunId);
var k="mat_"+oyunId+"_rozetler";
var kazanilan=JSON.parse(localStorage.getItem(k)||"[]");
var yeni=[];
for(var i=0;i<MAT_ROZETLER.length;i++){
var r=MAT_ROZETLER[i],ok=false;
if(r.id==="ilk"&&s.oyunSayisi>=1)ok=true;
else if(r.id==="on"&&s.dogruSayisi>=10)ok=true;
else if(r.id==="yuz"&&s.dogruSayisi>=100)ok=true;
else if(r.id==="simsek"&&s.hizliCevap)ok=true;
else if(r.id==="nisanci"&&s.enIyiUstUste>=10)ok=true;
else if(r.id==="kral"&&s.oyunSayisi>=50)ok=true;
if(ok&&kazanilan.indexOf(r.id)===-1){kazanilan.push(r.id);yeni.push(r);}
}
localStorage.setItem(k,JSON.stringify(kazanilan));
matRozetCiz(oyunId);
if(yeni.length>0){
setTimeout(function(){
var em=document.getElementById("rozetEmoji");
var im=document.getElementById("rozetIsim");
var md=document.getElementById("rozetModal");
if(em&&im&&md){
em.innerHTML=yeni[0].emoji;
im.textContent=yeni[0].isim+" - "+yeni[0].aciklama;
md.classList.add("show");
}
},1000);
}
}

function matRozetKapat(){
var md=document.getElementById("rozetModal");
if(md)md.classList.remove("show");
}

function matRozetCiz(oyunId){
var k="mat_"+oyunId+"_rozetler";
var kazanilan=JSON.parse(localStorage.getItem(k)||"[]");
var kap=document.getElementById("rozetler");
if(!kap)return;
var h="";
for(var i=0;i<MAT_ROZETLER.length;i++){
var r=MAT_ROZETLER[i],ok=kazanilan.indexOf(r.id)!==-1;
h+='<div class="rozet '+(ok?"kazanildi":"")+'" title="'+r.isim+'">'+r.emoji+'</div>';
}
kap.innerHTML=h;
}

function matOyunKaydet(oyunId,isim,skor,dogru){
fetch(DB_MAT+"/mat_kayitlar/"+oyunId+".json",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({isim:isim,skor:skor,dogru:dogru,tarih:new Date().toISOString()})}).catch(function(e){});
}

function matSes(tip){
try{
var AC=new(window.AudioContext||window.webkitAudioContext)();
var o=AC.createOscillator(),g=AC.createGain();
o.connect(g);g.connect(AC.destination);
if(tip==="dogru"){o.frequency.value=880;o.type="sine";g.gain.setValueAtTime(.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.3);o.start();o.stop(AC.currentTime+.3);}
else if(tip==="yanlis"){o.frequency.value=200;o.type="square";g.gain.setValueAtTime(.15,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.4);o.start();o.stop(AC.currentTime+.4);}
else if(tip==="bitir"){o.frequency.value=1200;o.type="triangle";g.gain.setValueAtTime(.2,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.8);o.start();o.stop(AC.currentTime+.8);}
}catch(e){}
}
