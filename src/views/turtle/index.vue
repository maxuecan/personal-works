<script setup>
import { onMounted } from 'vue'
// import Turtle from 'turtle-js';
import { Turtle } from 'turtle-graphics';

onMounted(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const turtle = new Turtle(canvas);
    console.log(turtle.turtle    )
    turtle.turtle.goto( 100, 100)
    turtle.turtle.goto( 100,-100)
    turtle.turtle.goto(-100,-100)
    turtle.turtle.goto(-100, 100)
    turtle.turtle.goto(0,0)
})

</script>

<template>
    <div>
        <canvas style="width: 500px; height: 500px;" id="canvas"></canvas>
    </div>
</template>

<style scoped></style>