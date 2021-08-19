<template>
  <QueryInput @search="InputEvent" />
  <!-- <SearchButton @search="buttonEvent"/> -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QueryInput from "@/components/QueryInput.vue";
// import SearchButton from "@/components/SearchButton.vue";

export default defineComponent({
  name: "InputArea",
  emits: ["search"],
  components: {
    QueryInput,
    // SearchButton,
  },
  methods: {
    InputEvent(query: string) {
      this.$emit("search", query);
    },
  },
});
</script>
