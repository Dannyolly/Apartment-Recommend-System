package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.example.pojo.RentInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RentInfoMapper extends BaseMapper<RentInfo> {
    List<RentInfo> ordersById(int id,int page,int pageSize);

    List<RentInfo> orders(int page,int pageSize);
}
