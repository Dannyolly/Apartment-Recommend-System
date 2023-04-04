package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.mapper.PostMapper;
import com.example.mapper.UserMapper;
import com.example.pojo.Post;
import com.example.pojo.User;
import com.example.service.PostService;
import com.example.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl extends ServiceImpl<PostMapper, Post> implements PostService {
}
