<template>
  <div>
    <navbar />
    <div class="vid-home">
      <div class="vid-header">
        <div class="container">
          <el-row type="flex" :gutter="40" align="middle">
            <el-col :md="12" class="vid-header-title">
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
                <span>{{ plan.planPrice }}</span>
                <hr />
                <ul>
                  <li v-for="(item, index) in plan.items" :key="index">
                    {{ item.planItem }}
                  </li>
                </ul>
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
          <div>
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
      date: new Date().getFullYear()
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
            this.fetchAllPlans()
          }
        })
        .catch()
    },
    async fetchAllPlans() {
      await request
        .getPlans()
        .then((response) => {
          if (response.data.success) {
            this.plans = response.data.plans
            this.loadingPage = false
          }
        })
        .catch()
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
      min-height: 330px;
      width: 100%;
      border-radius: 10px;
      padding: 50px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
      margin-bottom: 30px;
      text-align: center;
      color: #222151;

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
        }
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
  }
}
</style>
