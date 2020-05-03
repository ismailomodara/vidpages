<template>
  <el-dialog
    @click="resetValues"
    width="40%"
    :visible.sync="showDialog"
    :title="action === 'add' ? 'Add New Schedule' : 'Update Schedule Details'"
  >
    <el-form :model="newSchedule">
      <el-row type="flex">
        <el-col :lg="24">
          <el-form-item label="Schedule Item" prop="event_schedule_name">
            <el-input
              v-model="newSchedule.event_schedule_item"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="30">
        <el-col :lg="12">
          <el-form-item label="Day" prop="event_schedule_day">
            <el-input
              v-model="newSchedule.event_schedule_day"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item label="Time" prop="event_schedule_time">
            <el-time-select
              v-model="newSchedule.event_schedule_time"
              :clearable="false"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '23:00'
              }"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="d-flex justify-content-end">
      <el-button
        v-if="action === 'add'"
        :loading="addingSchedule"
        type="primary"
        @click="addSchedule"
        >Add</el-button
      >
      <el-button
        v-if="action === 'update'"
        :loading="addingSchedule"
        type="primary"
        @click="updateSchedule"
        >Update</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import request from '~/controller/request'

export default {
  name: 'ScheduleAction',
  components: {},
  props: {
    action: {
      type: String,
      default: 'add'
    },
    show: Boolean,
    schedule: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      addingSchedule: false,
      newSchedule: {
        event_schedule_item: '',
        event_schedule_day: '',
        event_schedule_time: '',
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
      this.newSchedule.event_schedule_item = this.schedule.eventScheduleItem
      this.newSchedule.event_schedule_day = this.schedule.eventScheduleDay
      this.newSchedule.event_schedule_time = this.schedule.eventScheduleTime
      this.newSchedule.event_schedule_ref = this.schedule.eventScheduleRef
    },
    async addSchedule() {
      this.addingSchedule = true
      this.newSchedule.event_ref = this.$store.state.event.event.eventRef
      await request
        .addSchedule(this.newSchedule)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingSchedule = false
                this.$message.success('New schedule added!')
              })
              .catch(() => {
                this.addingSchedule = false
              })
          } else {
            this.$message.info(response.message)
            this.addingSchedule = false
            this.showDialog = false
          }
        })
        .catch(() => {
          this.addingSchedule = false
        })
    },
    async updateSchedule() {
      this.addingSchedule = true
      this.newSchedule.event_ref = this.$store.state.event.event.eventRef
      await request
        .addSchedule(this.newSchedule)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingSchedule = false
                this.$message.success('Schedule details updated!')
              })
              .catch(() => {
                this.$message.error('Something went wrong!')
                this.addingSchedule = false
              })
          } else {
            this.addingSchedule = false
          }
        })
        .catch(() => {
          this.addingSchedule = false
        })
    },
    resetValues() {
      this.newSchedule = {
        event_schedule_item: '',
        event_schedule_day: '',
        event_schedule_time: '',
        event_ref: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
