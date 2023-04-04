package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.mapper.FollowMapper;
import com.example.mapper.PostMapper;
import com.example.pojo.Follow;
import com.example.pojo.Post;
import com.example.service.FollowService;
import com.example.service.PostService;
import org.springframework.stereotype.Service;

@Service
public class FollowServiceImpl extends ServiceImpl<FollowMapper, Follow> implements FollowService {
}
