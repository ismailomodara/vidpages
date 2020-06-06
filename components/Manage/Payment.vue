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
          <div class="d-flex justify-content-between align-items-center mb-5">
            <h6 class="mb-0">Plans</h6>
            <el-button
              v-if="paymentPlans.length"
              size="small"
              type="outline"
              @click="addPlan"
              >Add Plan</el-button
            >
          </div>
          <el-row
            v-if="paymentPlans.length"
            type="flex"
            :gutter="30"
            class="flex-wrap"
          >
            <el-col
              v-for="(plan, index) in paymentPlans"
              :key="index"
              :sm="24"
              :md="12"
            >
              <div class="payment-plan">
                <div>
                  <h4 @click="updatePlan(plan)">{{ plan.eventPlanName }}</h4>
                  <p>{{ plan.eventPlanDetails }}</p>
                </div>
                <h2>{{ plan.eventPlanCurrency }} {{ plan.eventPlanAmount }}</h2>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="!paymentPlans.length" type="flex">
            <el-col :md="24">
              <div class="w-100 text-center">
                <p>You do not have any payment plan</p>
                <el-button size="small" type="outline" @click="addPlan"
                  >Create One</el-button
                >
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="vid-section">
          <h6>Payment Provider</h6>
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
                  :type="publicKeyType"
                  auto-complete="off"
                  prefix-icon="vid-icon--lock"
                >
                  <i
                    slot="suffix"
                    :class="
                      publicKeyType === 'password'
                        ? 'vid-icon--eye'
                        : 'vid-icon--eye-off'
                    "
                    @click="showPublicKey"
                  >
                  </i>
                </el-input> </el-form-item
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
                  :type="secretKeyType"
                  auto-complete="off"
                  prefix-icon="vid-icon--lock"
                  ><i
                    slot="suffix"
                    :class="
                      secretKeyType === 'password'
                        ? 'vid-icon--eye'
                        : 'vid-icon--eye-off'
                    "
                    @click="showSecretKey"
                  >
                  </i
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
    <payment-action
      :action="paymentPlanAction"
      :show.sync="showPaymentPlanAction"
      :payment-plan="paymentPlanToUpdate"
    />
  </div>
</template>

<script>
import request from '../../controller/request'
import { convertCase } from '../../plugins/case-converter'
import PaymentAction from '../Payment/PaymentAction'

// const sha512 = require('js-sha512')

export default {
  name: 'Payment',
  components: {
    PaymentAction
  },
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
      paymentPlans: [],
      responseEvent: {},
      showPaymentPlanAction: false,
      paymentPlanAction: 'add',
      paymentPlanToUpdate: {},
      publicKeyType: 'password',
      secretKeyType: 'password'
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
    showPublicKey() {
      this.publicKeyType =
        this.publicKeyType === 'password' ? 'text' : 'password'
    },
    showSecretKey() {
      this.secretKeyType =
        this.secretKeyType === 'password' ? 'text' : 'password'
    },
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
      this.paymentPlans = this.$store.state.event.plans
    },
    updateEvent() {
      this.loading = true
      // console.log(sha512(this.payment.event_payment_provider_public))
      // await request
      //   .createEvent(this.payment)
      //   .then((response) => {
      //     if (response.data.success) {
      //       this.$store
      //         .dispatch('EVENT', this.$route.params.ref)
      //         .then(() => {
      //           this.$message.success('Payment details updated!')
      //           this.loading = false
      //         })
      //         .catch(() => {
      //           this.loading = false
      //         })
      //     } else {
      //       this.loading = false
      //     }
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    addPlan() {
      this.paymentPlanAction = 'add'
      this.paymentPlanToUpdate = {}
      this.showPaymentPlanAction = true
    },
    updatePlan(plan) {
      this.paymentPlanAction = 'update'
      this.paymentPlanToUpdate = plan
      this.showPaymentPlanAction = true
    }
  }
}
</script>

<style scoped lang="scss">
.vid-payment {
  width: 70%;
  margin: auto;
}

.vid-section-payment-update {
  margin: 30px 0;
  display: flex;
  justify-content: flex-end;
}

.vid-section {
  margin-bottom: 40px;

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

.payment-plan {
  background: #222151;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  color: #fff;
  margin-bottom: 30px;

  > div {
    h4 {
      margin-bottom: 5px;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    p {
      font-size: 0.9rem;
      width: 85%;
      margin-bottom: 0;
    }
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 600;
  }
}
@media (max-width: 600px) {
  .vid-payment {
    width: 100% !important;
  }
}
</style>
