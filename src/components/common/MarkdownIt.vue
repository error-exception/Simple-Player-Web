<script setup lang="ts">
import markdownit from 'markdown-it'

const props = defineProps<{
  content: string
}>()

const markdown = markdownit()
const markdownContent = markdown.render(props.content)

</script>

<template>
  <div
      v-html="markdownContent"
      class="text-white markdown"
  />
</template>

<style>
.markdown h1 {
  @apply text-3xl font-black mb-4;
  line-height: 1.5;
}
.markdown h2 {
  @apply text-2xl font-bold mb-3;
}
.markdown h3 {
  @apply text-xl font-bold mb-2;
}
.markdown h4 {
  @apply text-lg font-bold mb-1;
}
.markdown h5 {
  @apply text-base font-bold mb-1;;
}
.markdown p {
  @apply mb-4;
}
.markdown a {
  @apply text-blue-300 underline;
}
.markdown strong {
  @apply font-bold;
}
.markdown em {
  @apply italic;
}
.markdown ul {
  @apply list-disc ml-4;
}
.markdown ol {
  @apply list-decimal ml-4;
}
.markdown pre code {
  @apply p-4 mb-4 rounded text-white bg-black;
}
.markdown code {
  @apply px-1 py-0.5 rounded text-white bg-black;
}
.markdown table {
  @apply text-sm mb-4 ml-6;
}
.markdown table th {
  @apply px-2 py-1 text-left font-bold border border-amber-300;
}
.markdown table td {
  @apply px-2 py-1 text-left border border-amber-300;
}
</style>