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
import request from '../../controller/request'
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
  created() {
    this.getEvent()
  },
  methods: {
    setBackgroundType() {
      const videoFormat = ['mp4', 'mov', '3gp']
      const imageFormat = ['jpg', 'jpeg', 'png']

      const backgroundUrl = this.event.eventBanner.split('.')

      if (videoFormat.includes(backgroundUrl[backgroundUrl - 1])) {
        this.backgroundType = 'video'
      } else if (
        imageFormat.includes(backgroundUrl[backgroundUrl - 1]) ||
        this.event.eventBanner.includes('unsplash')
      ) {
        this.backgroundType = 'image'
      } else if (this.event.eventBanner.charAt(0) === '#') {
        this.backgroundType = 'color'
      }
      this.showLoaderDialog = false
    },
    async getEvent() {
      await request.getEvent(this.$route.params.eventRef).then((response) => {
        if (response.data.success) {
          this.event = response.data.event
          this.setBackgroundType()
        }
      })
    }
  },
  head() {
    return {
      title: this.event.eventName,
      meta: [
        { itemprop: 'name', content: this.event.eventName },
        { itemprop: 'description', content: this.event.eventDetails },
        {
          itemprop: 'image',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? this.event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },

        // Twitter Card data
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@hellovidrl' },
        { name: 'twitter:title', content: this.event.eventName },
        {
          name: 'twitter:url',
          content: `https://vidrl.netlify.app/event/${this.$route.params.eventRef}`
        },
        {
          name: 'twitter:image',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? this.event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },
        { name: 'twitter:description', content: this.event.eventDetails },
        { name: 'twitter:app:country', content: 'NG' },
        { name: 'twitter:creator', content: '@hellovidrl' },
        { name: 'twitter:domain', content: '@hellovidrl' },
        // Twitter summary card with large image must be at least 280x150px
        {
          name: 'twitter:image:src',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? this.event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },

        // Open Graph data
        { property: 'og:title', content: this.event.eventName },
        {
          property: 'og:url',
          content: `https://vidrl.netlify.app/event/${this.$route.params.eventRef}`
        },
        {
          property: 'og:image',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? this.event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },
        {
          property: 'og:description',
          content: this.event.eventDetails
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Vidrl' }
      ]
    }
  }
}
</script>
