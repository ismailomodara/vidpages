<template>
  <div class="vid-user-home">
    <navbar :inverse="true" />
    <div class="vid-header">
      <div class="container">
        <h1>
          Hello
          <span v-if="user && userDetails">{{ userDetails.firstName }}</span>
          <span v-else>
            Friend
          </span>
        </h1>
        <el-button
          :disabled="!canCreateEvent"
          size="small"
          type="white"
          @click="createEvent"
          >Create Event</el-button
        >
      </div>
    </div>
    <div class="vid-home-body">
      <div class="container">
        <div class="vid-section">
          <h6>ALL EVENTS</h6>
          <el-row type="flex" :gutter="30" class="flex-wrap">
            <el-col
              v-for="(event, index) in events"
              :key="index"
              :sm="12"
              :md="8"
            >
              <div class="vid-event">
                <div
                  class="vid-event-banner"
                  :style="{
                    background:
                      setBackgroundType(event.eventBanner) === 'color'
                        ? `${event.eventBanner}`
                        : false,
                    backgroundImage:
                      setBackgroundType(event.eventBanner) === 'image'
                        ? `url(${event.eventBanner})`
                        : false
                  }"
                >
                  <video
                    v-if="setBackgroundType(event.eventBanner) === 'video'"
                    :src="event.eventBanner"
                    :autoplay="true"
                    :controls="false"
                  ></video>
                </div>
                <div class="vid-event-details">
                  <div>
                    <h4>{{ event.eventName }}</h4>
                    <p>0 people attending</p>
                  </div>
                  <div class="d-flex flex-column align-items-end">
                    <span>0 <img src="@/assets/img/like.svg"/></span>
                    <div>
                      <el-button
                        type="secondary"
                        size="small"
                        @click="viewEvent(event.eventRef)"
                        >View</el-button
                      >
                      <el-button
                        type="outline"
                        size="small"
                        @click="manageEvent(event.eventRef)"
                        >Edit</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
      class="loading-dialog"
      :visible="showLoaderDialog"
      :fullscreen="true"
      :show-close="false"
    >
      <div v-loading="fetchingDetails" class="user-id-form">
        <el-form v-if="!idExist" :model="user">
          <h5 class="mb-3">Continue with your UserId</h5>
          <el-row :gutter="30" type="flex" class="flex-wrap">
            <el-col :lg="24"
              ><el-form-item
                v-custom-input="user.userId"
                class="vid-custom-input"
                label="Your User Id"
                prop="user_id"
              >
                <el-input
                  v-model="user.userId"
                  type="text"
                  auto-complete="on"
                  prefix-icon="vid-icon--hash"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <div class="d-flex justify-content-center">
            <el-button type="primary" @click="getUserEvents(user.userId)"
              >Proceed</el-button
            >
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import request from '../../controller/request'
import Navbar from '~/components/Navbar'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  data() {
    return {
      showLoaderDialog: true,
      fetchingDetails: false,
      user: {
        userId: ''
      },
      idExist: false,
      backgroundType: '',
      events: [],
      user_id: '',
      userDetails: '',
      canCreateEvent: false
    }
  },
  computed: {},
  created() {
    const userId = Cookies.get('user_id')
    if (userId) {
      this.idExist = true
      this.getUserEvents(userId)
    }
  },
  methods: {
    setBackgroundType(url) {
      const videoFormat = ['mp4', 'mov', '3gp']
      const imageFormat = ['jpg', 'jpeg', 'png']

      const urlSplit = url.split('.')
      let type = ''

      if (videoFormat.includes(urlSplit[urlSplit - 1])) {
        type = 'video'
      } else if (
        imageFormat.includes(urlSplit[urlSplit - 1]) ||
        url.includes('unsplash')
      ) {
        type = 'image'
      } else if (url.charAt(0) === '#') {
        type = 'color'
      }

      return type
    },
    async generateHashtag(eventName) {
      await request.generateHashtag(eventName).then((response) => {
        if (response.data.success) {
          this.hashtags = response.data.hashtags
        }
      })
    },
    async getUserEvents(userId) {
      if (userId === '') {
        this.$message.error('Please provide UserId!')
      } else {
        this.fetchingDetails = true
        await request
          .listEventsByUser(userId)
          .then((response) => {
            if (response.data.success) {
              const data = response.data
              this.events = data.events
              this.fetchingDetails = false
              this.showLoaderDialog = false
              if (!Cookies.get('user_id')) {
                Cookies.set('user_id', userId)
                Cookies.set('user', data.userInfo)
              }
              this.user_id = userId
              this.userDetails = data.userInfo
              this.canCreateEvent =
                (data.userInfo.isPaid === 0 && data.events.length < 20) ||
                data.userInfo.isPaid
            }
          })
          .catch(() => {
            this.$message.error('An error occurred!')
          })
      }
    },
    createEvent() {
      this.$router.push({ name: 'create' })
    },
    viewEvent(ref) {
      this.$router.push({ name: 'event-eventRef', params: { eventRef: ref } })
    },
    manageEvent(ref) {
      this.$router.push({ name: 'manage-ref', params: { ref } })
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-user-home {
  .vid-header {
    background: #fff;
    padding: 70px 0;

    h1 {
      font-family: 'Quicksand', sans-serif;
      font-weight: 500;
      margin-bottom: 10px;
    }
  }

  .vid-home-body {
    padding: 70px 0;
  }
  .vid-section {
    margin-bottom: 50px;

    h6 {
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

  .vid-event {
    height: 400px;
    width: 100%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;

    .vid-event-banner {
      height: 250px;
      width: 100%;
      background: #222151;
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;

      video {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
      }
    }

    .vid-event-details {
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      > div {
        width: 50%;
      }

      > div:last-child {
        width: 60%;

        span {
          margin-bottom: 8px;
        }

        img {
          height: 14px;
        }
      }

      p {
        font-size: 0.9rem;
        line-height: 1.6;
      }
    }
  }

  .user-id-form {
    width: 100%;
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9fb;
    text-align: center;

    .el-form {
      width: 40%;
    }
  }
}

@media (max-width: 1200px) {
  .user-id-form .el-form {
    width: 100% !important;
  }
}

@media (max-width: 600px) {
  .vid-header {
    text-align: center;
  }
}
</style>
