<template>
  <div class="vid-manage">
    <div id="saasble_subscription">
      <i class="vid-icon--credit-card"></i>
    </div>
    <navbar :inverse="true" />
    <div class="vid-event-summary">
      <h1>{{ eventName }}</h1>
      <el-row type="flex" justify="center">
        <el-col :md="16" :sm="24" class="mx-auto">
          <el-input v-model="eventPublicUrl" class="mb-2" readonly> </el-input>
        </el-col>
      </el-row>
      <div>
        <a
          :href="eventPublicUrl"
          class="el-button el-button--primary"
          target="_blank"
          >Visit</a
        >
        <el-button type="outline" @click="copyUrl">Copy</el-button>
      </div>
    </div>
    <div class="vid-manage-nav">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="setActiveIndex"
      >
        <el-menu-item index="update">Edit</el-menu-item>
        <el-menu-item index="attendees">Attendees</el-menu-item>
        <el-menu-item index="speakers">Speakers</el-menu-item>
        <el-menu-item index="sponsors">Sponsors</el-menu-item>
        <el-menu-item index="schedule">Schedule</el-menu-item>
        <el-menu-item index="questions">Questions</el-menu-item>
        <el-menu-item index="gallery">Gallery</el-menu-item>
        <el-menu-item :disabled="!canIntegrate" @click="goToIntegration"
          >Integrations</el-menu-item
        >
        <el-menu-item :disabled="!showPayment" index="payment"
          >Payment</el-menu-item
        >
      </el-menu>
    </div>
    <div class="vid-manage-body">
      <div class="container">
        <UpdateEvent v-show="activeIndex === 'update'" />
        <Attendees v-show="activeIndex === 'attendees'" />
        <Speakers v-show="activeIndex === 'speakers'" />
        <Sponsors v-show="activeIndex === 'sponsors'" />
        <Schedules v-show="activeIndex === 'schedule'" />
        <Question v-show="activeIndex === 'questions'" />
        <Gallery v-show="activeIndex === 'gallery'" />
        <Payment v-show="activeIndex === 'payment'" />
      </div>
    </div>
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
import Cookies from 'js-cookie'
import Navbar from '~/components/Navbar'
import UpdateEvent from '~/components/Manage/UpdateEvent'
import Attendees from '~/components/Manage/Attendees'
import Speakers from '~/components/Manage/Speakers'
import Sponsors from '~/components/Manage/Sponsors'
import Schedules from '~/components/Manage/Schedules'
import Question from '~/components/Manage/Questions'
import Gallery from '~/components/Manage/Gallery'
import Payment from '~/components/Manage/Payment'

export default {
  name: 'Manage',
  components: {
    Navbar,
    UpdateEvent,
    Attendees,
    Speakers,
    Sponsors,
    Schedules,
    Question,
    Gallery,
    Payment
  },
  data() {
    return {
      showLoaderDialog: true,
      activeIndex: 'update',
      loading: false,
      eventName: '',
      eventPublicUrl: '',
      eventRef: '',
      showPayment: false,
      canIntegrate: false
    }
  },
  computed: {
    coverImage() {
      return this.backgroundUrl && this.backgroundUrl.charAt(0) === '#'
        ? 'color'
        : 'others'
    }
  },
  created() {
    const param = this.$route.params
    if ((param.ref && Cookies.get('user_id')) || (param.ref && param.from)) {
      this.getEvent()
    } else {
      this.$router.push({ name: 'home' })
    }
  },
  methods: {
    getEvent() {
      this.$store
        .dispatch('EVENT', this.$route.params.ref)
        .then((response) => {
          this.eventName = response.event.eventName
          this.eventPublicUrl = response.event.eventPublicUrl
          this.eventRef = response.event.eventRef
          this.showPayment =
            (response.userInfo.allocations === 'unlimited' &&
              response.userInfo.isPaid === 1) ||
            (response.userInfo.isPaid === 0 &&
              response.userInfo.allocations < 2)
          this.canIntegrate = response.userInfo.allocations === 'unlimited'
          if (!Cookies.get('user_id')) {
            Cookies.set('user_id', response.event.userId.userId)
          }
          this.showLoaderDialog = false
        })
        .catch(() => {
          this.$router.push({ name: 'index' })
          this.showLoaderDialog = false
        })
    },
    goToIntegration() {
      window.location.href =
        'https://www.notion.so/Integrations-351752c9f1a84f23bfecdf640407fa70'
    },
    copyUrl() {
      const link = document.querySelector('.vid-event-summary .el-input__inner')
      /* Select the text field */
      link.select()
      link.setSelectionRange(0, 99999)

      document.execCommand('copy')

      this.$message({
        message: 'Url copied',
        type: 'success'
      })
    },
    setActiveIndex(index) {
      this.activeIndex = index
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
.vid-manage {
  #saasble_subscription i {
    position: absolute;
    right: 50px;
    top: 20px;
    font-size: 2rem;
    color: #fff;
  }

  .vid-event-summary {
    padding: 80px;
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;

    > * {
      width: 50%;
      margin: auto;
    }

    h1 {
      font-size: 4.5rem;
      font-family: 'Avenir', sans-serif;
      font-weight: 600;
    }
  }

  .vid-manage-nav {
    background: #fff;

    .el-menu {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
  }

  .vid-manage-body {
    background: #f9f9fb;
    padding: 60px 0;
  }
}

@media (max-width: 1024px) {
  .vid-event-summary > * {
    width: 70% !important;
  }
}

@media (max-width: 600px) {
  .vid-manage {
    .vid-event-summary {
      height: 250px;
      padding: 20px;

      > * {
        width: 100% !important;
      }

      h1 {
        font-size: 2rem;
        margin-bottom: 0;
      }
    }
    .el-menu {
      justify-content: flex-start !important;
      overflow-x: scroll;

      text-align: center;
    }
  }
}
</style>
