/**
 * Perfiles 100 % ficticios del dataset de CVs (PLAN §11).
 * Se generan con una semilla fija: cada ejecución produce exactamente los mismos datos.
 * La respuesta esperada (lo que la IA debería extraer) se calcula de los MISMOS datos
 * con que se dibuja el PDF, así ambos siempre coinciden.
 */
import type { CvExtraido, NivelIdioma } from "../../src/dominio/entidades/cvExtraido";
import type { NivelEducativo } from "../../src/dominio/entidades/niveles";
import { NIVELES_EDUCATIVOS } from "../../src/dominio/entidades/niveles";

export type Estilo =
  | "times-centrado"
  | "cambria-barras"
  | "moderno-sans"
  | "clasico-numerado"
  | "docs-azul-tabla"
  | "canva-elegante"
  | "canva-minimal"
  | "dos-columnas";

export type Lengua = "es" | "en";

export interface Mes {
  m: number; // 1–12
  a: number;
}

export interface Experiencia {
  cargo: string;
  empresa: string;
  ciudad: string;
  desde: Mes;
  hasta: Mes | "actual";
  logros: string[];
}

export interface Estudio {
  grado: string;
  institucion: string;
  nivel: NivelEducativo;
  enCurso: boolean;
  desde: number;
  hasta: number | null;
}

export interface IdiomaEscrito {
  idioma: string; // tal como aparece en el CV
  nivelTexto: string; // tal como aparece en el CV
  nivel: NivelIdioma; // lo que se espera que la IA devuelva
}

export interface Perfil {
  id: string; // cv-01 … cv-30
  estilo: Estilo;
  lengua: Lengua;
  oferta: string; // título de la oferta del seed a la que postula
  ajuste: "alto" | "medio" | "bajo";
  nombre: string;
  titular: string;
  email: string;
  telefono: string;
  ciudad: string;
  web: string | null;
  resumen: string;
  experiencias: Experiencia[];
  estudios: Estudio[];
  habilidades: string[]; // tal como aparecen en el CV
  idiomas: IdiomaEscrito[];
  certificaciones: string[];
  /** Proyectos: sus herramientas son un subconjunto de "habilidades" (no agregan habilidades nuevas). */
  proyectos: { nombre: string; descripcion: string; herramientas: string[] }[];
  datosPersonales: { edad: number; estadoCivil: string } | null; // solo estilos "clásicos"
}

/** Fecha de referencia para "actual" (las mediciones son en noviembre/diciembre de 2026). */
export const HOY: Mes = { m: 11, a: 2026 };

// ---------- azar con semilla (mulberry32) ----------
let semilla = 20261118;
function azar(): number {
  semilla |= 0;
  semilla = (semilla + 0x6d2b79f5) | 0;
  let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const elegir = <T>(lista: readonly T[]): T => lista[Math.floor(azar() * lista.length)];
const entre = (min: number, max: number) => min + Math.floor(azar() * (max - min + 1));
function mezclar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
const tomar = <T>(lista: readonly T[], n: number) => mezclar(lista).slice(0, n);

// ---------- catálogos ficticios ----------
const NOMBRES_F = ["Lucía", "Valeria", "Camila", "Rosa", "Milagros", "Fiorella", "Andrea", "Katherine", "Diana", "Gabriela", "Jimena", "Yesenia", "Pamela", "Elena", "Sofía"];
const NOMBRES_M = ["Diego", "Luis", "Jorge", "Renato", "Kevin", "Bruno", "César", "Álvaro", "Joel", "Martín", "Christian", "Hugo", "Iván", "Ricardo", "Sebastián"];
const APELLIDOS = ["Quispe", "Huamán", "Rojas", "Mendoza", "Paredes", "Salazar", "Torres", "Cárdenas", "Villanueva", "Espinoza", "Chávez", "Ríos", "Gutiérrez", "Palomino", "Zevallos", "Aguilar", "Ccori", "Benavides", "Lozano", "Tapia", "Arroyo", "Cueva", "Mamani", "Delgado"];
const CIUDADES = ["Lima", "Lima", "Lima", "Arequipa", "Trujillo", "Huancayo", "Cusco", "Chiclayo"];
const EMPRESAS = ["Andes Digital S.A.C.", "Inca Labs", "Grupo Comercial Pacífico Sur", "Consultora Nazca", "Textiles del Valle S.A.", "Distribuidora Rímac Norte", "Clínica San Gabriel Ficticia", "Soluciones Kallpa", "Logística Huayna S.A.C.", "Agroexport Costa Verde", "Retail Sol de Oro", "Fintech Qori", "Municipalidad Distrital Ficticia de San Isidro Alto", "Colegio Particular Nuevo Horizonte", "Servicios Generales Limpia Perú"];
const UNIVERSIDADES = ["Universidad Privada Costa Verde", "Universidad Nacional del Centro Andino", "Universidad Tecnológica Lima Sur", "Universidad Católica de los Andes Ficticia"];
const INSTITUTOS = ["IESTP Horizonte Digital", "Instituto Superior Tecnológico Amauta", "Instituto de Educación Superior Lima Norte"];
const POSGRADOS = ["Escuela de Posgrado Costa Verde", "Escuela de Negocios del Pacífico Ficticia"];
const COLEGIOS = ["I.E. N.° 1180 Los Laureles", "I.E.P. Santa Rosa de Lima Norte", "I.E. Emblemática Ficticia José Olaya"];

type Dominio = "web" | "datos" | "rrhh" | "otros";

const OFERTA_POR_DOMINIO: Record<Exclude<Dominio, "otros">, string> = {
  web: "Desarrollador Full Stack Junior",
  datos: "Analista de Datos",
  rrhh: "Asistente de Recursos Humanos",
};

const HABILIDADES: Record<Dominio, { clave: string[][]; extra: string[] }> = {
  // cada habilidad clave tiene variantes de escritura (para probar la tabla de alias)
  web: {
    clave: [["JavaScript", "JS"], ["React", "ReactJS", "React.js"], ["Node.js", "NodeJS", "Node"], ["SQL"], ["TypeScript"], ["Docker"]],
    extra: ["HTML5", "CSS3", "Git", "Express", "MongoDB", "PostgreSQL", "Tailwind CSS", "Next.js", "PHP", "Laravel", "Java", "REST APIs", "Scrum"],
  },
  datos: {
    clave: [["Python"], ["SQL"], ["Power BI"], ["Excel", "MS Excel", "Microsoft Excel"], ["Pandas"], ["Estadística"]],
    extra: ["Tableau", "R", "DAX", "Google Sheets", "Looker Studio", "ETL", "NumPy", "Power Query", "Machine Learning básico"],
  },
  rrhh: {
    clave: [["Reclutamiento"], ["Gestión de planillas"], ["Excel", "MS Excel"], ["SAP"], ["Comunicación efectiva"]],
    extra: ["Onboarding", "Entrevistas por competencias", "Legislación laboral", "PLAME", "Clima laboral", "Microsoft Office", "Gestión documental", "Bienestar social"],
  },
  otros: {
    clave: [],
    extra: ["Atención al cliente", "Microsoft Office", "Trabajo en equipo", "Redacción legal", "Gestión de expedientes", "Ventas", "Manejo de caja", "Limpieza y desinfección", "Orden y organización"],
  },
};

const HABILIDADES_EN: Record<string, string> = {
  "Estadística": "Statistics",
  "Comunicación efectiva": "Effective communication",
  "Gestión de planillas": "Payroll management",
  "Reclutamiento": "Recruitment",
  "Machine Learning básico": "Basic Machine Learning",
};

const CARGOS: Record<Dominio, { es: string[]; en: string[] }> = {
  web: {
    es: ["Desarrollador Web Junior", "Practicante de Desarrollo de Software", "Desarrollador Frontend", "Desarrollador Full Stack", "Analista de Soporte de Aplicaciones"],
    en: ["Junior Web Developer", "Software Development Intern", "Frontend Developer", "Full Stack Developer"],
  },
  datos: {
    es: ["Analista de Datos", "Asistente de Inteligencia Comercial", "Analista de Reportes", "Practicante de Analítica", "Analista BI"],
    en: ["Data Analyst", "Business Intelligence Analyst", "Reporting Analyst", "Analytics Intern"],
  },
  rrhh: {
    es: ["Asistente de Recursos Humanos", "Analista de Reclutamiento", "Auxiliar de Planillas", "Practicante de Gestión del Talento", "Asistente de Bienestar Social"],
    en: ["HR Assistant", "Recruitment Analyst"],
  },
  otros: {
    es: ["Asesor de Atención al Cliente", "Operario de Limpieza", "Asistente Legal", "Vendedor de Tienda", "Cajero"],
    en: ["Customer Service Agent"],
  },
};

const LOGROS: Record<Dominio, { es: string[]; en: string[] }> = {
  web: {
    es: [
      "Desarrollé módulos de un sistema de ventas con React y Node.js, reduciendo el tiempo de registro de pedidos.",
      "Implementé una API REST para la gestión de inventario con autenticación por roles.",
      "Diseñé y optimicé consultas SQL para reportes mensuales.",
      "Participé en ceremonias Scrum y en la revisión de código del equipo.",
      "Migré pantallas antiguas a componentes reutilizables y mejoré la experiencia en dispositivos móviles.",
      "Configuré contenedores Docker para el entorno de desarrollo del equipo.",
      "Brindé soporte a usuarios internos y documenté incidencias recurrentes.",
      "Integré pasarelas de pago y servicios externos mediante APIs.",
      "Escribí pruebas unitarias y de integración para los módulos críticos.",
      "Optimicé el rendimiento de páginas con carga diferida y caché.",
      "Mantuve el control de versiones con Git y flujos de ramas por funcionalidad.",
      "Desarrollé formularios con validaciones y mensajes claros para el usuario.",
      "Coordiné con el área de diseño la implementación de interfaces responsivas.",
    ],
    en: [
      "Built sales modules with React and Node.js, reducing order registration time.",
      "Implemented a REST API for inventory management with role-based authentication.",
      "Wrote and optimized SQL queries for monthly reports.",
      "Took part in Scrum ceremonies and team code reviews.",
      "Containerized the development environment with Docker.",
    ],
  },
  datos: {
    es: [
      "Elaboré tableros en Power BI para el seguimiento de ventas por región.",
      "Automaticé reportes semanales con Python y Pandas, ahorrando horas de trabajo manual.",
      "Depuré y consolidé bases de datos comerciales en Excel y SQL.",
      "Presenté hallazgos de análisis estadístico a jefaturas comerciales.",
      "Construí procesos ETL para integrar información de distintas áreas.",
      "Validé la calidad de los datos y documenté los indicadores del área.",
      "Modelé datos con DAX y Power Query para reportes ejecutivos.",
      "Analicé la rotación de clientes y propuse acciones de retención.",
      "Elaboré pronósticos de demanda con series de tiempo.",
      "Capacité a usuarios del área en el uso de los tableros.",
      "Atendí requerimientos de información de gerencia en plazos ajustados.",
    ],
    en: [
      "Designed Power BI dashboards to track sales by region.",
      "Automated weekly reports with Python and Pandas.",
      "Cleaned and consolidated commercial databases using Excel and SQL.",
      "Presented statistical findings to sales managers.",
    ],
  },
  rrhh: {
    es: [
      "Gestioné procesos de reclutamiento y selección para puestos operativos y administrativos.",
      "Elaboré y validé planillas mensuales de más de cien colaboradores.",
      "Coordiné el proceso de onboarding de nuevos ingresos.",
      "Realicé entrevistas por competencias y verificación de referencias.",
      "Registré información del personal en SAP y mantuve actualizados los legajos.",
      "Apoyé en campañas de clima laboral y bienestar.",
      "Publiqué avisos de empleo y filtré perfiles en portales laborales.",
      "Calculé liquidaciones, vacaciones y CTS de acuerdo con la normativa vigente.",
      "Preparé la declaración mensual del PLAME.",
      "Elaboré reportes de asistencia, horas extra y ausentismo.",
      "Atendí consultas del personal sobre beneficios y boletas de pago.",
    ],
    en: [
      "Managed recruitment processes for operational and administrative roles.",
      "Prepared and validated monthly payroll for over one hundred employees.",
      "Coordinated onboarding for new hires.",
    ],
  },
  otros: {
    es: [
      "Atendí consultas y reclamos de clientes de forma presencial y telefónica.",
      "Mantuve el orden y la limpieza de las áreas asignadas.",
      "Apoyé en la redacción de escritos y el seguimiento de expedientes.",
      "Registré ventas y realicé el cuadre de caja diario.",
    ],
    en: ["Handled customer inquiries and complaints by phone and in person."],
  },
};

const GRADOS: Record<Dominio, { tecnico: string; universitario: string; maestria: string }> = {
  web: { tecnico: "Desarrollo de Sistemas de Información", universitario: "Ingeniería de Sistemas", maestria: "Maestría en Ingeniería de Software" },
  datos: { tecnico: "Computación e Informática", universitario: "Ingeniería Estadística", maestria: "Maestría en Ciencia de Datos" },
  rrhh: { tecnico: "Administración de Empresas", universitario: "Psicología Organizacional", maestria: "Maestría en Gestión del Talento Humano" },
  otros: { tecnico: "Secretariado Ejecutivo", universitario: "Derecho", maestria: "Maestría en Derecho Administrativo" },
};

const IDIOMAS_ESCRITOS: { idioma: string; nivelTexto: string; nivel: NivelIdioma }[][] = [
  [{ idioma: "Inglés", nivelTexto: "Intermedio", nivel: "B1" }],
  [{ idioma: "Inglés", nivelTexto: "B2", nivel: "B2" }],
  [{ idioma: "Inglés", nivelTexto: "Avanzado", nivel: "C1" }],
  [{ idioma: "Inglés", nivelTexto: "Básico", nivel: "A2" }],
  [{ idioma: "Inglés", nivelTexto: "Intermedio (B1)", nivel: "B1" }, { idioma: "Quechua", nivelTexto: "Nativo", nivel: "nativo" }],
  [{ idioma: "Español", nivelTexto: "Nativo", nivel: "nativo" }, { idioma: "Inglés", nivelTexto: "B2", nivel: "B2" }],
  [{ idioma: "Inglés", nivelTexto: "C1", nivel: "C1" }, { idioma: "Portugués", nivelTexto: "Básico", nivel: "A2" }],
  [],
];
const IDIOMAS_EN: { idioma: string; nivelTexto: string; nivel: NivelIdioma }[][] = [
  [{ idioma: "Spanish", nivelTexto: "Native", nivel: "nativo" }, { idioma: "English", nivelTexto: "Advanced (C1)", nivel: "C1" }],
  [{ idioma: "Spanish", nivelTexto: "Native", nivel: "nativo" }, { idioma: "English", nivelTexto: "B2", nivel: "B2" }],
];

const CERTIFICACIONES: Record<Dominio, string[]> = {
  web: ["Scrum Fundamentals Certified", "Curso de React avanzado", "Fundamentos de Docker"],
  datos: ["Microsoft Power BI Data Analyst (curso)", "Python para Análisis de Datos", "Estadística aplicada"],
  rrhh: ["Diplomado en Gestión del Talento Humano", "Curso de Legislación Laboral Peruana", "Manejo de SAP HCM (curso)"],
  otros: ["Curso de Atención al Cliente", "Seguridad y Salud en el Trabajo"],
};

const PROYECTOS: Record<Dominio, { nombre: string; descripcion: string }[]> = {
  web: [
    { nombre: "Sistema de reservas para un restaurante", descripcion: "Aplicación web para registrar reservas y mesas disponibles, con panel de administración y reportes diarios." },
    { nombre: "Tienda virtual de artesanías", descripcion: "Catálogo de productos, carrito de compras y gestión de pedidos para un emprendimiento familiar." },
    { nombre: "Portal de biblioteca escolar", descripcion: "Búsqueda de libros, préstamos y devoluciones con notificaciones para los estudiantes." },
  ],
  datos: [
    { nombre: "Tablero de ventas regionales", descripcion: "Indicadores de ventas, margen y cumplimiento de metas por región y vendedor." },
    { nombre: "Análisis de deserción estudiantil", descripcion: "Limpieza de datos históricos y análisis de los factores asociados a la deserción." },
    { nombre: "Reporte automático de inventarios", descripcion: "Consolidación semanal de stock de varias sedes y alertas de quiebre." },
  ],
  rrhh: [
    { nombre: "Rediseño del proceso de inducción", descripcion: "Propuesta de un programa de onboarding de dos semanas con encuestas de satisfacción." },
    { nombre: "Matriz de seguimiento de vacaciones", descripcion: "Control de saldos de vacaciones y programación anual por área." },
  ],
  otros: [],
};

// ---------- composición del dataset normal (30 CVs) ----------
// [estilo, lengua, dominio, ajuste, páginas aproximadas por cantidad de experiencias]
type Plan = [Estilo, Lengua, Dominio, "alto" | "medio" | "bajo", number];
const PLANES: Plan[] = [
  ["times-centrado", "es", "rrhh", "medio", 3],
  ["times-centrado", "es", "web", "alto", 3],
  ["times-centrado", "es", "datos", "bajo", 2],
  ["times-centrado", "en", "datos", "alto", 3],
  ["cambria-barras", "es", "web", "medio", 4],
  ["cambria-barras", "es", "rrhh", "alto", 3],
  ["cambria-barras", "es", "datos", "medio", 2],
  ["cambria-barras", "en", "web", "medio", 2],
  ["moderno-sans", "es", "web", "alto", 3],
  ["moderno-sans", "es", "datos", "alto", 3],
  ["moderno-sans", "es", "rrhh", "bajo", 2],
  ["moderno-sans", "en", "web", "alto", 3],
  ["clasico-numerado", "es", "otros", "bajo", 1],
  ["clasico-numerado", "es", "rrhh", "medio", 2],
  ["clasico-numerado", "es", "otros", "bajo", 1],
  ["docs-azul-tabla", "es", "datos", "alto", 4],
  ["docs-azul-tabla", "es", "rrhh", "alto", 4],
  ["docs-azul-tabla", "es", "web", "bajo", 2],
  ["docs-azul-tabla", "en", "datos", "medio", 3],
  ["canva-elegante", "es", "otros", "bajo", 3],
  ["canva-elegante", "es", "rrhh", "medio", 3],
  ["canva-elegante", "es", "datos", "medio", 3],
  ["canva-elegante", "es", "web", "medio", 2],
  ["canva-minimal", "es", "otros", "bajo", 0],
  ["canva-minimal", "es", "rrhh", "bajo", 1],
  ["canva-minimal", "es", "web", "bajo", 1],
  ["dos-columnas", "es", "web", "alto", 3],
  ["dos-columnas", "es", "datos", "alto", 2],
  ["dos-columnas", "es", "rrhh", "medio", 3],
  ["dos-columnas", "en", "datos", "bajo", 2],
];

const meses = (d: Mes, h: Mes) => (h.a - d.a) * 12 + (h.m - d.m);

function generarExperiencias(dominio: Dominio, lengua: Lengua, cantidad: number, aniosObjetivo: number): Experiencia[] {
  // Trabajos consecutivos hacia atrás desde HOY, en bloques de 6 meses (la suma queda en años con .0 o .5)
  const exps: Experiencia[] = [];
  const pool = mezclar(LOGROS[dominio][lengua].length ? LOGROS[dominio][lengua] : LOGROS[dominio].es);
  let usados = 0;
  const siguientes = (n: number) => Array.from({ length: n }, () => pool[usados++ % pool.length]);
  let mesesRestantes = Math.round(aniosObjetivo * 2) * 6;
  let fin: Mes | "actual" = azar() < 0.6 ? "actual" : { m: elegir([3, 6, 9]), a: 2026 };
  for (let i = 0; i < cantidad && mesesRestantes > 0; i++) {
    const duracion = i === cantidad - 1 ? mesesRestantes : Math.max(6, Math.min(mesesRestantes - 6 * (cantidad - 1 - i), entre(1, 4) * 6));
    const hasta: Mes = fin === "actual" ? HOY : fin;
    const total = hasta.a * 12 + (hasta.m - 1) - duracion;
    const desde: Mes = { a: Math.floor(total / 12), m: (total % 12) + 1 };
    exps.push({
      cargo: elegir(CARGOS[dominio][lengua].length ? CARGOS[dominio][lengua] : CARGOS[dominio].es),
      empresa: elegir(EMPRESAS),
      ciudad: elegir(CIUDADES),
      desde,
      hasta: fin,
      logros: siguientes(Math.min(pool.length, entre(4, 6))),
    });
    mesesRestantes -= duracion;
    // hueco de 0 a 6 meses entre trabajos (no suma experiencia)
    const hueco = elegir([0, 0, 3, 6]);
    const prev = desde.a * 12 + (desde.m - 1) - hueco;
    fin = { a: Math.floor(prev / 12), m: (prev % 12) + 1 };
  }
  return exps;
}

export function aniosDeExperiencia(exps: Experiencia[]): number {
  const total = exps.reduce((s, e) => s + meses(e.desde, e.hasta === "actual" ? HOY : e.hasta), 0);
  return Math.round((total / 12) * 10) / 10;
}

function generarEstudios(dominio: Dominio, nivelObjetivo: NivelEducativo, enCurso: boolean, lengua: Lengua): Estudio[] {
  const g = GRADOS[dominio];
  const est: Estudio[] = [];
  const egresoSecundaria = entre(2008, 2018);
  est.push({ grado: lengua === "en" ? "High school" : "Secundaria completa", institucion: elegir(COLEGIOS), nivel: "secundaria", enCurso: false, desde: egresoSecundaria - 5, hasta: egresoSecundaria });
  const tecnico = (curso: boolean): Estudio => ({ grado: g.tecnico, institucion: elegir(INSTITUTOS), nivel: "tecnico", enCurso: curso, desde: egresoSecundaria + 1, hasta: curso ? null : egresoSecundaria + 4 });
  const universitario = (curso: boolean): Estudio => ({
    grado: curso ? (lengua === "en" ? `${g.universitario} (undergraduate, in progress)` : `${g.universitario} (8.° ciclo, en curso)`) : lengua === "en" ? `Bachelor's degree in ${g.universitario}` : `Bachiller en ${g.universitario}`,
    institucion: elegir(UNIVERSIDADES), nivel: "universitario", enCurso: curso, desde: egresoSecundaria + 1, hasta: curso ? null : egresoSecundaria + 6,
  });
  const maestria = (curso: boolean): Estudio => ({ grado: g.maestria, institucion: elegir(POSGRADOS), nivel: "maestria", enCurso: curso, desde: 2024, hasta: curso ? null : 2026 });

  // Escalera de estudios terminados hasta el nivel objetivo (técnico O universitario, no ambos)
  const rango = NIVELES_EDUCATIVOS.indexOf(nivelObjetivo);
  if (rango === 1) est.push(tecnico(false));
  if (rango >= 2) est.push(universitario(false));
  if (rango >= 3) est.push(maestria(false));
  // Un estudio en curso del nivel siguiente NO cuenta como alcanzado
  if (enCurso) {
    if (rango === 0) est.push(tecnico(true));
    if (rango === 1) est.push(universitario(true));
    if (rango === 2) est.push(maestria(true));
  }
  return est.reverse(); // el más reciente primero, como en un CV real
}

export function nivelAlcanzado(estudios: Estudio[]): NivelEducativo | null {
  const terminados = estudios.filter((e) => !e.enCurso).map((e) => NIVELES_EDUCATIVOS.indexOf(e.nivel));
  return terminados.length ? NIVELES_EDUCATIVOS[Math.max(...terminados)] : null;
}

function generarHabilidades(dominio: Dominio, ajuste: Plan[3], lengua: Lengua): string[] {
  const { clave, extra } = HABILIDADES[dominio];
  const cuantasClave = ajuste === "alto" ? clave.length : ajuste === "medio" ? Math.ceil(clave.length / 2) : Math.min(1, clave.length);
  const elegidas = tomar(clave, cuantasClave).map((variantes) => elegir(variantes));
  const resultado = [...elegidas, ...tomar(extra, entre(3, 6))];
  return mezclar(resultado).map((h) => (lengua === "en" ? (HABILIDADES_EN[h] ?? h) : h));
}

let telefonoN = 100;
function crearPerfil(i: number, [estilo, lengua, dominio, ajuste, nExp]: Plan): Perfil {
  const femenino = azar() < 0.5;
  const nombre1 = elegir(femenino ? NOMBRES_F : NOMBRES_M);
  const ap1 = elegir(APELLIDOS);
  let ap2 = elegir(APELLIDOS);
  while (ap2 === ap1) ap2 = elegir(APELLIDOS);
  const nombre = `${nombre1} ${ap1} ${ap2}`;
  const sinTilde = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const email = `${sinTilde(nombre1)}.${sinTilde(ap1)}${entre(1, 99)}@example.com`;
  telefonoN += entre(1, 7);
  const formatoTel = elegir(["+51 900 000 {n}", "(+51) 900-000-{n}", "900 000 {n}"]);
  const telefono = formatoTel.replace("{n}", String(telefonoN));

  const aniosObjetivo = nExp === 0 ? 0 : ajuste === "alto" ? entre(3, 7) + (azar() < 0.5 ? 0.5 : 0) : ajuste === "medio" ? entre(1, 3) + (azar() < 0.5 ? 0.5 : 0) : entre(0, 1) + 0.5;
  const experiencias = nExp === 0 ? [] : generarExperiencias(dominio, lengua, nExp, aniosObjetivo);

  const nivelObjetivo: NivelEducativo =
    dominio === "otros" ? elegir(["secundaria", "secundaria", "universitario"] as const)
    : ajuste === "alto" ? elegir(["universitario", "universitario", "maestria"] as const)
    : ajuste === "medio" ? elegir(["tecnico", "universitario"] as const)
    : elegir(["secundaria", "tecnico"] as const);
  const enCurso = ajuste !== "alto" && azar() < 0.25;
  const estudios = generarEstudios(dominio, nivelObjetivo, enCurso, lengua);

  const idiomas = lengua === "en" ? elegir(IDIOMAS_EN) : dominio === "otros" ? elegir([[], [], IDIOMAS_ESCRITOS[4]]) : elegir(IDIOMAS_ESCRITOS);
  const cargoActual = experiencias[0]?.cargo ?? (lengua === "en" ? "Job seeker" : CARGOS[dominio].es[0]);

  const P1 = [
    `Profesional orientado a resultados, con experiencia como ${cargoActual.toLowerCase()}. Me caracterizo por la responsabilidad, la proactividad y el trabajo en equipo.`,
    `Persona comprometida con su trabajo, con facilidad para adaptarse a nuevos entornos y aprender nuevas herramientas. Me desempeño actualmente como ${cargoActual.toLowerCase()}.`,
    `Me considero una persona responsable, organizada y con gran disposición para aprender. He trabajado como ${cargoActual.toLowerCase()} en empresas de distintos rubros.`,
  ];
  const P2 = [
    "Busco aportar mis conocimientos y seguir creciendo en un entorno retador, contribuyendo a la mejora continua de los procesos del área.",
    "Me interesa desarrollarme en organizaciones que valoren la innovación, la ética y el aprendizaje constante.",
    "Destaco por mi capacidad de organización, comunicación con equipos multidisciplinarios y compromiso con los objetivos.",
  ];
  const resumen =
    lengua === "en"
      ? `${cargoActual} with hands-on experience in fast-paced teams. Focused on delivering reliable results, continuous learning and teamwork. Looking for opportunities to grow and contribute to the improvement of business processes.`
      : `${elegir(P1)} ${elegir(P2)}`;

  return {
    id: `cv-${String(i + 1).padStart(2, "0")}`,
    estilo,
    lengua,
    oferta: dominio === "otros" ? elegir(Object.values(OFERTA_POR_DOMINIO)) : OFERTA_POR_DOMINIO[dominio],
    ajuste,
    nombre,
    titular: lengua === "en" ? cargoActual : `${cargoActual}${dominio === "web" ? " | Desarrollo Web" : dominio === "datos" ? " | Análisis de Datos" : ""}`,
    email,
    telefono,
    ciudad: elegir(CIUDADES),
    web: azar() < 0.4 ? `linkedin.com/in/${sinTilde(nombre1)}-${sinTilde(ap1)}-ficticio` : null,
    resumen,
    experiencias,
    estudios,
    habilidades: generarHabilidades(dominio, ajuste, lengua),
    idiomas,
    certificaciones: azar() < 0.6 ? tomar(CERTIFICACIONES[dominio], entre(1, 2)) : [],
    proyectos: [],
    datosPersonales: estilo === "clasico-numerado" || estilo === "canva-minimal" ? { edad: entre(22, 52), estadoCivil: elegir(["Soltero(a)", "Casado(a)"]) } : null,
  };
}

export const PERFILES: Perfil[] = PLANES.map((plan, i) => {
  const perfil = crearPerfil(i, plan);
  const [, lengua, dominio, ajuste] = plan;
  if (lengua === "es" && ajuste !== "bajo" && PROYECTOS[dominio].length) {
    perfil.proyectos = tomar(PROYECTOS[dominio], 2).map((pr) => ({ ...pr, herramientas: tomar(perfil.habilidades, Math.min(3, perfil.habilidades.length)) }));
  }
  return perfil;
});

/** Lo que la IA debería extraer de cada CV (contrato CvExtraido). */
export function respuestaEsperada(p: Perfil): CvExtraido {
  return {
    nombre: p.nombre,
    email: p.email,
    telefono: p.telefono,
    // sin experiencia escrita en el CV, el dato no aparece: null (la IA no debe inventar 0)
    aniosExperiencia: p.experiencias.length ? aniosDeExperiencia(p.experiencias) : null,
    nivelEducativo: nivelAlcanzado(p.estudios),
    habilidades: p.habilidades,
    idiomas: p.idiomas.map(({ idioma, nivel }) => ({ idioma, nivel })),
  };
}
