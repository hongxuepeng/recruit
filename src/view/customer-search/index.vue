<template>
  <div class="customer-search">
    <div class="customer-search-tips">
      <van-icon name="warning-o" />
      <span>请输入要查询的客户手机号</span>
    </div>
    <div class="customer-search-form">
      <van-cell-group>
        <van-field v-model="tel"
                   maxlength="11"
                   type="number"
                   label="手机号"
                   placeholder="请输入手机号" />
      </van-cell-group>
    </div>
    <div class="customer-search-btn">
      <van-button type="primary"
                  :loading="loading"
                  color="#1976FA"
                  @click="handleSearch"
                  round
                  loading-text="查询中..."
                  block>查询</van-button>
    </div>
  </div>
</template>

<script>
  import {
    Icon,
    CellGroup,
    Field,
    Button,
    Toast
  } from 'vant';
  export default {
    components: {
      [Icon.name]: Icon,
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Button.name]: Button,
      [Toast.name]: Toast
    },
    data () {
      return {
        tel: '',
        loading: false,
        reg: {
          mobile: /^1\d{10}$/,
          code: /^\d{6}$/,
          password: /^(\w){6,20}$/
        },
      }
    },
    methods: {
      handleSearch () {
        if (!this.tel) {
          return Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(this.tel)) {
          return Toast('请输入正确手机号码');
        }
        this.$router.push(`/customer-detail/${this.tel}`)
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
  .customer-search {
    font-size: 13px;
    .customer-search-tips {
      padding: 12px 20px;
      background: #FEF4F3;
      display: flex;
      align-items: center;
      color: #666666;
      /deep/ .van-icon {
        font-size: 16px;
        margin-right: 6px;
      }
    }
    .customer-search-form {
      margin-top: 16px;
    }
    .customer-search-btn {
      padding: 0 10px;
      margin-top: 28px;
    }
  }
  /deep/ .van-list__error-text, .van-list__finished-text, .van-list__loading, .van-loading__text, .van-loading__spinner {
    color: #ffffff!important;
  }
</style>
