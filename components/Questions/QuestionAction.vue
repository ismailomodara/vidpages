<template>
  <el-dialog
    :visible.sync="showDialog"
    width="40%"
    :title="action === 'add' ? 'Add New Question' : 'Update Question Details'"
    @click="resetValues"
  >
    <el-form :model="newQuestion">
      <el-row type="flex">
        <el-col :lg="24">
          <el-form-item label="Question" prop="question">
            <el-input
              v-model="newQuestion.question"
              type="textarea"
              rows="4"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :lg="24">
          <el-form-item label="Is question required?" prop="required">
            <el-switch
              v-model="newQuestion.required"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="d-flex justify-content-end">
      <el-button
        v-if="action === 'add'"
        :loading="addingQuestion"
        type="primary"
        @click="addQuestion"
        >Add</el-button
      >
      <el-button
        v-if="action === 'update'"
        :loading="addingQuestion"
        type="primary"
        @click="updateQuestion"
        >Update</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import request from '~/controller/request'

export default {
  name: 'QuestionAction',
  components: {},
  props: {
    action: {
      type: String,
      default: 'add'
    },
    show: Boolean,
    question: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      addingQuestion: false,
      newQuestion: {
        question: '',
        required: 1
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
      //
    },
    async addQuestion() {
      this.addingQuestion = true
      await request
        .addQuestion(this.newQuestion)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingQuestion = false
                this.$message.success('New question added!')
              })
              .catch(() => {
                this.addingQuestion = false
              })
          } else {
            this.$message.info(response.message)
            this.addingQuestion = false
            this.showDialog = false
          }
        })
        .catch(() => {
          this.addingQuestion = false
        })
    },
    async updateQuestion() {
      this.addingQuestion = true
      this.newQuestion.event_ref = this.$store.state.event.event.eventRef
      await request
        .addQuestion(this.newQuestion)
        .then((response) => {
          if (response.data.success) {
            this.$store
              .dispatch('EVENT', this.$route.params.ref)
              .then(() => {
                this.showDialog = false
                this.resetValues()
                this.addingQuestion = false
                this.$message.success('Questions details updated!')
              })
              .catch(() => {
                this.$message.error('Something went wrong!')
                this.addingQuestion = false
              })
          } else {
            this.addingQuestion = false
          }
        })
        .catch(() => {
          this.addingQuestion = false
        })
    },
    resetValues() {
      this.newQuestion = {
        question: '',
        event_ref: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
