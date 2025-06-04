<template>
    <div>
        <button @click="formatData()">更新表格</button>
        <!-- excel -->
        <div ref="spreadsheetContainer" style="width: 400px; height: 375px;"></div>
        <!-- echart -->
        <div ref="chartRef" style="width: 600px; height: 400px;"></div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import Spreadsheet from 'x-data-spreadsheet';
    // 国际化
    import 'x-data-spreadsheet/dist/locale/zh-cn';
    Spreadsheet.locale('zh-cn');

    import * as echarts from 'echarts';

    const spreadsheetContainer = ref(null);
    let spreadsheetInstance = null;
    let _ci = -1
    let _ri = -1

    const chartRef = ref(null);
    let myChart = null;
    onMounted(() => {
        // excel初始化
        spreadsheetInstance = new Spreadsheet(spreadsheetContainer.value, {
            // 基本配置
            // mode: 'edit', // 'edit' 或 'read'
            showToolbar: false, // 显示工具栏
            showBottomBar: false,   // 显示底部栏
            // showGrid: true, // 显示网格
            // showContextmenu: true, // false

            // 可以是固定值
            view: {
                height: () => 375, // document.documentElement.clientHeight
                width: () => 400 // document.documentElement.clientWidth
            },

            // 行列配置
            row: {
                len: 10,          // 行数
                height: 30,       // 默认行高
                // 0: { height: 50 } // 特定行高度
                // indexWidth: 60, // 左边序列栏默认宽度
                // minWidth: 60, // 每个列默认最小宽度
            },
            col: {
                len: 3,          // 列数
                width: 100,       // 默认列宽
                // 0: { width: 200 } // 特定列宽度
            },
            // 默认样式
            // style: {
            //     // 背景颜色
            //     bgcolor: '#ffffff',
            //     // 水平对齐方式
            //     align: 'left',
            //     // 垂直对齐方式
            //     valign: 'middle',
            //     // 是否需要换行
            //     textwrap: false,
            //     // 虚线边框
            //     strike: false,
            //     // 下画线
            //     underline: false,
            //     // 文字颜色
            //     color: '#0a0a0a',
            //     // 字体设置
            //     font: {
            //         // 字体
            //         name: 'Helvetica',
            //         // 字号大小
            //         size: 10,
            //         // 是否加粗
            //         bold: false,
            //         // 斜体
            //         italic: false,
            //     },
            // }
            // 样式配置（根级别）
            // styles: [
            //     { bgcolor: '#ffff00', color: '#ff0000', font: { size: 14, bold: true }, align: 'center' },
            //     { bgcolor: '#ccffcc', textwrap: true, border: { bottom: ['thin', '#000000'] } },
            // ]
        });
        // 加载数据
        spreadsheetInstance.loadData({
            rows: {
                0: { 
                    cells: { 
                        0: { text: 'Mon' },
                        1: { text: '100' },
                        2: { text: '80' },
                    } 
                },
                1: { 
                    cells: { 
                        0: { text: 'Tue' },
                        1: { text: '200' },
                        2: { text: '160' },
                    } 
                },
                2: { 
                    cells: { 
                        0: { text: 'Wed' },
                        1: { text: '300' },
                        2: { text: '240' },
                    } 
                },
                3: { 
                    cells: { 
                        0: { text: 'Thu' },
                        1: { text: '400' },
                        2: { text: '320' },
                    } 
                },
                4: { 
                    cells: { 
                        0: { text: 'Fri' },
                        1: { text: '500' },
                        2: { text: '400' },
                    } 
                },
                5: { 
                    cells: { 
                        0: { text: 'Sat' },
                        1: { text: '600' },
                        2: { text: '480' },
                    } 
                },
                6: { 
                    cells: { 
                        0: { text: 'Sun' },
                        1: { text: '700' },
                        2: { text: '560' },
                    } 
                }
            },
            // styles: [ // 可选：覆盖初始化的 styles
            //     { bgcolor: '#ffff00', color: '#ff0000', font: { size: 14, bold: true } },
            // ],
        });

        // 设置单元格文本
        // spreadsheetInstance.cellText(0, 0, '新文本');

        // 绑定事件
        /**
         * cell-selected
         * cells-selected
         * cell-edited
         * change 
         */
        // 监听键盘事件（通过库内置事件方法）
        spreadsheetInstance.on('cell-selected', (cell, ri, ci) => {
            // 获取当前列数和行数
            _ci = ci
            _ri = ri
            console.log(`选中: 行 ${ri}, 列 ${ci}`);
        });
        // spreadsheetInstance.on('cells-selected', (cell, { sri, sci, eri, eci }) => {});
        spreadsheetInstance.on('cell-edited', (text, ri, ci) => {
            let _row = spreadsheetInstance.getData()[0].rows.len
            if (ri == _row - 1) {
                let type = 'row', n = 1;
                insert(type, _ci, _ri, n)
            }
        });

        // echart初始化
        if (chartRef.value) {
            myChart = echarts.init(chartRef.value);
            const option = {
                // title: {
                //   // 主标题
                //   text: '这是主标题',
                //   // 子标题（可选）
                //   subtext: '这是子标题',
                //   left: 'center' // 关键配置
                // },
                tooltip: {},
                xAxis: {
                    // data: [ "衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子" ]
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    // {
                    //     name: '销量',
                    //     type: 'line',
                    //     data: [5, 20, 36, 10, 10, 20]
                    // }
                ]
            };
            myChart.setOption(option);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // 获取当前列数和行数
                let _col = spreadsheetInstance.getData()[0].cols.len
                // let _row = spreadsheetInstance.getData()[0].rows.len
                // 检测是否在最后一列
                if (_ci === _col - 1) {
                    e.preventDefault();
                    let type = 'column', n = 1;
                    insert(type, _ci, _ri, n)
                }
            }
        })
    });
    onUnmounted(() => {
        spreadsheetInstance.value = null; // 销毁实例，释放资源

        if (myChart !== null && myChart !== undefined) {
            myChart.dispose(); // 销毁实例，释放资源
        }
    });
    // 添加行或列
    function insert(type, _ci, _ri, n = 1) {
        let { datas } = spreadsheetInstance

        datas[0].changeData(() => {
            // const { sri, sci } = this.selector.range;
            // let si = sri;
            const { rows, merges, cols } = datas[0];
            let si = _ri
            if (type === 'row') {
                rows.insert(_ri + 1, n);
            } else if (type === 'column') {
                rows.insertColumn(_ci + 1, n);
                si = _ci
                cols.len += n;
                Object.keys(cols._).reverse().forEach((colIndex) => {
                const col = parseInt(colIndex, 10);
                if (col >= sci) {
                    cols._[col + n] = cols._[col];
                    delete cols._[col];
                }
                });
            }
            merges.shift(type, si, n, (ri, ci, rn, cn) => {
                const cell = rows.getCell(ri, ci);
                cell.merge[0] += rn;
                cell.merge[1] += cn;
            });
        });
        // 重新加载表格
        const data = spreadsheetInstance.getData()
        spreadsheetInstance.sheet.loadData(data)
    }

    // 格式化数据
    function formatData() {
        // 获取x-spreadsheet数据
        let data = spreadsheetInstance.getData();

        let chart_data = []
        let series = []
        for (let i in data[0].rows) {
            if (i !== 'len') {
                let cells = data[0].rows[i].cells
                for (let j in cells) {
                    if (j === '0') chart_data.push(cells[j].text)
                    else if (!series[+j - 1]) {
                        series.push({
                            data: [cells[+j].text],
                            type: 'line'
                        })
                    } else {
                        series[+j - 1].data.push(cells[+j].text)
                    }
                }
            }
        }
        console.log(chart_data)
        console.log(series)

        let option = {
            // 你的图表配置项
            xAxis: {
                type: 'category',
                data: chart_data
            },
            series
        };

        myChart.setOption(option)
    }
</script>
  