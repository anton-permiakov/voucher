(function(){const p="1.0.0",y=`
    position: absolute;
    top: 0;
    left: 0;
    width: 1024px;
    height: 768px;
    z-index: 1000;
    background: #FFF;
    display: block;
  `;let n=null,i=null,s=!1,a=null,r=null,c="https://boss-retail-cdn-qa.awsqa.idt.net/mtu-nrs";const u=new URLSearchParams(window.location.search).get("mtuAppUrl");if(u)try{const o=new URL(u);c=u}catch(o){console.error("Invalid URL provided in query string:",o)}function E(o){const e=document.createElement("div");e.className="mtu-app-loader",e.innerHTML=`
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      ">
        <div style="
          border: 5px solid #f3f3f3;
          border-top: 5px solid #F5222D;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          margin: 24px auto 20px;
          animation: mtu-spin 2s linear infinite;
        "></div>
        <p>Loading application...</p>
      </div>
    `;const t=document.createElement("style");return t.textContent=`
      @keyframes mtu-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,document.head.appendChild(t),o.appendChild(e),e}window.openMtuApp=function(o){if(!o){console.error("Error: appMountPointId is required");return}const e=document.getElementById(o);if(!e){console.error(`Error: Couldn't find element with id=${o}`);return}a=o,e.style.cssText=y;const t=document.createElement("div");t.id="root",e.appendChild(t),r=E(e),h(o).catch(l=>{console.error("Failed to load MTU application:",l),f(e,"Failed to load the application. Please try again later.")})};function f(o,e){r&&(r.remove(),r=null);const t=document.createElement("div");t.style.cssText=`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #e74c3c;
      max-width: 80%;
    `,t.innerHTML=`
      <h3>Error</h3>
      <p>${e}</p>
      <button id="mtu-retry-button" style="
        padding: 8px 16px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 15px;
      ">Exit</button>
    `,o.appendChild(t),document.getElementById("mtu-retry-button").addEventListener("click",()=>{t.remove(),window.closeApp(a)})}function m(o){var w;const e=document.getElementById(o),t=document.getElementById("mtuAppStyles"),l=document.getElementById("mtuAppScript");e&&(e.style.display="none"),(w=window.AppLoader)!=null&&w.unmount&&window.AppLoader.unmount(),n&&(n.remove(),n=null),l&&l.remove(),i&&(i.remove(),i=null,s=!1),t&&t.remove(),r&&(r.remove(),r=null);const d=document.getElementById("root");d&&d.remove(),a=null}async function g(){if(!s)return new Promise((o,e)=>{const t=setTimeout(()=>{e(new Error("Timeout loading styles"))},3e4);i=document.createElement("link"),i.rel="stylesheet",i.href=`${c}/index.css?v=${p}`,i.id="mtuAppStyles",i.onload=()=>{clearTimeout(t),s=!0,o()},i.onerror=l=>{clearTimeout(t),e(new Error(`Failed to load styles: ${l.message||"Unknown error"}`))},document.head.appendChild(i)})}async function h(o){try{document.removeEventListener("closeMtuApp",m),await g(),n&&(n.remove(),n=null),await new Promise((e,t)=>{const l=setTimeout(()=>{t(new Error("Timeout loading application script"))},3e4);n=document.createElement("script"),n.type="module",n.src=`${c}/index.js?v=${p}`,n.id="mtuAppScript",n.onload=()=>{clearTimeout(l),setTimeout(()=>{typeof window.initializeAppLoader=="function"?(window.initializeAppLoader(),window.AppLoader?(window.AppLoader.initialize(),window.AppLoader.render(),window.mtuNrsAppVersion=p,r&&(r.remove(),r=null),document.addEventListener("closeMtuApp",()=>m(o))):t(new Error("AppLoader not available after initialization"))):t(new Error("initializeAppLoader function not found")),e()},100)},n.onerror=d=>{clearTimeout(l),t(new Error(`Failed to load application script: ${d.message||"Unknown error"}`))},document.body.appendChild(n)})}catch(e){console.error("Error loading application:",e),n&&(n.remove(),n=null),r&&(r.remove(),r=null);const t=document.getElementById(o);throw t&&f(t,e.message||"Failed to load the application"),e}}window.closeMtuApp=function(){a&&m(a)}})();
