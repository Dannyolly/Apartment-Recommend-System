package com.example.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("browse_history")
public class BrowseHistory {
    @TableId(type = IdType.AUTO)
    public int id;
    public int userId;
    public int roomId;

    public BrowseHistory(int userId,int roomId){
        this.userId = userId;
        this.roomId = roomId;
    }
}
