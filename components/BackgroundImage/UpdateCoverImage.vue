<template>
  <el-dialog :visible.sync="showDialog">
    <div class="upload-cover-image">
      <el-menu
        :default-active="activeTab"
        class="el-menu-vertical-demo"
        @select="changeActiveTab"
      >
        <el-menu-item index="solid-colors">
          <i class="vid-icon--box"></i>
          <span>Solid Color</span>
        </el-menu-item>
        <el-menu-item index="unsplash">
          <i class="vid-icon--download-cloud"></i>
          <span>Unsplash</span>
        </el-menu-item>
        <el-menu-item index="image-upload">
          <i class="vid-icon--upload"></i>
          <span>Image Upload</span>
        </el-menu-item>
        <el-menu-item index="video-upload">
          <i class="vid-icon--video"></i>
          <span>Video Upload</span>
        </el-menu-item>
      </el-menu>
      <div class="cover-image-action-area">
        <solid-colors
          v-show="activeTab === 'solid-colors'"
          @background="setBackground"
        />
        <unsplash
          v-show="activeTab === 'unsplash'"
          @background="setBackground"
        />
        <image-upload
          v-show="activeTab === 'image-upload'"
          @background="setBackground"
        />
        <video-upload
          v-show="activeTab === 'video-upload'"
          @background="setBackground"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import SolidColors from './SolidColors'
import Unsplash from './Unsplash'
import ImageUpload from './ImageUpload'
import VideoUpload from './VideoUpload'

export default {
  name: 'UpdateCoverImage',
  components: {
    SolidColors,
    Unsplash,
    ImageUpload,
    VideoUpload
  },
  props: {
    show: Boolean,
    background: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeTab: 'solid-colors'
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
    },
    backgroundValue: {
      get() {
        return this.background
      },
      set(value) {
        this.$emit('update:background', value)
      }
    }
  },
  methods: {
    changeActiveTab(index) {
      this.activeTab = index
    },
    setBackground(value) {
      this.backgroundValue = value
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-cover-image {
  display: flex;
  min-height: 420px;

  .el-menu {
    width: 25%;
    padding: 10px;

    .el-menu-item {
      border-radius: 5px;

      &.is-active {
        background: #f1ebfe;
      }

      &:not(.is-active) {
        opacity: 0.7;
      }

      i {
        margin-right: 10px;
      }
    }
  }

  .cover-image-action-area {
    width: 75%;
    padding: 30px;
  }
}
</style>
