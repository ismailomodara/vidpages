<template>
  <div class="vid-nav" :class="{ inverse: inverse }">
    <div class="container">
      <nuxt-link :to="{ name: 'index' }" class="vid-logo">
        Vidrl
      </nuxt-link>
      <div class="nav-links">
        <a v-if="$route.name === 'index'" :href="blog" target="_blank">Blog</a>
        <a :href="help_center" target="_blank">Help Center</a>
        <VidHeadwayWidget v-if="$route.name === 'manage-ref'" />
        <p v-if="user && user_id">
          <el-dropdown @command="command">
            <span class="el-dropdown-link">
              <strong>Hi {{ JSON.parse(user).firstName }}</strong>
              <i class="vid-icon--chevron-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="home">Home</el-dropdown-item>
              <el-dropdown-item command="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import VidHeadwayWidget from './Headway'

export default {
  name: 'Navbar',
  components: {
    VidHeadwayWidget
  },
  props: {
    inverse: Boolean
  },
  data() {
    return {
      blog:
        'https://www.notion.so/e52893dae7ec4ac98ac44c29d90d9e1d?v=7d66dde2d8d841d28fb5189682c81357',
      help_center:
        'https://www.notion.so/Vidrl-Help-Center-633a79c099d9471ba44947fd0ff59c5f'
    }
  },
  computed: {
    user_id() {
      return Cookies.get('user_id')
    },
    user() {
      return Cookies.get('user')
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
        Cookies.remove('user_id')
        Cookies.remove('user')
        this.user = ''
        this.user_id = ''
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

    > a {
      font-size: 1.25rem;
      font-family: 'Avenir', sans-serif;
      font-weight: 500;
      color: #222151;
    }

    .nav-links {
      display: flex;
      align-items: center;
      color: #fff;

      p {
        margin-bottom: 0;
      }

      a,
      span {
        color: #222151;
        padding: 10px 20px;
        font-size: 0.9rem;
        font-weight: 500;
      }

      span {
        font-weight: 600;
        display: flex;
        align-items: center;

        i {
          font-size: 0.9rem;
          margin-left: 7px;
        }
      }
    }
  }

  &.inverse {
    background: #222151;

    a,
    span {
      color: #fff !important;
    }
  }
}
</style>
