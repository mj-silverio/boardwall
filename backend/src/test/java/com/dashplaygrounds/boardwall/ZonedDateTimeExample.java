package com.dashplaygrounds.boardwall;

import java.time.ZonedDateTime;
import java.time.ZoneId;

public class ZonedDateTimeExample {
    public static void main(String[] args) {
        // Get the current date-time in the default time zone
        ZonedDateTime currentDateTime = ZonedDateTime.now();
        System.out.println("Current Date-Time: " + currentDateTime);

        // Get the current date-time in a specific time zone (e.g., Asia/Manila)
        ZoneId zoneId = ZoneId.of("Asia/Manila");
        ZonedDateTime dateTimeInManila = ZonedDateTime.now(zoneId);
        System.out.println("Date-Time in Manila: " + dateTimeInManila);

        // Create a specific ZonedDateTime
        ZonedDateTime specificDateTime = ZonedDateTime.of(2025, 4, 19, 16, 30, 0, 0, ZoneId.of("Asia/Manila"));
        System.out.println("Specific Date-Time: " + specificDateTime);

        // Convert ZonedDateTime to another time zone (e.g., UTC)
        ZonedDateTime dateTimeInUTC = specificDateTime.withZoneSameInstant(ZoneId.of("UTC"));
        System.out.println("Date-Time in UTC: " + dateTimeInUTC);
    }
}
