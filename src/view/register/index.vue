<template>
    <div class="login">
        <div class="header">
            <div>欢迎加入</div>
            <div>河南同协人力</div>
        </div>
        <div class="header-tips">
            <span>客户永久绑定</span>
            <span>躺平拿收益</span>
        </div>
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
                                color="#FF6409"
                                type="primary"
                                @click="checkSend"
                                v-if="!codeDisabled">{{codeText}}</van-button>
                    <van-button slot="button"
                                size="small"
                                plain
                                disabled
                                round
                                color="#FF6409"
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
            <div class="login-btn">
                <van-button size="large"
                            round
                            color="#FF6409"
                            @click="registerCheck"
                            v-if="!loading">马上加入</van-button>
                <van-button size="large"
                            loading
                            loading-text="马上加入."
                            disabled
                            round
                            color="#FF6409"
                            v-else></van-button>
            </div>
            <div class="login-btn-tips">已有账号,去<span @click="$router.push('login')">登录</span>？</div>
        </div>
    </div>
</template>

<script>
    import { saveUserCookie, getSessionStorage } from '@/libs/utils';
    import {
        CellGroup,
        Field,
        Button,
        Toast,
        Icon,
        CountDown
    } from 'vant';
    import { register, getCode } from "@/api/index";
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
                    code: '',
                    parentAgentGuid: getSessionStorage('parentAgentGuid')
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
            registerCheck() {
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
                    this.register();
                }
            },
            /**
             * 提交登录
             */
            async register() {
                try {
                    this.loading = true;
                    let res = await register(this.form)
                    if (+res.code === 1) {
                        let { info } = res
                        saveUserCookie(info.token, info.agentGuid, info);
                        Toast.success('注册成功');
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
                    this.$router.push('my');
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
            window.document.body.className = 'screen login-bg register-bg';
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
        position: relative;
        top: -20px;
        width: 100%;
        font-size: 16px;
        padding: 0 22px;
    }
    .header {
        font-size: 30px;
        line-height: 50px;
        font-weight: 400;
        color: #FFFFFF;
        text-align: center;
        padding-bottom: 30px;
        & > div {
            &:first-child {
                font-size: 24px;
            }
        }
    }
    .header-tips {
        display: flex;
        justify-content: center;
        font-size: 15px;
        color: #FFFFFF;
        margin-bottom: 45px;
        span {
            background: url("../../assets/home/right.png") no-repeat center left;
            background-size: 14px auto;
            padding-left: 20px;
            &:last-child {
                margin-left: 48px;
            }
        }
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
            padding-top: 58px;
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
    .login-btn-tips {
        font-size: 12px;
        line-height: 12px;
        color: #999999;
        text-align: center;
        margin-top: 16px;
        span {
            color: #FF6409;
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
