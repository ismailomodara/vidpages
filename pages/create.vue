<template>
  <div class="vid-create">
    <navbar></navbar>
    <div class="vid-header">
      <div class="container">
        <div class="vid-event-title">
          <el-form :model="event.title">
            <el-form-item
              v-custom-input="event.title"
              class="vid-custom-input"
              label="Event Title"
              prop="title"
            >
              <el-input
                v-model="event.title"
                type="text"
                auto-complete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button type="white" plain>Update Cover Image</el-button>
        </div>
      </div>
    </div>
    <div class="vid-event-details">
      <div class="container">
        <el-form
          ref="create"
          :model="event"
          label-position="top"
          class="vid-event-form"
        >
          <div class="vid-section">
            <h6>Zoom Info</h6>
            <el-row type="flex">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.zoom.url"
                  class="vid-custom-input"
                  label="URL"
                  prop="url"
                >
                  <el-input
                    v-model="event.zoom.url"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--external-link"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="40" type="flex">
              <el-col :lg="12"
                ><el-form-item
                  v-custom-input="event.zoom.id"
                  class="vid-custom-input"
                  label="ID"
                  prop="id"
                >
                  <el-input
                    v-model="event.zoom.id"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--hash"
                  ></el-input> </el-form-item
              ></el-col>
              <el-col :lg="12"
                ><el-form-item
                  v-custom-input="event.zoom.password"
                  class="vid-custom-input"
                  label="Password"
                  prop="password"
                >
                  <el-input
                    v-model="event.zoom.password"
                    type="password"
                    auto-complete="off"
                    prefix-icon="vid-icon--lock"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
          </div>
          <div class="vid-section">
            <h6>Event Details</h6>
            <el-row type="flex">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.title"
                  class="vid-custom-input"
                  label="Text Input"
                  prop="email"
                >
                  <el-input
                    v-model="event.title"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--edit-2"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row :gutter="40" type="flex">
              <el-col :lg="12"
                ><el-form-item
                  v-custom-input="event.date"
                  class="vid-custom-input"
                  label="Date"
                  prop="email"
                >
                  <el-date-picker
                    v-model="event.date"
                    type="date"
                    format="dd-MMMM-yyyy"
                    prefix-icon="vid-icon--calendar"
                  >
                  </el-date-picker> </el-form-item
              ></el-col>
              <el-col :lg="12"
                ><el-form-item
                  v-custom-input="event.time"
                  class="vid-custom-input"
                  label="Time"
                  prop="email"
                >
                  <el-time-select
                    v-model="event.time"
                    :clearable="false"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00'
                    }"
                    :disabled="!event.isTime"
                    prefix-icon="vid-icon--clock"
                  >
                  </el-time-select>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Disable time for this event"
                    placement="right-start"
                  >
                    <el-switch v-model="event.isTime"></el-switch>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :lg="24"
                ><el-form-item
                  v-custom-input="event.publicUrl"
                  class="vid-custom-input"
                  label="Event Url: https://vidpages.com/"
                  prop="email"
                >
                  <el-input
                    v-model="event.publicUrl"
                    type="text"
                    auto-complete="off"
                    prefix-icon="vid-icon--chrome"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
          </div>
          <div class="vid-section">
            <h6>Accessibility</h6>
          </div>
          <div class="vid-section-create">
            <el-button type="primary" size="large">Create</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  name: 'Create',
  components: {
    Navbar
  },
  data() {
    return {
      email: '',
      event: {
        zoom: {
          url: '',
          id: '',
          password: ''
        },
        title: '',
        publicUrl: '',
        date: '',
        time: '',
        isTime: true,
        email: ''
      }
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.vid-create {
  .vid-header {
    height: 550px;
    background: #222151;
    position: relative;

    .container {
      position: relative;
      height: 100%;

      .vid-event-title {
        position: absolute;
        left: 0;
        bottom: 70px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .vid-custom-input {
          box-shadow: none;
          background: transparent;
          border: none;
          border-radius: 0;
          border-bottom: 2px solid #ffffff50;

          .el-input__inner {
            color: #fff;
          }
        }
      }
    }
  }

  .vid-event-form {
    width: 80%;
    margin: auto;
  }

  .vid-section {
    margin-bottom: 50px;

    h6 {
      /*font-family: 'Quicksand', sans-serif;*/
      color: #222151;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
      margin-bottom: 30px;
      font-size: 0.9rem;
      position: relative;
      padding-left: 25px;

      &::before {
        content: '';
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        left: 0;
        height: 9px;
        width: 9px;
        background: #7733f4;
        border-radius: 100px;
      }
    }
  }

  .vid-event-details {
    padding: 60px 0;
  }

  .vid-custom-input .el-switch {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }

  .vid-section-create {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
