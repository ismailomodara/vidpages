<template>
  <div class="vid-attendees">
    <h5 class="text-center mb-3">All Attendees ({{ allAttendees.length }})</h5>
    <div v-if="allAttendees.length">
      <el-row type="flex" class="flex-wrap">
        <el-col :md="20" class="mx-auto">
          <div class="d-flex justify-content-end mb-3">
            <div>
              <el-tooltip
                v-if="!isPaid"
                effect="dark"
                content="For paid users only"
                placement="left-start"
              >
                <el-button size="small" type="outline" class="mr-2"
                  >Message</el-button
                >
              </el-tooltip>
              <el-button
                v-else
                size="small"
                type="outline"
                class="mr-2"
                @click="showMessageDialog = true"
                >Message</el-button
              >
            </div>
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
    <el-dialog
      title="Send attendees message"
      :visible.sync="showMessageDialog"
      width="33"
    >
      <el-form ref="messageForm" :model="message" class="message-form">
        <el-row type="flex" justify="center">
          <el-col :md="24">
            <el-form-item label="Event">
              <el-input v-model="eventName" disabled type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :md="24">
            <el-form-item prop="message" label="Your message">
              <el-input v-model="message.message" type="textarea" rows="5" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="d-flex justify-content-center my-3">
          <el-button type="primary" :loading="sending" @click="sendMessage"
            >Send message</el-button
          >
        </div>
      </el-form>
    </el-dialog>
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
      isRequireManualApproved: 0,
      showMessageDialog: false,
      eventName: '',
      message: {
        event_ref: '',
        message: ''
      },
      sending: false
    }
  },
  computed: {
    event() {
      return this.$store.state.event.event
    },
    isPaid() {
      return this.$store.state.event.userInfo.isPaid
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
      this.eventName = this.event.eventName
      this.message.event_ref = this.event.eventRef
      this.isRequireManualApproved = this.event.requireManualApproval
    }
  },

  methods: {
    async sendMessage() {
      this.sending = true
      await request
        .messageAttendees(this.message)
        .then((response) => {
          if (response.data.success) {
            this.sending = false
            this.$refs.messageForm.resetFields()
            this.showMessageDialog = false
            this.$message.success('Message sent')
          } else {
            this.$message.error('Message not sent')
            this.sending = false
          }
        })
        .catch(() => {
          this.showMessageDialog = false
          this.$refs.messageForm.resetFields()
          this.sending = false
        })
    },
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

<style lang="scss" scoped>
.message-form {
  width: 80%;
  margin: auto;
}
</style>
