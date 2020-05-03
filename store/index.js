import request from '../controller/request'

export const state = () => ({
  event: {}
})

export const getters = {
  event: (state) => state.event
}

export const mutations = {
  SET_EVENT(state, event) {
    state.event = event
  }
}

export const actions = {
  EVENT({ commit }, eventRef) {
    return new Promise((resolve, reject) => {
      request
        .getEvent(eventRef)
        .then((response) => {
          if (response.data.success) {
            commit('SET_EVENT', response.data)
          }
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
