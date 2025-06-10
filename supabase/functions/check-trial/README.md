# Check Trial Function

Esta función de Node.js maneja la verificación de disponibilidad de pruebas gratuitas para la aplicación RestauraTuFoto.

## Configuración

### Variables de Entorno

Asegúrate de tener las siguientes variables de entorno configuradas:

```env
SUPABASE_URL=https://supabase.inteliai.cl
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
PORT=3000
```

### Instalación

```bash
# Instalar dependencias
npm install

# Compilar TypeScript (opcional)
npm run build

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## Funcionalidad

La función:

1. Recibe peticiones HTTP en el puerto configurado (por defecto 3000)
2. Maneja CORS automáticamente
3. Obtiene la IP del cliente para verificar límites de prueba
4. Llama a la función SQL `check_trial_availability` de forma segura
5. Retorna si hay pruebas gratuitas disponibles

## Endpoints

### GET/POST /

Verifica la disponibilidad de pruebas gratuitas para la IP del cliente.

**Respuesta exitosa:**
```json
{
  "available": true
}
```

**Respuesta de error:**
```json
{
  "error": "Mensaje de error"
}
```

## Seguridad

- Usa la clave `service_role` para acceso privilegiado a la base de datos
- Las tablas de trial están protegidas con RLS (Row Level Security)
- Solo esta función puede acceder a los datos de pruebas gratuitas
- La IP del cliente se usa para limitar el abuso

## Despliegue

Esta función puede desplegarse en cualquier plataforma que soporte Node.js:

- Vercel
- Netlify Functions
- AWS Lambda
- Docker
- Servidor dedicado

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue.
