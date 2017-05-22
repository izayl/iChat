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
  console.log('called')
  store.commit('changeCallStatus', {
    status: 'callee',
    token: data.token,
    callerId: data.caller
  })
})

socket.on('cancel', function () {
  console.log('cancel')
  store.state.global = '对方拒绝了你的通话请求'
  window.history.back()
})

/**
 * *********************** RTC *************************************************
 */
// rtc global variable

var localStream
var remoteStream
var isInitiator = false
var streamReady = false
/****************************************************************************
 * Signaling server
 ****************************************************************************/

socket.on('message', function (message) {
  console.log('Client received message:', message)
  if (streamReady) signalingMessageCallback(message)
})

socket.on('created', function (room, clientId) {
  console.log('Created room', room, '- my client ID is', clientId)
  isInitiator = true
  grabWebCamVideo()
})

socket.on('joined', function (room, clientId) {
  console.log('This peer has joined room', room, 'with client ID', clientId)
  isInitiator = false
  grabWebCamVideo()
})

socket.on('ready', function (room) {
  console.log('Socket is ready')
  createPeerConnection(isInitiator)
})

/**
 * Send message to signaling server
 */
function sendMessage (message) {
  console.log('Client sending message: ', message)
  socket.emit('message', message)
}
/****************************************************************************
 * User media (webcam)
 ****************************************************************************/
// var needCallback = false

function grabWebCamVideo () {
  console.log('Getting user media (video) ...')
  var constraints = {
    video: true,
    audio: true
  }
  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotMediaSuccess)
    .catch(gotMediaError)
}

function gotMediaSuccess (stream) {
  if (stream) var localVideo = document.getElementById('localVideo')
  else return

  if (localVideo) {
    window.localStream = localStream = localVideo.srcObject = stream
    if (!stream.stop && stream.getTracks) {
      stream.stop = function () {
        this.getTracks().forEach(function (track) {
          track.stop()
        })
      }
    }
    localVideo.onloadedmetadata = function () {
      console.log('gotStream with with and height:', localVideo.videoWidth, localVideo.videoHeight)
    }
    streamReady = true
    console.log('Set local media success')
    if (!isInitiator) socket.emit('ready', store.state.callToken)
  } else {
    console.log('Cannot set Media to not found dom with id localVideo')
  }
}

function gotMediaError (e) {
  console.log('got media error ' + e.name)
}

/****************************************************************************
 * WebRTC peer connection and data channel
 ****************************************************************************/
var peerConnection
var peerConnectionConfig = {
  'iceServers': [
    { 'url': 'stun:stun.services.mozilla.com' },
    { 'url': 'stun:stun.l.google.com:19302' }
  ]
}

function createPeerConnection (isInitiator) {
  console.log('Creating Peer connection as initiator?', isInitiator)

  window.peerConnection = peerConnection = new RTCPeerConnection(peerConnectionConfig)

  peerConnection.onicecandidate = gotIceCandidate
  peerConnection.onaddstream = gotRemoteStream
  peerConnection.oniceconnectionstatechange = function (e) {
    console.log('ICE state: ' + peerConnection.iceConnectionState)
    console.log('ICE state change event: ' + e)
  }

  try {
    if (localStream) {
      peerConnection.addStream(localStream)
    } else {
      console.log('local stream is not ready')
      streamReady = false
      // needCallback = true
      return
    }
  } catch (e) {
    console.log('Add stream error ' + e)
  }

  streamReady = true

  if (isInitiator) createOffer()
}

function gotIceCandidate (desc) {
  console.log('got ice candidate')
  console.log('ice candidate event:', event)

  if (!desc.candidate) {
    console.log('End of ice candidates')
    return
  }

  sendMessage({
    type: 'candidate',
    candidate: desc.candidate
  })
}

function gotRemoteStream (e) {
  console.log('got remote stream')
  if (e) var remoteVideo = document.getElementById('remoteVideo')
  else return

  if (remoteVideo) {
    window.remoteStream = remoteStream = remoteVideo.srcObject = e.stream
    console.log('Got Remote Stream success.')
    console.log(remoteStream)
  } else {
    console.log('Set remote stream error because no dom with id remoteVideo.')
  }
}

function createOffer (offer) {
  console.log('Creating an offer')

  peerConnection
    .createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    .then(offer => {
      console.log('local session created:', offer)
      return peerConnection.setLocalDescription(offer)
    })
    .then(() => {
      console.log('sending local desc:', peerConnection.localDescription)
      sendMessage(peerConnection.localDescription)
    })
    .catch(e => console.log('Create Offer error ' + e.name))
}

function signalingMessageCallback (message) {
  if (!streamReady) {
    console.log('wait add stream')
    return
  }
  try {
    if (message.type === 'offer') {
      console.log('Got offer. Sending answer to peer.')

      peerConnection.setRemoteDescription(new RTCSessionDescription(message))

      peerConnection
        .createAnswer()
        .then(answer => peerConnection.setLocalDescription(answer))
        .then(() => sendMessage(peerConnection.localDescription))
        .catch(e => console.log('Create Answer error ' + e.name))
    } else if (message.type === 'answer') {
      console.log('Got answer.')

      peerConnection.setRemoteDescription(new RTCSessionDescription(message))
    } else if (message.type === 'candidate') {
      console.log('Got candidate.')

      peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate))
    }
  } catch (e) {
    console.log('Error on Messge ' + message.type + ' ' + e)
  }
}

// function logError (err) {
//   console.log(err.toString(), err)
// }

function randomToken () {
  return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1)
}

const callStatus = {
  'caller': 1,
  'callee': 2
}
var store = new Vuex.Store({
  state: {
    userId: localStorage.getItem('userId') ? localStorage.getItem('userId') : '',
    username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
    myAvatar: localStorage.getItem('avatar') ? localStorage.getItem('avatar') : '0',
    page: '/chatList',
    connected: false,
    clientId: null,
    chatStorage: {},
    newMessage: {},
    searchList: [],
    friends: localStorage.getItem('friends') ? JSON.parse(localStorage.getItem('friends')) : [],
    recent: [],
    callStatus: 0, // 0: noting , 1: caller, 2: callee
    callerId: null,
    callToken: randomToken(),
    rtcMsg: [],
    global: null,
    showVideo: false
  },
  mutations: {
    connecting (state, data) {
      socket.connect()
      console.log('state.avatar', state.avatar)
      if (data) {
        console.log(data)
        state.userId = data.userId || state.userId
        state.myAvatar = data.avatar || state.avatar
        state.username = data.username || state.username
        localStorage.setItem('userId', state.userId)
        localStorage.setItem('avatar', String(state.myAvatar))
        localStorage.setItem('username', state.username)
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
      data = {
        ...data,
        fromUser: state.userId,
        avatar: state.myAvatar,
        fromUsername: state.username
      }
      state.chatStorage[data.toUser].push({
        ...data,
        time: +new Date()
      })

      socket.emit('sendToUser', data)
    },
    receiveMessage (state, data) {
      if (!state.chatStorage[data.fromUser]) {
        Vue.set(state.chatStorage, data.fromUser, [])
        Vue.set(state.newMessage, data.fromUser, 0)
      }
      var left = state.newMessage[data.fromUser] + 1 || 1
      Vue.set(state.newMessage, data.fromUser, left)
      state.chatStorage[data.fromUser].push(data)

      console.log(data)
      var isAdded = state.recent.filter(item => item.userId === data.fromUser)
      if (state.recent.length > 0 && isAdded.length > 0) return
      state.recent.push({
        username: data.fromUsername,
        userId: data.fromUser,
        avatar: data.avatar
      })
    },
    clearUnread (state, id) {
      Vue.set(state.newMessage, id, 0)
    },
    closeRTC (state) {
      localStream.stop()
      state.callStatus = 0
      state.rtcMsg = null
      socket.emit('closeRTC', state.callToken)
    },
    changeCallStatus (state, data) {
      state.callStatus = callStatus[data.status] || state.callStatus
      state.callerId = data.callerId || state.callerId
      if (data.token) state.callToken = data.token
      console.log(state)
      if (data.rtcMsg) {
        if (!state.rtcMsg) state.rtcMsg = []
        state.rtcMsg.push(data.rtcMsg)
      }
      if (data.status === 'caller') {
        console.log('emit call')
        socket.emit('call', {
          caller: state.userId,
          callee: data.callee,
          token: state.callToken
        })
      }
    },
    resetCallStatus (state) {
      state.callStatus = 0
      state.callerId = null
      state.rtcMsg = []
      state.callToken = randomToken()
    },
    'create or join' (state, room) {
      socket.emit('create or join', room)
    },
    cancelVideo (state) {
      socket.emit('cancel', state.callerId)
      state.callerId = null
    },
    acceptVideo (state) {
      socket.emit('accept', state.callerId)
      //  go to rtc page
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
    },
    acceptMessage ({ commit, state }) {
      if (!peerConnection) commit('startRTC')
      state.callStatus = 3
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
        // re-add the stop function
        if (!stream.stop && stream.getTracks) {
          stream.stop = function () {
            this.getTracks().forEach(function (track) {
              track.stop()
            })
          }
        }
        localStream = stream
        localVideo.src = window.URL.createObjectURL(stream)
      }

      function getUserMediaError (e) {
        console.log(e)
      }
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
