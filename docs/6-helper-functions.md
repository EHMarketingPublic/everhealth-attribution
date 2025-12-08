# Helper Functions

These functions are dependencies of the other functions we've looked at so far. They are available for use, but not typically interacted with client-side.

## Extract Hostname

```typescript
extractHostname()
```

Extracts the top level domain name from the current web page, prepends a period. This is used for creating cookies so they are available across subdomains.

## Handle Attribution Cookie

```typescript
handleAttributionCookie()
```

Extracts attribution data from the query string and page properties. Formats into the correct data structure which are created via the `createCookie()` helper function.

## Handle Marketo Form Hidden Fields

```typescript
handleMktoForms()
```

Extracts attribution data from browser cookies. Formats into a data object consumable by the `MktoForms2` API. Adds all attribution fields to the form as hidden fields and auto-populates their values. 

Handles onSubmit events, including preventing Marketo & Heap tracking when `kioskMode` is enabled, and handles the Heap Identify API call when Heap is loaded on the page.

Handles onSuccess events, including pushing the `MarketoFormSubmit` event to the DataLayer, and preventing blind Marketo forms from redirecting users. Also sends custom Heap event "Marketo Form Submit".

Check out the working [demo](/demo/marketo-form.html).

## Handle Hubspot Form Hidden Fields

```typescript
handleHubspotForms()
```

Uses the `$EC.autofill()` method to autofill attribution fields when a HubSpot form is identified on the page, using the `onFormReady()` event.

Check out the working [demo](/demo/hubspot-form.html).

## Create Cookie

```typescript
createCookie(name: string, value: CookieValue)
```

Takes in a cookie name, and cookie value. Cookie value must be provided as a JSON object. This function stringifies the cookie value, and creates the browser cookie.

## Read Cookie

```typescript
readCookie(name: string): object
```

Takes a cookie name, returns the cookie value in the form of a JSON object.


## Generate UUID

```typescript
$EC.generateUUID(email: string): string;
```

Though this is a private function, it is available for use only when the UUID is needed for purposes other than the Heap Identify API. Because this is an async function, be careful about how quickly `UUID` is used.

Examples of how to use it:

```javascript
const UUID = $EC.generateUUID('webmaster@evercommerce.com');
// UUID = 'eef5425b-13cf-4d55-a763-27a34c4defd1bf2f704daa8a92772159e97ea8f01f3d'
```

## Get & Set Form Type

```typescript
getFormType(form: HTMLElement)
setFormType(form: HTMLElement, type: string)
```

Functions which add data attribute to `<form>` element notating whether that form is a Blind Marketo form or Kiosk form. This ensures proper submission events occur for those form types.