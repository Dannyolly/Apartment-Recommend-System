package com.example.controller;

import com.example.mapper.AdminMapper;
import com.example.pojo.Admin;
import com.example.utils.PageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class AdminController {

    @Autowired
    AdminMapper adminMapper;

    @GetMapping("/admin/get")
    public List<Admin> get(int page , int pageSize){
       return adminMapper.admins(PageUtil.cal(page,pageSize),pageSize);
    }

    @GetMapping("/admin/getItemById")
    public Admin getById(int id){
        return adminMapper.selectById(id);
    }

    @GetMapping("/admin/count")
    public Long count(){
        return adminMapper.selectCount(null);
    }

    @GetMapping("/admin/add")
    public Admin add(Admin admin){
        adminMapper.insert(admin);
        return admin;
    }

    @GetMapping("/admin/update")
    public int update(Admin admin){
        return adminMapper.updateById(admin);
    }

    @GetMapping("/admin/delete")
    public int delete(int id){
        return adminMapper.deleteById(id);
    }
}
