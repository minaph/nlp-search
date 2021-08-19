<template>
  <p>{{ index }}-{{ index + 10 }} / {{ totalNumber }}</p>
  <div class="home">
    <InputArea @search="SendQuery" />
    <ResultsList :results="results" />
  </div>
  <button @click="prevPage">prev</button>
  <button @click="nextPage">next</button>
  <input v-model="hq" size="50" />
</template>

<script lang="ts">
/* global gapi */
import { defineComponent, reactive, ref, unref, computed } from "vue";
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
function execute(query: string, hq, index = 1) {
  if ("search" in gapi.client) {
    gapi.client.customsearch = gapi.client["search"];
  }
  return new Promise<gapi.client.customsearch.Search>((resolve, reject) => {
    gapi.client.customsearch.cse
      .list({
        cx: "0625a0fac3ae79e18",
        hq,
        q: query,
        start: index,
      })
      .then(
        function (response) {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response);
          resolve(response.result);
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
    const index = ref(1);
    const query = ref("");
    const hq = ref(
      '("Annual Meeting of the Association for Computational Linguistics" | "EMNLP" | "TACL" | "NAACL") -inurl:volumes -inurl:events -inurl:people -inurl:pdf -filetype:xml'
    );

    const totalNumber = ref("0");

    return {
      results,
      index,
      query,
      hq,
      totalNumber,
    };
  },
  methods: {
    async SendQuery(query?: string) {
      console.log("Query", query);
      if (query) {
        this.query = query;
      }
      this.results.splice(0, this.results.length);
      const search = await execute(
        this.query,
        unref(this.hq),
        unref(this.index)
      );
      this.results.push(...search.items!);
      this.totalNumber = search.searchInformation!.totalResults!;
    },
    nextPage() {
      this.index += 10;
      this.SendQuery();
    },
    prevPage() {
      this.index -= 10;
      this.SendQuery();
    },
  },
});
</script>
