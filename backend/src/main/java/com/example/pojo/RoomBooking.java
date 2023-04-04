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
@TableName("room_booking")
public class RoomBooking {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer houseId;
    private Date appointmentTime;
    private Date createTime;
    private Date visitTime;
    private String requirementDesc;
    private String history;
    private String state;
}