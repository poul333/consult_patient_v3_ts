<script setup lang="ts">
import ConsultList from '@/views/User/components/ConsultList.vue'
import { ConsultType } from '@/enums'
</script>

<template>
  <div class="consult-page">
    <cp-nav-bar title="问诊记录" />
    <van-tabs sticky>
      <van-tab title="极速问诊">
        <ConsultList :type="ConsultType.Fast"></ConsultList>
      </van-tab>
      <van-tab title="找医生">
        <ConsultList :type="ConsultType.Doctor"></ConsultList>
      </van-tab>
      <van-tab title="开药问诊">
        <ConsultList :type="ConsultType.Medication"></ConsultList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.consult-page {
  padding-top: 46px;
  background-color: var(--cp-bg);
  min-height: calc(100vh - 46px);
}
</style>
