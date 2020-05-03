import axios from 'axios'

const $axios = axios.create({
  baseURL: 'https://47tidnqigi.execute-api.us-east-1.amazonaws.com/api/',
  headers: {
    Authorization: 'sk-ehfdggf77y7jdbjb'
  }
})

export default $axios
