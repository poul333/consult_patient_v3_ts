<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  addPatient,
  getPatientList,
  updatePatient,
  daletePatient
} from '@/services/user'
import type { Patient, PatientList } from '@/types/user'
import { showConfirmDialog, showSuccessToast, showToast } from 'vant'
import Validate from 'id-validator'

const list = ref<PatientList>([])
const getList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  getList()
})

// 侧边栏相关
const show = ref(false)
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// 控制弹出
const showPopup = (item?: Patient) => {
  if (item) {
    // 编辑表单
    const { id, name, gender, idCard, defaultFlag } = item
    patient.value = { id, name, gender, idCard, defaultFlag }
  } else {
    // 置空表单
    patient.value = { ...initPatient }
  }
  show.value = true
}
// 表单数据
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const patient = ref<Patient>({ ...initPatient })
// 默认就诊人：选中：1 ， 不选中： 0
// 获取值：判断 defaultFlag 是否为1，是返回true,否返回false
// 设置值：如果 复选框的值是 true, defaultFlag 为 1，否则为 0
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1
  },
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0
  }
})
// 添加患者信息的提交事件
const submit = async () => {
  if (!patient.value.name) return showToast('请输入姓名')
  if (!patient.value.idCard) return showToast('请输入身份证号码')
  // 校验身份证号
  const validate = new Validate()
  if (!validate.isValid(patient.value.idCard))
    return showToast('身份证号不正确')
  const info = validate.getInfo(patient.value.idCard)
  if (info.sex !== patient.value.gender) return showToast('性别与身份证不符')

  // 添加逻辑 合并 编辑
  patient.value.id
    ? await updatePatient(patient.value)
    : await addPatient(patient.value)
  show.value = false // 关闭弹出框
  getList() // 重新获取用户列表
  showSuccessToast(patient.value.id ? '编辑成功' : '添加成功') // 轻提示
}
// 删除患者信息
const remove = async () => {
  // 类型守卫
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '确认要删除吗'
    })
    await daletePatient(patient.value.id) // 发送请求
    show.value = false
    getList()
    showSuccessToast('删除成功')
  }
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item of list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon">
          <cp-icon name="user-edit" @click="showPopup(item)" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list?.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 侧边弹出层 -->
    <van-popup v-model:show="show" position="right">
      <!-- // 给 cp-nav-bar 组件，控制回退按钮功能 -->
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        rightText="保存"
        @click-right="submit"
      ></cp-nav-bar>
      <van-form autocomplete="off">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              v-model="patient.gender"
              :options="options"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}

// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}

.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
