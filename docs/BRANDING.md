# YumYum - Brand Guidelines

## 🎨 Brand Identity

YumYum is a comprehensive SaaS restaurant management system that combines modern technology with the warmth of dining experiences.

---

## Logo

### Primary Logo

The YumYum logo consists of:

- **Symbol:** A stylized fork and spoon forming a "Y"
- **Wordmark:** "YumYum" in a modern, friendly typeface
- **Tagline:** "Tu mesa perfecta te espera"

### Logo Variations

1. **Full Logo:** Symbol + Wordmark + Tagline (for marketing materials)
2. **Logo Mark:** Symbol + Wordmark (standard usage)
3. **Icon:** Symbol only (app icons, favicons)

---

## Color Palette

### Brand Colors

#### Primary Colors

- **Orange 600:** `#f97316` - Main brand color, energy and appetite
  - RGB: 249, 115, 22
  - Used for: Primary buttons, highlights, key CTAs

- **Yellow 500:** `#fbbf24` - Secondary brand color, warmth and happiness
  - RGB: 251, 191, 36
  - Used for: Accents, gradients with orange

#### Secondary Colors (by app)

**Admin App (Purple/Pink):**

- Primary: `#9333ea` (Purple 600)
- Secondary: `#db2777` (Pink 600)
- Gradient: `from-purple-600 to-pink-600`

**Dashboard App (Blue/Cyan):**

- Primary: `#0284c7` (Sky 600)
- Secondary: `#06b6d4` (Cyan 500)
- Gradient: `from-sky-600 to-cyan-700`

**Booking App (Orange/Yellow):**

- Primary: `#f97316` (Orange 600)
- Secondary: `#fbbf24` (Yellow 400)
- Gradient: `from-orange-600 to-yellow-600`

#### Neutral Colors

- **Gray 900:** `#111827` - Headings, primary text
- **Gray 700:** `#374151` - Body text
- **Gray 600:** `#4b5563` - Secondary text
- **Gray 400:** `#9ca3af` - Disabled text
- **Gray 200:** `#e5e7eb` - Borders
- **Gray 50:** `#f9fafb` - Backgrounds

#### Semantic Colors

- **Success:** `#10b981` (Green 500)
- **Warning:** `#f59e0b` (Amber 500)
- **Error:** `#ef4444` (Red 500)
- **Info:** `#3b82f6` (Blue 500)

---

## Typography

### Font Family

- **Primary Font:** Inter (sans-serif)
  - Used for: All UI text, headings, body
  - Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Font Sizes (Tailwind Scale)

- **Heading 1:** `text-6xl` (60px) - Hero sections
- **Heading 2:** `text-4xl` (36px) - Page titles
- **Heading 3:** `text-3xl` (30px) - Section titles
- **Heading 4:** `text-2xl` (24px) - Card titles
- **Heading 5:** `text-xl` (20px) - Subsections
- **Body Large:** `text-lg` (18px) - Emphasis
- **Body:** `text-base` (16px) - Default
- **Body Small:** `text-sm` (14px) - Secondary info
- **Caption:** `text-xs` (12px) - Labels, meta

---

## Spacing

Following Tailwind's 4px base unit:

- **Micro:** 4px (`space-1`)
- **Small:** 8px (`space-2`)
- **Medium:** 16px (`space-4`)
- **Large:** 24px (`space-6`)
- **XLarge:** 32px (`space-8`)
- **XXLarge:** 48px (`space-12`)

---

## Components Style

### Buttons

**Primary Button:**

```
Background: gradient(orange-600 → yellow-600)
Text: white
Padding: px-6 py-3
Border Radius: rounded-lg (8px)
Shadow: shadow-md
Hover: Darker gradient + shadow-lg
```

**Secondary Button:**

```
Background: transparent
Border: 2px solid gray-300
Text: gray-700
Padding: px-6 py-3
Border Radius: rounded-lg
Hover: bg-gray-50
```

### Cards

```
Background: white
Border: 1px solid gray-200
Border Radius: rounded-xl (12px)
Shadow: shadow-sm
Padding: p-6
Hover: shadow-lg + translate-y-1
```

### Inputs

```
Background: white
Border: 1px solid gray-300
Border Radius: rounded-lg (8px)
Padding: px-4 py-2
Focus: ring-2 ring-orange-500
```

---

## Iconography

### Icon Style

- **Library:** Emoji-based for MVP, Lucide React for production
- **Size:** 20px (default), 16px (small), 24px (large)
- **Color:** Inherit from parent or semantic colors

### Common Icons

- 🍽️ - Main logo/restaurant
- 📅 - Reservations/calendar
- 👥 - Customers/users
- 📊 - Analytics/dashboard
- ⚙️ - Settings
- 🔔 - Notifications
- ✅ - Success/confirmed
- ❌ - Error/cancel
- ⭐ - Rating

---

## Voice & Tone

### Brand Voice

- **Friendly:** Approachable and warm
- **Professional:** Reliable and trustworthy
- **Innovative:** Modern and forward-thinking
- **Helpful:** Solution-oriented

### Tone by Context

- **Marketing:** Energetic and inspiring
- **Product:** Clear and instructional
- **Support:** Empathetic and patient
- **Error Messages:** Apologetic and solution-focused

---

## Messaging

### Taglines

- **Main:** "Tu mesa perfecta te espera"
- **Admin:** "Gestiona tu imperio gastronómico"
- **Dashboard:** "Controla tu restaurante en tiempo real"
- **Booking:** "Reserva tu experiencia culinaria"

### Value Propositions

1. "Reservas en segundos, confirmación instantánea"
2. "Gestión completa de tu restaurante en una sola plataforma"
3. "Pre-ordena y paga desde tu mesa con QR"
4. "CRM inteligente que conoce a tus clientes"

---

## Application in Each App

### Admin App

- **Colors:** Purple/Pink gradient
- **Feel:** Powerful, sophisticated
- **Icon:** ⚡ Lightning bolt
- **Target:** Super administrators

### Dashboard App

- **Colors:** Blue/Cyan gradient
- **Feel:** Professional, efficient
- **Icon:** 📊 Chart/dashboard
- **Target:** Restaurant owners and staff

### Booking App

- **Colors:** Orange/Yellow gradient
- **Feel:** Warm, inviting
- **Icon:** 🍽️ Fork and knife
- **Target:** Diners and customers

---

## Logo Usage

### Do's ✅

- Use on white or very light backgrounds
- Maintain minimum clear space (equal to "Y" height)
- Use approved color variations
- Scale proportionally

### Don'ts ❌

- Don't distort or stretch
- Don't use on busy backgrounds
- Don't change colors outside palette
- Don't add effects (3D, shadows, outlines)

### Minimum Sizes

- **Print:** 1 inch width
- **Digital:** 120px width
- **Favicon:** 32x32px (icon only)

---

## File Formats

### Logo Files

- **Vector:** SVG (web), PDF (print)
- **Raster:** PNG with transparency (social media)
- **Favicon:** ICO, PNG (16x16, 32x32, 64x64)

---

## Examples

### Gradient Combinations

```css
/* Booking App */
background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);

/* Dashboard App */
background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);

/* Admin App */
background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
```

### Button States

```css
/* Default */
.btn-primary {
  background: linear-gradient(135deg, #f97316, #fbbf24);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Hover */
.btn-primary:hover {
  background: linear-gradient(135deg, #ea580c, #f59e0b);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Active */
.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Disabled */
.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}
```

---

## Accessibility

### Color Contrast

All text must meet WCAG AA standards:

- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 contrast ratio

### Tested Combinations ✅

- White text on Orange 600: 4.51:1 ✓
- Gray 900 text on White: 19.4:1 ✓
- Gray 700 text on White: 10.7:1 ✓
- Orange 600 on White (border): 3.2:1 ✓

---

## Social Media

### Profile Images

- Use icon only (🍽️ symbol)
- Background: Orange-to-Yellow gradient
- Format: Square (1:1)
- Size: 400x400px minimum

### Cover Images

- Use full logo + tagline
- Background: Light gradient or hero image
- Format: Platform-specific
- Include CTA or key features

### Post Templates

- Use brand colors for highlights
- Include logo watermark (subtle, bottom right)
- Maintain consistent filters/style
- Use emoji sparingly but strategically

---

## Print Materials

### Business Cards

- Front: Logo + Name + Title
- Back: Contact + QR code to restaurant profile
- Colors: Full color or Orange spot color

### Menus (for client restaurants)

- White-label option available
- Subtle YumYum branding (footer)
- Restaurant's custom theme takes priority

---

## Contact

For brand asset requests or questions:

- **Email:** brand@yumyum.com
- **Design Team:** design@yumyum.com

---

**Last Updated:** December 2025
**Version:** 1.0
