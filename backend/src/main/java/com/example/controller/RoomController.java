package com.example.controller;

import com.example.mapper.RoomMapper;
import com.example.msg.Options;
import com.example.msg.Result;
import com.example.pojo.Room;
import com.example.service.BrowseHistoryService;
import com.example.service.RoomService;
import com.example.service.impl.RoomServiceImpl;
import com.example.state.Message;
import com.example.utils.IdsUtil;
import com.example.utils.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.*;

@RestController
@CrossOrigin
public class RoomController {

    @Autowired
    public RoomMapper roomMapper;

    @Autowired
    RoomService roomService;

    @Autowired
    BrowseHistoryService browseHistoryService;

    @GetMapping("/getRecommendRooms")
    public Result<List<Room>> getRecommendRooms(String ids, int page, int pageSize, Date date){
        Map<String, Object> params = new HashMap<>();
        List<Integer> idsArr = IdsUtil.toList(ids);
        params.put("ids",idsArr);
        params.put("page", PageUtil.cal(page,pageSize));
        params.put("pageSize",pageSize);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomMapper.recommendRooms(params)
        );
    }

    @GetMapping("/getHotRooms")
    public Result<List<Room>> getHotRooms(int page,int pageSize){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomMapper.hotRooms(PageUtil.cal(page,pageSize),pageSize)
        );
    }

    @GetMapping("/getRoomsByOptions")
    public Result<List<Room>> getRoomsByOptions(Options options,int page, int pageSize, Date date){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomMapper.getRoomByMul(options,PageUtil.cal(page,pageSize),pageSize)
        );
    }

    @GetMapping("/getRoomsByIds")
    public Result<List<Room>> getRoomsByIds(String ids){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomService.listByIds(Arrays.asList(ids.split(",")))
        );
    }

    @GetMapping("/getCommunity")
    public Result<List<String>> getCommunity(String community){

        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomMapper.getCommunity(community)
        );
    }

    @GetMapping("/getHotRoomsByOptions")
    public Result<List<Room>> getHotRoomsByOptions(Options options,int page, int pageSize, Date date){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomMapper.getRoomByMul(options,PageUtil.cal(page,pageSize),pageSize)
        );
    }


}
