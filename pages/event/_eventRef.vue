<template>
  <div>
    <EventView v-if="!showLoaderDialog"></EventView>
    <el-dialog
      :visible="showLoaderDialog"
      :fullscreen="true"
      :show-close="false"
    >
      <div
        v-loading="showLoaderDialog"
        element-loading-text="Loading event..."
        :style="{ height: '80vh', width: '100%' }"
      ></div>
    </el-dialog>
  </div>
</template>

<script>
import EventView from '~/components/EventView'

export default {
  name: 'Event',
  components: {
    EventView
  },
  data() {
    return {
      showLoaderDialog: false
    }
  },
  created() {
    // const eventRef = this.$route.params.eventRef
    // if (eventRef) {
    //   this.getEvent(eventRef)
    // } else {
    //   this.$router.push({ name: 'index' })
    // }
  },
  methods: {
    getEvent(eventRef) {
      this.$store
        .dispatch('EVENT', eventRef)
        .then((response) => {
          this.showLoaderDialog = false
        })
        .catch(() => {
          this.$router.push({ name: 'index' })
          this.$message.error('Unable to get event')
          this.showLoaderDialog = false
        })
    }
  }
}
</script>
