import { formatInTimeZone } from 'date-fns-tz';
import { subDays, addHours as addHoursFn, addMinutes as addMinutesFn } from 'date-fns';

export const ARG_TZ = 'America/Argentina/Buenos_Aires';

// Formatea una fecha a string en la zona horaria de Argentina
export const formatArg = (date: Date | string | number, pattern: string = 'yyyy-MM-dd'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  return formatInTimeZone(d, ARG_TZ, pattern);
};

/**
 * Given a String|Date format it with yyyy-mm-dd
 * @param date to format
 * @returns formated date yyyy-MM-dd
 */
export const formatToDateLocal = (date: Date | string): string => formatArg(date, 'yyyy-MM-dd');

/**
 * Given a String|Date format it with dd-MM-yyyyThh:mm
 * @param date to format
 * @returns formated date dd-MM-yyyyThh:mm
 */
export const formatToDateTime = (date: Date | string): string => formatArg(date, `yyyy-MM-dd'T'hh:mm`);

// Resta dias a una fecha
export const subtractDays = (date: Date | string | number, days: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return subDays(d, days);
}

// Agrega minutos a una fecha
export const addMinutes = (date: Date | string, cant: number): string => {
  const newDate = addMinutesFn(new Date(date), cant);
  return formatArg(newDate, `yyyy-MM-dd'T'HH:mm`);
};

// Agrega horas a una fecha
export const addHours = (date: Date | string, cant: number): string => {
  const newDate = addHoursFn(new Date(date), cant);
  return formatArg(newDate, `yyyy-MM-dd'T'HH:mm`);
};
