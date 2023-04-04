package com.example.demo;


import com.example.controller.PostController;
import com.example.controller.UserController;
import com.example.mapper.*;
import com.example.msg.Options;
import com.example.pojo.Post;
import com.example.pojo.Room;
import com.example.pojo.User;
import com.example.service.PostService;
import com.example.service.RoomService;
import com.example.service.UserService;
import com.example.service.impl.RoomServiceImpl;
import com.example.service.impl.UserServiceImpl;
import com.example.utils.DataGenerator;
import com.example.utils.IDate;
import com.forte.util.Mock;
import com.forte.util.mockbean.MockObject;
import org.junit.jupiter.api.Test;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest
class MySpringBootWebSocketApplicationTests {


	@Autowired
	UserController userController;

	@Autowired
	DataGenerator dataGenerator;

	@Autowired
	RoomServiceImpl roomService;

	@Autowired
	UserServiceImpl userService;

	@Autowired
	RoomMapper roomMapper;
	@Test
	void contextLoads() throws Exception {

	}

}
