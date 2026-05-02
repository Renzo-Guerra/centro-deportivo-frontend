/**
 * Dada una fecha la parsea para devolver hh-mm
 * @param date Fecha a transformar
 * @returns string hh-mm
 */
export const formatDateTime = (dateString: Date | string | undefined): string => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Extraemos los componentes locales (año, mes, día, hora, min)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Dada una fecha la parsea para devolver dd-MM-yyyy
 * @param date Fecha a transformar
 * @returns string dd-MM-yyyy
 */
export const formatDate = (date: string | Date): string => {
  let [anio, mes, dia] = new Date(date).toISOString().split("T")[0].split("-");

  return `${dia}-${mes}-${anio}`;
}