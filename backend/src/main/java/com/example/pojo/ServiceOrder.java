package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@TableName("service_order")
public class ServiceOrder {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer serviceId;
    private Date createTime;
    private Date payTime;
    private Date bookingTime;
    private Date serviceTime;
    private String requirementDesc;
    private String state;
    private String history;
    private String curSer;
    private String curPri;
}