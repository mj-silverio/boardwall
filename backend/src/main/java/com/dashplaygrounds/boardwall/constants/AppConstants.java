package com.dashplaygrounds.boardwall.constants;

import org.springframework.core.env.Environment;

public final class AppConstants {


   // Prevent instantiation
   private AppConstants() {
      throw new UnsupportedOperationException("This is a constants class and cannot be instantiated");
   }

   // Define your constants here
   //  public static final String BASE_FRONTEND_URLS = "http://192.168.1.163:4221";
   public static final String BASE_FRONTEND_URLS = System.getenv("BASE_FRONTEND_URLS");
 
}