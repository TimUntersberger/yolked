if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,t)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const n={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return n;default:return e(s)}}))).then((e=>{const s=t(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-ac8ffed3"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.6027b9e1.js",revision:"a5ec61cc7d98a4e7459c245f18a576f5"},{url:"assets/index.76f38b84.css",revision:"7db469178e308ca74866cb3ba64a059b"},{url:"assets/vendor.631ca655.js",revision:"35b7ea4e5eed2d1ffdefcdcdb8228bbe"},{url:"index.html",revision:"18ff67d15d4048c3c04157b6256b6884"},{url:"registerSW.js",revision:"e27e19b612bed8eaeb142144f08a39d7"},{url:"manifest.webmanifest",revision:"dfd79d5304d9addb367af1f3461ed8f3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
