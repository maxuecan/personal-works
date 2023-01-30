<template>
  <div class="navigate-container">
    <div>
      <!-- <router-link to="/index" custom v-slot="{ navigate, isActive, isExactActive}">
        <div @click="navigate" :class="[isActive && 'active', isExactActive && 'router-link-exact-active']">首页</div>
      </router-link>
      <router-link to="/cssWorld" custom v-slot="{ navigate, isActive, isExactActive}">
        <div @click="navigate" :class="[isActive && 'active', isExactActive && 'router-link-exact-active']">css世界</div>
      </router-link>
      <router-link to="/canvas" custom v-slot="{ navigate, isActive, isExactActive}">
        <div @click="navigate" :class="[isActive && 'active', isExactActive && 'router-link-exact-active']">canvas</div>
      </router-link> -->

      <div @click="navigate(1)" :class="is_active === 1 ? 'active' : ''">藏经阁</div>
      <div @click="navigate(2)" :class="is_active === 2 ? 'active' : ''">内功</div>
      <div @click="navigate(3)" :class="is_active === 3 ? 'active' : ''">外功</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup(props, context) {
    let is_active = ref(1)

    const navigate = (type: any) => {
      is_active.value = type
      context.emit('navChange', type)
    }

    return {
      is_active,
      navigate,
    }
  }
})
</script>

<style scoped lang="scss">
.navigate-container {
  width: 100%;
  height: 100%;
  & > div {
    display: flex;
    justify-content: end;
    padding: 1.875rem 1.25rem 0 0;
    & > div {
      display: block;
      text-decoration: none;
      color: white;
      margin: 0 1.25rem 0 0;
    }
  }
}
.active {
  border-bottom: 2px solid white;
}
// .router-link-exact-active {
//   border-bottom: 2px solid red;
// }
</style>