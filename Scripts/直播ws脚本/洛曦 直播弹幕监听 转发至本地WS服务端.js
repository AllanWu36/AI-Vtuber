// ==UserScript==
// @name         洛曦 直播弹幕监听 转发至本地WS服务端
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  观察指定 DOM 节点的变化以将数据发送到连接的WebSocket服务端
// @description  Github：https://github.com/Ikaros-521/AI-Vtuber/tree/main/Scripts/%E7%9B%B4%E6%92%ADws%E8%84%9A%E6%9C%AC
// @author       Ikaros
// @match        https://www.douyu.com/*
// @match        https://anchor.douyin.com/*
// @match        https://live.kuaishou.com/u/*
// @match        https://live.kuaishou.com/u/*
// @match        https://mobile.yangkeduo.com/*
// @match        https://live.1688.com/zb/play.html*
// @match        https://tbzb.taobao.com/live*
// @match        https://redlive.xiaohongshu.com/*
// @match        https://channels.weixin.qq.com/platform/live/*
// @grant        none
// @namespace    https://greasyfork.org/scripts/490966
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/490966/%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E7%9B%91%E5%90%AC%20%E8%BD%AC%E5%8F%91%E8%87%B3%E6%9C%AC%E5%9C%B0WS%E6%9C%8D%E5%8A%A1%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490966/%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E7%9B%91%E5%90%AC%20%E8%BD%AC%E5%8F%91%E8%87%B3%E6%9C%AC%E5%9C%B0WS%E6%9C%8D%E5%8A%A1%E7%AB%AF.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 在文件开头添加一个函数，用于创建和显示消息框
    function showMessage(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`;
        messageBox.innerText = message;

        // 设置样式，消息上方居中
        messageBox.style.position = 'fixed';
        messageBox.style.right = '40%';
        messageBox.style.transform = 'translateX(-50%)';
        messageBox.style.top = `${10 + (document.querySelectorAll('.message-box').length * 60)}px`; // 每个消息框之间的间距
        messageBox.style.zIndex = '9999';
        messageBox.style.padding = '10px';
        // 设置info、success、error、warning等多个颜色，要好看，参考element-ui
        messageBox.style.backgroundColor = type === 'info' ? '#409EFF' : type === 'success' ? '#67C23A' : type === 'warning' ? '#E6A23C' : '#F56C6C';
        messageBox.style.color = 'white';
        messageBox.style.borderRadius = '5px';
        messageBox.style.marginBottom = '10px';
        messageBox.style.transition = 'opacity 0.5s ease';
        // 字体要大
        messageBox.style.fontSize = '16px';

        document.body.appendChild(messageBox);

        // 自动消失
        setTimeout(() => {
            messageBox.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 500);
        }, 3000); // 3秒后消失

        // 限制消息框数量
        const messageBoxes = document.querySelectorAll('.message-box');
        if (messageBoxes.length > 5) { // 限制最多显示5个消息框
            document.body.removeChild(messageBoxes[0]);
        }
    }

    setTimeout(function () {
        let my_socket = null;
        let wsUrl = "ws://127.0.0.1:5001";
        let targetNode = null;
        let my_observer = null;

        const hostname = window.location.hostname;

        if (hostname === "www.douyu.com") {
            console.log("当前直播平台：斗鱼");
            showMessage("当前直播平台：斗鱼");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "live.kuaishou.com") {
            console.log("当前直播平台：快手");
            showMessage("当前直播平台：快手");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "mobile.yangkeduo.com") {
            console.log("当前直播平台：拼多多");
            showMessage("当前直播平台：拼多多");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "live.1688.com") {
            console.log("当前直播平台：1688");
            showMessage("当前直播平台：1688");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "tbzb.taobao.com") {
            console.log("当前直播平台：淘宝");
            showMessage("当前直播平台：淘宝");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "redlive.xiaohongshu.com") {
            console.log("当前直播平台：小红书");
            showMessage("当前直播平台：小红书");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "channels.weixin.qq.com") {
            console.log("当前直播平台：微信视频号");
            showMessage("当前直播平台：微信视频号");
            wsUrl = "ws://127.0.0.1:5001";
        } else if (hostname === "anchor.douyin.com") {
            console.log("当前直播平台：抖音");
            showMessage("当前直播平台：抖音");
            wsUrl = "ws://127.0.0.1:5001";
        }


        function connectWebSocket() {
            // 创建 WebSocket 连接，适配服务端
            my_socket = new WebSocket(wsUrl);

            // 当连接建立时触发
            my_socket.addEventListener("open", (event) => {
                console.log("ws连接打开");

                // 向服务器发送一条消息
                const data = {
                    type: "info",
                    content: "ws连接成功",
                };
                console.log(data);
                my_socket.send(JSON.stringify(data));
            });

            // 当收到消息时触发
            my_socket.addEventListener("message", (event) => {
                console.log("收到服务器数据:", event.data);
                showMessage("收到服务器数据: " + event.data);
            });

            // 当连接关闭时触发
            my_socket.addEventListener("close", (event) => {
                console.log("WS连接关闭");
                showMessage("WS连接关闭", 'error');
                // 重连
                setTimeout(() => {
                    connectWebSocket();
                }, 1000); // 延迟 1 秒后重连
            });
        }

        // 初始连接
        connectWebSocket();
        if (hostname === "www.douyu.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".Barrage-list");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("Barrage-listItem")) {
                                // 新增的动态DOM元素处理
                                // console.log('Added node:', node);

                                const spans = node.getElementsByTagName("span");

                                let username = "";
                                let content = "";

                                for (let span of spans) {
                                    //console.log(span);
                                    if (span.classList.contains("Barrage-nickName")) {
                                        const targetSpan = span;
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = targetSpan.textContent.trim().slice(0, -1);
                                    } else if (span.classList.contains("Barrage-content")) {
                                        const targetSpan = span;
                                        // 获取弹幕内容
                                        content = targetSpan.textContent.trim();
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessage("[弹幕消息] " + username + ":" + content, 'info');


                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "live.kuaishou.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".chat-history");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的消息节点
                            if (node.querySelector(".comment-cell")) {
                                const commentCells = node.querySelectorAll(".comment-cell");

                                commentCells.forEach((cell) => {
                                    const usernameElement = cell.querySelector(".username");
                                    const commentElement = cell.querySelector(".comment");
                                    const emojiElement = cell.querySelector("img.emoji");
                                    const giftCommentElement = cell.querySelector(".gift-comment");
                                    const likeElement = cell.querySelector(".like");

                                    if (usernameElement && giftCommentElement) {
                                        // 礼物处理逻辑
                                        const username = usernameElement.textContent.trim().replace("：", "");
                                        const giftContent = giftCommentElement.textContent.trim();

                                        console.log(`${username}送出了礼物: ${giftContent}`);
                                        showMessage(`[礼物消息] ${username}送出了礼物: ${giftContent}`, 'success');

                                        // 如果 my_socket 已经初始化，可以发送礼物数据
                                        if (my_socket) {
                                            const data = {
                                                type: "gift",
                                                username: username,
                                                gift: giftContent,
                                            };
                                            console.log(data);
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    } else if (usernameElement && likeElement) {
                                        // 点赞处理逻辑
                                        const username = usernameElement.textContent.trim().replace("：", "");

                                        console.log(`${username}点了个赞`);
                                        showMessage(`[点赞消息] ${username}点了个赞`, 'info');

                                        // 如果 my_socket 已经初始化，可以发送点赞数据
                                        if (my_socket) {
                                            const data = {
                                                type: "like",
                                                username: username,
                                            };
                                            console.log(data);
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    } else if (usernameElement && commentElement) {
                                        // 弹幕处理逻辑
                                        const username = usernameElement.textContent.trim().replace("：", "");
                                        let content = "";

                                        // 提取评论内容（包括表情图片的替换）
                                        function extractCommentContent(element) {
                                            let content = "";
                                            element.childNodes.forEach((child) => {
                                                if (child.nodeType === Node.TEXT_NODE) {
                                                    content += child.textContent.trim();
                                                } else if (child.nodeType === Node.ELEMENT_NODE) {
                                                    if (child.tagName === "IMG" && child.classList.contains("emoji")) {
                                                        content += child.getAttribute("alt") || "[表情]";
                                                    } else {
                                                        content += extractCommentContent(child);
                                                    }
                                                }
                                            });
                                            return content;
                                        }

                                        content = extractCommentContent(commentElement);

                                        if (username && content) {
                                            console.log(`${username}: ${content}`);
                                            showMessage(`[弹幕消息] ${username}: ${content}`, 'info');

                                            // 构造弹幕数据
                                            const data = {
                                                type: "comment",
                                                username: username,
                                                content: content,
                                            };
                                            console.log(data);

                                            // 如果 my_socket 已经初始化，可以发送数据
                                            if (my_socket) {
                                                my_socket.send(JSON.stringify(data));
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }

                });
            });
        } else if (hostname === "mobile.yangkeduo.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".MYFlHgGu");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("_24Qh0Jmi")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const usernameElement = node.querySelector(".t6fCgSnz");
                                const commentElement = node.querySelector("._16_fPXYP");

                                if (
                                    usernameElement &&
                                    commentElement
                                ) {
                                    const username = usernameElement.textContent.trim().slice(0, -1);
                                    const content = commentElement.textContent.trim();

                                    console.log(username + ":" + content);
                                    showMessage("[弹幕消息] " + username + ":" + content, 'info');


                                    // 获取到弹幕数据
                                    if (username !== "" && content !== "") {
                                        const data = {
                                            type: "comment",
                                            username: username,
                                            content: content,
                                        };
                                        console.log(data);
                                        // 如果 my_socket 已经初始化，可以在这里发送数据
                                        if (my_socket) {
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "live.1688.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".pc-living-room-message");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("comment-message")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const usernameElement = node.querySelector(".from");
                                const commentElement = node.querySelector(".msg-text");

                                if (
                                    usernameElement &&
                                    commentElement
                                ) {
                                    const username = usernameElement.textContent.trim().slice(0, -1);
                                    const content = commentElement.textContent.trim();

                                    console.log(username + ":" + content);
                                    showMessage("[弹幕消息] " + username + ":" + content, 'info');


                                    // 获取到弹幕数据
                                    if (username !== "" && content !== "") {
                                        const data = {
                                            type: "comment",
                                            username: username,
                                            content: content,
                                        };
                                        console.log(data);
                                        // 如果 my_socket 已经初始化，可以在这里发送数据
                                        if (my_socket) {
                                            my_socket.send(JSON.stringify(data));
                                        }
                                    }
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "tbzb.taobao.com") {
            targetNode = document.querySelector("#liveComment");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {

                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("itemWrap--EcN_tFIg")) {
                                // 新增的动态DOM元素处理
                                console.log('Added node:', node);

                                const spans = node.getElementsByTagName("span");

                                let username = "";
                                let content = "";

                                for (let span of spans) {
                                    //console.log(span);
                                    if (span.classList.contains("authorTitle--_Dl75ZJ6")) {
                                        const targetSpan = span;
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = targetSpan.textContent.trim().slice(0, -1);
                                    } else if (span.classList.contains("content--pSjaTkyl")) {
                                        const targetSpan = span;
                                        // 获取弹幕内容
                                        content = targetSpan.textContent.trim();
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessage("[弹幕消息] " + username + ":" + content, 'info');


                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "redlive.xiaohongshu.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".comments");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("comment-list-item")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const spans = node.getElementsByTagName("span");

                                let live_tag = "";
                                let username = "";
                                let content = "";

                                console.log(spans.length);

                                for (let i = 0; i < spans.length; i++) {
                                    if (spans[i].classList.contains("live-tag")) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            live_tag = targetSpan.textContent.trim().slice(0, -1);
                                    }

                                    if (i == (spans.length - 2)) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = tmp;
                                    } else if (i == (spans.length - 1)) {
                                        const targetSpan = spans[i];
                                        // 获取弹幕
                                        let tmp = targetSpan.textContent.trim();
                                        if (tmp != "")
                                            content = tmp;
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessage("[弹幕消息] " + username + ":" + content, 'info');


                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "channels.weixin.qq.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".comment__list");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("vue-recycle-scroller__item-view")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const spans = node.getElementsByTagName("span");

                                let message_type = "";
                                let username = "";
                                let content = "";

                                console.log(spans.length);

                                for (let i = 0; i < spans.length; i++) {
                                    if (spans[i].classList.contains("message-type")) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            message_type = targetSpan.textContent.trim().slice(0, -1);
                                    }

                                    if (i == (spans.length - 2)) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = tmp;
                                    } else if (i == (spans.length - 1)) {
                                        const targetSpan = spans[i];
                                        // 获取弹幕
                                        let tmp = targetSpan.textContent.trim();
                                        if (tmp != "")
                                            content = tmp;
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessage("[弹幕消息] " + username + ":" + content, 'info');

                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        } else if (hostname === "anchor.douyin.com") {
            // 选择需要观察变化的节点
            targetNode = document.querySelector(".ReactVirtualized__Grid__innerScrollContainer");

            // 创建观察器实例
            my_observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    console.log(mutation);
                    // console.log(mutation.type);
                    // 这里处理新增的DOM元素
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach((node) => {
                            // 判断是否是新增的弹幕消息
                            if (node.classList.contains("vue-recycle-scroller__item-view")) {
                                // 新增的动态DOM元素处理
                                console.log("Added node:", node);

                                const spans = node.getElementsByTagName("span");

                                let message_type = "";
                                let username = "";
                                let content = "";

                                console.log(spans.length);

                                for (let i = 0; i < spans.length; i++) {
                                    if (spans[i].classList.contains("message-type")) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            message_type = targetSpan.textContent.trim().slice(0, -1);
                                    }

                                    if (i == (spans.length - 2)) {
                                        const targetSpan = spans[i];
                                        // 获取用户名
                                        let tmp = targetSpan.textContent.trim().slice(0, -1);
                                        if (tmp != "")
                                            username = tmp;
                                    } else if (i == (spans.length - 1)) {
                                        const targetSpan = spans[i];
                                        // 获取弹幕
                                        let tmp = targetSpan.textContent.trim();
                                        if (tmp != "")
                                            content = tmp;
                                    }
                                }

                                console.log(username + ":" + content);
                                showMessage("[弹幕消息] " + username + ":" + content, 'info');

                                // 获取到弹幕数据
                                if (username != "" && content != "") {
                                    const data = {
                                        type: "comment",
                                        username: username,
                                        content: content,
                                    };
                                    console.log(data);
                                    my_socket.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            });
        }

        // 配置观察选项
        const config = {
            childList: true,
            subtree: true,
        };

        try {
            // 开始观察
            my_observer.observe(targetNode, config);
        } catch (error) {
            console.error("观察失败:", error);
            showMessage("观察失败: " + error.message, 'error');
            setTimeout(() => {
                console.log("10S后尝试重新开始观察...");
                // 开始观察
                my_observer.observe(targetNode, config);
            }, 10000);
        }

    }, 10000);
})();
