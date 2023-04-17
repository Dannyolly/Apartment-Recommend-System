package com.example.controller;

import com.example.msg.Result;
import com.example.state.Message;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

@RestController
@CrossOrigin
public class UploadController {
    @PostMapping("/upload")
    public Result<HashMap<String,Object>> uploadImages(MultipartFile  file, String path){
        HashMap<String, Object> map = new HashMap<String,Object>();
        String filename = System.currentTimeMillis()+file.getOriginalFilename();
        String filePath = System.getProperty("user.dir")+System.getProperty("file.separator")+"img"
                +System.getProperty("file.separator")+path+System.getProperty("file.separator");
        //路徑不存在,迎增該路徑....
        File file1=new File(filePath);
        if(!file1.exists()){
            file1.mkdir();
        }
        //實際的文件地址...
        File dist=new File(filePath+System.getProperty("file.separator")+filename);
        //存到數據庫...
        String storePath="/img/"+ path +"/"+filename;
        HashMap<String, Object> res = new HashMap<>();

        try {
            file.transferTo(dist);
        } catch (IOException e) {
            e.printStackTrace();
            res.put("reason","文件上传失败");
            return  new Result<>(
                    200,
                    Message.ERROR,
                    "OK",
                    res
            );
        }

        res.put("path",storePath);
        return  new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                res
        );
    }



}
