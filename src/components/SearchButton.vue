<template>
  <button class="btn btn-primary" @click="search">search</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["search"],
  methods: {
    search() {
      this.$emit("search");
    },
  },
});
</script>
