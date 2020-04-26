<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        vidpages
      </h1>
      <h2 class="subtitle">
        Vidpages
      </h2>
      <div>
        <el-input type="text" v-model="email" />
        <el-button type="primary" @click="create">Create</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  name: 'Home',
  components: {
    Logo
  },
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

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
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
