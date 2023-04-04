package com.example.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LeaseOrder {
    private int id;
    private int userId;
    private String location;
    private String houseType;
    private Date createTime;
    private Date appointmentTime;
    private Date checkTime;
    private String history;
    private int state;
}

