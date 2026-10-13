var CACHE_NAME="renk-carki-v2";
var DOSYALAR=["./","./index.html","./tablo.html","./Tablo.js","./Rozet.js","./manifest.json","./logo.png"];

self.addEventListener("install",function(e){
e.waitUntil(caches.open(CACHE_NAME).then(function(c){return c.addAll(DOSYALAR);}).catch(function(){}));
self.skipWaiting();
});

self.addEventListener("activate",function(e){
e.waitUntil(caches.keys().then(function(k){
return Promise.all(k.filter(function(x){return x!==CACHE_NAME;}).map(function(x){return caches.delete(x);}));
}));
self.clients.claim();
});

self.addEventListener("fetch",function(e){
if(e.request.method!=="GET")return;
e.respondWith(
caches.match(e.request).then(function(r){
return r||fetch(e.request).then(function(res){
var rs=res.clone();
caches.open(CACHE_NAME).then(function(c){c.put(e.request,rs);}).catch(function(){});
return res;
}).catch(function(){return caches.match("./index.html");});
})
);
});
