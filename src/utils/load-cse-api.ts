type CallbackFunction = (arg0?: any) => any;

export class Loader {
  CALLBACK = "__googleCseCallback";
  apiKey: string;
  URL: string;
  callbacks: CallbackFunction[] = [];
  done = false;
  loading = false;
  onerrorEvent: CallbackFunction;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.URL = "https://apis.google.com/js/api.js";
    this.onerrorEvent = () => {
      console.log("error");
    };
  }
  /**
   * CreateUrl returns the Google CSe JavaScript API script url given the [[LoaderOptions]].
   *
   * @ignore
   */
  createUrl() {
    const url = this.URL;
    console.log(this.URL);

    // url += `?callback=${this.CALLBACK}`;

    // if (this.apiKey) {
    //   url += `&key=${this.apiKey}`;
    // }

    return url;
  }

  /**
   * Load the Google CSE JavaScript API script and return a Promise.
   */
  load() {
    return this.loadPromise();
  }

  /**
   * Load the Google CSE JavaScript API script and return a Promise.
   *
   * @ignore
   */
  loadPromise() {
    return new Promise<void>((resolve, reject) => {
      this.loadCallback((err: any) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  /**
   * Load the Google CSE JavaScript API script with a callback.
   */
  loadCallback(fn: CallbackFunction) {
    this.callbacks.push(fn);
    this.execute();
  }

  /**
   * Set the script on document.
   */
  setScript() {
    const url = this.createUrl();
    const script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;
    script.onerror = this.loadErrorCallback.bind(this) as any;
    script.onload = this.callback.bind(this);
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  }

  loadErrorCallback(e: CallbackFunction) {
    this.onerrorEvent = e;
    this.callback();
  }

  setCallback() {
    Object.defineProperty(window, this.CALLBACK, this.callback.bind(this));
  }

  callback() {
    this.loading = false;
    this.done = true;

    this.callbacks.forEach((cb) => {
      cb(this.onerrorEvent);
    });

    this.callbacks = [];
  }

  execute() {
    if (this.done) {
      this.callback();
    } else {
      if (this.loading) {
        // do nothing but wait
      } else {
        this.loading = true;
        this.setCallback();
        this.setScript();
      }
    }
  }
}
