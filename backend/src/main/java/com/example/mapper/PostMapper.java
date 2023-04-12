package com.example.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.msg.PostOption;
import com.example.pojo.Post;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper extends BaseMapper<Post> {
   /**
    * 獲取用戶所有帖子根據 userId
    * @param type  1 --- 帖子  2 --- 問答
    */
   List<Post> posts(int userId,int type,int page,int pageSize);

   List<Post> list(PostOption options, int page, int pageSize);

}
