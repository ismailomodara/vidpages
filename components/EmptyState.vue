<template>
  <div class="empty-state">
    <img src="@/assets/img/empty-state-illustration.svg" alt="Empty State" />
    <p>{{ text }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    text: {
      type: String,
      default: 'Empty'
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  width: 70%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 60px;
  border-radius: 20px;

  img {
    margin-bottom: 30px;
    height: 150px;
    width: auto;
  }

  p {
    font-size: 1.2rem;
    color: #222151;
  }
}
</style>
