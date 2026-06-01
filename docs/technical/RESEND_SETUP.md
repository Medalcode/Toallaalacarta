# 📧 Configuración de Emails con Resend

## ¿Qué es Resend?

Resend es un servicio moderno de emails transaccionales diseñado para desarrolladores. Es fácil de configurar, tiene una API simple y ofrece un plan gratuito generoso (100 emails/día, 3,000 emails/mes).

---

## 🚀 Paso 1: Crear Cuenta en Resend

1. Ve a [https://resend.com](https://resend.com)
2. Haz clic en "Sign Up"
3. Regístrate con tu email o GitHub
4. Verifica tu email

---

## 🔑 Paso 2: Obtener API Key

1. Una vez dentro del dashboard, ve a **"API Keys"** en el menú lateral
2. Haz clic en **"Create API Key"**
3. Dale un nombre descriptivo (ej: "Toalla a la Carta - Production")
4. Selecciona los permisos:
   - ✅ **Sending access** (para enviar emails)
5. Haz clic en **"Add"**
6. **¡IMPORTANTE!** Copia la API Key inmediatamente (solo se muestra una vez)
   - Formato: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 📧 Paso 3: Configurar Dominio (Opcional pero Recomendado)

### Opción A: Usar el dominio de prueba (más rápido)

Por defecto, Resend te da un dominio de prueba: `onboarding@resend.dev`

**Ventajas:**

- ✅ Funciona inmediatamente
- ✅ No requiere configuración DNS
- ✅ Perfecto para desarrollo y pruebas

**Desventajas:**

- ❌ Los emails pueden ir a spam
- ❌ No es profesional para producción

### Opción B: Usar tu propio dominio (recomendado para producción)

1. En el dashboard de Resend, ve a **"Domains"**
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `toallaalacarta.cl`)
4. Resend te dará registros DNS para configurar:

```
Type: TXT
Name: @
Value: resend-verification=xxxxxxxxxxxxx

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@resend.com

Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

5. Agrega estos registros en tu proveedor de DNS (GoDaddy, Cloudflare, etc.)
6. Espera 24-48 horas para la propagación DNS
7. Verifica el dominio en Resend

---

## ⚙️ Paso 4: Configurar Variables de Entorno

### En Desarrollo (Local)

1. Copia `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edita `.env` y agrega tus credenciales de Resend:

```bash
# Resend Email Configuration
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Toalla a la Carta <noreply@toallaalacarta.cl>"
EMAIL_REPLY_TO="contacto@toallaalacarta.cl"
PUBLIC_SITE_URL="http://localhost:4321"
```

**Notas:**

- Si usas el dominio de prueba, usa: `EMAIL_FROM="Toalla a la Carta <onboarding@resend.dev>"`
- Si usas tu dominio verificado, usa: `EMAIL_FROM="Toalla a la Carta <noreply@tudominio.cl>"`

### En Producción (Vercel/Netlify/etc.)

Agrega las mismas variables de entorno en tu plataforma de hosting:

**Vercel:**

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega cada variable:
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `EMAIL_REPLY_TO`
   - `PUBLIC_SITE_URL`

**Netlify:**

1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Agrega las variables

---

## 🧪 Paso 5: Probar el Envío de Emails

### Prueba 1: Email de Bienvenida

1. Inicia el servidor:

   ```bash
   npm run dev
   ```

2. Registra un nuevo usuario en http://localhost:4321/sign-up

3. Verifica:
   - ✅ El registro se completa exitosamente
   - ✅ Recibes un email de bienvenida
   - ✅ El email tiene el diseño correcto
   - ✅ Los links funcionan

### Prueba 2: Email de Confirmación de Pedido

1. Inicia sesión con el usuario creado

2. Agrega productos al carrito

3. Completa el checkout

4. Verifica:
   - ✅ El pedido se crea correctamente
   - ✅ Recibes un email de confirmación
   - ✅ El email muestra el número de orden
   - ✅ Los items del pedido se muestran correctamente
   - ✅ La dirección de envío es correcta

---

## 📊 Paso 6: Monitorear Emails en Resend

1. Ve al dashboard de Resend
2. Haz clic en **"Emails"** en el menú lateral
3. Verás todos los emails enviados con:
   - Estado (Sent, Delivered, Bounced, etc.)
   - Destinatario
   - Asunto
   - Fecha y hora
   - Logs detallados

---

## 🔧 Solución de Problemas

### Error: "Missing API key"

**Problema:** La variable `RESEND_API_KEY` no está configurada.

**Solución:**

1. Verifica que `.env` existe y tiene la API key
2. Reinicia el servidor de desarrollo
3. Verifica que la API key es correcta (empieza con `re_`)

### Error: "Invalid sender email"

**Problema:** El email del remitente no está verificado.

**Solución:**

- Si usas dominio personalizado, verifica que esté configurado correctamente en Resend
- Si usas dominio de prueba, usa `onboarding@resend.dev`

### Los emails van a spam

**Problema:** Los emails se marcan como spam.

**Solución:**

1. Configura tu propio dominio (no uses `onboarding@resend.dev` en producción)
2. Verifica que todos los registros DNS estén configurados correctamente
3. Agrega SPF, DKIM y DMARC records
4. Evita palabras spam en el asunto y contenido

### No recibo emails

**Problema:** Los emails no llegan.

**Solución:**

1. Revisa la carpeta de spam
2. Verifica los logs en el dashboard de Resend
3. Verifica que el email del destinatario es correcto
4. Revisa los logs del servidor (`console.log`)

---

## 📈 Límites del Plan Gratuito

Resend ofrece un plan gratuito generoso:

- ✅ **100 emails por día**
- ✅ **3,000 emails por mes**
- ✅ **1 dominio personalizado**
- ✅ **API completa**
- ✅ **Logs y analytics**

Para más emails, considera actualizar al plan Pro ($20/mes para 50,000 emails).

---

## 🎨 Personalizar Templates de Email

Los templates están en `/src/lib/email.ts`. Puedes personalizar:

### Colores

```typescript
// Cambia el gradiente del header
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

// Cambia el color primario
color: #667eea;
```

### Logo

Agrega tu logo en el header:

```html
<img
  src="${EMAIL_CONFIG.companyUrl}/logo.png"
  alt="Logo"
  style="height: 40px;"
/>
```

### Contenido

Modifica el HTML en las funciones `sendOrderConfirmationEmail` y `sendWelcomeEmail`.

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Resend creada
- [ ] API Key obtenida y guardada
- [ ] Variables de entorno configuradas en `.env`
- [ ] Dominio configurado (opcional)
- [ ] Email de bienvenida probado
- [ ] Email de confirmación de pedido probado
- [ ] Emails recibidos correctamente
- [ ] Templates personalizados (opcional)

---

## 🔗 Recursos Útiles

- [Documentación de Resend](https://resend.com/docs)
- [Guía de configuración de dominio](https://resend.com/docs/dashboard/domains/introduction)
- [Ejemplos de templates](https://resend.com/docs/send-with-nodejs)
- [API Reference](https://resend.com/docs/api-reference/introduction)

---

## 🚀 Próximos Pasos

Una vez configurado Resend:

1. ✅ Prueba ambos tipos de emails
2. ✅ Verifica que lleguen correctamente
3. ✅ Personaliza los templates si es necesario
4. ✅ Configura tu dominio para producción
5. ✅ Continúa con el Panel de Administración

---

**¿Listo para configurar Resend?** Sigue los pasos y avísame si tienes algún problema. 🎯
