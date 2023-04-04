package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pojo.ServiceOrder;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ServiceOrderMapper extends BaseMapper<ServiceOrder> {
}
