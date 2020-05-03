<template>
  <div class="vid-update">
    <div
      class="vid-header"
      :style="{
        background:
          backgroundType === 'color' ? `${event.event_banner}` : false,
        backgroundImage:
          backgroundType === 'image' ? `url(${event.event_banner})` : false
      }"
    >
      <video
        v-if="backgroundType === 'video'"
        :src="event.event_banner"
        :autoplay="true"
        :controls="false"
      ></video>
      <div v-if="backgroundType !== 'color'" class="text-overlay"></div>
      <div class="container">
        <div class="vid-event-title">
          <el-button type="white" plain @click="updateCoverImage = true"
            >Update Cover Image</el-button
          >
        </div>
      </div>
    </div>
    <div class="vid-event-details">
      <div class="container">
        <el-form
          ref="create"
          :model="event"
          label-position="top"
          class="vid-event-form"
        >
          <div class="vid-section">
            <h6>Video Info</h6>
            <el-row :gutter="30" type="flex" class="flex-wrap">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.event_video_url"
                  class="vid-custom-input"
                  label="URL"
                  prop="event_video_url"
                >
                  <el-input
                    v-model="event.event_video_url"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--hash"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
          </div>
          <div class="vid-section">
            <h6>Event Details</h6>
            <el-row type="flex">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.event_name"
                  class="vid-custom-input"
                  label="Event Title"
                  prop="event_name"
                >
                  <el-input
                    v-model="event.event_name"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--edit-2"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="30" type="flex" class="flex-wrap">
              <el-col :md="14"
                ><el-form-item
                  v-custom-input="event.event_date"
                  class="vid-custom-input"
                  label="Date"
                  prop="event_start_date"
                >
                  <el-date-picker
                    v-model="event.event_date"
                    type="date"
                    format="dd-MMMM-yyyy"
                    prefix-icon="vid-icon--calendar"
                  >
                  </el-date-picker> </el-form-item
              ></el-col>
              <el-col :lg="10"
                ><el-form-item
                  v-custom-input="event.event_start_time"
                  class="vid-custom-input"
                  label="Time"
                  prop="event_start_time"
                >
                  <el-time-select
                    v-model="event.event_start_time"
                    :clearable="false"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00'
                    }"
                    :disabled="!hasStartTime"
                    prefix-icon="vid-icon--clock"
                  >
                  </el-time-select>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="
                      hasStartTime
                        ? 'Disable time for this event'
                        : 'Enable time for this event'
                    "
                    placement="right-start"
                  >
                    <el-switch v-model="hasStartTime"></el-switch>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="30" type="flex" class="flex-wrap">
              <el-col :lg="10"
                ><el-form-item
                  v-custom-input="event.event_duration"
                  v-only-number
                  class="vid-custom-input"
                  label="Duration"
                  prop="event_duration"
                >
                  <el-input
                    v-model="event.event_duration"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--clock"
                  ></el-input></el-form-item
              ></el-col>
              <el-col :lg="14"
                ><el-form-item
                  v-custom-input="event.event_public_url"
                  class="vid-custom-input"
                  label="Event Url: https://vidpages.com/"
                  prop="event_public_url"
                >
                  <el-input
                    v-model="event.event_public_url"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--chrome"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
          </div>
          <div class="vid-section">
            <h6>Accessibility</h6>
            <el-row :gutter="30" type="flex" class="flex-wrap">
              <el-col :lg="12">
                <el-form-item
                  v-custom-input="event.event_social_hashtag"
                  class="vid-custom-input"
                  label="Social Hashtag"
                >
                  <el-select
                    v-model="event.event_social_hashtag"
                    placeholder=""
                  >
                    <template slot="prefix">
                      <i class="vid-icon--hash exp"></i>
                    </template>
                    <el-option
                      v-for="(hashtag, index) in hashtags"
                      :key="index"
                      :label="hashtag"
                      :value="hashtag"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="Is this a paid event?">
                  <el-switch
                    v-model="event.paid"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :lg="6">
                <el-form-item label="Allow only RSVPs">
                  <el-switch
                    v-model="event.rsvp"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="vid-section-create">
            <el-button
              type="primary"
              size="large"
              :loading="updatingEvent"
              @click="updateEvent"
              >Update</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
    <update-cover-image
      :show.sync="updateCoverImage"
      :background.sync="backgroundUrl"
    />
  </div>
</template>

<script>
import request from '../../controller/request'
import { convertCase } from '../../plugins/case-converter'
import UpdateCoverImage from '~/components/BackgroundImage/UpdateCoverImage'

export default {
  name: 'UpdateEvent',
  components: {
    UpdateCoverImage
  },
  data() {
    return {
      updateCoverImage: false,
      backgroundUrl: '',
      backgroundType: '',
      event: {
        event_date: '',
        event_name: '',
        event_start_time: '',
        event_duration: '',
        paid: '',
        rsvp: '',
        event_ref: '',
        event_video_url: '',
        event_banner: '',
        event_hashtag: ''
      },
      hashtags: [],
      responseEvent: {},
      updatingEvent: false
    }
  },
  computed: {
    hasStartTime() {
      return this.event.start_time !== ''
    },
    storeEvent() {
      return this.$store.state.event.event
    }
  },
  watch: {
    storeEvent() {
      this.setEventValues()
    },
    backgroundUrl() {
      this.event.event_banner = this.backgroundUrl
    }
  },
  methods: {
    setBackgroundType() {
      const videoFormat = ['mp4', 'mov', '3gp']
      const imageFormat = ['jpg', 'jpeg', 'png']

      const backgroundUrl = this.event.event_banner.split('.')

      if (videoFormat.includes(backgroundUrl[backgroundUrl - 1])) {
        this.backgroundType = 'video'
      } else if (
        imageFormat.includes(backgroundUrl[backgroundUrl - 1]) ||
        this.event.event_banner.includes('unsplash')
      ) {
        this.backgroundType = 'image'
      } else if (this.event.event_banner.charAt(0) === '#') {
        this.backgroundType = 'color'
      }
    },
    async generateHashtag(eventName) {
      await request.generateHashtag(eventName).then((response) => {
        if (response.data.success) {
          this.hashtags = response.data.hashtags
        }
      })
    },
    async setEventValues() {
      const responseEvent = await this.$store.state.event.event
      for (const key in responseEvent) {
        const convertedKey = convertCase(key)
        this.responseEvent[convertedKey] = responseEvent[key]
      }
      this.event = { ...this.responseEvent }
      this.generateHashtag(this.event.event_name)
      this.setBackgroundType()
    },
    async updateEvent() {
      this.updatingEvent = true
      await request
        .createEvent(this.event)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then((response) => {
                this.$message.success('Event updated')
                this.setEventValues()
                this.updatingEvent = false
              })
              .catch(() => {
                this.$message.error('Something went wrong')
                this.updatingEvent = false
              })
          } else {
            this.updatingEvent = false
          }
        })
        .catch(() => {
          this.updatingEvent = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-update {
  .vid-header {
    height: 550px;
    background: #222151;
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;

    video {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
    }

    .text-overlay {
      height: 160px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      z-index: 1;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.02) 5%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.75) 100%
      );
    }

    .container {
      position: relative;
      height: 100%;
      z-index: 2;

      .vid-event-title {
        position: absolute;
        right: 50px;
        bottom: 50px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .vid-custom-input {
          box-shadow: none;
          background: transparent;
          border: none;
          border-radius: 0;
          border-bottom: 2px solid #ffffff50;

          .el-input__inner {
            color: #fff;
          }
        }
      }
    }
  }

  .vid-event-form {
    width: 80%;
    margin: auto;
  }

  .vid-section {
    margin-bottom: 50px;

    h6 {
      /*font-family: 'Quicksand', sans-serif;*/
      color: #222151;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
      margin-bottom: 30px;
      font-size: 0.9rem;
      position: relative;
      padding-left: 25px;

      &::before {
        content: '';
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        left: 0;
        height: 9px;
        width: 9px;
        background: #7733f4;
        border-radius: 100px;
      }
    }
  }

  .vid-event-details {
    padding: 60px 0;
  }

  .vid-custom-input .el-switch {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .vid-section-create {
    margin: 40px 0;
    display: flex;
    justify-content: center;
  }
}

.video-provider {
  img {
    height: 40px;
    width: auto;
    object-fit: contain;
    border-radius: 5px;
  }
}

@media (max-width: 600px) {
  .vid-update {
    .vid-header {
      height: 300px;

      .vid-event-title {
        right: 20% !important;
      }
    }

    .vid-event-form {
      width: 100%;
    }
  }
}
</style>
