# EverCommerce Attribution Autofill Examples

Example & template code snippets for autofilling form fields in various scenarios.

## Standard Web Forms

Scenario: We must collect attribution data on two different form tools. The first form tool uses the "name" attribute on form fields consistently (across all these types of forms). The second form tool uses CSS classnames consistently across all their forms.

This can be used for form tools including (not limited to):

- Gravity Forms (requires additional setup, noted below)
- Unbounce Forms
- Hubspot iFrame Forms

**Important Note** This is not necessary for the following form types. The API automatically identifies these forms & autofills attribution fields.
- Marketo Forms
- Hubspot "Raw HTML" Forms (those embedded outside Hubspot-hosted web pages, with the "Raw HTML Markup" setting enabled)
- Hubspot Native Forms (those embedded on Hubspot-hosted web pages)

```javascript
window.addEventListener("load", function() {
  // Form Tool A
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

  // Form Tool B
  $EC.autofill({
    first_touch: { // First Touch Values
      utm_campaign: "input.ec_utm_campaign_first",
      utm_source: "input.ec_utm_source_first",
      utm_medium: "input.ec_utm_medium_first",
      utm_content: "input.ec_utm_content_first",
      utm_term: "input.ec_utm_term_first",
      utm_device: "input.ec_utm_device_first",
      lp: "input.ec_landing_page_first",
      referrer: "input.ec_referrer_first",
      gclid: "input.gclid"
    },
    last_touch: { // Last Touch Values
      utm_campaign: "input.ec_utm_campaign_last",
      utm_source: "input.ec_utm_source_last",
      utm_medium: "input.ec_utm_medium_last",
      utm_content: "input.ec_utm_content_last",
      utm_term: "input.ec_utm_term_last",
      utm_device: "input.ec_utm_device_last",
      lp: "input.ec_landing_page_last",
      referrer: "input.ec_referrer_last",
      gclid: "input.ec_gclid_last"
    }
  });
});
```

## Embedded Hubspot Forms (those using iFrame)

This is a template which will need a couple values updated before use. Once updated, this will be used in place of the embed script provided by Hubpot. 

Required updates to the snippet below, all values can be found in the Hubspot-provided form embed code.

- `region: "na1"`: This value needs to be updated with the appropriate region code for each Hubspot instance. 
- `portalId: "XXXXXXX"`: This value needs to be updated to the correct Hubspot portal ID unique to each Hubspot instance.
- `formId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"`: This value needs to be updated to the correct form ID unique to each Hubspot form.

```html
<script>
window.addEventListener("load", function() {
  hbspt.forms.create({
    region: "na1",
    portalId: "XXXXXXX",
    formId: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
    onFormSubmit: ($form, ctx) => {
      const firstTouchVals = $EC.getFirst();
      const lastTouchVals = $EC.getLast();
      
      $form.find('input[name="ec_utm_campaign_first"]').val(firstTouchVals["utm_campaign"]).change();
      $form.find('input[name="ec_utm_source_first"]').val(firstTouchVals["utm_source"]).change();
      $form.find('input[name="ec_utm_medium_first"]').val(firstTouchVals["utm_medium"]).change();
      $form.find('input[name="ec_utm_content_first"]').val(firstTouchVals["utm_content"]).change();
      $form.find('input[name="ec_utm_term_first"]').val(firstTouchVals["utm_term"]).change();
      $form.find('input[name="ec_utm_device_first"]').val(firstTouchVals["utm_device"]).change();
      $form.find('input[name="gclid"]').val(firstTouchVals["gclid"]).change();
      $form.find('input[name="ec_msid_first"]').val(firstTouchVals["msid"]).change();
      $form.find('input[name="ec_referrer_first"]').val(firstTouchVals["referrer"]).change();
      $form.find('input[name="ec_landing_page_first"]').val(firstTouchVals["lp"]).change();
      $form.find('input[name="ec_utm_campaign_last"]').val(lastTouchVals["utm_campaign"]).change();
      $form.find('input[name="ec_utm_source_last"]').val(lastTouchVals["utm_source"]).change();
      $form.find('input[name="ec_utm_medium_last"]').val(lastTouchVals["utm_medium"]).change();
      $form.find('input[name="ec_utm_content_last"]').val(lastTouchVals["utm_content"]).change();
      $form.find('input[name="ec_utm_term_last"]').val(lastTouchVals["utm_term"]).change();
      $form.find('input[name="ec_utm_device_last"]').val(lastTouchVals["utm_device"]).change();
      $form.find('input[name="gclid_last"]').val(lastTouchVals["gclid"]).change();
      $form.find('input[name="ec_msid_last"]').val(lastTouchVals["msid"]).change();
      $form.find('input[name="ec_referrer_last"]').val(lastTouchVals["referrer"]).change();
      $form.find('input[name="ec_landing_page_last"]').val(lastTouchVals["lp"]).change();
    }
  });
});
</script>
```

## Gravity Forms

Two code snippets are required in order to capture attribution fields on Gravity Forms. 

### Option 1: EC Plugin (preferred method)

Install and use the EC-created [Gravity Forms EC Attribution Fields Add-On](https://github.com/Evercommerce/gf-ecattribution-addon) plugin. Download the latest release package .zip file from the [releases page](https://github.com/Evercommerce/gf-ecattribution-addon/releases) and install into the website.

### Option 2: Custom

This option requires code changes to the functions.php file within Wordpress, manual addition of 20 form fields per-form, and configuring auto-fill scripts in GTM.

#### 2.1. Output Field Labels as CSS classnames on form fields

This alters the HTML markup of Gravity Form Hidden Fields and can be added to the theme `functions.php` file. When this function identifies a hidden field it will store the field label as a string, replace spaces with underscores, set all characters to lowercase, and apply the new string as a CSS classname to the form input. I.e. "UTM Campaign First" becomes "utm_campaign_first".

> Note: This may already exist in the Wordpress theme, but is good to double-check when implementing UTM attribution.

```php
<?php

/**
 * Add Field Names to Gravity Form Hidden Fields
 * Takes field label (i.e. "UTM Campaign First") and transforms it to a css classname (i.e. "utm_campaign_first")
 */

add_filter( 'gform_field_content', 'add_classname_to_hidden_fields', 10, 5 );
function add_classname_to_hidden_fields( $content, $field, $value, $lead_id, $form_id ) {
  
	if ( 'hidden' === $field->type  ) {
    $name = str_replace( " ", "_", $field->label);
    $new = "class='" . strtolower($name) . " ";
		return str_replace( "class='", $new, $content );
  }
  
  return $content;
}
```

#### 2.2. Add Attribution Fields

All 18 attribution fields must be set he hidden fields added to all gravity forms must use the same field labels for this to function. Field labels provided below:

- utm_campaign_first
- utm_campaign_last
- utm_source_first
- utm_source_last
- utm_medium_first
- utm_medium_last
- utm_content_first
- utm_content_last
- utm_term_first
- utm_term_last
- utm_device_first
- utm_device_last
- landing_page_first
- landing_page_last
- referrer_first
- referrer_last
- gclid_first
- gclid_last

#### 2.3. Configure Autofill

Follow instructions for Standard Web Forms

## Embedded Sharpspring Forms

Does not function with Native Sharpspring forms as the use an iFrame. Solutions differ between form tools:

For WordPress, install and configure the [Gravity Forms EC Attribution Fields Add-On](https://github.com/Evercommerce/gf-ecattribution-addon) plugin which includes functionality to integrate Gravity Forms to SharpSpring.

For Unbounce, configure the form as normal and integrate it directly to SFDC. Use the standard `$EC.autofill()` function here.