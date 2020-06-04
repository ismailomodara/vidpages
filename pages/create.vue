<template>
  <no-ssr>
    <create-event-component />
  </no-ssr>
</template>

<script>
import CreateEventComponent from '../components/Create'

export default {
  name: 'CreateEvent',
  components: {
    CreateEventComponent
  }
}
</script>

<style lang="scss" scoped></style>
