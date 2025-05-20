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
</script>

<template>
    <div></div>
</template>

<style scoped></style>