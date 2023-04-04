package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@TableName("posts")
public class Post {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private String title;
    @TableField(value = "`desc`")
    private String desc;
    private Date date;
    private String pic;
    @TableField(value = "`like`")
    private Integer like;
    private int type; // 1/ 2
}
