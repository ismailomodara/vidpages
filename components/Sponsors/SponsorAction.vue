<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="action === 'add' ? 'Add New Sponsor' : 'Update Sponsor Details'"
  >
    <el-row type="flex" :gutter="40">
      <el-col :lg="12">
        <UploadImage :url.sync="newSponsor.event_sponsor_logo" />
      </el-col>
      <el-col :lg="12">
        <el-form :model="newSponsor">
          <el-form-item label="Sponsor" prop="event_sponsor_name">
            <el-input
              v-model="newSponsor.event_sponsor_name"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="d-flex justify-content-end">
          <el-button
            v-if="action === 'add'"
            :loading="addingSponsor"
            type="primary"
            @click="addSponsor"
            >Add</el-button
          >
          <el-button
            v-if="action === 'update'"
            :loading="addingSponsor"
            type="primary"
            @click="updateSponsor"
            >Update</el-button
          >
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import UploadImage from '../UploadImage'
import request from '~/controller/request'

export default {
  name: 'SponsorAction',
  components: {
    UploadImage
  },
  props: {
    action: {
      type: String,
      default: 'add'
    },
    show: Boolean,
    sponsor: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      addingSponsor: false,
      newSponsor: {
        event_sponsor_logo: '',
        event_sponsor_name: '',
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
      this.newSponsor.event_sponsor_name = this.sponsor.eventSponsorName
      this.newSponsor.event_sponsor_logo = this.sponsor.eventSponsorLogo
      this.newSponsor.event_sponsor_ref = this.sponsor.eventSponsorRef
    },
    async addSponsor() {
      this.addingSponsor = true
      this.newSponsor.event_ref = this.$store.state.event.event.eventRef
      await request
        .addSponsor(this.newSponsor)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingSponsor = false
                this.$message.success('New sponsor added!')
              })
              .catch(() => {
                this.addingSponsor = false
              })
          } else {
            this.$message.info(response.message)
            this.addingSponsor = false
            this.showDialog = false
          }
        })
        .catch(() => {
          this.addingSponsor = false
        })
    },
    async updateSponsor() {
      this.addingSponsor = true
      this.newSponsor.event_ref = this.$store.state.event.event.eventRef
      await request
        .addSponsor(this.newSponsor)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingSponsor = false
                this.$message.success('Sponsor details updated!')
              })
              .catch(() => {
                this.addingSponsor = false
              })
          } else {
            this.addingSponsor = false
            this.$message.success('Unable to update at the moment.')
          }
        })
        .catch(() => {
          this.addingSponsor = false
        })
    },
    resetValues() {
      this.newSponsor = {
        event_sponsor_logo: '',
        event_sponsor_name: '',
        event_ref: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
