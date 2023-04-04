package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pojo.PostComment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostCommentMapper extends BaseMapper<PostComment> {
    /**
     * 獲取所有留言 postId
     */
    List<PostComment> comments(int postId,int page,int pageSize);
}
