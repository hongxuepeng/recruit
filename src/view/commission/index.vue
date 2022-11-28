<template>
    <div class="commission">
        <van-tabs v-model="activeName" color="#5f8bfd" animated :border="false">
            <van-tab name="uncollected">
                <div slot="title">
                    未领取
                </div>
                <div class="commission-box">
                    <div class="common-line"></div>
                    <div class="commission-text">未领取佣金</div>
                    <div class="commission-money">{{myMessage.fesidueBonus || 0}}元</div>
                    <div class="commission-btn" @click="receive">去领取</div>
                    <div class="common-tips">
                        <van-icon name="warning" class="common-warning-icon"/>
                        佣金领取后，将由工作人员审核后发放至支付宝账户
                    </div>
                </div>
            </van-tab>
            <van-tab name="distribution">
                <div slot="title" class="distribution-title">
                    发放中
                </div>
                <div class="commission-box commission-box-2">
                    <div class="common-line"></div>
                    <div class="commission-text">佣金发放中</div>
                    <div class="commission-money">{{myMessage.freezeBonus || 0}}元</div>
                    <div class="commission-btn commission-visibility"></div>
                    <div class="common-tips" style="padding: 0 25px;text-align: left;display: flex;margin-top: 20px">
                        <van-icon name="warning" class="common-warning-icon" style="margin-right: 3px;"/>
                       <span>该笔佣金正在审核中，请耐心等待。审核通过后，将直接发放至支付宝。</span>
                    </div>
                </div>
            </van-tab>
            <van-tab name="received">
                <div slot="title">
                    已领取
                </div>
                <div class="commission-box commission-box-3">
                    <div class="common-line"></div>
                    <div class="commission-text">已领取佣金</div>
                    <div class="commission-money">{{myMessage.withdrawBonus || 0}}元</div>
                    <div class="commission-btn commission-visibility"></div>
                    <div class="commission-record"><span @click="receivingRecords">佣金领取记录</span></div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import { getStorage } from '@/libs/utils';
    import {
        Icon,
        Tab,
        Tabs,
        Toast,
        Notify,
        NavBar,
        Dialog
    } from 'vant';
    import {
        getAgentMsg
    } from "@/api/index";
    export default {
        name: "commission",
        components: {
            [Icon.name]: Icon,
            [Tab.name]: Tab,
            [Tabs.name]: Tabs,
            [Toast.name]: Toast,
            [Notify.name]: Notify,
            [NavBar.name]: NavBar,
            [Dialog.name]: Dialog,
        },
        data() {
            return {
                agentGuid: getStorage('agentGuid'),
                activeName: 'a',
                myMessage: {},
                isFail: true
            }
        },
        methods: {
            receive() {
                let { fesidueBonus } = this.myMessage
                if (fesidueBonus && +fesidueBonus > 0) {
                    this.$router.push('receive');
                } else {
                    Toast('您暂无未领取佣金');
                }
            },
            receivingRecords() {
                this.$router.push('receiving-records');
            },
            getRecords() {
                this.$router.push('get-records');
            },
            async getMyMessage() {
                let res = await getAgentMsg()
                this.myMessage = res.info
            }
        },
        created() {
            this.getMyMessage();
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
    .commission {
        font-size: 16px;
        line-height: 1;
        /*padding-top: 46px;*/
        /*padding: 60px 15px 15px 15px;*/
    }
    .commission-box {
        background: #fff;
        padding-top: 105px;
        padding-bottom: 50px;
        /*height: 420px;*/
        box-sizing: border-box;
        background-image: url("../../assets/commission_icon1.png");
        &.commission-box-2 {
            background-image: url("../../assets/commission_icon2.png");
        }
        &.commission-box-3 {
            background-image: url("../../assets/commission_icon3.png");
        }
        background-size: 50px 50px;
        background-repeat: no-repeat;
        background-position: center top 25px;
        .commission-text {
            color: #999999;
            font-size: 18px;
            margin-top: 80px;
            font-weight: 600;
            text-align: center;
        }
        .commission-money {
            color: #333333;
            font-size: 24px;
            margin-top: 18px;
            font-weight: 600;
            text-align: center;
        }
        .commission-btn {
            text-align: center;
            background: #3a71ff;
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            height: 40px;
            line-height: 40px;
            width: 90%;
            margin: auto;
            margin-top: 60px;
            border-radius: 20px;
        }
        .commission-visibility {
            visibility: hidden;
        }
        .commission-fail-btn {
            margin-top: 30px;
            font-weight: 500;
        }
        .commission-record {
            text-align: center;
            color: #bbc7d7;
            font-weight: 600;
            font-size: 14px;
            margin-top: 20px;
            margin-bottom: 20px;
            span {
                text-decoration: underline;
            }
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
        margin-top: 40px;
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
    .van-nav-bar__text, .van-nav-bar .van-icon {
        color: #20252f;
    }
    .distribution-title {
        position: relative;
    }
    .distribution-num {
        display: inline-block;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        background: #e60012;
        color: #fff;
        border-radius: 50%;
    }
    .commission-fail-box {
        margin-top: 40px;
        .commission-fail-reson {
            font-size: 12px;
            padding: 0 20px;
            line-height: 16px;
            font-weight: 600;
            color: #20252f;
            margin-top: 25px;
        }
    }
    .commission-fail {
        text-align: center;
        color: #e60012;
        font-size: 18px;
        font-weight: 600;
        .common-error-icon {
            position: relative;
            top: 3px;
        }
    }
</style>
