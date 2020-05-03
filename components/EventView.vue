<template>
  <div class="vid-event-view">
    <div class="vid-header">
      <div class="container">
        <div class="vid-event-title">
          <div>
            <h1>{{ event.eventName }}</h1>
            <el-button type="white" @click="scrollTo('register')"
              >Register For This Event</el-button
            >
            <div class="d-flex align-items-center mt-2">
              <h5 class="mb-0">0 People are attending</h5>
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
        <h2>{{ time }}</h2>
        <!--        <el-button type="secondary">Add To Calendar</el-button>-->
      </div>
    </section>
    <section class="vid-speakers">
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
    <section class="vid-schedule">
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
    <section class="vid-sponsors">
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
    <section class="vid-gallery">
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
    <section ref="register" class="vid-cta">
      <div class="container">
        <p>Register for this event now!</p>
        <el-input
          v-model="attend.attendee_email"
          class="input-with-select"
        ></el-input>
        <el-button
          :loading="attending"
          type="white"
          placeholder="you@mail.com"
          @click="attendEvent"
          >Attend</el-button
        >
      </div>
    </section>
    <el-dialog
      :visible="showLoaderDialog"
      :fullscreen="true"
      :show-close="false"
    >
      <div
        v-loading="showLoaderDialog"
        :style="{ height: '80vh', width: '100%' }"
      ></div>
    </el-dialog>
  </div>
</template>

<script>
import request from '../controller/request'

export default {
  name: 'EventView',
  components: {},
  data() {
    return {
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
      showLoaderDialog: true,
      event: {},
      speakers: [],
      schedule: [],
      sponsors: [],
      gallery: [],
      attend: {
        attendee_email: '',
        event_ref: ''
      },
      like: false,
      attending: false
    }
  },
  computed: {
    time() {
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

      return `${days} : ${hours} : ${minutes} : ${seconds}`
    }
  },
  created() {
    if (this.$route.params.eventRef) {
      this.getEvent()
    } else {
      this.$router.push({ name: 'index' })
    }
  },
  mounted() {},
  methods: {
    scrollTo(ref) {
      this.$refs[ref].scrollIntoView()
    },
    async getEvent() {
      await request.getEvent(this.$route.params.eventRef).then((response) => {
        if (response.data.success) {
          this.event = response.data.event
          this.speakers = response.data.speakers
          this.schedule = response.data.schedule
          this.sponsors = response.data.sponsors
          this.gallery = response.data.images
          this.attend.event_ref = response.data.event.eventRef
          this.showLoaderDialog = false
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
    attendEvent() {
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

    .container {
      position: relative;
      height: 100%;
      z-index: 2;

      .like-event {
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

        h1 {
          font-size: 5rem;
          font-weight: 600;
          margin-bottom: 5px;
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

  .vid-cta {
    background: #222151;

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
        margin-bottom: 15px;
      }
    }
  }
}

@media (max-width: 1024px) {
  .vid-event-view {
    .vid-event-title {
      flex-direction: column-reverse;
      justify-content: center !important;

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
