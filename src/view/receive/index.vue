<template>
    <div class="receive">
        <div class="receive-box">
            <van-row type="flex" align="center" class="receive-header">
                <van-col span="12">可领取佣金</van-col>
                <van-col span="12">{{ResidueBonus || 0}}元</van-col>
            </van-row>
            <div class="common-line"></div>
            <div class="login-form">
                <van-cell-group>
                    <div class="login-form-title margin-top-20">领取金额</div>
                    <van-field
                            v-model="form.paymentAmount"
                            clearable
                            type="number"
                            placeholder="请输入领取金额"
                    >
                        <span slot="button" class="receive-all" @click="receiveAll">全部领取</span>
                    </van-field>
                    <div class="login-form-title margin-top-20">支付宝姓名</div>
                    <van-field
                            v-model="form.alipayName"
                            clearable
                            placeholder="请输入支付宝姓名"
                    />
                    <div class="login-form-title margin-top-20">支付宝账号</div>
                    <van-field
                            v-model="form.alipayAccount "
                            clearable
                            placeholder="请输入支付宝账号"
                    />
                </van-cell-group>
                <div class="receive-tips">您可以绑定支付宝账户，若尚未绑定可前往“我的”-“绑定支付宝”处绑定固定账号。</div>
                <div class="login-btn">
                    <van-button size="large"  round color="#266bf8" @click="confirm" v-if="!loading">确认</van-button>
                    <van-button size="large" loading loading-text="提交中..." disabled round color="#266bf8" v-else></van-button>
                </div>
                <div class="common-tips">
                    <van-icon name="warning" class="common-warning-icon"/>
                    佣金将发放至您填写的支付宝账号，请认真核对
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Row,
        Col,
        Toast,
        Icon,
        NavBar,
        Field,
        Button,
        Dialog,
        Notify,
        CellGroup,
    } from 'vant';
    import { getStorage } from '@/libs/utils';
    import {
        getAgentMsg,
        getMyAliPayNum,
        applyDiscountRecord
    } from "@/api/index";
    export default {
        name: "receive",
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [Toast.name]: Toast,
            [Icon.name]: Icon,
            [NavBar.name]: NavBar,
            [Field.name]: Field,
            [Button.name]: Button,
            [Dialog.name]: Dialog,
            [Notify.name]: Notify,
            [CellGroup.name]: CellGroup,
        },
        data() {
            return {
                ResidueBonus: 0,
                form: {
                    paymentAmount: '',
                    alipayName: '',
                    alipayAccount: '',
                    AliPayID: 0
                },
                Iscer: false,
                loading: false,
                agentGuid: getStorage('agentGuid')
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            receiveAll() {
                this.form.paymentAmount = this.ResidueBonus;
            },
            confirm() {
                if (this.ResidueBonus <= 0) {
                    Toast('您暂无可领取佣金');
                } else if (!this.form.paymentAmount) {
                    Toast('请输入领取金额');
                } else if (!this.form.alipayName) {
                    Toast('请输入支付宝姓名');
                } else if (!this.form.alipayAccount) {
                    Toast('请输入支付宝账号');
                } else if (this.form.paymentAmount > this.ResidueBonus) {
                    Toast('输入的领取金额大于可领取金额，请重新填写');
                } else {
                    Dialog.confirm({
                        title: '领取提示',
                        message: '你确认要领取佣金吗？'
                    }).then(() => {
                        this.applyDiscountRecord();
                    }).catch(() => {
                        // on cancel
                    });
                }
            },
            getMyAliPayNum() {
                let params = {
                    agentGuid: this.agentGuid
                }
                getMyAliPayNum(params).then(res => {
                    if (+res.code === 1) {
                        this.form.alipayName = res.info.name;
                        this.form.alipayAccount = res.info.aliPayNumber	;
                    }
                })
            },
            getMyMessage() {
                let params = {
                    agentGuid: this.agentGuid
                }
                getAgentMsg(params).then(res => {
                    if (+res.code === 1) {
                        this.ResidueBonus = res.info.fesidueBonus
                    }
                });
            },
            applyDiscountRecord() {
                this.loading = true;
                let params = {
                    agentGuid: this.agentGuid,
                    name: this.form.alipayName,
                    aLiPayNumber: this.form.alipayAccount,
                    discountCount: this.form.paymentAmount
                }
                applyDiscountRecord(params).then(res => {
                    this.loading = false;
                    if (+res.code === 1) {
                        Toast.success(res.msg || '申请成功');
                        this.$router.push('commission');
                    }
                });
            }
        },
        created() {
            this.getMyMessage();
            this.getMyAliPayNum();
        },
        beforeRouteEnter (to, from, next) {
            window.document.body.style.backgroundColor = '#F5F5F5';
            next();
        },
        beforeRouteLeave (to, from, next) {
            window.document.body.style.backgroundColor = '';
            next();
        }
    }
</script>

<style lang="less" scoped>
    .receive {
        font-size: 16px;
        padding: 15px;
        .receive-box {
            background: #fff;
            .receive-header {
                height: 90px;
                .van-col {
                    font-size: 18px;
                    color: #20252f;
                    font-weight: 600;
                    &:first-child {
                        padding-left: 24px;
                    }
                    &:last-child {
                        text-align: right;
                        padding-right: 24px;
                    }
                }
            }
        }
    }
    .login-form {
        padding: 0 24px;
        .login-form-title {
            font-weight: 600;
            font-size: 16px;
        }
        .margin-top-20 {
            margin-top: 20px;
        }
        .receive-tips {
            font-size: 12px;
            color: #bbc7d7;
            margin-top: 18px;
        }
        .login-btn {
            padding: 45px 0 30px 0;
            font-weight: 600;
            .van-button--large {
                height: 40px;
                line-height: 40px;
            }
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
            color: #266bf8;
        }
    }
    .common-line {
        position: relative;
        border-bottom: 1px dotted #f2f3f4;
        &:before {
            content: '';
            position: absolute;
            left: -7px;
            top: -7px;
            height: 15px;
            width: 15px;
            background: #F5F5F5;
            border-radius: 50%;
        }
        &:after {
            content: '';
            position: absolute;
            right: -7px;
            top: -7px;
            height: 15px;
            width: 15px;
            background: #F5F5F5;
            border-radius: 50%;
        }
    }
    .common-tips {
        text-align: center;
        font-size: 12px;
        font-weight: normal;
        padding-bottom: 30px;
        color: #bbc7d7;
        span {
            display: inline-block;
            line-height: 16px;
        }
        .common-warning-icon {
            position: relative;
            top: 2px;
        }
    }
    .receive-all {
        color: #3a71ff;
        font-weight: 600;
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
    .van-nav-bar__text, .van-nav-bar .van-icon {
        color: #20252f;
    }
</style>
