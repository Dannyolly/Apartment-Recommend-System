package com.example.controller;

import com.example.msg.Result;
import com.example.pojo.BrowseHistory;
import com.example.service.BrowseHistoryService;
import com.example.state.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class DataUploadController {
    // 上傳用戶行為...
    @Autowired
    BrowseHistoryService browseHistoryService;

    @GetMapping("/browseHistory/upload")
    public Result<Boolean> uploadBrowseHistory(int userId,int roomId){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                browseHistoryService.save(new BrowseHistory(userId,roomId))
        );
    }
}
