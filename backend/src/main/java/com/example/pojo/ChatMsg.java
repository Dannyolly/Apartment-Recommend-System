package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMsg {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer receiveUserId;
    private String pic;
    private Date createTime;
    private String msg;

}