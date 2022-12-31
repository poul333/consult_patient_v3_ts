<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Logistics } from '@/types/order'
import { getMedicalOrderLogistics } from '@/services/order'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'
import carImg from '@/assets/car.png'
// 加载高德地图需要的资源
import AMapLoader from '@amap/amap-jsapi-loader'

// 配置 securityJsCode 并在Window上添加此类型 => global.d.ts
window._AMapSecurityConfig = {
  securityJsCode: '415e917da833efcf2d5b69f4d821784b'
}

const logistics = ref<Logistics>()
const route = useRoute()
onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  logistics.value = res.data
  //   加载高德地图
  AMapLoader.load({
    key: '4eed3d61125c8b9c168fc22414aaef7e',
    version: '2.0'
  }).then((AMap) => {
    // 使用 Amap 初始化地图
    const map = new AMap.Map('map', {
      mapStyle: 'amap://styles/whitesmoke',
      zoom: 12
    })
    // 加载路线规划插件
    AMap.plugin('AMap.Driving', function () {
      // 初始化路线规划对象
      const driving = new AMap.Driving({
        map: map,
        showTraffic: false,
        hideMarkers: true
      })
      // 起始位置经纬度
      // var startLngLat = [116.379028, 39.865042]
      // // 终点位置经纬度
      // var endLngLat = [116.427281, 39.903719]

      // 使用经纬度数组中第一个数据 => 起始位置
      const start = logistics.value?.logisticsInfo.shift()
      // 起始位置覆盖物
      const startMarker = new AMap.Marker({
        icon: startImg,
        position: [start?.longitude, start?.latitude]
      })
      map.add(startMarker)
      // 使用经纬度数组中最后一个数据 => 终点位置
      const end = logistics.value?.logisticsInfo.pop()
      // 终点位置覆盖物
      const endMarker = new AMap.Marker({
        icon: endImg,
        position: [end?.longitude, end?.latitude]
      })
      map.add(endMarker)

      // 数组剩下的就是运输过程中的经纬度坐标

      // 第一个参数为，起始坐标，第二个参数为终点坐标，第三个参数为路途中经纬度坐标，第四个参数为规划好的回调函数
      driving.search(
        [start?.longitude, start?.latitude],
        [end?.longitude, end?.latitude],
        {
          waypoints: logistics.value?.logisticsInfo.map((item) => [
            item.longitude,
            item.latitude
          ])
        },
        function (status: string, result: object) {
          // 未出错时，result即是对应的路线规划方案
          // 绘制运输中货车的位置
          const carMarker = new AMap.Marker({
            icon: carImg,
            position: [
              logistics.value?.currentLocationInfo.longitude,
              logistics.value?.currentLocationInfo.latitude
            ],
            anchor: 'center'
          })
          map.add(carMarker)
          // 3s后，定位到货车，放大地图
          setTimeout(() => {
            map.setFitView([carMarker])
            map.setZoom(10)
          }, 3000)
        }
      )
    })
  })
})
</script>

<template>
  <div class="order-logistics-page" v-if="logistics">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">
          {{ logistics.statusValue }} {{ logistics.estimatedTime }}
        </p>
        <p class="predict">
          <span>{{ logistics.name }}</span>
          <span>{{ logistics.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item of logistics.list" :key="item.id">
          <p class="status" vif="item.statusValue">
            {{ item.statusValue }}
          </p>
          <p class="content">
            {{ item.content }}
          </p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
