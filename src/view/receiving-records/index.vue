<template>
    <div class="level">
        <div class="level-box">
            <van-row type="flex" align="center" class="level-header">
                <van-col span="12">已领取佣金</van-col>
                <van-col span="12">{{AllGrantMoney || 0}}元</van-col>
            </van-row>
            <div class="common-line"></div>
            <div class="level-title">
                <b>领取记录</b>
            </div>
            <van-list v-model="loading"
                      :finished="finished"
                      finished-text="没有更多了"
                      @load="onLoad">
                <div class="level-list">
                    <van-row class="level-th">
                        <van-col span="8">提取时间</van-col>
                        <van-col span="8" class="level-center">发放时间</van-col>
                        <van-col span="8" class="level-right">领取金额</van-col>
                    </van-row>
                    <van-row class="level-td" v-for="(item, index) in list" :key="index">
                        <van-col span="8">{{item.applyTime}}</van-col>
                        <van-col span="8" class="level-center">{{item.sendTime}}</van-col>
                        <van-col span="8" class="level-right">{{item.money}}元</van-col>
                    </van-row>
                </div>
            </van-list>
        </div>
    </div>
</template>

<script>
    import {
        getMyDiscountRecord
    } from "@/api/index";
    import { getStorage } from '@/libs/utils';
    import {
        Row,
        Col,
        List,
        Icon,
        NavBar
    } from 'vant';
    export default {
        name: "receiving-records",
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [List.name]: List,
            [Icon.name]: Icon,
            [NavBar.name]: NavBar,
        },
        data() {
            return {
                Guid: getStorage('agentGuid'),
                list: [],
                loading: false,
                finished: false,
                pageIndex: 1,
                pageSize: 20,
                AllGrantMoney: ''
            }
        },
        methods: {
            onClickLeft() {
                this.$router.go(-1);
            },
            async onLoad() {
                try {
                    let params = {
                        agentGuid: this.Guid,
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    }
                    let res = await getMyDiscountRecord(params)
                    if (+res.code === 1) {
                        this.list = [...this.list, ...res.info.list]
                        this.AllGrantMoney = res.info.withdrawBonus
                        this.loading = false
                        let totalPage = res.info.pageCount || 1
                        if (this.pageIndex >= totalPage) {
                            this.finished = true
                            return
                        }
                        this.pageIndex++
                    } else {
                        this.loading = false
                        this.finished = true
                    }
                } catch (e) {
                    this.loading = false
                    this.finished = true
                }
            }
        },
        created() {
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
    .level {
        font-size: 16px;
        line-height: 1;
        padding: 15px;
        .level-box {
            background: #fff;
            background-image: url("../../assets/level_icon1.png");
            background-repeat: no-repeat;
            background-size: 71px 71px;
            background-position: center top 15px;
            .level-header {
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
            .level-title {
                position: relative;
                height: 50px;
                line-height: 50px;
                padding: 0 24px;
                margin-top: 20px;
                b {
                    font-size: 18px;
                    color: #20252f;
                    font-weight: 600;
                }
                span {
                    position: absolute;
                    right: 24px;
                    top: 15px;
                    display: inline-block;
                    font-size: 14px;
                    height: 20px;
                    line-height: 21px;
                    padding: 0 10px;
                    background: #bbc7d7;
                    color: #fff;
                    border-radius: 10px;
                }
            }
            .level-list {
                padding: 0 24px;
                font-size: 14px;
                .level-th {
                    padding: 10px 0;
                    font-weight: 600;
                    color: #bbc7d7;
                    border-top: 1px solid #f2f3f4;
                    border-bottom: 1px solid #f2f3f4;
                }
                .level-td {
                    padding: 25px 0;
                    border-bottom: 1px solid #f2f3f4;
                    color: #5f6c83;
                    font-weight: 600;
                }
                .level-center {
                    text-align: center;
                }
                .level-right {
                    text-align: right;
                }
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
        margin-top: 30px;
        color: #bbc7d7;
        .common-warning-icon {
            position: relative;
            top: 2px;
        }
    }
    .van-nav-bar__text, .van-nav-bar .van-icon {
        color: #20252f;
    }
</style>
