# Especificación Técnica de Arquitectura: Backend Real (Firebase + OpenAI)

Este documento detalla la arquitectura de referencia y el diseño del backend para la siguiente fase de desarrollo de la plataforma **Ayuda Mutua TELMEX**, migrando del prototipo de datos simulados a un entorno corporativo real.

---

## 1. Infraestructura y Base de Datos (Firebase)

### 1.1 Autenticación y Control de Acceso Basado en Roles (RBAC)
Se utilizará **Firebase Auth** para gestionar el ingreso seguro de usuarios. Los roles de usuario se asignarán mediante **Custom User Claims** en Firebase Auth:
- `asociado`: Acceso limitado al portal de asociados (Mi Resumen, Carga de Documentos, Inscripción a Eventos).
- `administrador`: Acceso a la consola de control, conciliación de aportaciones y auditoría técnica de expedientes (Ana Díaz).
- `director`: Acceso restringido al portal de finanzas, gráficos consolidados y dictámenes de auditoría externa.

### 1.2 Estructura del Modelo de Datos (Cloud Firestore)

#### Colección `asociados`
```json
{
  "id": "AS-1029",
  "name": "Eduardo Rius",
  "email": "rius@telmex.com",
  "company": "Teléfonos de México S.A.B. de C.V.",
  "role": "asociado",
  "accumulatedCuotas": 84500.00,
  "eligibleAgeRecovery": 60,
  "age": 62,
  "status": "Activo"
}
```

#### Colección `tramites`
```json
{
  "id": "TR-3920",
  "asociadoId": "AS-1029",
  "name": "Eduardo Rius",
  "type": "Recuperación de Cuotas",
  "amount": 84500.00,
  "status": "Aprobado",
  "date": "31/05/2026",
  "rejectReason": "",
  "validationHistory": [
    { "date": "29/05/2026", "user": "Ana Díaz (Fideicomiso)", "status": "Rechazado", "notes": "El máximo permitido es $90,000" },
    { "date": "30/05/2026", "user": "Ana Díaz (Fideicomiso)", "status": "Reabierto", "notes": "Asociado presentó reconsideración..." },
    { "date": "31/05/2026", "user": "Ana Díaz (Fideicomiso)", "status": "Aprobado", "notes": "Monto ajustado validado en arqueo..." }
  ],
  "expediente": {
    "curp": "https://storage.googleapis.com/.../curp.pdf",
    "ine": "https://storage.googleapis.com/.../ine.pdf",
    "nomina": "https://storage.googleapis.com/.../nomina.pdf",
    "comprobante": "https://storage.googleapis.com/.../clabe.pdf",
    "solicitud": "https://storage.googleapis.com/.../solicitud.pdf"
  },
  "fielSignature": {
    "hash": "f7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8",
    "firmante": "Ana Díaz (Fideicomiso)",
    "timestamp": "31/05/2026 10:42:15 AM"
  }
}
```

### 1.3 Reglas de Seguridad (Firestore Security Rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir a usuarios asociados leer su propio documento y trámites
    match /asociados/{asociadoId} {
      allow read: if request.auth != null && request.auth.uid == asociadoId;
      allow write: if false; // Solo administradores escriben el padrón
    }
    match /tramites/{tramiteId} {
      allow read: if request.auth != null && 
        (request.auth.token.role == 'administrador' || 
         request.auth.token.role == 'director' || 
         resource.data.asociadoId == request.auth.uid);
      allow write: if request.auth != null && request.auth.token.role == 'administrador';
    }
  }
}
```

---

## 2. Integración de Inteligencia Artificial Real (OpenAI / Claude)

El módulo **Copilot Rius AI** se conectará directamente a la API de **OpenAI (Assistant API v2)** o **Claude 3.5 Sonnet** a través de una Cloud Function en Firebase para mantener seguras las llaves de acceso (`API_KEYS`).

```
[Cliente Web (React)] <---> [Firebase HTTPS Cloud Function] <---> [OpenAI Assistant API]
                                    |
                                    v
                            [Lectura Firestore]
```

### 2.1 Flujo de Inferencia Contable:
1. El usuario hace una consulta en el chat widget.
2. La Cloud Function lee el estado actual consolidado en Firestore (número de trámites, montos, inconsistencias).
3. Se inyecta esta información como contexto del sistema (`system instructions`) al prompt de OpenAI.
4. El modelo genera la respuesta estructurada y se retorna al usuario en formato Markdown.

---

## 3. Emisión de Reportes (PDF, Excel, CSV)

La generación de archivos contables y cartas firmadas digitalmente se delegará a microservicios serverless:
- **PDFs con Firma Digital:** Generados en Cloud Functions mediante la biblioteca `pdfkit` o `puppeteer-core`. Se insertará el Hash SHA-256 e información de la FIEL del administrador, guardando el documento final en **Firebase Storage**.
- **Excel/CSV Consolidados:** Generados con `exceljs` en Node.js, empaquetando el padrón de aportaciones conciliadas por empresa de forma tabular.

---

## 4. Notificaciones Automatizadas (WhatsApp / Twilio)

Se configurará una integración con la API de **Twilio WhatsApp Business** gatillada por eventos en Firestore (Cloud Firestore Triggers):
- **Gatillo 1 (Trámite Dictaminado):** Al actualizar el estatus de un trámite en `/tramites/{id}` a `Aprobado` o `Rechazado`, una Cloud Function envía automáticamente una plantilla de mensaje de WhatsApp al asociado con el dictamen.
- **Gatillo 2 (Incumplimiento de Aportación):** Al expirar la fecha límite de carga de nómina de una empresa, el sistema puede programar y enviar una alerta automática a Recursos Humanos de la empresa correspondiente.
