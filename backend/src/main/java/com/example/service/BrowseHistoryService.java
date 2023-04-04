package com.example.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.pojo.BrowseHistory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface BrowseHistoryService extends IService<BrowseHistory> {
    default  boolean checkIsBrowsed(int userId,int roomId){
        Map<String, Object> params = new HashMap<>();
        params.put("user_id",userId);
        params.put("room_id",roomId);
        List<BrowseHistory> list = this.listByMap(params);
        return list.size() == 0;
    }
}
