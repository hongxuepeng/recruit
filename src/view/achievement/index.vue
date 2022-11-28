<template>
  <div class="achievement">
    <div class="achievement-header">
      <div class="achievement-statistics">
        <div class="achievement-statistics-box">
          <van-row class="achievement-grid">
            <van-col span="8">
              <div>上月佣金</div>
              <div class="grid-money">{{allLoan.teamLastMonthCommission || 0}}元</div>
            </van-col>
            <van-col span="8">
              <div>本月佣金</div>
              <div class="grid-money">{{allLoan.teamThisMonthCommission || 0}}元</div>
            </van-col>
            <van-col span="8">
              <div>总佣金</div>
              <div class="grid-money">{{allLoan.teamAllCommission || 0}}元</div>
            </van-col>
          </van-row>
          <div class="achievement-tips">
            <van-icon name="warning-o" class="achievement-warning-icon"/>
            <span>此处总佣金 = 自身业绩提成 + 一级提成 + 二级提成</span>
          </div>
        </div>
      </div>
    </div>
    <div class="achievement-box">
      <div class="achievement-list">
        <div class="achievement-list-header">
          <span>我的业绩</span>
          <small @click="viewDetail(0)">查看详情<van-icon name="arrow" class="arrow-icon"/></small>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3" class="achievement-icon"></van-col>
            <van-col span="5">待面试</van-col>
            <van-col span="5">在职</van-col>
            <van-col span="5">已离职</van-col>
            <van-col span="6">佣金</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">昨日</van-col>
            <van-col span="5">{{allLoan.myYestodayMs || 0}}</van-col>
            <van-col span="5">{{allLoan.myYestodayZz || 0}}</van-col>
            <van-col span="5">{{allLoan.myYestodayLz || 0}}</van-col>
            <van-col span="6">{{allLoan.myYestodayYj || 0}}元</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">本月</van-col>
            <van-col span="5">{{allLoan.myThisMontyMs || 0}}</van-col>
            <van-col span="5">{{allLoan.myThisMontyZz || 0}}</van-col>
            <van-col span="5">{{allLoan.myThisMontyLz || 0}}</van-col>
            <van-col span="6">{{allLoan.myThisMontyYj || 0}}元</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">累计</van-col>
            <van-col span="5">{{allLoan.MyAllMs || 0}}</van-col>
            <van-col span="5">{{allLoan.MyAllZz || 0}}</van-col>
            <van-col span="5">{{allLoan.MyAllLz || 0}}</van-col>
            <van-col span="6">{{allLoan.myAllCommission || 0}}元</van-col>
          </van-row>
        </div>
      </div>
      <div class="achievement-list">
        <div class="achievement-list-header">
          <span>一级业绩</span>
          <small @click="viewDetail(1)">查看详情<van-icon name="arrow" class="arrow-icon"/></small>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3" class="achievement-icon"></van-col>
            <van-col span="5">待面试</van-col>
            <van-col span="5">在职</van-col>
            <van-col span="5">已离职</van-col>
            <van-col span="6">佣金</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">昨日</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelYestodayMs || 0}}</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelYestodayZz || 0}}</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelYestodayLz || 0}}</van-col>
            <van-col span="6">{{oneLevelLoan.myOneLevelYestodayYj || 0}}元</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">本月</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelThisMonthMs || 0}}</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelThisMonthZz || 0}}</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelThisMonthLz || 0}}</van-col>
            <van-col span="6">{{oneLevelLoan.myOneLevelThisMonthYj || 0}}元</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">累计</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelALLLoanMs || 0}}</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelALLLoanZz || 0}}</van-col>
            <van-col span="5">{{oneLevelLoan.myOneLevelALLLimitLz || 0}}</van-col>
            <van-col span="6">{{oneLevelLoan.myOneLevelALLLimitYj || 0}}元</van-col>
          </van-row>
        </div>
      </div>
      <div class="achievement-list">
        <div class="achievement-list-header">
          <span>二级业绩</span>
          <small @click="viewDetail(2)">查看详情<van-icon name="arrow" class="arrow-icon"/></small>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3" class="achievement-icon"></van-col>
            <van-col span="5">待面试</van-col>
            <van-col span="5">在职</van-col>
            <van-col span="5">已离职</van-col>
            <van-col span="6">佣金</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">昨日</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelYestodayMs || 0}}</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelYestodayZz || 0}}</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelYestodayLz || 0}}</van-col>
            <van-col span="6">{{twoLevelLoan.myTwoLevelYestodayYj || 0}}元</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">本月</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelThisMonthMs || 0}}</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelThisMonthZz || 0}}</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelThisMonthLz || 0}}</van-col>
            <van-col span="6">{{twoLevelLoan.myTwoLevelThisMonthYj || 0}}元</van-col>
          </van-row>
        </div>
        <div class="achievement-list-item">
          <van-row>
            <van-col span="3">累计</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelALLLoanMs || 0}}</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelALLLoanZz || 0}}</van-col>
            <van-col span="5">{{twoLevelLoan.myTwoLevelALLLimitLz || 0}}</van-col>
            <van-col span="6">{{twoLevelLoan.myTwoLevelALLLimitYj || 0}}元</van-col>
          </van-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Icon,
    Row,
    Col
  } from 'vant';
  import {
    getMyLoanAndAllLoan,
    getMyOneLevelLoan,
    getMyTwoLevelLoan
  } from "@/api/index";
  export default {
    name: "achievement",
    components: {
      [Icon.name]: Icon,
      [Row.name]: Row,
      [Col.name]: Col
    },
    data() {
      return {
        allLoan: {},
        oneLevelLoan: {},
        twoLevelLoan: {}
      }
    },
    methods: {
      viewDetail(type) {
        this.$router.push({
          path: '/achievement-detail',
          query: {
            type: type
          }
        })
      },
      async getMyLoanAndAllLoan () {
        let res = await getMyLoanAndAllLoan()
        if (+res.code === 1) {
          this.allLoan = res.info
        }
      },
      async getMyOneLevelLoan () {
        let res = await getMyOneLevelLoan()
        if (+res.code === 1) {
          this.oneLevelLoan = res.info
        }
      },
      async getMyTwoLevelLoan () {
        let res = await getMyTwoLevelLoan()
        if (+res.code === 1) {
          this.twoLevelLoan = res.info
        }
      },
      myGrade () {
        this.$router.push('rule')
      }
    },
    created() {
      window.scrollTo(0,0);
      this.getMyLoanAndAllLoan()
      this.getMyOneLevelLoan()
      this.getMyTwoLevelLoan()
    },
    mounted() {
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

<style scoped lang="less">
  .achievement {
    font-size: 16px;
    line-height: 1;
    padding-bottom: 44px;
    background: url("../../assets/achievement/achievement_bg.png") no-repeat;
    background-size: 100% auto;
  }
  .achievement-header {
    position: relative;
    padding-top: 44px;
    .achievement-text {
      text-align: center;
      font-size: 14px;
      color: #ffffff;
    }
    .achievement-money {
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #fff;
      margin-top: 16px;
      margin-bottom: 20px;
    }
    .achievement-statistics {
      padding: 0 10px;
      .achievement-statistics-box{
        padding: 20px 0;
        background: #fff;
        border-radius: 5px;
        -webkit-box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
        box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
        .achievement-grid {
          text-align: center;
          font-size: 13px;
          color: #666666;
          .grid-money {
            margin-top: 15px;
            font-weight: 400;
            color: #333333;
            font-size: 15px;
          }
          .grid-yellow {
            font-size: 12px;
            color: #B40900;
          }
        }
        .achievement-tips {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          margin-top: 19px;
          color: #bbc7d7;
          .van-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }
  .achievement-box {
    padding: 14px 10px 0 10px;
    .achievement-list {
      background: #fff;
      padding-bottom: 10px;
      margin-bottom: 10px;
      box-shadow: 0px 1px 7px 0px rgba(125, 124, 124, 0.15);
      border-radius: 7px;
      &:last-child {
        margin-bottom: 0;
      }
      .achievement-list-header {
        position: relative;
        padding: 15px 12px;
        border-bottom: 1px solid #f5f5f5;
        margin-bottom: 5px;
        span {
          color: #333333;
          font-size: 15px;
          font-weight: 400;
        }
        small {
          position: absolute;
          right: 18px;
          bottom: 12px;
          font-size: 14px;
          color: #1976FA;
        }
        .arrow-icon {
          position: relative;
          top: 2px;
        }
      }
      .achievement-list-item {
        padding: 8px 18px;
        text-align: center;
        font-size: 13px;
        color: #20252f;
        .achievement-icon {
          position: relative;
          img {
            position: absolute;
            left: 0;
            top: -13px;
            height: 20px;
          }
        }
      }
    }
  }
</style>
