<template>
    <div class="agent">
        <div class="agent-bg">
            <div class="agent-header">
                <form action="/">
                    <van-search placeholder="输入姓名/手机号搜索" v-model="value" @search="onSearch"/>
                </form>
                <van-row class="agent-grid">
                    <van-col span="8">
                        <img src="@/assets/agent/agent_icon1.png" alt="">
                        <div class="agent-grid-text">代理总数</div>
                        <div class="agent-grid-num">{{proxyCount.agentCount || 0}}</div>
                    </van-col>
                    <van-col span="8">
                        <img src="@/assets/agent/agent_icon2.png" alt="">
                        <div class="agent-grid-text">一级代理</div>
                        <div class="agent-grid-num">{{proxyCount.lowAgentCount || 0}}</div>
                    </van-col>
                    <van-col span="8">
                        <img src="@/assets/agent/agent_icon3.png" alt="">
                        <div class="agent-grid-text">二级代理</div>
                        <div class="agent-grid-num">{{proxyCount.lowLowAgentCount || 0}}</div>
                    </van-col>
                </van-row>
                <div class="agent-btn" @click="codeShow">添加代理</div>
            </div>
        </div>
        <div class="agent-content-box">
            <div class="agent-content">
                <ul class="agent-tab">
                    <li v-for="(item, index) in tabList"
                        :key="index"
                        :class="{'active':index == checkIndex }"
                        @click="changeTab(index, item.type)">{{item.name}}</li>
                    <li :class="[TimeDesc ? 'agent-date-btn active' : 'agent-date-btn']" @click="changeTimeDesc">
                        <span>按时间排序</span>
                        <van-icon name="sort" />
<!--                        <div class="sort-icon"></div>-->
                    </li>
                </ul>
                <van-list
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onLoad"
                >
                    <div class="agent-list">
                        <van-row class="agent-th">
                            <van-col span="3">姓名</van-col>
                            <van-col span="6">手机号</van-col>
                            <van-col span="5">加入时间</van-col>
                            <van-col span="5">本月佣金</van-col>
                            <van-col span="5">累计佣金</van-col>
                        </van-row>
                        <van-row class="agent-td" v-for="(item, index) in list" :key="index">
                            <van-col span="3">{{item.name}}</van-col>
                            <van-col span="6">{{item.phone}}</van-col>
                            <van-col span="5">{{item.time}}</van-col>
                            <van-col span="5">{{item.monthAllCommission}}</van-col>
                            <van-col span="5">{{item.allCommission}}</van-col>
                        </van-row>
                    </div>
                </van-list>
            </div>
        </div>
        <div class="shareImg">
            <compose-img ref="composeImg"></compose-img>
        </div>
    </div>
</template>

<script>
    import composeImg from '@/components/ageentImg.vue'
    import {
        Row,
        Col,
        List,
        Cell,
        Toast,
        Search,
        Icon,
        Dialog
    } from 'vant';
    import {
        getMyProxyCount,
        getMyProxyList
    } from "@/api/index";
    import { unitConversion, getStorage } from '@/libs/utils';
    export default {
        name: "agent",
        components: {
            [Row.name]: Row,
            [Col.name]: Col,
            [List.name]: List,
            [Cell.name]: Cell,
            [Toast.name]: Toast,
            [Search.name]: Search,
            [Icon.name]: Icon,
            [Dialog.name]: Dialog,
            composeImg
        },
        data() {
            return {
                value: '', // 搜索内容
                loading: false,
                finished: false,
                tabList: [{
                    type: 1,
                    name: '一级'
                }, {
                    type: 2,
                    name: '二级'
                }],
                list: [],
                Level: 1,
                pageIndex: 0,
                pageSize: 20,
                checkIndex: 0,
                proxyCount: {},
                TimeDesc: false,
                info: {}
            }
        },
        methods: {
            onSearch() {
                this.resetData();
            },
            onLoad() {
                // 异步更新数据
                this.finished = false;
                this.pageIndex++;
                this.getMyProxyList();
            },
            changeTab (index, type) {
                this.checkIndex = index;
                if (this.Level != type) {
                    this.Level = type;
                    this.value = '';
                    this.pageIndex = 0;
                    this.list = [];
                    this.onLoad();
                }
            },
            getMyProxyCount() {
                let params = {}
                getMyProxyCount(params).then(res => {
                    if (+res.code === 1) {
                        this.proxyCount = res.info;
                    }
                });
            },
            getMyProxyList() {
                this.loading = true;
                let params = {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    grade: this.Level,
                    key: this.value,
                    isasc: this.TimeDesc
                }
                getMyProxyList(params).then(res => {
                    if (+res.code === 1) {
                        this.list = this.list.concat(res.info.agentList);
                        // 加载状态结束
                        this.loading = false;
                        // 数据全部加载完成
                        if (res.info.agentList.length < this.pageSize) {
                            this.finished = true;
                        }
                    }
                });
            },
            codeShow() {
                this.$refs.composeImg.loadImg();
                // if (!this.info.name) {
                //     Dialog.confirm({
                //       title: '温馨提示',
                //       message: ' 您还没实名认证，如果要发展代理或者进行产品推广，需要先进行实名认证才可以。',
                //       confirmButtonColor: '#1976FA'
                //     }).then(() => {
                //       this.$router.push('information');
                //     })
                // } else {
                //     this.$refs.composeImg.loadImg();
                // }
            },
            resetData() {
                this.list = [];
                this.pageIndex = 0;
                this.onLoad();
            },
            unit(number) {
                if (number > 1000) {
                    return unitConversion(number) + '万'
                } else {
                    return number
                }
            },
            changeTimeDesc() {
                this.TimeDesc = !this.TimeDesc;
                this.resetData();
            }
        },
        created () {
            this.info = getStorage('info')
            window.scrollTo(0,0);
            this.getMyProxyCount();
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

<style scoped lang="less">
    .agent {
        font-size: 16px;
        line-height: 1;
        padding-bottom: 70px;
    }
    .agent-bg {
        background: url("../../assets/agent/agent_bg.png") no-repeat;
        background-size: 100% 100%;
        padding: 30px 8px 0 8px;
        /deep/ .van-icon {
            color: #AAAAAA;
        }
        .agent-header {
            height: 100%;
            width: 100%;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0px 3px 5px 0px rgba(4, 0, 0, 0.16);
            overflow: hidden;
            .van-search__content {
                border-radius: 10px;
            }
        }
        .agent-grid {
            text-align: center;
            color: #20252f;
            font-size: 14px;
            margin-top: 13px;
            img {
                height: 32px;
            }
            .agent-grid-text {
                margin-top: 5px;
            }
            .agent-grid-num {
                font-weight: 600;
                margin-top: 15px;
            }
        }
        .agent-btn {
            border-radius: 10px;
            background: #1976FA;
            height: 35px;
            line-height: 35px;
            width: 85%;
            margin: 20px auto 22px auto;
            color: #fff;
            font-size: 15px;
            font-weight: 400;
            text-align: center;
        }
    }
    .agent-content-box {
        padding: 0 10px;
    }
    .agent-content {
        margin-top: 15px;
        background: #fff;
        font-size: 14px;
        box-shadow: 0px 1px 5px 0px rgba(125, 124, 124, 0.15);
        border-radius: 5px;
        .agent-tab {
            overflow: hidden;
            padding-top: 15px;
            padding-bottom: 20px;
            li {
                float: left;
                width: 60px;
                height: 28px;
                line-height: 26px;
                text-align: center;
                border: 1px solid #1976FA;
                border-radius: 14px;
                margin-left: 15px;
                color: #1976FA;
                .van-icon-sort {
                    position: relative;
                    top: 1px;
                    font-weight: 300;
                    font-size: 12px;
                    margin-left: 2px;
                }
                &.active {
                    background: #1976FA;
                    border-color: #1976FA;
                    color: #fff;
                }
                &.agent-date-btn {
                    width: auto;
                    float: right;
                    margin-right: 20px;
                    color: #AAAAAA;
                    font-size: 12px;
                    border: none;
                    display: flex;
                    align-items: center;
                    line-height: 28px;
                    .sort-icon {
                        width: 12px;
                        height: 12px;
                        background: url("../../assets/sort.png") no-repeat;
                        background-size: 100%;
                    }
                    &.active {
                        color: #1976FA;
                        background: transparent;
                        border-color: transparent;
                        .sort-icon {
                            background: url("../../assets/sort_s.png") no-repeat;
                            background-size: 100%;
                        }
                    }
                }
            }
        }
        .agent-list {
            padding: 0 15px;
            color: #20252f;
            .van-col--6, .van-col--5 {
                text-align: center;
            }
            .agent-th {
                font-weight: 400;
                font-size: 13px;
                color: #333333;
                .van-col {
                    padding-bottom: 8px;
                    border-bottom: 1px solid #f5f5f5;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    line-height: 21px;
                }
            }
            .agent-td {
                .van-col {
                    height: 38px;
                    line-height: 38px;
                    font-size: 11px;
                    border-bottom: 1px solid #f5f5f5;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>
