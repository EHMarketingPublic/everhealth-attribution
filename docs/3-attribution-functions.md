# Attribution Functions

## Attribution Field Autofill

```typescript
$EC.autofill(fieldMap: Object);
```

Provides ability to populate field values of any form with data stored in attribution cookies. Check out the examples below, or the working [demo](/demo/form-autofill.html).

**This is not needed when using Marketo forms!** Capturing attribution data on Marketo Forms is automatically handled. Read more in the [helper functions](/docs/6-helper-functions.md) docs, and check out the working [Marketo Form Demo](/demo/marketo-form.html).

**Notes**
- All attribution fields must be included on all forms as hidden fields. 
- All forms should be configured so the selector for each field is the same on all forms. 
- This is not scoped to an individual form. It will loop through all fields on the webpage no matter how many forms exist.
- As of v3.4 attribution fields with no value will be have their value set to the string `[blank]`.

**Version 3.4+**

In version 3.4, a new data structure was introduced for a more streamlined autofill object. v3.4 is backwards compatible, either option is acceptable.

```javascript
$EC.autofill({
  first_touch: { // First Touch Values
    utm_campaign: "input[name=ec_utm_campaign_first__c]",
    utm_source: "input[name=ec_utm_source_first__c]",
    utm_medium: "input[name=ec_utm_medium_first__c]",
    utm_content: "input[name=ec_utm_content_first__c]",
    utm_term: "input[name=ec_utm_term_first__c]",
    utm_device: "input[name=ec_utm_device_first__c]",
    lp: "input[name=ec_landing_page_first__c]",
    referrer: "input[name=ec_referrer_first__c]",
    gclid: "input[name=gclid__c]"
  },
  last_touch: { // Last Touch Values
    utm_campaign: "input[name=ec_utm_campaign_last__c]",
    utm_source: "input[name=ec_utm_source_last__c]",
    utm_medium: "input[name=ec_utm_medium_last__c]",
    utm_content: "input[name=ec_utm_content_last__c]",
    utm_term: "input[name=ec_utm_term_last__c]",
    utm_device: "input[name=ec_utm_device_last__c]",
    lp: "input[name=ec_landing_page_last__c]",
    referrer: "input[name=ec_referrer_last__c]",
    gclid: "input[name=ec_gclid_last__c]"
  }
});
```

**Version 3.3.1 and lower**

```javascript
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
  "gclid": {
    first: "input[name=gclid__c]",
    last: "input[name=gclid_last__c]",
  }
});
```

## Get First Touch Values

```javascript
$EC.getFirst();
```

Returns a JSON object of first touch cookie value. Can be run in the javascript console for testing or used to retrieve data.

```javascript
const first_touch = $EC.getFirst();                           // Returns full first-touch JSON object
const first_touch_utm_campaign = $EC.getFirst().utm_campaign; // Returns just first-touch utm_campaign value
```

## Get Last Touch Values

```javascript
$EC.getLast();
```

Returns a JSON object of last touch cookie value. Can be run in the javascript console for testing or used to retrieve data.

If you need to get a particular parameter you can do so by using: 

```javascript
const last_touch = $EC.getLast();                           // Returns full first-touch JSON object
const last_touch_utm_campaign = $EC.getLast().utm_campaign; // Returns just first-touch utm_campaign value
```