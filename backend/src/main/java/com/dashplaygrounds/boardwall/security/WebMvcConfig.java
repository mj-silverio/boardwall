package com.dashplaygrounds.boardwall.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.dashplaygrounds.boardwall.constants.AppConstants;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowedOrigins(AppConstants.BASE_FRONTEND_URLS)
        .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials")
        .allowCredentials(false)
        .maxAge(3600);
  }
}
