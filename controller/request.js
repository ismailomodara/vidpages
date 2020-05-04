import $axios from '../plugins/axios'

export default {
  getEvent(eventRef) {
    return $axios.post('/event', {
      event_ref: eventRef
    })
  },

  getPlans(ip) {
    return $axios.post('/list-plans', {
      ip
    })
  },

  generateEventRef() {
    return $axios.post('/generate-event-ref')
  },

  getVideoProviders(payload) {
    return $axios.post('/load-video-providers', payload)
  },

  createEvent(payload) {
    return $axios.post('/create-events', payload)
  },

  generateHashtag(eventName) {
    return $axios.post('/generate-hashtag', { event_name: eventName })
  },

  addSpeaker(payload) {
    return $axios.post('/create-event-speaker', payload)
  },

  updateSpeaker(payload) {
    return $axios.post('/create-event-speaker', payload)
  },

  addSponsor(payload) {
    return $axios.post('/create-event-sponsor', payload)
  },

  updateSponsor(payload) {
    return $axios.post('/create-event-sponsor', payload)
  },

  addSchedule(payload) {
    return $axios.post('/create-event-schedule', payload)
  },

  updateSchedule(payload) {
    return $axios.post('/create-event-schedule', payload)
  },

  createGallery(payload) {
    return $axios.post('/create-event-gallery', payload)
  },

  getPaymentProviders() {
    return $axios.post('/load-payment-providers')
  },

  listEventsByUser(userId) {
    return $axios.post('/list-events-per-user', { user_id: userId })
  },

  likeEvent(eventRef) {
    return $axios.post('/like-event', { event_ref: eventRef })
  },

  shareEvent(eventRef) {
    return $axios.post('/share', { event_ref: eventRef })
  },

  attendEvent(payload) {
    return $axios.post('/event-registration', payload)
  },

  createPlan(payload) {
    return $axios.post('/create-plan', payload)
  },

  updatePaymentPlan(payload) {
    return $axios.post('/create-plan', payload)
  }
}
