package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@TableName("follows")
public class Follow {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer followId;

    public Follow(int userId,int followId){
        this.userId  = userId;
        this.followId = followId;
    }
}