<template>
  <div class="vid-nav" :class="{ inverse: inverse }">
    <div class="container">
      <nuxt-link :to="{ name: 'index' }" class="vid-logo">
        Vidpages
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    inverse: Boolean
  },
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

  &.inverse {
    background: #222151;

    a {
      color: #fff !important;
    }
  }

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
