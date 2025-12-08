# EC Attribution

*Last Updated: September 14, 2023* | *Latest Version: 3.4.3*

EC Attribution v3+ captures UTM query string parameters as well GCLID, referrer, and landing page information. This solution utilizes two browser cookies to store the first and last touch datasets. This documentation serves as implementation instructions as well as a guide for using the Javascript API.

## Implementation Instructions

The following script is to be deployed via Google Tag Manager. The tag should be configured to fire on all pages on page load. Be sure to allow the tag to alter HTML of the webpage.

```html
<script>
(function(){var a = document.createElement('script'); 
a.type="text/javascript";a.async=true;
a.src="https://cdn.jsdelivr.net/gh/Evercommerce/ecmarketingpublic@main/ec-latest.min.js"; 
document.body.appendChild(a);})();
</script>
```

All functionality of this API is available via the Global `$EC` object. Be sure to use `$EC` This ensures execution of `$EC` functions occurs after the script is loaded.

```js
window.addEventListener('load', function() {
  // Use $EC here
});
```

## Read the Docs

[**About**](/docs/1-about.md) – *What is EverCommerce Attribution for?*

[**Getting Started**](/docs/2-getting-started.md) – *How do I implement it?*

[**Attribution Functions**](/docs/3-attribution-functions.md) – *Learn how to use this script to get attribution data, and populate forms with that data.*

[**Marketo Functions**](/docs/4-marketo-functions.md) – *Learn about implementing Blind Marketo Forms, and enabling Kiosk Mode.*

[**Heap Functions**](/docs/5-heap-functions.md) – *Learn about how Heap Analytics fits in with our tracking solution.*

[**Helper Functions**](/docs/6-helper-functions.md) – *Learn about the inner-dependencies included in this API.*

[**Autofill Examples**](/docs/autofill-examples.md) - *View real-world examples of EverCommerce Attribution, and some how-to's.*


## Development Workflow

`npm install`: Installs NPM package dependencies.

`npm run start`: This will compile the TS file into JS, and start a local server on port 4000 for testing. It also includes a watcher to recompile on save.

`npm run build`: This will generate the production-ready JS file as `ec.min.js` in the `/build/` directory.

`npm run linter`: This will "lint" the TS file and provide feedback in the console.