package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("room_dataset")
public class RoomDataSet {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String city;
    private String district;
    private String road;
    private String community;
    private String price;
    private String rentalmethod;
    private String housetype;
    private String roomtype;
    private String areasize;
    private String decoratetype;
    private String ori;
    private String floorinfo;
    private Boolean hasrefrigerator;
    private Boolean haswashingmachine;
    private Boolean hasbalcony;
    private Boolean hascook;
    private Boolean hasairconditioner;
    private Boolean haswaterheater;
    private Boolean hasbed;
    private Boolean haswardrobe;
    private Boolean hassofa;
    private Boolean haswifi;
    private String bedroomnum;
    private String bathroomnum;
    private String hallsnum;
    private String traffic;
}