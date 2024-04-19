const version = "1713513443164";

window.onload = function() {
    const appUrl = document.getElementById("appUrl").value;

    // styles
    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = appUrl + 'index.css?v=' + version;


    // script

    const script = document.createElement("script");
    script.defer = "defer";
    script.src = appUrl + 'index.js?v=' + version;

    document.body.append(styles);
    document.body.append(script);

    console.log(appUrl);
}