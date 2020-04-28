<template>
  <div class="solid-colors">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <p class="mb-0">Choose from color codes</p>
      <el-color-picker v-model="selectedColor"></el-color-picker>
    </div>
    <el-row :gutter="20" type="flex" class="flex-wrap">
      <el-col v-for="(color, index) in colors" :key="index" :lg="6"
        ><div
          :style="{ backgroundColor: `${color}` }"
          :class="['solid-color', { 'is-selected': selectedColor === color }]"
          @click="selectColor(color)"
        >
          <i class="vid-icon--check-circle"></i></div
      ></el-col>
    </el-row>
    <div class="d-flex justify-content-end">
      <el-button
        v-if="selectedColor"
        size="small"
        type="secondary"
        @click="emitBackground"
        >Save</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolidColors',
  props: {
    show: Boolean
  },
  data() {
    return {
      colors: [
        '#00baba',
        '#222151',
        '#f56c6c',
        '#FED102',
        '#40A4EF',
        '#7733f4',
        '#D42C63',
        '#007BFF',
        '#FFDCC6',
        '#FE5096',
        '#F9D423',
        '#372BBD'
      ],
      selectedColor: ''
    }
  },
  computed: {},
  methods: {
    selectColor(color) {
      this.selectedColor = color
    },
    emitBackground() {
      this.$emit('background', this.selectedColor)
    }
  }
}
</script>

<style lang="scss" scoped>
.solid-colors {
  height: 100%;
  width: 100%;

  .solid-color {
    height: 80px;
    width: 100%;
    border-radius: 5px;
    background-color: #222151;
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;

    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 24px;
      opacity: 0;
      transition: opacity 0.25s ease-in;
    }

    &.is-selected i {
      opacity: 1;
      transition: opacity 0.25s ease-out;
    }
  }
}
</style>
