package dev.baseballscore.cats.api.common.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("!webmvc-test")
@MapperScan("dev.baseballscore.cats.api")
public class MyBatisMapperConfiguration {}
