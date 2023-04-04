package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //qrcode
        registry.addResourceHandler("/img/QRcode/**")
                .addResourceLocations("file:"+System.getProperty("user.dir")+System.getProperty("file.separator")+"img"
                        +System.getProperty("file.separator")+"QRcode"+System.getProperty("file.separator")
                );

        //post
        registry.addResourceHandler("/img/post/**")
                .addResourceLocations("file:"+System.getProperty("user.dir")+System.getProperty("file.separator")+"img"
                        +System.getProperty("file.separator")+"post"+System.getProperty("file.separator")
                );


        //service
        registry.addResourceHandler("/img/service/**")
                .addResourceLocations("file:"+System.getProperty("user.dir")+System.getProperty("file.separator")+"img"
                        +System.getProperty("file.separator")+"service"+System.getProperty("file.separator")
                );
        //case
        registry.addResourceHandler("/img/case/**")
                .addResourceLocations("file:"+System.getProperty("user.dir")+System.getProperty("file.separator")+"img"
                        +System.getProperty("file.separator")+"case"+System.getProperty("file.separator")
                );
    }
}