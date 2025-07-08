# Guía de Seguridad para RestauraTuFoto

## Arquitectura de Seguridad

### Acceso a Base de Datos

El proyecto utiliza el sistema de seguridad a nivel de fila (Row Level Security, RLS) de Supabase para proteger los datos. Hay tres niveles de acceso:

1. **Usuarios autenticados**: Acceso limitado a sus propios datos (a través de políticas RLS específicas)
2. **Servicio interno**: Acceso controlado a través de funciones SQL seguras con `SECURITY DEFINER`
3. **Service role**: Acceso completo para operaciones administrativas (solo desde backend seguro como funciones de Node.js)

### Tablas Protegidas

Las siguientes tablas tienen restricciones de acceso directo:

- `trial_quota`: Almacena límites de pruebas gratuitas (solo accesible por `service_role`)
- `trial_usage`: Registro de uso de pruebas gratuitas (solo accesible por `service_role`)
- `profiles`: Información de usuarios (acceso limitado al propio perfil del usuario)
- `photos`: Imágenes de usuarios (acceso limitado a las propias fotos del usuario)

### Acceso a Funcionalidades

El acceso a las funcionalidades está controlado de la siguiente manera:

1. **Prueba gratuita**:
   - Acceso solo a través de la función de Node.js `check-trial`
   - La función de Node.js llama al procedimiento SQL `check_trial_availability`
   - No hay acceso directo a las tablas `trial_quota` o `trial_usage`

2. **Restauración de fotos**:
   - Los usuarios autenticados pueden procesar sus propias fotos
   - Las políticas RLS garantizan que solo puedan ver sus propios resultados

3. **Compras y créditos**:
   - Las transacciones de créditos se manejan a través de funciones seguras
   - Las políticas RLS garantizan que los usuarios solo pueden ver su propio saldo

## Buenas Prácticas Implementadas

1. **Principio de menor privilegio**: Los usuarios solo tienen acceso a lo que necesitan
2. **Funciones con SECURITY DEFINER**: Las funciones SQL se ejecutan con permisos elevados pero con acceso controlado
3. **Validación de entradas**: Todas las entradas de usuario son validadas antes de procesarlas
4. **Aislamiento de lógica sensible**: La lógica de negocio crítica se ejecuta en el servidor, no en el cliente
5. **Claves de servicio seguras**: Las claves de servicio (anon, service_role) solo se usan en contextos apropiados

## Recomendaciones para el Desarrollo

1. **Nunca exponer la clave service_role en el frontend**
2. **Siempre usar políticas RLS** en nuevas tablas
3. **Usar funciones SECURITY DEFINER** para operaciones que requieran permisos elevados
4. **Validar todas las entradas de usuario**
5. **Pruebas de seguridad regulares** para verificar que las políticas funcionan correctamente

## Gestión de Claves de API

Las claves de API y credenciales se manejan de la siguiente manera:

1. **Frontend**: Solo usa la clave anon pública
2. **Funciones de Node.js**: Usan la clave service_role para operaciones privilegiadas
3. **Variables de entorno**: Las claves sensibles se almacenan como variables de entorno
