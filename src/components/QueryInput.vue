<template>
  <input type="text" v-model="query" @keyup.enter="search" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      query: "",
    };
  },
  emits: ["search"],
  methods: {
    search() {
      this.$emit("search", this.query);
    },
  },
});
</script>
