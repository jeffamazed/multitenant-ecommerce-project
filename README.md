# Monavo

**Monavo** is a modern, multitenant e-commerce application engineered for scalable, high-performance online stores. Built with Next.js 15, React 19, and Payload CMS, Monavo enables multiple stores (tenants) to operate under a single platform, providing robust administration, flexible theming, and advanced commerce features.

---

## ✨ Features

- **Multitenancy:** Out-of-the-box tenancy support via [Payload CMS multi-tenant plugin](https://payloadcms.com/plugins/multi-tenant)
- **Modern UI:** Responsive & accessible design powered by Tailwind CSS and Shadcn
- **Robust API Layer:** Type-safe client/server APIs using [tRPC](https://trpc.io/)
- **State Management:** Lightweight and efficient with Zustand
- **E-commerce Essentials:** Product management, carts, checkout, orders, user auth, and more
- **Payments:** Seamless [Stripe](https://stripe.com/) integration for secure payments
- **Performance:** Bun for ultra-fast local development
- **Developer Experience:** Superjson, Date-fns, type-safe forms, and robust validation (Zod)
- **Animations:** Delightful interactions and transitions using animate.css and Shadcn

---

## 🛠 Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/)
- **API:** [tRPC (client & server)](https://trpc.io/)
- **CMS & Backend:** [Payload CMS](https://payloadcms.com/) (with multi-tenant plugin), MongoDB
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Payments:** [Stripe](https://stripe.com/)
- **Form Handling:** [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/)
- **Icons:** [Lucide-react](https://lucide.dev/)
- **Utilities:** [date-fns](https://date-fns.org/), [clsx](https://www.npmjs.com/package/clsx), [superjson](https://github.com/blitz-js/superjson)
- **Other:** [nuqs](https://github.com/postedin/nuqs) for query string state
- **Development:** Bun, TypeScript, Eslint, Tailwind plugins

---

## 🚀 Getting Started

### Prerequisites

- **Bun**: [Install Bun](https://bun.sh/) if you haven't already
- **MongoDB**: Ensure a MongoDB instance is running (local or cloud)
- **Node 20+/Bun**: Modern runtime required for Next.js 15 and React 19

---

### 1. Clone the repo

```bash
git clone git@github.com:jeffamazed/multitenant-ecommerce-project.git
cd multitenant-ecommerce-project
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

Copy the example env files and update variables:

```bash
cp sample.env .env
# Edit .env with your credentials (MongoDB, Stripe, etc.)
```

**Essential env variables include:**

- `MONGODB_URI`
- `PAYLOAD_SECRET`
- `STRIPE_SECRET_KEY`
- etc.

### 4. Run local development

```bash
bun run dev
```

or with `npm` (alternative, slower)

```bash
npm run dev
```

Access your app at [http://localhost:3000](http://localhost:3000)  
Payload Admin panel at [http://localhost:3000/admin](http://localhost:3000/admin)

---

### 5. Database Seed (optional)

If you want to start with some fake data:

```bash
# fresh db
bun run db:fresh
bun run db:seed
```

---

## 💡 Scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `bun run dev`       | Start dev server (Next.js + Payload CMS)  |
| `bun run build`     | Build for production                      |
| `bun run start`     | Start production server                   |
| `bun run lint`      | Lint codebase with ESLint                 |
| `bun run gen:types` | Generate Payload type definitions         |
| `bun run db:fresh`  | Fresh DB migration (drops/recreates data) |
| `bun run db:seed`   | Seed database with test/sample data       |

---

## 📝 License

[MIT](LICENSE) — © JeffAmazed

---

## 📄 Acknowledgements

- [Payload CMS](https://payloadcms.com/)
- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [Stripe](https://stripe.com/)
- [Bun](https://bun.sh/)
- [CodeWithAntonio YouTube](https://www.youtube.com/@CodeWithAntonio) — Big thanks to Antonio for the massive tutorial! Check out his youtube channel!
- And all other awesome OSS packages used.
