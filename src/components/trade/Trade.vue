<script>
import { useCounterStore } from "@/stores/counter"

export default {
  setup() {
    const counterStore = useCounterStore()

    const test = () => {
      console.log('asd')
      counterStore.count++
    }
    return { counterStore, test }
  }
}
</script>

<template>
  {{counterStore.count}}
</template>



<style lang="" scoped>

</style>
