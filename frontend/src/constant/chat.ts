enum ChatStatus {
    /**
     * @description 第一次(或重連)初始化"),
     */
    CONNECT = 1,

    /**
     * @description 聊天信息
     */
    CHAT = 2,

    /**
     * @description 消息簽收
     */
    SIGNED = 3,
    /**
     * @description 客戶端保持心跳
     */
    KEEPALIVE = 4,
    /**
     * @description 拉取好友
     */
    PULL_FRIEND = 5
}




export {
    ChatStatus

}