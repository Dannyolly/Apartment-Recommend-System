package com.example.utils;

import com.alibaba.fastjson.JSON;
import org.jetbrains.annotations.NotNull;

public class JsonUtils {

    public static  <T>  T jsonToPojo( String obj,Class<T> t){
        return JSON.parseObject(obj,t);
    }

    public static @NotNull String pojoToJson(Object obj){
        return JSON.toJSONString(obj);
    }

}


