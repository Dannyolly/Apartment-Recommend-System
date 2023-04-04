package com.example.utils;

import com.example.controller.UserController;
import com.example.mapper.BrowseHistoryMapper;
import com.example.pojo.BrowseHistory;
import com.example.pojo.Follow;
import com.example.pojo.Room;
import com.example.pojo.User;
import com.example.service.BrowseHistoryService;
import com.example.service.FollowService;
import com.example.service.RoomService;
import com.example.service.UserService;
import com.forte.util.Mock;
import com.forte.util.mockbean.MockObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataGenerator {

    @Autowired
    UserController userController;

    @Autowired
    FollowService followService;

    @Autowired
    UserService userService;

    @Autowired
    RoomService roomService;

    @Autowired
    BrowseHistoryService browseHistoryService;
    public int random(int begin ,int end ){
        return begin+(int)(Math.random()*(end-begin));
    }
    public int randomNum(){
        return random(1,500);
    }
    
    public  List<User> generateUsers(int num){
        // 准备模板载体
        Map<String, Object> template = new HashMap<>();
        //name是一个随机的英文名称。
        template.put("name", "@name");
        // 设置
        Mock.reset(User.class, template);

        // 获取一个MockObject
        MockObject<User> mockUser = Mock.get(User.class);
        return mockUser.getList(num);
    }

    public void generateFollows(){
        List<User> list = userService.list();
        List<Follow> followList = new ArrayList<>();
        for (User user : list) {
            int userId = user.getId();
            Map<Integer,Integer> roomIds = new HashMap<Integer,Integer>();
            for (int i = 0; i < 50; i++) {
                int roomId = randomNum();
                while (true) {
                    if (userController.checkFollow(userId, roomId).getResult() == 1 && roomIds.get(roomId)==1 && roomId != userId ) {
                        roomId = randomNum();
                    }else {
                        roomIds.put(roomId,1);
                        followList.add(new Follow(userId,roomId));
                        break;
                    }
                }
            }
        }
        followService.saveBatch(followList);
    }

    public void generateUserBrowseHistory(){
        List<User> userList = userService.list();
        List<BrowseHistory> browseHistoryList = new ArrayList<>();
        int start = 1;
        int roomLen = (int) roomService.count();
        for (User user : userList) {
            int userId = user.getId();
            Map<Integer,Integer> roomIds = new HashMap<Integer,Integer>();
            for (int i = 0; i < 200; i++) {
                int roomId = random(start,roomLen);
                while (true) {
                    Integer temp = roomIds.get(roomId);

                    if (temp == null ) {
                        roomIds.put(roomId,1);
                        browseHistoryList.add(new BrowseHistory(userId,roomId));
                        break;
                    }else {
                        roomId = random(start,roomLen);
                    }
                }
            }
        }
        browseHistoryService.saveBatch(browseHistoryList);
    }
}
