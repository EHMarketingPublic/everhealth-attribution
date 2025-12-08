# Implementation Instructions

The following script should be deployed via Google Tag Manager. The tag should be configured to fire on all pages with the Page Load trigger.

```html
<script>
(function(){var a = document.createElement('script'); 
a.type="text/javascript";a.async=true;
a.src="https://cdn.jsdelivr.net/gh/Evercommerce/ecmarketingpublic@main/ec-latest.min.js"; 
document.body.appendChild(a);})();
</script>
```

## `$EC` API Usage

Once installed all functionality of this API is available via the Global `$EC` object. Be sure to use `$EC` within a window onload event listener callback. This ensures execution of `$EC` functions occurs after the script is loaded.

```js
window.addEventListener('load', function() {
  // Use $EC here
});
```

## Version Number

```javascript
$EC.version;
```
Outputs the current version of the installed script.

## Current Domain

```javascript
$EC.domain;
```

Outputs the current top-level domain name (e.g. `.domain.com`), used for creating cookies.

## Debug

```javascript
$EC.debug = true; // defaults to false
```

The debug setting can be set to true or false (defaults to false). When set to `true` prior to calling functions within, the script will output verbose console messages.

```javascript
$EC.debug = true;

$EC.heap.identify('test@domain.com');
// Output if already identified: 
// [$EC Debug] Already Identified:  e235fed6-7b57-4cc8-a134-033f6fb4b2a7033ceb776a73d6016784ddc744e9b37c

// Output if not already identified: 
// [$EC Debug] Identified with:  e235fed6-7b57-4cc8-a134-033f6fb4b2a7033ceb776a73d6016784ddc744e9b37c
```

## View Cookie Values

```javascript
$EC.log();
```

For checking values stored in the cookies. When called both first and last touch cookies will print to the browser console. This was renamed from `$EC.debug()` to `$EC.log()` in version 3.4

## Set Domain

```typescript
$EC.setDomain(domain: string);
```

Useful when attribution cookies needs to be specific to a subdomain, or when testing.

```javascript
$EC.setDomain("sub.domain.com");
```