<template>
     <div class="colorPicker">
        <el-popover placement="bottom" popperClass="colorPopper" :ref="`popoverRef_${pickId}`" width="240" trigger="click"
            @show="popoverShow">
            <div class="color_content">
                <span class="color_title">最近使用颜色</span>
                <ul class="recentCo_ul">
                    <li class="recentCo_li recentCo_first" title="清除颜色" @click="handleClearColor"></li>
                    <li class="recentCo_li cursor" v-for="(item, index) in recentColorList" :key="index"
                        :style="`background:${item}`" :data-color="`${item}`" :title="`${item}`" @click="handleCheckColor">

                    </li>
                </ul>
                <ul class="color_tab">
                    <li class="colorTab_li" :class="activeTab == index ? '-activeTab' : ''"
                        @click="handleActiveTabChange(index)" v-for="(item, index) in colorTabList" :key="index">{{ item
                        }}</li>
                </ul>
                <table v-show="activeTab == 0" class="edui-box ue_colortable edui-default colorTable"
                    style="border-collapse: collapse;" cellspacing="0" cellpadding="0">
                    <tbody class="edui-default">
                        <tr class="edui-default"
                            :class="{ 'edui-colorpicker-tablefirstrow': index == 0 || index == colorList.length - 1 }"
                            v-for="(item, index) in colorList" :key="index">
                            <td class="edui-default pr-4" v-for="(itemIn, indexIn) in item" :key="indexIn">
                                <a hidefocus="" :title="itemIn" onclick="return false;" href="javascript:" unselectable="on"
                                    class="edui-box edui-colorpicker-colorcell edui-default"
                                    :class="index == 0 || index == colorList.length - 1 || index == colorList.length - 2 ? 'isFirst' : 'noFirst'"
                                    :data-color="`${itemIn}`" :style="`background:${itemIn};`" @click="handleCheckColor">
                                </a>
                            </td>
                        </tr>
                        <tr></tr>
                    </tbody>
                </table>
                <div class="picker_svg" v-show="activeTab == 1">
                    <div class="colorBack" @mousedown="colorBarDown" @mousemove="colorBarMove" @mouseup="colorBarUp"
                        @mouseleave="colorBarUp"
                        :style="`background:rgb(${curSliderColor[0]},${curSliderColor[1]},${curSliderColor[2]})`">
                        <svg id="back_svg">
                            <rect x="0" y="0" width="100%" height="100%" :fill="`url(#gradient-white${pickId})`"></rect>
                            <rect x="0" y="0" width="100%" height="100%" :fill="`url(#gradient-black${pickId})`"></rect>
                            <defs>
                                <linearGradient :id="`gradient-black${pickId}`" x1="0%" y1="100%" x2="0%" y2="0%">
                                    <stop offset="0%" stop-color="#000000" stop-opacity="1"></stop>
                                    <stop offset="100%"
                                        :stop-color="`rgb(${curSliderColor[0]},${curSliderColor[1]},${curSliderColor[2]})`"
                                        stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient :id="`gradient-white${pickId}`" x1="0%" y1="100%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"></stop>
                                    <stop offset="100%"
                                        :stop-color="`rgb(${curSliderColor[0]},${curSliderColor[1]},${curSliderColor[2]})`"
                                        stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div class="colorBar colorBarTarget" :class="`colorBarTarget_${pickId}`"
                            :style="`top:${colorBarTop}px;left:${colorBarLeft}px`">
                            <div class="colorBarTarget" :class="`colorBarTarget_${pickId}`"></div>
                        </div>
                    </div>
                    <div class="colorSilder" ref="slider" @mousedown="silderBarDown" @mousemove="silderBarMove"
                        @mouseup="sliderBarUp" @mouseleave="sliderBarUp">
                        <svg id="hsv_svg">
                            <rect x="0" y="0" width="100%" height="100%" :fill="`url(#gradient-hsv${pickId})`"></rect>
                            <linearGradient :id="`gradient-hsv${pickId}`" x1="0%" y1="100%" x2="0%" y2="0%">
                                <stop offset="0%" stop-color="#FF0000" stop-opacity="1"></stop>
                                <stop offset="13%" stop-color="#FF00FF" stop-opacity="1"></stop>
                                <stop offset="25%" stop-color="#8000FF" stop-opacity="1"></stop>
                                <stop offset="38%" stop-color="#0040FF" stop-opacity="1"></stop>
                                <stop offset="50%" stop-color="#00FFFF" stop-opacity="1"></stop>
                                <stop offset="63%" stop-color="#00FF40" stop-opacity="1"></stop>
                                <stop offset="75%" stop-color="#0BED00" stop-opacity="1"></stop>
                                <stop offset="88%" stop-color="#FFFF00" stop-opacity="1"></stop>
                                <stop offset="100%" stop-color="#FF0000" stop-opacity="1"></stop>
                            </linearGradient>
                        </svg>
                        <div class="silderBar" :class="`silderBar_${pickId}`" :style="`top:${siderBarTop}px`"></div>
                    </div>
                </div>
                <div class="colorPick_bottom">
                    <div class="color_div" :style="`background:${colorInput}`"></div>
                    <div class="color_input"><el-input class v-model="colorInput" @input="handleInputChange"></el-input></div>
                    <button class="color_btn" @click="handleConfirmColor">确定</button>
                </div>

            </div>
            <div slot="reference">
                <i class="iconfont iconStyle" :class="iconClass" :title="iconTitle"></i>
            </div>
        </el-popover>
    </div>
</template>

<script>
var isFirst = true;
export default {
    name: 'colorPicker',
    data() {
        return {
            pickId: '',
            colorTabList: ['基本颜色', '更多颜色'],
            activeTab: 0,
            recentColorList: ['#548dd4', '#366092', '#000'],
            colorList: [
                ['#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646'],
                ['#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada'],
                ['#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5'],
                ['#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#92cddc', '#fac08f'],
                ['#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#31859b', '#e36c09'],
                ['#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#205867', '#974806'],
                ['#c00000', '#ff0000', '#ffc000', '#ffff00', '#92d050', '#00b050', '#00b0f0', '#0070c0', '#002060', '#7030a0'],
            ],
            colorInput: '#555',
            colorInputRgb: [85, 85, 85],
            colorInputHsv: [],
            colorBgState: false,
            colorBarTop: 0,
            colorBarLeft: 0,
            sliderState: false,
            startY: 0,
            offsetY: 0,
            Hval: 0,
            Sval: 100,
            Vval: 100,
            siderBarTop: 0,
            curColor: [255, 0, 0],
            curSliderColor: [255, 0, 0],
        }
    },
    methods: {
        popoverShow() {
            this.recentColorList = localStorage.getItem('recentColor').split(',');
        },
        handleActiveTabChange(index) {
            this.activeTab = index;

        },
        debounce(fn, wait = 200) {
            let timer = null;
            return function (...args) {

                if (isFirst) {
                    fn.apply(this, args)
                    isFirst = false
                } else {
                    if (timer) {
                        clearTimeout(timer)
                        timer = null
                    }
                    timer = setTimeout(function () {
                        fn.apply(this, args)
                    }, wait)
                }

            }
        },
        // slider 事件
        silderBarDown(e) {
            this.sliderState = true;
            this.Sval = 100;
            this.Vval = 100;
            if (e.target != $(`.silderBar_${this.pickId}`)[0]) {
                this.setSlilderColor(e.offsetY)
            }

        },
        silderBarMove(e) {
            if (!this.sliderState) return;
            this.debounce(() => {
                if (e.target != $(`.silderBar_${this.pickId}`)[0]) {
                    this.setSlilderColor(e.offsetY)
                }
            }, 200)()
        },
        sliderBarUp() {
            this.sliderState = false;
            isFirst = true;

        },
        setSlilderColor(y) {
            this.siderBarTop = y - 3;
            this.offsetY = y / 150;
            this.Hval = 360 * this.offsetY;
            this.curColor = this.hsvtorgb(this.Hval, this.Sval, this.Vval)
            this.curSliderColor = this.curColor;
            this.colorInput = this.setRgbTo16(this.curColor);
        },
        colorBarDown(e) {
            this.colorBgState = true;
            if (e.target != $(`.colorBarTarget_${this.pickId}`)[0] && e.target != $(`.colorBarTarget_${this.pickId}`)[1]) {
                this.setColor(e.offsetX, e.offsetY)
            }

        },
        colorBarMove(e) {
            if (!this.colorBgState) return;
            this.debounce(() => {
                if (e.target != $(`.colorBarTarget_${this.pickId}`)[0] && e.target != $(`.colorBarTarget_${this.pickId}`)[1]) {
                    this.setColor(e.offsetX, e.offsetY)
                }
            }, 200)()

        },
        colorBarUp() {
            this.colorBgState = false;
            isFirst = true;
        },
        setColor(x, y) {
            this.colorBarTop = y - 4;
            this.colorBarLeft = x - 4;
            this.Sval = x / 185 * 100;
            this.Vval = (1 - y / 150) * 100;
            this.curColor = this.hsvtorgb(this.Hval, this.Sval, this.Vval)
            this.colorInput = this.setRgbTo16(this.curColor);
        },
        // 清空color
        handleClearColor() {
            this.$emit('changeColor', '');
            this.$refs[`popoverRef_${this.pickId}`].doClose();
        },
        // 选择color
        handleCheckColor(e) {
            let color = e.currentTarget.dataset.color
            this.handleSubmitColor(color)
        },
        handleConfirmColor() {
            var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
            if (reg.test(this.colorInput)) {
                this.handleSubmitColor(this.colorInput)
            }
        },
        // 修改颜色
        handleSubmitColor(val) {
            this.recentColorList.unshift(val);
            this.recentColorList = Array.from(new Set(this.recentColorList));
            if (this.recentColorList.length > 8) {
                this.recentColorList = this.recentColorList.slice(0, 8)
            }
            localStorage.setItem('recentColor', this.recentColorList)
            this.$emit('changeColor', val);
            this.$refs[`popoverRef_${this.pickId}`].doClose();
        },
        // input修改时回显色盘
        handleInputChange(value){
            console.log(value)
            var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
            if (reg.test(value)) {
                this.curColor = this.set16ToRgb(value);
                this.colorInputHsv = this.rgbtohsv(this.curColor)
                this.curSliderColor= this.curColor;
                this.Hval = this.colorInputHsv[0];
                this.Sval = this.colorInputHsv[1];
                this.Vval = this.colorInputHsv[2];
                this.siderBarTop=(this.Hval*15)/36-3;
                this.colorBarLeft=(185*this.Sval)/100-4;
                this.colorBarTop=(1-(this.Vval/100))*150-4;
            }

        },
        // hsv转rgb
        hsvtorgb(h, s, v) {
            s = s / 100;
            v = v / 100;
            var h1 = Math.floor(h / 60) % 6;
            var f = h / 60 - h1;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);
            var r, g, b;
            switch (h1) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = p;
                    b = q;
                    break;
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        },
        // rgb转hsv
        rgbtohsv(arr) {
            var h = 0, s = 0, v = 0;
            var r = arr[0], g = arr[1], b = arr[2];
            arr.sort(function (a, b) {
                return a - b;
            })
            var max = arr[2]
            var min = arr[0];
            v = max / 255;
            if (max === 0) {
                s = 0;
            } else {
                s = 1 - (min / max);
            }
            if (max === min) {
                h = 0;//事实上，max===min的时候，h无论为多少都无所谓
            } else if (max === r && g >= b) {
                h = 60 * ((g - b) / (max - min)) + 0;
            } else if (max === r && g < b) {
                h = 60 * ((g - b) / (max - min)) + 360
            } else if (max === g) {
                h = 60 * ((b - r) / (max - min)) + 120
            } else if (max === b) {
                h = 60 * ((r - g) / (max - min)) + 240
            }
            h = parseInt(h);
            s = parseInt(s * 100);
            v = parseInt(v * 100);
            return [h, s, v]
        },

        //十六进制转rgb
        set16ToRgb(str) {
            // var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
            // if (!reg.test(str)) { return; }
            let newStr = (str.toLowerCase()).replace(/\#/g, '')
            let len = newStr.length;
            if (len == 3) {
                let t = ''
                for (var i = 0; i < len; i++) {
                    t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
                }
                newStr = t
            }
            let arr = [];
            for (var i = 0; i < 6; i = i + 2) {
                let s = newStr.slice(i, i + 2)
                arr.push(parseInt("0x" + s))
            }
            return arr
        },
        // rgb转十六进制
        setRgbTo16(arr) {
            let c = '#';
            for (var i = 0; i < arr.length; i++) {
                var t = Number(arr[i]).toString(16);
                if (Number(arr[i]) < 16) {
                    t = '0' + t;
                }
                c += t;
            }
            return c;
        },

    },
    computed: {},
    created() {
        this.pickId = Math.random().toString(36).slice(-10);
    },
    watch: {},
    mounted() {

    },
    props: {
        iconClass: {
            type: String,
            default: 'iconzitiyanse'
        },
        iconTitle:{
            type:String,
            default:'颜色'
        }
    },
}

</script>
