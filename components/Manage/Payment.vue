<template>
  <div class="vid-payment">
    <div class="container">
      <el-form
        ref="payment"
        :model="payment"
        label-position="top"
        class="vid-event-form"
      >
        <div class="vid-section">
          <el-row type="flex" :gutter="40">
            <el-col :lg="24"
              ><el-form-item
                v-custom-input="payment.event_payment_provider"
                class="vid-custom-input"
                label="Payment Provider"
                prop="event_payment_provider"
              >
                <el-select
                  v-model="payment.event_payment_provider"
                  placeholder=""
                >
                  <template slot="prefix">
                    <i class="vid-icon--credit-card exp"></i>
                  </template>
                  <el-option
                    v-for="(provider, index) in paymentProviders"
                    :key="index"
                    :label="provider.provider"
                    :value="provider.providerRef.split('-')[1].toLowerCase()"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>
          </el-row>
          <el-row type="flex" :gutter="40">
            <el-col :lg="24"
              ><el-form-item
                v-custom-input="payment.event_payment_provider_public"
                class="vid-custom-input"
                label="Public Key"
                prop="event_payment_provider"
              >
                <el-input
                  v-model="payment.event_payment_provider_public"
                  type="text"
                  auto-complete="off"
                  prefix-icon="vid-icon--lock"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row type="flex" :gutter="40">
            <el-col :lg="24"
              ><el-form-item
                v-custom-input="payment.event_payment_provider_secret"
                class="vid-custom-input"
                label="Secret Key"
                prop="event_payment_provider_secret"
              >
                <el-input
                  v-model="payment.event_payment_provider_secret"
                  type="text"
                  auto-complete="off"
                  prefix-icon="vid-icon--lock"
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
        </div>
        <div class="vid-section-payment-update">
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="updateEvent"
            >Update</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from '../../controller/request'
import { convertCase } from '../../plugins/case-converter'

export default {
  name: 'Payment',
  components: {},
  data() {
    return {
      loading: false,
      paymentProviders: [],
      payment: {
        user_id: '',
        event_payment_provider: '',
        event_payment_provider_public: '',
        event_payment_provider_secret: ''
      },
      responseEvent: {}
    }
  },
  computed: {
    event() {
      return this.$store.state.event.event
    }
  },
  watch: {
    event() {
      this.setEventValues()
    }
  },
  created() {
    this.fetchAllPaymentProviders()
  },
  methods: {
    async fetchAllPaymentProviders() {
      await request
        .getPaymentProviders()
        .then((response) => {
          if (response.data.success) {
            this.paymentProviders = response.data.providers
          }
        })
        .catch()
    },
    async setEventValues() {
      const responseEvent = await this.$store.state.event.event
      for (const key in responseEvent) {
        const convertedKey = convertCase(key)
        this.responseEvent[convertedKey] = responseEvent[key]
      }

      this.payment = { ...this.responseEvent }
    },
    async updateEvent() {
      this.loading = true
      await request
        .createEvent(this.payment)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.$message.success('Payment details updated!')
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
.vid-payment {
  width: 70%;
  margin: auto;
}

.vid-section-payment-update {
  margin: 30px 0;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 600px) {
  .vid-payment {
    width: 100% !important;
  }
}
</style>
