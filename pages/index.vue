<template>
  <div>
    <navbar />
    <div class="vid-home">
      <div v-if="videoProviders.length" class="vid-header">
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
                <el-dropdown>
                  <el-button type="primary">Use A Video Platform</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(provider, index) in videoProviders"
                      :key="index"
                      ><a :href="provider.oauthUrl">{{ provider.provider }}</a>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
              <h3>Time management</h3>
              <p>
                A detailed description of what feature one is about and what
                makes the product unique from others.
              </p>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="vid-feature">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :lg="12">
              <h3>Create RSVP Events</h3>
              <p>
                A detailed description of what feature one is about and what
                makes the product unique from others.
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
              <h3>Video Session</h3>
              <p>
                A detailed description of what feature one is about and what
                makes the product unique from others.
              </p>
            </el-col>
          </el-row>
        </div>
      </section>
      <section class="vid-feature">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :lg="12">
              <h3>Events Gallery</h3>
              <p>
                A detailed description of what feature one is about and what
                makes the product unique from others.
              </p>
            </el-col>
            <el-col :lg="12" class="d-flex justify-content-center">
              <img src="@/assets/img/gallery.svg" alt />
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
                <span>{{ plan.currency }}{{ plan.planPrice || 0 }}</span>
                <hr />
                <ul>
                  <li v-for="(item, index) in plan.items" :key="index">
                    {{ item.planItem }}
                  </li>
                </ul>
                <div id="saasble_subscription">
                  <el-button type="primary" size="small">Try out</el-button>
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
              <el-dropdown>
                <el-button type="primary">Use A Video Platform</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(provider, index) in videoProviders"
                    :key="index"
                    ><a :href="provider.oauthUrl">{{ provider.provider }}</a>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
import request from '../controller/request'
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
    async fetchAllVideoProviders() {
      await request
        .getVideoProviders()
        .then((response) => {
          if (response.data.success) {
            this.videoProviders = response.data.providers
            this.notification = response.data.notification
            this.getIp()
          }
        })
        .catch()
    },
    getIp() {
      fetch('https://api.ipify.org?format=json')
        .then((x) => x.json())
        .then(({ ip }) => {
          this.fetchAllPlans(ip)
        })
    },
    async fetchAllPlans(ip) {
      await request
        .getPlans(ip)
        .then((response) => {
          if (response.data.success) {
            this.plans = response.data.plans
            this.loadingPage = false
          }
        })
        .catch()
    }
  },
  head() {
    return {
      script: [
        {
          src:
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'
        },
        {
          innerHTML: `!function(){if(window.sassblesubscription&&window.sassblesubscription.created)window.console&&console.error&&console.error("Saasble snippet included twice.")\n else{window.sassblesubscription={created:!0}\n var a=document.createElement("script")\n a.src="https://dashboard.saasble.com/dist/sub_mod.js"\n a.async=!0\n var b=document.getElementsByTagName("script")[0]\n b.parentNode.insertBefore(a,b),window.sassblesubscription.params = {secret: "738ea4f7-0dc0-41fa-b40e-fdf09f39c6c9", customer_oid: "<example_customer_123>" ,customer_email: "<example_customer_123>", provider_oid: "<example_customer_123>" ,plan_id: "<plan_123>" }}}()`,
          type: 'text/javascript',
          body: true,
          defer: true
        }
      ]
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
