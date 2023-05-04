package com.example.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.msg.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class Request {

    private final RestTemplate restTemplate;

    public Request(){
        this.restTemplate = new RestTemplate();
        // this.restTemplate.getMessageConverters().set(1,new StringHttpMessageConverter(StandardCharsets.UTF_8));
        restTemplate.getMessageConverters().set(1,new StringHttpMessageConverter(StandardCharsets.UTF_8));

    }

    public List<Integer> getFromRecommendSystem(String url,Boolean isUser){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/json;charset=UTF-8"));
        HttpEntity<String> entity = new HttpEntity<String>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        String res  = response.getBody();
        // Result result = JsonUtils.jsonToPojo(response.getBody(), Result.class);

        JSONObject json = JSONObject.parseObject(res);
        JSONArray jsonArray;
        if(!isUser){
            jsonArray = (JSONArray) json.get("houseIds");
        }else {
            jsonArray = (JSONArray) json.get("userIds");
        }

        return jsonArray.toJavaList(Integer.class);
    }

    public List<Integer> getRecommendRoomsByContentBased(int houseId,int page){
        int pageSize = 5;
        int startNum  = (page-1) * pageSize;
        int endNum  = startNum + pageSize;
        int maxCount = Math.max(30,startNum + pageSize);
        List<Integer> fromRecommendSystem = getFromRecommendSystem("http://127.0.0.1:8091/expect/武汉/" + houseId + "/" + maxCount,false);
        return fromRecommendSystem.subList(startNum,endNum);
    }

    public List<Integer> getRecommendRoomsByUserBased(int page){
        return getFromRecommendSystem("http://127.0.0.1:8091/expect/room/1/"+page,false);
    }

    public List<Integer> getSimilarUser(int userId){
        return getFromRecommendSystem("http://127.0.0.1:8091/expect/user/"+userId,true);
    }
}
