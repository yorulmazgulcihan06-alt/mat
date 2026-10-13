var ROZETLER=[
{id:"ilk",isim:"Ilk Oyun",emoji:"&#129351;",aciklama:"Ilk oyununu oyna"},
{id:"onoyun",isim:"10 Oyun",emoji:"&#128293;",aciklama:"10 oyun oyna"},
{id:"yuzoyun",isim:"100 Oyun",emoji:"&#128175;",aciklama:"100 oyun oyna"},
{id:"besyildiz",isim:"5 Yildiz",emoji:"&#11088;",aciklama:"5 yildiz al"},
{id:"simsek",isim:"Simsek",emoji:"&#9889;",aciklama:"10 denemede bitir"},
{id:"mukemmel",isim:"Mukemmel",emoji:"&#127919;",aciklama:"3 kez 5 yildiz al"},
{id:"efsane",isim:"Efsane",emoji:"&#127775;",aciklama:"100 denemede bitir"},
{id:"kral",isim:"Kral",emoji:"&#128081;",aciklama:"50 oyun oyna"}
];

function rozetStats(){
return{
oyunSayisi:parseInt(localStorage.getItem("oyunSayisi")||"0"),
besYildiz:parseInt(localStorage.getItem("besYildiz")||"0"),
enIyiDeneme:parseInt(localStorage.getItem("rekor")||"999999")
};
}

function rozetKontrol(){
var s=rozetStats();
var kazanilan=JSON.parse(localStorage.getItem("kazanilanRozetler")||"[]");
var yeni=[];
for(var i=0;i<ROZETLER.length;i++){
var r=ROZETLER[i],k=false;
if(r.id==="ilk"&&s.oyunSayisi>=1)k=true;
else if(r.id==="onoyun"&&s.oyunSayisi>=10)k=true;
else if(r.id==="yuzoyun"&&s.oyunSayisi>=100)k=true;
else if(r.id==="besyildiz"&&s.besYildiz>=1)k=true;
else if(r.id==="simsek"&&s.enIyiDeneme<=10)k=true;
else if(r.id==="mukemmel"&&s.besYildiz>=3)k=true;
else if(r.id==="efsane"&&s.enIyiDeneme<=100)k=true;
else if(r.id==="kral"&&s.oyunSayisi>=50)k=true;
if(k&&kazanilan.indexOf(r.id)===-1){kazanilan.push(r.id);yeni.push(r);}
}
localStorage.setItem("kazanilanRozetler",JSON.stringify(kazanilan));
rozetCiz();
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
},1500);
}
}

function rozetKapat(){
var md=document.getElementById("rozetModal");
if(md)md.classList.remove("show");
}

function rozetCiz(){
var kazanilan=JSON.parse(localStorage.getItem("kazanilanRozetler")||"[]");
var kap=document.getElementById("rozetler");
if(!kap)return;
var h="";
for(var i=0;i<ROZETLER.length;i++){
var r=ROZETLER[i],k=kazanilan.indexOf(r.id)!==-1;
h+='<div class="rozet '+(k?"kazanildi":"")+'" title="'+r.isim+'">'+r.emoji+'</div>';
}
kap.innerHTML=h;
   }
