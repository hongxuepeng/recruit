<template>
    <div class="join-register">
        <div class="join-register-title">
            <div class="title">推广赚取高额返佣</div>
            <div class="subtitle">
                <div>
                    <img src="@/assets/check.png">
                    <span>3分钟急速出额</span>
                </div>
                <div>
                    <img src="@/assets/check.png">
                    <span>最快当天放款</span>
                </div>
            </div>
        </div>
        <div class="join-box">
            <div class="login-form">
                <van-cell-group>
                    <div class="login-form-title">手机号</div>
                    <van-field
                            v-model="form.username"
                            clearable
                            maxlength="11"
                            type="number"
                            placeholder="请输入手机号"
                    />
                    <div class="login-form-title margin-top-20">验证码</div>
                    <van-field
                            v-model="form.code"
                            clearable
                            maxlength="6"
                            type="number"
                            placeholder="请输入验证码"
                    >
                        <van-button slot="button" size="small" plain round color="#B40900" type="primary" @click="checkSend" v-if="!codeDisabled">{{codeText}}</van-button>
                        <van-button slot="button" size="small" plain disabled round color="#B40900" type="primary" v-else>
                            <van-count-down ref="countDown" :time="time" :auto-start="false" @finish="finished">
                                <template v-slot="timeData">
                                    <small class="send-text">已发送</small>
                                    <span class="item">{{ timeData.seconds }}</span>
                                    <small>s</small>
                                </template>
                            </van-count-down>
                        </van-button>
                    </van-field>
                    <div class="login-form-title">密码</div>
                    <van-field
                            v-model="form.password"
                            clearable
                            :right-icon="rightIcon"
                            :type="passwordType"
                            @click-right-icon="openPassword"
                            placeholder="请输入6-20个字母、数字、下划线"
                    />
                </van-cell-group>
                <div class="login-btn">
                    <van-button size="large"  round color="#B40900" @click="loginCheck" v-if="!loading">马上加入</van-button>
                    <van-button size="large" loading loading-text="提交中..." disabled round color="#B40900" v-else></van-button>
                </div>
                <div class="login-tips">已有账号，去<span @click="login">登录</span>？</div>
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
        register,
        getCode
    } from "@/api/index";
    import { saveUserCookie } from '@/libs/utils';
    export default {
        name: "join-register",
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
                guid: this.$route.query.guid,
                time: 60000,
                codeText: '发送验证码',
                codeDisabled: false,
                rightIcon: 'closed-eye', // eye-o
                passwordType: 'password',
                loading: false,
                form: {
                    username: '',
                    password: '',
                    code: ''
                },
                reg: {
                    mobile: /^1\d{10}$/,
                    code: /^\d{6}$/,
                    password: /^(\w){6,20}$/
                },
            }
        },
        methods: {
            openPassword() {
                let type = this.passwordType;
                if (type === 'password') {
                    this.passwordType = 'text';
                    this.rightIcon = 'eye-o';
                } else {
                    this.passwordType = 'password';
                    this.rightIcon = 'closed-eye'
                }
            },
            loginCheck() {
                let username = this.form.username;
                let password = this.form.password;
                let code = this.form.code;
                if (!username) {
                    Toast('请输入手机号码');
                } else if (!this.reg.mobile.test(username)) {
                    Toast('请输入正确手机号码');
                } else if (!code) {
                    Toast('请输入验证码');
                } else if (!this.reg.code.test(code)) {
                    Toast('请输入6位验证码');
                }  else if (!password) {
                    Toast('请输入密码');
                } else if (!this.reg.password.test(password)) {
                    Toast('密码需要输入6-20个字母、数字、下划线');
                } else {
                    this.register();
                }
            },
            register() {
                this.loading = true;
                let params = {
                    phone: this.form.username,
                    code: this.form.code,
                    parentAgentGuid: this.guid,
                    pwd: this.form.password
                }
                register(params).then(res => {
                    this.loading = false;
                    if (+res.code === 1) {
                        Toast.success(res.msg);
                        let { info } = res
                        saveUserCookie(info.token, info.agentGuid, info);
                        this.$router.push('index');
                    }
                });
            },
            login() {
                this.$router.push('login');
            },
            checkSend() {
                let username = this.form.username;
                if (!username) {
                    Toast('请输入手机号码');
                } else if (!this.reg.mobile.test(username)) {
                    Toast('请输入正确手机号码');
                } else {
                    this.sendCode();
                }
            },
            sendCode() {
                let params = {
                    Phone: this.form.username
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
            finished() {
                this.codeDisabled = false;
                this.codeText = '重新发送';
            }
        },
        beforeRouteEnter (to, from, next) {
            window.document.body.style.backgroundColor = '#BE2728';
            next();
        },
        beforeRouteLeave (to, from, next) {
            window.document.body.style.backgroundColor = '';
            next();
        }
    }
</script>

<style lang="less" scoped>
    .join-register {
        background: url("../../assets/join_bg.png") no-repeat;
        background-size: 100% auto;
        padding-top: 90px;
    }
    .join-register-title {
        color: #FFF2EE;
        text-align: center;
        .title {
            font-size: 30px;
            font-weight: bold;
        }
        .subtitle {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 90%;
            font-size: 15px;
            margin: auto;
            margin-top: 30px;
            & > div {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            img {
                height: 7px;
                margin-right: 4px;
            }
        }
    }
    .join-img {
        text-align: center;
        img {
            width: 100%;
        }
    }
    .join-box {
        background: #fff;
        width: 90%;
        margin: auto;
        border-radius: 10px;
        margin-top: 40px;
    }
    .login-form {
        padding: 30px 30px 10px 30px;
        .login-form-title {
            font-weight: 500;
            font-size: 15px;
            color: #333333;
        }
        .margin-top-20 {
            margin-top: 20px;
        }
        .login-btn {
            padding: 35px 0 15px 0;
            font-weight: 600;
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
    .login-tips {
        text-align: center;
        font-size: 14px;
        padding-bottom: 15px;
        span {
            color: #B40900;
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
    .van-button--large {
        height: 48px;
        line-height: 48px;
    }
</style>
