if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,t)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const d={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return d;default:return e(s)}}))).then((e=>{const s=t(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-ac8ffed3"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.4d3f3414.js",revision:"c790b211971a3cd6ac0ce82b5f44f00e"},{url:"assets/index.ac0ee6fc.css",revision:"a23e2dd58685630dda0e7788dd421e71"},{url:"assets/vendor.5200a3eb.js",revision:"146e658be17d0d4052ec8a814edfba3b"},{url:"index.html",revision:"6a7deb3e0b83402a375f5b01f761b627"},{url:"registerSW.js",revision:"e27e19b612bed8eaeb142144f08a39d7"},{url:"manifest.webmanifest",revision:"dfd79d5304d9addb367af1f3461ed8f3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
