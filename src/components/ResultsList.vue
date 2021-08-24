<template>
  <div class="article" v-for="result in results" :key="result.cacheId">
    <h2>
      <a :href="result.link"
        >{{ result.pagemap.metatags[0].citation_title || result.title }}
      </a>
    </h2>
    <p class="citation">
      <span class="date">
        {{ result.pagemap.metatags[0].citation_publication_date }}
        {{ result.pagemap.metatags[0].citation_author }}
      </span>
      <span class="conf">
        {{ result.pagemap.metatags[0].citation_conference_title }}
      </span>
    </p>

    <p v-html="result.snippet"></p>
  </div>
</template>

<script lang="ts">
/* global gapi */
import { defineComponent, watchEffect, PropType } from "vue";

export default defineComponent({
  name: "ResultsList",
  props: {
    results: {
      type: Object as PropType<gapi.client.customsearch.Result[]>,
    },
  },
  setup(props) {
    const parser = new DOMParser();
    watchEffect(() => {
      props.results?.forEach(async (element) => {
        const html = await fetch(
          "https://cors-yuki.herokuapp.com/" + element.link!
        ).then((response) => response.text());
        const htmlDoc = parser.parseFromString(html, "text/html");
        const sectionMarker = htmlDoc.querySelector(".card-title");

        if (sectionMarker) {
          const longerContent = sectionMarker.parentElement!;
          sectionMarker.remove();
          element.snippet = longerContent.innerHTML;
        }
      });
    });
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
.date {
  font-size: 0.8em;
  font-weight: bold;
}
.conf {
  font-size: 0.7em;
  padding-left: 1em;
}
.article {
  margin-bottom: 1em;
}
.citation {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  margin: 0.2em;
  color: #666;
}
</style>
