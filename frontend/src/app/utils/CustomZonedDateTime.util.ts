import { DateTime, Zone } from 'luxon';

export class CustomZonedDateTimeUtil {
    /**
     * Converts a given date-time string to a specific time zone.
     * @param dateTimeString - The date-time string to convert.
     * @param targetZone - The target time zone (e.g., 'America/New_York').
     * @returns The converted DateTime object.
     */
    static toZone(dateTimeString: string, targetZone: string): DateTime {
        return DateTime.fromISO(dateTimeString, { zone: 'utc' }).setZone(targetZone);
    }

    /**
     * Gets the current date-time in a specific time zone.
     * @param targetZone - The target time zone (e.g., 'Asia/Tokyo').
     * @returns The current DateTime object in the target zone.
     */
    static nowInZone(targetZone: string): DateTime {
        return DateTime.now().setZone(targetZone).toISO();
    }

    /**
     * Formats a DateTime object to a specific format.
     * @param dateTime - The DateTime object to format.
     * @param format - The desired format (e.g., 'yyyy-MM-dd HH:mm:ss').
     * @returns The formatted date-time string.
     */
    static format(dateTime: DateTime, format: string): string {
        return dateTime.toFormat(format);
    }

    /**
     * Checks if a given date-time string is valid in a specific time zone.
     * @param dateTimeString - The date-time string to validate.
     * @param zone - The time zone to validate against.
     * @returns True if valid, false otherwise.
     */
    static isValidInZone(dateTimeString: string, zone: string): boolean {
        const dateTime = DateTime.fromISO(dateTimeString, { zone });
        return dateTime.isValid;
    }
}