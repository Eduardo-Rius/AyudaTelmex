// Datos mock simulados para la plataforma de Ayuda Mutua TELMEX, A.C.

export const GENERAL_STATS = {
  totalAssociates: 7400,
  averageAge: 64,
  companiesCount: 15,
  pillarsCount: 4,
};

export const LOGGED_IN_USER = {
  id: "902847",
  name: "Eduardo Rius Torres",
  email: "eduardo.rius@gmail.com",
  role: "asociado",
  age: 66,
  company: "Telégrafos y Teléfonos del Noroeste, S.A. de C.V. (TELNOR)",
  status: "Vigente",
  policyType: "Completa (Fideicomiso Mutualista)",
  accumulatedCuotas: 85420.00,
  eligibleAgeRecovery: 65,
  beneficiaries: [
    { name: "María de Lourdes Rius", relationship: "Esposa", percentage: 50 },
    { name: "Eduardo Rius Jr.", relationship: "Hijo", percentage: 25 },
    { name: "Sofía Rius Torres", relationship: "Hija", percentage: 25 }
  ],
  activeTramites: [
    {
      id: "T-8921",
      type: "Recuperación de Cuotas",
      amount: 85420.00,
      status: "Validación de Aportaciones",
      statusStep: 1, // Paso 1 de 3
      startDate: "25/05/2026",
      logs: [
        { date: "25/05/2026 10:15", message: "Solicitud iniciada por el asociado." },
        { date: "25/05/2026 14:30", message: "Documentación preliminar cargada." }
      ]
    },
    {
      id: "T-8874",
      type: "Premio al Desempeño Académico (Nieta Sofía)",
      amount: 10000.00,
      status: "Revisión de Documentos",
      statusStep: 2,
      startDate: "20/05/2026",
      logs: [
        { date: "20/05/2026 09:00", message: "Solicitud recibida." },
        { date: "22/05/2026 11:45", message: "Boleta de calificaciones validada. En espera de acta de nacimiento." }
      ]
    }
  ],
  completedTramites: [
    {
      id: "T-7201",
      type: "Actualización de Beneficiarios",
      amount: null,
      status: "Aprobado",
      startDate: "10/01/2026",
      endDate: "12/01/2026"
    }
  ]
};

export const MOCK_EVENTS = [
  {
    id: "E-001",
    title: "Torneo Nacional de Ajedrez",
    description: "Competencia nacional para asociados de todas las seccionales del país. Modalidad suizo de 5 rondas.",
    venue: "Gimnasio TELMEX, Ciudad de México",
    date: "12 de Julio, 2026",
    time: "10:00 AM",
    status: "Registro Abierto",
    category: "Deportivo/Intelectual"
  },
  {
    id: "E-002",
    title: "Torneo Nacional de Boliche",
    description: "Torneo de boliche por equipos de 4 integrantes. Rama varonil, femenil y mixta.",
    venue: "Bol Bol Guadalajara, Jalisco",
    date: "24 de Agosto, 2026",
    time: "11:00 AM",
    status: "Registro Abierto",
    category: "Deportivo"
  },
  {
    id: "E-003",
    title: "Torneo Nacional de Dominó",
    description: "El tradicional torneo anual de dominó por parejas. Seccionales locales clasifican a la ronda final.",
    venue: "Club de Leones, Monterrey, Nuevo León",
    date: "05 de Septiembre, 2026",
    time: "09:00 AM",
    status: "Pre-registro",
    category: "Social/Intelectual"
  },
  {
    id: "E-004",
    title: "Carrera Atlética y Caminata Familiar 5K y 10K",
    description: "Evento atlético de convivencia familiar. Categorías por edad y caminata recreativa de 3K.",
    venue: "Paseo de la República, Querétaro",
    date: "18 de Octubre, 2026",
    time: "07:30 AM",
    status: "Registro Abierto",
    category: "Deportivo"
  },
  {
    id: "E-005",
    title: "Cena de Gala de Fin de Año",
    description: "Celebración y convivencia anual para festejar los logros de nuestra comunidad de asociados.",
    venue: "Centros Deportivos y Salones Seccionales (Todo el país)",
    date: "12 de Diciembre, 2026",
    time: "08:00 PM",
    status: "Próximamente",
    category: "Social"
  }
];

export const ADMIN_STATS = {
  activeAssociates: 7400,
  pendingTramitesCount: 48,
  companiesSubmitted: 12,
  totalCompanies: 15,
  inconsistenciesCount: 3,
};

export const SYSTEM_ALERTS = [
  {
    id: "A-1",
    type: "warning",
    message: "La empresa Uninet S.A. de C.V. no ha enviado el archivo de aportaciones del periodo actual (Fecha límite superada).",
    timestamp: "Hace 2 horas"
  },
  {
    id: "A-2",
    type: "error",
    message: "Archivo de Consorcio Red Uno tiene 18 registros con diferencias de importe vs arqueo bancario.",
    timestamp: "Hace 4 horas"
  },
  {
    id: "A-3",
    type: "info",
    message: "Arqueo mensual del fondo de Ayuda Mutua listo para revisión del Comité de Fideicomiso.",
    timestamp: "Hoy por la mañana"
  },
  {
    id: "A-4",
    type: "warning",
    message: "Archivo de Uno TV tiene 3 registros con CURP no coincidentes con el padrón histórico.",
    timestamp: "Ayer"
  }
];

export const COMPANY_CONTRIBUTIONS = [
  { company: "TELMEX (Teléfonos de México, S.A.B. de C.V.)", date: "28/05/2026", records: 5420, total: 1245600.00, status: "recibido" },
  { company: "TELNOR (Telégrafos y Teléfonos del Noroeste, S.A. de C.V.)", date: "28/05/2026", records: 840, total: 193200.00, status: "recibido" },
  { company: "Red Uno S.A. de C.V.", date: "27/05/2026", records: 310, total: 71300.00, status: "recibido" },
  { company: "Uninet S.A. de C.V.", date: "N/A", records: 0, total: 0.00, status: "pendiente" },
  { company: "Consorcio Red Uno", date: "25/05/2026", records: 120, total: 27600.00, status: "inconsistente" },
  { company: "Triara (Vance Asesoría de Negocios, S.A. de C.V.)", date: "26/05/2026", records: 150, total: 34500.00, status: "recibido" },
  { company: "CTAM (Compañía de Teléfonos y Bienes Raíces)", date: "27/05/2026", records: 95, total: 21850.00, status: "recibido" },
  { company: "Telvista S.A. de C.V.", date: "28/05/2026", records: 215, total: 49450.00, status: "recibido" },
  { company: "Scitum S.A. de C.V.", date: "28/05/2026", records: 80, total: 18400.00, status: "recibido" },
  { company: "Claro Video S.A. de C.V.", date: "N/A", records: 0, total: 0.00, status: "pendiente" },
  { company: "Uno TV (Compañía de Información Deportiva)", date: "25/05/2026", records: 45, total: 10350.00, status: "inconsistente" },
  { company: "Editorial Telmex", date: "26/05/2026", records: 55, total: 12650.00, status: "recibido" },
  { company: "Fundación Carlos Slim", date: "27/05/2026", records: 60, total: 13800.00, status: "recibido" },
  { company: "Sanborns Hermanos (Seguros de grupo)", date: "N/A", records: 0, total: 0.00, status: "pendiente" },
  { company: "Sears Roebuck de México (Seguros de grupo)", date: "27/05/2026", records: 110, total: 25300.00, status: "recibido" }
];

export const RECENT_TRAMITES = [
  { id: "T-8930", name: "Juan Manuel López", type: "Recuperación de Cuotas", amount: 92400.00, status: "Pendiente", date: "29/05/2026" },
  { id: "T-8929", name: "Silvia Martínez", type: "Actualización de Beneficiarios", amount: null, status: "Pendiente", date: "29/05/2026" },
  { id: "T-8925", name: "Carlos Mendoza", type: "Premio al Desempeño Académico", amount: 15000.00, status: "En Revisión", date: "28/05/2026" },
  { id: "T-8924", name: "Teresa Sánchez", type: "Registro Evento Boliche", amount: null, status: "Aprobado", date: "28/05/2026" },
  { id: "T-8922", name: "Raúl García", type: "Recuperación de Cuotas", amount: 78500.00, status: "Aprobado", date: "27/05/2026" },
  { id: "T-8921", name: "Eduardo Rius Torres", type: "Recuperación de Cuotas", amount: 85420.00, status: "En Validación", date: "25/05/2026" },
  { id: "T-8874", name: "Eduardo Rius Torres", type: "Premio al Desempeño Académico", amount: 10000.00, status: "En Revisión", date: "20/05/2026" },
  { id: "T-8790", name: "Carmen Ortiz", type: "Actualización de Beneficiarios", amount: null, status: "Aprobado", date: "26/05/2026" }
];
