# EverCommerce Attribution JS v2

## Overview

This javascript module is used for capturing lead attribution data.

## Standard Attribution

These four cookies are always created, just include the script and you're set!

| Cookie Name | Cookie Value |
|-------------|-------------|
| Keyword__c  | "keyword" query string paramter |
| Lead_Cookie__c | Current page pathname |
| Referring_Site_Cookie__c | Window referrer |
| ecmsid | "msid" query string parameter |

## Setting the Domain

The cookie domain should always us the top-level domain (i.e. `evercommerce.com`) and should never include the subdomain. The javascript module automatically grabs the top-level domain from the URL of the current page, but can also be customized by adding the following:

**Example** 

For *anything*.evercommerce.com we would simply pass in `evercommerce.com`.

```js
EcAttr.setDomain('evercommerce.com');
```

## Custom Attribution

If there is a need to store attribution data outside the standard set above, just call the `custom` function and pass in the query paramter name and cookie name as key:value pairs.


**Example** 

Let's say the URL of the current page is `https://www.evercommerce.com/?queryStringParamName=test_param&utm_source=google&keyword=blue`

```js
EcAttr.custom({
  queryStringParamName: 'cookie_name',
  utm_source: 'ec_utm_source'
});
```

- The value of `keyword` (blue) is stored into `Keyword__c` automatically as it is part of our standard attribution.
- The value of `queryStringParamName` (test_param) is stored into the cookie `cookie_name`.
- The value of `utm_source` (blue) is stored into the cookie `ec_utm_source`.


## Prefill

The module also provides the ability to pre-fill fields with cookie data. To do this we follow a similar pattern to the Custom Attribution above in which we provide the cookie name and field CSS selector as key:value pairs.

```js
EcAttr.prefill({
  'Keyword__c': 'input[name=keyword]',
  'ecmsid': 'input[msid]'
});
```

## Chaining

If you need to perform more than one of the above options, you can chain them!

```js
EcAttr
  .setDomain('evercommerce.com')
  .custom({
    queryStringParamName: 'cookie_name',
    utm_source: 'ec_utm_source'
  })
  .prefill({
    'Keyword__c': 'input[name=keyword]',
    'ecmsid': 'input[msid]'
  });
```