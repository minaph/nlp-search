
<script lang="ts">
import { defineComponent } from 'vue';
export default {
  name: "VueGoogleApi",
  data() {
    return {
      auth: false,
    };
  },
  props: {
    cap: Boolean,
  },
  computed: {
    initParams: () => ({
      apiKey: process.env.VUE_APP_API_KEY,
      clientId:
        "186767635929-av1db7kbettcvsq1309m9joijgot0tab.apps.googleusercontent.com",
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ],
      scope: "https://www.googleapis.com/auth/spreadsheets",
    }),
  },
  created() {
    const vm = this;
    let gapiScript = document.createElement("script");
    // gapiScript.setAttribute("src", "https://apis.google.com/js/api.js");
    gapiScript.setAttribute("src", "https://apis.google.com/js/platform.js");
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = function() {
      gapiScript.onload = function() {};
      gapi.load("client:auth2", initClient);
    };
    gapiScript.onreadystatechange = function() {
      if (gapiScript.readyState === "complete") {
        gapiScript.onload();
      }
    };
    document.head.appendChild(gapiScript);
    let meta = document.createElement("meta");
    meta.setAttribute("name", "google-signin-client_id");
    meta.setAttribute("content", this.initParams.clientId);
    document.head.appendChild(meta);
    function initClient() {
      console.log("initClient");
      gapi.client.init(vm.initParams).then(
        function() {
          var authObj = gapi.auth2.getAuthInstance();
          if (vm.cap) {
            var code = localStorage.getItem("code");
            if (code !== null && code !== "null") {
              // Token refresh 自動検出
              gapi.client.setToken({
                access_token: code,
              });
            }
            authObj.request = function(authCode) {
              return gapi.client.request({
                path: "https://www.googleapis.com/oauth2/v4/token",
                method: "POST",
                params: {
                  client_id: vm.initParams.client_id,
                  client_secret: process.env.VUE_APP_CLIENT_SECRET,
                  grant_type: "authorization_code",
                  code: authCode,
                },
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
              });
            };
          }
          vm.$emit("initGapi", authObj);
        },
        function(error) {
          console.error(JSON.stringify(error, null, 2));
        }
      );
    }
  },
  methods: {},
};
</script>