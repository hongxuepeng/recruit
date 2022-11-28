<template>
  <div class="login">
    <div class="header">欢迎回来</div>
    <div class="login-form">
      <van-cell-group>
        <div class="login-form-title">手机号</div>
        <van-field v-model="form.phone"
                   clearable
                   maxlength="11"
                   type="number"
                   placeholder="请输入手机号码"/>
        <div class="login-form-title margin-top-20">验证码</div>
        <van-field v-model="form.code"
                   clearable
                   maxlength="6"
                   type="number"
                   class="code-btn"
                   placeholder="请输入验证码">
          <van-button slot="button"
                      size="small"
                      plain
                      round
                      color="#1976FA"
                      type="primary"
                      @click="checkSend"
                      v-if="!codeDisabled">{{codeText}}</van-button>
          <van-button slot="button"
                      size="small"
                      plain
                      disabled
                      round
                      color="#1976FA"
                      type="primary"
                      v-else>
            <van-count-down ref="countDown" :time="time" :auto-start="false" @finish="finished">
              <template v-slot="timeData">
                <small class="send-text">已发送</small>
                <span class="item">{{ timeData.seconds }}</span>
                <small>s</small>
              </template>
            </van-count-down>
          </van-button>
        </van-field>
      </van-cell-group>
      <div class="register">
        <span @click="register">注册</span>
        <span @click="forget"></span>
      </div>
      <div class="login-btn">
        <van-button size="large"
                    round
                    color="#1976FA"
                    @click="loginCheck"
                    v-if="!loading">登录</van-button>
        <van-button size="large"
                    loading
                    loading-text="登录中..."
                    disabled
                    round
                    color="#1976FA"
                    v-else></van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { saveUserCookie } from '@/libs/utils';
  import {
    CellGroup,
    Field,
    Button,
    Toast,
    Icon,
    CountDown
  } from 'vant';
  import { login, getCode } from "@/api/index";
  export default {
    name: "login",
    components: {
      [CellGroup.name]: CellGroup,
      [Field.name]: Field,
      [Button.name]: Button,
      [Toast.name]: Toast,
      [Icon.name]: Icon,
      [CountDown.name]: CountDown
    },
    data() {
      return {
        form: {
          phone: '',
          code: ''
        },
        reg: {
          mobile: /^1\d{10}$/,
          code: /^\d{6}$/,
          password: /^(\w){6,20}$/
        },
        loading: false,
        time: 60000,
        codeText: '发送验证码',
        codeDisabled: false,
      }
    },
    methods: {
      /**
       * 登录校验
       */
      loginCheck() {
        let { phone, code } = this.form
        if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else if (!code) {
          Toast('请输入验证码');
        } else if (!this.reg.code.test(code)) {
          Toast('请输入6位验证码');
        } else {
          this.login();
        }
      },
      /**
       * 提交登录
       */
      async login() {
        try {
          this.loading = true;
          let res = await login(this.form)
          if (+res.code === 1) {
            let { info } = res
            saveUserCookie(info.token, info.agentGuid, info);
            Toast.success('登录成功');
            this.redirect()
          }
        } finally {
          this.loading = false;
        }
      },
      /**
       * 重定向
       */
      redirect () {
        let redirect = this.$route.query.redirect;
        if (redirect && redirect !== '/reset') {
          this.$router.push({
            path: redirect
          });
        } else {
          this.$router.push('index');
        }
      },
      /**
       * 忘记密码
       */
      forget() {
        this.$router.push('forget');
      },
      register() {
        let redirect = this.$route.query.redirect;
        if (redirect) {
          this.$router.push({
            path: '/register',
            query: {
              redirect
            }
          });
        } else {
          this.$router.push('register')
        }
      },
      finished() {
        this.codeDisabled = false;
        this.codeText = '重新发送';
      },
      checkSend() {
        let phone = this.form.phone;
        if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else {
          this.sendCode();
        }
      },
      sendCode() {
        let params = {
          Phone: this.form.phone
        }
        getCode(params).then(res => {
          if (+res.code === 1) {
            this.codeDisabled = true;
            this.$nextTick(() => {
              this.$refs.countDown.start();
            });
          }
        });
      },
    },
    created() {
    },
    beforeRouteEnter (to, from, next) {
      window.document.body.className = 'screen login-bg';
      next();
    },
    beforeRouteLeave (to, from, next) {
      window.document.body.className = '';
      next();
    }
  }
</script>

<style lang="less" scoped>
  .login {
    width: 100%;
    font-size: 16px;
    padding: 0 22px;
  }
  .header {
    font-size: 30px;
    line-height: 30px;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    padding-bottom: 68px;
  }
  .login-form {
    padding: 30px 30px 58px 30px;
    background-color: #FFFFFF;
    border-radius: 8px;
    .login-form-title {
      font-weight: 500;
      font-size: 15px;
      line-height: 15px;
      color: #333333;
    }
    /deep/ .van-field__control {
      font-size: 14px;
    }
    .margin-top-20 {
      margin-top: 20px;
    }
    .login-btn {
      padding-top: 48px;
      font-weight: 400;
      .van-button--large {
        height: 42px;
      }
    }
    .register{
      margin-top: 15px;
      overflow: hidden;
      span {
        font-size: 12px;
        line-height: 12px;
        color: #999999;
        &:first-child {
          float: left;
          color: #1976FA;
        }
        &:last-child {
          float: right;
        }
      }
    }
    .login-question {
      text-align: center;
      font-size: 14px;
      line-height: 14px;
      .icon-question {
        position: relative;
        top: 3px;
        margin-right: 3px;
      }
    }
  }
  .van-cell {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 5px;
    font-size: 16px;
  }
  .van-loading__spinner {
    color: #fff!important;
  }
  .van-cell:not(:last-child)::after {
    left: 0;
  }
  .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border-top: none;
  }
  .code-btn {
    .van-button {
      height: 26px;
      line-height: 26px;
    }
  }
</style>
