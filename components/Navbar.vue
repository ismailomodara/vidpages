<template>
  <div class="vid-nav" :class="{ inverse: inverse }">
    <div class="container">
      <nuxt-link :to="{ name: 'index' }" class="vid-logo">
        Vidpages
      </nuxt-link>
      <p v-if="user">
        <el-dropdown @command="command">
          <span class="el-dropdown-link">
            Hello
            <strong>{{ user.email }}</strong>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="home">Home</el-dropdown-item>
            <el-dropdown-item command="logout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </p>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  name: 'Navbar',
  props: {
    inverse: Boolean
  },
  data() {
    return {
      user: ''
    }
  },
  created() {
    if (Cookies.get('user')) {
      this.user = JSON.parse(Cookies.get('user'))
    }
  },
  methods: {
    command(command) {
      if (command === 'home') {
        this.$router.push({
          name: 'home',
          params: { userId: this.user.user_id }
        })
      } else if (command === 'logout') {
        Cookies.remove('user')
        this.user = ''
        this.$router.push({ name: 'index' })
      }
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
  }

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
