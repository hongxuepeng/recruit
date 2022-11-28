import {router} from "../router";
import wx from "weixin-js-sdk";



/*
 * 微信分享
 * 获取微信加签信息
 * @param{data}:获取的微信加签
 * @param{shareData}:分享配置参数
 */
export const wexinShare = (data, shareData) => {
    // var wx = require('weixin-js-sdk') || window['wx'];
    let { appId, timestamp, noncestr, signature } = data
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。（测试记得关掉）
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function() {
        wx.checkJsApi({
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                console.log(res, 'checkJsApi')
            }
        });
        // //分享到朋友圈”及“分享到QQ空间”
        wx.updateTimelineShareData({
            title: shareData.title, // 分享标题
            link: shareData.link + '&t=' + timestamp + '&Content=1', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareData.imgUrl, // 分享图标
            success: function(res) {
                // 设置成功
                console.log("分享朋友圈成功返回的信息为:", res);
            }
        })

        //“分享给朋友”及“分享到QQ”
        wx.updateAppMessageShareData({
            title: shareData.title, // 分享标题
            desc: shareData.desc, // 分享描述
            link: shareData.link + '&t=' + timestamp + '&Content=1', // 分享链接 该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareData.imgUrl, // 分享图标
            success: function(res) {
                console.log("分享朋友成功返回的信息为:", res);
            }
        })

    });
    wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('验证失败返回的信息:', res);
    });
}

// 清除登录信息
export const clearUserCookie = () => {
    setStorage('token', '');
    setStorage('agentGuid', '');
    setStorage('info', '')
    router.push({
        path: '/login',
        query: {
            redirect: router.currentRoute.path
        }
    });
};

// 保存登录信息
export const saveUserCookie = (token, agentGuid, info) => {
    setStorage('token', token);
    setStorage('agentGuid', agentGuid);
    if (info) setStorage('info', info)
};

export const saveUserInfo = (info) => {
    if (info) setStorage('info', info)
};

export const setStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};
export const getStorage = (key) => {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
};

export const setSessionStorage = (key, data) => {
    sessionStorage.setItem(key, data);
};

export const getSessionStorage = (key) => {
    return sessionStorage.getItem(key) || '';
};

// 设置页面title
export const setTitle = (title) => {
    if (title) {
        document.title = title
    }
};

// 小数点保留后两位 如果为 00 不保留
export const toDecimal2NoZero = (x) => {
    let f = Math.round(x * 100) / 100;
    let s = f.toString();
    return s;
};

// 单位换算 个位换算万位
export const unitConversion = (num) => {
    let tenThousand = toDecimal2NoZero(num / 10000);
    return tenThousand
};

/**
 * 拷贝到剪切板
 * @param params 需要拷贝的值
 */
export function copyLink (value) {
    if (window.clipboardData) {
        window.clipboardData.clearData()
        window.clipboardData.setData('text', value)
    } else if (document.execCommand) {
        const element = document.createElement('SPAN')
        element.innerHTML = value
        document.body.appendChild(element)
        if (document.selection) {
            const range = document.body.createTextRange()
            range.moveToElementText(element)
            range.select()
        } else if (window.getSelection) {
            const range = document.createRange()
            range.selectNode(element)
            window.getSelection().removeAllRanges()
            window.getSelection().addRange(range)
        }
        document.execCommand('copy')
        element.remove ? element.remove() : element.removeNode(true)
    }
}

