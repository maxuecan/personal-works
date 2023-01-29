<template>
  <div>
    <div class="box">
      <nav>
        <h3 class="nav">导航1</h3>
      </nav>
      <section>
        <div class="module">模块1</div>
      </section>
    </div>

    <input type="button" id="navMore" value="更多导航">
    <input type="button" id="moduleMore" value="更多模块">
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  var navMore = document.getElementById('navMore'),
      moduleMore = document.getElementById('moduleMore');

  if (navMore && moduleMore) {
    var nav = document.querySelector('nav'), 
      section = document.querySelector('section');
    var navIndex = 1, sectionIndex = 1;
    var rand = function() {
      return 'f' + (Math.random() + '') .slice(-1);
    };
    navMore.onclick = function() {
      navIndex++;
      nav.insertAdjacentHTML('beforeEnd', '<h3 class="nav">导航'+ navIndex +'</h3>');
    };
    moduleMore.onclick = function() {
      sectionIndex++;
      section.insertAdjacentHTML('beforeEnd', '<div class="module" style="background:#'+ [rand(), rand(), rand()].join('') +'">模块'+ sectionIndex +'</div>');
    };  
  }
})
</script>

<style lang="scss" scoped>

</style>