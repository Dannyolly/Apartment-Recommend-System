package com.example.pojo;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@TableName("service_comment")
public class ServiceComment {
    private Integer id;
    private Integer userId;
    private Integer serviceId;
    private String title;
    private String desc;
    private Date date;
    private String pic;
    private Integer like;
    private Integer toUserId;
}