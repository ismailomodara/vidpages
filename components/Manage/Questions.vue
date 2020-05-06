<template>
  <div class="vid-questions">
    <div class="d-flex justify-content-center align-items-center mb-4">
      <h5 class="text-center mr-3">
        All Questions ({{ allQuestions.length }})
      </h5>
      <el-button
        v-if="allQuestions.length"
        type="outline"
        size="small"
        @click="addQuestion"
        >Add New</el-button
      >
    </div>
    <div v-if="allQuestions.length">
      <el-row type="flex" :gutter="30" class="flex-wrap">
        <el-col :md="20">
          <el-table :data="allQuestions" style="width: 100%">
            <el-table-column prop="question" label="Question">
            </el-table-column>
            <el-table-column prop="required" label="Status" width="180">
            </el-table-column>
            <el-table-column>
              <el-button type="outline" size="small">Update</el-button>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <EmptyState text="You currently have no questions">
        <el-button type="primary" @click="addQuestion">Add Question</el-button>
      </EmptyState>
    </div>
    <question-action
      :action="questionAction"
      :show.sync="showQuestionAction"
      :question.sync="questionToUpdate"
    />
  </div>
</template>

<script>
import EmptyState from '~/components/EmptyState'
import QuestionAction from '~/components/Questions/QuestionAction'

export default {
  name: 'Questions',
  components: {
    EmptyState,
    QuestionAction
  },
  data() {
    return {
      allQuestions: this.$store.state.event.question || [],
      showQuestionAction: false,
      questionAction: 'add',
      questionToUpdate: {}
    }
  },
  computed: {
    question() {
      return this.$store.state.event.question
    }
  },
  watch: {
    question() {
      this.allQuestions = this.question
    }
  },

  methods: {
    addQuestion() {
      this.questionAction = 'add'
      this.questionToUpdate = {}
      this.showQuestionAction = true
    },
    updateQuestion(question) {
      this.questionAction = 'update'
      this.questionToUpdate = question
      this.showQuestionAction = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-timeline {
  width: 100%;

  .el-timeline-item {
    width: calc(50% - 40px);
    margin-bottom: 30px;
  }
}

@media (max-width: 1024px) {
  .el-timeline {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
