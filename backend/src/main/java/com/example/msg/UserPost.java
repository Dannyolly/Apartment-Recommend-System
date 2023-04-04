package com.example.msg;

import com.example.pojo.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPost {
    private Integer id;
    private Integer userId;
    private String title;
    private String desc;
    private Date date;
    private String pic;
    private Integer like;
    private int type; // 1/ 2
    private User user;
}
