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
@TableName("rent_info")
public class RentInfo {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer houseId;
    private Integer state;
    private Date createTime;
    private Date payTime;
    private Date signTime;
    private Date checkinTime;
    @TableField(value = "`admin`")
    private String admin;
    private Double payment;
    private Integer tenancy;
    // 訂單過程
    private String history;
    // 服務ids
    private String serviceIds;
}