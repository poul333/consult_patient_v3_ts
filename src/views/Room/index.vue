<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { onMounted, onUnmounted, ref, nextTick, provide } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import type { TimeMessages, Message } from '@/types/room'
import { MsgType, OrderType } from '@/enums/index'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'

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
    // 置空消息列表
    list.value = []
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
    data.forEach((item, i) => {
      // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
      if (i === 0) time.value = item.createTime
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

    //关闭下拉loading效果
    loading.value = false

    if (!data.length) return showToast('没有记录了')

    // 第一次需要滚动到最底部
    nextTick(() => {
      if (initialMsg.value) {
        // 将默认加载到的消息改为已读
        socket.emit('updateMsgStatus', arr[arr.length - 1].id)
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      }
    })
  })
  // 等连接成功之后，注册事件，订单状态变更
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })
  // 接收消息
  socket.on('receiveChatMsg', async (event: Message) => {
    list.value.push(event)
    // 是一个Promise，等DOM渲染完毕再执行
    await nextTick()
    // 修改消息为已读
    socket.emit('updateMsgStatus', event.id)
    // 发送消息滚动到下方
    window.scrollTo(0, document.body.scrollHeight)
  })
})

// 接诊状态
const consult = ref<ConsultOrderItem>()
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})

// 发送文字消息
const sendText = (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}

// 发送图片消息
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 聊天记录
// 控制消息滚动到最底部
const initialMsg = ref(true)
// 实现下拉刷新
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const loading = ref(false)
const onRefresh = () => {
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}

provide('consult', consult)
// 修改评价
const completeEva = (score: number) => {
  //  添加评价对象
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <RoomStatus
      :status="consult?.status"
      :countdown="consult?.countdown"
    ></RoomStatus>
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <RoomMessage :list="list"></RoomMessage>
    </van-pull-refresh>
    <RoomAction
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImage"
    ></RoomAction>
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
