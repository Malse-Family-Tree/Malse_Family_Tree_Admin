# AWS S3 + CloudFront — SPA routing for BrowserRouter

Deploy the Vite `dist/` folder to S3, then front it with CloudFront.

## 1. S3 bucket

- Enable static website hosting (optional if using CloudFront only).
- Upload the contents of `dist/` (not the `dist` folder itself).

## 2. CloudFront — custom error responses (recommended)

In the CloudFront distribution:

| Setting            | Value        |
|--------------------|--------------|
| HTTP error code    | 403          |
| Response page path | `/index.html`|
| HTTP response code | 200          |

Add the same for **404** if needed.

This returns `index.html` for unknown paths so React Router can handle `/login`, `/dashboard`, etc.

## 3. CloudFront — alternative (CloudFront Function)

Attach a viewer-request function:

```javascript
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Leave real files (hashed assets, images, fonts) untouched
  if (uri.includes('.')) {
    return request;
  }

  request.uri = '/index.html';
  return request;
}
```

## 4. Cache behavior

- Cache `/assets/*` aggressively (immutable hashed filenames).
- Do not cache `index.html` for long periods, or use short TTL, so deploys propagate quickly.
