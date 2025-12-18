# 🍽️ YumYum - Plan Maestro de Producto

**Sistema Integral de Gestión de Reservas, Menú Digital y Experiencia del Cliente**

Versión: 2.0
Fecha: 2025-12-12
Equipo: Múltiples desarrolladores
Timeline: 24 semanas (6 meses)

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [YumYum Intelligence Engine](#yumyum-intelligence-engine) ⭐ **DIFERENCIADOR CLAVE**
3. [Modelo de Negocio](#modelo-de-negocio)
4. [Arquitectura Técnica](#arquitectura-técnica)
5. [Modelo de Datos](#modelo-de-datos)
6. [Features Completos](#features-completos)
7. [Plan de Trabajo](#plan-de-trabajo)
8. [Infraestructura y DevOps](#infraestructura-y-devops)
9. [Seguridad](#seguridad)
10. [Riesgos y Mitigaciones](#riesgos-y-mitigaciones)
11. [Costos y Pricing](#costos-y-pricing)
12. [Métricas y KPIs](#métricas-y-kpis)

---

## 🎯 Resumen Ejecutivo

### Problema

Los restaurantes pierden dinero y eficiencia por:

- **No-shows constantes** (15-25% de reservas)
- Gestión manual y caótica de reservas
- Menús en papel costosos y desactualizados
- Sin datos de clientes (CRM inexistente)
- Sin capacidad de pre-venta o marketing directo
- Experiencia del cliente fragmentada

### Solución

**"El sistema todo-en-uno para restaurantes modernos: reservas inteligentes, menú digital, pre-orden, órdenes en mesa y marketing automatizado."**

YumYum es una plataforma que:

1. **Reduce no-shows** con confirmaciones automáticas por WhatsApp
2. **Permite pre-ordenar** entradas/bebidas al reservar (anticipo + comida lista)
3. **Digitaliza el menú** con QR, actualizaciones en tiempo real y órdenes desde mesa
4. **Construye base de clientes** con CRM, fidelización y campañas de marketing
5. **Personalización completa** (white-label) para cada restaurante

### ICP (Ideal Customer Profile)

```
Tipo: Restaurantes y bares de nivel medio-alto
Tamaño: 10-50 mesas
Ticket medio: $40,000-$150,000 COP por persona
Ubicación: Bogotá, Medellín, Cali (ciudades principales)
Características:
  - Reservas frecuentes (no walk-in puro)
  - Menú con 30+ items
  - Clientes recurrentes (potencial de fidelización)
  - Interés en tecnología
Decisor: Dueño o administrador general
```

### Diferenciador vs Competencia

| Característica                    | Precompro | OpenTable | **YumYum**               |
| --------------------------------- | --------- | --------- | ------------------------ |
| Canal principal                   | Panel web | App móvil | **WhatsApp**             |
| Anticipo                          | No        | Sí        | **Sí**                   |
| Pre-orden de comida               | No        | No        | **🔥 Sí (ÚNICO)**        |
| Menú digital                      | No        | No        | **Sí + órdenes**         |
| Órdenes desde mesa                | No        | No        | **Sí**                   |
| Marketing WhatsApp                | No        | No        | **Sí**                   |
| CRM + fidelización                | Básico    | Sí        | **Sí**                   |
| Personalización (white-label)     | No        | No        | **Completa**             |
| Overbooking inteligente           | No        | Sí        | **Sí (basado en IA)**    |
| Reportes avanzados                | Básico    | Sí        | **Completo + heatmaps**  |
| **Intelligence Engine**           | **No**    | **No**    | **🔥 Sí (GAME CHANGER)** |
| Perfiles de clientes enriquecidos | No        | Básico    | **Completo + ML**        |
| Recomendaciones cross-restaurant  | No        | No        | **🔥 Sí (ÚNICO)**        |
| Campañas hyper-personalizadas     | No        | No        | **Sí**                   |

**Propuestas únicas:**

1. **Pre-orden + anticipo**: Cliente paga $80k, ordena entrada y bebida, llega al restaurante y ya está servido.
2. **Intelligence Engine** (EL MOAT): Base de datos centralizada + ML. YumYum conoce a TODOS los clientes de TODOS los restaurantes. Puede recomendar: "Te gustó la pasta en El Cielo, prueba la pasta en La Fragata". **Network effect masivo.**

---

## 🧠 YumYum Intelligence Engine

### El Diferenciador Definitivo

**YumYum no es solo un sistema de reservas. Es una plataforma de inteligencia de clientes.**

Mientras Precompro y OpenTable solo rastrean reservas, **YumYum construye perfiles completos** de cada cliente:

- Qué come
- Qué le gusta y qué no
- Alergias y preferencias dietéticas
- Ocasiones (cumpleaños, aniversarios, citas de negocios)
- Nivel de gasto
- Frecuencia de visitas
- Restaurantes favoritos

**Y lo hace de forma gradual, sin ser invasivo.**

---

### Cómo Funciona

#### 1. Recolección de Datos (Sin Friccionar)

**Al hacer la reserva (obligatorio):**

```
Formulario de reserva:
├─ Nombre, teléfono, email (estándar)
├─ Número de personas (estándar)
├─ Fecha y hora (estándar)
│
├─ ¿Ocasión especial? ⭐ NUEVO
│  ○ Cumpleaños
│  ○ Aniversario
│  ○ Cita romántica
│  ○ Negocios
│  ○ Casual
│  ○ Celebración
│
└─ ¿Alguien tiene alergias o restricciones? ⭐ NUEVO
   □ Sin gluten
   □ Sin lactosa
   □ Vegetariano
   □ Vegano
   □ Mariscos (alergia)
   □ Nueces (alergia)
   □ Otro: _______
```

**Después de la visita (WhatsApp automático):**

```
WhatsApp (24h después de la visita):

"¡Hola Juan! Gracias por visitarnos ayer en El Cielo.

¿Cómo estuvo todo?
5️⃣ Excelente
4️⃣ Bueno
3️⃣ Regular
2️⃣ Malo
1️⃣ Muy malo"

[Cliente responde "5"]

"¡Genial!

¿Qué fue lo que más te gustó?
1️⃣ La comida
2️⃣ El servicio
3️⃣ El ambiente
4️⃣ Todo"

[Cliente responde "1"]

"¿Qué plato te gustó más?
1️⃣ Entrada
2️⃣ Plato fuerte
3️⃣ Postre
4️⃣ Bebidas"

[Cliente responde "2"]

"¿Cuál plato fuerte ordenaste?
(Escríbelo o elige)"

[Cliente: "Carbonara"]

"¡Perfecto! 🍝

Ahora sabemos que te encanta la Carbonara.

Te avisaremos cuando tengamos platos similares.

¿Quieres dejar una reseña pública?
1️⃣ Sí
2️⃣ No"
```

**Recolección progresiva (2da, 3ra reserva):**

```
2da reserva:
"Hola Juan, ¿qué tan picante te gusta la comida?
🌶️ Nada
🌶️🌶️ Poco
🌶️🌶️🌶️ Medio
🌶️🌶️🌶️🌶️ Mucho"

3ra reserva:
"¿Prefieres vino tinto o blanco?
🍷 Tinto
🍾 Blanco
🍺 Cerveza
🥤 Sin alcohol"

4ta reserva:
"Cuando vienes a restaurantes, ¿qué buscas?
1️⃣ Probar algo nuevo
2️⃣ Comer mi plato favorito
3️⃣ Depende del día"
```

---

#### 2. Perfiles Enriquecidos

**Ejemplo de perfil de cliente:**

```
Juan Pérez (+573001234567)
──────────────────────────────────────

📊 ESTADÍSTICAS GENERALES
├─ Visitas totales: 24 (en 6 restaurantes diferentes)
├─ Gasto total: $4,800,000 COP
├─ Ticket promedio: $200,000 COP
├─ Última visita: hace 8 días (La Fragata)
├─ Frecuencia: 2.1 visitas/mes
├─ No-shows: 0
└─ Puntos YumYum: 1,250

🍽️ PREFERENCIAS ALIMENTICIAS
├─ Alergias: Ninguna
├─ Restricciones: Sin lactosa
├─ Dieta: Omnívoro
├─ Nivel de picante: Medio (🌶️🌶️🌶️)
└─ Preferencia: Explorador (le gusta probar cosas nuevas)

❤️ PLATOS FAVORITOS (ML)
1. Pasta Carbonara ⭐⭐⭐⭐⭐ (ordenada 5 veces)
2. Pizza Margarita ⭐⭐⭐⭐⭐ (ordenada 4 veces)
3. Risotto de hongos ⭐⭐⭐⭐ (ordenada 3 veces)
4. Salmón a la plancha ⭐⭐⭐⭐ (ordenada 2 veces)

🍷 BEBIDAS PREFERIDAS
1. Vino tinto (Malbec) - 60% de las veces
2. Cerveza artesanal - 30%
3. Limonada - 10%

🎉 OCASIONES
├─ Cumpleaños: 15 de marzo
├─ Aniversario: 20 de junio
├─ Visitas de negocios: 30%
├─ Citas románticas: 20%
└─ Casual: 50%

🏆 TAGS AUTOMÁTICOS (ML)
├─ Cliente VIP (gasto >$3M)
├─ Foodie (prueba platos nuevos)
├─ Wine lover
├─ Italian food enthusiast
└─ Weekend regular (70% visitas Vie-Sáb)

🏪 RESTAURANTES FAVORITOS
1. El Cielo - 8 visitas
2. La Fragata - 6 visitas
3. Andrés Carne de Res - 4 visitas
```

---

#### 3. Segmentación Automática con ML

**Algoritmo simple de clustering:**

```python
# Pseudo-código

# Segmento 1: Foodies (30% de clientes)
Características:
  - Alta variedad de platos (>10 platos diferentes)
  - Prueba restaurantes nuevos
  - Gasto medio-alto
  - Lee reseñas antes de reservar

# Segmento 2: Loyalistas (25% de clientes)
Características:
  - Siempre ordena lo mismo (1-3 platos)
  - Restaurante favorito (>60% visitas)
  - Alta frecuencia (>2 visitas/mes)

# Segmento 3: Ocasionales (20% de clientes)
Características:
  - Solo ocasiones especiales (cumpleaños, aniversarios)
  - 1-2 visitas/año
  - Gasto alto por visita

# Segmento 4: Corporativos (15% de clientes)
Características:
  - Visitas de negocios
  - Horarios de almuerzo (12-14h)
  - Gasto medio, propinas altas

# Segmento 5: Value Seekers (10% de clientes)
Características:
  - Usan descuentos y promociones
  - Visitas en happy hour
  - Gasto bajo-medio
```

**Dashboard para restaurantes:**

```
TUS CLIENTES (Segmentación automática)
──────────────────────────────────────

👨‍🍳 Foodies: 127 clientes (32%)
   "Clientes que buscan experiencias culinarias únicas"
   - Gasto promedio: $220k
   - Sugerencia: Notificar cuando tengas platos nuevos

💎 VIP Loyalistas: 45 clientes (11%)
   "Tus mejores clientes, vienen 3+ veces/mes"
   - Gasto total: $18M COP (último año)
   - Sugerencia: Programa VIP con beneficios exclusivos

🎉 Celebraciones: 89 clientes (22%)
   "Solo vienen para ocasiones especiales"
   - Sugerencia: Recordatorios en cumpleaños/aniversarios

💼 Corporativos: 63 clientes (16%)
   "Clientes de negocios, horarios de almuerzo"
   - Sugerencia: Menú ejecutivo, espacios privados

🌱 Veganos/Vegetarianos: 34 clientes (8%)
   "Dietas plant-based"
   - Sugerencia: Ampliar menú vegano

🌶️ Amantes del picante: 52 clientes (13%)
   - Sugerencia: Marcar platos picantes en el menú
```

---

#### 4. Campañas Hyper-Personalizadas

**Ejemplos reales que YumYum puede hacer:**

**Campaña 1: Basada en historial de órdenes**

```
A: Juan Pérez
Último plato: Carbonara (⭐⭐⭐⭐⭐)
Días desde última visita: 18

Mensaje:
"Hola Juan 👋

Hace 2 semanas ordenaste Carbonara en El Cielo
y le diste 5 estrellas.

Tenemos un nuevo plato que te va a encantar:
🍝 Fettuccine Alfredo con trufa negra

Chef recomendado para fans de la Carbonara.

Reserva este fin de semana y recibe 15% off.

[Reservar ahora]
[No, gracias]"

Conversión esperada: 18-25%
```

**Campaña 2: Cross-restaurant (EL GOLD MINE)**

```
A: María López
Restaurante favorito: El Cielo (italiana)
Plato favorito: Risotto de hongos

Mensaje:
"Hola María 🍄

Sabemos que te encanta el Risotto de El Cielo.

La Fragata (restaurante nuevo en YumYum) tiene un
Risotto de trufa que está recibiendo ⭐⭐⭐⭐⭐.

Como cliente VIP de YumYum, tienes:
✓ 20% off en tu primera visita
✓ Entrada gratis

[Ver menú de La Fragata]
[Reservar]"

Conversión esperada: 30-40% (porque es altamente relevante)

Beneficio para YumYum:
  - Restaurante nuevo (La Fragata) gana cliente
  - Cliente descubre nuevo lugar
  - Network effect: más restaurantes → más valor
```

**Campaña 3: Cumpleaños**

```
A: Pedro González
Cumpleaños: En 3 días (15 de marzo)
Restaurante favorito: Andrés Carne de Res

Mensaje:
"¡Pedro, tu cumpleaños es en 3 días! 🎂

¿Ya tienes planes?

En Andrés Carne de Res te regalamos:
🎁 Postre especial de cumpleaños
🥂 Copa de champagne
🎵 Serenata con mariachi

Reserva para 4+ personas y activa tu regalo.

[Reservar mi cumpleaños]"

Conversión: 40-50% (cumpleaños es high-intent)
```

**Campaña 4: Win-back (Clientes inactivos)**

```
A: Clientes que no visitan hace 60+ días
Segmento: Loyalistas inactivos

Mensaje:
"Laura, te extrañamos en El Cielo 🥺

Hace 2 meses que no vienes y notamos que antes
venías 2 veces al mes.

¿Pasó algo? ¿Podemos mejorar?

Si reservas esta semana, tienes:
✓ Tu plato favorito (Salmón) con 30% off
✓ Bebida gratis

Queremos verte de vuelta ❤️

[Reservar]
[Danos feedback]"

Conversión: 15-20% (win-back es difícil)
```

**Campaña 5: Recomendación de plato nuevo**

```
A: Clientes que ordenaron "Pasta" 3+ veces
Total: 247 clientes

Mensaje:
"¡Hola! 🍝

Notamos que eres fan de la pasta italiana.

El Cielo acaba de lanzar:
📢 Pasta Aglio e Olio con camarones

Chef Mario (ganador de premio gastronómico)
dice: "Perfecta para lovers de la Carbonara"

Pruébala esta semana y danos tu opinión.
Si no te gusta, es gratis.

[Reservar]"

Conversión: 25-30%
Costo: Riesgo bajo (si no le gusta, 1 plato gratis = $25k)
Beneficio: Feedback real + engagement
```

---

#### 5. Predicciones y Analytics con ML

**Feature 1: Predicción de órdenes (Inventory Management)**

```python
# Modelo simple: Linear Regression

Variables:
  - Día de la semana
  - Mes
  - Clima (lluvioso = más pizzas, soleado = más ensaladas)
  - Eventos cercanos (concierto, partido)
  - Reservas confirmadas
  - Histórico de órdenes

Predicción para Viernes 15/12:
  ├─ Carbonara: 18 órdenes (±3)
  ├─ Pizza Margarita: 24 órdenes (±4)
  ├─ Risotto: 12 órdenes (±2)
  └─ Salmón: 15 órdenes (±3)

Sugerencia de inventario:
  ✓ Comprar 2kg extra de pasta
  ✓ Comprar 3kg extra de queso mozzarella
  ⚠️ Salmón: stock actual suficiente
```

**Dashboard para restaurante:**

```
PREDICCIÓN DE DEMANDA - Viernes 15/12
─────────────────────────────────────

🔥 ALTA DEMANDA (preparar extra):
  - Pizza Margarita: 24 órdenes esperadas
  - Carbonara: 18 órdenes
  - Alitas: 16 órdenes

✅ DEMANDA NORMAL:
  - Risotto: 12 órdenes
  - Salmón: 15 órdenes

📉 BAJA DEMANDA:
  - Ceviche: 4 órdenes (clima frío predicho)

💡 SUGERENCIAS:
  - Tienes 12 reservas confirmadas para 4+ personas
    → Probablemente ordenarán entrante para compartir
    → Preparar 8-10 entradas extra
```

**Feature 2: Optimización de menú**

```
ANÁLISIS DE MENÚ - Último mes
─────────────────────────────

🏆 TOP PERFORMERS (mantener):
  1. Carbonara - 87 órdenes, ⭐4.8, margen 65%
  2. Pizza - 76 órdenes, ⭐4.7, margen 70%
  3. Risotto - 54 órdenes, ⭐4.6, margen 60%

⚠️ UNDERPERFORMERS (revisar):
  - Ceviche - 12 órdenes, ⭐3.9, margen 55%
    Sugerencia: Mejorar receta o remover del menú

  - Lasagna - 18 órdenes, ⭐4.2, margen 50%
    Sugerencia: Reducir precio o promocionar más

💎 JOYAS ESCONDIDAS (promocionar):
  - Ossobuco - 8 órdenes, ⭐5.0, margen 75%
    Problema: Nadie lo conoce
    Sugerencia: Campaña a clientes VIP

🆕 OPORTUNIDADES:
  - 34% de tus clientes son veganos/vegetarianos
    pero solo tienes 3 platos veganos
    → Sugerencia: Agregar 2-3 platos veganos
```

**Feature 3: Insights de clientes individuales**

```
CLIENTE: Juan Pérez
────────────────────

🎯 PRÓXIMA VISITA PREDICHA:
   Viernes 22/12 (85% probabilidad)
   Motivo: Patrón de visitas cada 2 semanas en viernes

📊 PREDICCIÓN DE ORDEN:
   1. Carbonara (70% probabilidad)
   2. Pizza Margarita (20%)
   3. Risotto (10%)

💡 RECOMENDACIÓN:
   - Juan siempre ordena vino tinto Malbec
   - Tienes una botella premium nueva
   - Sugerencia: Mesero le ofrece degustación gratis
   - Upsell esperado: +$80,000 COP

🎂 EVENTO IMPORTANTE:
   Cumpleaños en 12 días (15 de marzo)
   - Enviar campaña de cumpleaños (día -3)
   - Preparar postre especial si reserva
```

---

#### 6. El Network Effect

**Por qué esto es IMPARABLE:**

```
Escenario 1: YumYum tiene 10 restaurantes
───────────────────────────────────────
Clientes totales: ~5,000
Data points: ~50,000
Valor de recomendaciones: Bajo (poca variedad)

Escenario 2: YumYum tiene 100 restaurantes
───────────────────────────────────────
Clientes totales: ~50,000
Data points: ~2,000,000
Valor de recomendaciones: ALTO

Puede recomendar:
  "Te gusta italiana → prueba estos 12 restaurantes"
  "Te gusta vegano → estos 8 restaurantes tienen menú vegano"
  "Te gusta picante → estos 15 restaurantes son para ti"

Escenario 3: YumYum tiene 500 restaurantes
───────────────────────────────────────
Clientes totales: ~250,000
Data points: ~50,000,000
Valor de recomendaciones: INSUPERABLE

YumYum se convierte en el "Google Maps de restaurantes":
  - Sabe qué te gusta
  - Sabe qué restaurantes son buenos para ti
  - Sabe cuándo quieres comer (día y hora)
  - Puede predecir dónde vas a querer reservar

NADIE puede competir con este moat.
```

**Efecto defensivo:**

1. **Switching cost para restaurantes**: Si un restaurante se sale de YumYum, pierde acceso a los perfiles de clientes.

2. **Switching cost para clientes**: "YumYum me conoce, sabe qué me gusta. ¿Por qué usar otro app?"

3. **Data moat**: Más restaurantes = más datos = mejores recomendaciones = más clientes = más restaurantes (flywheel).

---

### Monetización del Intelligence Engine

**Plan Enterprise: "YumYum Intelligence"**

```
Plan Enterprise: $499,000 COP/mes
─────────────────────────────────
Incluye TODO de Plan Pro +

🧠 INTELLIGENCE FEATURES:
  ✓ Perfiles completos de clientes con ML
  ✓ Segmentación automática
  ✓ Predicción de demanda (inventory)
  ✓ Optimización de menú
  ✓ Insights individuales de clientes
  ✓ Campañas AI-powered (auto-generadas)
  ✓ Acceso a data analytics dashboard avanzado
  ✓ API de datos (para integraciones custom)

💰 ROI:
  - Reducción de desperdicio de comida: 30%
  - Aumento de ticket promedio: 15-20% (upsell inteligente)
  - Retención de clientes: +25%
```

**Add-on: YumYum Network**

```
YumYum Network: +$200,000 COP/mes
──────────────────────────────────
Tu restaurante aparece en recomendaciones cross-restaurant

Ejemplo:
  Cliente come en Restaurante A (cocina italiana)
  YumYum le recomienda TU restaurante (también italiana)

Beneficio:
  - Adquisición de clientes de otros restaurantes
  - Tráfico incremental: 10-20 clientes nuevos/mes
  - CAC: $0 (YumYum hace el trabajo)

ROI:
  10 clientes × $200k ticket = $2M COP
  Costo: $200k
  ROI: 900%
```

---

### Privacidad y Ética

**Política de datos:**

1. **Transparencia total**:
   - Cliente sabe qué datos recolectamos
   - Puede ver su perfil completo en cualquier momento
   - Puede eliminar sus datos (GDPR-style)

2. **Opt-out fácil**:
   - "No quiero recibir recomendaciones personalizadas"
   - Aún puede usar YumYum, solo sin personalización

3. **Datos anónimos para analytics**:
   - Restaurantes ven segmentos agregados
   - No ven datos individuales de clientes que no han visitado su restaurante

4. **Seguridad**:
   - Datos encriptados
   - Auditorías regulares
   - Cumplimiento con ley de datos colombiana

---

### Roadmap del Intelligence Engine

**MVP (Mes 6):**

- Recolección básica (alergias, ocasión)
- Perfiles de clientes (manual)
- Campañas personalizadas simples

**v2 (Mes 9):**

- Recolección progresiva
- Segmentación automática (reglas)
- Predicción de demanda (básica)

**v3 (Mes 12):**

- ML para recomendaciones
- Predicción de órdenes
- Optimización de menú
- Insights individuales

**v4 (Mes 18+):**

- Cross-restaurant recommendations
- AI-generated campaigns
- Predictive analytics avanzado
- YumYum Network

---

## 💰 Modelo de Negocio

### Propuesta de Valor

**Para Restaurantes:**

1. **Más ingresos**: Reduce no-shows del 20% al <5% = +15% de ocupación
2. **Pre-venta garantizada**: Anticipo + pre-orden = cash flow anticipado
3. **Marketing directo**: Base de datos propia + campañas por WhatsApp
4. **Eficiencia operativa**: Menú digital = sin impresiones, actualización instantánea
5. **Datos accionables**: Sabe qué vender, cuándo, a quién

**Para Clientes:**

1. Reserva en 30 segundos por WhatsApp
2. Pre-ordena y llega con comida lista
3. Escanea QR y ordena sin esperar mesero
4. Gana puntos y descuentos (fidelización)
5. Refiere amigos y gana beneficios

### Pricing

```
🎯 Plan Básico: $129,000 COP/mes
────────────────────────────────
✓ Hasta 300 reservas/mes
✓ WhatsApp automático (confirmaciones + recordatorios)
✓ Panel web de gestión
✓ Menú digital con QR (1 menú)
✓ 1 sede
✗ Sin anticipo
✗ Sin pre-orden
✗ Sin órdenes desde mesa
✗ Sin marketing

🚀 Plan Pro: $249,000 COP/mes (RECOMENDADO)
────────────────────────────────
✓ Reservas ilimitadas
✓ WhatsApp automático
✓ Anticipo con Wompi
✓ Pre-orden de entradas/bebidas
✓ Menú digital con órdenes desde mesa
✓ Personalización completa (colores, logo, imágenes)
✓ Dashboard en tiempo real (WebSockets)
✓ CRM + historial de clientes
✓ Reseñas y ratings
✓ Reportes exportables (PDF/Excel)
✓ Hasta 3 sedes
✓ 500 mensajes de marketing/mes incluidos
✗ Sin campañas masivas ilimitadas

👑 Plan Enterprise: $499,000+ COP/mes
────────────────────────────────
✓ Todo lo de Pro +
✓ Multi-sede ilimitada
✓ Campañas de marketing ilimitadas
✓ Sistema de puntos y fidelización avanzado
✓ Gift cards digitales
✓ Heatmaps y analytics predictivos
✓ API access (integraciones custom)
✓ Soporte prioritario (WhatsApp + teléfono)
✓ Onboarding dedicado
✓ Personalización de código (si se requiere)
```

**Add-ons (todos los planes):**

- Mensajes de marketing adicionales: $150 COP/mensaje (después del límite)
- Comisión sobre anticipos: 2.5% + $900 COP/transacción (Wompi pass-through)
- Sedes adicionales: $50,000 COP/mes por sede extra
- Impresora térmica (hardware): $450,000 COP (one-time)

### Justificación de Precio

**Caso de uso real:**

```
Restaurante "El Cielo" (40 mesas):
────────────────────────────────
Escenario SIN YumYum:
- 200 reservas/mes
- 20% no-shows = 40 mesas vacías
- Ticket medio: $200,000 COP (4 personas × $50k)
- Pérdida mensual: 40 × $200k = $8,000,000 COP

Escenario CON YumYum (Plan Pro: $249k/mes):
- 200 reservas/mes
- 5% no-shows = 10 mesas vacías (reducción de 75%)
- Ahorro: 30 mesas × $200k = $6,000,000 COP/mes
- ROI: ($6M - $249k) / $249k = 2,308% ROI
- Payback: 1.2 días

Plus adicional:
- 50 pre-órdenes/mes con anticipo $80k = $4,000,000 COP en cash flow anticipado
- 20% de clientes usan órdenes desde mesa = reducción de 1 mesero = ahorro $2,500,000 COP/mes
```

**El producto se paga solo con 1 mesa salvada al mes.**

### Canales de Adquisición

#### Fase 1: Venta Directa (Meses 1-3)

**Objetivo:** 20 restaurantes

**Estrategia:**

1. Lista de 100 restaurantes objetivo (Bogotá, Medellín, Cali)
2. Outreach por WhatsApp + LinkedIn del dueño
3. Demo presencial (20 min)
4. Pitch:

   ```
   "Te garantizo que en 30 días:
   - Reduces no-shows en 50% o más
   - Aumentas ingresos con pre-órdenes
   - Tienes base de datos de tus clientes

   Si no lo logro, no pagas nada."
   ```

5. Onboarding asistido (videollamada 30 min)

**Recursos:**

- 1 persona dedicada a ventas full-time
- Deck de ventas (10 slides)
- Video demo (3 min)
- Caso de estudio (early adopter)

#### Fase 2: Referidos + Marketing Digital (Meses 4-9)

**Objetivo:** 50 restaurantes adicionales

**Estrategia:**

1. **Programa de referidos:**
   - Restaurante refiere otro → ambos ganan 2 meses gratis
   - Incentivo para restaurantes: $200k COP por referido que pague 3+ meses

2. **Google Ads:**
   - Keywords: "sistema reservas restaurante", "menú digital QR", "aumentar ventas restaurante"
   - Budget: $2M COP/mes
   - CPA objetivo: $300k COP

3. **Instagram/Facebook Ads:**
   - Targeting: dueños de restaurantes, administradores, chefs
   - Contenido: video casos de éxito, testimoniales
   - Budget: $1.5M COP/mes

4. **Content Marketing:**
   - Blog: "Cómo reducir no-shows", "Guía de menú digital", etc.
   - YouTube: tutoriales, casos de éxito
   - LinkedIn: thought leadership

#### Fase 3: Partnerships (Meses 10+)

**Objetivo:** Escalamiento exponencial

**Estrategia:**

1. **Alianzas con POS:**
   - Integración con Alegra, Siigo, Helisa
   - Co-marketing

2. **Cámaras de comercio:**
   - Bogotá, Medellín, Cali
   - Webinars para agremiados

3. **Eventos de gastronomía:**
   - Stand en Alimentec, Expo Restaurante
   - Demos en vivo

4. **Distribuidores de equipos:**
   - Alianza con vendedores de POS, cajas registradoras
   - Comisión por venta

---

### Modelos de Monetización (Más Allá de Suscripciones)

**YumYum tiene 13 fuentes de ingresos diferentes:**

#### 1. **Suscripciones SaaS** (Revenue Principal)

```
Plan Básico: $129k/mes
Plan Pro: $249k/mes
Plan Enterprise: $499k/mes

Objetivo Año 1: 100 restaurantes
  - 60% en Plan Pro = $14.94M/mes
  - 30% en Plan Básico = $3.87M/mes
  - 10% en Enterprise = $4.99M/mes
TOTAL MRR: $23.8M COP/mes = $285M COP/año
```

#### 2. **Comisiones sobre Transacciones**

```
Anticipos/Pre-órdenes:
  - Comisión YumYum: 2.5%
  - 100 restaurantes × 50 anticipos/mes × $80k promedio = $400M COP/mes
  - Comisión YumYum: $10M COP/mes

Gift Cards:
  - Comisión: 5%
  - 20 restaurantes vendiendo × $5M COP/mes = $100M COP/mes
  - Comisión YumYum: $5M COP/mes

Órdenes desde mesa:
  - Comisión: 2%
  - 50 restaurantes × $10M COP/mes = $500M COP/mes
  - Comisión YumYum: $10M COP/mes

TOTAL COMISIONES: $25M COP/mes = $300M COP/año
```

#### 3. **Publicidad y Promoción**

```
Featured Listings:
  - Restaurante paga para aparecer primero en búsquedas
  - $150,000 COP/mes por restaurante
  - 20 restaurantes comprando = $3M COP/mes

Sponsored Recommendations:
  - Aparecer en "Recomendados para ti"
  - $200,000 COP/mes
  - 15 restaurantes = $3M COP/mes

Banner Ads (en booking app):
  - $100,000 COP/mes
  - 10 restaurantes = $1M COP/mes

Email/WhatsApp Sponsorship:
  - Incluir restaurante en newsletters de YumYum
  - $50,000 COP por campaña
  - 8 campañas/mes = $400k COP/mes

TOTAL PUBLICIDAD: $7.4M COP/mes = $89M COP/año
```

#### 4. **YumYum Premium (Suscripción de Clientes)**

```
Modelo B2C:
  Clientes pagan $29,000 COP/mes para:
  ✓ Prioridad en reservas
  ✓ 15% descuento en todos los restaurantes
  ✓ Sin comisión en pre-órdenes
  ✓ Acceso a mesas VIP
  ✓ Puntos dobles de fidelidad
  ✓ Reservas anticipadas (30 días vs 14 días)

Proyección:
  - 1% de clientes activos se suscriben
  - 100 restaurantes × 500 clientes/mes = 50,000 clientes totales
  - 1% = 500 suscriptores
  - 500 × $29k = $14.5M COP/mes = $174M COP/año

ROI para cliente:
  - Come 2 veces/mes × $200k ticket × 15% = ahorro $60k/mes
  - Costo: $29k/mes
  - Ahorro neto: $31k/mes + beneficios
```

#### 5. **Marketplace de Servicios**

```
Catering Corporativo:
  - Comisión: 15%
  - 5 bookings/mes × $5M COP promedio = $25M COP
  - YumYum: $3.75M COP/mes

Eventos Privados:
  - Comisión: 10%
  - 10 eventos/mes × $3M COP = $30M COP
  - YumYum: $3M COP/mes

Chef a Domicilio:
  - Comisión: 20%
  - 20 bookings/mes × $800k = $16M COP
  - YumYum: $3.2M COP/mes

Clases de Cocina:
  - Comisión: 15%
  - 8 clases/mes × $2M COP = $16M COP
  - YumYum: $2.4M COP/mes

TOTAL MARKETPLACE: $12.35M COP/mes = $148M COP/año
```

#### 6. **Data as a Service (DaaS)**

```
Reportes a Marcas de Alimentos:
  - "30% de clientes en Bogotá prefieren vegano"
  - $5M COP/reporte
  - 3 reportes/mes = $15M COP/mes

Reportes a Inversionistas/Inmobiliarias:
  - "Heatmap de consumo gastronómico en Zona T"
  - $10M COP/reporte
  - 2 reportes/mes = $20M COP/mes

Dashboard Subscription (Trends en tiempo real):
  - Acceso a dashboard de trends
  - $2M COP/mes por suscriptor
  - 5 suscriptores (Coca-Cola, Nestlé, etc) = $10M COP/mes

TOTAL DaaS: $45M COP/mes = $540M COP/año

NOTA: Este es el revenue stream más rentable (margen ~95%)
```

#### 7. **Programa de Afiliados**

```
Proveedores de Alimentos:
  - Recomendar proveedores de carne, pescado, verduras
  - Comisión: 3-5% de ventas generadas
  - Estimado: $3M COP/mes

Distribuidoras de Licor:
  - Comisión por ventas de vino, cerveza, licor
  - Estimado: $2M COP/mes

Software POS (Alegra, Siigo):
  - Comisión por referral: $500k COP/restaurante
  - 5 referrals/mes = $2.5M COP/mes

Seguros de Restaurante:
  - Partnership con aseguradoras
  - Comisión: $1M COP/póliza vendida
  - 2 pólizas/mes = $2M COP/mes

TOTAL AFILIADOS: $9.5M COP/mes = $114M COP/año
```

#### 8. **Seguros y Protección**

```
Seguro de Reserva (para clientes):
  - Cliente paga $5,000 COP extra para cancelación flexible
  - 100% reembolso si cancela 24h antes
  - 5% de reservas lo compran
  - 100 rest × 500 res/mes × 5% = 2,500 seguros/mes
  - 2,500 × $5k = $12.5M COP/mes
  - YumYum retiene 80% (20% se reembolsa) = $10M COP/mes

Protección de No-Show (para restaurantes):
  - Restaurante paga $100,000 COP/mes
  - YumYum compensa $30k por cada no-show
  - Si restaurante tiene <3 no-shows/mes, YumYum gana
  - 30 restaurantes comprando = $3M COP/mes
  - Pago promedio: -$1.5M COP/mes (compensaciones)
  - Ganancia neta: $1.5M COP/mes

TOTAL SEGUROS: $11.5M COP/mes = $138M COP/año
```

#### 9. **Dynamic Pricing (Revenue Share)**

```
Modelo:
  - YumYum maneja pricing dinámico del restaurante
  - Viernes 8pm (alta demanda): +20% de precio
  - Lunes 3pm (baja demanda): -15% de precio
  - YumYum se queda con 50% del revenue incremental

Ejemplo:
  - Restaurante A: genera $2M COP/mes extra con pricing dinámico
  - YumYum: $1M COP/mes

Proyección:
  - 20 restaurantes usando dynamic pricing
  - Promedio $1.5M COP/mes por restaurante
  - YumYum: 50% = $15M COP/mes = $180M COP/año
```

#### 10. **White-Label para Cadenas**

```
Licencia del software a cadenas grandes:
  - Setup fee: $20M COP (one-time)
  - Licencia mensual: $5M COP/mes por cadena
  - Soporte y mantenimiento incluido

Objetivo:
  - 3 cadenas grandes (ej: Crepes & Waffles, Archie's, Juan Valdez)
  - Setup: $60M COP (año 1)
  - Licencias: 3 × $5M = $15M COP/mes = $180M COP/año
```

#### 11. **API Access (B2B)**

```
Desarrolladores pagan por acceso a API de YumYum:
  - $500,000 COP/mes base
  - + $100 COP por 1,000 API calls

Casos de uso:
  - Apps de delivery integran con YumYum
  - Sistemas de POS consultan disponibilidad
  - Agregadores de reservas

Proyección:
  - 10 clientes de API
  - Promedio: $800k COP/mes por cliente
  - TOTAL: $8M COP/mes = $96M COP/año
```

#### 12. **Eventos y Experiencias Premium**

```
Chef's Table:
  - Experiencias exclusivas con chefs reconocidos
  - Comisión: 25%
  - 4 eventos/mes × $10M COP = $40M COP
  - YumYum: $10M COP/mes

Wine Tastings:
  - Catas de vino
  - Comisión: 20%
  - 8 eventos/mes × $3M COP = $24M COP
  - YumYum: $4.8M COP/mes

Food Tours:
  - Tours gastronómicos multi-restaurante
  - Comisión: 30%
  - 10 tours/mes × $2M COP = $20M COP
  - YumYum: $6M COP/mes

TOTAL EVENTOS: $20.8M COP/mes = $250M COP/año
```

#### 13. **YumYum Capital (Financiamiento)**

```
Préstamos a restaurantes basados en sus datos:
  - YumYum conoce ingresos mensuales reales
  - Préstamos: $10M-$50M COP por restaurante
  - Interés: 2.5% mensual (competitivo vs bancos 4-5%)
  - Pago automático (descuento de ingresos en plataforma)

Proyección (conservadora):
  - 20 restaurantes con préstamos activos
  - Promedio: $30M COP por préstamo
  - Total prestado: $600M COP
  - Interés mensual: 2.5% = $15M COP/mes
  - Interés anual: $180M COP/año

NOTA: Requiere capital inicial o partnership con banco
```

---

### Resumen de Revenue Streams

```
PROYECCIÓN DE INGRESOS ANUALES (Año 2-3)
─────────────────────────────────────────

1.  Suscripciones SaaS:        $285M COP/año ⭐
2.  Comisiones transacciones:  $300M COP/año ⭐
3.  Publicidad:                $89M COP/año
4.  YumYum Premium (B2C):      $174M COP/año
5.  Marketplace servicios:     $148M COP/año
6.  Data as a Service:         $540M COP/año 🔥
7.  Programa de afiliados:     $114M COP/año
8.  Seguros y protección:      $138M COP/año
9.  Dynamic pricing:           $180M COP/año
10. White-label cadenas:       $180M COP/año
11. API Access:                $96M COP/año
12. Eventos premium:           $250M COP/año
13. YumYum Capital:            $180M COP/año

────────────────────────────────────────
TOTAL REVENUE ANUAL:           $2,674M COP/año
                               (~USD $670k/año)

MARGEN BRUTO ESTIMADO:         65-75%
MARGEN NETO (a escala):        30-40%
```

**Nota:** No todos los revenue streams están disponibles desde el MVP. Roadmap de monetización:

```
Año 1 (MVP):
  ✓ Suscripciones SaaS
  ✓ Comisiones sobre anticipos/pre-órdenes
  ✓ Comisiones sobre gift cards
  ✓ Mensajes de marketing

Año 2:
  ✓ Publicidad (featured listings)
  ✓ YumYum Premium (B2C)
  ✓ Marketplace de servicios
  ✓ Data as a Service (básico)
  ✓ Programa de afiliados

Año 3+:
  ✓ Dynamic pricing
  ✓ White-label
  ✓ API Access
  ✓ Eventos premium
  ✓ YumYum Capital
```

---

### North Star Metric

**% de Reservas Atendidas = (Reservas atendidas / Total reservas) × 100**

```
Objetivo: >92%
Benchmark industria: 75-80%
YumYum target: 92-95%
```

**Métricas secundarias:**

- ARR (Annual Recurring Revenue)
- MRR Growth Rate (mes a mes)
- Churn rate mensual (<5%)
- NPS (Net Promoter Score) >60
- Revenue per Restaurant (RPR) >$3M COP/año

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico Completo

#### Monorepo (Turborepo)

```
yumyum/
├── apps/
│   ├── admin/          # Frontend 1: Panel administrativo
│   ├── booking/        # Frontend 2: Página pública de reservas
│   ├── dashboard/      # Frontend 3: Dashboard del restaurante
│   └── api/            # Backend: NestJS
├── packages/
│   ├── ui/             # Componentes compartidos (React)
│   ├── types/          # TypeScript types compartidos
│   ├── utils/          # Utilidades compartidas
│   └── config/         # Configuraciones (ESLint, Tailwind, etc.)
└── infrastructure/
    ├── docker/
    └── terraform/      # IaC (si usan AWS)
```

**¿Por qué Turborepo?**

- Builds incrementales (solo compila lo que cambió)
- Cache compartido entre apps
- Type-safety entre frontend y backend
- Varios devs trabajando en paralelo sin conflictos
- Deploy independiente de cada app

#### Frontend (3 aplicaciones Next.js 14)

##### 1. Admin App (apps/admin)

**Propósito:** Panel de super-admin para gestionar toda la plataforma

**URL:** `admin.yumyum.com`

**Funcionalidades:**

- Crear/editar/eliminar restaurantes
- Ver métricas globales (todos los restaurantes)
- Gestión de usuarios (owners, staff)
- Configuración de planes y pricing
- Soporte y tickets
- Facturación y pagos

**Stack:**

```
Framework: Next.js 14 (App Router)
UI: Tailwind CSS + shadcn/ui
Forms: React Hook Form + Zod
State: Zustand
Charts: Recharts
Tables: TanStack Table
Auth: NextAuth.js (JWT)
```

##### 2. Booking App (apps/booking)

**Propósito:** Página pública donde clientes hacen reservas y ven menú

**URL:** `{restaurante-slug}.yumyum.com` o `yumyum.com/r/{restaurante-slug}`

**Funcionalidades:**

- Ver información del restaurante
- Ver menú digital (by QR)
- Hacer reserva
- Pre-ordenar entradas/bebidas
- Pagar anticipo
- Ver reseñas
- Ordenar desde la mesa (QR)

**Stack:**

```
Framework: Next.js 14 (SSR para SEO)
UI: Tailwind CSS (personalizable por restaurante)
Forms: React Hook Form + Zod
State: Zustand
Real-time: Socket.IO client (disponibilidad)
Payments: Wompi SDK
PWA: next-pwa (instalable)
```

**Personalización por restaurante:**

```typescript
// Cada restaurante tiene su tema
interface RestaurantTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: 'modern' | 'elegant' | 'casual';
  logo: string;
  heroImage: string;
  backgroundColor: string;
}
```

##### 3. Dashboard App (apps/dashboard)

**Propósito:** Dashboard del restaurante para gestionar todo

**URL:** `dashboard.yumyum.com`

**Funcionalidades:**

- Ver reservas del día en tiempo real
- Gestionar mesas y estados
- Ver órdenes en tiempo real (desde mesa)
- Marcar platos como agotados
- Ver pre-órdenes del día
- CRM (clientes, historial, segmentación)
- Crear campañas de marketing
- Configurar menú
- Reportes y analytics
- Configuración del restaurante

**Stack:**

```
Framework: Next.js 14
UI: Tailwind CSS + shadcn/ui
Real-time: Socket.IO client (reservas, órdenes)
Charts: Recharts + react-heatmap-grid
Forms: React Hook Form + Zod
State: Zustand
Notifications: react-hot-toast + sonidos
```

**Real-time features:**

- Nueva reserva → notificación sonora
- Nueva orden desde mesa → notificación
- Cliente confirma por WhatsApp → actualiza estado
- Disponibilidad cambia → actualiza dashboard

#### Backend (NestJS)

```
Framework: NestJS
Lenguaje: TypeScript
Database: PostgreSQL 15 (TypeORM)
Cache: Redis 7
Queue: BullMQ
Real-time: Socket.IO
WhatsApp: Baileys (MVP) → Meta Business API (producción)
Pagos: Wompi
Email: SendGrid / Resend
Storage: AWS S3 (imágenes, PDFs)
Cron: @nestjs/schedule
Validation: class-validator + class-transformer
Documentation: Swagger (OpenAPI 3.0)
```

**Arquitectura:**

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── restaurants/
│   ├── tables/
│   ├── time-slots/
│   ├── reservations/
│   ├── menu/
│   ├── orders/
│   ├── payments/
│   ├── whatsapp/
│   ├── marketing/
│   ├── reviews/
│   ├── loyalty/
│   ├── gift-cards/
│   ├── analytics/
│   └── notifications/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   └── pipes/
├── config/
├── database/
│   ├── migrations/
│   └── seeds/
├── gateways/          # WebSockets (Socket.IO)
│   ├── reservations.gateway.ts
│   ├── orders.gateway.ts
│   └── dashboard.gateway.ts
└── workers/           # BullMQ processors
    ├── whatsapp.worker.ts
    ├── email.worker.ts
    ├── marketing.worker.ts
    └── analytics.worker.ts
```

#### Bases de Datos

##### PostgreSQL (Principal)

```
Version: 15+
ORM: TypeORM
Connection Pool: 20-50 connections
Backups: Diarios automáticos (30 días retención)
```

**Tablas principales:**

- users, restaurants, tables, time_slots
- reservations, pre_orders, payments
- menu_categories, menu_items, orders, order_items
- customers, customer_visits, loyalty_points
- marketing_campaigns, campaign_sends
- reviews, gift_cards
- no_show_history (para ML)

##### Redis (Cache + Sessions + Queues)

```
Version: 7+
Uso:
  1. Cache de queries frecuentes (TTL: 5-15 min)
  2. Sesiones de usuario (JWT refresh tokens)
  3. Rate limiting (anti-spam)
  4. Locks distribuidos (prevenir reservas duplicadas)
  5. Real-time data (disponibilidad temporal)
  6. BullMQ queues
```

**Estructura:**

```
Keys:
  - session:{userId}
  - availability:{restaurantId}:{date}    # TTL: 5 min
  - lock:reservation:{tableId}:{datetime} # TTL: 30 sec
  - rate_limit:{ip}                       # TTL: 1 min
  - menu:{restaurantId}                   # TTL: 15 min
```

#### WebSockets (Socket.IO)

**Eventos:**

```typescript
// Cliente → Servidor
'join:restaurant'; // Unirse a sala del restaurante
'reserve:check'; // Verificar disponibilidad
'order:create'; // Crear orden desde mesa

// Servidor → Cliente
'availability:updated'; // Disponibilidad cambió
'reservation:created'; // Nueva reserva
'reservation:confirmed'; // Cliente confirmó por WA
'order:received'; // Nueva orden desde mesa
'table:status_changed'; // Mesa ocupada/libre
'inventory:updated'; // Plato agotado
```

**Rooms (salas):**

```
restaurant:{restaurantId}     # Dashboard del restaurante
table:{tableId}               # Clientes en una mesa específica
booking:{restaurantSlug}      # Clientes viendo página de reserva
```

**Implementación:**

```typescript
// Backend: gateways/dashboard.gateway.ts
@WebSocketGateway({ namespace: '/dashboard' })
export class DashboardGateway {
  @SubscribeMessage('join:restaurant')
  handleJoinRestaurant(@ConnectedSocket() client: Socket, @MessageBody() { restaurantId }: any) {
    client.join(`restaurant:${restaurantId}`);
  }

  // Emitir cuando hay nueva reserva
  emitNewReservation(restaurantId: string, reservation: any) {
    this.server.to(`restaurant:${restaurantId}`).emit('reservation:created', reservation);
  }
}
```

```typescript
// Frontend: dashboard
const socket = io('wss://api.yumyum.com/dashboard', {
  auth: { token: session.accessToken },
});

socket.emit('join:restaurant', { restaurantId });

socket.on('reservation:created', reservation => {
  // Mostrar notificación + sonido
  toast.success(`Nueva reserva: ${reservation.customerName}`);
  playSound('new-reservation.mp3');
  // Actualizar lista de reservas
  setReservations(prev => [reservation, ...prev]);
});

socket.on('order:received', order => {
  toast.success(`Nueva orden - Mesa ${order.tableName}`);
  playSound('new-order.mp3');
});
```

#### WhatsApp

##### MVP: Baileys (biblioteca no oficial)

```
Pros:
  ✓ Gratis
  ✓ Rápido de implementar
  ✓ Sin aprobación de Meta
Cons:
  ✗ Riesgo de ban
  ✗ Requiere QR login
  ✗ Menos estable
```

**Implementación:**

```typescript
// whatsapp/baileys.service.ts
import makeWASocket from '@whiskeysockets/baileys';

export class BaileysService {
  private sock: any;

  async connect() {
    this.sock = makeWASocket({
      printQRInTerminal: true,
      // ... config
    });
  }

  async sendMessage(phone: string, message: string) {
    const jid = `${phone}@s.whatsapp.net`;
    await this.sock.sendMessage(jid, { text: message });
  }
}
```

##### Producción: WhatsApp Business API (Meta)

```
Costo: $0.005-0.09 USD por mensaje (según país)
Setup: Requiere Meta Business verificado
Features:
  ✓ Oficial y estable
  ✓ Webhooks nativos
  ✓ Templates aprobados
  ✓ Analytics
```

**Migración:** A los 20-30 restaurantes (cuando WhatsApp sea crítico)

#### Pagos (Wompi)

```typescript
// payments/wompi.service.ts
export class WompiService {
  async createPaymentLink(data: { amount: number; reference: string; customerEmail: string }) {
    const response = await axios.post(
      'https://production.wompi.co/v1/payment_links',
      {
        amount_in_cents: data.amount * 100,
        currency: 'COP',
        customer_email: data.customerEmail,
        reference: data.reference,
        redirect_url: `https://yumyum.com/reservations/${data.reference}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}`,
        },
      }
    );
    return response.data.data.permalink;
  }

  async verifyTransaction(transactionId: string) {
    // Webhook handler
  }
}
```

### Infraestructura

#### Ambientes

```
Development (Local):
  - Frontend: localhost:3000 (admin), :3001 (booking), :3002 (dashboard)
  - Backend: localhost:4000
  - PostgreSQL: localhost:5432 (Docker)
  - Redis: localhost:6379 (Docker)

Staging:
  - Frontend:
    - admin-staging.yumyum.com
    - staging.yumyum.com (booking)
    - dashboard-staging.yumyum.com
  - Backend: api-staging.yumyum.com
  - DB: PostgreSQL staging (Railway/RDS)
  - Redis: Redis staging (Railway/ElastiCache)

Production:
  - Frontend:
    - admin.yumyum.com (Vercel)
    - {slug}.yumyum.com (Vercel + wildcard subdomain)
    - dashboard.yumyum.com (Vercel)
  - Backend: api.yumyum.com (Railway/ECS)
  - DB: PostgreSQL prod (RDS Multi-AZ)
  - Redis: Redis prod (ElastiCache cluster)
```

#### Deploy

**Vercel (Frontends):**

```yaml
# vercel.json (apps/booking)
{
  'buildCommand': 'cd ../.. && pnpm run build --filter=booking',
  'outputDirectory': '.next',
  'rewrites': [{ 'source': '/:path*', 'destination': '/api/:path*' }],
  'env': { 'NEXT_PUBLIC_API_URL': 'https://api.yumyum.com' },
}
```

**Railway (Backend):**

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter=api

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

**Subdominios dinámicos:**

```
Opción 1: Wildcard DNS + Next.js Middleware
  *.yumyum.com → Vercel

  // middleware.ts
  export function middleware(req: NextRequest) {
    const hostname = req.headers.get('host') || '';
    const slug = hostname.split('.')[0];

    if (slug !== 'www' && slug !== 'yumyum') {
      // Es un restaurante
      req.nextUrl.pathname = `/r/${slug}${req.nextUrl.pathname}`;
      return NextResponse.rewrite(req.nextUrl);
    }
  }

Opción 2: Edge Config (Vercel)
  Mantener lista de slugs válidos en Vercel Edge Config
  Validar en middleware
```

#### Escalabilidad

**Backend (Auto-scaling):**

```
Railway:
  - Horizontal: 1-5 instancias (auto-scaling por CPU >70%)
  - Vertical: 2 vCPU, 4GB RAM por instancia

AWS ECS (alternativa):
  - Service: 2-10 tasks (auto-scaling por ALB requests)
  - Task: 2 vCPU, 4GB RAM
  - ALB: Application Load Balancer
```

**Database (Conexiones):**

```typescript
// typeorm.config.ts
{
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  poolSize: 20, // Máximo 20 conexiones por instancia
  extra: {
    max: 20,
    idleTimeoutMillis: 30000,
  }
}

// PgBouncer (connection pooling):
// 3 instancias de API × 20 conexiones = 60 conexiones
// PgBouncer reduce a ~10 conexiones reales a PostgreSQL
```

**Redis (Clustering):**

```
Producción:
  - Redis Cluster (3 nodos master + 3 replicas)
  - Persistencia: AOF + RDB snapshots
  - Eviction policy: allkeys-lru
```

**WebSockets (Sticky Sessions):**

```yaml
# AWS ALB config
TargetGroupAttributes:
  - Key: stickiness.enabled
    Value: 'true'
  - Key: stickiness.type
    Value: 'lb_cookie'

# O usar Redis adapter para Socket.IO (múltiples instancias)
import { createAdapter } from '@socket.io/redis-adapter';

io.adapter(createAdapter(redisClient, redisClient.duplicate()));
```

---

## 🗄️ Modelo de Datos

### Diagrama ER Completo

```
┌─────────────────┐
│  users          │
├─────────────────┤
│ id (PK)         │
│ email (UNIQUE)  │
│ password_hash   │
│ role            │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N (owner)
         │
         ▼
┌──────────────────────────────┐
│  restaurants                 │
├──────────────────────────────┤
│ id (PK)                      │
│ owner_id (FK) ───────────────┘
│ name                         │
│ slug (UNIQUE)                │
│ phone                        │
│ address                      │
│ city                         │
│ description                  │
│ whatsapp_enabled             │
│ whatsapp_number              │
│ deposit_enabled              │
│ deposit_amount               │
│ deposit_threshold_party_size │
│ pre_order_enabled            │
│ table_ordering_enabled       │
│ marketing_enabled            │
│ overbooking_percentage       │
│ theme (JSONB)                │ ← Personalización
│ settings (JSONB)             │
│ subscription_plan            │
│ subscription_status          │
│ trial_ends_at                │
│ created_at                   │
└────────┬──────────────────┬──┘
         │                  │
         │ 1:N              │ 1:N
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│  tables         │  │  time_slots     │
├─────────────────┤  ├─────────────────┤
│ id (PK)         │  │ id (PK)         │
│ restaurant_id(FK)│ │ restaurant_id(FK)│
│ name            │  │ day_of_week     │
│ capacity        │  │ start_time      │
│ qr_code         │  │ end_time        │
│ status          │  │ max_reservations│
│ position_x      │  │ enabled         │
│ position_y      │  │ price_multiplier│ ← Pricing dinámico
└────────┬────────┘  └─────────────────┘
         │
         │ 1:1
         │
         ▼
┌─────────────────────┐
│  table_qr_sessions  │  ← Sesión activa de mesa
├─────────────────────┤
│ id (PK)             │
│ table_id (FK)       │
│ session_token       │
│ started_at          │
│ ended_at            │
└─────────────────────┘


┌──────────────────────────┐
│  menu_categories         │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK) ──────┼─┐
│ name                     │ │
│ description              │ │
│ position                 │ │
│ enabled                  │ │
└────────┬─────────────────┘ │
         │                   │
         │ 1:N               │
         │                   │
         ▼                   │
┌──────────────────────────┐ │
│  menu_items              │ │
├──────────────────────────┤ │
│ id (PK)                  │ │
│ category_id (FK) ────────┘ │
│ restaurant_id (FK) ────────┘
│ name                     │
│ description              │
│ price                    │
│ image_url                │
│ available                │ ← Inventario (agotado)
│ preparation_time_min     │
│ is_pre_orderable         │
│ tags (JSONB)             │ ← ['vegano', 'picante']
│ position                 │
└────────┬─────────────────┘
         │
         │
         │
         ▼
┌──────────────────────────┐
│  menu_pdfs               │  ← PDFs del menú
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ language                 │ ← 'es', 'en'
│ file_url                 │
│ uploaded_at              │
└──────────────────────────┘


┌──────────────────────────┐
│  customers               │  ← Base de datos de clientes
├──────────────────────────┤
│ id (PK)                  │
│ phone (UNIQUE)           │
│ name                     │
│ email                    │
│ birth_date               │
│ loyalty_points           │
│ total_spent              │
│ visit_count              │
│ no_show_count            │
│ tags (JSONB)             │ ← Segmentación
│ created_at               │
└────────┬─────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────────┐
│  reservations            │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK) ──────┼──┐
│ table_id (FK)            │  │
│ customer_id (FK) ────────┘  │
│ customer_name            │   │
│ customer_phone           │   │
│ customer_email           │   │
│ party_size               │   │
│ reservation_date         │   │
│ reservation_time         │   │
│ status                   │   │ ← enum
│ requires_deposit         │   │
│ deposit_amount           │   │
│ deposit_paid             │   │
│ payment_id               │   │
│ has_pre_order            │   │
│ pre_order_total          │   │
│ confirmed_at             │   │
│ reminded_24h             │   │
│ reminded_2h              │   │
│ seated_at                │   │
│ completed_at             │   │
│ cancelled_at             │   │
│ cancellation_reason      │   │
│ special_requests         │   │
│ referral_code            │   │ ← Referidos
│ is_recurring             │   │
│ recurring_schedule       │   │ ← JSONB (día/hora)
│ notes                    │   │
│ created_at               │   │
└────────┬─────────────────┘   │
         │                     │
         │ 1:N                 │
         │                     │
         ▼                     │
┌──────────────────────────┐   │
│  pre_orders              │   │
├──────────────────────────┤   │
│ id (PK)                  │   │
│ reservation_id (FK) ─────┘   │
│ menu_item_id (FK)        │   │
│ quantity                 │   │
│ unit_price               │   │
│ notes                    │   │
└──────────────────────────┘   │
                               │
                               │
┌──────────────────────────┐   │
│  orders                  │   │  ← Órdenes desde mesa
├──────────────────────────┤   │
│ id (PK)                  │   │
│ restaurant_id (FK) ──────────┘
│ table_id (FK)            │
│ session_id (FK)          │
│ order_number             │
│ status                   │ ← pending, preparing, ready, delivered
│ total_amount             │
│ created_at               │
│ completed_at             │
└────────┬─────────────────┘
         │
         │ 1:N
         │
         ▼
┌──────────────────────────┐
│  order_items             │
├──────────────────────────┤
│ id (PK)                  │
│ order_id (FK)            │
│ menu_item_id (FK)        │
│ quantity                 │
│ unit_price               │
│ notes                    │ ← 'Sin cebolla'
└──────────────────────────┘


┌──────────────────────────┐
│  whatsapp_messages       │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ reservation_id (FK)      │
│ campaign_id (FK)         │ ← Si es de marketing
│ recipient_phone          │
│ type                     │ ← enum
│ message                  │
│ sent_at                  │
│ delivered_at             │
│ read_at                  │
│ error                    │
└──────────────────────────┘


┌──────────────────────────┐
│  payments                │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ reservation_id (FK)      │
│ gift_card_id (FK)        │ ← Si es compra de gift card
│ provider                 │
│ amount                   │
│ status                   │
│ wompi_id                 │
│ link                     │
│ paid_at                  │
└──────────────────────────┘


┌──────────────────────────┐
│  reviews                 │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ reservation_id (FK)      │
│ customer_id (FK)         │
│ rating                   │ ← 1-5
│ comment                  │
│ response                 │ ← Respuesta del restaurante
│ responded_at             │
│ created_at               │
│ approved                 │ ← Moderación
└──────────────────────────┘


┌──────────────────────────┐
│  loyalty_transactions    │  ← Historial de puntos
├──────────────────────────┤
│ id (PK)                  │
│ customer_id (FK)         │
│ restaurant_id (FK)       │
│ reservation_id (FK)      │
│ points                   │ ← +100 o -50
│ type                     │ ← 'earned', 'redeemed'
│ description              │
│ created_at               │
└──────────────────────────┘


┌──────────────────────────┐
│  gift_cards              │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ code (UNIQUE)            │
│ initial_amount           │
│ current_balance          │
│ buyer_name               │
│ buyer_email              │
│ recipient_name           │
│ recipient_email          │
│ message                  │
│ status                   │ ← active, redeemed, expired
│ purchased_at             │
│ redeemed_at              │
│ expires_at               │
└──────────────────────────┘


┌──────────────────────────┐
│  marketing_campaigns     │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ name                     │
│ message                  │
│ segment_filters (JSONB)  │ ← Filtros de audiencia
│ scheduled_at             │
│ sent_at                  │
│ total_recipients         │
│ delivered_count          │
│ read_count               │
│ conversion_count         │ ← Cuántos reservaron
│ cost                     │
│ status                   │
└──────────────────────────┘


┌──────────────────────────┐
│  referrals               │
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ referrer_customer_id (FK)│
│ referred_customer_id (FK)│
│ referral_code            │
│ status                   │ ← pending, completed
│ reward_amount            │
│ rewarded_at              │
│ created_at               │
└──────────────────────────┘


┌──────────────────────────┐
│  no_show_history         │  ← Para ML de overbooking
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ month                    │
│ total_reservations       │
│ no_shows                 │
│ no_show_percentage       │
└──────────────────────────┘


┌──────────────────────────┐
│  analytics_events        │  ← Tracking de eventos
├──────────────────────────┤
│ id (PK)                  │
│ restaurant_id (FK)       │
│ event_type               │ ← 'menu_view', 'item_click'
│ event_data (JSONB)       │
│ created_at               │
└──────────────────────────┘
```

### Schema SQL Completo

```sql
-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'staff');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance');
CREATE TYPE order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');
CREATE TYPE whatsapp_message_type AS ENUM ('confirmation', 'reminder_24h', 'reminder_2h', 'cancellation', 'payment_link', 'marketing', 'survey');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE gift_card_status AS ENUM ('active', 'redeemed', 'expired', 'cancelled');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed');
CREATE TYPE loyalty_transaction_type AS ENUM ('earned', 'redeemed', 'expired', 'bonus');
CREATE TYPE subscription_plan AS ENUM ('basic', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trial');

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role user_role NOT NULL DEFAULT 'owner',
  avatar_url VARCHAR(500),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,

  -- WhatsApp
  whatsapp_enabled BOOLEAN DEFAULT true,
  whatsapp_number VARCHAR(50),

  -- Deposits
  deposit_enabled BOOLEAN DEFAULT false,
  deposit_amount INTEGER DEFAULT 0,
  deposit_threshold_party_size INTEGER DEFAULT 6,

  -- Features
  pre_order_enabled BOOLEAN DEFAULT false,
  table_ordering_enabled BOOLEAN DEFAULT false,
  marketing_enabled BOOLEAN DEFAULT false,
  loyalty_enabled BOOLEAN DEFAULT false,
  gift_cards_enabled BOOLEAN DEFAULT false,

  -- Overbooking
  overbooking_percentage DECIMAL(5,2) DEFAULT 0,

  -- Branding (white-label)
  theme JSONB DEFAULT '{
    "primaryColor": "#3B82F6",
    "secondaryColor": "#10B981",
    "fontFamily": "modern",
    "logoUrl": null,
    "heroImageUrl": null,
    "backgroundColor": "#FFFFFF"
  }'::jsonb,

  -- Settings
  settings JSONB DEFAULT '{
    "timezone": "America/Bogota",
    "currency": "COP",
    "language": "es",
    "reservation_duration_min": 120,
    "auto_release_no_show_min": 15,
    "require_email": false,
    "send_survey": true
  }'::jsonb,

  -- Subscription
  subscription_plan subscription_plan DEFAULT 'basic',
  subscription_status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMP,
  subscription_current_period_end TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_owner_id ON restaurants(owner_id);
CREATE INDEX idx_restaurants_city ON restaurants(city);

-- Tables
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  capacity INTEGER NOT NULL,
  qr_code VARCHAR(255) UNIQUE, -- Token único para el QR
  status table_status DEFAULT 'available',
  position_x INTEGER, -- Para layout visual en dashboard
  position_y INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tables_restaurant_id ON tables(restaurant_id);
CREATE INDEX idx_tables_qr_code ON tables(qr_code);

-- Table QR Sessions (sesión activa cuando escanean QR)
CREATE TABLE table_qr_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP
);

CREATE INDEX idx_table_qr_sessions_token ON table_qr_sessions(session_token);

-- Time Slots
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_min INTEGER DEFAULT 30,
  max_reservations INTEGER DEFAULT 10,
  price_multiplier DECIMAL(3,2) DEFAULT 1.0, -- Para pricing dinámico
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_time_slots_restaurant_id ON time_slots(restaurant_id);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  birth_date DATE,
  loyalty_points INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  no_show_count INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb, -- ['vip', 'vegetariano', etc]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- Reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,

  -- Customer info (redundante para casos donde no hay cuenta)
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),

  party_size INTEGER NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  status reservation_status DEFAULT 'pending',

  -- Deposit
  requires_deposit BOOLEAN DEFAULT false,
  deposit_amount INTEGER DEFAULT 0,
  deposit_paid BOOLEAN DEFAULT false,
  payment_id UUID,

  -- Pre-order
  has_pre_order BOOLEAN DEFAULT false,
  pre_order_total INTEGER DEFAULT 0,

  -- Confirmations
  confirmed_at TIMESTAMP,
  reminded_24h BOOLEAN DEFAULT false,
  reminded_2h BOOLEAN DEFAULT false,

  -- Completion
  seated_at TIMESTAMP,
  completed_at TIMESTAMP,

  -- Cancellation
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,

  -- Special requests
  special_requests TEXT,

  -- Referrals
  referral_code VARCHAR(50),

  -- Recurring reservations
  is_recurring BOOLEAN DEFAULT false,
  recurring_schedule JSONB, -- { frequency: 'weekly', day: 5, time: '19:00' }

  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reservations_restaurant_id ON reservations(restaurant_id);
CREATE INDEX idx_reservations_customer_id ON reservations(customer_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_phone ON reservations(customer_phone);

-- Composite index para queries de disponibilidad
CREATE INDEX idx_reservations_availability
ON reservations(restaurant_id, reservation_date, status)
WHERE status NOT IN ('cancelled', 'no_show');

-- Menu Categories
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  position INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR(500),
  available BOOLEAN DEFAULT true, -- Inventario
  preparation_time_min INTEGER,
  is_pre_orderable BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb, -- ['vegano', 'sin gluten', 'picante']
  allergens JSONB DEFAULT '[]'::jsonb,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_available ON menu_items(available);

-- Menu PDFs (menús en PDF por idioma)
CREATE TABLE menu_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL, -- 'es', 'en', etc
  file_url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_menu_pdfs_restaurant_id ON menu_pdfs(restaurant_id);

-- Pre-orders (items pre-ordenados en una reserva)
CREATE TABLE pre_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pre_orders_reservation_id ON pre_orders(reservation_id);

-- Orders (órdenes desde la mesa)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  session_id UUID REFERENCES table_qr_sessions(id) ON DELETE SET NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  total_amount INTEGER NOT NULL,
  tip_amount INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  notes TEXT, -- 'Sin cebolla', 'Término medio'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- WhatsApp Messages
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  campaign_id UUID, -- FK a marketing_campaigns
  recipient_phone VARCHAR(50) NOT NULL,
  type whatsapp_message_type NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_messages_restaurant_id ON whatsapp_messages(restaurant_id);
CREATE INDEX idx_whatsapp_messages_reservation_id ON whatsapp_messages(reservation_id);
CREATE INDEX idx_whatsapp_messages_campaign_id ON whatsapp_messages(campaign_id);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  gift_card_id UUID, -- FK a gift_cards
  provider VARCHAR(50) DEFAULT 'wompi',
  amount INTEGER NOT NULL,
  status payment_status DEFAULT 'pending',
  wompi_id VARCHAR(255),
  wompi_transaction_id VARCHAR(255),
  link TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_wompi_id ON payments(wompi_id);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  response TEXT, -- Respuesta del restaurante
  responded_at TIMESTAMP,
  approved BOOLEAN DEFAULT false, -- Moderación
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_approved ON reviews(approved);

-- Loyalty Transactions
CREATE TABLE loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  points INTEGER NOT NULL, -- Puede ser negativo si redime
  type loyalty_transaction_type NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loyalty_transactions_customer_id ON loyalty_transactions(customer_id);

-- Gift Cards
CREATE TABLE gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  initial_amount INTEGER NOT NULL,
  current_balance INTEGER NOT NULL,
  buyer_name VARCHAR(255),
  buyer_email VARCHAR(255),
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  message TEXT,
  status gift_card_status DEFAULT 'active',
  purchased_at TIMESTAMP DEFAULT NOW(),
  redeemed_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gift_cards_code ON gift_cards(code);
CREATE INDEX idx_gift_cards_restaurant_id ON gift_cards(restaurant_id);

-- Marketing Campaigns
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  segment_filters JSONB DEFAULT '{}'::jsonb, -- Filtros de audiencia
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  total_recipients INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  read_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0, -- Cuántos hicieron reserva después
  cost INTEGER DEFAULT 0,
  status campaign_status DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marketing_campaigns_restaurant_id ON marketing_campaigns(restaurant_id);

-- Referrals
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  referrer_customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  referred_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed
  reward_amount INTEGER,
  rewarded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_customer_id);

-- No Show History (para ML de overbooking)
CREATE TABLE no_show_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  day_of_week INTEGER,
  time_slot VARCHAR(10), -- '19:00-21:00'
  total_reservations INTEGER NOT NULL,
  no_shows INTEGER NOT NULL,
  no_show_percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_no_show_history_restaurant_id ON no_show_history(restaurant_id);
CREATE INDEX idx_no_show_history_month ON no_show_history(month);

-- Analytics Events (tracking)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL, -- 'menu_view', 'item_click', 'reservation_started'
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_restaurant_id ON analytics_events(restaurant_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- ============================================
-- INTELLIGENCE ENGINE TABLES
-- ============================================

-- Customer Preferences (recolectadas progresivamente)
CREATE TABLE customer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  preference_key VARCHAR(100) NOT NULL, -- 'spice_level', 'wine_preference', 'dietary_restriction'
  preference_value VARCHAR(255) NOT NULL,
  source VARCHAR(50), -- 'reservation_form', 'post_visit_survey', 'order_history'
  confidence_score DECIMAL(3,2) DEFAULT 1.0, -- 0.0-1.0 (ML confidence)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customer_preferences_customer_id ON customer_preferences(customer_id);
CREATE INDEX idx_customer_preferences_key ON customer_preferences(preference_key);

-- Item Ratings (implicit y explicit)
CREATE TABLE item_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rating DECIMAL(2,1), -- 1.0-5.0 (explicit rating)
  implicit_score DECIMAL(3,2), -- 0.0-1.0 (calculado por ML: frecuencia, reorden, etc)
  times_ordered INTEGER DEFAULT 1,
  last_ordered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_item_ratings_customer_id ON item_ratings(customer_id);
CREATE INDEX idx_item_ratings_item_id ON item_ratings(menu_item_id);
CREATE UNIQUE INDEX idx_item_ratings_unique ON item_ratings(customer_id, menu_item_id);

-- Customer Segments (ML-generated)
CREATE TABLE customer_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  segment_name VARCHAR(100) NOT NULL, -- 'foodie', 'loyalist', 'occasional', 'corporate', 'value_seeker'
  confidence_score DECIMAL(3,2) NOT NULL, -- 0.0-1.0
  features JSONB, -- Features usadas para clasificar
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customer_segments_customer_id ON customer_segments(customer_id);
CREATE INDEX idx_customer_segments_segment ON customer_segments(segment_name);

-- ML Predictions
CREATE TABLE ml_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type VARCHAR(100) NOT NULL, -- 'next_visit', 'next_order', 'churn_risk', 'ltv'
  entity_type VARCHAR(50) NOT NULL, -- 'customer', 'restaurant', 'menu_item'
  entity_id UUID NOT NULL,
  prediction_value JSONB NOT NULL, -- { "date": "2025-12-20", "confidence": 0.85 }
  model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- Predicción válida hasta
);

CREATE INDEX idx_ml_predictions_entity ON ml_predictions(entity_type, entity_id);
CREATE INDEX idx_ml_predictions_type ON ml_predictions(prediction_type);

-- Demand Predictions (para inventory management)
CREATE TABLE demand_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL,
  time_slot VARCHAR(20), -- '12:00-14:00', '19:00-21:00'
  predicted_orders INTEGER NOT NULL,
  confidence_interval_low INTEGER, -- Mínimo esperado
  confidence_interval_high INTEGER, -- Máximo esperado
  actual_orders INTEGER, -- Se llena después para mejorar modelo
  model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_demand_predictions_restaurant ON demand_predictions(restaurant_id, prediction_date);
CREATE INDEX idx_demand_predictions_item ON demand_predictions(menu_item_id, prediction_date);

-- ============================================
-- MONETIZATION TABLES
-- ============================================

-- YumYum Premium Subscriptions (B2C)
CREATE TABLE premium_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) DEFAULT 'premium', -- 'premium', 'premium_plus'
  price INTEGER NOT NULL, -- $29,000 COP/mes
  status VARCHAR(50) DEFAULT 'active', -- active, cancelled, past_due
  start_date DATE NOT NULL,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method VARCHAR(50), -- 'credit_card', 'debit_card'
  wompi_subscription_id VARCHAR(255),
  benefits JSONB, -- Lista de beneficios activos
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_premium_subscriptions_customer ON premium_subscriptions(customer_id);
CREATE INDEX idx_premium_subscriptions_status ON premium_subscriptions(status);

-- Featured Listings (Publicidad)
CREATE TABLE featured_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  listing_type VARCHAR(50) NOT NULL, -- 'search_featured', 'homepage_banner', 'category_sponsored'
  price INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  reservations_generated INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_featured_listings_restaurant ON featured_listings(restaurant_id);
CREATE INDEX idx_featured_listings_dates ON featured_listings(start_date, end_date);

-- Sponsored Recommendations (algoritmo prioriza estos)
CREATE TABLE sponsored_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  target_segment VARCHAR(100), -- 'foodies', 'vegans', 'italian_lovers', NULL para todos
  target_location VARCHAR(100), -- 'bogota', 'zona_t', NULL para todos
  price INTEGER NOT NULL, -- $200k/mes
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sponsored_recs_restaurant ON sponsored_recommendations(restaurant_id);

-- Marketplace Bookings (Catering, Eventos, Chefs, Clases)
CREATE TABLE marketplace_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_type VARCHAR(50) NOT NULL, -- 'catering', 'private_event', 'chef_home', 'cooking_class'
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  booking_date DATE NOT NULL,
  total_amount INTEGER NOT NULL,
  yumyum_commission_rate DECIMAL(4,2) NOT NULL, -- 15%, 20%, etc
  yumyum_commission_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  details JSONB, -- Detalles específicos del tipo de booking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marketplace_bookings_type ON marketplace_bookings(booking_type);
CREATE INDEX idx_marketplace_bookings_restaurant ON marketplace_bookings(restaurant_id);
CREATE INDEX idx_marketplace_bookings_date ON marketplace_bookings(booking_date);

-- Insurance Policies (Seguros para clientes y restaurantes)
CREATE TABLE insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_type VARCHAR(50) NOT NULL, -- 'reservation_insurance', 'no_show_protection'
  policyholder_type VARCHAR(50) NOT NULL, -- 'customer', 'restaurant'
  policyholder_id UUID NOT NULL, -- customer_id o restaurant_id
  premium_amount INTEGER NOT NULL, -- $5k para cliente, $100k para restaurante
  coverage_amount INTEGER, -- Monto máximo de cobertura
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  claims_count INTEGER DEFAULT 0,
  total_claims_paid INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insurance_policies_holder ON insurance_policies(policyholder_type, policyholder_id);

-- Insurance Claims
CREATE TABLE insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  claim_type VARCHAR(50) NOT NULL, -- 'cancellation', 'no_show'
  claim_amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, denied, paid
  claim_reason TEXT,
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_insurance_claims_policy ON insurance_claims(policy_id);

-- Restaurant Loans (YumYum Capital)
CREATE TABLE restaurant_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  loan_amount INTEGER NOT NULL,
  interest_rate DECIMAL(4,2) NOT NULL, -- 2.5% mensual
  term_months INTEGER NOT NULL,
  monthly_payment INTEGER NOT NULL,
  outstanding_balance INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- active, paid_off, defaulted
  disbursed_at TIMESTAMP,
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurant_loans_restaurant ON restaurant_loans(restaurant_id);

-- Loan Payments
CREATE TABLE loan_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID NOT NULL REFERENCES restaurant_loans(id) ON DELETE CASCADE,
  payment_amount INTEGER NOT NULL,
  principal_amount INTEGER NOT NULL,
  interest_amount INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'auto_deduct', -- auto_deduct, manual
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id);

-- API Keys (para desarrolladores)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  api_secret VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) DEFAULT 'basic', -- basic, pro, enterprise
  monthly_fee INTEGER NOT NULL,
  rate_limit INTEGER DEFAULT 1000, -- requests por minuto
  total_requests INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_key ON api_keys(api_key);

-- API Usage (tracking)
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  requests_count INTEGER NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_usage_key_date ON api_usage(api_key_id, date);

-- Data Reports (DaaS - vendidos a marcas, inversionistas)
CREATE TABLE data_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(100) NOT NULL, -- 'consumer_trends', 'location_analysis', 'menu_insights'
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  buyer_organization VARCHAR(255),
  price INTEGER NOT NULL,
  report_data JSONB, -- El reporte en sí (puede ser URL a PDF o JSON)
  generated_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_reports_type ON data_reports(report_type);
CREATE INDEX idx_data_reports_buyer ON data_reports(buyer_organization);

-- Premium Events (Chef's Table, Wine Tastings, Food Tours)
CREATE TABLE premium_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL, -- 'chefs_table', 'wine_tasting', 'food_tour'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE SET NULL,
  event_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER,
  max_attendees INTEGER,
  price_per_person INTEGER NOT NULL,
  yumyum_commission_rate DECIMAL(4,2) NOT NULL,
  total_revenue INTEGER DEFAULT 0,
  yumyum_commission_amount INTEGER DEFAULT 0,
  attendees_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'published', -- draft, published, sold_out, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_premium_events_type ON premium_events(event_type);
CREATE INDEX idx_premium_events_date ON premium_events(event_date);

-- Event Bookings
CREATE TABLE event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES premium_events(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(255),
  attendees INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_id UUID REFERENCES payments(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_event_bookings_event ON event_bookings(event_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎨 Features Completos

### 1. Sistema de Reservas

**Funcionalidades:**

- Reserva en 3 pasos (fecha, hora, personas)
- Validación de disponibilidad en tiempo real (WebSockets)
- Confirmación automática por WhatsApp
- Recordatorios 24h y 2h antes
- Cliente puede confirmar/cancelar por WhatsApp
- Reservas recurrentes (ej: todos los viernes 20:00)
- Programa de referidos (código único por cliente)

**Flujo:**

```
1. Cliente entra a {restaurante}.yumyum.com
2. Selecciona fecha, hora, personas
3. WebSocket verifica disponibilidad en tiempo real
4. Cliente ingresa datos (nombre, teléfono, email opcional)
5. Si requiere anticipo/pre-orden:
   a. Selecciona items del menú
   b. Genera link de pago Wompi
   c. Paga
6. Se crea reserva
7. WhatsApp automático: "Confirmación de reserva..."
8. 24h antes: "Recordatorio: mañana a las 20:00"
9. 2h antes: "Te esperamos en 2 horas"
10. Cliente responde "1" para confirmar
11. Restaurante ve confirmación en dashboard
12. Cliente llega, se marca como "seated"
13. Después de la visita: encuesta automática por WhatsApp
```

### 2. Pre-Orden + Anticipo

**Caso de uso:**

```
Cliente reserva para 4 personas a las 20:00.
Anticipo mínimo: $80,000 COP.

Pre-ordena:
- 4× Limonadas ($12k c/u) = $48k
- 2× Entrada de camarones ($24k c/u) = $48k
TOTAL PRE-ORDEN: $96,000 COP

Paga $96k al hacer la reserva.

Restaurante:
  ✓ Recibe $96k anticipado (cash flow)
  ✓ Sabe qué preparar
  ✓ 19:45: prepara entrada y bebidas
  ✓ 20:00: cliente llega y ya está todo servido

Cliente:
  ✓ Llega y come de inmediato
  ✓ Experiencia premium

Si cliente no llega (no-show):
  Restaurante pierde la entrada pero GANA $96k.
```

**Implementación:**

```typescript
// Backend: reservations/create-reservation.dto.ts
export class CreateReservationDto {
  @IsString()
  customerName: string;

  @IsPhoneNumber('CO')
  customerPhone: string;

  @IsInt()
  @Min(1)
  partySize: number;

  @IsDateString()
  reservationDate: string;

  @IsString()
  reservationTime: string;

  // Pre-orden opcional
  @IsOptional()
  @IsArray()
  preOrderItems?: {
    menuItemId: string;
    quantity: number;
    notes?: string;
  }[];
}

// Service
async createReservation(dto: CreateReservationDto) {
  const restaurant = await this.restaurantsService.findOne(dto.restaurantId);

  // Calcular si requiere anticipo
  const requiresDeposit =
    restaurant.depositEnabled &&
    dto.partySize >= restaurant.depositThresholdPartySize;

  // Calcular total de pre-orden
  let preOrderTotal = 0;
  if (dto.preOrderItems) {
    for (const item of dto.preOrderItems) {
      const menuItem = await this.menuService.findItem(item.menuItemId);
      preOrderTotal += menuItem.price * item.quantity;
    }
  }

  const depositAmount = requiresDeposit
    ? Math.max(restaurant.depositAmount, preOrderTotal)
    : preOrderTotal;

  // Crear reserva
  const reservation = await this.reservationsRepo.save({
    ...dto,
    requiresDeposit: requiresDeposit || preOrderTotal > 0,
    depositAmount,
    hasPreOrder: dto.preOrderItems?.length > 0,
    preOrderTotal,
    status: depositAmount > 0 ? 'pending' : 'confirmed',
  });

  // Crear pre-orders
  if (dto.preOrderItems) {
    await this.preOrdersRepo.save(
      dto.preOrderItems.map(item => ({
        reservationId: reservation.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
      }))
    );
  }

  // Si requiere pago, generar link de Wompi
  if (depositAmount > 0) {
    const paymentLink = await this.wompiService.createPaymentLink({
      amount: depositAmount,
      reference: reservation.id,
      customerEmail: dto.customerEmail,
    });

    await this.paymentsRepo.save({
      reservationId: reservation.id,
      amount: depositAmount,
      link: paymentLink,
    });

    // Enviar WhatsApp con link de pago
    await this.whatsappService.sendPaymentLink(
      dto.customerPhone,
      reservation,
      paymentLink
    );
  } else {
    // Enviar confirmación directa
    await this.whatsappService.sendConfirmation(dto.customerPhone, reservation);
  }

  return reservation;
}
```

### 3. Menú Digital + Órdenes desde Mesa

**QR en la mesa:**

```
1. Cliente escanea QR en la mesa
2. Abre: {restaurante}.yumyum.com/menu?table={tableId}&session={token}
3. Ve menú completo (con branding del restaurante)
4. Agrega items al carrito
5. Envía orden
6. WebSocket notifica a dashboard
7. Dashboard muestra: "Nueva orden - Mesa 5"
8. Staff confirma orden
9. Cocina prepara
10. Staff marca como "lista" y "entregada"
```

**Personalización del menú:**

```typescript
// Cada restaurante tiene su tema
<div style={{
  backgroundColor: restaurant.theme.backgroundColor,
  color: restaurant.theme.primaryColor,
  fontFamily: fontFamilies[restaurant.theme.fontFamily],
}}>
  <img src={restaurant.theme.logoUrl} />
  <Hero backgroundImage={restaurant.theme.heroImageUrl} />

  {menuCategories.map(category => (
    <MenuCategory key={category.id}>
      {category.items.map(item => (
        <MenuItem
          item={item}
          available={item.available} // Real-time desde WebSocket
          onAddToCart={handleAddToCart}
        />
      ))}
    </MenuCategory>
  ))}
</div>
```

**Alertas de inventario:**

```typescript
// Dashboard: marcar plato como agotado
async function markItemUnavailable(itemId: string) {
  await api.patch(`/menu-items/${itemId}`, { available: false });

  // WebSocket emite a todos los clientes viendo el menú
  socket.emit('inventory:updated', {
    restaurantId,
    itemId,
    available: false,
  });
}

// Booking app: escucha cambios
socket.on('inventory:updated', ({ itemId, available }) => {
  setMenuItems(prev => prev.map(item => (item.id === itemId ? { ...item, available } : item)));
});
```

### 4. CRM + Historial de Clientes

**Perfil de cliente:**

```
Juan Pérez (+573001234567)
────────────────────────────
📊 Estadísticas:
  • Visitas: 12
  • Gasto total: $2,400,000 COP
  • Ticket promedio: $200,000 COP
  • Última visita: hace 15 días
  • No-shows: 0
  • Puntos de fidelidad: 450

🏷️ Tags: VIP, Vegano, Cumpleaños en Marzo

📅 Historial de Reservas:
  1. 2025-11-28 - Mesa 5 - 4 personas - $240k
  2. 2025-11-15 - Mesa 3 - 2 personas - $180k
  ...

📧 Campañas recibidas:
  • "Promo Día del Padre" - Abrió, No reservó
  • "Nuevo menú vegano" - Abrió, Reservó ✓
```

**Segmentación para marketing:**

```sql
-- Ejemplo: Clientes VIP que no vienen hace 30+ días
SELECT * FROM customers
WHERE total_spent > 1000000
AND id NOT IN (
  SELECT customer_id FROM reservations
  WHERE created_at > NOW() - INTERVAL '30 days'
)
```

### 5. Campañas de Marketing por WhatsApp

**Crear campaña:**

```
Dashboard > Marketing > Nueva Campaña

Nombre: "Promoción Día de San Valentín"
Mensaje:
  ¡Hola {nombre}! 💕

  Este 14 de febrero celebra el amor en El Cielo.

  Reserva para 2 personas y recibe una botella de vino gratis.

  Reserva aquí: {link}

  - El Cielo Restaurante

Audiencia (filtros):
  ☑ Clientes con 2+ visitas
  ☑ Última visita: hace 15-60 días
  ☑ Sin reserva activa
  ☐ Tag: Parejas
  ☐ Gastó más de: $200,000

Total destinatarios: 127 clientes

Programar:
  ○ Enviar ahora
  ● Programar para: 2025-02-10 10:00 AM

Costo estimado: 127 mensajes × $150 = $19,050 COP
```

**Seguimiento:**

```
Campaña: "Promo San Valentín"
────────────────────────────
📤 Enviados: 127
✓ Entregados: 125 (98%)
👁️ Leídos: 98 (78%)
🎯 Conversiones: 18 reservas (14% conversion rate)
💰 Revenue generado: $1,800,000 COP
📊 ROI: ($1.8M - $19k) / $19k = 9,368%
```

**Pricing:**

```
Plan Pro: 500 mensajes/mes incluidos
Adicionales: $150 COP/mensaje

Si envía 2,000 mensajes/mes:
  500 incluidos = $0
  1,500 adicionales × $150 = $225,000 COP
```

### 6. Sistema de Puntos y Fidelización

**Reglas:**

```
Ganar puntos:
  • Reserva completada: +10 puntos por cada $10,000 gastados
  • Escribir reseña: +50 puntos
  • Referir amigo: +100 puntos (cuando el amigo completa 1ra reserva)
  • Cumpleaños: +200 puntos bonus

Redimir puntos:
  • 100 puntos = $10,000 descuento
  • 500 puntos = Entrada gratis
  • 1,000 puntos = Plato principal gratis
```

**Implementación:**

```typescript
// Cuando completa reserva
async function completeReservation(reservationId: string) {
  const reservation = await this.reservationsRepo.findOne(reservationId);

  // Marcar como completada
  await this.reservationsRepo.update(reservationId, {
    status: 'completed',
    completedAt: new Date(),
  });

  // Obtener total gastado (desde órdenes)
  const totalSpent = await this.ordersRepo
    .createQueryBuilder('order')
    .select('SUM(order.total_amount)', 'total')
    .where('order.table_id IN (SELECT id FROM tables WHERE ...)')
    .getRawOne();

  // Calcular puntos
  const points = Math.floor(totalSpent.total / 10000) * 10;

  // Dar puntos al cliente
  await this.loyaltyService.addPoints({
    customerId: reservation.customerId,
    restaurantId: reservation.restaurantId,
    reservationId: reservation.id,
    points,
    type: 'earned',
    description: `Reserva completada - $${totalSpent.total} COP`,
  });

  // Actualizar contador del cliente
  await this.customersRepo.increment({ id: reservation.customerId }, 'loyaltyPoints', points);
}
```

### 7. Gift Cards Digitales

**Comprar:**

```
Cliente entra a: {restaurante}.yumyum.com/gift-cards

Selecciona monto: $50,000 / $100,000 / $200,000 / Personalizado
Para: María López (maria@email.com)
De: Juan Pérez
Mensaje: "¡Feliz cumpleaños! Disfruta una cena en El Cielo"

Paga con Wompi.

María recibe email con código: ELCIELO-A3B4C5
```

**Redimir:**

```
Cliente hace reserva o paga en el restaurante.
Aplica código ELCIELO-A3B4C5.
Descuenta del total.
Si sobra saldo, queda guardado para próxima vez.
```

**Dashboard:**

```
Gift Cards Activas:
  • Código A3B4C5: $80,000 restante (de $100k)
  • Código D6E7F8: $200,000 (sin usar)

Total en gift cards sin redimir: $280,000 COP
```

### 8. Reportes Exportables

**Reportes disponibles:**

```
1. Reservas por período
   - Total reservas
   - Por status (confirmadas, no-shows, canceladas)
   - Tasa de confirmación
   - Export: PDF, Excel

2. Ventas y revenue
   - Revenue por anticipos
   - Revenue por órdenes en mesa
   - Revenue por gift cards
   - Export: PDF, Excel

3. Clientes
   - Nuevos vs recurrentes
   - Top 10 clientes (por gasto)
   - Segmentación por tags
   - Export: CSV

4. Menú
   - Items más vendidos
   - Items menos vendidos
   - Sugerencias de inventario
   - Export: PDF

5. No-shows
   - Tasa de no-shows por día/hora
   - Clientes con más no-shows
   - Export: Excel
```

### 9. Heatmap de Popularidad

**Visualización:**

```
Popularidad de Reservas - Noviembre 2025
─────────────────────────────────────────────
         Lun  Mar  Mié  Jue  Vie  Sáb  Dom
12:00-14:00  🟢   🟡   🟡   🟢   🔴   🔴   🟡
14:00-16:00  🟢   🟢   🟢   🟢   🟡   🟡   🟢
16:00-18:00  🟢   🟢   🟢   🟢   🟡   🔴   🟡
18:00-20:00  🟡   🟡   🔴   🔴   🔴   🔴   🔴
20:00-22:00  🟡   🟡   🔴   🔴   🔴   🔴   🔴

🟢 Baja demanda (0-50% ocupación)
🟡 Media demanda (50-80% ocupación)
🔴 Alta demanda (80-100% ocupación)

Sugerencia: Aumentar precio en 20% los Vie-Sáb 18:00-22:00
```

**Pricing dinámico:**

```typescript
// time_slots.price_multiplier
Lunes-Jueves 12:00-18:00: 0.8× (20% descuento)
Viernes-Sábado 19:00-22:00: 1.2× (20% premium)
```

### 10. Encuestas Post-Visita

**Flujo:**

```
1. Cliente completa reserva
2. Al día siguiente (10:00 AM):
   WhatsApp automático:

   "¡Hola Juan! Gracias por visitarnos ayer.

   ¿Cómo estuvo tu experiencia en El Cielo?

   Responde:
   5️⃣ Excelente
   4️⃣ Buena
   3️⃣ Regular
   2️⃣ Mala
   1️⃣ Muy mala"

3. Cliente responde "5"

4. WhatsApp:
   "¡Gracias! ¿Te gustaría dejar una reseña?

   Responde 1 para sí, 2 para no"

5. Si dice "1":
   "Escribe tu comentario y lo publicaremos:"

6. Cliente escribe: "Excelente comida y servicio"

7. Se guarda como review (pendiente de aprobación)

8. Restaurante aprueba en dashboard

9. Aparece en página pública del restaurante
```

---

## 📅 Plan de Trabajo (24 Semanas / 6 Meses)

### Metodología

```
Framework: Scrum
Sprints: 2 semanas
Equipo sugerido:
  - 1 Tech Lead / Architect
  - 2 Frontend developers
  - 2 Backend developers
  - 1 Full-stack (apoyo)
  - 1 QA Engineer
  - 1 Product Owner
  - 1 UX/UI Designer (primeros 2 meses)

Ceremonias:
  - Daily standup: 15 min async (Slack)
  - Sprint planning: Lunes inicio de sprint (2h)
  - Sprint review: Viernes fin de sprint (1h)
  - Retrospectiva: Viernes fin de sprint (1h)
```

---

### Sprint 0: Setup e Infraestructura (1 semana)

**Objetivo:** Base técnica funcionando

**DevOps:**

- [ ] Setup monorepo (Turborepo)
- [ ] Configurar 3 apps Next.js (admin, booking, dashboard)
- [ ] Setup NestJS backend
- [ ] PostgreSQL + Redis (Docker local)
- [ ] CI/CD (GitHub Actions)
- [ ] Ambientes: dev, staging, prod
- [ ] Vercel config (3 proyectos)
- [ ] Railway config (backend + DB)

**Design:**

- [ ] Design system (Figma)
- [ ] Wireframes de todas las pantallas
- [ ] Logo y branding de YumYum
- [ ] Componentes base en shadcn/ui

**Entregable:** Repos funcionando con deploys automáticos

---

### Sprint 1-2: Autenticación y Restaurantes (2 semanas)

**Backend:**

- [ ] Módulo Auth (JWT + refresh tokens)
  - [ ] POST /auth/register
  - [ ] POST /auth/login
  - [ ] POST /auth/refresh
  - [ ] POST /auth/logout
  - [ ] Guards y decoradores
- [ ] Módulo Restaurants
  - [ ] CRUD completo
  - [ ] Slug generation (unique)
  - [ ] Theme (JSONB)
  - [ ] Settings (JSONB)

**Frontend (Admin):**

- [ ] Login page
- [ ] Register page
- [ ] Dashboard layout
- [ ] CRUD restaurantes
  - [ ] Lista
  - [ ] Crear/editar
  - [ ] Vista de configuración
- [ ] Auth interceptor (Axios)

**Frontend (Booking):**

- [ ] Homepage básica
- [ ] Página de restaurante `/r/[slug]`

**Testing:**

- [ ] Tests unitarios (auth services)
- [ ] Tests E2E (login flow)

**Entregable:** Admin puede crear restaurantes y hacer login

---

### Sprint 3-4: Mesas, Horarios y Personalización (2 semanas)

**Backend:**

- [ ] Módulo Tables
  - [ ] CRUD completo
  - [ ] QR code generation
- [ ] Módulo TimeSlots
  - [ ] CRUD completo
  - [ ] Validar no-overlaps

**Frontend (Dashboard):**

- [ ] CRUD de mesas (drag & drop layout)
- [ ] CRUD de horarios (calendar view)
- [ ] Configuración de restaurante:
  - [ ] White-label (logo, colores, fuentes, imágenes)
  - [ ] Configuración de anticipo
  - [ ] Configuración de pre-orden
  - [ ] Configuración de órdenes desde mesa

**Frontend (Booking):**

- [ ] Aplicar tema personalizado dinámicamente
- [ ] Mostrar logo y hero image

**Testing:**

- [ ] Tests de validación
- [ ] Tests E2E

**Entregable:** Restaurante completamente configurado y personalizado

---

### Sprint 5-7: Sistema de Reservas (3 semanas)

**Backend:**

- [ ] Módulo Customers (CRM)
  - [ ] Crear/actualizar automáticamente
  - [ ] Historial de reservas
- [ ] Módulo Reservations
  - [ ] POST /reservations (con locks)
  - [ ] GET /reservations (filtros)
  - [ ] PATCH /reservations/:id/confirm
  - [ ] PATCH /reservations/:id/cancel
  - [ ] PATCH /reservations/:id/seat
  - [ ] PATCH /reservations/:id/complete
  - [ ] PATCH /reservations/:id/no-show
- [ ] Endpoint de disponibilidad
  - [ ] GET /availability (real-time)
  - [ ] WebSocket para updates
- [ ] Validaciones
  - [ ] Disponibilidad
  - [ ] Horarios válidos
  - [ ] Capacidad

**Frontend (Booking):**

- [ ] Formulario de reserva
  - [ ] Selector de fecha (calendar)
  - [ ] Selector de hora (slots disponibles)
  - [ ] Datos del cliente
  - [ ] Requests especiales
- [ ] WebSocket connection (disponibilidad en tiempo real)
- [ ] Confirmación de reserva
- [ ] Página "Mi reserva" (ver/cancelar)

**Frontend (Dashboard):**

- [ ] Vista de reservas
  - [ ] Calendario
  - [ ] Lista del día
  - [ ] Filtros (status, fecha)
- [ ] Detalle de reserva
- [ ] Acciones (seat, complete, no-show)
- [ ] WebSocket (nuevas reservas en vivo)

**Testing:**

- [ ] Tests de concurrencia (múltiples reservas simultáneas)
- [ ] Tests de WebSockets
- [ ] Tests E2E (flujo completo)

**Entregable:** Sistema de reservas funcional (sin WhatsApp aún)

---

### Sprint 8-10: WhatsApp (3 semanas)

**Backend:**

- [ ] Integración Baileys
  - [ ] Setup y conexión
  - [ ] Enviar mensajes
  - [ ] Recibir mensajes (webhook)
  - [ ] QR login UI (admin panel)
- [ ] Queue WhatsApp (BullMQ)
  - [ ] Job: send-confirmation
  - [ ] Job: send-reminder-24h
  - [ ] Job: send-reminder-2h
  - [ ] Job: send-survey
  - [ ] Retry logic
- [ ] Cron jobs (@nestjs/schedule)
  - [ ] Recordatorios 24h antes
  - [ ] Recordatorios 2h antes
  - [ ] Encuestas post-visita
- [ ] Webhook de mensajes entrantes
  - [ ] Parsear respuesta
  - [ ] Confirmar reserva (respuesta "1")
  - [ ] Cancelar reserva (respuesta "2")
  - [ ] Guardar respuesta de encuesta

**Frontend (Dashboard):**

- [ ] Estado de WhatsApp (conectado/desconectado)
- [ ] Log de mensajes enviados
- [ ] Configuración de templates
- [ ] Dashboard de WhatsApp status

**Testing:**

- [ ] Tests de workers
- [ ] Tests de cron jobs
- [ ] Tests de webhook

**Entregable:** WhatsApp completamente funcional

---

### Sprint 11-12: Pagos y Anticipo (2 semanas)

**Backend:**

- [ ] Integración Wompi
  - [ ] Crear payment link
  - [ ] Webhook de confirmación
  - [ ] Verificar transacción
- [ ] Módulo Payments
  - [ ] Crear pago
  - [ ] Verificar estado
  - [ ] Asociar a reserva
- [ ] Lógica de anticipo
  - [ ] Evaluar si requiere (party_size)
  - [ ] Bloquear reserva hasta pago
  - [ ] Liberar mesa si no paga en 15 min
  - [ ] Marcar como paid al recibir webhook

**Frontend (Booking):**

- [ ] Flujo de pago
  - [ ] Mostrar monto
  - [ ] Link de Wompi
  - [ ] Redirect después de pago
- [ ] Página de confirmación de pago

**Frontend (Dashboard):**

- [ ] Ver estado de pago en reserva
- [ ] Configuración de anticipo (settings)

**Testing:**

- [ ] Tests de webhook Wompi (mock)
- [ ] Tests de flujo completo

**Entregable:** Anticipo funcional con Wompi

---

### Sprint 13-14: Menú Digital (2 semanas)

**Backend:**

- [ ] Módulo MenuCategories
  - [ ] CRUD completo
- [ ] Módulo MenuItems
  - [ ] CRUD completo
  - [ ] Upload de imágenes (S3)
  - [ ] Marcar como available/unavailable
- [ ] Módulo MenuPDFs
  - [ ] Upload PDF
  - [ ] Por idioma
- [ ] WebSocket para inventory updates

**Frontend (Dashboard):**

- [ ] CRUD de menú
  - [ ] Categorías
  - [ ] Items (con drag & drop ordering)
  - [ ] Upload de imágenes
  - [ ] Upload de PDFs
- [ ] Marcar items como agotados (toggle)

**Frontend (Booking):**

- [ ] Página de menú `/r/[slug]/menu`
  - [ ] Vista de categorías
  - [ ] Vista de items
  - [ ] Imágenes
  - [ ] Filtros (tags: vegano, sin gluten, etc)
- [ ] Descarga de PDF por idioma
- [ ] WebSocket (actualizar disponibilidad)

**Testing:**

- [ ] Tests de uploads
- [ ] Tests de WebSocket

**Entregable:** Menú digital completo

---

### Sprint 15-16: Pre-Orden (2 semanas)

**Backend:**

- [ ] Módulo PreOrders
  - [ ] Crear pre-order items
  - [ ] Asociar a reserva
  - [ ] Calcular total
- [ ] Integrar con Wompi (pago incluye pre-orden)
- [ ] Notificación a dashboard

**Frontend (Booking):**

- [ ] Al reservar: seleccionar items del menú
  - [ ] Carrito de pre-orden
  - [ ] Solo items marcados como `is_pre_orderable`
- [ ] Mostrar total (anticipo + pre-orden)
- [ ] Pagar todo junto

**Frontend (Dashboard):**

- [ ] Vista de "Pre-órdenes del día"
  - [ ] Por hora de llegada
  - [ ] Items ordenados
  - [ ] Cliente info
- [ ] Marcar como preparada/entregada

**Testing:**

- [ ] Tests de cálculo de totales
- [ ] Tests E2E (reserva con pre-orden)

**Entregable:** Pre-orden funcional

---

### Sprint 17-18: Órdenes desde Mesa (2 semanas)

**Backend:**

- [ ] Módulo Orders
  - [ ] Crear orden
  - [ ] Order items
  - [ ] Order number generation
- [ ] Módulo TableQRSessions
  - [ ] Crear sesión al escanear QR
  - [ ] Asociar órdenes a sesión
- [ ] WebSocket para nuevas órdenes

**Frontend (Booking):**

- [ ] Página `/r/[slug]/table?session=[token]`
  - [ ] Ver menú (solo items disponibles)
  - [ ] Carrito
  - [ ] Enviar orden
- [ ] Confirmación de orden enviada

**Frontend (Dashboard):**

- [ ] Vista de "Órdenes activas"
  - [ ] Por mesa
  - [ ] Por status (pending, preparing, ready, delivered)
  - [ ] Cambiar status
- [ ] WebSocket (notificación de nuevas órdenes)
  - [ ] Sonido de alerta
  - [ ] Toast notification

**Testing:**

- [ ] Tests de WebSocket
- [ ] Tests E2E

**Entregable:** Órdenes desde mesa funcionando

---

### Sprint 19: CRM y Segmentación (1 semana)

**Backend:**

- [ ] Enriquecer módulo Customers
  - [ ] Calcular stats (total_spent, visit_count, etc)
  - [ ] Tags (array JSONB)
- [ ] Endpoint de segmentación
  - [ ] Filtros dinámicos

**Frontend (Dashboard):**

- [ ] Vista de clientes
  - [ ] Lista con stats
  - [ ] Perfil de cliente detallado
  - [ ] Historial de reservas
  - [ ] Agregar/editar tags

**Entregable:** CRM básico funcional

---

### Sprint 20: Campañas de Marketing (1 semana)

**Backend:**

- [ ] Módulo MarketingCampaigns
  - [ ] Crear campaña
  - [ ] Definir audiencia (segment_filters)
  - [ ] Programar envío
- [ ] Worker para envío masivo
  - [ ] Iterar destinatarios
  - [ ] Enviar WhatsApp (rate limited)
  - [ ] Tracking (delivered, read)
- [ ] Endpoint de tracking de conversiones

**Frontend (Dashboard):**

- [ ] Vista de "Marketing"
  - [ ] Lista de campañas
  - [ ] Crear campaña
    - [ ] Nombre
    - [ ] Mensaje (con variables: {nombre}, {link})
    - [ ] Audiencia (filtros)
    - [ ] Programar
  - [ ] Ver resultados (delivered, read, conversions)

**Testing:**

- [ ] Tests de worker
- [ ] Tests de segmentación

**Entregable:** Campañas de marketing funcionales

---

### Sprint 21: Reseñas y Fidelización (1 semana)

**Backend:**

- [ ] Módulo Reviews
  - [ ] Crear review (desde WhatsApp o web)
  - [ ] Moderar (approve/reject)
  - [ ] Restaurante puede responder
- [ ] Módulo Loyalty
  - [ ] Calcular puntos al completar reserva
  - [ ] Redimir puntos
  - [ ] Historial de transacciones
- [ ] Trigger al completar reserva (dar puntos)

**Frontend (Booking):**

- [ ] Mostrar reseñas aprobadas en página del restaurante
- [ ] Rating promedio

**Frontend (Dashboard):**

- [ ] Vista de "Reseñas"
  - [ ] Pendientes de aprobar
  - [ ] Aprobadas
  - [ ] Responder
- [ ] Configuración de loyalty (reglas de puntos)
- [ ] Ver transacciones de puntos por cliente

**Entregable:** Reseñas y fidelización funcionando

---

### Sprint 22: Features Adicionales (1 semana)

**Backend:**

- [ ] Módulo Referrals
  - [ ] Generar código único por cliente
  - [ ] Tracking de referidos
  - [ ] Dar reward al completar
- [ ] Módulo GiftCards
  - [ ] Crear gift card
  - [ ] Redimir
  - [ ] Verificar balance
- [ ] Reservas recurrentes (cron job)
  - [ ] Crear automáticamente cada semana

**Frontend (Booking):**

- [ ] Página de gift cards
  - [ ] Comprar
  - [ ] Pagar con Wompi
- [ ] Aplicar código de referido al reservar
- [ ] Aplicar gift card al reservar

**Frontend (Dashboard):**

- [ ] Vista de gift cards activas
- [ ] Configurar reserva recurrente

**Entregable:** Referidos, gift cards, recurrentes

---

### Sprint 23: Analytics y Reportes (1 semana)

**Backend:**

- [ ] Módulo Analytics
  - [ ] Tracking de eventos
  - [ ] Cálculo de no-shows por hora/día
  - [ ] Heatmap data
- [ ] Endpoints de reportes
  - [ ] GET /reports/reservations
  - [ ] GET /reports/revenue
  - [ ] GET /reports/customers
  - [ ] GET /reports/menu
  - [ ] GET /reports/no-shows
  - [ ] GET /reports/heatmap
- [ ] Export a PDF/Excel (library: exceljs, pdfkit)

**Frontend (Dashboard):**

- [ ] Vista de "Reportes"
  - [ ] Selector de tipo de reporte
  - [ ] Filtros (fechas)
  - [ ] Visualización (tablas, gráficos)
  - [ ] Botón de export (PDF, Excel, CSV)
- [ ] Vista de "Analytics"
  - [ ] Heatmap de popularidad
  - [ ] Gráficos de tendencias
  - [ ] Sugerencias (pricing dinámico)

**Entregable:** Reportes y analytics completos

---

### Sprint 24: Testing, Bug Fixing y Launch Prep (1 semana)

**QA:**

- [ ] Testing exhaustivo de todos los módulos
- [ ] Tests E2E de flujos críticos
- [ ] Performance testing (load testing con k6)
- [ ] Security audit
  - [ ] SQL injection
  - [ ] XSS
  - [ ] CSRF
  - [ ] Auth vulnerabilities
- [ ] Accessibility audit (WCAG 2.1)

**DevOps:**

- [ ] Setup monitoring (Sentry, DataDog)
- [ ] Setup alertas (Slack, email)
- [ ] Backups automáticos configurados
- [ ] Disaster recovery plan
- [ ] Load balancer config (si usan AWS)

**Documentación:**

- [ ] Swagger completo y actualizado
- [ ] README de cada repo
- [ ] Guía de deploy
- [ ] Guía de troubleshooting
- [ ] Documentación de usuario (cómo usar la plataforma)

**Marketing:**

- [ ] Landing page de YumYum
- [ ] Video demo (3 min)
- [ ] Casos de estudio (early adopters)
- [ ] Deck de ventas actualizado

**Entregable:** MVP listo para producción

---

### Timeline Visual

```
Semana 1:     Sprint 0 (Setup)
Semanas 2-3:  Sprint 1-2 (Auth + Restaurantes)
Semanas 4-5:  Sprint 3-4 (Mesas + Horarios + Personalización)
Semanas 6-8:  Sprint 5-7 (Reservas)
Semanas 9-11: Sprint 8-10 (WhatsApp)
Semanas 12-13: Sprint 11-12 (Pagos)
Semanas 14-15: Sprint 13-14 (Menú)
Semanas 16-17: Sprint 15-16 (Pre-Orden)
Semanas 18-19: Sprint 17-18 (Órdenes)
Semana 20:    Sprint 19 (CRM)
Semana 21:    Sprint 20 (Marketing)
Semana 22:    Sprint 21 (Reseñas + Loyalty)
Semana 23:    Sprint 22 (Referidos + Gift Cards)
Semana 24:    Sprint 23 (Analytics)
Semana 25:    Sprint 24 (QA + Launch)
──────────────────────────────────────
TOTAL: 25 semanas (6 meses aprox)

LANZAMIENTO: Semana 25
```

---

## 🚀 Infraestructura y DevOps

### CI/CD Pipeline

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/api/**'
      - 'packages/**'
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test --filter=api
      - run: pnpm run test:e2e --filter=api
      - run: pnpm run lint --filter=api

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway (Staging)
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm i -g @railway/cli
          railway up --service api-staging

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway (Production)
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm i -g @railway/cli
          railway up --service api-production
```

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'apps/admin/**'
      - 'apps/booking/**'
      - 'apps/dashboard/**'
      - 'packages/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        app: [admin, booking, dashboard]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build --filter=${{ matrix.app }}
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          pnpm i -g vercel
          vercel --token=$VERCEL_TOKEN --prod
```

### Docker (Desarrollo Local)

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build --filter=api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yumyum
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - '4000:4000'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/yumyum
      REDIS_URL: redis://redis:6379
      JWT_SECRET: supersecret
      NODE_ENV: development
    depends_on:
      - postgres
      - redis
    volumes:
      - ./apps/api:/app/apps/api
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
```

### Monitoreo

```typescript
// Sentry (Backend)
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Postgres(),
  ],
});

// Logger personalizado
import { Logger } from '@nestjs/common';

const logger = new Logger('ReservationsService');

try {
  await this.createReservation(dto);
  logger.log('Reservation created', { reservationId, restaurantId });
} catch (error) {
  logger.error('Failed to create reservation', error.stack, {
    dto,
    error: error.message,
  });
  Sentry.captureException(error);
  throw error;
}
```

---

## 🔒 Seguridad

### Rate Limiting

```typescript
// Backend
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

ThrottlerModule.forRoot({
  ttl: 60,
  limit: 20, // 20 requests por minuto
});

// Aplicar globalmente
app.useGlobalGuards(new ThrottlerGuard());

// O por endpoint
@UseGuards(ThrottlerGuard)
@Throttle(5, 60) // 5 requests/min
@Post('reservations')
async create() {}
```

### Secrets Management

```
Development: .env local (git-ignored)

Staging/Production:
  - Railway: Env vars en UI
  - O AWS Secrets Manager

Secrets requeridos:
  - DATABASE_URL
  - REDIS_URL
  - JWT_SECRET (256-bit random)
  - JWT_REFRESH_SECRET
  - WOMPI_PUBLIC_KEY
  - WOMPI_PRIVATE_KEY
  - WOMPI_EVENTS_SECRET (para webhooks)
  - AWS_ACCESS_KEY_ID (S3)
  - AWS_SECRET_ACCESS_KEY
  - S3_BUCKET_NAME
  - SENTRY_DSN
  - SENDGRID_API_KEY
```

---

## ⚠️ Riesgos y Mitigaciones

(Ver sección anterior del documento original + agregar):

### 11. Complejidad del Producto

**Riesgo:** Producto muy grande, difícil de mantener.

**Probabilidad:** Alta (70%)
**Impacto:** Alto

**Mitigación:**

- Monorepo bien estructurado
- Tests exhaustivos (coverage >80%)
- Documentación completa
- Code reviews obligatorios
- Refactoring continuo

---

## 💵 Costos y Pricing Actualizados

### Costos Operacionales (100 restaurantes)

```
Infraestructura:
  - Vercel (3 apps): $60/mes
  - Railway (API + DB + Redis): $200/mes
  - AWS S3 (imágenes, PDFs): $30/mes
  - WhatsApp Business API: $6,000/mes (15k msgs/día)
  - SendGrid (emails): $20/mes
  - Sentry: $29/mes
  - DataDog: $100/mes (opcional)
SUBTOTAL INFRA: $6,439/mes

Wompi (comisiones):
  - Variable según volumen de anticipos
  - Estimado: $300,000 COP/mes

TOTAL COSTOS: ~$7M COP/mes (con 100 restaurantes)

Ingresos (100 restaurantes en Plan Pro):
  - 100 × $249k = $24,900,000 COP/mes
  - Mensajes marketing adicionales: ~$2M COP/mes
  - Comisión anticipos (2.5%): ~$1M COP/mes
TOTAL INGRESOS: ~$28M COP/mes

MARGEN BRUTO: $21M COP/mes (75%)
```

**Break-even: 12-15 restaurantes**

---

## 📊 Métricas Finales

```
North Star Metric:
  % de Reservas Atendidas >92%

Product Metrics:
  - Tasa de confirmación por WhatsApp >60%
  - Tasa de no-shows <5%
  - Adoption de órdenes desde mesa >30%
  - Adoption de pre-orden >15%
  - NPS >60

Business Metrics:
  - MRR Growth Rate >20% mensual
  - Churn <5% mensual
  - CAC <$300k COP
  - LTV/CAC >5
  - Revenue per Restaurant >$3M COP/año
```

---

## 🎯 Próximos Pasos Inmediatos

### Esta Semana

1. **Validar con clientes (5+ restaurantes)**
   - Mostrar este plan
   - Preguntar: ¿Pagarían $249k/mes por esto?
   - Entender objeciones
   - Conseguir 2-3 early adopters comprometidos

2. **Definir equipo completo**
   - Roles y responsabilidades
   - Contratar si falta gente
   - Kickoff meeting

3. **Setup de proyecto**
   - Crear GitHub org
   - Repos con estructura de monorepo
   - Figma workspace
   - Slack/Discord
   - Notion/Linear para tasks

### Semana 1 (Sprint 0)

Ejecutar todo lo del Sprint 0 del plan de trabajo.

---

## 🏁 Conclusión

Este documento define:

✅ **Producto completo y competitivo** con features únicas (pre-orden)
✅ **Arquitectura escalable** (monorepo, WebSockets, microservicios)
✅ **Modelo de negocio validable** (ROI claro para clientes)
✅ **Plan de trabajo realista** (25 semanas / 6 meses)
✅ **Unit economics saludables** (75% margen bruto a escala)
✅ **Riesgos identificados y mitigados**

**Decisión crítica:** Validar con 5+ restaurantes ANTES de escribir código.

**Pregunta clave:** ¿Pagarían $249,000 COP/mes por todo esto?

Si **SÍ** → Ejecutar este plan.
Si **NO** → Iterar en propuesta de valor.

---

**Este es un documento vivo. Actualizar cada sprint con aprendizajes reales.**

**Última actualización:** 2025-12-12
**Versión:** 2.0 (completa)
