<template>
  <el-dialog
    :visible.sync="showDialog"
    title="Add New Image"
    :close-on-click-modal="false"
    @close="resetValues"
  >
    <el-row type="flex" :gutter="40">
      <el-col :lg="12" class="mx-auto">
        <UploadImage :url.sync="newImage.event_image" />
      </el-col>
    </el-row>
    <div class="d-flex justify-content-center mt-3">
      <el-button :loading="addingImage" type="primary" @click="addImage"
        >Add</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import UploadImage from '../UploadImage'
import request from '../../controller/request'

export default {
  name: 'SpeakerAction',
  components: {
    UploadImage
  },
  props: {
    show: Boolean
  },
  data() {
    return {
      addingImage: false,
      newImage: {
        event_image: ''
      }
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    }
  },
  methods: {
    async addImage() {
      this.newImage.event_ref = this.$store.state.event.event.eventRef
      this.addingImage = true
      await request
        .createGallery(this.newImage)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingImage = false
                this.$message.success('Image added to gallery!')
              })
              .catch(() => {
                this.addingImage = false
              })
          } else {
            this.addingImage = false
          }
        })
        .catch(() => {
          this.addingImage = false
        })
    },
    resetValues() {
      this.newImage = {
        event_image: '',
        event_ref: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
