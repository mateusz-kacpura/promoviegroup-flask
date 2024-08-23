var PATH = "http://127.0.0.1/efekty/adds/menuspy/";

async function loadCSS(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

async function loadJS(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function loadAssets() {
  await Promise.all([
    loadCSS(PATH+'assets/main.css'),
    loadJS(PATH+'dist/menuspy.js')
  ]);
}

async function initializeMenuSpy() {
  var lavalampElm = document.querySelector('.lavalamp');
  var positionLavalamp = function(activeElm) {
    lavalampElm.style.width = activeElm.elm.offsetWidth + 'px';
    lavalampElm.style.left = activeElm.elm.offsetLeft + 'px';
  };
  var elm = document.querySelector('#main-header');
  var ms = new MenuSpy(elm, {
    callback: positionLavalamp
  });

  positionLavalamp({ elm: elm.querySelector('li.active') });

  var elmRight = document.querySelector('#right-menu');
  var msRight = new MenuSpy(elmRight);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAssets();
  await initializeMenuSpy(); // Wywołujemy initializeMenuSpy jako ostatnią
});