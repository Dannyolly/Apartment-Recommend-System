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
@TableName("service")
public class Service {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String title;
    private String subtitle;
    private String specification;
    private String price;
    private String tags;
    private String type;
    private Integer sales;
    private String imgs;
    private String detailImg;
}