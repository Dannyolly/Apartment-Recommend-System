package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import com.example.pojo.RentInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface RentInfoMapper extends BaseMapper<RentInfo> {
    List<RentInfo> orders(int id,int page,int pageSize);
}
