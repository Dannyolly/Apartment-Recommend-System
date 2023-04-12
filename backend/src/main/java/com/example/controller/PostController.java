package com.example.controller;

import com.example.mapper.PostCommentMapper;
import com.example.mapper.PostLikeRelMapper;
import com.example.mapper.PostMapper;
import com.example.msg.PostOption;
import com.example.msg.Result;
import com.example.pojo.*;
import com.example.service.UserService;
import com.example.state.Message;
import com.example.utils.IDate;
import com.example.utils.PageUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class PostController {

    @Autowired
    public UserService userService;
    @Autowired
    public PostMapper postMapper;
    @Autowired
    public PostLikeRelMapper postLikeRelMapper;
    @Autowired
    public PostCommentMapper postCommentMapper;

    public void updateUserWhenAction(int postId, boolean isLike){
        Post post = postMapper.selectById(postId);
        User user = userService.getById(post.getUserId());
        user.setLikeCount( isLike? user.getLikeCount() - 1:user.getLikeCount()+1);
        userService.updateById(user);
    }

    @GetMapping ("/uploadPost")
    public Result<Post> uploadPost(String[] files, int userId,String title, String desc,boolean isQAndA){

        System.out.println(files.length+"     "+userId+"    "+desc);
        Post post = new Post();
        String imagePath =  StringUtils.join(files,",");
        post.setDate(new Timestamp(new Date().getTime()));
        post.setLike(0);
        post.setTitle(title);
        post.setUserId(userId);
        post.setDesc(desc);
        post.setPic(isQAndA ? "":imagePath);
        post.setType( isQAndA?2:1 );
        postMapper.insert(post);

        return new Result<>(
                200,
                Message.SUCCESS,
                "文章上傳成功",
                post
        );

    }

    @GetMapping("/getAllPosts")
    public Result<List<Post>> getAllPosts(int userId,int type,int page,int pageSize){
        return  new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                postMapper.posts(userId,type, PageUtil.cal(page, pageSize), pageSize)
        );
    }

    //  ----- like
    @GetMapping("/like/add")
    public Result<String> likeAction(int postId , int userId ){
        Post userPost = postMapper.selectById(postId);
        postLikeRelMapper.insert(new PostLikeRel(postId,userId));
        updateUserWhenAction(postId,false);
        int likeCount = userPost.getLike();
        userPost.setId(postId);
        userPost.setLike(likeCount+1);
        postMapper.updateById(userPost);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "like"
        );
    }

    @GetMapping("/like/cancel")
    public Result<String> cancelLike(int postId , int userId  ){
        Post userPost = postMapper.selectById(postId);
        int likeCount = userPost.getLike();
        updateUserWhenAction(postId,true);
        Map<String, Object> condition = new HashMap<>();
        condition.put("post_id",postId);
        condition.put("user_id",userId);
        postLikeRelMapper.deleteByMap(condition);
        userPost.setId(postId);
        userPost.setLike(likeCount-1);
        postMapper.updateById(userPost);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "cancel"
        );
    }

    @GetMapping("/like/check")
    public Result<String> checkIsLiked(int postId ,int userId){
        HashMap<String, Object> condition = new HashMap<>();
        condition.put("post_id",postId);
        condition.put("user_id",userId);
        List<PostLikeRel> postLikeRels = postLikeRelMapper.selectByMap(condition);
        if(postLikeRels.size() !=0){
            return new Result<>(
                    200,
                    Message.SUCCESS,
                    "OK",
                    "liked"
            );
        }
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "haven't liked yet"
        );
    }

    // ---- comment
    @GetMapping("/getComments")
    public Result<List<PostComment>> getComments(int postId,int page,int pageSize){
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                postCommentMapper.comments(postId,PageUtil.cal(page,pageSize),pageSize)
        );
    }

    @GetMapping("/comment/add")
    public Result<String> addComment(PostComment postComment){
        postComment.setDate(IDate.getTime());
        postCommentMapper.insert(postComment);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                "OK"
        );
    }

    @GetMapping("/comment/count")
    public Result<Integer> commentCount(int postId){
        HashMap<String, Object> params = new HashMap<>();
        params.put("post_id",postId);
        return new Result<>(
                200,
                Message.SUCCESS,
                "OK",
                postCommentMapper.selectByMap(params).size()
        );
    }


    // crud
    @GetMapping("/post/get")
    public List<Post> select(PostOption options,int page, int pageSize){
        return  postMapper.list(options,PageUtil.cal(page, pageSize),pageSize);
    }

    @GetMapping("/post/count")
    public int count(PostOption options,int page, int pageSize){
        return  postMapper.list(options,PageUtil.cal(page, pageSize),pageSize).size();
    }

    @GetMapping("/post/delete")
    public Integer delete(int id){
        return postMapper.deleteById(id);
    }


}
