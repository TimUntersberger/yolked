if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let s=Promise.resolve();return r[e]||(s=new Promise((async s=>{if("document"in self){const r=document.createElement("script");r.src=e,document.head.appendChild(r),r.onload=s}else importScripts(e),s()}))),s.then((()=>{if(!r[e])throw new Error(`Module ${e} didn’t register its module`);return r[e]}))},s=(s,r)=>{Promise.all(s.map(e)).then((e=>r(1===e.length?e[0]:e)))},r={require:Promise.resolve(s)};self.define=(s,i,t)=>{r[s]||(r[s]=Promise.resolve().then((()=>{let r={};const n={uri:location.origin+s.slice(1)};return Promise.all(i.map((s=>{switch(s){case"exports":return r;case"module":return n;default:return e(s)}}))).then((e=>{const s=t(...e);return r.default||(r.default=s),r}))})))}}define("./sw.js",["./workbox-ac8ffed3"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.8e5ec761.css",revision:"d4d943f2e21a23c900349cedeb2867ed"},{url:"assets/index.da5f4f6e.js",revision:"7164df59e7ecd64f01fb840b4527be70"},{url:"assets/vendor.69310ef0.js",revision:"5939a674031d844f5ffcc03e9b2f7120"},{url:"index.html",revision:"7c6a1724f9c3b3088a4e0032056bb6fb"},{url:"registerSW.js",revision:"e27e19b612bed8eaeb142144f08a39d7"},{url:"manifest.webmanifest",revision:"dfd79d5304d9addb367af1f3461ed8f3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
//# sourceMappingURL=sw.js.map
