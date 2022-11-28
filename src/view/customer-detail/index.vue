<template>
  <div class="customer-detail-content">
    <div v-if="list.length">
      <div class="customer-detail-box"
           v-for="(item, index) in list"
           :key="index">
        <div class="customer-detail-title">{{item.productName}}</div>
        <ul class="customer-detail-list">
          <li>
            <div class="customer-detail-label">岗位：</div>
            <div class="customer-detail-name">{{item.station}}</div>
          </li>
          <li>
            <div class="customer-detail-label">企业名称：</div>
            <div class="customer-detail-name">{{item.companyName}}</div>
          </li>
          <li>
            <div class="customer-detail-label">身份证号码：</div>
            <div class="customer-detail-name">{{item.idCard}}</div>
          </li>
          <li>
            <div class="customer-detail-label">手机号：</div>
            <div class="customer-detail-name">{{item.phone}}</div>
          </li>
          <li>
            <div class="customer-detail-label">姓名：</div>
            <div class="customer-detail-name">{{item.name}}</div>
          </li>
          <li>
            <div class="customer-detail-label">性别：</div>
            <div class="customer-detail-name">{{item.sex}}</div>
          </li>
          <li>
            <div class="customer-detail-label">申请时间：</div>
            <div class="customer-detail-name">{{item.createTime}}</div>
          </li>
          <li>
            <div class="customer-detail-label">当前进度：</div>
            <div class="customer-detail-name">{{item.progressName}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="customer-no-data" v-else>
      <img src="@/assets/no_data.png">
      <div class="customer-no-data-tips">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import {
    searchCustomer
  } from "@/api/index";
  export default {
    data () {
      return {
        list: []
      }
    },
    created () {
      this.getCustomerDetail()
      console.log(this.list)
    },
    methods: {
      async getCustomerDetail () {
        let res = await searchCustomer({ phone: this.$route.params.phone })
        if (+res.code === 1) {
          this.list = res.info
        }
      }
    },
    beforeRouteEnter (to, from, next) {
      window.document.body.style.backgroundColor = '#F7F7F7';
      next();
    },
    beforeRouteLeave (to, from, next) {
      window.document.body.style.backgroundColor = '';
      next();
    }
  }
</script>

<style lang="less" scoped>
  .customer-detail-content {
    padding: 10px;
    .customer-detail-box {
      background: #FFFFFF;
      box-shadow: 0px 1px 9px 0px rgba(125, 124, 124, 0.28);
      border-radius: 3px;
      margin-top: 10px;
      &:first-child {
        margin-top: 0;
      }
      .customer-detail-title {
        padding: 20px;
        border-bottom: 1px solid #EEEEEE;
        font-size: 15px;
        color: #333333;
      }
      .customer-detail-list {
        padding-bottom: 20px;
        li {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 13px;
          padding: 0 20px;
          .customer-detail-label {
            color: #999999;
            width: 150px;
          }
          .customer-detail-name {
            color: #555555;
            text-align: right;
          }
        }
      }
    }
    .customer-no-data {
      text-align: center;
      padding-top: 60px;
      img {
        width: 200px;
        height: auto;
      }
      .customer-no-data-tips {
        color: #B2B2B2;
        font-size: 14px;
      }
    }
  }
</style>
