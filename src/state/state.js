/*
 * Created by izayl on 2017/5/9.
 * @Project: iChat
 * @Author: izayl
 * @Contact: izayl@163.com
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { api } from '../common/'

Vue.use(Vuex)

var io = window.io
var socket = io('http://localhost:3000', {
  autoConnect: false
})

socket.on('connect', function (client) {
  console.log('connect')
  socket.emit('record', store.state.userId)
  store.commit('connected', socket)
})

socket.on('receiveFromUser', function (data) {
  console.log('receiveFromUser')
  store.commit('receiveMessage', data)
})

var store = new Vuex.Store({
  state: {
    userId: '',
    connected: false,
    clientId: null,
    chatStorage: {},
    searchList: [],
    friends: {}
  },
  mutations: {
    connecting (state, userId) {
      socket.connect()
      state.userId = userId || state.userId
    },
    connected (state, socket) {
      state.connected = true
      state.clientId = socket.id
    },
    search (state, data) {
      state.searchList = [data]
    },
    addFriend (state, data) {
      state.friends[data.userId] = data.username
    },
    sendMessage (state, data) {
      if (!state.chatStorage[data.toUser]) {
        Vue.set(state.chatStorage, data.toUser, [])
      }
      state.chatStorage[data.toUser].push({
        ...data,
        fromUser: state.userId,
        time: +new Date()
      })

      socket.emit('sendToUser', {
        ...data,
        fromUser: state.userId
      })
    },
    receiveMessage (state, data) {
      if (!state.chatStorage[data.fromUser]) {
        Vue.set(state.chatStorage, data.fromUser, [])
      }
      state.chatStorage[data.fromUser].push(data)
    }
  },
  actions: {
    search ({ commit }, username) {
      console.log('search')
      return api.post('/search', { username })
        .then(res => commit('search', res.data))
        .catch(e => console.log(e))
    }
  }
})

export default store

// socket.on('connection', function (client) {
//   console.log('connection')
//   state.online = true
//   state.clientId = socket.id
//   console.log(state)
// })
