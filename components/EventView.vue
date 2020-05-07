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
        <div class="vid-event-title">
          <div>
            <p class="event-status">{{ event.eventStatus }}</p>
            <h1>{{ event.eventName }}</h1>
            <el-button type="white" @click="scrollTo('register')"
              >Register For This Event</el-button
            >
            <div class="d-flex align-items-center mt-2">
              <h5 v-if="attendees.length" class="mb-0">
                {{ attendees.length }}
                {{ attendees.length > 1 ? 'people' : 'person' }} attending
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
          <div class="vid-event-calendar">
            <h3>{{ months[new Date(event.eventDate).getMonth()] }}</h3>
            <h1>{{ new Date(event.eventDate).getDate() }}</h1>
          </div>
        </div>
      </div>
    </div>
    <section class="vid-countdown">
      <div class="container">
        <p>Time left to event</p>
        <h2>{{ timeLeft }}</h2>
        <el-dropdown>
          <el-button type="outline">Add To Calendar</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(calendar, index) in calendars"
              :key="index"
              ><a :href="calendar.url" target="_blank">{{ calendar.name }}</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
    <section v-if="plans.length" class="vid-plans">
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
    <section v-if="!plans.length" ref="register" class="vid-cta">
      <div class="container">
        <p>Register for this event now!</p>
        <el-form
          ref="attendForm"
          :model="attend"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="" prop="attendee_email">
            <el-input v-model="attend.attendee_email"></el-input>
          </el-form-item>
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
    <el-dialog :visible.sync="showPaymentDialog">
      <div v-loading="paying" class="payment-form">
        <el-form ref="payToAttendForm" :model="attend" :rules="rules">
          <h5 class="mb-3">Provide your email address</h5>
          <el-row :gutter="30" type="flex" class="flex-wrap">
            <el-col :lg="24"
              ><el-form-item
                v-custom-input="attend.attendee_email"
                class="vid-custom-input"
                label="Your email"
                prop="attendee_email"
              >
                <el-input
                  v-model="attend.attendee_email"
                  type="text"
                  auto-complete="on"
                  prefix-icon="vid-icon--at-sign"
                ></el-input> </el-form-item
            ></el-col>
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
import request from '../controller/request'

export default {
  name: 'EventView',
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
        event_ref: ''
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
      clientIdCalender: 'afXHuZxmQzqnsQSJXmZx86885'
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
    }
  },
  created() {
    if (this.$route.params.eventRef) {
      this.getEvent()
    } else {
      this.$router.push({ name: 'index' })
    }
  },
  methods: {
    scrollTo(ref) {
      this.$refs[ref].scrollIntoView()
    },
    countdown() {
      const timeLeft = new Date(this.event.eventDate).getTime() - this.now

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

      if (timeLeft < 0) {
        return '00 : 00 : 00 : 00'
      }
      this.timeLeft = `${days} : ${hours} : ${minutes} : ${seconds}`
    },
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
          this.speakers = response.data.speakers
          this.schedule = response.data.schedule
          this.sponsors = response.data.sponsors
          this.gallery = response.data.images
          this.attendees = response.data.attendees
          this.plans = response.data.plans
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
      this.$refs.attendForm.validate((valid) => {
        if (valid) {
          this.attending = true
          request.attendEvent(this.attend).then((response) => {
            if (response.data.success) {
              this.$message.success(
                'Your request to attend this event has been submitted'
              )
              this.attend.attendee_email = ''
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
    setAttendeePlan(payRef) {
      this.showPaymentDialog = true
      this.attend.plan_ref = payRef
    },
    payAndAttend() {
      this.$refs.payToAttendForm.validate((valid) => {
        if (valid) {
          this.paying = true
          request.payForEvent(this.attend).then((response) => {
            if (response.data.success) {
              this.$message.success(
                'Your payment to attend this event has been received'
              )
              this.attend.attendee_email = ''
              this.attend.plan_ref = ''
              this.paying = false
            } else {
              this.paying = false
            }
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
          margin-bottom: 5px;
          width: 100%;
          line-height: 1.4;
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

  .vid-countdown {
    text-align: center;
    background: #fff;

    p {
      font-size: 1.4rem;
      font-weight: 500;
    }

    h2 {
      color: #222151;
      font-weight: 600;
      font-size: 3rem;
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
      width: 50%;

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
