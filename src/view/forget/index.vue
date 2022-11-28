<template>
  <div class="forget">
    <div class="header">
      忘记密码
    </div>
    <div class="login-form">
      <van-cell-group>
        <div class="login-form-title">手机号</div>
        <van-field v-model="form.phone"
                   clearable
                   maxlength="11"
                   type="number"
                   placeholder="请输入手机号码"/>
        <div class="login-form-title margin-top-20">新密码</div>
        <van-field v-model="form.newpwd"
                   clearable
                   type="password"
                   placeholder="请输入6-20个字母、数字、下划线"/>
        <div class="login-form-title margin-top-20">确认密码</div>
        <van-field v-model="form.confirmPassword"
                   clearable
                   type="password"
                   placeholder="请确认新密码"/>
        <div class="login-form-title margin-top-20">验证码</div>
        <van-field v-model="form.code"
                   clearable
                   maxlength="6"
                   type="number"
                   placeholder="请输入验证码">
          <van-button slot="button"
                      size="small"
                      plain
                      round
                      color="#B40900"
                      type="primary"
                      @click="checkSend"
                      v-if="!codeDisabled">{{codeText}}</van-button>
          <van-button slot="button"
                      size="small"
                      plain
                      disabled
                      round
                      color="#B40900"
                      type="primary"
                      v-else>
            <van-count-down ref="countDown"
                            :time="time"
                            :auto-start="false"
                            @finish="finished">
              <template v-slot="timeData">
                <small class="send-text">已发送</small>
                <span class="item">{{ timeData.seconds }}</span>
                <small>s</small>
              </template>
            </van-count-down>
          </van-button>
        </van-field>
      </van-cell-group>
      <div class="no-code">
        <span @click="noCode">无法收到验证码？</span>
      </div>
      <div class="login-btn">
        <van-button size="large"
                    round
                    color="#B40900"
                    @click="loginCheck"
                    v-if="!loading">确认</van-button>
        <van-button size="large"
                    loading
                    loading-text="提交中..."
                    disabled
                    round
                    color="#B40900"
                    v-else></van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    CellGroup,
    Field,
    Button,
    Toast,
    Icon,
    CountDown
  } from 'vant';
  import {
    forgetPassword,
    getCode
  } from "@/api/index";
  import { clearUserCookie } from '@/libs/utils';
  export default {
    name: "forget",
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
        time: 60000,
        codeText: '发送验证码',
        codeDisabled: false,
        form: {
          phone: '',
          newpwd: '',
          code: '',
          confirmPassword: ''
        },
        reg: {
          mobile: /^1\d{10}$/,
          code: /^\d{6}$/,
          password: /^(\w){6,20}$/
        },
        loading: false
      }
    },
    methods: {
      loginCheck() {
        let { phone, newpwd, code, confirmPassword } = this.form
        if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else if (!newpwd) {
          Toast('请输入密码');
        } else if (!this.reg.password.test(newpwd)) {
          Toast('密码需要输入6-20个字母、数字、下划线');
        } else if (!confirmPassword) {
          Toast('请输入确认密码');
        } else if (confirmPassword != newpwd) {
          Toast('两次密码输入不一致');
        } else if (!code) {
          Toast('请输入验证码');
        } else if (!this.reg.code.test(code)) {
          Toast('请输入6位验证码');
        } else {
          this.resetPassword();
        }
      },
      async resetPassword() {
        try {
          this.loading = true;
          let { phone, code, newpwd } = this.form
          let params = {
            phone,
            code,
            newpwd
          }
          let res = await forgetPassword(params)
          if (+res.code === 1) {
            Toast.success(res.data);
            clearUserCookie();
          }
        } finally {
          this.loading = false;
        }
      },
      checkSend() {
        let { phone } = this.form
        if (!phone) {
          Toast('请输入手机号码');
        } else if (!this.reg.mobile.test(phone)) {
          Toast('请输入正确手机号码');
        } else {
          this.sendCode();
        }
      },
      async sendCode() {
        let { phone } = this.form
        let res = await getCode({ phone })
        if (+res.code === 1) {
          this.codeDisabled = true;
          this.$nextTick(() => {
            this.$refs.countDown.start();
          });
        }
      },
      finished() {
        this.codeDisabled = false;
        this.codeText = '重新发送';
      },
      noCode() {
        this.$router.push('code-tips');
      }
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  .forget {
    font-size: 16px;
  }
  .header {
    font-size: 24px;
    font-weight: 400;
    color: #20252f;
    text-align: center;
    padding: 50px 0;
  }
  .login-form {
    padding: 0 30px;
    .login-form-title {
      font-weight: 400;
      font-size: 16px;
    }
    .margin-top-20 {
      margin-top: 20px;
    }
    .login-btn {
      padding: 45px 0 30px 0;
      font-weight: 400;
    }
    .register-login{
      margin-top: 25px;
      overflow: hidden;
      span {
        font-size: 16px;
        &:first-child {
          float: left;
          color: #266bf8;
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
    .van-count-down {
      color: #B40900;
    }
  }
  .send-text {
    margin-right: 3px;
  }
  .no-code {
    margin-top: 15px;
    overflow: hidden;
    span {
      font-size: 14px;
      float: right;
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
</style>
