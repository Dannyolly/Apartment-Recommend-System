package com.example.controller;

import com.example.mapper.ServiceCommentMapper;
import com.example.mapper.ServiceMapper;
import com.example.mapper.ServiceOrderMapper;
import com.example.msg.Result;
import com.example.pojo.RentInfo;
import com.example.pojo.Service;
import com.example.pojo.ServiceComment;
import com.example.pojo.ServiceOrder;
import com.example.state.Message;
import com.example.utils.IDate;
import com.example.utils.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin
public class ServiceController {
    @Autowired
    ServiceMapper serviceMapper;

    @Autowired
    ServiceCommentMapper serviceCommentMapper;

    @Autowired
    ServiceOrderMapper serviceOrderMapper;

    @GetMapping("/service/getList")
    public Result<List<Service>> getService(){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceMapper.list()
        );
    }

    @GetMapping("/service/getById")
    public Result<Service> getById(int id){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceMapper.selectById(id)
        );
    }

    // --- comment
    @GetMapping("/service/getComment")
    public Result<List<ServiceComment>> comments(int id,int page ,int pageSize){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceCommentMapper.comments(id, PageUtil.cal(page,pageSize),pageSize)
        );
    }

    @GetMapping("/service/comment")
    public Result<String> commentAction(ServiceComment serviceComment){
        serviceCommentMapper.insert(serviceComment);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "OK"
        );
    }

    // --- order

    @GetMapping("/service/create")
    public Result<ServiceOrder> create(ServiceOrder serviceOrder,String time){
        Date timeT = IDate.getTime();
        serviceOrder.setServiceTime(IDate.toTime(Long.parseLong( time )));
        serviceOrder.setCreateTime(timeT);
        serviceOrder.setHistory("订单已创建: "+timeT);
        serviceOrderMapper.insert(serviceOrder);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceOrder
        );
    }

    @GetMapping("/service/pay")
    public Result<ServiceOrder> payOrder(int id){
        ServiceOrder serviceOrder = new ServiceOrder();
        Date time = IDate.getTime();
        serviceOrder.setId(id);
        serviceOrder.setPayTime(time);
        serviceOrder.setHistory(
                serviceOrderMapper.selectById(id).getHistory()+
                        ","+"订单已付款:"+time +","+
                        "待服务员上门:"+time
        );
        serviceOrderMapper.updateById(serviceOrder);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceOrder
        );
    }

    @GetMapping("/service/finish")
    public Result<ServiceOrder> serviced(int id){
        ServiceOrder serviceOrder = new ServiceOrder();
        Date time = IDate.getTime();
        serviceOrder.setId(id);
        serviceOrder.setServiceTime(time);
        serviceOrder.setHistory(
                serviceOrderMapper.selectById(id).getHistory()+","+
                        "服務已完成: "+time+
                        "订单已完成: "+time

        );
        serviceOrderMapper.updateById(serviceOrder);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceOrder
        );
    }


    @GetMapping("/service/getOrder")
    public Result<List<ServiceOrder>> getOrders(int userId){
        HashMap<String, Object> params = new HashMap<>();
        params.put("user_id",userId);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                serviceOrderMapper.selectByMap(params)
        );
    }
}
