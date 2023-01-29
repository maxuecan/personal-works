<template>
  <div>
    <p>下面这段话所有链接地址都是本实例。</p>
    <p>
      点击<a href="">这个链接</a>
      当前页刷新，看看有没有标记；点击<a href="" target="_blank">这个链接</a>，新标签页新打开一次本页面，看看有没有标记。
    </p>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
a {
  text-decoration: underline;
  color: #cd0000;
}
a[target="_blank"]:after {
  content: url(data:image/gif;base64,R0lGODlhBQAFAIABAM0AAAAAACH5BAEAAAEALAAAAAAFAAUAAAIHRIB2eKuOCgA7);
}
</style>