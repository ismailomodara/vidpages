<template>
  <div class="vid-bg-video">
    <el-upload
      v-if="!videoUrl"
      v-loading="uploading"
      class="vid-video-upload"
      action=""
      :on-change="uploadVideo"
      :show-file-list="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drop video here or <em>click to upload</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        Video should not exceed 2Mb
      </div>
    </el-upload>
    <div v-if="videoUrl" v-loading="uploading" class="video-preview">
      <video :src="videoUrl" :autoplay="true" controls="controls"></video>
      <el-button size="small" type="outline" @click="emitBackground"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoUpload',
  components: {},
  props: {
    show: Boolean
  },
  data() {
    return {
      uploading: false,
      videoUrl: '',
      cloudinaryPresetUpload: 'msx5zl7z',
      cloudinaryUrl: 'https://api.cloudinary.com/v1_1/da8zzhkwy/upload'
    }
  },
  computed: {},
  methods: {
    uploadVideo(event) {
      if (event.size / 1024 / 1024 < 2) {
        this.uploading = true
        const formData = new FormData()
        const video = event.raw

        formData.append('file', video)
        formData.append('folder', 'videos')
        formData.append('upload_preset', this.cloudinaryPresetUpload)

        fetch(this.cloudinaryUrl, {
          method: 'POST',
          body: formData
        })
          .then((response) => response.json())
          .then((data) => {
            this.videoUrl = data.url
            this.uploading = false
          })
          .catch(() => {
            this.$message.error('Unable to upload video')
            this.uploading = false
          })
      } else {
        this.$message.error('Video cannot be larger than 2MB!')
      }
    },
    emitBackground() {
      this.$emit('background', this.videoUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-bg-video {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vid-video-upload {
  text-align: center;
}

.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload:hover {
  border-color: #7733f4;
}

.video-preview {
  height: 220px;
  width: 80%;
  margin: auto;

  video {
    height: 100%;
  }
}
</style>
