<template>
  <div class="container">
    <div>
      <h1 class="title">
        vidpages
      </h1>
      <div>
        <el-input v-model="email" type="text" />
        <el-button type="primary" @click="create">Create</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      email: ''
    }
  },
  methods: {
    create() {
      this.$router.push({ name: 'create', params: { email: this.email } })
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Avenir', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-size: 100px;
  color: #222151;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
