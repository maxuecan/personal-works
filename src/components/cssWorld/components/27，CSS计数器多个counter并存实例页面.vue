<template>
  <div>
    <!-- <p>我叫王小二，万万没想到，我还有一个兄弟！</p>
    <p class="counter"></p> -->
    <div class="reset">
        <div class="counter">我是王小二
            <div class="reset">
                <div class="counter">我是王小二的大儿子</div>
                <div class="counter">我是王小二的二儿子
                    <div class="reset">
                        <div class="counter">我是王小二的二儿子的大孙子</div>
                        <div class="counter">我是王小二的二儿子的二孙子</div>
                        <div class="counter">我是王小二的二儿子的小孙子</div>
                    </div>
                </div>
                <div class="counter">我是王小二的三儿子</div>
            </div>
        </div>
        <div class="counter">我是王小三</div>
        <div class="counter">我是王小四
            <div class="reset">
                <div class="counter">我是王小四的大儿子</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
// .counter {
//   counter-reset: wangxiaoer 2 wangxiaosan 3;
//   font-size: 32px;
//   font-family: Arial black;
//   color: #cd0000;
// }
// .counter:before {
//   content: counter(wangxiaoer) '\A' counter(wangxiaosan);
//   white-space: pre;
// }

.reset {
  padding-left: 20px;
  counter-reset: wangxiaoer;
}
.counter:before {
  content: counters(wangxiaoer, '-') '. ';
  counter-increment: wangxiaoer;
}

</style>