/*
 * Created by izayl on 2017/5/7.
 * @Project: iChat
 * @Author: izayl
 * @Contact: izayl@163.com
 */
import './toast.scss'
import Vue from 'vue'

var ToastComp = {
  data () {
    return {
      content: ''
    }
  },
  template: `
  <div class="toast-container" transition="toast-anim">
    <div class="content">{{content}}</div>
  </div>
  `
}

class Toast {
  show (msg) {
    var comp = new Vue(ToastComp)
    window.comp = comp
    comp.content = msg
    document.getElementById('app').appendChild(comp.$mount().$el)
    setTimeout(() => {
      comp.$el.remove()
    }, 2000)
  }
}

export default new Toast()
