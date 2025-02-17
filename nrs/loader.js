let appScript = null;
let appStyles = null;
let stylesLoaded = false;

const style = document.createElement('style');
style.textContent = `
	.mtu-popup {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		display: none;
	}
	
	.mtu-close-button {
		display: none;
		position: absolute;
		top: 20px;
		right: 20px;
		padding: 10px 20px;
		background: #f0f0f0;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}
`;
document.head.appendChild(style);

const popup = document.createElement('div');
popup.id = 'mtuPopup';
popup.className = 'mtu-popup';

const closeButton = document.createElement('button');
closeButton.className = 'mtu-close-button';
closeButton.id = 'closeMtuApp';
closeButton.onclick = closeApp;
closeButton.textContent = 'Close';
popup.appendChild(closeButton);

const root = document.createElement('div');
root.id = 'root';
root.style.height = "100%";
popup.appendChild(root);

const merchantScreen = document.getElementById("merchant-screen");
merchantScreen.append(popup);

function openApp() {
	document.getElementById('mtuPopup').style.display = 'block';
	loadApp();
}

function closeApp() {
	document.getElementById('mtuPopup').remove();
	const mtuAppStyles = document.getElementById("mtuAppStyles");
	const mtuAppScript = document.getElementById("mtuAppScript");

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

	// Remove the AppLoader instance and initialization function
	window.AppLoader = undefined;
	window.initializeAppLoader = undefined;
}

async function loadStyles() {
	if (stylesLoaded) return;

	await new Promise((resolve, reject) => {
		appStyles = document.createElement('link');
		appStyles.rel = 'stylesheet';
		appStyles.href = 'https://anton-permiakov.github.io/voucher/nrs/index.css';
		appStyles.id = 'mtuAppStyles';
		appStyles.onload = () => {
			stylesLoaded = true;
			resolve();
		};
		appStyles.onerror = reject;
		document.head.appendChild(appStyles);
	});
}

async function loadApp() {
	try {
		// Load CSS first and keep it loaded
		await loadStyles();

		// Always remove existing script first
		if (appScript) {
			appScript.remove();
			appScript = null;
		}

		// Only load React and ReactDOM if they're not already available
		if (!window.React || !window.ReactDOM) {
			await Promise.all([
				loadScript('https://unpkg.com/react@18/umd/react.development.js'),
				loadScript('https://unpkg.com/react-dom@18/umd/react-dom.development.js')
			]);
		}

		// Then load our app
		await new Promise((resolve, reject) => {
			appScript = document.createElement('script');
			appScript.type = 'module';
			appScript.src = `https://anton-permiakov.github.io/voucher/nrs/index.js?t=${Date.now()}`; // Cache busting
			appScript.id = "mtuAppScript";
			appScript.onload = () => {
				// Short delay to ensure module initialization
				setTimeout(() => {
					if (typeof window.initializeAppLoader === 'function') {
						window.initializeAppLoader();
						if (window.AppLoader) {
							window.AppLoader.initialize();
							window.AppLoader.render();
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
openApp();