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
  // console.log('receiveFromUser')
  store.commit('receiveMessage', data)
})

// be called by somebody
socket.on('called', function (data) {
  Vue.$router.push('#/rtc/' + data)
  store.commit('changeCallStatus', 2)
})

var peerConnection
var peerConnectionConfig = {
  'iceServers': [
    { 'url': 'stun:stun.services.mozilla.com' },
    { 'url': 'stun:stun.l.google.com:19302' }
  ]
}
var localStream

var store = new Vuex.Store({
  state: {
    userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
    myAvatar: localStorage.getItem('avatar') ? localStorage.getItem('avatar') : '0',
    page: '/chatList',
    connected: false,
    clientId: null,
    chatStorage: {},
    searchList: [],
    friends: localStorage.getItem('friends') ? JSON.parse(localStorage.getItem('friends')) : [],
    recent: [],
    callStatus: 0 // 0: noting , 1: calling, 2: be called
  },
  mutations: {
    connecting (state, data) {
      socket.connect()
      if (data) {
        state.userId = data.userId || state.userId
        state.myAvatar = data.avatar || state.avatar
        localStorage.setItem('userId', state.userId)
        localStorage.setItem('avatar', state.avatar)
      }
    },
    connected (state, socket) {
      state.connected = true
      state.clientId = socket.id
    },
    changePage (state, page) {
      state.page = page
    },
    search (state, data) {
      state.searchList = [data]
    },
    searchLocal (state, data) {
      console.log(data)
      data.fromLocal = true
      data.title = data.username
      state.searchList = [data]
    },
    addFriend (state, data) {
      state.friends.push(data)
      localStorage.setItem('friends', JSON.stringify(state.friends))
    },
    addRecent (state, data) {
      var isAdded = state.recent.filter(item => item.userId === data.userId)
      if (state.recent.length > 0 && isAdded.length > 0) return
      state.recent.push(data)
    },
    removeRecent (state, index) {
      state.recent.splice(index, 1)
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
    },
    startRTC (state, { isCaller, remoteVideo }) {
      console.log('start RTC')
      if (!remoteVideo) remoteVideo = document.getElementById('remoteVideo')
      peerConnection = new RTCPeerConnection(peerConnectionConfig)
      peerConnection.onicecandidate = (e) => {
        console.log('on ice candidate')
        if (event.candidate !== null) {
          socket.emit('send', { 'ice': event.candidate })
        }
      }
      peerConnection.onaddstream = (e) => {
        // TODO: set max connect time
        console.log('got remote stream')
        document.getElementById('mask').style.display = 'none'
        remoteVideo.src = window.URL.createObjectURL(event.stream)
        // fullScreen set
        if (remoteVideo.requestFullscreen) {
          remoteVideo.requestFullscreen()
        } else if (remoteVideo.mozRequestFullScreen) {
          remoteVideo.mozRequestFullScreen()
        } else if (remoteVideo.webkitRequestFullscreen) {
          remoteVideo.webkitRequestFullscreen()
        }
      }
      peerConnection.addStream(localStream)

      if (isCaller) {
        peerConnection.createOffer(description => {
          console.log('got description')
          peerConnection.setLocalDescription(description, function () {
            socket.emit('send', {
              'sdp': description
            })
          }, function () {
            console.log('set description error')
          })
        }, e => console.log(e))
      }
    },
    closeRTC (state) {
      //  TODO: add peerConnection Close function
      peerConnection.close()
    },
    changeCallStatus (state, status) {
      state.callStatus = status
    }
  },
  actions: {
    search ({ commit, state }, username) {
      console.log('search')
      var isAdded = state.friends.length > 0 ? state.friends.filter(item => item.username === username) : false
      console.log(isAdded)
      if (isAdded.length > 0) {
        commit('searchLocal', ...isAdded)
      } else {
        return api.post('/search', { username, id: state.userId })
          .then(res => commit('search', res.data))
          .catch(e => console.log(e))
      }
    },
    presetRTC ({ commit }, { localVideo, to }) {
      socket.on('message', message => {
        console.log('on message')
        console.dir(message)
        if (!peerConnection) commit('startRTC', false)

        var signal = message
        if (signal.sdp) {
          peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function () {
            if (signal.sdp.type === 'offer') {
              peerConnection.createAnswer((description) => {
                console.log('got description')
                peerConnection.setLocalDescription(description, function () {
                  socket.emit('send', {
                    'sdp': description
                  })
                }, function () {
                  console.log('set description error')
                })
              }, e => console.log(e))
            }
          })
        } else if (signal.ice) {
          peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice))
        }
      })

      var constraints = {
        video: true,
        audio: true
      }

      if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, getUserMediaSuccess, getUserMediaError)
      } else {
        alert('你的浏览器不支持获取媒体设备的功能')
      }

      function getUserMediaSuccess (stream) {
        localStream = stream
        localVideo.src = window.URL.createObjectURL(stream)
      }

      function getUserMediaError (e) {
        console.log(e)
      }

      socket.emit('call', { to })
    },
    addFriend ({ commit, state }, friend) {
      var isAdded = state.friends.length > 0 ? state.friends.filter(item => item.userId === friend.userId) : false
      if (isAdded.length > 0) {
        var err = new Promise((resolve, reject) => reject('已经添加过该好友'))
        return err
      }
      return api.post('/addFriend', { friendId: friend.userId, myId: state.userId })
        .then(res => {
          commit('addFriend', friend)
          return res
        })
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
