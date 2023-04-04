package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pojo.ServiceComment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ServiceCommentMapper extends BaseMapper<ServiceComment> {

    List<ServiceComment> comments(int id,int page,int pageSize);
}
