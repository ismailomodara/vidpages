<template>
  <div>
    <navbar />
    <div class="vid-home">
      <div class="vid-header">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :md="12" class="vid-header-title">
              <div class="home-snackbar">
                <a :href="notification.link" target="_blank"></a>
                <span class="icon">INFO</span>
                <span class="text">{{ notification.notification }}...</span>
                <span class="learn-more">Learn more</span>
              </div>
              <h2>Create video based events in minutes</h2>
              <div>
                <el-button type="primary" @click="goToZoom"
                  >Use A Video Platform</el-button
                >
                <el-button
                  type="white"
                  class="ml-4"
                  @click="
                    $router.push({ name: 'create', params: { type: 'new' } })
                  "
                  >Continue as a Guest</el-button
                >
              </div>
            </el-col>
            <el-col :md="12">
              <div class="illustration">
                <img src="@/assets/img/schedule-illustration.svg" alt />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <section class="vid-feature">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :sm="24" :lg="12" class="d-flex justify-content-center">
              <img src="@/assets/img/time-management.svg" alt />
            </el-col>
            <el-col :sm="24" :lg="12">
              <h3>Fast and easy</h3>
              <p>
                Quickly create a website to promote your virtual event.
              </p>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="vid-feature">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :lg="12">
              <h3>Share</h3>
              <p>
                Share your link on social media without letting trolls in.
                Configure your event to require RSVP and manual approval.
              </p>
            </el-col>
            <el-col :lg="12" class="d-flex justify-content-center">
              <img src="@/assets/img/rsvp.svg" alt />
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="vid-feature">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :lg="12" class="d-flex justify-content-center">
              <img src="@/assets/img/interactive.svg" alt />
            </el-col>
            <el-col :lg="12">
              <h3>Make Money for Hosting Events.</h3>
              <p>
                Make money with tip donations or charge for event entry. Guests
                receive access information after payment.
              </p>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="vid-pricing">
        <div class="container">
          <el-row type="flex" :gutter="40" class="mb-5">
            <el-col :lg="24">
              <h3>Our Pricing Plans</h3>
              <p>Select the plan that best suits your needs.</p>
            </el-col>
          </el-row>
          <el-row type="flex" :gutter="30" class="flex-wrap">
            <el-col
              v-for="(plan, index) in plans"
              :key="index"
              :sm="18"
              :md="12"
              :lg="8"
              class="mx-auto"
            >
              <div class="vid-plan" :class="{ inverse: index % 2 !== 0 }">
                <h6>{{ plan.planName }}</h6>
                <span>{{
                  plan.planPrice === ''
                    ? 'Free'
                    : `${plan.currency}${plan.planPrice}`
                }}</span>
                <hr />
                <ul>
                  <li v-for="(item, index) in plan.items" :key="index">
                    {{ item.planItem }}
                  </li>
                </ul>
                <div v-if="plan.planPrice" @click="LoadSaasble(plan.planRef)">
                  <el-button type="primary" size="small">Try out</el-button>
                </div>
                <div v-else>
                  <nuxt-link :to="{ name: 'create' }"
                    ><el-button type="primary" size="small"
                      >Try out</el-button
                    ></nuxt-link
                  >
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="vid-cta">
        <div class="container">
          <div>
            <h4>Start creating events today!</h4>
            <div>
              <el-button type="primary">Use A Video Platform</el-button>
              <el-button type="white" @click="$router.push({ name: 'create' })"
                >Continue as a Guest</el-button
              >
            </div>
          </div>
          <hr />
          <div class="footer">
            <div class="footer-links">
              <a :href="privacy_policy" target="_blank">Privacy policy</a>
              <a :href="terms" target="_blank">Terms of Use</a>
            </div>
            <p>copyright © {{ date }} - Vidrl. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
    <el-dialog
      v-loading="loadingPage"
      class="loading-dialog"
      :visible="loadingPage"
      :fullscreen="true"
      :show-close="false"
    ></el-dialog>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  name: 'Index',
  components: {
    Navbar
  },
  data() {
    return {
      loadingPage: true,
      plans: [],
      videoProviders: [],
      notification: {},
      date: new Date().getFullYear(),
      privacy_policy:
        'https://www.notion.so/Privacy-Policy-a582331d4ffa4379af01ff06e32638f9',
      terms:
        'https://www.notion.so/Terms-of-Use-96207288ffbd46178dc9420ce43e0545'
    }
  },
  computed: {},
  created() {
    this.fetchAllVideoProviders()
  },
  methods: {
    fetchAllVideoProviders() {
      setTimeout(() => {
        this.videoProviders = [
          {
            provider: 'zoom',
            oauthUrl: 'https://zoom.com'
          }
        ]
        this.loadingPage = false
      }, 1500)
    },
    goToZoom() {
      window.location.href = 'https://zoom.com'
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-home {
  section {
    padding: 100px 0;
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
    height: calc(100vh - 80px);
    background: #222151;
    position: relative;
    display: flex;

    .container {
      position: relative;
      height: 100%;
      z-index: 2;

      .el-row {
        height: 100%;
      }

      .vid-header-title {
        color: #fff;

        .home-snackbar {
          height: auto;
          padding: 15px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          color: #fff;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 15px;
          width: 85%;
          position: relative;
          font-size: 0.9rem;

          .learn-more {
            text-decoration: underline;
          }

          a {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            color: #fff;
          }

          .icon {
            height: 100%;
            padding: 5px 10px;
            font-size: 0.75rem;
            border-radius: 5px;
            background: #7733f4;
            color: #fff;
            margin-right: 10px;
          }
        }

        h2 {
          font-size: 3rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
      }

      .illustration {
        height: 100%;
        width: 100%;
        text-align: center;

        img {
          height: 400px;
          width: auto;
        }
      }
    }
  }

  .vid-feature {
    background: #fff;

    h3 {
      font-weight: 500;
      margin-bottom: 20px;
      line-height: 1.5;
      color: #222151;
    }

    p {
      font-size: 1rem;
      opacity: 0.6;
      line-height: 1.8;
    }

    img {
      height: 200px;
      width: auto;
    }
  }

  .vid-pricing {
    h3 {
      font-weight: 500;
      margin-bottom: 10px;
      line-height: 1.5;
      color: #222151;
    }

    p {
      font-size: 1rem;
      opacity: 0.6;
      line-height: 1.8;
    }

    .vid-plan {
      background: #fff;
      min-height: 550px;
      width: 100%;
      border-radius: 10px;
      padding: 50px 30px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
      margin-bottom: 30px;
      text-align: center;
      color: #222151;
      position: relative;

      h6 {
        font-weight: 500;
        margin-bottom: 5px;
        font-size: 0.8rem;
        text-transform: uppercase;
      }

      span {
        font-size: 2.5rem;
        font-weight: 500;
      }

      &.inverse {
        background: #222151;
        color: #f9f9fb;

        hr {
          border-color: rgba(255, 255, 255, 0.1);
        }
      }

      ul {
        li {
          padding: 10px 0;
          text-align: left;
          font-size: 0.9rem;
        }
      }

      > div:last-child {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 50px;
      }
    }
  }

  .vid-cta {
    background: #222151;
    color: #fff;

    hr {
      margin-bottom: 40px;
    }

    .container > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      h4 {
        color: #fff;
        margin-bottom: 20px;
      }

      p {
        opacity: 0.5;
      }
    }

    .footer {
      flex-direction: row !important;
      align-items: center;
      justify-content: space-between !important;
      width: 100%;
      margin: auto;

      p {
        margin-bottom: 0;
      }

      .footer-links {
        display: flex;

        a {
          color: #fff;
          margin-right: 20px;
          font-size: 0.9rem;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  section {
    padding: 60px 30px !important;
  }
  .vid-header {
    .el-row {
      justify-content: center;
      flex-direction: column;
    }

    .vid-header-title {
      text-align: center;
      width: 80%;
      margin-bottom: 70px;
    }
  }
}

@media (max-width: 600px) {
  section {
    padding: 40px 15px !important;
  }

  .home-snackbar {
    width: 100% !important;
    flex-direction: column;
  }

  .vid-header {
    .el-row {
      flex-direction: column-reverse;
    }

    .illustration img {
      height: 200px !important;
    }

    .vid-header-title {
      h2 {
        font-size: 1.8rem !important;
      }

      > div > button {
        margin-left: 0 !important;
        margin-top: 12px;
      }
    }
  }
  .vid-feature {
    text-align: center;

    .el-row {
      flex-direction: column;
    }

    img {
      height: 120px !important;
      margin-bottom: 15px;
    }
  }

  .vid-cta {
    text-align: center;

    .el-button {
      margin-bottom: 10px;
    }

    .footer {
      flex-direction: column !important;

      .footer-links {
        margin-bottom: 20px;
      }

      p {
        line-height: 1.6;
        width: 60%;
      }
    }
  }
}
</style>
