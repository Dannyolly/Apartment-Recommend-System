package com.example.controller;

import com.example.mapper.FollowMapper;
import com.example.mapper.UserMapper;
import com.example.msg.Result;
import com.example.pojo.Follow;
import com.example.pojo.LeaseOrder;
import com.example.pojo.User;
import com.example.service.UserService;
import com.example.service.impl.UserServiceImpl;
import com.example.state.Message;
import com.example.utils.DataGenerator;
import com.example.utils.IdsUtil;
import com.example.utils.PageUtil;
import com.example.utils.Request;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
@Slf4j
public class UserController {

    @Autowired
    FollowMapper followMapper;

    @Autowired
    UserServiceImpl userService;
    @Autowired
    UserMapper userMapper;
    @Autowired
    DataGenerator dataGenerator;

    @Autowired
    Request request;
    //
    @GetMapping("/getSimilarUser")
    public Result<List<User>> getSimilarUser(int userId){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                userService.listByIds(request.getSimilarUser(userId))
        );
    }


    public void updateUserWhenAction(int userId,int followId,boolean isFollow){
        List<User> users = new ArrayList<>();
        User user = userService.getById(userId);
        User followUser = userService.getById(followId);
        user.setId(userId);
        user.setFollow( isFollow? user.getFollow()-1:user.getFollow() +1 );
        followUser.setId( followId);
        followUser.setFans( isFollow? user.getFans()-1 : user.getFans()+1 );
        userService.saveBatch(users);
    }


    // follow
    @GetMapping("/user/follow")
    public Result<String> follow(int userId,int followId){
        Follow followT = new Follow();
        updateUserWhenAction(userId,followId,false);
        followT.setUserId(userId);
        followT.setFollowId(followId);
        followMapper.insert(followT);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "follow user successfully"
        );
    }

    @GetMapping("/user/unfollow")
    public Result<String> unfollow(int userId,int followId){
        HashMap<String, Object> params = new HashMap<>();
        updateUserWhenAction(userId,followId,true);
        params.put("user_id",userId);
        params.put("follow_id",followId);
        followMapper.deleteByMap(params);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "unfollow user successfully"
        );
    }

    @GetMapping("/user/followList")
    public Result<List<User>> followList(int userId){
        HashMap<String, Object> params = new HashMap<>();
        params.put("follow_id",userId);
        List<Follow> follow = followMapper.selectByMap(params);
        List<Integer> followIds = new ArrayList<>();
        for (Follow follow1 : follow) {
            followIds.add( follow1.getUserId() );
        }
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                userService.listByIds(followIds)
        );
    }

    @GetMapping("/user/checkFollow")
    public Result<Integer> checkFollow(int userId,int followId){
        HashMap<String, Object> params = new HashMap<>();
        params.put("user_id",userId);
        params.put("follow_id",followId);
        List<Follow> follows = followMapper.selectByMap(params);

        if(follows.size()!=0){
            return  new Result<>(
                    200,
                    Message.SUCCESS,
                    "OK",
                    1
            );
        }
        return  new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                0
        );
    }

    @GetMapping("/user/getById")
    public Result<User> getUser(int userId){
        return  new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                userService.getById(userId)
        );

    }
    @GetMapping("/user/getAll")
    public Result<List<User>> getUsers(String ids){
        List<Integer> userIds = IdsUtil.toList(ids);
        return  new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                userService.listByIds(userIds)
        );
    }

    @GetMapping("/user/login")
    public Result<User> login(String openId){
        Map<String ,Object> params = new HashMap<>();
        params.put("open_id",openId);
        List<User> userList = userService.getBaseMapper().selectByMap(params);
        if(userList.size() ==0 ){
            return new Result<>(
                    200,
                    Message.ERROR,
                    "user doesn't exist",
                    null
            );
        }
        User user = userList.get(0);
        log.info("userId: " +user.getId()+" has logged in ");
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                userList.get(0)
        );

    }


    @GetMapping("/user/register")
    public Result<User> register(String openId){
        User user = dataGenerator.generateUsers(1).get(0);
        user.setOpenId(openId);
        user.setAvatar("https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132");
        userMapper.insert(user);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                user
        );
    }


    // 增刪查改
    @GetMapping("/user/get")
    public List<User> getRoomBookings(int page, int pageSize){
        return userMapper.users(PageUtil.cal(page,pageSize),pageSize);
    }

    @GetMapping("/user/count")
    public Long getCount(){
        return userMapper.selectCount(null);
    }

    @GetMapping("/user/getItemById")
    public User getRoomBookings(int id){
        return getUser(id).getResult();
    }

    @GetMapping("/user/update")
    public Integer update(User user){
        return userMapper.updateById(user);

    }

    @GetMapping("/user/delete")
    public Integer delete(int id){
        return userMapper.deleteById(id);

    }

    @GetMapping("/user/add")
    public User add(User user){
        userMapper.insert(user);
        return user;
    }

}
