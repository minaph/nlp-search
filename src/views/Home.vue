<template>
  <div class="home">
    <InputArea @search="SendQuery" />
    <ResultsList :results="results" />
  </div>
</template>

<script lang="ts">
/* global gapi */
import { defineComponent, reactive } from "vue";
import ResultsList from "@/components/ResultsList.vue"; // @ is an alias to /src
import InputArea from "@/components/InputArea.vue";
import { Loader } from "@/utils/load-cse-api";
// declare var gapi: any;

function loadClient() {
  gapi.client.setApiKey(process.env.VUE_APP_API_KEY);
  return gapi.client
    .init({
      apiKey: process.env.VUE_APP_API_KEY,
      discoveryDocs: [
        "https://content.googleapis.com/discovery/v1/apis/customsearch/v1/rest",
      ],
    })
    .then(
      function (...data: any[]) {
        console.log("GAPI client loaded for API", data);
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
      }
    );
}

// Make sure the client is loaded before calling this method.
function execute(query: string) {
  if ("search" in gapi.client) {
    gapi.client.customsearch = gapi.client["search"];
  }
  return new Promise<gapi.client.customsearch.Result[]>((resolve, reject) => {
    gapi.client.customsearch.cse
      .list({
        cx: "0625a0fac3ae79e18",
        hq: '("Annual Meeting of the Association for Computational Linguistics" | "EMNLP" | "TACL" | "NAACL") -inurl:volumes -inurl:events -inurl:people -inurl:pdf -filetype:xml',
        q: query,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          resolve(response.result.items!);
        },
        function (err) {
          console.error("Execute error", err);
          reject(err);
        }
      );
  });
}

export default defineComponent({
  name: "Home",
  components: {
    ResultsList,
    InputArea,
  },
  setup() {
    const loader = new Loader(process.env.VUE_APP_API_KEY);
    loader.loadCallback(() => gapi.load("client", loadClient));
    const results = reactive<gapi.client.customsearch.Result[]>([]);
    return {
      results,
    };
  },
  methods: {
    async SendQuery(query: string) {
      console.log("Query", query);
      this.results.splice(0, this.results.length);
      this.results.push(...(await execute(query)));
    },
  },
});
</script>
