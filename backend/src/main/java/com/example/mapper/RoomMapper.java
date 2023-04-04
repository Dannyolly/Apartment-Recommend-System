package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.msg.Options;
import com.example.pojo.Room;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface RoomMapper extends BaseMapper<Room> {
    /**
     * params -- int[ ] ids,int page,int pageSize
     */
    List<Room> recommendRooms(Map<String,Object> params);

    /**
     * params -- int page,int pageSize
     */
    List<Room> hotRooms(int page , int pageSize);

    List<Room> getRoomByMul(Options options, int page, int pageSize);

    List<String> getCommunity(String community);

    List<Room> getHotRoomByMul(Options options, int page, int pageSize);

}
