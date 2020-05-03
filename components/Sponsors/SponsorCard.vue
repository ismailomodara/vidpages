<template>
  <div class="vid-card-view">
    <div>
      <img :src="sponsor.eventSponsorLogo" alt />
      <p>{{ sponsor.eventSponsorName }}</p>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SponsorCard',
  props: {
    sponsor: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.vid-card-view {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 30px;

  > div {
    display: flex;
    align-items: center;
  }

  img {
    height: 60px;
    width: 60px;
    background: #222151;
    object-fit: cover;
    border-radius: 100%;
    margin-right: 15px;
  }

  p {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0;
  }
}
</style>
