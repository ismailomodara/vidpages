<template>
  <div class="vid-attendees">
    <h5 class="text-center mb-3">All Attendees ({{ allAttendees.length }})</h5>
    <div v-if="allAttendees.length">
      <el-row type="flex" class="flex-wrap">
        <el-col :md="20" class="mx-auto">
          <div class="d-flex justify-content-end mb-3">
            <download-csv :data="formattedAttendeesList" :name="fileName">
              <el-button size="small" type="primary">Download</el-button>
            </download-csv>
          </div>
          <el-table
            v-loading="accepting"
            :data="allAttendees"
            style="width: 100%"
          >
            <el-table-column prop="attendeeEmail" label="Attendee's Email">
            </el-table-column>
            <el-table-column label="Status">
              <template slot-scope="scope">
                <p v-if="scope.row.isApproved">Accepted</p>
                <p v-else-if="scope.row.isRejected">Declined</p>
                <p
                  v-else-if="
                    isRequireManualApproved &&
                      !scope.row.isApproved &&
                      !scope.row.isRejected
                  "
                >
                  Pending
                </p>
              </template>
            </el-table-column>
            <el-table-column width="250">
              <template
                v-if="
                  isRequireManualApproved &&
                    !scope.row.isApproved &&
                    !scope.row.isRejected
                "
                slot-scope="scope"
              >
                <el-button
                  type="outline"
                  size="small"
                  @click="approveAttendee(scope.row.attendeeEmail)"
                  >Accept</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="declineAttendee(scope.row.attendeeEmail)"
                  >Decline</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <EmptyState text="You currently have no attendees"></EmptyState>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import request from '../../controller/request'
import EmptyState from '~/components/EmptyState'

export default {
  name: 'Attendees',
  components: {
    EmptyState
  },
  data() {
    return {
      allAttendees: [],
      attendee: {},
      accepting: false,
      isRequireManualApproved: 0
    }
  },
  computed: {
    event() {
      return this.$store.state.event.event
    },
    attendees() {
      return this.$store.state.event.attendees
    },
    formattedAttendeesList() {
      const attendeesList = []
      let status = ''
      this.allAttendees.forEach((attendee) => {
        if (attendee.isApproved) {
          status = 'Approved'
        } else if (attendee.isRejected) {
          status = 'Declined'
        } else {
          status = 'Pending'
        }
        attendeesList.push({
          Email: attendee.attendeeEmail,
          Status: status
        })
      })
      return attendeesList
    },
    fileName() {
      return `${this.event.eventName.split(' ').join('_')}_${moment().format(
        'DD-MM-YY'
      )}.csv`
    }
  },
  watch: {
    attendees() {
      this.allAttendees = this.attendees
      this.isRequireManualApproved = this.event.requireManualApproval
    }
  },

  methods: {
    async approveAttendee(attendeeEmail) {
      this.accepting = true
      this.attendee.event_ref = this.$store.state.event.event.eventRef
      this.attendee.attendee_email = attendeeEmail
      this.attendee.is_approved = 1
      this.attendee.is_rejected = 0
      await request
        .approveAttendee(this.attendee)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.accepting = false
                this.$message.success('Accepted')
                this.attendee = {}
              })
              .catch(() => {
                this.attendee = {}
                this.accepting = false
              })
          } else {
            this.$message.info(response.message)
            this.attendee = {}
            this.accepting = false
          }
        })
        .catch(() => {
          this.accepting = false
        })
    },
    async declineAttendee(attendeeEmail) {
      this.attendee.event_ref = this.$store.state.event.event.eventRef
      this.attendee.attendee_email = attendeeEmail
      this.attendee.is_approved = 0
      this.attendee.is_rejected = 1
      this.accepting = true
      await request
        .approveAttendee(this.attendee)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.accepting = false
                this.attendee = {}
                this.$message.success('Declined')
              })
              .catch(() => {
                this.accepting = false
              })
          } else {
            this.$message.info(response.message)
            this.attendee = {}
            this.accepting = false
          }
        })
        .catch(() => {
          this.accepting = false
          this.attendee = {}
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
