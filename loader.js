const version = "1713513443164";

window.onload = function() {
    const appUrl = document.getElementById("appUrl").value;
    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = appUrl + 'index.css?v=' + version;
    const script = document.createElement("script");
    script.defer = "defer";
    script.src = appUrl + 'index.js?v=' + version;
    document.body.appendChild(styles);
    document.body.appendChild(script);
    console.log(appUrl);
}