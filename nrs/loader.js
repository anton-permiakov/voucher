(function initializeLoader() {
    const appVersion = '1.3.4';
    const isAppOutdated = !window.mtuNrsAppVersion || window.mtuNrsAppVersion !== appVersion;
    let appUrl = 'https://anton-permiakov.github.io/voucher/nrs';
    const appUrlFromQueryString = new URLSearchParams(window.location.search).get('mtuAppUrl');

    if(appUrlFromQueryString) {
        appUrl = appUrlFromQueryString;
    }

    let appScript = null;
    let appStyles = null;
    let stylesLoaded = false;

    window.openMtuApp = function(appMountPointId) {

        if(!appMountPointId) {
            console.error('Param appMountPointId is not provided');
            return;
        }

        const mountPoint = document.getElementById(appMountPointId);

        if(!mountPoint) {
            console.error(`Couldn't find element with id=${appMountPointId}`);
            return;
        }

        mountPoint.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 1024px;
            height: 768px;
            z-index: 1000;
            background: #FFF;
            display: block;
        `;

        const root = document.createElement('div');
        root.id = 'root';
        mountPoint.appendChild(root);

        loadMtuApp(appMountPointId);
    }

    function closeApp(appMountPointId) {
        const mountPoint = document.getElementById(appMountPointId);
        const mtuAppStyles = document.getElementById("mtuAppStyles");
        const mtuAppScript = document.getElementById("mtuAppScript");

        if(mountPoint) {
            mountPoint.style.display = 'none';
        }
        
        // First unmount the app
        if (window.AppLoader?.unmount) {
            window.AppLoader.unmount();
        }

        // Always remove script to force reinitialization
        if (appScript) {
            appScript.remove();
            appScript = null;
        }

        if(mtuAppScript) {
            mtuAppScript.remove();
        }

        // Remove styles and reset flag
        if (appStyles) {
            appStyles.remove();
            appStyles = null;
            stylesLoaded = false;
        }

        if(mtuAppStyles) {
            mtuAppStyles.remove();
        }

        // Clear the root element
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.innerHTML = '';
        }
    }

    async function loadStyles() {
        if (stylesLoaded) return;

        await new Promise((resolve, reject) => {
            appStyles = document.createElement('link');
            appStyles.rel = 'stylesheet';
            appStyles.href = `${appUrl}/index.css?v=${appVersion}`;
            appStyles.id = 'mtuAppStyles';
            appStyles.onload = () => {
                stylesLoaded = true;
                resolve();
            };
            appStyles.onerror = reject;
            document.head.appendChild(appStyles);
        });
    }

    async function loadMtuApp(appMountPointId) {
        try {
            debugger;
            document.removeEventListener('closeMtuApp', closeApp);

            // Load CSS first and keep it loaded
            await loadStyles();

            // Always remove existing script first
            if (appScript) {
                appScript.remove();
                appScript = null;
            }

            // Then load our app
            await new Promise((resolve, reject) => {
                appScript = document.createElement('script');
                appScript.type = 'module';
                appScript.src = `${appUrl}/index.js?v=${appVersion}`;
                appScript.id = "mtuAppScript";
                appScript.onload = () => {
                    // Short delay to ensure module initialization
                    setTimeout(() => {
                        if (typeof window.initializeAppLoader === 'function') {
                            window.initializeAppLoader();
                            if (window.AppLoader) {
                                window.AppLoader.initialize();
                                window.AppLoader.render();
                                // Set version after successful initialization
                                window.mtuNrsAppVersion = appVersion;
                                document.addEventListener('closeMtuApp', () => closeApp(appMountPointId));
                            }
                        }
                        resolve();
                    }, 100);
                };
                appScript.onerror = reject;
                document.body.appendChild(appScript);
            });

        } catch (error) {
            console.error('Error loading app:', error);
            // Clean up script on error
            if (appScript) {
                appScript.remove();
                appScript = null;
            }
        }
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }
})(); 