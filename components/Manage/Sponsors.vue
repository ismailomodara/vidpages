<template>
  <div class="vid-sponsors">
    <div class="d-flex justify-content-center align-items-center mb-4">
      <h5 class="text-center mr-3">All Sponsors ({{ allSponsors.length }})</h5>
      <el-button
        v-if="allSponsors.length"
        type="outline"
        size="small"
        @click="addSponsor"
        >Add New</el-button
      >
    </div>
    <div v-if="allSponsors.length">
      <el-row type="flex" :gutter="30" class="flex-wrap">
        <el-col
          v-for="(sponsor, index) in sponsors"
          :key="index"
          :sm="12"
          :md="12"
        >
          <sponsor-card :sponsor="sponsor">
            <el-button
              size="small"
              type="outline"
              @click="updateSponsor(sponsor)"
              >Edit</el-button
            >
          </sponsor-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <EmptyState text="You currently have no sponsors">
        <el-button type="primary" @click="addSponsor">Add Sponsor</el-button>
      </EmptyState>
    </div>
    <sponsor-action
      :action="sponsorAction"
      :show.sync="showSponsorAction"
      :sponsor="sponsorToUpdate"
    />
  </div>
</template>

<script>
import EmptyState from '~/components/EmptyState'
import SponsorAction from '~/components/Sponsors/SponsorAction'
import SponsorCard from '~/components/Sponsors/SponsorCard'

export default {
  name: 'Sponsors',
  components: {
    EmptyState,
    SponsorAction,
    SponsorCard
  },
  data() {
    return {
      allSponsors: [],
      showSponsorAction: false,
      sponsorAction: 'add',
      sponsorToUpdate: {}
    }
  },
  computed: {
    sponsors() {
      return this.$store.state.event.sponsors
    }
  },
  watch: {
    sponsors() {
      this.allSponsors = this.sponsors
    }
  },
  methods: {
    addSponsor() {
      this.sponsorAction = 'add'
      this.showSponsorAction = true
    },
    updateSponsor(sponsor) {
      this.sponsorAction = 'update'
      this.sponsorToUpdate = sponsor
      this.showSponsorAction = true
    }
  }
}
</script>
<style></style>
