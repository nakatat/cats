package dev.baseballscore.cats.api.common.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebCorsConfiguration implements WebMvcConfigurer {

  private final List<String> allowedOrigins;

  public WebCorsConfiguration(@Value("${app.cors.allowed-origins}") String allowedOrigins) {
    this.allowedOrigins =
        Arrays.stream(allowedOrigins.split(","))
            .map(origin -> origin.trim())
            .filter(origin -> !origin.isEmpty())
            .toList();
  }

  @SuppressWarnings("null")
  @Override
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    String[] origins = this.allowedOrigins.toArray(new String[0]);
    registry
        .addMapping("/**")
        .allowedOrigins(origins)
        .allowedMethods("GET", "OPTIONS")
        .allowedHeaders("Accept", "Content-Type")
        .allowCredentials(false)
        .maxAge(3_600);
  }
}
