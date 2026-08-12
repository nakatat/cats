package dev.baseballscore.cats.api.common.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(title = "cats-api", version = "v1", description = "新琴似CATSの公開APIと成績管理API"))
public class OpenApiConfig {}
