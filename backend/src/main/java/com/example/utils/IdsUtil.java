package com.example.utils;

import java.util.ArrayList;
import java.util.List;

public class IdsUtil {
    public  static List<Integer> toList(String ids){
        String[] idsArrT = ids.split(",");
        List<Integer> idsArr = new ArrayList<>();
        for (String s : idsArrT) {
            idsArr.add(Integer.parseInt(s));
        }
        return idsArr;
    }
}
