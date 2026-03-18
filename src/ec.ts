export class EcAttribution {
  version: SemVer;
  domain: string;
  debug: boolean;

  constructor() {
    this.version = "3.5.0";

    if (!this.debug) this.debug = false;

    // Initiate tracking
    this.setDomain();
    this.handleAttributionCookie();

    window.addEventListener("load", () => {
      // Auto-handle Marketo Forms after load
      if (typeof window.MktoForms2 != "undefined") {
        this.handleMktoForms();
      }

      // Auto-handle HubSpot Forms after load
      if (typeof window.HubSpotForms != "undefined") {
        this.handleHubspotForms();
      }
    });
  }

  /*
   * Public Functions
   *
   * * * * * * * * * * * * * * * */

  getFirst = (): object => {
    // Provide First Touch cookie as JSON object
    return this.readCookie("__ecatft");
  };

  getLast = (): object => {
    // Provide Last Touch cookie as JSON object
    return this.readCookie("__ecatlt");
  };

  setDomain = (domain?: string) => {
    // Set domain to current if not provided
    this.domain = domain ? domain : this.extractHostname();
  };

  autofill = (map: AutofillMap) => {
    // Get Current Cookies
    const firstTouchVals = this.readCookie("__ecatft");
    const lastTouchVals = this.readCookie("__ecatlt");

    if (!map) {
      console.error("[$EC Error] Must provide field map to autofill form fields.");
      return false;
    }

    if (this.debug) {
      console.group("[$EC Debug] Field Mapping");
      console.table(map);
      console.groupEnd();
    }

    // Wait a moment, then fill the fields (accounts for embedded forms load time)
    setTimeout(() => {
      // Legacy Field Mapping
      if (Object.prototype.hasOwnProperty.call(map, "utm_campaign")) {
        Object.keys(map).forEach((key) => {
          // First Touch Fields
          document.querySelectorAll(map[key].first).forEach((node) => {
            node.value = firstTouchVals[key] || "[blank]";
          });
          // Last Touch Fields
          document.querySelectorAll(map[key].last).forEach((node) => {
            node.value = lastTouchVals[key] || "[blank]";
          });
        });
      }
      // Field Mapping as of v3.4
      else if (Object.prototype.hasOwnProperty.call(map, "first_touch")) {
        // First Touch Fields
        Object.keys(map.first_touch).forEach((key) => {
          document.querySelectorAll(map.first_touch[key]).forEach((node) => {
            node.value = firstTouchVals[key] || "[blank]";
          });
        });
        // Last Touch Fields
        Object.keys(map.last_touch).forEach((key) => {
          document.querySelectorAll(map.last_touch[key]).forEach((node) => {
            node.value = lastTouchVals[key] || "[blank]";
          });
        });
      }
    }, 50);
  };

  log = () => {
    console.group("About $EC");
    console.log("Version: ", this.version);
    console.log("Domain: ", this.domain);
    if (typeof window.heap != "undefined") {
      if (window.heap.identity) {
        console.log("[$EC] Heap ID: ", window.heap.identity);
      } else {
        console.log("[$EC] Heap ID: Not Set");
      }
    } else {
      console.error("[$EC Error] Heap Not Loaded");
    }
    console.groupEnd();

    const ftCookies = this.readCookie("__ecatft");
    const ltCookies = this.readCookie("__ecatlt");

    console.group("First Touch");
    console.table(ftCookies);
    console.groupEnd();

    console.group("Last Touch");
    console.table(ltCookies);
    console.groupEnd();
  };

  heap = {
    // Heap Functions
    identify: (email: string): string => {
      // Error if no email address provided
      if (!email) {
        console.error("[$EC Error] Must provide an email address.");
        return;
      }

      // Check for Heap API
      let has_heap = false;
      if (typeof window.heap != "undefined") {
        has_heap = true;
      }
      // Exit if Heap API is undefined
      if (!has_heap) {
        if (this.debug) {
          console.error("[$EC Error] Heap API is not defined.");
          return this.generateUUID(email);
        }
        if (!this.debug) return;
      }

      // User Already Identified
      if (window.heap.identity) {
        // Get UUID
        if (this.debug) console.log("[$EC Debug] Already Identified: ", window.heap.identity);
      }

      // New Identity
      if (!window.heap.identity) {
        // Generate UUID
        const uuid = this.generateUUID(email);
        window.heap.identify(uuid);
        if (this.debug) console.log("[$EC Debug] Identified with: ", uuid);
      }

      return window.heap.identity;
    },

    autofill: (emailFieldSelector: string, heapIdFieldSelector: string) => {
      // Get forms on the page
      const forms = document.forms;

      // Loop through forms
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];

        // Skip Marketo Forms
        if (form.classList.contains("mktoForm")) continue;
        if (form.classList.contains("ecmktoForm")) continue;

        // When Submitted
        form.addEventListener("submit", (e) => {
          e.preventDefault();

          // Get the email field & value
          const email = (<HTMLInputElement>form.querySelector(emailFieldSelector)).value;

          // get the UUID Field
          const uuidField = <HTMLInputElement>form.querySelector(heapIdFieldSelector);

          // If email address exists
          if (email) {
            // Generate UUID
            const uuid = this.heap.identify(email);
            if (typeof uuidField != "undefined") uuidField.value = uuid;
          }
          form.submit();
        });
      }
    },
  };

  mkto = {
    blindForm: {
      load: (config: MktoBlindFormConfig) => {
        if (!config) {
          console.error(`[$EC Error] Blind form config object missing option(s)`);
          console.log("Provided Config:");
          console.log(config);
          return;
        }

        // Add Marketo Form Element to page
        const mktoFormEl = document.createElement("form");
        mktoFormEl.id = `mktoForm_${config.mktoFormId}`;
        if (!this.debug) mktoFormEl.style.display = "none"; // Only show Marketo blind form when debug is enabled
        document.body.appendChild(mktoFormEl);
        if (this.debug) console.warn("[$EC Warning] Debug Mode is enabled. Marketo Form is displayed. Disable Debug mode for production use.", mktoFormEl);

        // Load Marketo Forms 2 JS
        const mktoForms2Script = document.createElement("script");
        mktoForms2Script.type = "text/javascript";
        mktoForms2Script.async = true;
        mktoForms2Script.src = `//${config.mktoDomain}/js/forms2/js/forms2.min.js`;
        document.body.appendChild(mktoForms2Script);

        // Wait for MktoForms2 to load
        mktoForms2Script.addEventListener("load", () => {
          this.handleMktoForms();
          window.MktoForms2.loadForm(`//${config.mktoDomain}`, config.munchkinId, config.mktoFormId);

          // Called every time any form on the page renders.
          // Forms are rendered when initially created, then again every
          // time that visibility rules alter the structure of the form.
          window.MktoForms2.whenRendered((mktoForm: any) => {
            // eslint-disable-line  @typescript-eslint/no-explicit-any
            const mainForm = <HTMLFormElement>document.querySelector(config.formSelector);
            this.setFormType(mktoForm.getFormElem()[0], "blind");
            this.setFormType(mainForm, "blind");
            mktoForm.getFormElem()[0].setAttribute("data-boundForm", config.formSelector);

            // Store followup url if provided
            if (config.followupUrl) {
              mktoForm["followupUrl"] = config.followupUrl;
              if (this.debug) {
                console.log(`[$EC] Followup URL Set: ${config.followupUrl}`);
              }
            }

            if (config.bindFields) {
              // Bind main form field to mkto form fields
              if (typeof config.dataMap != undefined) {
                if (this.debug) {
                  console.log("[$EC] Binding fields...", config.dataMap);
                }
                Object.entries(config.dataMap).forEach(([fieldSelector, mktoFieldId]) => {
                  const field = <HTMLInputElement>mainForm.querySelector(fieldSelector);
                  if (!field) {
                    console.error(`[$EC Error] Field with selector ${fieldSelector} does not exist.`);
                    return;
                  }
                  field.addEventListener("change", (e) => {
                    let newVal = field.value;
                    let input = <HTMLInputElement>document.querySelector(`input[name="${mktoFieldId}"]`);
                    if (field.type === "checkbox") {
                      input.checked = field.checked;
                    } else {
                      input.value = newVal;
                    }
                  });
                });
              } else {
                console.error("[$EC Error] Missing field mapping.");
              }

              // Check to bind submit event
              if (config.bindSubmitEvent) {
                mainForm.addEventListener("submit", (e) => {
                  mktoForm.submit();
                });
              }
            } else if (config.submitData) {
              // Populate marketo fields with provided data
              if (typeof config.dataMap != undefined) {
                if (this.debug) {
                  console.log("[$EC] Populating with provided data...", config.dataMap);
                }
                mktoForm.vals(config.dataMap);
              } else {
                console.error("[$EC Error] Missing field data.");
              }
            }
          });

          // Check if form should be submitted on load if also provided data
          if (config.submitOnLoad && config.submitData) {
            if (this.debug) {
              console.log("[$EC] Submitting Marketo form...");
            }
            window.MktoForms2.whenReady((mktoForm: any) => {
              // eslint-disable-line  @typescript-eslint/no-explicit-any
              mktoForm.submit();
            });
          }
        });
      },

      submit: (config: MktoBlindFormConfig) => {
        const form = <HTMLFormElement>document.querySelector(`#mktoForm_${config.mktoFormId}`);
        form.submit();
      },
    },

    kioskMode: () => {
      console.warn("[$EC] Kiosk Mode Enabled");

      // Clear Marketo Tracking Cookie
      document.cookie = `_mkto_trk=;path=/;domain=${this.domain};expires=0`;

      // Called every time any form on the page renders.
      // Forms are rendered when initially created, then again every
      // time that visibility rules alter the structure of the form.
      window.MktoForms2.whenRendered((form: any) => {
        // eslint-disable-line  @typescript-eslint/no-explicit-any
        this.setFormType(form.getFormElem()[0], "kiosk");

        // Add the tracking field to be submitted
        form.addHiddenFields({
          _mkt_trk: "",
        });

        // Track ready event in Heap
        if (typeof window.heap != "undefined") {
          window.heap.track("Marketo Form Event", {
            Event: "Rendered",
            "Form ID": `mktoForm_${form.getId()}`,
            Submittable: form.submittable(),
            "Form Type": "kiosk",
          });
        }
      });
    },
  };

  /*
   * Helper Functions
   *
   * * * * * * * * * * * * * * * */

  protected extractHostname() {
    // Returns clean hostname following this pattern: ".domain.com"

    const url = window.location.href;
    let hostname;

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

      const hostnames = hostname.split(".");
      hostname = hostnames[hostnames.length - 2] + "." + hostnames[hostnames.length - 1];
    }
    return hostname;
  }

  protected handleAttributionCookie() {
    const firstTouchVals = this.readCookie("__ecatft");
    const lastTouchVals = this.readCookie("__ecatlt");

    const parameters = new URLSearchParams(document.location.search);

    // Prep Query String Params if CAMPAIGN exists
    const cookieVal = {
      utm_campaign: parameters.get("utm_campaign") ? parameters.get("utm_campaign").substring(0, 254) : "",
      utm_source: parameters.get("utm_source") ? parameters.get("utm_source").substring(0, 254) : "",
      utm_medium: parameters.get("utm_medium") ? parameters.get("utm_medium").substring(0, 254) : "",
      utm_content: parameters.get("utm_content") ? parameters.get("utm_content").substring(0, 254) : "",
      utm_term: parameters.get("utm_term") ? parameters.get("utm_term").substring(0, 254) : "",
      utm_device: parameters.get("utm_device") ? parameters.get("utm_device").substring(0, 254) : "",
      referrer: document.referrer.split("?")[0].substring(0, 254) || "",
      gclid: parameters.get("gclid") ? parameters.get("gclid").substring(0, 254) : "",
      lp: (document.location.hostname + document.location.pathname).substring(0, 254) || "",
    };

    if (Object.keys(firstTouchVals).length === 0) {
      this.createCookie("__ecatft", cookieVal);
    }

    if (Object.keys(lastTouchVals).length === 0) {
      this.createCookie("__ecatlt", cookieVal);
    }
  }

  protected getFormType(form: HTMLElement) {
    return form.getAttribute("data-formType");
  }

  protected setFormType(form: HTMLElement, type: string) {
    form.setAttribute("data-formType", type);
  }

  protected handleMktoForms() {
    // Called exactly once for each form on the page that becomes “ready”.
    // Readiness means that the form exists, has been initially rendered and
    // had its initial callbacks called
    window.MktoForms2.whenReady((form: any) => {
      // eslint-disable-line  @typescript-eslint/no-explicit-any
      // Add standard attribution fields on load
      const firstTouchVals = this.readCookie("__ecatft");
      const lastTouchVals = this.readCookie("__ecatlt");
      const attributionFields = {
        ec_utm_campaign_first__c: firstTouchVals["utm_campaign"] || "NULL",
        ec_utm_source_first__c: firstTouchVals["utm_source"] || "NULL",
        ec_utm_medium_first__c: firstTouchVals["utm_medium"] || "NULL",
        ec_utm_content_first__c: firstTouchVals["utm_content"] || "NULL",
        ec_utm_term_first__c: firstTouchVals["utm_term"] || "NULL",
        ec_utm_device_first__c: firstTouchVals["utm_device"] || "NULL",
        gclid__c: firstTouchVals["gclid"] || "NULL",
        GCLID__c: firstTouchVals["gclid"] || "NULL",
        ec_landing_page_first__c: firstTouchVals["lp"] || "NULL",
        ec_referrer_first__c: firstTouchVals["referrer"] || "NULL",
        ec_utm_campaign_last__c: lastTouchVals["utm_campaign"] || "NULL",
        ec_utm_source_last__c: lastTouchVals["utm_source"] || "NULL",
        ec_utm_medium_last__c: lastTouchVals["utm_medium"] || "NULL",
        ec_utm_content_last__c: lastTouchVals["utm_content"] || "NULL",
        ec_utm_term_last__c: lastTouchVals["utm_term"] || "NULL",
        ec_utm_device_last__c: lastTouchVals["utm_device"] || "NULL",
        gclid_last__c: lastTouchVals["gclid"] || "NULL",
        GCLID_last__c: lastTouchVals["gclid"] || "NULL",
        ec_referrer_last__c: lastTouchVals["referrer"] || "NULL",
        ec_landing_page_last__c: lastTouchVals["lp"] || "NULL",
      };

      // Prepare heap event properties
      let heapEventProps = { "Form ID": `mktoForm_${form.getId()}` };
      if (this.getFormType(form.getFormElem()[0])) {
        heapEventProps["Form Type"] = this.getFormType(form.getFormElem()[0]);
      }
      if (form.getFormElem()[0].getAttribute("data-boundForm")) {
        heapEventProps["Bound Form Selector"] = form.getFormElem()[0].getAttribute("data-boundForm");
      }

      // Add attribution fields if not in kiosk mode
      if (this.getFormType(form.getFormElem()[0]) !== "kiosk") {
        form.addHiddenFields(attributionFields);
      }

      // Called when the form is submitted. Fired when the submission begins,
      // before the success/failure of the request is known.
      form.onSubmit(() => {
        if (this.getFormType(form.getFormElem()[0]) === "kiosk") {
          // Kiosk mode enabled, clear associative values
          form.vals({
            _mkt_trk: "",
          });
        } else if (typeof window.heap != "undefined") {
          // Heap is available & kiosk mode disabled, identify user / add hidden field
          if (form.validate()) {
            const email = form.vals()["Email"];
            const uuid = this.heap.identify(email);
            form.addHiddenFields({ ec_heap_id__c: uuid });
          }

          const props = {
            Event: "Before Submit",
            Submittable: form.submittable(),
            ...heapEventProps,
          };
          window.heap.track("Marketo Form Event", props);
        }

        if (this.debug) {
          console.group("[$EC Debug] Form Vals");
          console.table(form.vals());
          console.groupEnd();
        }
      });

      // Called any time that validation occurs.
      form.onValidate((valid) => {
        if (typeof window.heap != "undefined") {
          const props = {
            Event: "Validate",
            Valid: valid,
            ...heapEventProps,
          };
          window.heap.track("Marketo Form Event", props);
        }
      });

      // Called when the form has been successfully submitted but before
      // the lead is forwarded to the follow up page
      form.onSuccess(() => {
        // Add event to data layer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "MarketoFormSubmit",
          formId: `mktoForm_${form.getId()}`,
          pageUrl: `${window.location.origin}${window.location.pathname}`,
        });

        // Track successful submission in Heap
        if (typeof window.heap != "undefined") {
          const props = {
            Event: "Submitted",
            ...heapEventProps,
          };
          window.heap.track("Marketo Form Event", props);
        }

        if (this.getFormType(form.getFormElem()[0]) === "blind") {
          // Redirect user if URL is provided
          if (form["followupUrl"]) {
            document.location.replace(form["followupUrl"]);
          }
          // Prevent form followup actions on blind forms
          return false;
        }
      });
    });
  }
  handleMktoFormHiddenFields = this.handleMktoForms; // for backwards compatibility

  protected handleHubspotForms() {
    // Populate attribution fields
    this.autofill({
      first_touch: {
        utm_campaign: "input[name=ec_utm_campaign_first__c]",
        utm_source: "input[name=ec_utm_source_first__c]",
        utm_medium: "input[name=ec_utm_medium_first__c]",
        utm_content: "input[name=ec_utm_content_first__c]",
        utm_term: "input[name=ec_utm_term_first__c]",
        utm_device: "input[name=ec_utm_device_first__c]",
        lp: "input[name=ec_landing_page_first__c]",
        referrer: "input[name=ec_referrer_first__c]",
        gclid: "input[name=gclid__c]",
      },
      last_touch: {
        utm_campaign: "input[name=ec_utm_campaign_last__c]",
        utm_source: "input[name=ec_utm_source_last__c]",
        utm_medium: "input[name=ec_utm_medium_last__c]",
        utm_content: "input[name=ec_utm_content_last__c]",
        utm_term: "input[name=ec_utm_term_last__c]",
        utm_device: "input[name=ec_utm_device_last__c]",
        lp: "input[name=ec_landing_page_last__c]",
        referrer: "input[name=ec_referrer_last__c]",
        gclid: "input[name=ec_gclid_last__c]",
      },
    });

    window.addEventListener("message", (event) => {
      // Called after the form has been submitted and the submission has been persisted.
      if (event.data.type === "hsFormCallback" && event.data.eventName === "onFormSubmitted") {
        // Add event to data layer
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "HubSpotFormSubmit",
          formId: event.data.id,
          pageUrl: `${window.location.origin}${window.location.pathname}`,
        });

        // Track event in Heap
        if (typeof window.heap != "undefined") {
          window.heap.track("HubSpot Form Event", {
            "Form ID": event.data.id,
            Event: "Submitted",
          });
        }
      }
    });
  }

  protected createCookie(name: string, value: CookieValue) {
    if (!name) {
      console.error("[$EC Error] Must provide a name.");
      return;
    }
    if (!value) {
      console.error("[$EC Error] Must provide a value.");
      return;
    }

    const json = value ? JSON.stringify(value) : "";
    let expires = "";

    if (name == "__ecatft") {
      const expiration = new Date();
      expiration.setFullYear(expiration.getFullYear() + 10);
      expires = " expires=" + expiration.toUTCString() + ";";
    }

    document.cookie = name + "=" + json + "; path=/" + "; domain=" + this.domain + ";" + expires;
  }

  protected readCookie(name: string): object {
    if (!name) {
      console.error("[$EC Error] Must provide a name.");
      return;
    }

    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) == 0) {
        return JSON.parse(c.substring(nameEQ.length, c.length));
      }
    }

    return {};
  }

  protected generateUUID(email: string): string {
    // convert email to lowercase and trim any leading or trailing spaces
    email = email.toLowerCase().trim();

    // create a SHA256 hash of the email address
    const sha256 = (msg) => {
      function rotateRight(n, x) {
        return ((x >>> n) | (x << (32 - n))) >>> 0;
      }
      function sha256Frag() {
        const constants = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
        const K = new Uint32Array(constants);
        const W = new Uint32Array(64);
        let a = 0x6a09e667;
        let b = 0xbb67ae85;
        let c = 0x3c6ef372;
        let d = 0xa54ff53a;
        let e = 0x510e527f;
        let f = 0x9b05688c;
        let g = 0x1f83d9ab;
        let h = 0x5be0cd19;

        const toHex = (n) => n.toString(16).padStart(8, "0");
        const toUint32Array = (str) => {
          if (typeof str !== "string") {
            str = str.toString();
          }
          if (!str.length) {
            return new Uint32Array(0);
          }
          const result = new Uint32Array(str.length / 4);
          for (let i = 0; i < str.length; i += 4) {
            result[i / 4] = (str.charCodeAt(i) << 24) | (str.charCodeAt(i + 1) << 16) | (str.charCodeAt(i + 2) << 8) | str.charCodeAt(i + 3);
          }
          return result;
        };
        const padTo512 = (bits) => {
          const paddingLength = (448 - bits.length - 1) % 512;
          const padding = new Uint8Array(paddingLength / 8 + 1).fill(0);
          const bitsLength = bits.length * 8;
          const bitsLengthArray = new Uint8Array(8);
          for (let i = 0; i < 8; i++) {
            bitsLengthArray[i] = (bitsLength >>> (56 - 8 * i)) & 0xff;
          }
          const bytes = new Uint8Array(bits.length + 1 + padding.length + bitsLengthArray.length);

          for (let i = 0; i < bits.length; i++) {
            bytes[i] = bits[i];
          }

          bytes[bits.length] = 0x80;

          for (let j = 0; j < padding.length; j++) {
            bytes[bits.length + 1 + j] = padding[j];
          }

          for (let k = 0; k < bitsLengthArray.length; k++) {
            bytes[bits.length + 1 + padding.length + k] = bitsLengthArray[k];
          }

          return bytes;
        };

        const chars = msg.split("").map(function (x) {
          return x.charCodeAt(0);
        });
        const padded = padTo512(chars);
        const message = toUint32Array(padded);

        for (let i = 0; i < message.length; i += 16) {
          const w = W;
          for (let t = 0; t < 16; t++) {
            w[t] = message[i + t];
          }
          for (let t = 16; t < 64; t++) {
            const s0 = rotateRight(7, w[t - 15]) ^ rotateRight(18, w[t - 15]) ^ (w[t - 15] >>> 3);
            const s1 = rotateRight(17, w[t - 2]) ^ rotateRight(19, w[t - 2]) ^ (w[t - 2] >>> 10);
            w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
          }
          let A = a;
          let B = b;
          let C = c;
          let D = d;
          let E = e;
          let F = f;
          let G = g;
          let H = h;
          for (let t = 0; t < 64; t++) {
            const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
            const ch = (e & f) ^ (~e & g);
            const temp1 = (h + S1 + ch + K[t] + w[t]) >>> 0;
            const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (S0 + maj) >>> 0;
            H = G;
            G = F;
            F = E;
            E = (D + temp1) >>> 0;
            D = C;
            C = B;
            B = A;
            A = (temp1 + temp2) >>> 0;
          }
          a = (a + A) >>> 0;
          b = (b + B) >>> 0;
          c = (c + C) >>> 0;
          d = (d + D) >>> 0;
          e = (e + E) >>> 0;
          f = (f + F) >>> 0;
          g = (g + G) >>> 0;
          h = (h + H) >>> 0;
        }

        return [a, b, c, d, e, f, g, h].map(toHex).join("");
      }

      return sha256Frag();
    };

    // construct UUID from hash
    const hash = sha256(email);
    const uuid = hash.slice(0, 8) + "-" + hash.slice(8, 12) + "-4" + hash.slice(13, 16) + "-a" + hash.slice(17, 20) + "-" + hash.slice(20);

    return uuid;
  }
}

// Make $EC available to window
(window as any).$EC = new EcAttribution(); // eslint-disable-line  @typescript-eslint/no-explicit-any
