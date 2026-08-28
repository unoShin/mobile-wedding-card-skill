const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

console.log('--- Starting JSDOM rendering & verification test ---');

// 1. Read files
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const appJsContent = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8');
const petalsJsContent = fs.existsSync(path.join(__dirname, 'js/petals.js')) 
  ? fs.readFileSync(path.join(__dirname, 'js/petals.js'), 'utf8') 
  : '';
const configJsonContent = fs.readFileSync(path.join(__dirname, 'data/config.json'), 'utf8');

// 2. Setup Virtual DOM with JSDOM
const dom = new JSDOM(htmlContent, {
  url: 'http://localhost/',
  runScripts: 'outside-only',
  resources: 'usable'
});

const { window } = dom;
const { document } = window;

// 3. Mock APIs that JSDOM doesn't support or needs customization
window.IntersectionObserver = class {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }
  observe(target) {
    // Simulate immediate intersection to trigger animations
    if (this.callback) {
      this.callback([{ isIntersecting: true, target }], this);
    }
  }
  unobserve() {}
};

// Mock fetch
window.fetch = (url, options) => {
  console.log(`[Fetch Mock] Request to: ${url}`);
  if (url.includes('config.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(JSON.parse(configJsonContent))
    });
  }
  if (url.includes('script.google.com') || url.includes('macros/s/')) {
    const isPost = options && options.method === 'POST';
    if (isPost) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ result: 'success' })
      });
    } else {
      // GET request to load guestbook
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          result: 'success',
          data: [
            { name: "민우 & 지현", date: "2026-06-14T12:00:00.000Z", message: "윤호야, 다연아! 결혼 진심으로 축하해! 평생 행복하고 예쁘게 살아라!! ♥" },
            { name: "김부장님", date: "2026-06-12T09:00:00.000Z", message: "윤호 대리 결혼을 축하하네. 인생의 새로운 2막을 응원하네. 행복이 가득하길." },
            { name: "혜원 (플라워샵)", date: "2026-06-10T06:00:00.000Z", message: "다연언니! 드디어 가네 ㅠㅠ 너무너무 축하해!! 당일에 세상에서 제일 예쁠 신부 기대할게!" }
          ]
        })
      });
    }
  }
  return Promise.reject(new Error(`Unknown fetch URL: ${url}`));
};

// Mock localStorage
const storage = {};
window.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { for (let k in storage) delete storage[k]; }
};

// Mock clipboard
window.navigator.clipboard = {
  writeText: () => Promise.resolve()
};

// Capture Javascript execution errors in JSDOM
let hasRuntimeErrors = false;
const errors = [];
window.addEventListener('error', (event) => {
  console.error('[JSDOM Runtime Error]', event.error);
  errors.push(event.error);
  hasRuntimeErrors = true;
});

// 4. Inject global variables to emulate Browser context for local script execution
global.window = window;
global.document = document;
global.navigator = window.navigator;
global.localStorage = window.localStorage;
global.fetch = window.fetch;
global.IntersectionObserver = window.IntersectionObserver;

// 5. Run the app.js and petals.js code inside JSDOM context
try {
  const vm = require('vm');
  vm.runInContext(appJsContent, window);
  if (petalsJsContent) {
    vm.runInContext(petalsJsContent, window);
  }
  console.log('[JSDOM] script execution initiated. Dispatching DOMContentLoaded event...');
  
  // Dispatch DOMContentLoaded event manually
  const event = window.document.createEvent('Event');
  event.initEvent('DOMContentLoaded', true, true);
  window.document.dispatchEvent(event);
} catch (err) {
  console.error('[JDOM VM Error] Failed to run scripts:', err);
  errors.push(err);
  hasRuntimeErrors = true;
}

// 6. Wait for DOMContentLoaded and check results
setTimeout(() => {
  try {
    console.log('[JSDOM] Evaluating rendering results...');

    // Throw if there were execution errors
    if (hasRuntimeErrors) {
      throw new Error(`Runtime errors caught during execution: \n${errors.map(e => e.stack || e).join('\n')}`);
    }

    // Verify main content rendering
    const groomName = document.getElementById('main-groom-name')?.textContent;
    const brideName = document.getElementById('main-bride-name')?.textContent;
    const dateText = document.getElementById('main-date-string')?.textContent;
    const placeText = document.getElementById('main-place-string')?.textContent;

    console.log(`[Verify] Groom Name: "${groomName}"`);
    console.log(`[Verify] Bride Name: "${brideName}"`);
    console.log(`[Verify] Date Info: "${dateText}"`);
    console.log(`[Verify] Place Info: "${placeText}"`);

    // Basic validity checks
    if (!groomName || !brideName || !dateText || !placeText) {
      throw new Error('BLANK PAGE DETECTED: Main text elements are empty or undefined!');
    }

    if (groomName !== '윤호' || brideName !== '다연') {
      throw new Error(`DATA MISMATCH: Expected '윤호' / '다연' but got '${groomName}' / '${brideName}'`);
    }

    if (!placeText.includes('여의도 웨딩컨벤션')) {
      throw new Error(`DATA MISMATCH: Venue is incorrect. Got "${placeText}"`);
    }

    // Verify parents layout rendered dynamically
    const parentsContainer = document.getElementById('greeting-parents-container');
    if (!parentsContainer || !parentsContainer.innerHTML.trim()) {
      throw new Error('BLANK SECTION DETECTED: greeting-parents-container is empty!');
    }
    console.log(`[Verify] Parents Container HTML: ${parentsContainer.innerHTML.trim()}`);

    // Verify accounts accordion contents
    const groomAccounts = document.getElementById('groom-accounts-list');
    const brideAccounts = document.getElementById('bride-accounts-list');
    if (!groomAccounts || !groomAccounts.innerHTML.trim() || !brideAccounts || !brideAccounts.innerHTML.trim()) {
      throw new Error('BLANK SECTION DETECTED: Accounts list is empty!');
    }

    // Verify petals animation container
    const petalsContainer = document.querySelector('.petals');
    if (petalsContainer) {
      console.log(`[Verify] Petals animation container rendered with ${petalsContainer.children.length} petals.`);
    }

    console.log('[Test] SUCCESS: Wedding card JSDOM test passed with zero errors.');
    process.exit(0);

  } catch (error) {
    console.error('[Test] FAILED:', error.message);
    process.exit(1);
  }
}, 1000);
