<template>
  <div class="vid-gallery">
    <div class="d-flex justify-content-center align-items-center mb-4">
      <h5 class="text-center mr-3">
        Images In Gallery ({{ allImages.length }})
      </h5>
      <el-button
        v-if="allImages.length"
        type="outline"
        size="small"
        @click="addImage"
        >Add New</el-button
      >
    </div>
    <div v-if="allImages.length">
      <el-row type="flex" :gutter="30" class="flex-wrap">
        <el-col
          v-for="(image, index) in allImages"
          :key="index"
          :sm="12"
          :md="12"
        >
          <div class="vid-event-gallery-image">
            <img :src="image.eventImage" alt />
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <EmptyState text="No images in event gallery">
        <el-button type="primary" @click="addImage">Add Image</el-button>
      </EmptyState>
    </div>
    <gallery-action :show.sync="showGalleryAction" />
  </div>
</template>

<script>
import EmptyState from '~/components/EmptyState'
import GalleryAction from '~/components/Gallery/GalleryAction'

export default {
  name: 'Gallery',
  components: {
    EmptyState,
    GalleryAction
  },
  data() {
    return {
      allImages: [],
      showGalleryAction: false
    }
  },
  computed: {
    images() {
      return this.$store.state.event.images
    }
  },
  watch: {
    images() {
      this.allImages = this.images
    }
  },

  methods: {
    addImage() {
      this.showGalleryAction = true
    }
  }
}
</script>
<style lang="scss" scoped>
.vid-gallery {
  .vid-event-gallery-image {
    position: relative;
    height: 300px;
    width: 100%;
    margin-bottom: 20px;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}
</style>
