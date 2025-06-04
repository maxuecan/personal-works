<script setup>
    new CozeWebSDK.WebChatClient({
        config: {
            bot_id: '7504853922646360103',
        },
        componentProps: {
            title: 'Coze',
        },
        auth: {
            type: 'token',
            token: 'pat_czu_hRG7DCr8ExQdJVnIEeTeQfL6XOtQge9dAQiGOyzfKzWDwfB27OTuiOmUhoJZ2xlHZ',
            onRefreshToken: function () {
                return 'pat_9Hh8L7syiTEdJ5ZDHadjFFbawwSw4qK6yr7690sSx0nHl6PWy0Kt2EWWPuWd7lDpYMkWCwWZ'
            }
        }
    });

    let data =  [
        {
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, 
        {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, 
        {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, 
        {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, 
        {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }
    ]

    function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        console.log(row, column, rowIndex, columnIndex)
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
</script>

<template>
    <div>
        <el-table
            :data="data"
            :span-method="objectSpanMethod"
            border
            style="width: 100%; margin-top: 20px"
        >
            <el-table-column
                prop="id"
                label="ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="amount1"
                label="数值 1（元）">
            </el-table-column>
            <el-table-column
                prop="amount2"
                label="数值 2（元）">
            </el-table-column>
            <el-table-column
                prop="amount3"
                label="数值 3（元）">
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped></style>
