const hoy = new Date();

export const INICIO_HORARIO_JORNADA = new Date(
  hoy.getFullYear(),
  hoy.getMonth(),
  hoy.getDate(),
  10, // Hora
  0, // Minuto
);

export const FIN_HORARIO_JORNADA = new Date(
  hoy.getFullYear(),
  hoy.getMonth(),
  hoy.getDate(),
  17, // Hora
  0, // Minuto
);