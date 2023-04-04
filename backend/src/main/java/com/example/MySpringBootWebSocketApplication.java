package com.example;

import com.corundumstudio.socketio.SocketIOServer;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import java.awt.event.MouseAdapter;
import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Scanner;


@EnableTransactionManagement
@SpringBootApplication
@MapperScan("com.example.mapper")

public class MySpringBootWebSocketApplication   {

		//implements ApplicationListener<ContextRefreshedEvent>

	public static void main(String[] args) throws Exception {
		SpringApplication.run(MySpringBootWebSocketApplication.class, args);

	}


}
