<template>
  <div class="info">
    <div class="message">
      <p>欢迎光临，各位访客</p>
      <div v-for="(item, index) in msg_arr">
        <b>{{ item }}</b>
        <b>{{ msg_obj[item] }}</b>
      </div>
    </div>
    <div class="picture">
      <img src="../../assets/picture.png" alt="">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    let msg_arr = ['NAME', 'D.O.B', 'PHONE', 'E-MAIL']
    let msg_obj = {
      NAME: '马学灿',
      'D.O.B': '1998-04-02',
      PHONE: '+86 13539484628',
      'E-MAIL': '623875282@qq.com'
    }

    return {
      msg_arr,
      msg_obj,
    }
  }
})
</script>

<style scoped lang="scss">
.info {
  width: 80%;
  height: 80%;
  margin: 0 auto;
  position: absolute;
  left: 10%;
  top: 10%;
  display: flex;
  background: white;
  color: gray;
  opacity: 0.9;
  .message {
    width: 50%;
    padding: 8% 1.25rem 1.25rem;
    & > p {
      font-size: 1.5625rem;
      /* 本例12个文字(加标点符号)；有多少个文字，width就是多少个em */
      width: 12em;
      /* 
        加上两个动画，一个是打字动画，使用steps让字一个一个的出现，
        注意step和字数保持一致，光标动画也是同理，
      */
      animation: typingWords 5s steps(12) forwards, cursor 0.5s steps(1) forwards;
      /* 要设置不允许换行，且溢出隐藏 */
      white-space: nowrap;
      overflow: hidden
    }
    & > div {
      display: flex;
      margin: 1.25rem 0 0 0;
      & > b:nth-child(1) {
        width: 30%;
      }
      & > b:nth-child(2) {
        width: 70%;
      }
    }
    & > div:nth-child(2) {
      border-top: 2px solid #cccccc;
      padding: 1.25rem 0 0 0;
    }
  }
  .picture {
    width: 50%;
    & > img {
      width: 50%;
      height: auto;
      padding: 25% 0 0 0;
      margin: 0 auto;
      display: block;
    }
  }
}
@keyframes typingWords {
  0% {
    width: 0;
  }
}
@keyframes cursor {
  50% {
    border-color: transparent;
  }
}

@media (max-width: 768px) {
  .info {
    width: 100%;
    left: 0;
    display: block;
    overflow: hidden;
    .message {
      width: auto ;
    }
    .picture {
      width: auto;
      & > img {
        padding: 0;
      }
    }
  }
}
</style>