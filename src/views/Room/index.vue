<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import type { TimeMessages, Message } from '@/types/room'
import { MsgType } from '@/enums/index'

const store = useUserStore()
const route = useRoute()
let socket: Socket
const list = ref<Message[]>([])

// 卸载时关闭连接
onUnmounted(() => {
  socket.close()
})
// 建立连接
onMounted(() => {
  socket = io(baseURL, {
    // 身份认证
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    // 订单id
    query: {
      // 地址栏取出 orderId , 建立连接时发送给 socket 服务器
      orderId: route.query.orderId
    }
  })
  // 连接成功
  socket.on('connect', () => {
    console.log('连接成功')
  })
  // 关闭连接
  socket.on('disconnect', () => {
    console.log('断开连接')
  })
  // 发生错误
  socket.on('error', (err) => {
    console.log('错误', err)
  })

  // 聊天记录（默认消息）
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 处理消息，将分组消息自己组织成一条通用消息，items 取出后放后面
    const arr: Message[] = []
    data.forEach((item) => {
      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: {
          content: item.createTime
        }
      })
      arr.push(...item.items)
    })
    // 将处理好的数据放置list中
    list.value.unshift(...arr)
  })
})
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <RoomStatus></RoomStatus>
    <RoomMessage :list="list"></RoomMessage>
    <RoomAction></RoomAction>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
