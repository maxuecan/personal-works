<template>
  <div>
    <h4>左侧固定</h4>
    <div class="box box-left">
      <img src="@/assets/home/1.jpg" class="img" />
      <p>DOM文档流中，图片定宽在左侧，文字内容在右侧，和视觉呈现的前后顺序一致。</p>
    </div>

    <h4>右侧固定-DOM顺序相反</h4>
    <div class="box box-right">
        <img src="@/assets/home/1.jpg" class="img">
        <p>DOM文档流中，图片定宽在左侧，视觉上却在右侧，顺序表现不一致。</p>
    </div>

    <h4>右侧固定-DOM顺序和视觉一致</h4>
    <div class="box box-right-same">
        <div class="full">
            <p>DOM文档流中，图片定宽在右侧，视觉呈现也在右侧，顺便表现此时一致。</p>
        </div>
        <img src="@/assets/home/1.jpg" class="img">
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box {
  overflow: hidden;
}
.img {
  width: 128px;
  height: 96px;
}
/* 左浮动 */
.box-left > img {
  float: left;
}
.box-left > p {
  margin-left: 140px;
}
/* 右浮动，但图片DOM在前 */
.box-right > img {
  float: right;
}
.box-right > p {
  margin-right: 140px;
}
/* 右浮动，图片DOM在后，和视觉表现一致 */
.box-right-same > .full {
  width: 100%;
  float: left;
}
.box-right-same > .full > p {
  margin-right: 140px;
}
.box-right-same > img {
  float: left;
  margin-left: -128px;
}
</style>