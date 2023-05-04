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
@TableName("browse_history_copy")
public class BrowseHistoryCopy {
    @TableId(type = IdType.AUTO)
    public int id;
    public int userId;
    public int roomId;

    public BrowseHistoryCopy(BrowseHistory browseHistory){
        this.id = browseHistory.id;
        this.userId = browseHistory.userId;
        this.roomId = browseHistory.roomId;
    }
}
