<template>
  <div class="vid-create">
    <navbar />
    <div
      class="vid-header"
      :style="{
        background: coverImage === 'color' ? `${backgroundUrl}` : false,
        backgroundImage:
          coverImage === 'others' ? `url(${backgroundUrl})` : false
      }"
    >
      <video
        v-if="videoCoverBg"
        :src="backgroundUrl"
        :autoplay="true"
        :controls="false"
      ></video>
      <div
        v-if="backgroundUrl && coverImage !== 'color'"
        class="text-overlay"
      ></div>
      <div class="container">
        <div class="vid-event-title">
          <el-form :model="event">
            <el-form-item
              v-custom-input="event.event_name"
              class="vid-custom-input"
              label="Event Title"
              prop="event_name"
            >
              <el-input
                v-model="event.event_name"
                type="text"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button type="white" plain @click="updateCoverImage = true"
            >Update Cover Image</el-button
          >
        </div>
      </div>
    </div>
    <div class="vid-event-details">
      <div class="container">
        <el-form
          ref="createEvent"
          :model="event"
          :rules="rules"
          label-position="top"
          class="vid-event-form"
        >
          <div class="vid-section">
            <el-row v-if="isLoggedInVia">
              <el-col :md="24">
                <p>
                  You are signed in via
                  <strong>{{
                    selectedVideoProvider.provider.toUpperCase()
                  }}</strong>
                </p>
                <div
                  v-if="selectedVideoProvider.provider.toLowerCase() === 'zoom'"
                >
                  <el-radio v-model="meetingChoice" label="1" border
                    >Create Meeting For Me</el-radio
                  >
                  <el-radio v-model="meetingChoice" label="2" border
                    >Manually Enter Details</el-radio
                  >
                </div>
              </el-col>
            </el-row>
            <template v-if="!isLoggedInVia">
              <h6>Video Provider</h6>
              <el-row type="flex" :gutter="40" class="flex-wrap">
                <el-col :lg="12"
                  ><el-form-item
                    v-custom-input="event.video_provider"
                    class="vid-custom-input"
                    label="Video Provider"
                    prop="event_video_provider"
                  >
                    <el-select
                      v-model="event.video_provider"
                      placeholder=""
                      @change="setVideoProvider"
                    >
                      <template slot="prefix">
                        <i class="vid-icon--video exp"></i>
                      </template>
                      <el-option
                        v-for="(provider, index) in videoProviders"
                        :key="index"
                        :label="provider.provider"
                        :value="index"
                      ></el-option>
                    </el-select> </el-form-item
                ></el-col>
                <el-col :lg="12">
                  <div
                    v-if="selectedVideoProvider.oauthUrl"
                    class="video-provider"
                  >
                    <p>
                      Sign in with {{ selectedVideoProvider.provider }} and we'd
                      link it up automatically
                    </p>
                    <a :href="selectedVideoProvider.oauthUrl">
                      <img :src="selectedVideoProvider.buttonImage" />
                    </a>
                  </div>
                </el-col>
              </el-row>
            </template>
          </div>
          <div v-if="meetingChoice === '1'" class="vid-section">
            <el-checkbox v-model="createMeeting.room"
              >Use personal meeting room</el-checkbox
            >
            <el-checkbox v-model="createMeeting.password"
              >Generate a password for the meeting</el-checkbox
            >
          </div>
          <div
            v-if="meetingChoice === '2' || selectedVideoProvider"
            class="vid-section"
          >
            <h6>{{ selectedVideoProvider.provider }} Info</h6>
            <el-row :gutter="30" type="flex" class="flex-wrap">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.video_url"
                  class="vid-custom-input"
                  label="URL"
                  prop="video_url"
                >
                  <el-input
                    v-model="event.video_url"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--hash"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row
              v-if="selectedVideoProvider.provider.toLowerCase() === 'zoom'"
              :gutter="30"
              type="flex"
            >
              <el-col :lg="12"
                ><el-form-item
                  v-custom-input="event.zoom_meeting_id"
                  class="vid-custom-input"
                  label="ID"
                  prop="zoom_meeting_id"
                >
                  <el-input
                    v-model="event.zoom_meeting_id"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--hash"
                  ></el-input> </el-form-item
              ></el-col>
              <el-col :lg="12"
                ><el-form-item
                  v-custom-input="event.zoom_meeting_password"
                  class="vid-custom-input"
                  label="Password"
                  prop="zoom_meeting_password"
                >
                  <el-input
                    v-model="event.zoom_meeting_password"
                    type="password"
                    auto-complete="off"
                    prefix-icon="vid-icon--lock"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
          </div>
          <div class="vid-section">
            <h6>Event Details</h6>
            <el-row v-if="event.event_name" type="flex" class="flex-wrap">
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
                    disabled
                    prefix-icon="vid-icon--edit-2"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row type="flex" class="flex-wrap">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.event_details"
                  class="vid-custom-input"
                  label="Event Description"
                  prop="event_details"
                >
                  <el-input
                    v-model="event.event_details"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--info"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="30" type="flex" class="flex-wrap">
              <el-col :lg="14"
                ><el-form-item
                  v-custom-input="event.event_date"
                  class="vid-custom-input"
                  label="Date"
                  prop="event_date"
                >
                  <el-date-picker
                    v-model="event.event_date"
                    value-format=""
                    type="date"
                    format="dd-MMMM-yyyy"
                    prefix-icon="vid-icon--calendar"
                  >
                  </el-date-picker> </el-form-item
              ></el-col>
              <el-col :lg="10"
                ><el-form-item
                  v-custom-input="event.start_time"
                  class="vid-custom-input"
                  label="Time"
                  prop="start_time"
                >
                  <el-time-select
                    v-model="event.start_time"
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
                  label="Duration (hours)"
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
                  v-custom-input="event.event_ref"
                  class="vid-custom-input"
                  label="Event Url: https://vidrl.com/"
                  prop="event_public_url"
                >
                  <el-input
                    v-model="event.event_ref"
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
              <el-col :lg="8">
                <el-form-item label="Is this a paid event?">
                  <el-switch
                    v-model="event.paid"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col :lg="8">
                <el-form-item label="Allow only RSVPs">
                  <el-switch
                    v-model="event.rsvp"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
              <el-col v-if="event.rsvp === 1" :lg="8">
                <el-form-item label="Manually Approve RSVPs">
                  <el-switch
                    v-model="event.manual_approve"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="vid-section-create">
            <el-button
              :loading="creatingEvent"
              type="primary"
              size="large"
              @click="createEvent"
              >Create</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
    <update-cover-image
      :show.sync="updateCoverImage"
      :background.sync="backgroundUrl"
    />
    <el-dialog
      :visible="choosePlan"
      :close-on-click-modal="false"
      @close="choosePlan = false"
    ></el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import request from '../controller/request'
import Navbar from '~/components/Navbar'
import UpdateCoverImage from '~/components/BackgroundImage/UpdateCoverImage'

export default {
  name: 'CreateEvent',
  components: {
    Navbar,
    UpdateCoverImage
  },
  data() {
    const urlReg = /^((ftp|http|https):\/\/)?(www\.)?([A-z]+)\.([A-z]{2,})/
    const validateUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Enter meeting url'))
      }
      setTimeout(() => {
        if (!urlReg.test(value)) {
          callback(new Error('Invalid url'))
        }
      }, 1000)
    }
    return {
      choosePlan: false,
      ip: '',
      plans: '',
      videoProviders: [],
      selectedVideoProvider: '',
      updateCoverImage: false,
      backgroundUrl: '',
      backgroundType: '',
      meetingChoice: '',
      createMeeting: {
        room: false,
        password: false
      },
      event: {
        user_id: '',
        event_banner: '',
        event_name: '',
        video_url: '',
        event_details: '',
        event_date: '',
        start_time: '',
        event_ref: '',
        event_public_url: '',
        event_payment_provider: '',
        event_payment_provider_public: '',
        event_payment_provider_secret: '',
        event_video: '',
        event_hashtag: '',
        paid: 0,
        rsvp: 0,
        hide_registration: 0,
        manual_approve: 0,
        event_duration: '',
        video_provider: '',
        zoom_meeting_id: '',
        zoom_meeting_password: '',
        user_email: ''
      },
      rules: {
        video_url: [
          { required: true, validator: validateUrl, trigger: 'blur' }
        ],
        zoom_meeting_id: [
          {
            required: true,
            message: 'Enter meeting id',
            trigger: 'change'
          }
        ],
        zoom_meeting_password: [
          {
            required: true,
            message: 'Enter meeting password',
            trigger: 'change'
          }
        ],
        event_details: [
          {
            required: true,
            message: 'Enter event description',
            trigger: 'change'
          }
        ],
        event_date: [
          {
            required: true,
            message: 'Enter event date',
            trigger: 'change'
          }
        ],
        start_time: [
          {
            required: true,
            message: 'Enter event start time',
            trigger: 'change'
          }
        ]
      },
      hasStartTime: true,
      creatingEvent: false,
      isLoggedInVia: false
    }
  },
  computed: {
    coverImage() {
      return this.backgroundUrl && this.backgroundUrl.charAt(0) === '#'
        ? 'color'
        : 'others'
    },
    videoCoverBg() {
      const videoFormat = ['mp4', '3gp', 'mov']
      let url
      if (this.backgroundUrl) {
        url = this.backgroundUrl.split('.')
      }
      return this.backgroundUrl && videoFormat.includes(url[url.length - 1])
    }
  },
  created() {
    if (this.$route.query.user_id) {
      this.isLoggedInVia = true
      this.setProvider()
    }
    this.fetchAllPlans()
    this.fetchAllVideoProviders()
    this.generateRef()
  },
  methods: {
    setProvider() {
      const data = this.$route.query
      if (data) {
        Cookies.set('user', JSON.stringify(data))
        this.event.user_id = data.user_id
        this.event.user_email = data.email
        this.event.video_provider = data.provider
        this.selectedVideoProvider = {
          provider: data.provider
        }
      }
    },
    async fetchAllPlans() {
      await request
        .getPlans(this.ip)
        .then((response) => {
          if (response.data.success) {
            this.plans = response.data.plans
          }
        })
        .catch()
    },
    async fetchAllVideoProviders() {
      await request
        .getVideoProviders()
        .then((response) => {
          if (response.data.success) {
            this.videoProviders = response.data.providers
          }
        })
        .catch()
    },
    async generateRef() {
      await request
        .generateEventRef()
        .then((response) => {
          if (response.data.success) {
            this.event.event_ref = response.data.ref
          }
        })
        .catch()
    },
    setVideoProvider(value) {
      this.selectedVideoProvider = this.videoProviders[value]
    },
    createEvent() {
      this.$refs.createEvent.validate((valid) => {
        if (valid) {
          this.event.event_banner = this.backgroundUrl
          this.event.event_date = this.event.event_date.toString()
          this.creatingEvent = true
          request
            .createEvent(this.event)
            .then((response) => {
              if (response.data.success) {
                this.$message.success('Event created')
                this.creatingEvent = false
                this.$router.push({
                  name: 'manage-ref',
                  params: { ref: response.event_ref }
                })
              } else {
                this.creatingEvent = false
              }
            })
            .catch(() => {
              this.creatingEvent = false
              this.$message.error('Something went wrong')
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-create {
  .vid-header {
    height: 550px;
    background: #222151;
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

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
        left: 0;
        bottom: 50px;
        width: 100%;
        display: flex;
        justify-content: space-between;
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

.el-radio {
  margin-right: 10px !important;
}

@media (max-width: 1024px) {
  .vid-event-form {
    width: 90% !important;
  }
}

@media (max-width: 992px) {
  .vid-event-title {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .vid-header {
    height: 350px !important;

    .vid-event-title {
      left: 20px !important;
      right: 20px;
      margin: auto;
    }
  }

  .vid-event-form {
    width: 100% !important;
  }
}
</style>
