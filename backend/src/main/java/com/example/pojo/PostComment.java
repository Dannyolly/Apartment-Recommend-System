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
@TableName("post_comments")
public class PostComment {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer postId;
    private String title;
    @TableField(value = "`desc`")
    private String desc;
    private Date date;
    @TableField(value = "`like`")
    private Integer like;
    private Integer toUserId;

}