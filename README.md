# Heart Health Care Foundation ERP

A full-stack ERP system for a cardiac care charitable foundation. Manages patients, consultations, prescriptions, pharmacy inventory, financial assistance, donor sponsorship, and audit trails.

## Architecture

```
heart-health-care-foundation-erp/
├── backend/                          # Express + SQLite API server
│   ├── src/
│   │   ├── index.ts                  # Server entry, middleware setup
│   │   ├── config/
│   │   │   ├── env.ts                # Environment variable validation
│   │   │   ├── database.ts           # SQLite connection + schema init
│   │   │   └── seed.ts               # Initial data seeding
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT auth + role middleware
│   │   │   ├── validate.ts           # Zod request validation
│   │   │   └── audit.ts              # Audit log helper
│   │   ├── routes/                   # Express route definitions
│   │   ├── controllers/              # Request handlers
│   │   ├── services/                 # Business logic
│   │   ├── repositories/             # Data access layer (SQL)
│   │   ├── types/                    # TypeScript interfaces
│   │   └── utils/                    # ID generators, helpers
│   ├── package.json
│   └── tsconfig.json
├── frontend/                         # React + Vite SPA
│   ├── src/
│   │   ├── App.tsx                   # React Router setup
│   │   ├── main.tsx                  # React entry point
│   │   ├── store/
│   │   │   └── appStore.ts           # Zustand global state
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── components/
│   │   │   ├── layout/               # Sidebar, Header, Login, ProtectedRoute
│   │   │   ├── patients/             # PatientManager, PatientForm, PatientDetail
│   │   │   ├── dashboard/            # Dashboard with KPIs
│   │   │   └── ...                   # Other module components
│   │   └── types/                    # Frontend type definitions
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── docker/
│   ├── Dockerfile
│   └── nginx.conf
├── .github/workflows/deploy.yml      # CI/CD pipeline
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + TypeScript | UI components |
| **Routing** | React Router v6 | Client-side navigation |
| **State** | Zustand | Global state management |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Icons** | Lucide React | SVG icons |
| **Backend** | Express 4 + TypeScript | REST API server |
| **Database** | SQLite (better-sqlite3) | Persistent relational data |
| **Auth** | JWT + bcrypt | Authentication & authorization |
| **Validation** | Zod | Request body validation |
| **Security** | Helmet + express-rate-limit | HTTP security headers & rate limiting |
| **Build** | Vite (frontend) + esbuild (backend) | Bundling |
| **Testing** | Vitest | Unit & integration tests |
| **DevOps** | Docker + GitHub Actions | Containerization & CI/CD |

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..

# 2. Start development (both servers)
npm run dev

# Backend: http://localhost:3000
# Frontend: http://localhost:5173
```

## Default Login

All accounts password: `admin123`

| Username | Name | Role |
|---|---|---|
| admin | Dr. Bilal Ahmad | Admin |
| doctor | Dr. Sarah Chishti | Doctor |
| receptionist | Muhammad Ali | Receptionist |
| pharmacy | Fatima Noor | Pharmacy Staff |
| lab | Zainab Qazi | Lab Staff |

## Production Build

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Current user profile |
| GET | /api/users | Admin | List all users |
| POST | /api/users | Admin | Create user |
| GET | /api/patients | Yes | List/search patients |
| GET | /api/patients/:id | Yes | Patient full detail |
| POST | /api/patients | Yes | Register patient |
| PATCH | /api/patients/:id | Yes | Update patient |
| DELETE | /api/patients/:id | Admin | Delete patient |
| GET | /api/consultations | Yes | All consultations |
| POST | /api/consultations/patient/:id | Doctor | Create consultation |
| GET | /api/prescriptions | Yes | All prescriptions |
| POST | /api/prescriptions/patient/:id | Doctor | Create prescription |
| GET | /api/inventory | Yes | Pharmacy inventory |
| POST | /api/inventory | Pharmacy | Add medicine |
| POST | /api/inventory/prescriptions/:id/dispense | Pharmacy | Dispense medicines |
| GET | /api/assistance | Yes | Assistance requests |
| POST | /api/assistance | Yes | Submit request |
| PATCH | /api/assistance/:id | Admin | Approve/reject |
| GET | /api/donor-payments | Yes | Donor list |
| POST | /api/donor-payments | Yes | Record donation |
| GET | /api/file-requests | Yes | File requests |
| POST | /api/file-requests | Yes | Create request |
| POST | /api/file-requests/:id/action | Admin | Fulfill/reject |
| GET | /api/audit-logs | Admin | Audit trail |
| GET | /api/dashboard/stats | Yes | Dashboard KPIs |

## Enhanced Patient Profile

The patient registration includes a comprehensive socio-economic assessment:

### Basic Demographics
- Name, Father/Husband name, CNIC, DOB, Age, Gender
- Marital status, Occupation, Mobile, Address, Blood group

### Socio-Economic Assessment
- **Housing**: Status (Owned/Rented/With Family/Shelter), Type (House/Apartment/Room/Katchi Abadi), Number of rooms, Monthly rent
- **Land**: Owns land? (Y/N), Acres
- **Utilities**: Monthly electricity bill, Water source, Toilet type, Cooking fuel
- **Household Economics**: Monthly income, Number of dependents, Earning members, Education level, Employment status
- **Household Assets**: Refrigerator, Television, Personal vehicle, Computer, Internet
- **Notes**: Additional context about living situation

## Testing

```bash
cd backend && npm run test
```

## Deployment

```bash
docker compose up -d
```

## License

Apache-2.0
