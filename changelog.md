# Changelog

## 3.5.0

- Updating to work with new WP Consent plugin for handling new cookie compliance

## 3.4.4

- Don't fire Marketo & Hubspot form handlers till after page load
- Remove "message" event listener from Hubspot form handler

## 3.4.3

- Added additional properties to MarketoFormSubmit dataLayer event
- Adds HubSpotFormSubmit dataLayer event

## 3.4.2

- Sends "Marketo Form Event" custom event w/unique properties to Heap on various Marketo form events (below)
  - form.onRender
  - form.onReady
  - form.onSubmit
  - form.onValidate
  - form.onSuccess
- Sends "HubSpot Form Event" custom event w/unique properties to Heap on various Marketo form events (below)
  - onFormReady
  - onBeforeFormSubmit
  - onFormSubmitted
- Fix: Automatically pre-populates HubSpot form attribution fields _onFormReady_
  - Only works for HubSpot forms which are configured to display as "Raw HTML"
- Finalizes to Marketo Blind Form functionality, updates config options
- Updates build process
  - Output versioned build (i.e. `ec-3.x.x.min.js`) to `/build/legacy-builds/v3/` to keep history
  - Output latest build (i.e. `ec-latest.min.js`) to `/build/` directory

## 3.4.1

- Added "Kiosk Mode" for marketo forms
- Improved repository file/folder organization
- Reduced duplicate code
- Fixed types
- Cleaned up documentation
- Refactored some function names/structure, included alias' for backwards compatibility
- Will now automatically fill Hubspot forms with attribution data if a Hubspot form is identified on the page
- Sends "Marketo Form Submit" custom event to Heap when Marketo forms are successfully submitted
- Updates to Marketo Blind Form functionality

## 3.4

- Refactored to TypeScript, complete with webpack compiler, linter, and local server with demos.
- Updated Last Touch cookie lifespan to "session"
- Added functionality for Heap Analytics Identify API:
  - Function to generate UUID & identify with the generated UUID
  - Automatically handles heapIdentify on Marketo form submissions
- Added Marketo Blind Form functions to simplify implementation of Marketo Blind Forms.
- Added `$EC.version` to quickly check currently installed version number.
- Added second data structure option to the `$EC.autofill()` function.
- Distribution updates
  - Compiled JS files will now include version number in the filename, & last modified date in the header comment
  - Compiled JS files now hosted in the [ecmarketingpublic](https://github.com/Evercommerce/ecmarketingpublic) GitHub Repository (instead of AWS S3)
  - JS script is served over [jsdeliver CDN](https://www.jsdelivr.com/github) for improved caching and load time

## 3.3.1

- Fix: Autofill function will now fill fields with the string `[blank]` if the cookie value is empty. This is to ensure each group of first/last touch fields are kept in sync.
  - Example: User submits form with 5 UTM parameters on first visit. User submits a form with only 3 UTM parameters on second visit. On the second form fill three fields containing new values woudl be updated but not clear the two values from the previous form fill. This results in the database storing two sets of UTM values mixed up with each other. The fix implemented in 3.3.1 resolves this issue.

## 3.3

- New: Added `ec_landing_page_first` and `ec_landing_page_last` fields to capture the landing page URL visitors initially and most recently land on

## 3.2.1

- Fix: Added capitalized `gclid` fields (`GCLID__c` and `GCLID_last__c`)

## 3.2

- New: Added the `gclid` URL parameter to attribution capture & Marketo form pre-fill
- Fix: Fixed an issue where a missing dataLayer object would prevent Marketo forms from submitting

## 3.1

- Changed maximum character limit to 255 before setting cookies to meet SFDC field length requirement.

## 3.0

- Core functionality, initial build.
