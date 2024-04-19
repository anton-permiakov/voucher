const version = "1713513443164";

window.onload = function() {
    const appUrl = document.getElementById("appUrl").value;

    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = appUrl + 'index.css?v=' + version;

    const script = document.createElement("script");
    script.type = "module";
    script.crossOrigin = true;
    script.src = appUrl + 'index.js?v=' + version;

    const legacyPolyfill = document.createElement("script");
    legacyPolyfill.noModule = true;
    legacyPolyfill.crossOrigin = true
    legacyPolyfill.src = appUrl + 'polyfills-legacy.js?v=' + version;

    const legacyScript = document.createElement("script");
    legacyScript.noModule = true;
    legacyScript.crossOrigin = true
    legacyScript.dataset.src = appUrl + 'index-legacy.js?v=' + version;

    document.head.appendChild(styles);
    document.head.appendChild(script);
    document.head.appendChild(legacyPolyfill);
    document.head.appendChild(legacyScript);
}