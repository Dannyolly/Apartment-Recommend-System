package com.example.msg;


import lombok.Data;

@Data
public class Options {
    // 地區
    public String district;
    public String traffic;
    public String community;
    public String road;
    public String ori;
    public Double lowestPrice;
    public Double highestPrice;
    public Double lowestAreaSize;
    public Double highestAreaSize;
    public String floorInfo;
    public String orderBy;
    public String sort;
}
