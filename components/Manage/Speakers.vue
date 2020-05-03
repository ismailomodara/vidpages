<template>
  <div class="vid-speakers">
    <div class="d-flex justify-content-center align-items-center mb-4">
      <h5 class="text-center mr-3">All Speakers ({{ allSpeakers.length }})</h5>
      <el-button
        v-if="allSpeakers.length"
        type="outline"
        size="small"
        @click="addSpeaker"
        >Add New</el-button
      >
    </div>
    <div v-if="allSpeakers.length">
      <el-row type="flex" :gutter="30" class="flex-wrap">
        <el-col
          v-for="(speaker, index) in allSpeakers"
          :key="index"
          :sm="12"
          :md="12"
        >
          <speaker-card :speaker="speaker">
            <el-button
              size="small"
              type="outline"
              @click="updateSpeaker(speaker)"
              >Edit</el-button
            >
          </speaker-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <EmptyState text="You currently have no speakers">
        <el-button type="primary" @click="addSpeaker">Add Speaker</el-button>
      </EmptyState>
    </div>
    <speaker-action
      :action="speakerAction"
      :show.sync="showSpeakerAction"
      :speaker.sync="speakerToUpdate"
    />
  </div>
</template>

<script>
import EmptyState from '~/components/EmptyState'
import SpeakerAction from '~/components/Speakers/SpeakerAction'
import SpeakerCard from '~/components/Speakers/SpeakerCard'

export default {
  name: 'Speakers',
  components: {
    EmptyState,
    SpeakerAction,
    SpeakerCard
  },
  data() {
    return {
      allSpeakers: [],
      showSpeakerAction: false,
      speakerAction: 'add',
      speakerToUpdate: {}
    }
  },
  computed: {
    speakers() {
      return this.$store.state.event.speakers
    }
  },
  watch: {
    speakers() {
      this.allSpeakers = this.speakers
    }
  },

  methods: {
    addSpeaker() {
      this.speakerAction = 'add'
      this.speakerToUpdate = {}
      this.showSpeakerAction = true
    },
    updateSpeaker(speaker) {
      this.speakerAction = 'update'
      this.speakerToUpdate = speaker
      this.showSpeakerAction = true
    }
  }
}
</script>
<style></style>
