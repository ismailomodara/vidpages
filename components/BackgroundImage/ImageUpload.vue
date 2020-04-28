<template>
  <div class="vid-bg-image">
    <el-upload
      v-if="!imageUrl"
      v-loading="uploadingImage"
      class="vid-image-upload"
      action=""
      drag
      :show-file-list="false"
      :on-change="uploadImage"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        Drop image here or <em>click to upload</em>
      </div>
      <div slot="tip" class="el-upload__tip">
        JPG/PNG files with a size less than 2Mb
      </div>
    </el-upload>
    <div v-if="imageUrl" class="text-center">
      <img class="vid-bg-image-preview" :src="imageUrl" alt />
      <div class="d-flex justify-content-center">
        <el-upload action="" :on-change="uploadImage" :show-file-list="false">
          <el-button size="small" type="outline" class="mr-2">Change</el-button>
        </el-upload>
        <el-button size="small" type="primary" @click="emitBackground"
          >Save</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageUpload',
  props: {
    show: Boolean
  },
  data() {
    return {
      imageUrl: '',
      uploadingImage: false,
      cloudinaryPresetUpload: 'msx5zl7z',
      cloudinaryUrl: 'https://api.cloudinary.com/v1_1/da8zzhkwy/upload'
    }
  },
  computed: {},
  methods: {
    uploadImage(event) {
      if (event.size / 1024 / 1024 < 2) {
        this.uploadingImage = true
        const formData = new FormData()
        const image = event.raw

        formData.append('file', image)
        formData.append('folder', 'images')
        formData.append('upload_preset', this.cloudinaryPresetUpload)

        fetch(this.cloudinaryUrl, {
          method: 'POST',
          body: formData
        })
          .then((response) => response.json())
          .then((data) => {
            this.imageUrl = data.url
            this.uploadingImage = false
          })
          .catch(() => {
            this.$message.error('Unable to upload image')
            this.uploadingImage = false
          })
      } else {
        this.$message.error('Image cannot be larger than 2MB!')
      }
    },
    emitBackground() {
      this.$emit('background', this.imageUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-bg-image {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vid-image-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
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

.vid-bg-image-preview {
  height: 220px;
  width: 100%;
  object-fit: cover;
  margin-bottom: 10px;
}
</style>
