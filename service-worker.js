"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/index.html","96743f9c20a0de70dfaf65eb60a71edf"],["/static/css/main.538dd0bd.css","6dce0883fb5ee24b0797d3795f1c7bca"],["/static/js/main.233bf446.js","398acf41d31c9a2724549000978b2c61"],["/static/media/3Dproj2-low-res.0f1eaf00.jpg","0f1eaf00e693f8f70f79a5459461782b"],["/static/media/DSC_4252_small-low-res.991fcaa3.jpg","991fcaa32e87a55b9adbe7c61522d6d8"],["/static/media/DSC_4757_small-low-res.a6241e1e.jpg","a6241e1ef542ea15f10c85a91698f750"],["/static/media/DSC_5209_small-low-res.9eb793a7.jpg","9eb793a7e4ebd746a38de8231908f44d"],["/static/media/DSC_5230_small-low-res.02588e14.jpg","02588e14ac1a83655bdd5cd4f9ce46cf"],["/static/media/blockturnal.90efad59.png","90efad59a5e4bdb0bfc3c5c54252ee08"],["/static/media/bunch-of-quotes.c0513467.png","c0513467bbba3866d2518b5a3218f133"],["/static/media/circleboy.325113dc.jpg","325113dc8d4b987f4b60676da5902ab9"],["/static/media/circlewoman.63feda27.jpg","63feda277c6220036ece8ea88a783b26"],["/static/media/circlewoman.99eae8ae.jpg","99eae8aed953bf1d5a5adcaaf7d02b56"],["/static/media/client-after.45ae89a8.png","45ae89a89e522fd8b285d219940f4e1b"],["/static/media/dashboard-after.96354965.png","96354965b549f599c7077cd0f6187ede"],["/static/media/diabetes-1.5a66d33e.jpg","5a66d33e842f4d429aa8accaae0f559b"],["/static/media/diabetes-low-res.ace3a2b5.jpg","ace3a2b5ef7aa8dd711c205c9ddf6f2b"],["/static/media/diagonal-stripe-man.46bc81bc.jpg","46bc81bc40abc3c0a99e707e8e9ad946"],["/static/media/diagonal-stripe-man.c57826af.jpg","c57826af2ee411e7c342c1b5498e6f42"],["/static/media/discowoman.cc8af73d.jpg","cc8af73d0058c6e9298e637db161050c"],["/static/media/discowoman.eb13fcc2.jpg","eb13fcc2f6bde983fb057b38f1959c5d"],["/static/media/durer-1.0a95fbc7.jpg","0a95fbc7016df4e2e19933fd76a651ed"],["/static/media/durer-2.73844c87.jpg","73844c87f5c45e1de5fc3610476b98fe"],["/static/media/durer-low-res.fe5324c0.jpg","fe5324c00b449e2694bb4b0385116d15"],["/static/media/fontawesome-webfont.29800836.svg","2980083682e94d33a66eef2e7d612519"],["/static/media/fontawesome-webfont.706450d7.ttf","706450d7bba6374ca02fe167d86685cb"],["/static/media/fontawesome-webfont.97493d3f.woff2","97493d3f11c0a3bd5cbd959f5d19b699"],["/static/media/fontawesome-webfont.d9ee23d5.woff","d9ee23d59d0e0e727b51368b458a0bff"],["/static/media/fontawesome-webfont.f7c2b4b7.eot","f7c2b4b747b1a225eb8dee034134a1b0"],["/static/media/food-economy-1.9642e626.jpg","9642e62630474abc5f9fcc2c8ec49f37"],["/static/media/food-economy-2.f233e5b3.jpg","f233e5b3ba804574e0e567fcb5b39067"],["/static/media/foodbrochure-low-res.12222661.jpg","1222266195cc45c3a726ecb630a220cb"],["/static/media/form-creation-after.d8a91cff.png","d8a91cff49b82aa440df32b1b8e7294f"],["/static/media/forms-after.0a01235d.png","0a01235dcb6d40f4c0122c3219082ab8"],["/static/media/futura-1-low-res.244d39a0.jpg","244d39a0bdc4084c5b87920650fae7f6"],["/static/media/futura-1.40dc41ed.jpg","40dc41ed668ddc619f79ae69f9b3eb61"],["/static/media/futura-2.f5620d62.jpg","f5620d620279788caf2a364073530446"],["/static/media/futura-3.14833ca2.jpg","14833ca210f161e82801e9cc4c2a0fd8"],["/static/media/futura-4.8b94b598.jpg","8b94b5989644b89d69e7e71c7c02a93a"],["/static/media/futura-5-low-res.bd196b56.jpg","bd196b56f85e9d93f10c88425d8b1d06"],["/static/media/guide-1-low-res.40f56d58.jpg","40f56d5831e7afc37521461ada0834cc"],["/static/media/guide-1.e26ba373.jpg","e26ba3736c52ee9001cd005f2f74867d"],["/static/media/guide-2.7cfb391a.jpg","7cfb391a3b78a0f96e7199234c91c393"],["/static/media/guide-3.7db5622c.jpg","7db5622c4cba5f07a67eb9a51d3fe1b2"],["/static/media/guide-4.77e7fa8b.jpg","77e7fa8bdd1d030b17fe66762ddbb2fb"],["/static/media/heart-1.4c6f0fcf.jpg","4c6f0fcf67f79fd3852393a70d612235"],["/static/media/influential-1.7e01d3a4.jpg","7e01d3a4d19b1936c32ff4602e253f5e"],["/static/media/influential-2.3ff6721a.jpg","3ff6721a283d12e869adc4af898d46c9"],["/static/media/influential-low-res.538acd78.jpg","538acd78bfdceb58a227579a5a50563a"],["/static/media/insultinstitute.0307b693.png","0307b6936cdb94075f651706c83f8c7b"],["/static/media/localfood-low-res.ff657d81.jpg","ff657d81a83771cc17713d90329d305d"],["/static/media/localfood2-low-res.54d51787.jpg","54d51787c58d4f6ceff61997c6738d10"],["/static/media/localfood3-low-res.3aea25cc.jpg","3aea25cc47378dd2a77a5a7b08351bb0"],["/static/media/logo_1.ad2e84a4.jpg","ad2e84a4582b19a3ab1354d363f43929"],["/static/media/logo_2.91953768.jpg","9195376876b36f04c84841219bf2466e"],["/static/media/logo_3.6729911f.jpg","6729911f9bcbf354881911b7d534ff46"],["/static/media/logo_4.71e0524f.jpg","71e0524f4bec883ba0c8ae6f9550e569"],["/static/media/logo_5.8d2d470d.jpg","8d2d470d27a604402d041ef826fd40cb"],["/static/media/logo_6.cbd3f251.jpg","cbd3f25194557451fafea57af72d4866"],["/static/media/notorist.38e04404.png","38e0440415775681fccfc296bb2a4605"],["/static/media/officers.945d85fa.jpg","945d85fa0dda5da66d1787f22b0772de"],["/static/media/pcface1.28e0cd65.jpg","28e0cd6576346cb40bb753709e071c68"],["/static/media/pcface2.6c942548.jpg","6c942548aa64ac91cc76d3f83efdc9e0"],["/static/media/pcface3.535b0559.jpg","535b05596b9f81a5ba883cd20054d831"],["/static/media/pcface4.025e598c.jpg","025e598ccdd53b5a0af716b1ebd835a1"],["/static/media/pcface4.3ced4206.jpg","3ced42067124a11b6813cff1876c1a64"],["/static/media/pcface7.4f2450bc.jpg","4f2450bcd31c827c999d538b6d19e289"],["/static/media/pez-1.1847a77f.jpg","1847a77f86bbee751d53e164edac8899"],["/static/media/radiating.6327570c.jpg","6327570ced7f9e80a1efc80c392a2ec5"],["/static/media/radiating.95b0c464.jpg","95b0c464cac61a38d4e35be1017a5998"],["/static/media/reports-after.3299988d.png","3299988d98fc7729fe1ad65e89fdeac2"],["/static/media/robot-1.9a0a1a52.jpg","9a0a1a52751c03a9d0908b8062882bff"],["/static/media/robotgames-low-res.c80bbd10.jpg","c80bbd1058c7fcd9bec41f53366e5171"],["/static/media/roshamboai.0c9eda57.png","0c9eda57e6b65cc9d69e2d209da8eb7e"],["/static/media/scanface1.9bc0f3fe.jpg","9bc0f3fe60c3fc6b8ef324c4a120d905"],["/static/media/sheet-filling-landscape-after.d64c3f97.png","d64c3f97b2e0449705bf0084f933408f"],["/static/media/squareman.edf639a5.jpg","edf639a55a1a8dde0c00bf78c2a2b710"],["/static/media/squareman2.e1fba6cd.jpg","e1fba6cd099fed473eb167334d59973d"],["/static/media/stripeman.2e8b0ffd.jpg","2e8b0ffd0220989388ca9e9e5b7115a3"],["/static/media/stripeman.f410af21.jpg","f410af21331b3685db59f1b66ad11d9a"],["/static/media/strippedfaces.9a8b09ef.jpg","9a8b09eff5dec851be04396332b646ac"],["/static/media/styleguide-1.ff32219c.png","ff32219c7064703057fda0ec1c660cde"],["/static/media/styleguide-2.6f1e0dc4.png","6f1e0dc4e7b4b6e0bf28bfb0d4cab6b3"],["/static/media/styleguide-3.7356694e.png","7356694e41d3a10f9b034aa9f28506f5"],["/static/media/styleguide-4.eab7ab8e.png","eab7ab8edb761cb5c759cf97df4f4648"],["/static/media/timer-after.50f57607.png","50f57607fbcf44d661f6bca676479a0a"],["/static/media/twofonts-low-res.76c26515.jpg","76c265155cca0c91dbf332ee13d2370d"],["/static/media/voronoia.61b01cc4.png","61b01cc4f87fedca857b44eef209455a"],["/static/media/zenhues.185e7eeb.png","185e7eeb8bc943e9381f2ab2e3ea6f3e"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var c=new URL(e);return"/"===c.pathname.slice(-1)&&(c.pathname+=a),c.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(a){return new Response(a,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,a,c,t){var d=new URL(e);return t&&d.pathname.match(t)||(d.search+=(d.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(c)),d.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var c=new URL(a).pathname;return e.some(function(e){return c.match(e)})},stripIgnoredUrlParameters=function(e,a){var c=new URL(e);return c.hash="",c.search=c.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return a.every(function(a){return!a.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),c.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],c=e[1],t=new URL(a,self.location),d=createCacheKey(t,hashParamName,c,/\.\w{8}\./);return[t.toString(),d]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(c){if(!a.has(c)){var t=new Request(c,{credentials:"same-origin"});return fetch(t).then(function(a){if(!a.ok)throw new Error("Request for "+c+" returned a response with status "+a.status);return cleanResponse(a).then(function(a){return e.put(c,a)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(c){return Promise.all(c.map(function(c){if(!a.has(c.url))return e.delete(c)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var a,c=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(a=urlsToCacheKeys.has(c))||(c=addDirectoryIndex(c,"index.html"),a=urlsToCacheKeys.has(c));!a&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(c=new URL("/index.html",self.location).toString(),a=urlsToCacheKeys.has(c)),a&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(c)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(a){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,a),fetch(e.request)}))}});