package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostLikeRel {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private int postId;
    private int userId;

    public PostLikeRel(int postId,int userId){
        this.userId = userId;
        this.postId = postId;
    }
}
