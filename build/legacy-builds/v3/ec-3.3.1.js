/*!
 * Name: EverCommerce Attribution Tracking
 * Author: EverCommerce
 * Author URI: https://www.evercommerce.com/
 * Version: 3.3.1
 *
 * Copyright EverCommerce
 * All Rights Reserved.
 *
 * NOTICE: Unauthorized copying of this file
 *         via any medium is strictly prohibited.
 *         Proprietary and confidential
 */

var $EC = (function () {
  /*
   * Set Global Constants
   *
   * * * * * * * * * * * * * * * */
  var QSPARAMS = getQueryParams();
  var TLD = extractHostname();

  /*
   * Auto Initiate
   *
   * * * * * * * * * * * * * * * */
  setDomain();
  handleAttributionCookie();
  heapAutoIdentify();

  // Auto-handle marketo forms
  if (typeof MktoForms2 != "undefined") {
    handleMarketoForm();
  }

  /*
   * Public Functions
   *
   * * * * * * * * * * * * * * * */
  return {
    setDomain: setDomain,
    autofill: autofill,
    getFirst: getFirstTouchCookie,
    getLast: getLastTouchCookie,
    debug: print,
    mktoForm: handleMarketoForm,
    heapIdentify: heapIdentify,
  };

  /*
   * Publicly Available Functions
   *
   * * * * * * * * * * * * * * * */
  function setDomain(domain) {
    // Get top level domain if not provided
    TLD = domain ? domain : extractHostname();

    return this;
  }

  function autofill(map) {
    if (!map) {
      console.error("Must use key:value pairs for form autofill.");
      return this;
    }

    // Wait a moment, then fill the fields (accounts for embedded forms loading)
    setTimeout(() => {
      var firstTouchCookie = readCookie("__ecatft");
      var lastTouchCookie = readCookie("__ecatlt");

      Object.keys(map).forEach(function (key) {
        // If cookie value is empty, replace with string "[blank]" to keep field groups synced
        var firstTouchValue = firstTouchCookie[key] || '[blank]';
        var lastTouchValue = lastTouchCookie[key] || '[blank]';

        if (firstTouchValue) {
          // Loop to handle multiple forms with same attribution fields
          document.querySelectorAll(map[key].first).forEach(function (node) {
            node.value = firstTouchValue;
          });
        }

        if (lastTouchValue) {
          // Loop to handle multiple forms with same attribution fields
          document.querySelectorAll(map[key].last).forEach(function (node) {
            node.value = lastTouchValue;
          });
        }
      });
    }, 5);

    return this;
  }

  function getFirstTouchCookie() {
    return readCookie("__ecatft");
  }

  function getLastTouchCookie() {
    return readCookie("__ecatlt");
  }

  function heapIdentify(email) {
    if (!email) {
      console.error('Must provide an email address.')
    }
    // Generate GUID & Identify lead with Heap API
    generateGuid(email)
      .then(guid => {
        heap.identify(guid);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function print() {
    var ftCookies = readCookie("__ecatft");
    var ltCookies = readCookie("__ecatlt");

    console.group("First Touch (Standard)");
    console.table(ftCookies);
    console.groupEnd();

    console.group("Last Touch (Standard)");
    console.table(ltCookies);
    console.groupEnd();

    return this;
  }

  /*
   * Private Functions
   *
   * * * * * * * * * * * * * * * */
  function handleAttributionCookie() {
    // Prep Query String Params if CAMPAIGN exists
    var cookieVal = {
      utm_campaign: QSPARAMS["utm_campaign"] ? QSPARAMS["utm_campaign"].substring(0, 254) : "",
      utm_source: QSPARAMS["utm_source"] ? QSPARAMS["utm_source"].substring(0, 254) : "",
      utm_medium: QSPARAMS["utm_medium"] ? QSPARAMS["utm_medium"].substring(0, 254) : "",
      utm_content: QSPARAMS["utm_content"] ? QSPARAMS["utm_content"].substring(0, 254) : "",
      utm_term: QSPARAMS["utm_term"] ? QSPARAMS["utm_term"].substring(0, 254) : "",
      utm_device: QSPARAMS["utm_device"] ? QSPARAMS["utm_device"].substring(0, 254) : "",
      referrer: document.referrer.split("?")[0].substring(0, 254) || "",
      msid: QSPARAMS["msid"] ? QSPARAMS["msid"].substring(0, 254) : "",
      gclid: QSPARAMS["gclid"] ? QSPARAMS["gclid"].substring(0, 254) : "",
      lp: (document.location.hostname + document.location.pathname).substring(0, 254) || ""
    };

    // Create Last Touch Cookie
    // Create First Touch Cookie
    if (Object.keys(readCookie("__ecatlt")).length === 0) {
      createCookie("__ecatlt", cookieVal);
    }

    // Create First Touch Cookie
    if (Object.keys(readCookie("__ecatft")).length === 0) {
      createCookie("__ecatft", cookieVal);
    }
  }

  // Retrieve query strings from URL & store as JSON
  function getQueryParams() {
    var pairs = location.search.slice(1).split("&");
    var result = {};

    pairs.forEach(function (pair) {
      pair = pair.split("=");
      result[pair[0]] = decodeURIComponent(pair[1] || "");
    });

    return JSON.parse(JSON.stringify(result));
  }

  // Retrieve hostname without subdomains - returns ".domain.com"
  function extractHostname() {
    var url = window.location.href;
    var hostname;

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      hostname = window.location.hostname;
    } else if (url.indexOf("://") > -1) {
      hostname = url.split("/")[2];
    } else {
      hostname = url.split("/")[0];
    }

    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      hostname = hostname.split(":")[0];
      hostname = hostname.split("?")[0];

      var hostnames = hostname.split(".");
      hostname = hostnames[hostnames.length - 2] + "." + hostnames[hostnames.length - 1];
    }
    return hostname;
  }

  // Automatically add & autofill attribution fields on Marketo forms
  function handleMarketoForm() {
    var firstTouchVals = readCookie("__ecatft");
    var lastTouchVals = readCookie("__ecatlt");

    var attributionFields = {
      ec_utm_campaign_first__c: firstTouchVals["utm_campaign"] || "NULL",
      ec_utm_source_first__c: firstTouchVals["utm_source"] || "NULL",
      ec_utm_medium_first__c: firstTouchVals["utm_medium"] || "NULL",
      ec_utm_content_first__c: firstTouchVals["utm_content"] || "NULL",
      ec_utm_term_first__c: firstTouchVals["utm_term"] || "NULL",
      ec_utm_device_first__c: firstTouchVals["utm_device"] || "NULL",
      ec_msid_first__c: firstTouchVals["msid"] || "NULL",
      gclid__c: firstTouchVals["gclid"] || "NULL",
      GCLID__c: firstTouchVals["gclid"] || "NULL",
      ec_landing_page_first__c: firstTouchVals['lp'] || "NULL",
      ec_referrer_first__c: firstTouchVals["referrer"] || "NULL",
      ec_utm_campaign_last__c: lastTouchVals["utm_campaign"] || "NULL",
      ec_utm_source_last__c: lastTouchVals["utm_source"] || "NULL",
      ec_utm_medium_last__c: lastTouchVals["utm_medium"] || "NULL",
      ec_utm_content_last__c: lastTouchVals["utm_content"] || "NULL",
      ec_utm_term_last__c: lastTouchVals["utm_term"] || "NULL",
      ec_utm_device_last__c: lastTouchVals["utm_device"] || "NULL",
      ec_msid_last__c: lastTouchVals["msid"] || "NULL",
      gclid_last__c: lastTouchVals["gclid"] || "NULL",
      GCLID_last__c: lastTouchVals["gclid"] || "NULL",
      ec_referrer_last__c: lastTouchVals["referrer"] || "NULL",
      ec_landing_page_last__c: lastTouchVals['lp'] || "NULL",
    };

    MktoForms2.whenReady(function (form) {
      form.addHiddenFields(attributionFields);
      form.onSuccess(function (values, followUpUrl) {
        // Generate GUID & Identify lead with Heap API
        let email = form.getValues();
        generateGuid(email.Email)
          .then(guid => {
            heap.identify(guid);
          })
          .catch(error => {
            console.error(error);
          });
        // Trigger event used for firing conversion tags in Google Tag Manager when form is submitted
        if (typeof window.dataLayer != "undefined") {
          window.dataLayer.push({ event: "MarketoFormSubmit" });
        }
      });
    });
  }

  // Heap Analytics Identify API
  function heapAutoIdentify() {
    const forms = document.forms;

    // Loop through forms on page
    for (var i=0;i<forms.length;i++) {
      let form = forms[i];

      // Skip if Marketo form
      if (form.classList.contains('mktoForm')) continue;

      // Identify on submit
      form.addEventListener('submit', function(e) {
        let email = form.querySelector('input[type=email]').value;
        if (email) {
          // Generate GUID & Identify lead with Heap API
          generateGuid(email)
            .then(guid => {
              heap.identify(guid);
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
    }
  }

  // Creates attribution cookies
  function createCookie(name, value) {
    if (!name) {
      console.error("Must provide a name.");
      return;
    }
    if (!value) {
      console.error("Must provide a value.");
      return;
    }

    var json = value ? JSON.stringify(value) : "";
    var expires = "";

    // Only set expiration for first touch
    if (name == "__ecatft") {
      var expiration = new Date();
      expiration.setFullYear(expiration.getFullYear() + 10);
      expires = " expires=" + expiration.toGMTString() + ";"
    }
   
    document.cookie = name + "=" + json + "; path=/" + "; domain=" + TLD + ";" + expires;
  }

  // Returns cookie value in JSON format
  function readCookie(name) {
    if (!name) {
      console.error("Must provide a name.");
      return;
    }

    var nameEQ = name + "=";
    var ca = document.cookie.split(";");

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) == 0) {
        return JSON.parse(c.substring(nameEQ.length, c.length));
      }
    }

    return {};
  }

  // Generate GUID
  function generateGuid(email) {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    return crypto.subtle.digest("SHA-256", data)
      .then(buffer => {
        const byteArray = new Uint8Array(buffer);
        const guidArray = new Array(16);
        for (let i = 0; i < 16; i++) {
          guidArray[i] = byteArray[i];
        }
        guidArray[6] &= 0x0f;
        guidArray[6] |= 0x40;
        guidArray[8] &= 0x3f;
        guidArray[8] |= 0x80;
        const hexChars = [];
        for (let i = 0; i < 16; i++) {
          hexChars.push(guidArray[i].toString(16).padStart(2, '0'));
        }
        const guidStr = hexChars.join('');
        return `${guidStr.substr(0,8)}-${guidStr.substr(8,4)}-${guidStr.substr(12,4)}-${guidStr.substr(16,4)}-${guidStr.substr(20)}`;
      });
  }
})();
