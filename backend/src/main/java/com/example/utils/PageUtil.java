package com.example.utils;

public class PageUtil {
    public static int cal(int page , int pageSize){
        if(page == 0){
            return page;
        }
        return (page - 1) * pageSize;
    }
}
