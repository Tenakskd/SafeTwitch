<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
    title: string
}>()

onMounted(function () {
    document.title = props.title
})

</script>