if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,t)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const n={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return n;default:return e(s)}}))).then((e=>{const s=t(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-ac8ffed3"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.72c42953.css",revision:"b77de3f5856b5f3f1317fda86c46682f"},{url:"assets/index.c2af57b9.js",revision:"87cc7234ed2e6ceed46f7d7efa988780"},{url:"assets/vendor.631ca655.js",revision:"35b7ea4e5eed2d1ffdefcdcdb8228bbe"},{url:"index.html",revision:"c97c2b9d85734ee2c531d7d21cbc3e77"},{url:"registerSW.js",revision:"e27e19b612bed8eaeb142144f08a39d7"},{url:"manifest.webmanifest",revision:"4679fbcd33dd0ee18f392c7988c3ab80"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
