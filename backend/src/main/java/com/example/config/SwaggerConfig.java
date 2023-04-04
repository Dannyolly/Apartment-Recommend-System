package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2).
                apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.example.controller"))
                //.paths(PathSelectors.ant("/danny/**")

                .build();
    }

    private ApiInfo apiInfo(){
        return new ApiInfo("danny的SwaggerAPI文檔",
                "oops",
                "1.0",
                "urn:tos",
                new Contact("danny", "", "3034450868@qq.com"),
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList());
    }
}
