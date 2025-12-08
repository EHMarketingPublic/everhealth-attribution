export {};

declare global {
  type SemVer = `${number}.${number}` | `${number}.${number}.${number}` | `${number}.${number}-${string}` | `${number}.${number}.${number}-${string}`;

  interface Window {
    heap: any;
    MktoForms2: any;
    dataLayer: any;
    HubSpotForms: any;
    analytics: any;
  }
  
  interface AutofillMap {
    first_touch: {
      utm_campaign: string,
      utm_source: string,
      utm_medium: string,
      utm_content: string,
      utm_term: string,
      utm_device: string,
      lp: string,
      referrer: string,
      gclid: string,
    },
    last_touch: {
      utm_campaign: string,
      utm_source: string,
      utm_medium: string,
      utm_content: string,
      utm_term: string,
      utm_device: string,
      lp: string,
      referrer: string,
      gclid: string,
    }
  }
  
  interface MktoFieldMap {
    [key: string]: string;
  }

  interface CookieValue {
    utm_campaign: string,
    utm_source: string,
    utm_medium: string,
    utm_content: string,
    utm_term: string,
    utm_device: string,
    referrer: string ,
    gclid: string,
    lp: string 
  }

  interface MktoBlindFormConfig {
    mktoDomain: string,
    munchkinId: string,
    mktoFormId: number,
    formSelector: string,
    bindFields: boolean,
    bindSubmitEvent: boolean,
    submitData: boolean,
    submitOnLoad: boolean,
    dataMap: object,
    followupUrl?: string,
  }
}