<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="action === 'add' ? 'Add New Speaker' : 'Update Speaker Details'"
    @close="resetValues"
  >
    <el-row type="flex" :gutter="40">
      <el-col :lg="12">
        <UploadImage :url.sync="newSpeaker.event_speaker_image" />
      </el-col>
      <el-col :lg="12">
        <el-form :model="newSpeaker">
          <el-form-item label="Speaker" prop="event_speaker_name">
            <el-input
              v-model="newSpeaker.event_speaker_name"
              type="text"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="d-flex justify-content-end">
          <el-button
            v-if="action === 'add'"
            :loading="addingSpeaker"
            type="primary"
            @click="addSpeaker"
            >Add</el-button
          >
          <el-button
            v-if="action === 'update'"
            :loading="addingSpeaker"
            type="primary"
            @click="updateSpeaker"
            >Update</el-button
          >
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import UploadImage from '../UploadImage'
import request from '../../controller/request'

export default {
  name: 'SpeakerAction',
  components: {
    UploadImage
  },
  props: {
    action: {
      type: String,
      default: 'add'
    },
    show: Boolean,
    speaker: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      addingSpeaker: false,
      newSpeaker: {
        event_speaker_image: '',
        event_speaker_name: '',
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
      this.newSpeaker.event_speaker_name = this.speaker.eventSpeakerName
      this.newSpeaker.event_speaker_image = this.speaker.eventSpeakerImage
      this.newSpeaker.event_speaker_ref = this.speaker.eventSpeakerRef
    },
    async addSpeaker() {
      this.addingSpeaker = true
      this.newSpeaker.event_ref = this.$store.state.event.event.eventRef
      await request
        .addSpeaker(this.newSpeaker)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingSpeaker = false
                this.$message.success('New speaker added!')
              })
              .catch(() => {
                this.addingSpeaker = false
              })
          }
        })
        .catch(() => {
          this.addingSpeaker = false
        })
    },
    async updateSpeaker() {
      this.addingSpeaker = true
      this.newSpeaker.event_ref = this.$store.state.event.event.eventRef
      await request
        .addSpeaker(this.newSpeaker)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingSpeaker = false
                this.$message.success('Speaker details updated!')
              })
              .catch(() => {
                this.addingSpeaker = false
              })
          } else {
            this.addingSpeaker = false
          }
        })
        .catch(() => {
          this.addingSpeaker = false
        })
    },
    resetValues() {
      this.newSpeaker = {
        event_speaker_image: '',
        event_speaker_name: '',
        event_ref: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
