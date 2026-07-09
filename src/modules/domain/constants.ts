export const USER_ROLES = {
  Admin: 'admin',
  Enlace: 'enlace',
  Capturista: 'capturista',
} as const

export const MODULE_TYPES = {
  airport: 'Aeropuerto internacional',
  bus_station: 'Central de autobuses',
  customs_stop: 'Parador aduanal',
  road: 'Carretera',
  public_square: 'Plaza pública',
  other: 'Otro',
} as const

export const OPERATIVE_SEASONS = {
  holy_week: 'Semana Santa',
  summer: 'Verano',
  winter: 'Invierno',
  permanent: 'Permanente',
} as const

export const REPORT_STATUSES = {
  draft: 'Borrador',
  submitted: 'Enviado',
  reviewed: 'Revisado',
} as const

export const ATTENTION_TYPE_SEED = [
  'Importación temporal de vehículos',
  'Permiso de retorno seguro',
  'Cancelación de permiso ITV',
  'Importación definitiva de vehículos',
  'Pago de DNR',
  'Restricciones y permisos de tránsito vehicular',
  'Documentación necesaria para ingresar a México',
  'Actas del registro civil',
  'Servicios consulares',
  'Teléfonos, direcciones y horarios de dependencias',
  'Información para peticiones de ayuda',
  'Información para quejas',
  'Extorsión',
  'Robo',
  'Seguridad personal y patrimonial',
  'Franquicia fiscal, mercancías y equipaje',
  'SENASICA, ingreso de animales y alimentos',
  'Albergues fronterizos mexicanos',
  'Repatriación Humana',
  'Asistencia vial',
  'Servicio médico',
  'Personas detenidas o extraviadas',
  'Asesoría del Programa',
  'Otro',
] as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
export type ModuleType = keyof typeof MODULE_TYPES
export type OperativeSeason = keyof typeof OPERATIVE_SEASONS
export type ReportStatus = keyof typeof REPORT_STATUSES
