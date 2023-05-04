package com.example.controller;

import com.example.mapper.RoomMapper;
import com.example.msg.Options;
import com.example.msg.Result;
import com.example.pojo.BrowseHistory;
import com.example.pojo.Room;
import com.example.service.BrowseHistoryService;
import com.example.service.RoomService;
import com.example.state.Message;
import com.example.utils.IdsUtil;
import com.example.utils.PageUtil;
import com.example.utils.Request;
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

    @Autowired
    Request request;

    @GetMapping("/getSimilarRooms")
    public Result<List<Room>> getSimilarRooms(int houseId ,int page){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomService.listByIds(request.getRecommendRoomsByContentBased(houseId, page))
        );
    }
    @GetMapping("/getRecommendRooms")
    public Result<List<Room>> getRecommendRooms(int userId,int houseId,int contentBasedPage , int userBasedPage,int hotPage){
        List<Integer> recommendRoomsIds = new ArrayList<>();
        Map<String,Object> params = new HashMap<>();
        params.put("user_id",userId);
        List<BrowseHistory> userHistory = browseHistoryService.getBaseMapper().selectByMap(params);
        int userHistoryNum = userHistory.size();
        if(userHistoryNum == 0){
            // 新用戶
            return getHotRooms(hotPage,5);
        }

        List<Integer> recommendRoomsByUserBased = request.getRecommendRoomsByUserBased(userBasedPage);
        List<Integer> recommendRoomsByContentBased = request.getRecommendRoomsByContentBased(houseId, contentBasedPage);
        if(userHistoryNum >0 && userHistoryNum <=10){
            // 有記錄,但暫時只用基于內容的
            recommendRoomsIds.addAll(recommendRoomsByContentBased);
            return new Result<>(
                    200,
                    Message.SUCCESS,
                    "OK",
                    roomService.listByIds(recommendRoomsIds)
            );
        }
        // 使用混合推薦
        recommendRoomsIds.addAll(recommendRoomsByContentBased);
        recommendRoomsIds.addAll(recommendRoomsByUserBased);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomService.listByIds(recommendRoomsIds)
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
    public Result<List<Room>> getRoomsByOptions(Options options,int page, int pageSize){
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

    // 增刪查改
    @GetMapping("/room/get")
    public List<Room> getRooms(Options options,int page,int pageSize){
        return getRoomsByOptions(options,page,pageSize).getResult();
    }

    @GetMapping("/room/count")
    public Long count(){
        return roomMapper.selectCount(null);
    }


    @GetMapping("/room/update")
    public Integer update(Room room){
        return roomMapper.updateById(room);

    }

    @GetMapping("/room/delete")
    public Integer delete(int id){
        return roomMapper.deleteById(id);

    }

    @GetMapping("/room/add")
    public Room add(Room room){
        roomMapper.insert(room);
        return room;
    }
}
