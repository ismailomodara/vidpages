<template>
  <div class="vid-schedules">
    <div class="d-flex justify-content-center align-items-center mb-4">
      <h5 class="text-center mr-3">
        All Schedules ({{ allSchedules.length }})
      </h5>
      <el-button
        v-if="allSchedules.length"
        type="outline"
        size="small"
        @click="addSchedule"
        >Add New</el-button
      >
    </div>
    <div v-if="allSchedules.length">
      <el-row type="flex" :gutter="30" class="flex-wrap">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in allSchedules"
            :key="index"
            :timestamp="`DAY ${item.eventScheduleDay}`"
            placement="top"
          >
            <el-card>
              <div>
                <h4>{{ item.eventScheduleItem }}</h4>
                <p>This event is scheduled for {{ item.eventScheduleTime }}</p>
              </div>
              <el-button
                size="small"
                type="outline"
                @click="updateSchedule(item)"
                >Update</el-button
              >
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-row>
    </div>
    <div v-else>
      <EmptyState text="You currently have no schedules">
        <el-button type="primary" @click="addSchedule">Add Schedule</el-button>
      </EmptyState>
    </div>
    <schedule-action
      :action="scheduleAction"
      :show.sync="showScheduleAction"
      :schedule.sync="scheduleToUpdate"
    />
  </div>
</template>

<script>
import EmptyState from '~/components/EmptyState'
import ScheduleAction from '~/components/Schedules/ScheduleAction'

export default {
  name: 'Schedules',
  components: {
    EmptyState,
    ScheduleAction
  },
  data() {
    return {
      allSchedules: this.$store.state.event.schedule || [],
      showScheduleAction: false,
      scheduleAction: 'add',
      scheduleToUpdate: {}
    }
  },
  computed: {
    schedule() {
      return this.$store.state.event.schedule
    }
  },
  watch: {
    schedule() {
      this.allSchedules = this.schedule
    }
  },

  methods: {
    addSchedule() {
      this.scheduleAction = 'add'
      this.scheduleToUpdate = {}
      this.showScheduleAction = true
    },
    updateSchedule(schedule) {
      this.scheduleAction = 'update'
      this.scheduleToUpdate = schedule
      this.showScheduleAction = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-timeline {
  width: 100%;

  .el-timeline-item {
    width: calc(50% - 40px);
    margin-bottom: 30px;
  }
}

@media (max-width: 1024px) {
  .el-timeline {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
