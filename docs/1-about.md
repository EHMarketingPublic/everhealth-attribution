# About EC Attribution

EC Attribution v3+ captures UTM query string parameters as well GCLID, referrer, and landing page information. This solution utilizes two browser cookies to store the first and last touch datasets. This documentation serves as implementation instructions as well as a guide for using the Javascript API.

## The Cookies

- `__ecatft`: First Touch Cookie. Created every page visit if the cookie does not already exist. Expires after 365 days.
- `__ecatlt`: Last Touch Cookie. Created every page visit if the cookie does not already exist. Expires after session ends.

## The Data Objects

Each cookie is composed of a stringified json object following this structure. As of version 3.1 each value has a maximum character length of 255.

```javascript
{
  utm_campaign: 'string', // URL Parameter
  utm_source: 'string',   // URL Parameter
  utm_medium: 'string',   // URL Parameter
  utm_content: 'string',  // URL Parameter
  utm_term: 'string',     // URL Parameter
  utm_device: 'string',   // URL Parameter
  lp: 'string',           // `document.location.hostname` + `document.location.path`
  referrer: 'string',     // `document.referrer` without query strings
  gclid: 'string'         // URL Parameter
}
```