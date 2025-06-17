package com.dashplaygrounds.boardwall.utils;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class CustomDateTimeFormatter {

    public static String formatLocalDateTime(LocalDateTime dateTime, String pattern) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return dateTime.format(formatter);
    }

    public static String formatUtcZonedDateTime(ZonedDateTime utcNow, String pattern) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern + " 'UTC'");
        return utcNow.format(formatter);
    }

}