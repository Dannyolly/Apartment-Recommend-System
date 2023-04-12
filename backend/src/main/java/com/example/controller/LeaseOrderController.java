package com.example.controller;

import com.example.mapper.LeaseOrderMapper;
import com.example.msg.LeaseOption;
import com.example.msg.Result;
import com.example.pojo.LeaseOrder;
import com.example.pojo.RentInfo;
import com.example.service.LeaseOrderService;
import com.example.state.Message;
import com.example.utils.IDate;
import com.example.utils.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin
public class LeaseOrderController {

    @Autowired
    LeaseOrderService leaseOrderService;

    @Autowired
    LeaseOrderMapper leaseOrderMapper;

    @GetMapping("/lease/list")
    public Result<List<LeaseOrder>> getUserOrderList(int userId){
        HashMap<String, Object> params = new HashMap<>();
        params.put("user_id",userId);
        return  new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                leaseOrderService.listByMap(params)
        );
    }

    @GetMapping("/lease/create")
    public Result<LeaseOrder> create(String location,int userId,String appointmentTime,String houseType){
        LeaseOrder leaseOrder = new LeaseOrder();
        Timestamp time = IDate.getTime();
        leaseOrder.setState(1);
        leaseOrder.setHouseType(houseType);
        leaseOrder.setUserId(userId);
        leaseOrder.setLocation(location);
        leaseOrder.setCreateTime(time);
        leaseOrder.setAppointmentTime(IDate.toTime(Long.parseLong(appointmentTime)));
        leaseOrder.setHistory("订单已创建:"+time);
        leaseOrderService.save(leaseOrder);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                leaseOrder
        );
    }

    @GetMapping("/lease/visit")
    public Result<LeaseOrder> visit(int id){
        LeaseOrder leaseOrder = leaseOrderService.getById(id);
        Timestamp time = IDate.getTime();
        leaseOrder.setId(id);
        leaseOrder.setHistory(leaseOrder.getHistory()+",管家已上门查看:"+time+",订单已完成:"+time);
        leaseOrderService.updateById(leaseOrder);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                leaseOrder
        );
    }


    // 增刪查改
    @GetMapping("/leaseOrder/get")
    public List<LeaseOrder> getRoomBookings(LeaseOption leaseOption, int page, int pageSize){
        return leaseOrderMapper.list(leaseOption, PageUtil.cal(page,pageSize),pageSize);
    }

    @GetMapping("/leaseOrder/count")
    public int count(LeaseOption leaseOption){
        return leaseOrderMapper.list(leaseOption, 0,100000).size();
    }

    @GetMapping("/leaseOrder/delete")
    public Integer delete(int id){
        return leaseOrderMapper.deleteById(id);

    }

    @GetMapping("/leaseOrder/add")
    public LeaseOrder add(LeaseOrder room){
        leaseOrderMapper.insert(room);
        return room;
    }

    @GetMapping("/leaseOrder/update")
    public Integer update(LeaseOrder room){
        return leaseOrderMapper.updateById(room);

    }

}
