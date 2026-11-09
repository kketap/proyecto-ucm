
import nodemailer from "nodemailer";

/* =====================================================
   TIPOS
===================================================== */

type ContactBody = {
  nombre?: unknown;
  telefono?: unknown;
  email?: unknown;
  motivo?: unknown;
  mensaje?: unknown;
};

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const CONTACT_TO = "paulina.ucm@gmail.com";

const MAX_BODY_BYTES = 8 * 1024;

const LIMITS = {
  nombre: 100,
  telefono: 30,
  email: 150,
  mensaje: 2000,
} as const;

const MOTIVOS: Record<string, string> = {
  "full-rescue": "Cotización Plan Full Rescue",
  servicios: "Información sobre servicios",
  cobertura: "Consulta de cobertura",
  otro: "Otra consulta",
};

/* =====================================================
   RESPUESTAS HTTP
===================================================== */

function jsonResponse(
  status: number,
  message: string,
  ok = false,
): Response {
  return Response.json(
    { ok, message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

/* =====================================================
   VALIDACIONES
===================================================== */

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > LIMITS.email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidChilePhone(telefono: string): boolean {
  if (!telefono || telefono.length > LIMITS.telefono) {
    return false;
  }

  // Aceptar espacios, guiones y paréntesis.
  const sanitized = telefono.replace(/[\s().-]/g, "");

  // Aceptar + solo al inicio.
  if (!/^\+?\d+$/.test(sanitized)) {
    return false;
  }

  // Formatos nacionales:
  // 967201651
  // 223914444
  //
  // Formatos internacionales:
  // +56967201651
  // 56967201651
  // +56223914444

  return /^(?:\+?56)?[2-9]\d{8}$/.test(sanitized);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validateContact(body: unknown):
  | {
    ok: true;
    data: {
      nombre: string;
      telefono: string;
      email: string;
      motivo: string;
      mensaje: string;
    };
  }
  | {
    ok: false;
    message: string;
  } {

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return {
      ok: false,
      message: "El cuerpo de la solicitud no es válido.",
    };
  }

  const input = body as ContactBody;

  // Validar tipos antes de procesarlos.
  if (
    typeof input.nombre !== "string" ||
    typeof input.telefono !== "string" ||
    typeof input.email !== "string" ||
    typeof input.motivo !== "string" ||
    (
      input.mensaje !== undefined &&
      typeof input.mensaje !== "string"
    )
  ) {
    return {
      ok: false,
      message: "Los campos contienen tipos de datos inválidos.",
    };
  }

  const nombre = cleanString(input.nombre);
  const telefono = cleanString(input.telefono);
  const email = cleanString(input.email).toLowerCase();
  const motivo = cleanString(input.motivo);
  const mensaje = cleanString(input.mensaje);

  if (!nombre) {
    return {
      ok: false,
      message: "El nombre es obligatorio.",
    };
  }

  if (nombre.length > LIMITS.nombre) {
    return {
      ok: false,
      message: "El nombre no puede superar 100 caracteres.",
    };
  }

  if (!telefono) {
    return {
      ok: false,
      message: "El teléfono es obligatorio.",
    };
  }

  if (!isValidChilePhone(telefono)) {
    return {
      ok: false,
      message: "Ingresa un teléfono chileno válido.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Ingresa un correo electrónico válido.",
    };
  }

  if (!motivo || !Object.hasOwn(MOTIVOS, motivo)) {
    return {
      ok: false,
      message: "Selecciona un motivo válido.",
    };
  }

  if (mensaje.length > LIMITS.mensaje) {
    return {
      ok: false,
      message: "El mensaje no puede superar 2000 caracteres.",
    };
  }

  return {
    ok: true,
    data: {
      nombre,
      telefono,
      email,
      motivo,
      mensaje,
    },
  };
}

/* =====================================================
   NETLIFY FUNCTION
===================================================== */

export default async (req: Request): Promise<Response> => {

  // ==========================================
  // 1. MÉTODO HTTP
  // ==========================================

  if (req.method !== "POST") {
    return Response.json(
      {
        ok: false,
        message: "Método no permitido.",
      },
      {
        status: 405,
        headers: {
          Allow: "POST",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  // ==========================================
  // 2. CONTENT-TYPE
  // ==========================================

  const contentType = req.headers.get("content-type") ?? "";

  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return jsonResponse(
      415,
      "El contenido debe enviarse en formato JSON.",
    );
  }

  // ==========================================
  // 3. LÍMITE DEL BODY
  // ==========================================

  const contentLength = req.headers.get("content-length");

  if (contentLength) {
    const declaredSize = Number(contentLength);

    if (
      Number.isFinite(declaredSize) &&
      declaredSize > MAX_BODY_BYTES
    ) {
      return jsonResponse(
        413,
        "La solicitud supera el tamaño permitido.",
      );
    }
  }

  let rawBody: string;

  try {
    // Leer con límite real, sin depender de Content-Length.
    if (!req.body) {
      return jsonResponse(
        400,
        "El cuerpo de la solicitud está vacío.",
      );
    }

    const reader = req.body.getReader();
    const decoder = new TextDecoder("utf-8", {
      fatal: true,
    });

    let totalBytes = 0;
    let result = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();

        return jsonResponse(
          413,
          "La solicitud supera el tamaño permitido.",
        );
      }

      result += decoder.decode(value, { stream: true });
    }

    result += decoder.decode();
    rawBody = result;
  } catch {
    return jsonResponse(
      400,
      "No fue posible leer el cuerpo de la solicitud.",
    );
  }

  // ==========================================
  // 4. PARSEAR JSON
  // ==========================================

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse(
      400,
      "El JSON enviado no es válido.",
    );
  }

  // ==========================================
  // 5. VALIDAR FORMULARIO
  // ==========================================

  const validation = validateContact(body);

  if (!validation.ok) {
    return jsonResponse(400, validation.message);
  }

  const {
    nombre,
    telefono,
    email,
    motivo,
    mensaje,
  } = validation.data;

  // ==========================================
  // 6. CREDENCIALES SMTP
  // ==========================================

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error(
      "[CONTACT] Configuración SMTP incompleta.",
    );

    return jsonResponse(
      503,
      "El servicio de contacto no está disponible temporalmente.",
    );
  }

  // ==========================================
  // 7. ENVÍO DEL CORREO
  // ==========================================

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    const motivoLabel = MOTIVOS[motivo];

    const safeNombre = escapeHtml(nombre);
    const safeTelefono = escapeHtml(telefono);
    const safeEmail = escapeHtml(email);
    const safeMotivo = escapeHtml(motivoLabel);

    const safeMensaje = mensaje
      ? escapeHtml(mensaje).replaceAll("\n", "<br />")
      : "Sin mensaje adicional.";

    const info = await transporter.sendMail({
      from: `"Sitio Web UCM" <${gmailUser}>`,

      to: CONTACT_TO,

      replyTo: email,

      subject: `[UCM Web] ${motivoLabel} - ${nombre.replace(/[\r\n]/g, " ")}`,

      text: `
Nueva solicitud desde el sitio web UCM

Motivo: ${motivoLabel}
Nombre: ${nombre}
Teléfono: ${telefono}
Correo: ${email}

Mensaje:
${mensaje || "Sin mensaje adicional."}
      `.trim(),

      html: `
        <!doctype html>
        <html lang="es">
          <body style="
            margin:0;
            padding:24px;
            background:#f3f4f6;
            font-family:Arial,Helvetica,sans-serif;
          ">
            <div style="
              max-width:600px;
              margin:auto;
              background:#ffffff;
              border-radius:16px;
              overflow:hidden;
            ">
              <div style="
                background:#0b4f8a;
                color:#ffffff;
                padding:24px;
              ">
                <h2 style="margin:0;">
                  Nueva solicitud UCM
                </h2>
                <p style="margin-bottom:0;">
                  ${safeMotivo}
                </p>
              </div>

              <div style="
                padding:24px;
                color:#1f2937;
                line-height:1.6;
              ">
                <p><strong>Nombre:</strong> ${safeNombre}</p>
                <p><strong>Teléfono:</strong> ${safeTelefono}</p>
                <p><strong>Correo:</strong> ${safeEmail}</p>

                <hr style="
                  border:0;
                  border-top:1px solid #e5e7eb;
                  margin:24px 0;
                " />

                <p><strong>Mensaje:</strong></p>
                <div style="
                  background:#f9fafb;
                  padding:16px;
                  border-radius:10px;
                  overflow-wrap:anywhere;
                ">
                  ${safeMensaje}
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Confirmar aceptación del destinatario por SMTP.
    const accepted = info.accepted.some(
      (address) => address.toLowerCase() === CONTACT_TO.toLowerCase(),
    );

    if (!accepted) {
      console.error(
        "[CONTACT] El servidor SMTP no aceptó al destinatario.",
      );

      return jsonResponse(
        502,
        "No fue posible procesar el envío del correo.",
      );
    }

    console.info("[CONTACT] Correo aceptado por SMTP.");

    return jsonResponse(
      200,
      "Tu solicitud fue enviada correctamente.",
      true,
    );

  } catch (error) {
    console.error("[CONTACT] Error de envío SMTP:", error);

    return jsonResponse(
      502,
      "No fue posible enviar la solicitud. Inténtalo nuevamente.",
    );
  }
};
