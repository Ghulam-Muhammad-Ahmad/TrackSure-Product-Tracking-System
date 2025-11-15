# TrackSure

TrackSure is a **multi-tenant, AI-powered product tracking system** built with a
**React + Vite client** and an **Express + Prisma + MySQL server**.

It helps organizations track products across their lifecycle using:

- Products, categories, and custom statuses
- QR codes and configurable scan pages
- Document Center with Cloudinary integration
- Activity logs & real-time notifications
- Role-based access control & tenant isolation
- Analytics dashboards
- AI chatbot (**TrackBot**) for natural-language queries

---

## Features

### Core platform

- **Multi-tenant architecture**
  - Each tenant has its own products, categories, users, roles, documents, and activity logs.
  - Tenant scoping enforced in API and database layer.

- **Authentication & User Management**
  - Email/password auth with JWT.
  - Signup, login, forgot/reset password, profile editing.
  - Username & email availability checks.
  - Multi-tenant user management (invite/manage tenant users).

- **Roles & Permissions**
  - Configurable roles per tenant with granular permissions
    (products, categories, documents, statuses, users, etc.).
  - UI to create, update, and delete roles.

### Product tracking

- **Products & Categories**
  - CRUD for products & categories.
  - Custom product statuses (Processing, Dispatch, In Stock, etc.).
  - Bulk product editing.
  - Product images uploaded to Cloudinary.

- **Statuses**
  - Dedicated `product_status` module.
  - Fully manageable status list per tenant.

- **QR Code Management**
  - Generate QR codes per product.
  - Configurable scan page:
    - Brand name
    - Logo
    - Theme colors
    - Description and layout
  - Scan events linked to tenant and product.

### Document Center

- Upload documents for products or general reference.
- Cloudinary-backed storage (images, PDFs, ZIPs, etc.).
- Folders, tags, and file type metadata.
- **Trash** support:
  - Soft delete, restore, and permanent delete.
- Dedicated document viewer for images & files.

### Analytics & Activity

- **Dashboard**
  - Total products, active users, documents count.
  - Top product status.
  - Recent products, recent documents, recent activity.
  - Products by category and status distribution charts.

- **Activity Logs**
  - Tracks key actions such as product creation, category changes,
    role updates, document uploads, etc.
  - Filterable view per tenant.

- **Notifications**
  - Real-time notifications via WebSockets.
  - Mark-as-read support.
  - Notification center integration with UI.

### AI-powered TrackBot

- Built on **@google/generative-ai (Gemini)**.
- Chat-based assistant embedded into the dashboard.
- Knows about:
  - Products and categories
  - Statuses and activity logs
  - Documents stored in the system (metadata/content)
- Use cases:
  - “List products currently In Stock”
  - “Show me recent activity for product X”
  - “Summarize the latest uploaded documents”
  - “How many products do we have this month?”

### UX & UI

- **React 19 + Vite 6** with **Tailwind CSS 4** and **shadcn-style UI** components.
- Full **dark/light mode** toggle.
- Modern table, chart, and dialog components using:
  - Radix UI
  - @tanstack/react-table
  - echarts / echarts-for-react
- Toasts & notifications via **sonner**.
- Responsive layout, sidebar navigation, and polished dashboards.

---

## Tech Stack

### Frontend (client)

- React 19, React Router DOM 7
- Vite 6
- Tailwind CSS 4 + @tailwindcss/vite
- Radix UI primitives
- shadcn-style component abstractions (in `src/components/ui`)
- ECharts for analytics
- Axios for HTTP
- WebSockets for notifications
- Cloudinary uploads (via backend proxy)
- Markdown rendering (react-markdown + remark-gfm + rehype-highlight)

### Backend (server)

- Node.js + Express
- Prisma ORM
- MySQL (via `mysql2`)
- JWT authentication
- bcryptjs for password hashing
- Multer + Cloudinary for file uploads
- Nodemailer for email flows
- WebSocket server (`ws`) for notifications
- Google Gemini via `@google/generative-ai`

---

## Project Structure

```text
tracksure/
├── client
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       │   └── ui
│       ├── config
│       ├── hooks
│       ├── lib
│       ├── pages
│       ├── providers
│       └── utils
└── server
    ├── config
    ├── controllers
    ├── middlewares
    ├── prisma
    │   └── migrations
    │       └── ... (schema history: tenants, roles, products, statuses, QR,
    │               document center, notifications, chats, trash, etc.)
    ├── routes
    ├── services
    ├── src
    │   └── generated
    │       └── prisma
    │           └── runtime
    ├── temp
    └── trackbot
````

---

## Environment Variables

### `client/.env`

```bash
VITE_CLOUDINARY_UPLOAD_URL=          # e.g. https://api.cloudinary.com/v1_1/<cloud_name>/auto/upload
VITE_CLOUDINARY_UPLOAD_PRESET=      # unsigned upload preset name
```

### `server/.env`

```bash
DATABASE_URL=                        # MySQL connection string for Prisma
FRONTEND_URL=                        # e.g. http://localhost:5173
PORT=5000                            # API port (must match client BASE_URL)
JWT_SECRET=                          # any strong secret string

EMAIL=                               # SMTP email (for password reset etc.)
EMAIL_PASS=                          # SMTP password or app password

BASE_URL=                            # public backend URL, e.g. http://localhost:5000

VITE_CLOUDINARY_UPLOAD_URL=          # same as client, used on server for uploads
VITE_CLOUDINARY_UPLOAD_PRESET=       # same as client
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=                      # Google Generative AI key for TrackBot
SQL_AGENT_TOP_K=                     # how many DB rows to fetch for AI context
```

> **Note:** Store these in separate `.env` files in `client` and `server`.
> Do **not** commit them to version control.

---

## API Base URL (client)

In `client/src/config/api.js`:

```js
const BASE_URL = "http://localhost:5000/"; // Change this if deployed

const API = {
  SIGNUP: `${BASE_URL}auth/signup`,
  LOGIN: `${BASE_URL}auth/login`,
  USER_PROFILE: `${BASE_URL}auth/profile`,
  LOGOUT: `${BASE_URL}logout`,
  VERIFYUSERNAME: `${BASE_URL}auth/verify`,
  VERIFY_EMAIL: `${BASE_URL}auth/verify-email`,
  EDIT_PROFILE: `${BASE_URL}auth/edit-profile`,
  RESET_PASSWORD: `${BASE_URL}auth/reset-password`,
  // Roles
  ADD_ROLE: `${BASE_URL}user/add-role`,
  GET_ROLES: `${BASE_URL}user/get-roles`,
  UPDATE_ROLE: `${BASE_URL}user/update-role`,
  DELETE_ROLE: `${BASE_URL}user/delete-role`,
  // Tenant users
  ADD_TANENTUSER: `${BASE_URL}user/add-tanentuser`,
  GET_TANENTUSERS: `${BASE_URL}user/get-tanentusers`,
  UPDATE_TANENTUSER: `${BASE_URL}user/update-tanentuser`,
  DELETE_TANENTUSER: `${BASE_URL}user/delete-tanentuser`,
  // Tenant categories
  ADD_TANENTCATEGORY: `${BASE_URL}categories/add-category`,
  GET_TANENTCATEGORIES: `${BASE_URL}categories/get-categories`,
  UPDATE_TANENTCATEGORY: `${BASE_URL}categories/update-category`,
  DELETE_TANENTCATEGORY: `${BASE_URL}categories/delete-category`,
  // Products
  CREATE_PRODUCT: `${BASE_URL}products/create-product`,
  GET_PRODUCTS: `${BASE_URL}products/get-products`,
  UPDATE_PRODUCT: `${BASE_URL}products/update-product`,
  DELETE_PRODUCT: `${BASE_URL}products/delete-product`,
  BULK_PRODUCT_EDIT: `${BASE_URL}products/bulk-product-update`,
  // Product Status
  ADD_STATUS: `${BASE_URL}product_status/add-status`,
  GET_STATUSES: `${BASE_URL}product_status/get-statuses`,
  UPDATE_STATUS: `${BASE_URL}product_status/update-status`,
  DELETE_STATUS: `${BASE_URL}product_status/delete-status`,
  // Activity Logs
  GET_ACTIVITYLOGS: `${BASE_URL}activity-logs/get-logs`,
  // Notifications
  NOTIFY_WS: `ws://localhost:5000`,
  NOTIFICATION_UPDATE_READ: `${BASE_URL}notifications/update-read`,
  // QR Codes
  QR_GENERATE: `${BASE_URL}qrcode/create-qr-code`,
  QR_SCAN: `${BASE_URL}qrcode/scan-qr-code`,
  QR_SCAN_CONFIG_SAVE: `${BASE_URL}qrcode/save-scan-config`,
  QR_SCAN_CONFIG_GET: `${BASE_URL}qrcode/get-scan-config`,
  // Document Center
  ADD_DOCUMENT: `${BASE_URL}docs/add-document`,
  GET_DOCUMENTS: `${BASE_URL}docs/get-documents`,
  GET_TRASH_DOCUMENTS: `${BASE_URL}docs/trash-documents`,
  UPDATE_DOCUMENT: `${BASE_URL}docs/update-document`,
  DELETE_DOCUMENT: `${BASE_URL}docs/delete-document`,
  RESTORE_DOCUMENT: `${BASE_URL}docs/restore-document`,
  PERMANENT_DELETE_DOCUMENT: `${BASE_URL}docs/permanent-delete-document`,
  ADD_FOLDER: `${BASE_URL}docs/add-folder`,
  GET_FOLDERS: `${BASE_URL}docs/get-folders`,
  GET_FOLDER_FILE_COUNTS: `${BASE_URL}docs/get-folder-file-counts`,
  UPDATE_FOLDER: `${BASE_URL}docs/update-folder`,
  DELETE_FOLDER: `${BASE_URL}docs/delete-folder`,
  // Cloudinary Upload
  UPLOAD_DOCUMENT_CLOUDINARY: `${BASE_URL}upload/document`,
  UPLOAD_PRODUCT_IMAGE_CLOUDINARY: `${BASE_URL}upload/product-image`,
  // TrackBot
  GET_CHATS: `${BASE_URL}trackbot/chats`,
  CREATE_CHAT: `${BASE_URL}trackbot/chats`,
  DELETE_CHAT: `${BASE_URL}trackbot/chats/`,
  SEND_MESSAGE: `${BASE_URL}trackbot/send-message`,
  // Dashboard Analytics
  DASHBOARD_CARDS: `${BASE_URL}dashboard/cards-data`,
  DASHBOARD_RECENT_PRODUCTS: `${BASE_URL}dashboard/recent-products`,
  DASHBOARD_RECENT_ACTIVITIES: `${BASE_URL}dashboard/recent-activities`,
  DASHBOARD_RECENT_DOCUMENTS: `${BASE_URL}dashboard/recent-documents`,
  DASHBOARD_PRODUCTS_BY_CATEGORY: `${BASE_URL}dashboard/products-by-category`,
};

export { BASE_URL, API };
```

When you deploy, update `BASE_URL` and `NOTIFY_WS` to use the production API URL.

---

## Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* npm
* MySQL instance
* Cloudinary account (for documents & product images)
* SMTP account (for password reset emails)
* Google Gemini API key (for TrackBot)

### 1. Clone & install dependencies

```bash
git clone <repo-url> tracksure
cd tracksure

# install everything and generate Prisma client
npm run install-all
```

This will:

* Install root dependencies (`concurrently`)
* Install client dependencies
* Install server dependencies & run `npx prisma generate`.

### 2. Configure environment variables

Create the following files:

* `client/.env` → set `VITE_CLOUDINARY_*`
* `server/.env` → set database / JWT / email / Cloudinary / Gemini variables as described above.

### 3. Database & Prisma

```bash
cd server

# Run migrations (creates all tables, including tenants, products, statuses, QR, docs, notifications, chats, etc.)
npx prisma migrate dev

# (Optional) Regenerate client manually if schema changes
npx prisma generate
```

You can inspect the schema and migrations in `server/prisma`.

### 4. Run in development

From the project root:

```bash
npm run dev
```

This runs:

* `npm run dev-client` → `cd client && npm run dev` (Vite dev server)
* `npm run dev-server` → `cd server && npm run dev` (Express + Prisma + WebSocket)

Default URLs:

* Client: `http://localhost:5173`
* API: `http://localhost:5000`

You can also run them separately if needed:

```bash
# Client
cd client
npm run dev

# Server
cd server
npm run dev
```

---

## Building for Production

### Client

```bash
cd client
npm run build
```

This creates a production build in `client/dist`.
You can serve this folder via any static host or configure the server to serve it.

### Server

```bash
cd server
npm start
```

Make sure you set `NODE_ENV=production` and all required environment variables on your hosting platform.

---

## Scripts Reference

### Root `package.json`

* `npm run dev` – run client and server concurrently.
* `npm run dev-client` – run only the Vite dev server.
* `npm run dev-server` – run only the Express server.
* `npm run install-all` – install dependencies for root, client, and server.
* `npm run install-client` – install client deps.
* `npm run install-server` – install server deps & generate Prisma client.

### Client

* `npm run dev` – Vite dev server.
* `npm run build` – build React app.
* `npm run preview` – preview production build.
* `npm run lint` – run ESLint.

### Server

* `npm run dev` – run migrations, generate Prisma client, then start server with nodemon.
* `npm start` – start server (production).
* `npm test` – placeholder.

---

## Multi-Tenant Model (High-Level)

* **Tenant** model identifies each organization.
* Core entities are linked to a tenant:

  * Users, roles, categories, products, statuses, documents, activity logs, notifications, chats.
* Middleware reads tenant ID from authenticated user/session and scopes all queries accordingly.
* Activity and notification records include tenant metadata to keep audit trails separate.

---

## AI TrackBot (High-Level)

* Located under `server/trackbot` and integrated via `/trackbot` routes.
* Uses:

  * Prisma to pull structured data (products, statuses, docs metadata, activity logs).
  * Gemini (`@google/generative-ai`) to generate answers.
* Chat history is stored in dedicated tables (`chats`, `chat_messages`) with tenant linkage.
* Frontend provides a chat UI embedded in the dashboard that interacts with these APIs.

---

## License

This project is licensed under the **ISC** License.
See the `LICENSE` file (or package metadata) for details.

---

Happy tracking with **TrackSure** 🚗📦📊🤖