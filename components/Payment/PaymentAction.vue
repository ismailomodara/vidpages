<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="action === 'add' ? 'Add New Plan' : 'Update Plan Details'"
    width="40%"
    @close="resetValues"
  >
    <el-form :model="newPaymentPlan">
      <el-row type="flex" class="flex-wrap">
        <el-col :sm="24" :md="24">
          <el-form-item label="Plan Name" prop="plan_name">
            <el-input
              v-model="newPaymentPlan.plan_name"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="flex-wrap" :gutter="30">
        <el-col :sm="24" :md="12">
          <el-form-item v-only-number label="Amount" prop="plan_amount">
            <el-input
              v-model="newPaymentPlan.plan_amount"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12">
          <el-form-item label="Currency" prop="plan_currency">
            <el-input
              v-model="newPaymentPlan.plan_currency"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="flex-wrap" :gutter="30">
        <el-col :sm="24" :md="24">
          <el-form-item label="Description" prop="plan_details">
            <el-input
              v-model="newPaymentPlan.plan_details"
              type="textarea"
              rows="5"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="d-flex justify-content-end">
      <el-button
        v-if="action === 'add'"
        :loading="addingPlan"
        type="primary"
        @click="addPaymentPlan"
        >Add</el-button
      >
      <el-button
        v-if="action === 'update'"
        :loading="addingPlan"
        type="primary"
        @click="updatePaymentPlan"
        >Update</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import request from '../../controller/request'

export default {
  name: 'PaymentPlanAction',
  props: {
    action: {
      type: String,
      default: 'add'
    },
    show: Boolean,
    paymentPlan: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      addingPlan: false,
      newPaymentPlan: {
        plan_amount: '',
        plan_details: '',
        plan_name: '',
        plan_currency: '',
        event_ref: ''
      }
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
    }
  },
  watch: {
    show() {
      if (this.show && this.action === 'update') {
        this.setValues()
      }
    }
  },
  methods: {
    setValues() {
      this.newPaymentPlan.plan_amount = this.paymentPlan.eventPlanAmount
      this.newPaymentPlan.plan_details = this.paymentPlan.eventPlanDetails
      this.newPaymentPlan.plan_name = this.paymentPlan.eventPlanName
      this.newPaymentPlan.plan_currency = this.paymentPlan.eventPlanCurrency
      this.newPaymentPlan.plan_ref = this.paymentPlan.eventPlanRef
    },
    async addPaymentPlan() {
      this.addingPlan = true
      this.newPaymentPlan.event_ref = this.$store.state.event.event.eventRef
      await request
        .createPlan(this.newPaymentPlan)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingPlan = false
                this.$message.success('New payment plan added!')
              })
              .catch(() => {
                this.addingPlan = false
              })
          } else {
            this.addingPlan = false
          }
        })
        .catch(() => {
          this.addingPlan = false
        })
    },
    async updatePaymentPlan() {
      this.addingPlan = true
      this.newPaymentPlan.event_ref = this.$store.state.event.event.eventRef
      await request
        .updatePaymentPlan(this.newPaymentPlan)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingPlan = false
                this.$message.success('Payment Plan details updated!')
              })
              .catch(() => {
                this.addingPlan = false
              })
          } else {
            this.addingPlan = false
          }
        })
        .catch(() => {
          this.addingPlan = false
        })
    },
    resetValues() {
      this.newPaymentPlan = {
        plan_amount: '',
        plan_details: '',
        plan_name: '',
        plan_ref: '',
        plan_currency: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
