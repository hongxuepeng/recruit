<template>
  <div class="rule-content">
    <div class="rule-box">
      <div class="rule-box-theme">活动详情：</div>
      <div class="rule-box-title">一、参与对象</div>
      <div class="rule-box-content">河南同协人力用户</div>
      <div class="rule-box-title">二、活动介绍</div>
      <div class="rule-box-content">
        <div>用户通过邀请客户和代理获得佣金，客户和代理关系一经绑定，<span>如无特殊情况，将会永久绑定。</span>且自己名下客户和代理客户每次进厂，依据总部结算规则，进行相应结算。即收益=推荐客户收益+一级代理提成+二级代理提成。</div>
        <div style="margin: 5px 0"><span>注：客户以身份证号码作为绑定标识，一二级以手机号码作为绑定标识</span></div>
        举例如下：<br>
        A：张三  B:李四 C：王五<br>
        假设A邀请B，B邀请C，那么B为A的一级代理，C为A的二级代理，客户符合结算要求的情况下，总利润为1000；代理提成为100，邀请客户提成800<br>
        ①C邀请客户：<br>
        A提成=100；B提成=100；C提成=800<br>
        ②B邀请客户；<br>
        A提成=100；B提成=800<br>
        ③A邀请客户<br>
        A提成=800<br>
        ④如C邀请的客户再次进厂，提成不变的情况下<br>
        那么A提成合计=200；B提成合计=200；C提成合计=1600<br>
      </div>
      <div class="rule-box-title">三、活动时间</div>
      <div class="rule-box-content">本活动长期有效，活动结束前将会通过本规则告用户</div>
      <div class="rule-box-title">四、佣金规则</div>
      <div class="rule-box-content">
        1.	佣金以您推荐的客户或您的一级、二级推广的客户进行计算，不同企业的客户的佣金规则由总部依市场情况进行制定。<br>
        2.	您推荐的客户将永久是您的资产，客户每次通过我司进厂，都会产生收益。<br>
        3.	您的一级、二级也永久是您的资产，一二级推广的客户，客户每次通过我司进厂，同步都会产生收益。<br>
        4.	客户一经绑定，在我司系统里将成为您的永久客户，如无特殊情况，绑定关系不会撤销。<br>
      </div>
      <div class="rule-box-title">五、佣金结算</div>
      <div class="rule-box-content">佣金结算请直接联系您的专属客服，客服电话：13283835080（同微信）</div>
      <div class="rule-box-title">六、佣金比例</div>
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
      <div class="rule-tips">本活动的最终解释权归公司所有</div>
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
      .rule-box-theme {
        font-size: 16px;
      }
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
        span {
          color: #1976FA;
        }
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
