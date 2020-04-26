<template>
  <div class="vid-nav">
    <div class="container">
      <nuxt-link :to="{ name: 'index' }" class="vid-logo">
        VidPages
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      email: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.vid-nav {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #ffffff;

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      color: #222151;
      font-size: 1.25rem;
      font-family: 'Avenir', sans-serif;
      font-weight: 600;
    }
  }
}
</style>
