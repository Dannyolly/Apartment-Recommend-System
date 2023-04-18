package com.example.controller;

import com.example.mapper.RentInfoMapper;
import com.example.msg.Result;
import com.example.pojo.RentInfo;
import com.example.pojo.RoomBooking;
import com.example.state.Message;
import com.example.utils.IDate;
import com.example.utils.PageUtil;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin
@Slf4j
public class RentInfoController {
    @Autowired
    RentInfoMapper rentInfoMapper;

    @GetMapping("/rent/create")
    public Result<RentInfo> createRentOrder(RentInfo rentInfo,String time){

        Date timeT = IDate.getTime();
        rentInfo.setCheckinTime(IDate.toTime(Long.parseLong( time )));
        rentInfo.setCreateTime(timeT);
        rentInfo.setHistory("订单已创建: "+timeT);
        rentInfo.setAdmin("dannyolly");
        rentInfoMapper.insert(rentInfo);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                rentInfo
        );
    }

    @GetMapping("/rent/pay")
    public Result<RentInfo> payOrder(int id){
        RentInfo rentInfo = new RentInfo();
        Date time = IDate.getTime();
        rentInfo.setId(id);
        rentInfo.setPayTime(time);
        rentInfo.setHistory(
                rentInfoMapper.selectById(id).getHistory()+
                ","+"订单已付款:"+time +","+
                "待客户入住:"+time
        );
        rentInfoMapper.updateById(rentInfo);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                rentInfo
        );
    }

    @GetMapping("/rent/checkIn")
    public Result<String> checkIn(int id){
        RentInfo rentInfo = new RentInfo();
        Date time = IDate.getTime();
        rentInfo.setId(id);
        rentInfo.setPayTime(time);
        rentInfo.setHistory(
                rentInfoMapper.selectById(id).getHistory()+","+
                "客户已入住:"+time+
                "订单已完成:"+time

        );
        rentInfoMapper.updateById(rentInfo);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "OK"
        );
    }

    @GetMapping("/rent/get")
    public Result<List<RentInfo>> getUserOrder(int id,int page,int pageSize){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                rentInfoMapper.ordersById(id, PageUtil.cal(page,pageSize),pageSize)
        );
    }

    // 增刪查改
    @GetMapping("/rentInfo/get")
    public List<RentInfo> getRoomBookings(int page, int pageSize){
        return rentInfoMapper.orders(PageUtil.cal(page,pageSize),pageSize);
    }

    @GetMapping("/rentInfo/getById")
    public RentInfo getRoomBookings(int id){
        return rentInfoMapper.selectById(id);
    }


    @GetMapping("/rentInfo/count")
    public Long getCount(){
        return rentInfoMapper.selectCount(null);
    }

    @GetMapping("/rentInfo/update")
    public Integer update(RentInfo rentInfo){
        return rentInfoMapper.updateById(rentInfo);
    }

    @GetMapping("/rentInfo/delete")
    public Integer delete(int id){
        return rentInfoMapper.deleteById(id);

    }

    @GetMapping("/rentInfo/add")
    public RentInfo add(RentInfo room){
        rentInfoMapper.insert(room);
        return room;
    }


}
