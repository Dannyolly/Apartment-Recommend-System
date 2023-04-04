package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pojo.RentInfo;
import com.example.pojo.RoomBooking;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RoomBookingMapper extends BaseMapper<RoomBooking> {
    List<RoomBooking> orders(int id, int page, int pageSize);
}
