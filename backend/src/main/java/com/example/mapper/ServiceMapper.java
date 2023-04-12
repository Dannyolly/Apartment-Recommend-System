package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pojo.Service;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ServiceMapper extends BaseMapper<Service> {
    List<Service> list(int page,int pageSize);
}
