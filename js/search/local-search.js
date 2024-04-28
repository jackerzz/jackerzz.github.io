"use strict";function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(r="Object"===r&&e.constructor?e.constructor.name:r)||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function asyncGeneratorStep(e,t,r,n,a,o,c){try{var i=e[o](c),s=i.value}catch(e){return void r(e)}i.done?t(s):Promise.resolve(s).then(n,a)}function _asyncToGenerator(i){return function(){var e=this,c=arguments;return new Promise(function(t,r){var n=i.apply(e,c);function a(e){asyncGeneratorStep(n,t,r,a,o,"next",e)}function o(e){asyncGeneratorStep(n,t,r,a,o,"throw",e)}a(void 0)})}}window.addEventListener("load",function(){function e(){var e=document.body.style;e.width="100%",e.overflow="hidden",btf.animateIn(n,"to_show 0.5s"),btf.animateIn(document.querySelector("#local-search .search-dialog"),"titleScale 0.5s"),setTimeout(function(){document.querySelector("#local-search-input input").focus()},100),r||(i(),r=!0),document.addEventListener("keydown",function e(t){"Escape"===t.code&&(o(),document.removeEventListener("keydown",e))})}function t(){document.querySelector("#search-button > .search").addEventListener("click",e)}var r=!1,a=[],n=document.getElementById("search-mask"),o=function(){var e=document.body.style;e.width="",e.overflow="",btf.animateOut(document.querySelector("#local-search .search-dialog"),"search_close .5s"),btf.animateOut(n,"to_hide 0.5s")},c=function(){var t=_asyncToGenerator(regeneratorRuntime.mark(function e(t){var r,n,a,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],e.next=3,fetch(t);case 3:if(n=e.sent,/\.json$/.test(t))return e.next=7,n.json();e.next=10;break;case 7:r=e.sent,e.next=20;break;case 10:return e.next=12,n.text();case 12:return a=e.sent,e.next=15,(new window.DOMParser).parseFromString(a,"text/xml");case 15:return a=e.sent,e.next=18,a;case 18:o=e.sent,r=_toConsumableArray(o.querySelectorAll("entry")).map(function(e){return{title:e.querySelector("title").textContent,content:e.querySelector("content")&&e.querySelector("content").textContent,url:e.querySelector("url").textContent}});case 20:return n.ok&&((o=document.getElementById("loading-database")).nextElementSibling.style.display="block",o.remove()),e.abrupt("return",r);case 22:case"end":return e.stop()}},e)}));return function(e){return t.apply(this,arguments)}}(),i=function(){GLOBAL_CONFIG.localSearch.preload||(a=c(GLOBAL_CONFIG.localSearch.path));var e=document.querySelector("#local-search-input input"),r=document.getElementById("local-search-results"),n=document.getElementById("loading-status");e.addEventListener("input",function(){var t=this,y=this.value.trim().toLowerCase().split(/[\s]+/);""!==y[0]&&(n.innerHTML='<i class="fas fa-spinner fa-pulse"></i>'),r.innerHTML="";var f,h='<div class="search-result-list">';y.length<=0||(f=0,a.then(function(e){e.forEach(function(e){var r,t,n,a,o,c=!0,i=e.title?e.title.trim().toLowerCase():"",s=e.content?e.content.trim().replace(/<[^>]+>/g,"").toLowerCase():"",l=e.url.startsWith("/")?e.url:GLOBAL_CONFIG.root+e.url,u=-1,d=-1;""!==i||""!==s?y.forEach(function(e,t){r=i.indexOf(e),u=s.indexOf(e),r<0&&u<0?c=!1:(u<0&&(u=0),0===t&&(d=u))}):c=!1,c&&(0<=d&&(t=d+100,a=n="",0===(e=(e=d-30)<0?0:e)?t=100:n="...",t>s.length?t=s.length:a="...",o=s.substring(e,t),y.forEach(function(e){var t=new RegExp(e,"gi");o=o.replace(t,'<span class="search-keyword">'+e+"</span>"),i=i.replace(t,'<span class="search-keyword">'+e+"</span>")}),h+='<div class="local-search__hit-item"><a href="'+l+'" class="search-result-title">'+i+"</a>",f+=1,""!==s&&(h+='<p class="search-result">'+n+o+a+"</p>")),h+="</div>")}),0===f&&(h+='<div id="local-search__hits-empty">'+GLOBAL_CONFIG.localSearch.languages.hits_empty.replace(/\$\{query}/,t.value.trim())+"</div>"),h+="</div>",r.innerHTML=h,""!==y[0]&&(n.innerHTML=""),window.pjax&&window.pjax.refresh(r)}))})};t(),document.querySelector("#local-search .search-close-button").addEventListener("click",o),n.addEventListener("click",o),GLOBAL_CONFIG.localSearch.preload&&(a=c(GLOBAL_CONFIG.localSearch.path)),window.addEventListener("pjax:complete",function(){btf.isHidden(n)||o(),t()})});