<template>
  <div v-click-outside="hide" class="vid-changelog">
    <span :class="{ active: widgetActive }">Changelog</span>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import ClickOutside from 'vue-click-outside'
const HEADWAY_WIDGET_URL = 'https://cdn.headwayapp.co/widget.js'
export default {
  name: 'VidHeadwayWidget',
  directives: {
    ClickOutside
  },
  data() {
    return {
      widgetActive: false,
      id: uuid,
      widget: undefined,
      config: {
        selector: '.vid-changelog',
        account: 'xD31jy',
        callbacks: {
          onWidgetReady: (widget) => {
            this.widget = widget
          },
          onShowWidget: () =>
            this.$parent.$emit('close:header-items', [this.id])
        }
      }
    }
  },
  mounted() {
    const headwayScript = document.createElement('script')
    headwayScript.async = true
    headwayScript.setAttribute('src', HEADWAY_WIDGET_URL)
    document.head.appendChild(headwayScript)
    const waitForHeadway = () => {
      if (window.Headway) {
        window.Headway.init(this.config)
      } else {
        setTimeout(() => waitForHeadway(), 100)
      }
    }
    waitForHeadway()
    this.$parent.$on('close:header-items', ([id]) => {
      if (this.id !== id) this.hide()
    })
  },
  methods: {
    hide() {
      if (this.widget) this.widget.hide()
      this.widgetActive = false
    }
  }
}
</script>

<style>
.vid-changelog {
  padding-left: 1.5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.vid-changelog .icon {
  margin-right: 7px;
  font-size: 14px;
  padding: 15px;
  border-radius: 100px;
  border: 1.4px solid #fff;
  transition: all 0.2s ease-out;
}

.vid-changelog .icon.active {
  border-color: #00c267;
  transition: all 0.2s ease-in;
}

#HW_badge_cont {
  position: absolute !important;
  width: 100% !important;
  left: 0;
}

#HW_badge {
  right: -15px !important;
  top: 4px !important;
  left: unset !important;
}
</style>
