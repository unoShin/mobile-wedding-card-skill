# Troubleshooting & Mobile Webview Compatibility

Common issues and battle-tested solutions when developing and deploying mobile wedding cards.

---

## 1. Google Apps Script CORS & Fetch Errors

### Issue: `fetch(rsvp_api_url)` fails with CORS error or redirection failure.
- **Cause**: Google Apps Script redirects `POST` requests through `script.googleusercontent.com` using a 302 redirect. If headers or Content-Type aren't standard, browser `fetch` can reject it.
- **Solution**:
  1. Send payload as text/plain or raw JSON string without custom authorization headers.
  2. In `app.js`, use standard `fetch(url, { method: 'POST', body: JSON.stringify(data) })`.
  3. Ensure the Apps Script deployment is set to **Who has access: Anyone**.

---

## 2. In-App Browser (KakaoTalk / Instagram / Line) Viewport Issues

### Issue: Address bar on mobile devices covers bottom buttons or modal action bars.
- **Cause**: Dynamic viewport height (`100vh`) shifts when browser navigation bars show/hide.
- **Solution**:
  1. Use `viewport-fit=cover` in `<meta name="viewport">`.
  2. Use CSS safe area insets: `padding-bottom: env(safe-area-inset-bottom)`.
  3. Keep the max width clamped to `440px` and center horizontally (`margin: 0 auto; min-height: 100vh`).

---

## 3. Image Optimization with Sharp

### Issue: Large original DSLR photos (5MB - 20MB each) cause slow loading or mobile browser crashes.
- **Solution**:
  Run `optimize_images.js`:
  ```bash
  node optimize_images.js
  ```
  It automatically resizes photos to fit within `1600x1600` and compresses with MozJPEG (`quality: 85`), reducing image size to ~100KB–250KB per photo without perceptible visual degradation.

---

## 4. Clipboard API Fallbacks

### Issue: `navigator.clipboard.writeText()` is blocked in HTTP or older Android webviews.
- **Solution**:
  Include a fallback method in `app.js`:
  ```javascript
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showToast('계좌번호가 복사되었습니다.');
        return;
      } catch (e) {}
    }
    // Fallback using textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('계좌번호가 복사되었습니다.');
    } catch (err) {
      alert('복사하지 못했습니다. 수동으로 복사해주세요: ' + text);
    }
    document.body.removeChild(textarea);
  }
  ```
