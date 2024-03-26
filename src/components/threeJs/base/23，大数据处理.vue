<!-- 23，大数据处理 -->
<template>
    <div class="three-container">
        <canvas id="three-box" ref="threeBox"></canvas>
    </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { getCurrentInstance, onMounted, nextTick, ref, reactive } from 'vue'

let { ctx } = getCurrentInstance() as any

onMounted(async () => {
    await nextTick()
    loadFile('https://threejs.org/manual/examples/resources/data/gpw/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc')
        .then(parseData)
        .then(drawData)
})

async function loadFile(url: String) {
    const req = await fetch(url)
    return req.text()
}

function parseData(text: String) {
    const data = []
    const settings = { data }
    let max
    let min

    // 切割每一行
    text.split('\n').forEach((line) => {
        const parts = line.trim().split(/\s+/)

        if (parts.length === 2) {
            settings[parts[0]] = parseFloat(parts[1])
        } else if (parts.length > 2) {
            const values = parts.map((v) => {
                const value = parseFloat(v)
                if (value === settings.NODATA_value) {
                    return undefined
                }
                max = Math.max(max === undefined ? value : max, value)
                min = Math.min(min === undefined ? value : min, value)
                return value
            })
            data.push(values)
        }
    })
    return Object.assign(settings, {min, max})
}

function drawData(file) {
    const {min, max, ncols, nrows, data} = file
    const range = max - min
    const ctx1 = ctx.$refs.threeBox.getContext( '2d' );

    ctx1.canvas.width = ncols
    ctx1.canvas.height = nrows

    ctx1.canvas.style.width = px(ncols * 2)

    ctx1.fillStyle = '#444'
    ctx1.fillRect(0, 0, ctx1.canvas.width, ctx1.canvas.height)

    data.forEach((row, latNdx) => {
        row.forEach((value, lonNdx) => {
            if (value === undefined) return
            const amount = (value - min) / range
            const hue = 1
            const saturation = 1
            const lightness = amount
            ctx1.fillStyle = hsl(hue, saturation, lightness)
            ctx1.fillRect(lonNdx, latNdx, 1, 1)
        })
    })
}

function px(v) {
    return `${v | 0}px`
}

function hsl(h, s, l) {
    return `hsl(${h * 360 | 0}, ${s * 100 | 0}%, ${l * 100 | 0}%)`
}

</script>

<style scoped lang="scss">
.three-container {
  width: 100%;
  height: 100%;
  #three-box {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>