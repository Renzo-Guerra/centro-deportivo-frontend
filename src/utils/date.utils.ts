const format = (date: string | Date) => {
  const fecha = new Date(date);

  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const hours = String(fecha.getHours()).padStart(2, '0');
  const minutes = String(fecha.getMinutes()).padStart(2, '0');
  const seconds = String(fecha.getSeconds()).padStart(2, '0');

  return { year: year, month: month, day: day, hours: hours, minutes: minutes, seconds: seconds };
}

/**
 * Dada una fecha la parsea para devolver YYYY-MM-ddThh:mm
 * @param date Fecha a transformar
 * @returns string hh-mm
 */
export const formatDateTime = (date: Date | string): string => {
  if (!date) return "";
  // Extraemos los componentes locales (año, mes, día, hora, min)
  const { year, month, day, hours, minutes } = format(date);

  return `${day}-${month}-${year}T${hours}:${minutes}`;
}

/**
 * Dada una fecha la parsea para devolver dd-MM-YYYY
 * @param date Fecha a transformar
 * @returns string dd-MM-YYYY
 */
export const formatDate = (date: string | Date): string => {
  const { year, month, day } = format(date);

  return `${day}-${month}-${year}`;
}

/**
 * Crea un objeto fecha con la hora local y devuelve una string con el formato YYYY-MM-dd
 * @returns string fecha con formato YYYY-MM-dd
 */
export const getTodayDateLocal = (): string => {
  const { year, month, day } = format(new Date());

  return `${year}-${month}-${day}`;
}

/**
 * Crea un objeto fecha con la hora local y devuelve una string con el formato YYYY-MM-ddThh:mm
 * @returns string fecha con formato YYYY-MM-ddThh:mm
 */
export const toDatetimeLocal = (date: string | Date): string => {
  const { year, month, day, hours, minutes } = format(new Date(date));

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}