<template>
  <div class="rule-content">
    <div class="rule-box">
      <div class="rule-box-title">佣金规则</div>
      <div class="rule-box-content">佣金以您推荐的客户或您的一级、二级代理推广的客户产生的 借款金额进行计算，各城市的佣金规则由城市负责人依市场情 况进行制定。</div>
      <div class="rule-box-title">佣金结算</div>
      <div class="rule-box-content">
        <div>佣金结算请直接联系您的城市负责人。</div>
        <div>您所在的城市负责人联系方式为：</div>
        <div class="rule-phone">{{detail.phone}}</div>
      </div>
      <div class="rule-box-title">佣金比例</div>
      <table class="table">
        <thead class="commission-grade-item">
        <tr>
          <th>自身佣金</th>
          <th>分佣一级</th>
          <th>分佣二级</th>
        </tr>
        </thead>
        <tbody class="commission-grade-item">
        <tr>
          <td>{{detail.extensionRate || '-'}}</td>
          <td>{{detail.lowExtensionRate || '-'}}</td>
          <td>{{detail.lowLowExtensionRate || '-'}}</td>
        </tr>
        </tbody>
      </table>
      <div class="rule-tips">注：佣金比例将视市场情况不定期调整，敬请留意最新消息</div>
    </div>
  </div>
</template>

<script>
  import {
    getCommissionRules
  } from "@/api/index";
  import { getStorage } from '@/libs/utils';
  import {
    NoticeBar,
    Button
  } from 'vant';
  export default {
    name: "index",
    components: {
      [NoticeBar.name]: NoticeBar,
      [Button.name]: Button
    },
    data () {
      return {
        list: [
          {
            num: '业绩*3%',
            first: '一级业绩*0.2%',
            second: '二级业绩*0.1%'
          }
        ],
        detail: {},
        info: {}
      }
    },
    methods: {
      async getCommissionRules () {
        let res = await getCommissionRules()
        this.detail = res.info
      },
      handleAuth () {
        this.$router.push('enterprise');
      }
    },
    created () {
      this.info = getStorage('info')
      this.getCommissionRules()
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
  .rule-content {
    padding: 8px;
    .rule-box {
      background: #FFFFFF;
      box-shadow: 0px 1px 5px 0px rgba(125, 124, 124, 0.15);
      border-radius: 3px;
      padding: 0 10px;
      padding-top: 24px;
      .rule-box-title {
        position: relative;
        color: #333333;
        font-size: 14px;
        padding-left: 10px;
        margin-bottom: 18px;
        margin-top: 24px;
        &:first-child {
          margin-top: 0;
        }
        &:after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 10px;
          background: #1976FA;
        }
      }
      .rule-box-content {
        font-size: 12px;
        color: #666666;
        line-height: 21px;
        padding-bottom: 20px;
        border-bottom: 1px solid #CCCCCC;
      }
    }
    .table {
      border-spacing: 0;
      border-collapse: collapse;
      width: 100%;
      max-width: 100%;
      border: 1px solid #CCCCCC;
      border-left: 0;
      border-right: 0;
      font-size: 11px;
      th, td {
        padding: 10px 0;
        border: 1px solid #CCCCCC;
        text-align: center;
        color: #666666;
      }
      th {
        background: #FFF8F7;
      }
    }
    .table>thead:first-child>tr:first-child>th {
      border-top: 0;
    }
    .rule-tips {
      padding-top: 14px;
      padding-bottom: 17px;
      font-size: 11px;
      color: #AAAAAA;
    }
    .rule-phone {
      margin-top: 4px;
      font-size: 14px
    }
    .rule-not-real {
      background: #FFFFFF;
      box-shadow: 0px 1px 5px 0px rgba(125, 124, 124, 0.15);
      border-radius: 3px;
      padding-bottom: 20px;
      .rule-not-img {
        padding-top: 40px;
        padding-bottom: 40px;
        width: 100px;
        margin: auto;
        img {
          width: 100%;
        }
      }
      .rule-not-btn {
        padding: 0 20px;
      }
    }
  }
</style>
