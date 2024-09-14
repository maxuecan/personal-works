<!-- scss使用 -->
<template>
    <div>
        <div class="test">
            测试
            <b>aaa</b>
        </div>
        <div class="test1">测试1</div>
        <button @click.native="theme('iview')">默认</button>
        <button @click.native="theme('light')">浅色</button>
        <button @click.native="theme('dark')">深色</button>
    </div>
</template>

<script lang="ts" setup>
import { ref, isRef, reactive, computed, watch, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

function theme(type: string) {
    window.document.documentElement.setAttribute("data-theme", type);
}
</script>

<!-- <style lang="scss">
.test {
    color: red;
    @include font32;
    b {
        color: black
    }
}
.test1 {
    background: $Bg;
}
</style> -->
<style lang="scss" scoped>
@import "@/style/_handle.scss";
.test {
    font-size: 18px;
    @include font_color("font_color1");
    @include background_color("background_color1");
    @include border_color("border_color1");
}
</style>
