package com.example.service.impl;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.mapper.UserMapper;
import com.example.pojo.Room;
import com.example.pojo.User;
import com.example.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Map;
import java.util.function.Function;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}
