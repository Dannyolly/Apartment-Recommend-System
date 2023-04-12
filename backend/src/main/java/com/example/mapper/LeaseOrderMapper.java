package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.msg.LeaseOption;
import com.example.pojo.LeaseOrder;
import com.example.pojo.RentInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LeaseOrderMapper extends BaseMapper<LeaseOrder> {
    List<LeaseOrder> ordersById(int id, int page, int pageSize);

    List<LeaseOrder> orders(int page,int pageSize);

    List<LeaseOrder> list(LeaseOption options, int page, int pageSize);
}
