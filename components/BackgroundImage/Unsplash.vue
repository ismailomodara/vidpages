<template>
  <div class="unsplash">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <p class="mb-0">Search for image</p>
      <el-input
        v-model="searchQuery"
        placholder="conference hall"
        :style="{ width: '250px' }"
        @input="getImages"
      />
    </div>
    <el-row
      v-loading="fetching"
      :gutter="20"
      type="flex"
      class="flex-wrap"
      :style="{ height: '230px', overflowY: 'scroll' }"
    >
      <el-col
        v-for="(image, index) in images"
        :key="index"
        :sm="6"
        :md="6"
        class="mb-4"
        ><div
          :class="[
            'unsplash-image',
            { 'is-selected': imageUrl === image.urls.full }
          ]"
          @click="setImageUrl(image.urls.full)"
        >
          <img :src="image.urls.full" :alt="image.description" />
          <div class="overlay"></div>
          <i class="vid-icon--check-circle"></i>
        </div>
        <small
          ><a :href="image.user.links.html" target="_blank">{{
            image.user.name
          }}</a>
        </small></el-col
      >
    </el-row>
    <div class="d-flex justify-content-end">
      <el-button
        v-if="imageUrl"
        size="small"
        type="secondary"
        @click="emitBackground"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Unsplash',
  props: {
    show: Boolean
  },
  data() {
    return {
      searchQuery: '',
      imageUrl: '',
      images: [],
      fetching: false,
      unsplashBaseUrl: 'https://api.unsplash.com',
      unsplashKey: 'S9xcULDaarS3hGVQtLokiG-yMk_DNbPSwaTElzTsJ4c'
    }
  },
  computed: {
    unsplashImagesUrl() {
      const query = this.searchQuery ? this.searchQuery : 'conference'
      return `${this.unsplashBaseUrl}/search/photos?query=${query}&client_id=${this.unsplashKey}`
    }
  },
  created() {
    this.getImages()
  },
  methods: {
    getImages() {
      this.fetching = true
      this.images = []
      fetch(this.unsplashImagesUrl, {
        method: 'GET'
      })
        .then((response) => response.json())
        .then((data) => {
          this.images = data.results
          this.fetching = false
        })
        .catch(() => {
          this.$message.error('Unable to upload video')
          this.fetching = false
        })
    },
    setImageUrl(image) {
      this.imageUrl = image
    },
    emitBackground() {
      this.$emit('background', this.imageUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.unsplash {
  height: 100%;
  width: 100%;

  .unsplash-image {
    height: 80px;
    width: 100%;
    border-radius: 5px;
    background-color: #222151;
    margin-bottom: 5px;
    cursor: pointer;
    position: relative;

    img {
      border-radius: 5px;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      border-radius: 5px;
      background: rgba(0, 0, 0, 0.4);
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      z-index: 1;
    }

    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 24px;
      opacity: 0;
      transition: opacity 0.25s ease-in;
      z-index: 2;
    }

    &.is-selected {
      .overlay,
      i {
        opacity: 1;
        transition: opacity 0.25s ease-out;
      }
    }
  }
  small a {
    width: 80%;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
