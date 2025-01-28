<script lang="ts">
export default {
  props: {
    categoryData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    return {
      category: props.categoryData
    }
  },
  methods: {
    abbreviate(text: number) {
      return Intl.NumberFormat('en-US', {
        //@ts-ignore
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(text)
    }
  }
}
</script>

<template>
  <div class="bg-crust w-40 lg:w-[11rem] md:w-[13.5rem] rounded-lg">
    <router-link :to="`/directory/game/${encodeURIComponent(category.name)}`">
      <img :src="category.image" class="rounded-lg rounded-b-none w-full" />
    </router-link>

    <div class="p-2">
      <div>
        <p class="font-bold text-contrast text-xl sm:text-base md:text-xl">
          {{ category.displayName }}
        </p>
        <p class="text-sm text-contrast">{{ abbreviate(category.viewers) }} viewers</p>
      </div>

      <ul class="h-8 overflow-hidden">
        <li v-for="tag in category.tags" :key="tag" class="inline-flex">
          <span class="p-2.5 py-1.5 bg-surface0 rounded-md m-0.5 text-xs font-bold text-contrast">{{
            tag
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
