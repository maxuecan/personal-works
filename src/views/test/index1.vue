<template>
  <div class="comment">
    <!-- <div class="comment-header">
      <el-tooltip class="item" effect="dark" content="点我更换头像" placement="top-start">
        <div @click="handleClick">
          <input type="file" style="display: none" @change="dealWithdAvatar" ref="avatar" />
          <el-avatar
            :src="
              avatarUrl
                ? avatarUrl
                : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
            "
            :size="40"
          ></el-avatar>
        </div>
      </el-tooltip>
      <el-input
        :placeholder="placeholderText"
        v-model="context"
        class="input"
        type="textarea"
        resize="none"
        size="mini"
        :maxlength="contentLength"
        @focus="isShowSecReply(undefined)"
      ></el-input>
      <el-button
        type="info"
        style="height: 40px"
        @click="addComment(articleId, undefined)"
      >{{ buttonText }}</el-button>
    </div> -->
    <div class="comment-body" v-for="(item, index) in comments" :key="item._id + '' + index">
      <!-- 一级评论 -->
      <div class="first-comment">
        <el-avatar :size="40" :src="item.avatarUrl"></el-avatar>
        <div class="content">
          <!-- 一级评论用户昵称 -->
          <h3>{{ item.username }}</h3>
          <!-- 一级评论发布时间 -->
          <span>{{ item.date }}</span>
          <!-- 一级评论评论内容 -->
          <p>{{ item.content }}</p>
          <!-- 一级评论评论点赞 -->
          <div class="comment-right">
            <i
              class="el-icon-trophy"
              @click="giveALike(item, item._id)"
              :class="item.favour.includes(userId) ? 'active' : ''"
            ></i>
            {{ item.favour.length || 0 }}
            <i
              class="el-icon-chat-dot-round"
              @click="isShowSecReply(item._id)"
            >回复</i>
            <i
              class="el-icon-delete"
              @click="deleteComment(item._id, undefined)"
              v-if="userId === item.userId"
            >删除</i>
          </div>
          <!-- 回复一级评论 -->
          <div class="reply-comment" v-show="isShowSec === item._id">
            <el-input
              :placeholder="placeholderText"
              class="input"
              v-model.trim="replyContext"
              :maxlength="contentLength"
            ></el-input>
            <el-button
              type="info"
              size="mini"
              class="reply-button"
              @click="addComment(item._id, item.username)"
            >回复</el-button>
          </div>
          <!-- 次级评论 -->
          <div
            class="second-comment"
            v-for="(reply, index) in item.replyInfo"
            :key="reply._id + '' + index"
          >
            <!-- 次级评论头像,该用户没有头像则显示默认头像 -->
            <el-avatar :size="40" :src="reply.avatarUrl"></el-avatar>
            <div class="content">
              <!-- 次级评论用户昵称 -->
              <h3>{{ reply.username }}</h3>
              <!-- 次级评论评论时间 -->
              <span>{{ reply.date }}</span>
              <span class="to_reply">{{ reply.username }}</span>
              回复
              <span class="to_reply">{{ reply.replyName }}</span>:
              <p>{{ reply.content }}</p>
              <!-- 次级评论评论点赞 -->
              <div class="comment-right">
                <i
                  class="el-icon-trophy"
                  @click="giveALike(reply, item._id)"
                  :class="reply.favour.includes(userId) ? 'active' : ''"
                ></i>
                {{ reply.favour ? reply.favour.length : 0 }}
                <i
                  class="el-icon-chat-dot-round"
                  @click="isShowSecReply(reply._id)"
                >回复</i>
                <i
                  class="el-icon-delete"
                  @click="deleteComment(item._id, reply._id)"
                  v-if="userId === reply.userId"
                >删除</i>
              </div>
              <div class="reply-comment" v-show="isShowSec === reply._id">
                <el-input
                  :placeholder="placeholderText"
                  class="input"
                  v-model.trim="replyContext"
                  :maxlength="contentLength"
                ></el-input>
                <el-button
                  type="info"
                  size="mini"
                  class="reply-button"
                  @click="addComment(item._id, reply.username)"
                >回复</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 暂无评论的空状态 -->
    <el-empty :description="emptyText" v-show="comments.length === 0"></el-empty>
  
    <input type="file" id="videoFileInput" accept=".webm">

    <iframe src="https://www.doubao.com/chat/10208887949550338" frameborder="0"></iframe>
  </div>
</template>
<script>
import Compressor from 'compressorjs';

export default {
  props: {
      articleId: {
        //评论所属文章 id
        type: String
      },
      emptyText: {
        // 评论为空的时候显示的文字
        type: String,
        default: "期待你的评论！"
      },
      buttonText: {
        // 按钮文字
        type: String,
        default: "评论"
      },
      contentLength: {
        // 评论长度
        type: Number,
        default: 150
      },
      placeholderText: {
        // 默认显示文字
        type: String,
        default: "请输入最多150字的评论..."
      }
  },
  data() {
      return {
        comments: [
          {
            _id: "first0", // 评论id
            date: "2022.09.01", //创建日期
            username: "孤城浪人", //评论人
            userId: "1",
            avatarUrl:
              "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png", //头像地址
            favour: ["1", "2", "3"], //点赞的用户id
            content: "666", //评论内容
            replyInfo: [
              //回复的内容
              {
                _id: "sec0", // 当前此条回复的id
                date: "2022.09.01", //创建日期
                replyName: "孤城浪人", //回复的对象
                username: "孤城浪人", //评论人
                userId: "1",
                favour: ["2", "3", "4"],
                avatarUrl:
                  "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                content: "博主厉害了" //回复的内容
              }
            ]
          },
        //   {
        //     _id: "first0", // 评论id
        //     date: "2022.09.01", //创建日期
        //     username: "孤城浪人", //评论人
        //     userId: "1",
        //     avatarUrl:
        //       "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png", //头像地址
        //     favour: ["1", "2", "3"], //点赞的用户id
        //     content: "666", //评论内容
        //     replyInfo: [
        //       //回复的内容
        //       {
        //         _id: "sec0", // 当前此条回复的id
        //         date: "2022.09.01", //创建日期
        //         replyName: "孤城浪人", //回复的对象
        //         username: "孤城浪人", //评论人
        //         userId: "1",
        //         favour: ["2", "3", "4"],
        //         avatarUrl:
        //           "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        //         content: "博主厉害了" //回复的内容
        //       }
        //     ]
        //   }
        ], // 获取得到的评论
        context: "", // 评论内容
        replyContext: "", //一级评论回复
        isShowSec: "", //是否显示次级回复框
        isClickId: "", //记录点击回复的评论id
        userId: "1", // 浏览器指纹
        username: "孤城浪人", //你的用户名
        firstIdx: 1,
        secIdx: 1,
        avatarUrl:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      };
  },
  created() {
    // 获取评论数据
    // this.getCommentList();
  },
  mounted() {
    this.$nextTick(() => {
      let img = new URL('../../assets/test/test.png', import.meta.url).href
      console.log(img)
      console.log(Compressor(img, {maxWidth: 640, maxHeight: 640}))
    })
  },
  methods: {
    // 唤起文件选择
    handleClick() {
      this.$refs.avatar.click();
    },
    dealWithdAvatar(e) {
      const maxSize = 2 * 1024 * 1024;
      const file = Array.prototype.slice.call(e.target.files)[0];
      console.log(file);
    },
    // 获取本篇文章所有评论
    async getCommentList() {
      try {
        this.comments = [];
        let id = "";
        if (this.articleId == "messageBoard") {
          id = "messageBoard";
        } else {
          id = this.articleId;
        }
        // 获取某篇文章下的所有评论
        const res = await this.$api.getCommentsOfArticle({ id });
        this.comments = res.data.comments; //评论列表
        this.username = res.data.user?.username;
        this.avatarUrl = res.data.user?.avatarUrl;
      } catch (err) {
        this.$message.error(err);
      }
    },
    // 评论点赞
    giveALike(item, _id) {
      try {
        // 不允许同一个人重复点赞
        if (item.favour?.includes(this.userId)) {
          this.$message.info("您已经点过赞啦！");
          return;
        }
        //判断是给一级评论点赞还是二级评论，只有二级评论会有replyName
        if (item.replyName) {
          // 给二级评论点赞，向后台提交数据
        } else {
          // 一级评论点赞，向后台提交数据
        }
        item.favour.push(this.userId);
      } catch (err) {
        this.$message.error(err);
      }
    },
    isShowSecReply(id) {
      if (id) {
        this.isShowSec = id;
        if (this.isClickId === this.isShowSec) {
          this.isShowSec = "";
        } else {
          this.isShowSec = id;
        }
        this.isClickId = this.isShowSec;
      } else {
        this.isShowSec = this.isClickId = "";
      }
    },
    deleteComment(_id, replyId) {
      if (replyId) {
        // 删除二级评论，提交请求到后端

        // 成功后从本地记录中删除该评论
        const temp = this.comments.find(item => item._id == _id).replyInfo;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i]._id == replyId) {
            temp.splice(i, 1);
            break;
          }
        }
      } else {
        // 删除一级评论，提交请求到后端

        // 成功后从本地记录中删除该评论
        for (let i = 0; i < this.comments.length; i++) {
          if (this.comments[i]._id == _id) {
            this.comments.splice(i, 1);
          }
        }
      }
    },
    async addComment(id, replyName) {
      let res = {};
      // 评论添加成功，返回的数据
      //本地更新评论列表
      if (replyName) {
        // 添加二级评论
        if (!this.replyContext) {
          this.$message.warning("评论或留言不能为空哦！");
          return;
        }
        // 模拟数据提交成功后返回数据
        res.data = {
          username: this.username,
          userId: this.userId,
          avatarUrl: this.avatarUrl,
          _id: "sec" + this.secIdx++, // 评论id
          replyName,
          date: "2022.09.01", //创建日期
          favour: [], //点赞的用户id
          content: this.replyContext //评论内容
        };
        const comment = this.comments.find(item => item._id == id);
        if (!comment.replyInfo) {
          comment.replyInfo = [];
        }
        comment.replyInfo.push(res.data);
        this.replyContext = "";
      } else {
        // 添加一级评论，提交数据到后端
        if (!this.context) {
          this.$message.warning("评论或留言不能为空哦！");
          return;
        }
        // 模拟数据提交成功后返回数据
        res.data = {
          username: this.username,
          avatarUrl: this.avatarUrl,
          userId: this.userId,
          _id: "first" + this.firstIdx++, // 评论id
          date: "2022.09.01", //创建日期
          articleId: this.articleId, // 评论的文章id
          favour: [], //点赞的用户id
          content: this.context //评论内容
        };
        this.comments.push(res.data);
        this.context = "";
      }
      this.isShowSec = this.isClickId = "";
    }
  }
};
</script>
  
<style lang="scss" scoped>
.comment {
  min-height: 26vh;
  border-radius: 5px;
  margin-top: 2px;
  overflow: hidden;
  .active {
    color: rgb(202, 4, 4);
  }
  .comment-header {
    position: relative;
    height: 50px;
    padding: 10px 5px;
    display: flex;
    align-items: center;

    .input {
      margin-left: 10px;
      margin-right: 20px;
      flex: 1;
      :deep(.el-input__inner:focus) {
        border-color: #dcdfe6;
      }
    }
  }

  .comment-body {
    min-height: 70px;
    padding: 10px 20px;
    font-size: 14px;
    .first-comment {
      display: flex;
      .input {
          :deep(.el-input__inner:focus) {
          border-color: #dcdfe6;
        }
      }
      i {
        margin-right: 5px;
        margin-left: 1vw;
        cursor: pointer;

        &:nth-child(3) {
          color: rgb(202, 4, 4);
        }
      }

      .content {
        margin-left: 10px;
        position: relative;
        flex: 1;

        & > span {
          font-size: 12px;
          color: rgb(130, 129, 129);
        }

        .comment-right {
          position: absolute;
          right: 0;
          top: 0;
        }

        .reply-comment {
          height: 60px;
          display: flex;
          align-items: center;

          .reply-button {
            margin-left: 20px;
            height: 35px;
          }
        }

        .second-comment {
          display: flex;
          padding: 10px 0 10px 5px;
          border-radius: 20px;
          background: #ffffff;
          .to_reply {
            color: rgb(126, 127, 128);
          }
        }
      }
    }
  }
}
</style>
  