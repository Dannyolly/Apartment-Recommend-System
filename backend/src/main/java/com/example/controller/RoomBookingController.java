package com.example.controller;

import com.example.mapper.RoomBookingMapper;
import com.example.msg.Options;
import com.example.msg.Result;
import com.example.pojo.RentInfo;
import com.example.pojo.Room;
import com.example.pojo.RoomBooking;
import com.example.state.Message;
import com.example.utils.IDate;
import com.example.utils.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin
public class RoomBookingController {
    // 预约看客房
    @Autowired
    RoomBookingMapper roomBookingMapper;

    @GetMapping("/roomBooking/create")
    public Result<RoomBooking> createRentOrder(RoomBooking roomBooking,String time){

        Date timeT =IDate.getTime();
        roomBooking.setAppointmentTime(IDate.toTime(Long.parseLong(time)));
        roomBooking.setCreateTime(timeT);
        roomBooking.setHistory(
                "订单已创建: "+ timeT + ","+
                "待管家带客户看房: " + timeT
        );
        roomBooking.setState("1");
        roomBookingMapper.insert(roomBooking);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomBooking
        );
    }

    @GetMapping("/roomBooking/visit")
    public Result<String> payOrder(int id){
        RoomBooking roomBooking = new RoomBooking();
        Date time = IDate.getTime();
        roomBooking.setId(id);
        roomBooking.setVisitTime(time);
        roomBooking.setHistory(
                roomBookingMapper.selectById(id).getHistory()+
                        ","+"客户已查看: "+time +","+
                        "订单已完成: "+time
        );
        roomBookingMapper.updateById(roomBooking);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "OK"
        );
    }

    @GetMapping("/roomBooking/get")
    public Result<List<RoomBooking>> getUserOrder(int id, int page, int pageSize){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                roomBookingMapper.ordersById(id, PageUtil.cal(page,pageSize),pageSize)
        );
    }


    // 增刪查改
    @GetMapping("/roomBooking/select")
    public List<RoomBooking> getRoomBookings( int page, int pageSize){
        return roomBookingMapper.orders(PageUtil.cal(page,pageSize),pageSize);
    }

    @GetMapping("/roomBooking/getById")
    public RoomBooking getRoomBookings( int id){
        return roomBookingMapper.selectById(id);
    }

    @GetMapping("/roomBooking/update")
    public Integer update(RoomBooking room){
        return roomBookingMapper.updateById(room);

    }

    @GetMapping("/roomBooking/count")
    public Long count(){
        return roomBookingMapper.selectCount(null);

    }

    @GetMapping("/roomBooking/delete")
    public Integer delete(int id){
        return roomBookingMapper.deleteById(id);

    }

    @GetMapping("/roomBooking/add")
    public RoomBooking add(RoomBooking room){
        roomBookingMapper.insert(room);
        return room;
    }
}
