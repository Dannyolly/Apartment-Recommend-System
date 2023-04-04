package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private String avatar;
    private Integer follow;
    private Integer fans;
    private Integer likeCount;
    private String openId;
}