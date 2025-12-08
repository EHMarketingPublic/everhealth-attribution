# EC Attribution 3.3.1

*Last Updated: Jan 30, 2023*

EC Attribution 3.x relies on the use of UTM query string parameters as well as the MSID parameter. This solution utilizes 2 cookies. The documentation below is an overview of the functionality and a guide for using the available functions.

TODO: Add details about GTM MarketoFormSubmit Trigger

## The Implementation

The following script is to be deployed via Google Tag Manager. The tag should be configured to fire on all pages on page load. Be sure to allow the tag to alter HTML of the webpage.

```html
<!-- Begin: $EC -->
<script>
(function(){var e = document.createElement('script'); 
e.type="text/javascript";e.async=true; 
e.src="//evercommercemarketing.s3.amazonaws.com/ec-v3.3.1.min.js"; 
document.body.appendChild(e);})();
</script>
<!-- End: $EC -->
```

When using publically available functions (below), be sure to wait for the window to load. This can be done with a `window.addEventListener('load',cb)` function:

```js
window.addEventListener('load', function() {
  $EC.debug();
});
```

## The Parameters

**Note:** As of version 3.1 values have a maximum character length of 255.

- utm_campaign
- utm_source
- utm_medium
- utm_content
- utm_term
- utm_device
- referrer
- msid
- gclid

## The Cookies

We store both First and Last touch cookies. First touch is set one time and never overwritten (unless browser cookies are cleared). Last touch is overwritten each time a visitor lands on a tracked page with a `utm_campaign` query string parameter on the URL.

- `__ecatft`: First Touch Cookie
- `__ecatlt`: Last Touch Cookie

## The Data Object

Each cookie stores data the same way. You'll notice the addition of the "referrer" here, this is simply storing the document referrer.

```json
{
  utm_campaign: '',
  utm_source: '',
  utm_medium: '',
  utm_content: '',
  utm_term: '',
  utm_device: '',
  lp: '',
  referrer: '',
  msid: '',
  gclid: ''
}
```

## The Logic

1. If `__ecatft` cookie does not exist, first touch cookie is created.
2. If `__ecatlt` cookie does not exist, first touch cookie is created.

## The Functions

Some functionality is included to assist in storing custom cookies, filling forms, etc.

### `$EC.setDomain();`

Useful when implementing tracking on a domain other than your standard top level domain. 

By calling the following example on `www.secondarydomain.net`, all cookies will be made available to `primarydomain.com` and all subdomains thereof. This is most useful for local development on `localhost`.

```javascript
// Window URL: www.secondarydomain.net
$EC.setDomain("primarydomain.com");
```

### `$EC.autofill();`

This function allows you to populate field values on any form with data stored in the cookies. In order to capture all data, all 16 hidden fields must be included on each form. All forms should be configured so the selector for each field is the same on all forms.

Note: This is not needed for Marketo forms.

This requires a nested object of key:value pairs as follows:

```javascript
window.addEventListener('load', function() {
  // Autofill Hubspot Native Forms
  $EC.autofill({
    "utm_campaign": {
      first: "input[name=ec_utm_campaign_first__c]",
      last: "input[name=ec_utm_campaign_last__c]",
    },
    "utm_source": {
      first: "input[name=ec_utm_source_first__c]",
      last: "input[name=ec_utm_source_last__c]",
    },
    "utm_medium": {
      first: "input[name=ec_utm_medium_first__c]",
      last: "input[name=ec_utm_medium_last__c]",
    },
    "utm_content": {
      first: "input[name=ec_utm_content_first__c]",
      last: "input[name=ec_utm_content_last__c]",
    },
    "utm_term": {
      first: "input[name=ec_utm_term_first__c]",
      last: "input[name=ec_utm_term_last__c]",
    },
    "utm_device": {
      first: "input[name=ec_utm_device_first__c]",
      last: "input[name=ec_utm_device_last__c]",
    },
    "lp": {
      first: "input[name=ec_landing_page_first__c]",
      last: "input[name=ec_landing_page_last__c]",
    },
    "referrer": {
      first: "input[name=ec_referrer_first__c]",
      last: "input[name=ec_referrer_last__c]",
    },
    "msid": {
      first: "input[name=ec_msid_first__c]",
      last: "input[name=ec_msid_last__c]",
    },
    "gclid": {
      first: "input[name=gclid__c]",
      last: "input[name=gclid_last__c]",
    }
  });
});
```

### `$EC.getFirst()`

Returns a JSON object of first touch cookie value. Can be run in the javascript console for testing or used to retrieve data.

If you need to get a particular parameter you can do so by using: 

```javascript
var first_touch_utm_campaign = $EC.getFirst().utm_campaign;
```

### `$EC.getLast()`

Returns a JSON object of last touch cookie value. Can be run in the javascript console for testing or used to retrieve data.

If you need to get a particular parameter you can do so by using: 

```javascript
var last_touch_utm_campaign = $EC.getLast().utm_campaign;
```

### `$EC.debug();`

For debugging, when called all four cookies will print to the javascript console.