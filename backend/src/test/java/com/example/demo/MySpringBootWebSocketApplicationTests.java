package com.example.demo;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.controller.RoomController;
import com.example.controller.UserController;
import com.example.mapper.BrowseHistoryCopyMapper;
import com.example.mapper.BrowseHistoryMapper;
import com.example.msg.Result;
import com.example.pojo.BrowseHistory;
import com.example.pojo.BrowseHistoryCopy;
import com.example.pojo.Room;
import com.example.service.impl.RoomServiceImpl;
import com.example.service.impl.UserServiceImpl;
import com.example.utils.DataGenerator;
import com.example.utils.JsonUtils;
import com.example.utils.Request;
import io.swagger.models.auth.In;
import org.junit.jupiter.api.Test;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

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
	Request request;

	@Autowired
	RoomController roomController;

	@Autowired
	BrowseHistoryCopyMapper browseHistoryCopyMapper;

	@Autowired
	BrowseHistoryMapper browseHistoryMapper;

	@Test
	void contextLoads() throws Exception {

	}

}
