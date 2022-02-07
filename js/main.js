"use strict";function _typeof(e){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}document.addEventListener("DOMContentLoaded",function(){function s(e){e&&(t=document.getElementById("site-name").offsetWidth,e=document.querySelectorAll("#menus .menus_item"),n=0,e.length&&e.forEach(function(e){n+=e.offsetWidth}),e=document.querySelector("#search-button"),o=e?e.offsetWidth:0,u=document.getElementById("nav")),window.innerWidth<768||t+n+o>u.offsetWidth-120?u.classList.add("hide-menu"):u.classList.remove("hide-menu")}function d(){var e,t,n,a,c,o,r,l,s,d,i,u,m,f=GLOBAL_CONFIG.highlight;function h(e,t,n){var o,i=document.createDocumentFragment();c&&((o=document.createElement("div")).className="highlight-tools ".concat(d),o.innerHTML=l+e+s,o.addEventListener("click",u),i.appendChild(o)),a&&t.offsetHeight>a+30&&((o=document.createElement("div")).className="code-expand-btn",o.innerHTML='<i class="fas fa-angle-double-down"></i>',o.addEventListener("click",m),i.appendChild(o)),"hl"===n?t.insertBefore(i,t.firstChild):t.parentNode.insertBefore(i,t)}f&&(e=f.highlightCopy,t=f.highlightLang,n=GLOBAL_CONFIG_SITE.isHighlightShrink,a=f.highlightHeightLimit,c=e||t||void 0!==n,o="highlighjs"===f.plugin?document.querySelectorAll("figure.highlight"):document.querySelectorAll('pre[class*="language-"]'),(c||a)&&o.length&&(r="prismjs"===f.plugin,d=!(s=l="")===n?"closed":"",void 0!==n&&(l='<i class="fas fa-angle-down expand '.concat(d,'"></i>')),e&&(s='<div class="copy-notice"></div><i class="fas fa-paste copy-button"></i>'),i=function(e){var t=e.parentNode;t.classList.add("copy-true");var n=window.getSelection(),o=document.createRange();r?o.selectNodeContents(t.querySelectorAll("pre code")[0]):o.selectNodeContents(t.querySelectorAll("table .code pre")[0]),n.removeAllRanges(),n.addRange(o);var i;n.toString();e=e.lastChild,document.queryCommandSupported&&document.queryCommandSupported("copy")?(document.execCommand("copy"),void 0!==GLOBAL_CONFIG.Snackbar?btf.snackbarShow(GLOBAL_CONFIG.copy.success):((i=e.previousElementSibling).innerText=GLOBAL_CONFIG.copy.success,i.style.opacity=1,setTimeout(function(){i.style.opacity=0},700))):void 0!==GLOBAL_CONFIG.Snackbar?btf.snackbarShow(GLOBAL_CONFIG.copy.noSupport):e.previousElementSibling.innerText=GLOBAL_CONFIG.copy.noSupport,n.removeAllRanges(),t.classList.remove("copy-true")},u=function(e){var t,n=e.target.classList;n.contains("expand")?(e=_toConsumableArray((t=this).parentNode.children).slice(1),t.firstChild.classList.toggle("closed"),btf.isHidden(e[e.length-1])?e.forEach(function(e){e.style.display="block"}):e.forEach(function(e){e.style.display="none"})):n.contains("copy-button")&&i(this)},m=function(){this.classList.toggle("expand-done")},t?r?o.forEach(function(e){var t=e.getAttribute("data-language")?e.getAttribute("data-language"):"Code",t='<div class="code-lang">'.concat(t,"</div>");btf.wrap(e,"figure",{class:"highlight"}),h(t,e)}):o.forEach(function(e){var t=e.getAttribute("class").split(" ")[1];h('<div class="code-lang">'.concat(t="plain"===t||void 0===t?"Code":t,"</div>"),e,"hl")}):r?o.forEach(function(e){btf.wrap(e,"figure",{class:"highlight"}),h("",e)}):o.forEach(function(e){h("",e,"hl")})))}var t,n,o,u,i=!1,m=function(){btf.sidebarPaddingR(),document.body.style.overflow="hidden",btf.animateIn(document.getElementById("menu-mask"),"to_show 0.5s"),document.getElementById("sidebar-menus").classList.add("open"),i=!0},a=function(){var e=document.body;e.style.overflow="",e.style.paddingRight="",btf.animateOut(document.getElementById("menu-mask"),"to_hide 0.5s"),document.getElementById("sidebar-menus").classList.remove("open"),i=!1};function f(){var o,i,a,c,r,l=document.getElementById("rightside"),s=window.innerHeight+56;document.body.scrollHeight<=s?l.style.cssText="opacity: 1; transform: translateX(-58px)":(i=!(o=0),a=document.getElementById("page-header"),c="function"==typeof chatBtnHide,r="function"==typeof chatBtnShow,window.scrollCollect=function(){return btf.throttle(function(e){var t,n=window.scrollY||document.documentElement.scrollTop;t=o<n;56<(o=n)?(t?(a.classList.contains("nav-visible")&&a.classList.remove("nav-visible"),r&&!0===i&&(chatBtnHide(),i=!1)):(a.classList.contains("nav-visible")||a.classList.add("nav-visible"),c&&!1===i&&(chatBtnShow(),i=!0)),a.classList.add("nav-fixed"),"0"===window.getComputedStyle(l).getPropertyValue("opacity")&&(l.style.cssText="opacity: 0.8; transform: translateX(-58px)")):(0===n&&a.classList.remove("nav-fixed","nav-visible"),l.style.cssText="opacity: ''; transform: ''"),document.body.scrollHeight<=s&&(l.style.cssText="opacity: 0.8; transform: translateX(-58px)")},200)()},window.addEventListener("scroll",scrollCollect))}function h(){var a,e,c,r,i,l,t,s,d,u=GLOBAL_CONFIG_SITE.isToc,m=GLOBAL_CONFIG.isAnchor,f=document.getElementById("article-container");f&&(u||m)&&(u&&(e=document.getElementById("card-toc"),r=(c=e.getElementsByClassName("toc-content")[0]).querySelectorAll(".toc-link"),i=e.querySelector(".toc-percentage"),l=c.classList.contains("is-expand"),t=function(e){var t=f.clientHeight,n=document.documentElement.clientHeight,o=f.offsetTop,n=n<t?t-n:document.documentElement.scrollHeight-n,n=Math.round(100*((e-o)/n));i.textContent=100<n?100:n<=0?0:n},window.mobileToc={open:function(){e.style.cssText="animation: toc-open .3s; opacity: 1; right: 55px"},close:function(){e.style.animation="toc-close .2s",setTimeout(function(){e.style.cssText="opacity:''; animation: ''; right: ''"},100)}},c.addEventListener("click",function(e){e.preventDefault();e=e.target.classList.contains("toc-link")?e.target:e.target.parentElement;btf.scrollToDest(btf.getEleTop(document.getElementById(decodeURI(e.getAttribute("href")).replace("#",""))),300),window.innerWidth<900&&window.mobileToc.close()}),a=function(e){var t=e.getBoundingClientRect().top,e=c.scrollTop;t>document.documentElement.clientHeight-100&&(c.scrollTop=e+150),t<100&&(c.scrollTop=e-150)}),s=f.querySelectorAll("h1,h2,h3,h4,h5,h6"),d="",window.tocScrollFn=function(){return btf.throttle(function(){var e=window.scrollY||document.documentElement.scrollTop;u&&t(e),function(n){if(0===n)return;var o="",i="";if(s.forEach(function(e,t){n>btf.getEleTop(e)-80&&(e=e.id,o=e?"#"+encodeURI(e):"",i=t)}),d!==i&&(m&&btf.updateAnchor(o),d=i,u&&(c.querySelectorAll(".active").forEach(function(e){e.classList.remove("active")}),""!==o))){var e=r[i];if(e.classList.add("active"),setTimeout(function(){a(e)},0),!l)for(var t=e.parentNode;!t.matches(".toc");t=t.parentNode)t.matches("li")&&t.classList.add("active")}}(e)},100)()},window.addEventListener("scroll",tocScrollFn))}var c=function(){var t=document.body;t.classList.add("read-mode");var n=document.createElement("button");n.type="button",n.className="fas fa-sign-out-alt exit-readmode",t.appendChild(n),n.addEventListener("click",function e(){t.classList.remove("read-mode"),n.remove(),n.removeEventListener("click",e)})},r=function(){"light"==("dark"===document.documentElement.getAttribute("data-theme")?"dark":"light")?(activateDarkMode(),saveToLocal.set("theme","dark",2),void 0!==GLOBAL_CONFIG.Snackbar&&btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)):(activateLightMode(),saveToLocal.set("theme","light",2),void 0!==GLOBAL_CONFIG.Snackbar&&btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)),"function"==typeof utterancesTheme&&utterancesTheme(),"function"==typeof changeGiscusTheme&&changeGiscusTheme(),"object"===("undefined"==typeof FB?"undefined":_typeof(FB))&&window.loadFBComment(),window.DISQUS&&document.getElementById("disqus_thread").children.length&&setTimeout(function(){return window.disqusReset()},200),"function"==typeof runMermaid&&window.runMermaid()},l=function(e){var t=document.getElementById("rightside-config-hide").classList;t.toggle("show"),e.classList.contains("show")&&(t.add("status"),setTimeout(function(){t.remove("status")},300)),e.classList.toggle("show")},g=function(){btf.scrollToDest(0,500)},y=function(){var e=document.documentElement.classList;e.contains("hide-aside")?saveToLocal.set("aside-status","show",2):saveToLocal.set("aside-status","hide",2),e.toggle("hide-aside")},p=function(){"0"===window.getComputedStyle(document.getElementById("card-toc")).getPropertyValue("opacity")?window.mobileToc.open():window.mobileToc.close()};document.getElementById("rightside").addEventListener("click",function(e){var t=e.target.id?e.target:e.target.parentNode;switch(t.id){case"go-up":g();break;case"rightside_config":l(t);break;case"mobile-toc-button":p();break;case"readmode":c();break;case"darkmode":r();break;case"hide-aside-btn":y()}});function b(e){e.forEach(function(e){var t=e,e=t.getAttribute("datetime");t.innerText=btf.diffDate(e,!0),t.style.display="inline"})}var v,L=function(){document.querySelectorAll("#article-container .tab > button").forEach(function(e){e.addEventListener("click",function(e){var t,n,o,i=this.parentNode;i.classList.contains("active")||(o=i.parentNode.nextElementSibling,(t=btf.siblings(i,".active")[0])&&t.classList.remove("active"),i.classList.add("active"),n=this.getAttribute("data-href").replace("#",""),_toConsumableArray(o.children).forEach(function(e){e.id===n?e.classList.add("active"):e.classList.remove("active")}),0<(o=o.querySelectorAll("#".concat(n," .fj-gallery"))).length&&btf.initJustifiedGallery(o))})})},E=function(){document.querySelectorAll("#article-container .tabs .tab-to-top").forEach(function(e){e.addEventListener("click",function(){btf.scrollToDest(btf.getEleTop(btf.getParents(this,".tabs")),300)})})};window.refreshFn=function(){var e,t,n,o,i;s(!0),u.classList.add("show"),GLOBAL_CONFIG_SITE.isPost?(void 0!==GLOBAL_CONFIG.noticeOutdate&&(o=GLOBAL_CONFIG.noticeOutdate,(i=btf.diffDate(GLOBAL_CONFIG_SITE.postUpdate))>=o.limitDay&&((n=document.createElement("div")).className="post-outdate-notice",n.textContent=o.messagePrev+" "+i+" "+o.messageNext,i=document.getElementById("article-container"),"top"===o.position?i.insertBefore(n,i.firstChild):i.appendChild(n))),GLOBAL_CONFIG.relativeDate.post&&b(document.querySelectorAll("#post-meta time"))):(GLOBAL_CONFIG.relativeDate.homepage&&b(document.querySelectorAll("#recent-posts time")),!GLOBAL_CONFIG.runtime||(n=document.getElementById("runtimeshow"))&&(t=n.getAttribute("data-publishDate"),n.innerText=btf.diffDate(t)+" "+GLOBAL_CONFIG.runtime),(t=document.getElementById("last-push-date"))&&(e=t.getAttribute("data-lastPushDate"),t.innerText=btf.diffDate(e,!0)),(e=document.querySelectorAll("#aside-cat-list .card-category-list-item.parent i")).length&&e.forEach(function(e){e.addEventListener("click",function(e){e.preventDefault();this.classList.toggle("expand");e=this.parentNode.nextElementSibling;btf.isHidden(e)?e.style.display="block":e.style.display="none"})})),h(),!GLOBAL_CONFIG_SITE.isHome||(l=document.getElementById("scroll-down"))&&l.addEventListener("click",function(){btf.scrollToDest(document.getElementById("content-inner").offsetTop,300)}),d(),GLOBAL_CONFIG.isPhotoFigcaption&&document.querySelectorAll("#article-container img").forEach(function(e){var t,n=e.parentNode,o=e.title||e.alt;o&&!n.parentNode.classList.contains("justified-gallery")&&((t=document.createElement("div")).className="img-alt is-center",t.textContent=o,n.insertBefore(t,e.nextSibling))}),f();var a,c,r,l=document.querySelectorAll("#article-container .fj-gallery");l.length&&((a=l).forEach(function(e){e.querySelectorAll("img").forEach(function(e){var t=e.getAttribute("data-lazy-src");t&&(e.src=t),btf.wrap(e,"div",{class:"fj-gallery-item"})})}),window.fjGallery?setTimeout(function(){btf.initJustifiedGallery(a)},100):((r=document.createElement("link")).rel="stylesheet",r.href=GLOBAL_CONFIG.source.justifiedGallery.css,document.body.appendChild(r),getScript("".concat(GLOBAL_CONFIG.source.justifiedGallery.js)).then(function(){btf.initJustifiedGallery(a)}))),btf.loadLightbox(document.querySelectorAll("#article-container img:not(.no-lightbox)")),(r=document.querySelectorAll("#article-container :not(.highlight) > table, #article-container > table")).length&&r.forEach(function(e){btf.wrap(e,"div",{class:"table-wrap"})}),(r=document.querySelectorAll("#article-container .hide-button")).length&&r.forEach(function(e){e.addEventListener("click",function(e){var t=this.nextElementSibling;this.classList.toggle("open"),this.classList.contains("open")&&0<t.querySelectorAll(".fj-gallery").length&&btf.initJustifiedGallery(t.querySelectorAll(".fj-gallery"))})}),L(),E(),c=!1,(r=document.querySelector("#comment-switch > .switch-btn"))&&r.addEventListener("click",function(){this.classList.toggle("move"),document.querySelectorAll("#post-comment > .comment-wrap > div").forEach(function(e){btf.isHidden(e)?e.style.cssText="display: block;animation: tabshow .5s":e.style.cssText="display: none;animation: ''"}),c||"function"!=typeof loadOtherComment||(c=!0,loadOtherComment())}),document.getElementById("toggle-menu").addEventListener("click",function(){m()})},refreshFn(),window.addEventListener("resize",function(){s(!1),btf.isHidden(document.getElementById("toggle-menu"))&&i&&a()}),document.getElementById("menu-mask").addEventListener("click",function(e){a()}),document.querySelectorAll("#sidebar-menus .site-page.group").forEach(function(e){e.addEventListener("click",function(){this.classList.toggle("hide")})}),GLOBAL_CONFIG.islazyload&&(window.lazyLoadInstance=new LazyLoad({elements_selector:"img",threshold:0,data_src:"lazy-src"})),void 0!==GLOBAL_CONFIG.copyright&&(v=GLOBAL_CONFIG.copyright,document.body.oncopy=function(e){e.preventDefault();var t=window.getSelection(0).toString(),t=t.length>v.limitCount?t+"\n\n\n"+v.languages.author+"\n"+v.languages.link+window.location.href+"\n"+v.languages.source+"\n"+v.languages.info:t;return(e.clipboardData?e:window).clipboardData.setData("text",t)})});