package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pojo.ServiceOrder;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ServiceOrderMapper extends BaseMapper<ServiceOrder> {
  List<ServiceOrder> list(int page,int pageSize);
}
