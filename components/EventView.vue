<template>
  <div class="vid-event-view">
    <div
      class="vid-header"
      :style="{
        background: backgroundType === 'color' ? `${event.eventBanner}` : false,
        backgroundImage:
          backgroundType === 'image' ? `url(${event.eventBanner})` : false
      }"
    >
      <video
        v-if="backgroundType === 'video'"
        :src="event.eventBanner"
        :autoplay="true"
        :controls="false"
      ></video>
      <div
        v-if="backgroundType === 'image' || backgroundType === 'video'"
        class="background-overlay"
      ></div>
      <div class="container">
        <div v-if="event.eventName" class="vid-event-title">
          <div>
            <p class="event-status">{{ event.eventStatus }}</p>
            <h1>{{ event.eventName }}</h1>
            <p class="event-desc">{{ event.eventDetails }}</p>
            <el-button
              v-if="eventActive"
              type="white"
              @click="scrollTo('register')"
              >Register For This Event</el-button
            >
            <div class="d-flex align-items-center mt-2">
              <h5 v-if="attendees.length" class="mb-0">
                {{ attendees.length }}
                {{ attendees.length > 1 ? 'people' : 'person' }}
                {{ eventActive ? 'attending' : 'attended' }}
              </h5>
              <div class="like-event">
                <img
                  v-if="like"
                  src="@/assets/img/like.svg"
                  @click="like = !like"
                />
                <img
                  v-if="!like"
                  src="@/assets/img/unlike.svg"
                  @click="likeEvent"
                />
              </div>
              <el-dropdown>
                <div v-loading="gettingSocialLinks" class="share-event">
                  <img src="@/assets/img/share.svg" />
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    ><a :href="social_share.whatsapp" target="_blank"
                      >WhatsApp</a
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    ><a :href="social_share.twitter" target="_blank"
                      >Twitter</a
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    ><a :href="social_share.linkdeln" target="_blank"
                      >LinkedIn</a
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    ><a :href="social_share.facebook" target="_blank"
                      >Facebook</a
                    ></el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div
            v-if="event.hasOwnProperty('eventDate')"
            class="vid-event-calendar"
          >
            <h3>{{ months[new Date(event.eventDate).getMonth()] }}</h3>
            <h1>{{ new Date(event.eventDate).getDate() }}</h1>
          </div>
        </div>
      </div>
    </div>
    <section
      v-if="event.paid || event.rsvp"
      ref="eventDetails"
      class="vid-event-details"
    >
      <div class="container">
        <p class="mb-5">Event Details</p>
        <el-row type="flex" :gutter="30" class="flex-wrap">
          <el-col :sm="24" :md="8">
            <div class="vid-event-detail">
              <span class="title">Meeting URL</span>
              <span class="value"
                >{{ isUserRegistered ? event.eventVideoUrl : 'XXXXXXXXXXX' }}
                <span v-if="event.eventVideoUrl && isUserRegistered">
                  <el-input
                    v-model="event.eventVideoUrl"
                    class="vid-event-url"
                    type="text"
                  ></el-input>
                  <a class="ml-2" @click="copyUrl"
                    ><i class="vid-icon--copy"></i
                  ></a>
                  <a :href="event.eventVideoUrl" class="ml-2" target="_blank"
                    ><i class="vid-icon--external-link"></i
                  ></a>
                </span>
              </span>
            </div>
          </el-col>
          <el-col :sm="24" :md="8">
            <div class="vid-event-detail">
              <span class="title">Meeting ID</span>
              <span class="value"
                >{{ isUserRegistered ? event.eventZoomMeetingId : 'XXXXXXXXXXX'
                }}<span v-if="event.eventZoomMeetingId && isUserRegistered">
                  <el-input
                    v-model="event.eventZoomMeetingId"
                    class="vid-event-id"
                    type="text"
                  ></el-input>
                  <a class="ml-2" @click="copyUrlId"
                    ><i class="vid-icon--copy"></i
                  ></a> </span
              ></span>
            </div>
          </el-col>
          <el-col :sm="24" :md="8"
            ><div class="vid-event-detail">
              <span class="title">Meeting Password</span>
              <span class="value"
                >{{
                  isUserRegistered
                    ? event.eventZoomMeetingPassword
                    : 'XXXXXXXXXXX'
                }}<span
                  v-if="event.eventZoomMeetingPassword && isUserRegistered"
                >
                  <el-input
                    v-model="event.eventZoomMeetingPassword"
                    class="vid-event-password"
                    type="text"
                  ></el-input>
                  <a class="ml-2" @click="copyUrlPassword"
                    ><i class="vid-icon--copy"></i
                  ></a> </span
              ></span></div
          ></el-col>
        </el-row>
      </div>
    </section>
    <section v-if="event.eventDate" class="vid-countdown">
      <div class="container">
        <p>Time left to event</p>
        <div class="my-4">
          <h6 v-if="new Date() > new Date(event.eventDate)">
            Event has ended
          </h6>
          <div v-else class="d-flex flex-column align-items-center">
            <countdown :time="new Date(event.eventDate) - new Date()">
              <template slot-scope="props"
                ><div class="vid-countdown-design">
                  <div>
                    <span>{{ props.days }}</span
                    >days
                  </div>
                  <div>
                    <span>{{ props.hours }}</span
                    >hours
                  </div>
                  <div>
                    <span>{{ props.minutes }}</span
                    >minutes
                  </div>
                  <div>
                    <span>{{ props.seconds }}</span
                    >seconds
                  </div>
                </div></template
              >
            </countdown>
            <el-dropdown v-if="isUserRegistered" class="mt-3">
              <el-button type="outline">Add To Calendar</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(calendar, index) in calendars"
                  :key="index"
                  ><a :href="calendar.url" target="_blank">{{
                    calendar.name
                  }}</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-else
              type="outline"
              class="mt-3"
              @click="scrollTo('register')"
              >Add To Calendar</el-button
            >
          </div>
        </div>
      </div>
    </section>
    <section v-if="speakers.length" class="vid-speakers">
      <div class="container">
        <h4 class="section-heading">EVENT SPEAKERS</h4>
        <div class="vid-speaker-container">
          <div
            v-for="(speaker, index) in speakers"
            :key="index"
            class="vid-speaker"
          >
            <img
              class="icon"
              src="@/assets/img/speaker-icon.svg"
              alt="Speaker"
            />
            <img :src="speaker.eventSpeakerImage" alt />
            <h6>{{ speaker.eventSpeakerName }}</h6>
          </div>
        </div>
      </div>
    </section>
    <section v-if="schedule.length" class="vid-schedule">
      <div class="container">
        <el-row type="flex" :gutter="40" class="flex-wrap">
          <el-col :sm="24" :md="12">
            <h4 class="section-heading">SCHEDULE</h4>
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in schedule"
                :key="index"
                :timestamp="`DAY ${activity.eventScheduleDay}`"
                placement="top"
              >
                <el-card>
                  <div>
                    <h4>{{ activity.eventScheduleItem }}</h4>
                    <p>Description of the activity</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-col>
          <el-col :sm="24" :md="12">
            <div class="illustration">
              <img src="@/assets/img/schedule-illustration.svg" alt />
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
    <section v-if="sponsors.length" class="vid-sponsors">
      <div class="container">
        <h4 class="section-heading">OUR SPONSORS</h4>
        <div class="vid-sponsors-container">
          <img
            v-for="(sponsor, index) in sponsors"
            :key="index"
            :src="sponsor.eventSponsorLogo"
            alt
          />
        </div>
      </div>
    </section>
    <section v-if="gallery.length" class="vid-gallery">
      <div class="container">
        <h4 class="section-heading">GALLERY</h4>
        <div class="vid-gallery-container">
          <img
            v-for="(image, index) in gallery"
            :key="index"
            :src="image.eventImage"
            alt
          />
        </div>
      </div>
    </section>
    <section v-if="plans.length && event.paid" ref="register" class="vid-plans">
      <div class="container">
        <h4 class="section-heading">PLANS</h4>
        <el-row type="flex" class="flex-wrap mt-5" :gutter="30">
          <el-col
            v-for="(plan, index) in plans"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
          >
            <div class="vid-attendees-container">
              <div class="payment-plan">
                <h4>{{ plan.eventPlanName }}</h4>
                <h2>{{ plan.eventPlanCurrency }} {{ plan.eventPlanAmount }}</h2>
                <p>{{ plan.eventPlanDetails }}</p>
                <el-button
                  v-if="eventActive"
                  size="small"
                  type="white"
                  @click="setAttendeePlan(plan.eventPlanRef)"
                  >Pay To Attend</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
    <section v-if="!event.paid && eventActive" ref="register" class="vid-cta">
      <div class="container">
        <p>Register for this event now!</p>
        <el-form
          ref="registerForm"
          :model="attend"
          :rules="rules"
          label-position="top"
        >
          <el-row
            v-if="event.allowPhoneNumber"
            type="flex"
            class="flex-wrap"
            :gutter="20"
          >
            <el-col :md="12"
              ><el-form-item label="Your email" prop="attendee_email">
                <el-input
                  v-model="attend.attendee_email"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :md="12"
              ><el-form-item
                v-only-number
                label="Your phone number"
                prop="attendee_phone_number"
              >
                <el-input
                  v-model="attend.attendee_phone_number"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row v-else type="flex" class="flex-wrap">
            <el-col :md="24"
              ><el-form-item label="" prop="attendee_email">
                <el-input
                  v-model="attend.attendee_email"
                  maxlength="11"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row type="flex" class="flex-wrap" :gutter="30">
            <el-col
              v-for="(question, index) in attend.questions"
              :key="index"
              :md="24"
            >
              <el-form-item :label="question.question">
                <el-input v-model="question.answer" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button
          :loading="attending"
          type="white"
          placeholder="you@mail.com"
          @click="attendEvent"
          >Attend</el-button
        >
      </div>
    </section>
    <el-dialog width="50%" :visible.sync="showPaymentDialog">
      <div v-loading="paying" class="payment-form">
        <el-form ref="payToAttendForm" :model="attend" :rules="rules">
          <h5 class="mb-3">Please provide the required details</h5>
          <el-row
            v-if="event.allowPhoneNumber"
            type="flex"
            class="flex-wrap"
            :gutter="20"
          >
            <el-col :md="12"
              ><el-form-item label="Your email" prop="attendee_email">
                <el-input
                  v-model="attend.attendee_email"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :md="12"
              ><el-form-item
                v-only-number
                label="Your number"
                prop="attendee_phone_number"
              >
                <el-input
                  v-model="attend.attendee_phone_number"
                  maxlength="11"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row v-else type="flex" class="flex-wrap">
            <el-col :md="24"
              ><el-form-item label="Your email" prop="attendee_email">
                <el-input
                  v-model="attend.attendee_email"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row type="flex" class="flex-wrap">
            <el-col
              v-for="(question, index) in attend.questions"
              :key="index"
              :span="24"
            >
              <el-form-item :label="question.question">
                <el-input v-model="question.answer" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <div class="d-flex justify-content-center">
            <el-button type="primary" @click="payAndAttend">Pay</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import request from '../controller/request'

export default {
  name: 'EventView',
  components: {},
  props: {
    show: Boolean
  },
  data() {
    return {
      backgroundType: '',
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'November',
        'December'
      ],
      now: new Date().getTime(),
      timeLeft: '',
      showLoaderDialog: true,
      event: {},
      speakers: [],
      schedule: [],
      sponsors: [],
      gallery: [],
      attendees: [],
      plans: [],
      attend: {
        attendee_email: '',
        attendee_phone_number: '',
        event_ref: '',
        questions: []
      },
      rules: {
        attendee_email: [
          {
            required: true,
            message: 'Please enter email address',
            trigger: 'change'
          },
          {
            type: 'email',
            message: 'Invalid email',
            trigger: ['blur']
          }
        ]
      },
      like: false,
      attending: false,
      paying: false,
      showPaymentDialog: false,
      gettingSocialLinks: false,
      social_share: {
        whatsapp: '',
        twitter: '',
        facebook: '',
        linkdeln: ''
      },
      clientIdCalender: 'afXHuZxmQzqnsQSJXmZx86885',
      isUserRegistered: false
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
    calendars() {
      return [
        {
          name: 'Google',
          url: `https://www.addevent.com/dir/?client=${this.clientIdCalender}&start=${this.event.eventDate}&title=${this.event.eventName}&description=Description+of+the+event&location=${this.event.eventVideo}&service=google`
        },
        {
          name: 'Apple',
          url: `https://www.addevent.com/dir/?client=${this.clientIdCalender}&start=${this.event.eventDate}&title=${this.event.eventName}&description=Description+of+the+event&location=${this.event.eventVideo}&service=apple`
        },
        {
          name: 'Office 365',
          url: `https://www.addevent.com/dir/?client=${this.clientIdCalender}&start=${this.event.eventDate}&title=${this.event.eventName}&description=Description+of+the+event&location=${this.event.eventVideo}&service=office365`
        },
        {
          name: 'Outlook',
          url: `https://www.addevent.com/dir/?client=${this.clientIdCalender}&start=${this.event.eventDate}&title=${this.event.eventName}&description=Description+of+the+event&location=${this.event.eventVideo}&service=outlook`
        },
        {
          name: 'Yahoo',
          url: `https://www.addevent.com/dir/?client=${this.clientIdCalender}&start=${this.event.eventDate}&title=${this.event.eventName}&description=Description+of+the+event&location=${this.event.eventVideo}&service=yahoo`
        }
      ]
    },
    eventActive() {
      return new Date(this.event.eventDate) > new Date()
    }
  },
  created() {
    if (this.$route.params.eventRef) {
      if (this.$route.query.status && Cookies.get('attend')) {
        this.registerAfterPay(JSON.parse(Cookies.get('attend')))
      }
      this.getEvent()
    } else {
      this.$router.push({ name: 'index' })
    }
  },
  mounted() {
    if (Cookies.get('is-registered')) {
      this.isUserRegistered = true
    }
  },
  methods: {
    scrollTo(ref) {
      this.$refs[ref].scrollIntoView()
    },
    setBackgroundType() {
      const videoFormat = ['mp4', 'mov', '3gp']
      const imageFormat = ['jpg', 'jpeg', 'png']

      const backgroundUrl = this.event.eventBanner.split('.')

      if (videoFormat.includes(backgroundUrl[backgroundUrl.length - 1])) {
        this.backgroundType = 'video'
      } else if (
        imageFormat.includes(backgroundUrl[backgroundUrl.length - 1]) ||
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
          this.speakers = response.data.speakers
          this.schedule = response.data.schedule
          this.sponsors = response.data.sponsors
          this.gallery = response.data.images
          this.attendees = response.data.attendees
          this.plans = response.data.plans
          this.attend.questions = response.data.questions
          this.attend.event_ref = response.data.event.eventRef
          this.setBackgroundType()
          this.shareEvent()
          this.showDialog = false
        } else {
          this.$message.error('Unable to get requested Event.')
          this.$router.push({ name: 'index' })
          this.showDialog = false
        }
      })
    },
    likeEvent() {
      this.like = !this.like
      request.likeEvent(this.event.eventRef).then((response) => {
        if (response.data.success) {
        }
      })
    },
    shareEvent() {
      request.shareEvent(this.event.eventRef).then((response) => {
        if (response.data.success) {
          this.social_share = { ...response.data }
        }
      })
    },
    attendEvent() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          const questions = []
          this.attend.questions.forEach((question) => {
            questions.push({
              answer: question.answer,
              question_ref: question.questionRef
            })
          })
          this.attend.questions = questions
          this.attending = true
          request.registerForEvent(this.attend).then((response) => {
            if (response.data.success) {
              this.$notify({
                title: 'Request Submitted',
                message:
                  'Your request to attend this event has been submitted. You can check for event details now.',
                type: 'success'
              })
              this.$refs.registerForm.resetFields()
              this.attend.questions = []
              this.isUserRegistered = true
              Cookies.set('is-registered', true)
              this.$refs.eventDetails.scrollIntoView()
              this.attending = false
            } else {
              this.attending = false
            }
          })
        } else {
          return false
        }
      })
    },
    registerAfterPay(payload) {
      request.registerForEvent(payload).then((response) => {
        if (response.data.success) {
          this.isUserRegistered = true
          Cookies.set('is-registered', true)
        }
      })
    },
    setAttendeePlan(payRef) {
      this.showPaymentDialog = true
      this.attend.plan_ref = payRef
    },
    payAndAttend() {
      this.$refs.payToAttendForm.validate((valid) => {
        if (valid) {
          this.paying = true
          const questions = []
          this.attend.questions.forEach((question) => {
            questions.push({
              answer: question.answer,
              question_ref: question.questionRef
            })
          })
          this.attend.questions = questions
          request.payForEvent(this.attend).then((response) => {
            if (response.data.success) {
              Cookies.set('attend', this.attend)
              window.location.href = response.data.ref
            } else {
              this.paying = false
            }
          })
        } else {
          return false
        }
      })
    },
    copyUrl() {
      const link = document.querySelector('.vid-event-url .el-input__inner')
      /* Select the text field */
      link.select()
      link.setSelectionRange(0, 99999)

      document.execCommand('copy')

      this.$message({
        message: 'Meeting Url copied',
        type: 'success'
      })
    },
    copyUrlId() {
      const link = document.querySelector('.vid-event-id .el-input__inner')
      /* Select the text field */
      link.select()
      link.setSelectionRange(0, 99999)

      document.execCommand('copy')

      this.$message({
        message: 'Meeting Id copied',
        type: 'success'
      })
    },
    copyUrlPassword() {
      const link = document.querySelector(
        '.vid-event-password .el-input__inner'
      )
      /* Select the text field */
      link.select()
      link.setSelectionRange(0, 99999)

      document.execCommand('copy')

      this.$message({
        message: 'Meeting Password copied',
        type: 'success'
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
        {
          hid: 'twitterTitle',
          name: 'twitter:title',
          content: this.event.eventName
        },
        {
          hid: 'twitterUrl',
          name: 'twitter:url',
          content: `https://vidrl.netlify.app/event/${this.$route.params.eventRef}`
        },
        {
          hid: 'twitterImage',
          name: 'twitter:image',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },
        {
          hid: 'twitterDescription',
          name: 'twitter:description',
          content: this.event.eventDetails
        },
        // Twitter summary card with large image must be at least 280x150px
        {
          hid: 'twitterImageSrc',
          name: 'twitter:image:src',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? this.event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },
        // Open Graph data
        { hid: 'ogTitle', property: 'og:title', content: this.event.eventName },
        {
          hid: 'ogUrl',
          property: 'og:url',
          content: `https://vidrl.netlify.app/event/${this.$route.params.eventRef}`
        },
        {
          hid: 'ogImage',
          property: 'og:image',
          content:
            this.backgroundType === 'image' || this.backgroundType === 'video'
              ? this.event.eventBanner
              : 'https://res.cloudinary.com/da8zzhkwy/image/upload/v1588800785/seo/seo-card_ekliop.png'
        },
        {
          hid: 'ogDescription',
          property: 'og:description',
          content: this.event.eventDetails
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-event-view {
  section {
    padding: 70px 0;
  }

  .section-heading {
    font-size: 1.2rem;
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    color: #222151;
    letter-spacing: 1px;
  }

  .vid-header {
    height: 100vh;
    background: #222151;
    position: relative;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;

    .background-overlay {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.4);
    }

    .container {
      position: relative;
      height: 100%;
      z-index: 2;

      .like-event,
      .share-event {
        margin-left: 10px;
        cursor: pointer;
        height: 55px;
        width: 55px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        background: #ffffff20;

        img {
          height: 24px;
          width: auto;
        }
      }

      .vid-event-title {
        color: #fff;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .event-status {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0;
          position: relative;
          padding-left: 20px;

          &::before {
            content: '';
            position: absolute;
            height: 10px;
            width: 10px;
            border-radius: 100px;
            background: #fff;
            top: 9px;
            left: 0;
          }
        }

        h1 {
          font-size: 4.5rem;
          font-weight: 600;
          width: 100%;
          line-height: 1.2;
        }

        .event-desc {
          font-size: 1rem;
          color: #fff;
          margin-bottom: 20px;
        }

        .vid-event-calendar {
          height: 300px;
          width: 300px;
          background: #fff;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          border-radius: 30px;
          padding: 40px 25px;
          text-align: center;

          h3 {
            font-weight: 500;
            font-size: 2.5rem;
            color: #222151;
            line-height: 1;
            margin-bottom: 20px;
          }

          h1 {
            font-size: 10rem;
            line-height: 1;
            color: #222151;
          }
        }
      }
    }
  }

  .vid-event-details {
    background: #f4f7fa;

    p {
      font-size: 1.4rem;
      text-align: center;
      font-weight: 500;
    }

    .vid-event-detail {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .vid-event-url,
      .vid-event-id,
      .vid-event-password {
        opacity: 0;
        z-index: -1;
        position: absolute;

        + a {
          cursor: pointer;
        }
      }

      .title {
        background: #222151;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-right: 12px;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.8rem;
        font-weight: 400;
      }

      .value {
        font-size: 1.1rem;
        font-weight: 600;
      }
    }
  }

  .vid-countdown {
    text-align: center;
    background: #fff;

    p {
      font-size: 1.2rem;
      font-weight: 500;
    }

    h6 {
      font-size: 2rem;
      font-weight: 600;
    }

    h2 {
      color: #222151;
      font-weight: 600;
      font-size: 3rem;
    }

    .vid-countdown-design {
      display: flex;
      align-items: center;
      justify-content: center;

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        font-size: 12px;
        color: #222151;

        &:not(:last-child) {
          margin-right: 15px;
        }

        span {
          background: #222151;
          width: 80px;
          height: 70px;
          border-radius: 8px;
          color: #fff;
          font-size: 2.2rem;
          font-weight: 600;
          margin-bottom: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .vid-speakers {
    background: #f9f9fb;

    .vid-speaker-container {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin-top: 50px;

      .vid-speaker {
        padding: 25px 30px;
        background: #fff;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        display: flex;
        align-items: center;
        width: calc(33% - 40px);
        margin: 0 20px 20px;
        position: relative;

        .icon {
          position: absolute;
          right: 0;
          opacity: 0.08;
        }

        img {
          border-radius: 100%;
          height: 60px;
          width: 60px;
          object-fit: cover;
          margin-right: 10px;
          -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
          filter: grayscale(100%);
        }

        h6 {
          font-size: 1rem;
        }
      }
    }
  }

  .vid-schedule {
    .illustration {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        display: flex;
        background: #222151;
        height: 300px;
        width: auto;
      }
    }
  }

  .vid-sponsors {
    background: #fff;

    .vid-sponsors-container {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;

      img {
        display: flex;
        height: 50px;
        width: auto;
        margin: 0 30px 20px;
      }
    }
  }

  .vid-gallery {
    background: #f9f9fb;

    .vid-gallery-container {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;

      img {
        display: flex;
        background: #222151;
        height: 220px;
        width: calc(33% - 60px);
        object-fit: cover;
        margin: 0 20px 40px;
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
      }
    }
  }

  .vid-plans {
    .payment-plan {
      background: #222151;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      text-align: center;
      padding: 50px 30px;
      color: #fff;
      margin-bottom: 30px;

      h4 {
        margin-bottom: 5px;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
      }

      p {
        font-size: 0.9rem;
        width: 70%;
        line-height: 1.6;
        margin: 0 auto 20px;
      }

      h2 {
        font-size: 1.6rem;
        font-weight: 600;
      }
    }
  }
  .vid-cta {
    background: #222151;

    .el-form {
      width: 60%;

      .el-form-item__content .el-input {
        width: 100%;
      }
    }

    p {
      color: #fff;
      margin-bottom: 15px;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-input {
        width: 50%;
        margin-bottom: 5px;
      }
    }
  }
}

.payment-form .el-form {
  width: 80%;
  margin: auto;
}

@media (max-width: 1024px) {
  .vid-event-view {
    .vid-event-title {
      flex-direction: column-reverse;
      justify-content: center !important;

      h1 {
        width: 100% !important;
      }

      > div:not(.vid-event-calendar) {
        text-align: center;
        margin-top: 40px;

        > div {
          justify-content: center;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .vid-speaker {
    width: calc(50% - 30px) !important;
    margin: 0 auto 30px !important;
  }

  .vid-schedule {
    .section-heading {
      margin-bottom: 30px;
    }

    .el-row {
      flex-direction: column-reverse;
    }
    .illustration {
      margin-bottom: 30px;
    }
  }

  .vid-gallery-container img {
    width: calc(47% - 20px) !important;
  }

  .vid-cta .el-form {
    width: 100% !important;
  }
}

@media (max-width: 600px) {
  .vid-event-view .el-dialog {
    width: 100% !important;
  }

  .vid-event-title {
    h1 {
      font-size: 3rem !important;
    }
  }
  .vid-event-calendar {
    height: 180px !important;
    width: 180px !important;
    border-radius: 15px;

    h3 {
      font-size: 1.5rem !important;
    }

    h1 {
      font-size: 6rem !important;
    }
  }

  .vid-speaker,
  .vid-gallery-container img {
    width: 100% !important;
  }

  .vid-cta .el-input {
    width: 100% !important;
  }
}
</style>
