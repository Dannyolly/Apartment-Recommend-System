package com.example.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.mapper.FollowMapper;
import com.example.mapper.LeaseOrderMapper;
import com.example.pojo.Follow;
import com.example.pojo.LeaseOrder;
import com.example.service.FollowService;
import com.example.service.LeaseOrderService;
import org.springframework.stereotype.Service;

@Service
public class LeaseOrderImpl extends ServiceImpl<LeaseOrderMapper, LeaseOrder> implements LeaseOrderService {
}
