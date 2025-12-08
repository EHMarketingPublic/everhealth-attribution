# Marketo Functions

Additional functionality for Marketo forms.

## Blind Forms

```typescript
$EC.mkto.blindForm.load(marketoDomain:string, munchkinId:string, mktoFormId:number);
$EC.mkto.blindForm.submit(mainFormCssSelector:string, fieldMap:object);
```

This solution relies on two functions which work together, each require a few parameters each described below. This simplifies the Marketo Blind Form solution often used when leads are generated through product sign-up/registration forms, or other non-marketo lead capture methods. It essentially binds a hidden Marketo Form to the form which the user interacts with on the page. When the main/visible form is submitted, so is the hidden Marketo form.

See the example below, or check out the working [demo](/demo/marketo-blind-form.html).

```javascript
$EC.debug = true;

const config = {
  mktoDomain: 'go.domain.com',
  munchkinId: '123-ABC-456',
  mktoFormId: 1234,
  formSelector: '#test-form',
  bindSubmitEvent: true,
  bindFields: true,                             // optional
  followupUrl: "https://domain.com/thank-you/", // optional
  dataMap: {
        // Field Selector: Mkto Field Name
        'input[name=email]': 'Email',
        'input[name=first_name]': 'FirstName',
        'input[name=last_name]': 'LastName',
        'input[name=company]': 'Company',
        'input[name=opt-in]': 'Explicit_Opt_In__c'
      }
};
// Load the blind form
$EC.mkto.blindForm.load(config);

// Submit blind form when main form is submitted, not necessary if `bindSubmitEvent` is set to true in config
document.querySelector('#test-form').addEventListener("submit", function(e) {
  $EC.mkto.blindForm.submit(config);
});
```

Note: Load & Submit functions also available as `mktoBlindForm.load()` and `mktoBlindForm.submit()` for backwards compatibility with version 3.4

## Kiosk Mode

```javascript
$EC.mkto.kioskMode();
```

Allows form to be submitted multiple times without causing visitor association changes by using Kiosk Mode, because it doesn’t cookie visitors. For example: you want to manually enter prospect data into a form from a signup sheet or have prospects fill out forms at a tradeshow booth.

Call `$EC.mkto.kioskMode()` on pages to prevent `_mkto_trk` cookies from being dropped/collected, also prevents the Heap Identify API from running.

Check out the working [demo](/demo/kiosk-mode.html).