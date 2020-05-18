<template>
  <div>
    <EventView :show.sync="showLoaderDialog" />
    <el-dialog
      v-loading="showLoaderDialog"
      class="loading-dialog"
      :visible="showLoaderDialog"
      :fullscreen="true"
      :show-close="false"
    ></el-dialog>
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
      showLoaderDialog: true,
      event: {},
      backgroundType: ''
    }
  },
  created() {},
  methods: {}
}
</script>
