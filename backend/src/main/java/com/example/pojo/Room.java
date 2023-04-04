package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String url;
    private String title;
    private String city;
    private String district;
    private String road;
    private String community;
    private String uptime;
    private Date savetime;
    private Double price;
    private String rentalmethod;
    private String housetype;
    private String roomtype;
    private String areasize;
    private String decoratetype;
    private String ori;
    private String renttimeinfo;
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
    private String pic;
    private String traffic;
    private String description;
    private int pageViews;
}