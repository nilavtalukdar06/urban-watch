# Urban Watch

A comprehensive smart city civic engagement platform that enables citizens to report urban issues, organizations to manage and resolve them, AI-powered analysis to streamline the entire process, and a Web3 token reward system to incentivize civic participation.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Application Flow](#application-flow)
- [Database Schema (ER Diagram)](#database-schema-er-diagram)
- [AI Agent Architecture](#ai-agent-architecture)
- [Web3 Token System (UWT)](#web3-token-system-uwt)
- [Bring Your Own Stripe (BYOS) Implementation](#bring-your-own-stripe-byos-implementation)
- [Vector Database & Embeddings](#vector-database--embeddings)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## 🎯 Overview

Urban Watch is a full-stack civic engagement platform that bridges the gap between citizens and organizations working to improve urban infrastructure. The platform features:

- **Citizen Portal**: Submit reports, track status, earn points and UWT tokens, view leaderboard, and chat with other citizens
- **Admin Portal**: Organizations can manage reports, assign tasks, enable payments (Stripe + crypto), and track progress
- **AI-Powered Analysis**: Automatic report analysis, spam detection, and intelligent report-to-organization matching
- **Web3 Token Rewards**: ERC-20 token (UWT) on Sepolia — citizens earn tokens for valid reports and lose tokens for spam
- **Payment Integration**: Bring Your Own Stripe (BYOS) + direct ETH crypto donations via MetaMask
- **Vector Search**: Semantic search using Pinecone to match reports with relevant organizations

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Convex (real-time)
- **Authentication**: Clerk
- **Forms**: React Hook Form + Zod
- **Chat**: Stream Chat
- **Payments**: Stripe.js
- **Web3**: Wagmi v2 + Viem (wallet connection, token balance, crypto donations)

### Backend
- **Database**: Convex (serverless backend)
- **Job Queue**: Inngest
- **Email Service**: Resend
- **Vector Database**: Pinecone
- **Embedding Model**: NVIDIA Llama-text-embedd-v2
- **Reranking**: BGE Reranker v2-m3
- **Blockchain**: Ethereum Sepolia Testnet (ERC-20)
- **Web3 Library**: ethers.js v6 (server-side token minting)

### AI/ML
- **LLM Provider**: OpenAI (GPT-4o-mini) for report analysis
- **Chatbot**: xAI (Grok-3-mini)
- **AI SDK**: Vercel AI SDK

### Infrastructure
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Secret Management**: Infisical (AWS Credential Manager compatible)
- **Deployment**: Vercel (presumed)

### Development Tools
- **TypeScript**: 5.7+
- **Linting**: ESLint
- **Code Formatting**: Prettier

## 📁 Project Structure

```
urban-watch/
├── apps/
│   ├── web/                    # Citizen-facing application
│   │   ├── app/                 # Next.js app router
│   │   │   ├── (auth)/         # Authentication routes
│   │   │   ├── (dashboard)/    # Protected dashboard routes
│   │   │   │   ├── reports/    # Report management
│   │   │   │   ├── submit-report/
│   │   │   │   ├── chatbot/    # AI assistant
│   │   │   │   ├── chat/       # User-to-user chat
│   │   │   │   ├── donate/     # Donation flow (Stripe + ETH)
│   │   │   │   └── verify-account/
│   │   │   └── api/            # API routes
│   │   │       ├── chat/       # Chatbot API
│   │   │       ├── payments/   # Payment creation
│   │   │       └── stripe/     # Stripe webhooks
│   │   ├── components/         # Shared components
│   │   ├── modules/            # Feature modules
│   │   └── lib/                # Utilities (wagmi config, UWT ABI)
│   │
│   └── admin/                  # Organization-facing application
│       ├── app/
│       │   ├── (auth)/         # Authentication
│       │   ├── (dashboard)/    # Admin dashboard
│       │   │   ├── reports/    # Report management
│       │   │   ├── my-reports/ # Organization's reports
│       │   │   ├── users/      # User management
│       │   │   ├── my-tasks/   # Task management
│       │   │   └── payments/   # Stripe + crypto wallet configuration
│       │   └── api/
│       │       └── secrets/    # Secret management
│       └── modules/             # Feature modules
│
├── packages/
│   ├── backend/                # Convex backend
│   │   └── convex/
│   │       ├── functions/      # Convex functions
│   │       │   ├── reports.ts
│   │       │   ├── users.ts
│   │       │   ├── organizations.ts
│   │       │   ├── tasks.ts
│   │       │   ├── payments.ts
│   │       │   ├── chatbot.ts
│   │       │   └── verification.ts
│   │       ├── schema.ts       # Database schema
│   │       └── auth.config.ts  # Auth configuration
│   │
│   ├── jobs/                   # Inngest job functions
│   │   └── inngest/
│   │       ├── functions/      # Job definitions
│   │       │   ├── analyze-report.ts    # Includes UWT minting
│   │       │   ├── report-resolution.ts # Includes UWT reward
│   │       │   ├── send-email.ts
│   │       │   └── verify-account.ts
│   │       ├── vercel/
│   │       │   ├── agents/     # AI agents
│   │       │   │   ├── analyze-report.ts
│   │       │   │   ├── generate-resolution-email.ts
│   │       │   │   └── verify-account.ts
│   │       │   └── prompts/    # AI prompts
│   │       ├── vectors/
│   │       │   └── pinecone.ts  # Pinecone client
│   │       └── token-service.ts # ethers.js UWT mint/burn service
│   │
│   ├── emails/                 # Email templates
│   │   └── src/
│   │       ├── report-analysis.ts
│   │       ├── verify-account.ts
│   │       └── send-email.ts
│   │
│   └── ui/                     # Shared UI components
│       └── src/
│           ├── components/     # Reusable components
│           └── lib/            # Utilities
│
├── package.json
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml
└── tsconfig.json
```

## 🏗 Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph ClientLayer["CLIENT LAYER"]
        WebApp["Citizen App (Web)<br/>- Report Submission<br/>- Dashboard<br/>- Chatbot<br/>- Leaderboard<br/>- Donations (Stripe + ETH)<br/>- UWT Token Balance"]
        AdminApp["Admin App (Admin)<br/>- Report Management<br/>- Task Management<br/>- User Management<br/>- Payment Configuration<br/>- Crypto Wallet Setup"]
    end
    
    subgraph APILayer["API LAYER (Next.js)"]
        ChatAPI["Chat API"]
        PaymentAPI["Payment API"]
        StripeWebhook["Stripe Webhook"]
    end
    
    subgraph BackendLayer["BACKEND LAYER (Convex)"]
        ConvexDB["Real-time Database & Functions<br/>- Reports<br/>- Users (walletAddress)<br/>- Organizations (walletAddress)<br/>- Tasks<br/>- Payments"]
    end
    
    subgraph JobLayer["JOB PROCESSING (Inngest)"]
        AnalyzeReport["Analyze Report<br/>+ Mint/Burn UWT"]
        ResolutionEmail["Resolution Email<br/>+ Reward UWT"]
        EmailSending["Email Sending"]
    end
    
    subgraph AILayer["AI/ML LAYER"]
        OpenAI["OpenAI<br/>(GPT-4o-mini)"]
        XAI["xAI<br/>(Grok-3-mini)"]
        Embeddings["Embeddings<br/>(NVIDIA Llama)"]
    end
    
    subgraph Web3Layer["WEB3 LAYER"]
        UWTContract["UrbanWatchToken (UWT)<br/>ERC-20 on Sepolia"]
        MetaMask["MetaMask<br/>(Wagmi v2)"]
        EthersJS["ethers.js v6<br/>(Server-side Signer)"]
    end
    
    subgraph ExternalServices["EXTERNAL SERVICES"]
        Pinecone["Pinecone<br/>(Vector DB)"]
        Infisical["Infisical<br/>(Secrets)"]
        Resend["Resend<br/>(Emails)"]
    end
    
    WebApp --> ChatAPI
    WebApp --> PaymentAPI
    WebApp --> MetaMask
    AdminApp --> StripeWebhook
    AdminApp --> MetaMask
    ChatAPI --> ConvexDB
    PaymentAPI --> ConvexDB
    StripeWebhook --> ConvexDB
    MetaMask --> UWTContract
    ConvexDB --> AnalyzeReport
    ConvexDB --> ResolutionEmail
    ConvexDB --> EmailSending
    AnalyzeReport --> OpenAI
    AnalyzeReport --> Embeddings
    AnalyzeReport --> EthersJS
    ResolutionEmail --> OpenAI
    ResolutionEmail --> EthersJS
    EthersJS --> UWTContract
    EmailSending --> Resend
    WebApp --> XAI
    AnalyzeReport --> Pinecone
    PaymentAPI --> Infisical
    StripeWebhook --> Infisical
```

## 🔄 Application Flow

### Report Submission & Analysis Flow

```mermaid
sequenceDiagram
    participant C as Citizen
    participant W as Web App
    participant Cx as Convex
    participant I as Inngest
    participant AI as AI Agent
    participant P as Pinecone
    participant BC as Blockchain (Sepolia)
    participant E as Email

    C->>W: Submit Report (image, location, notes)
    W->>Cx: createReport()
    Cx-->>W: reportId
    W->>I: Trigger "report/analyze" event
    I->>Cx: Fetch report & user data
    I->>AI: Analyze report (image + metadata)
    AI->>AI: GPT-4o-mini Analysis
    AI-->>I: Analysis result (spam, title, description, etc.)
    I->>Cx: updateReportWithAnalysis()
    alt Report is not spam
        I->>P: Upsert report embeddings
        I->>BC: mint(walletAddress, 10) → +10 UWT
        I->>Cx: Update user points (+10)
    else Report is spam
        I->>BC: burn(walletAddress, 5) → -5 UWT
        I->>Cx: Update user points (-5)
    end
    I->>E: Send analysis email to citizen
    E-->>C: Email notification
```

### Report Resolution Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant Ad as Admin App
    participant Cx as Convex
    participant I as Inngest
    participant AI as AI Agent
    participant BC as Blockchain (Sepolia)
    participant E as Email

    A->>Ad: Mark report as "resolved"
    Ad->>Cx: updateReportStatus(resolved)
    Ad->>I: Trigger "report/resolved" event
    I->>Cx: Fetch report & user data
    I->>AI: Generate resolution email
    AI->>AI: GPT-4o-mini generates email
    AI-->>I: Email content (subject + body)
    I->>BC: mint(walletAddress, 20) → +20 UWT
    I->>E: Send resolution email
    E-->>A: Email sent confirmation
```

### Crypto Donation Flow

```mermaid
sequenceDiagram
    participant C as Citizen
    participant W as Web App
    participant MM as MetaMask
    participant SC as Smart Contract (Sepolia)
    participant O as Org Wallet

    C->>W: Click "Pay in ETH" on org card
    W->>MM: Connect wallet (wagmi)
    MM-->>W: address connected
    C->>W: Enter ETH amount
    W->>MM: Sign donateTo(orgWallet) + ETH value
    MM->>SC: Transaction broadcast
    SC->>O: Forward ETH directly
    SC-->>W: CryptoDonation event emitted
    W-->>C: Confirmation + Etherscan link
```

### Organization Report Matching Flow

```mermaid
sequenceDiagram
    participant O as Organization
    participant Ad as Admin App
    participant Cx as Convex
    participant P as Pinecone

    O->>Ad: View relevant reports
    Ad->>Cx: Get organization (goal, purpose)
    Ad->>P: Search with organization context
    Note over P: Query: "Goal: X, Purpose: Y"
    Note over P: Uses NVIDIA Llama embeddings
    Note over P: Reranks with BGE Reranker
    P-->>Ad: Top 5 matching report IDs
    Ad->>Cx: Fetch report details
    Cx-->>Ad: Report data
    Ad-->>O: Display relevant reports
    O->>Ad: Accept report assignment
    Ad->>Cx: takeReport()
    Cx-->>Ad: Assignment created
```

### Payment Flow (BYOS Stripe)

```mermaid
sequenceDiagram
    participant C as Citizen
    participant W as Web App
    participant S as Stripe (Org)
    participant I as Infisical
    participant Cx as Convex

    C->>W: Initiate donation (INR)
    W->>I: Fetch org's Stripe secret key
    I-->>W: Secret key
    W->>S: Create checkout session
    S-->>W: Session URL
    W-->>C: Redirect to Stripe
    C->>S: Complete payment
    S->>W: Webhook (payment_intent.succeeded)
    W->>I: Fetch webhook secret
    W->>S: Verify webhook signature
    W->>Cx: Record donation
    Cx-->>W: Donation saved
    W-->>C: Payment confirmation
```

## 📊 Database Schema (ER Diagram)

```mermaid
erDiagram
    citizens ||--o{ userIdentity : "has"
    citizens ||--o{ reports : "submits"
    citizens ||--o{ chatbot : "uses"
    reports ||--o{ reportAssignments : "has"
    organization ||--o{ reportAssignments : "assigned_to"
    organization ||--o{ apiKeys : "has"
    organization ||--o{ tasks : "manages"
    organization ||--o{ donations : "receives"
    
    citizens {
        string _id PK
        string email
        string fullName
        string dateOfBirth
        string phoneNumber
        string permanentAddress
        number points
        string clerkUserId
        string userId
        string walletAddress "optional - MetaMask address"
    }
    
    userIdentity {
        string _id PK
        boolean isAuthorized
        string verificationStatus
        string documentType
        string notes
        string citizenId FK
    }
    
    reports {
        string _id PK
        string imageUrl
        string location
        string notes
        string title
        string description
        array instructions
        array whatNotToDo
        string priority
        string status
        boolean process
        boolean isSpam
        string inferredGoal
        string inferredPurpose
        string userId FK
    }
    
    reportAssignments {
        string _id PK
        string reportId FK
        string organizationId FK
        number similarityScore
        string status
    }
    
    organization {
        string _id PK
        string name
        string purpose
        string goal
        string organizationId
        boolean payments_enabled
        string userId
        string walletAddress "optional - ETH address for crypto donations"
    }
    
    apiKeys {
        string _id PK
        string organizationId FK
        string provider
        string keyName
        string publicKeyPrefix
        string secretKeyPrefix
        string webhookSecretPrefix
        string userId
    }
    
    tasks {
        string _id PK
        string organizationId FK
        string title
        string description
        string assignedByUserId
        string assignedToUserId
        string assigneeName
        string status
        number dueDate
    }
    
    donations {
        string _id PK
        number amount
        string donatedTo
        string status
        string stripePaymentIntentId
        string donatedBy
    }
    
    chatbot {
        string _id PK
        string role
        string content
        string userId FK
    }
```

## 🤖 AI Agent Architecture

### Report Analysis Agent

```
┌─────────────────────────────────────────────────────────────────┐
│                    REPORT ANALYSIS AGENT                         │
└─────────────────────────────────────────────────────────────────┘

Input:
  ├── Image URL (uploaded report image)
  ├── Location (geographic coordinates/address)
  └── Notes (citizen's description)

Processing Pipeline:
  │
  ├─► [Vision Analysis]
  │   └─► GPT-4o-mini with image understanding
  │       ├─► Spam Detection
  │       ├─► Issue Classification
  │       └─► Context Extraction
  │
  ├─► [Structured Output Generation]
  │   └─► Zod Schema Validation
  │       ├─► isSpam: boolean
  │       ├─► title: string | null
  │       ├─► description: string | null
  │       ├─► instructions: string[] | null
  │       ├─► whatNotToDo: string[] | null
  │       ├─► priority: "low" | "medium" | "high" | null
  │       ├─► inferredGoal: string | null
  │       ├─► inferredPurpose: string | null
  │       └─► email: { subject, body }
  │
  └─► [Post-Processing]
      ├─► Update Convex database
      ├─► Upsert to Pinecone (if not spam)
      ├─► Update user points (+10 or -5)
      ├─► Mint or burn UWT tokens
      └─► Send email notification

Output:
  └─► Structured report data + metadata
```

### Chatbot Agent

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHATBOT AGENT                              │
└─────────────────────────────────────────────────────────────────┘

Model: xAI Grok-3-mini
System Prompt: Urban Watch assistant guidelines

Capabilities:
  ├── Feature explanations
  ├── Report workflow guidance
  ├── Points & UWT token system information
  ├── Leaderboard queries
  └── Civic engagement best practices

Guardrails:
  ├── Scope limited to Urban Watch features
  ├── No political/legal/medical advice
  ├── No emergency response
  └── Redirects out-of-scope questions
```

### Vector Search Agent

```
┌─────────────────────────────────────────────────────────────────┐
│                    VECTOR SEARCH AGENT                           │
└─────────────────────────────────────────────────────────────────┘

Embedding Model: NVIDIA Llama-text-embedd-v2
Vector Database: Pinecone
Reranking Model: BGE Reranker v2-m3

Process:
  1. Organization defines goal & purpose
  2. Query: "Goal: {goal}, Purpose: {purpose}"
  3. Embed query using NVIDIA Llama-text-embedd-v2
  4. Search Pinecone index (topK=5)
  5. Rerank results using BGE Reranker
  6. Return top matching reports

Indexed Fields:
  ├── inferredGoal
  ├── inferredPurpose
  └── text (concatenated goal + purpose)
```

## 🪙 Web3 Token System (UWT)

### Overview

Urban Watch Token (UWT) is an ERC-20 token on the Ethereum Sepolia Testnet that rewards citizens for civic participation. Token operations are triggered automatically by Inngest workflows using a server-side ethers.js signer — citizens never need to sign minting transactions themselves.

### Smart Contract

```solidity
// UrbanWatchToken.sol — deployed on Sepolia via Remix IDE
contract UrbanWatchToken is ERC20, Ownable {
    constructor() ERC20("UrbanWatchToken", "UWT") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {}
    function burn(address from, uint256 amount) external onlyOwner {}
    function donateTo(address payable orgWallet) external payable {}
}
```

### Token Reward Rules

| Action | UWT Change |
|--------|-----------|
| Valid report submitted | +10 UWT |
| Report resolved by org | +20 UWT |
| Report flagged as spam | −5 UWT |

### Architecture

```
Server-side (Inngest + ethers.js v6)
  ├── Admin wallet (owner) signs all mint/burn transactions
  ├── packages/jobs/inngest/token-service.ts
  └── Called from analyze-report.ts and report-resolution.ts

Client-side (Wagmi v2 + MetaMask)
  ├── Citizens connect wallet once during onboarding
  ├── Wallet address saved to citizens.walletAddress in Convex
  ├── UWT balance displayed in citizen dashboard
  └── ETH donations sent via donateTo() on the contract
```

### Crypto Donations

Organizations register an Ethereum wallet address in the admin payments page (`CryptoWalletSetup`). Citizens can then donate ETH directly on the donations page alongside the existing Stripe (INR) option — the contract forwards ETH instantly to the org's wallet with no intermediary.

### Deployment

1. Open [Remix IDE](https://remix.ethereum.org)
2. Paste `UrbanWatchToken.sol`, compile with Solidity `^0.8.20`
3. Deploy via **Injected Provider (MetaMask)** on **Sepolia Testnet**
4. Copy deployed address → set as `NEXT_PUBLIC_UWT_CONTRACT_ADDRESS`

## 💳 Bring Your Own Stripe (BYOS) Implementation

### Architecture Overview

Urban Watch implements a multi-tenant Stripe integration where each organization brings their own Stripe account. This allows organizations to:
- Use their own Stripe account and payment processing
- Maintain full control over their payment data
- Receive payments directly to their account
- Configure their own webhooks

### Implementation Details

#### 1. Secret Storage (Infisical)

Organizations store their Stripe credentials securely using **Infisical** (AWS Credential Manager compatible):

```
Secret Naming Convention:
  - tenant_public_{organizationId}  → Stripe publishable key
  - tenant_secret_{organizationId}  → Stripe secret key
  - tenant_webhook_{organizationId}  → Stripe webhook secret
```

**Storage Flow:**
```
Admin → API Route → Infisical SDK → Create Secrets
  └─► Only key prefixes stored in Convex (for display)
  └─► Full keys stored securely in Infisical
```

#### 2. Payment Creation Flow

```typescript
// 1. Fetch organization's Stripe secret from Infisical
const secretKey = await infisical.getSecret(`tenant_secret_${orgId}`);

// 2. Initialize Stripe with organization's key
const stripe = new Stripe(secretKey.secretValue);

// 3. Create checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [...],
  mode: "payment",
  metadata: { organizationId, userId }
});
```

#### 3. Webhook Processing

```typescript
// 1. Receive webhook from Stripe
// 2. Extract organizationId from metadata
// 3. Fetch organization's webhook secret from Infisical
const webhookSecret = await infisical.getSecret(`tenant_webhook_${orgId}`);

// 4. Verify webhook signature
stripe.webhooks.constructEvent(body, signature, webhookSecret);

// 5. Process payment event
// 6. Update Convex database
```

#### 4. Security Features

- **Tenant Isolation**: Each organization's keys are isolated
- **Key Prefix Storage**: Only first 9 characters stored in Convex (for display)
- **Secure Retrieval**: Keys fetched from Infisical only when needed
- **Webhook Verification**: Each webhook verified with organization-specific secret

### Configuration UI

Organizations can:
- Add Stripe keys through admin dashboard
- View key prefixes (for verification)
- Delete keys (removes from both Convex and Infisical)
- Enable/disable payments
- Register an Ethereum wallet for crypto donations

## 🔍 Vector Database & Embeddings

### Pinecone Configuration

- **Index Name**: `urban-watch-admin`
- **Namespace**: `default`
- **Embedding Model**: NVIDIA Llama-text-embedd-v2
- **Reranking Model**: BGE Reranker v2-m3

### Embedding Process

1. **Report Analysis**: When a report is analyzed and determined to be legitimate:
   ```typescript
   const record = {
     id: reportId,
     text: `Inferred Goal: ${inferredGoal}, Inferred Purpose: ${inferredPurpose}`,
     inferredGoal: inferredGoal,
     inferredPurpose: inferredPurpose
   };
   await index.upsertRecords([record]);
   ```

2. **Vector Generation**: Pinecone automatically generates embeddings using NVIDIA Llama-text-embedd-v2 when upserting records.

3. **Search Process**:
   ```typescript
   const query = `Goal: ${orgGoal}, Purpose: ${orgPurpose}`;
   const results = await index.searchRecords({
     query: {
       topK: 5,
       inputs: { text: query }
     },
     rerank: {
       model: "bge-reranker-v2-m3",
       topN: 5,
       rankFields: ["text"]
     },
     fields: ["inferredGoal", "inferredPurpose"]
   });
   ```

### Use Cases

- **Report Matching**: Match reports to organizations based on semantic similarity
- **Relevant Reports**: Organizations see reports aligned with their goals
- **Semantic Search**: Natural language queries for finding relevant issues

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1
- Convex account
- Clerk account
- Pinecone account
- Infisical account (or AWS Credential Manager)
- OpenAI API key
- xAI API key
- Resend API key
- MetaMask wallet + Sepolia ETH (from [sepoliafaucet.com](https://sepoliafaucet.com))
- Alchemy or Infura account (for Sepolia RPC)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd urban-watch

# Install dependencies
pnpm install

# Set up Convex
cd packages/backend
pnpm dev  # Follow prompts to set up Convex
```

### Smart Contract Deployment

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create `UrbanWatchToken.sol` and paste the contract code
3. Compile with Solidity `^0.8.20`, optimisation enabled
4. Deploy via **Injected Provider (MetaMask)** on **Sepolia Testnet**
5. Copy the deployed contract address to your `.env.local`

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start specific app
pnpm --filter web dev
pnpm --filter admin dev

# Start Inngest dev server
cd packages/jobs
pnpm dev
```

## 🔐 Environment Variables

### Web App (`apps/web/.env.local`)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN_WEB=

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT_KEY=

# Infisical (Secret Management)
MACHINE_ID=
MACHINE_SECRET=
PROJECT_ID=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Stream Chat
NEXT_PUBLIC_STREAM_KEY=
STREAM_SECRET=

# xAI (Chatbot)
XAI_API_KEY=

# Web3 (UWT Token)
NEXT_PUBLIC_UWT_CONTRACT_ADDRESS=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
```

### Admin App (`apps/admin/.env.local`)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN_ADMIN=

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT_KEY=

# Infisical
MACHINE_ID=
MACHINE_SECRET=
PROJECT_ID=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Web3 (UWT Token)
NEXT_PUBLIC_UWT_CONTRACT_ADDRESS=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
```

### Backend (`packages/backend/.env`)

```env
# Convex
CONVEX_DEPLOYMENT_KEY=

# Clerk
CLERK_JWT_ISSUER_DOMAIN_WEB=
CLERK_JWT_ISSUER_DOMAIN_ADMIN=
CLERK_SECRET_KEY=
```

### Jobs (`packages/jobs/.env`)

```env
# OpenAI
OPENAI_API_KEY=

# Pinecone
PINECONE_API_KEY=

# Convex
CONVEX_URL=
CONVEX_DEPLOYMENT_KEY=

# Resend
RESEND_API_KEY=

# Web3 — server-side token minting (NEVER expose client-side)
UWT_ADMIN_PRIVATE_KEY=
NEXT_PUBLIC_UWT_CONTRACT_ADDRESS=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
```

## 📦 Deployment

### Build

```bash
pnpm build
```

### Deploy

1. **Convex**: Deploy backend functions
   ```bash
   cd packages/backend
   npx convex deploy
   ```

2. **Vercel**: Deploy Next.js apps
   - Connect repository to Vercel
   - Configure environment variables
   - Deploy web and admin apps

3. **Inngest**: Deploy job functions
   - Configure Inngest in Vercel
   - Set up event triggers

4. **Pinecone**: Create index
   - Index name: `urban-watch-admin`
   - Configure embedding model: NVIDIA Llama-text-embedd-v2

5. **Smart Contract**: Deploy via Remix IDE
   - Network: Sepolia Testnet
   - Set `NEXT_PUBLIC_UWT_CONTRACT_ADDRESS` in all env files
   - Fund admin wallet with Sepolia ETH for gas

## 📝 Key Features

### For Citizens
- ✅ Submit urban issue reports with images
- ✅ Track report status in real-time
- ✅ Earn points and UWT tokens for quality reports
- ✅ Lose tokens for spam reports (anti-abuse)
- ✅ View UWT token balance via MetaMask
- ✅ View leaderboard rankings
- ✅ Chat with other citizens
- ✅ AI-powered assistant for guidance
- ✅ Donate to organizations (INR via Stripe or ETH via MetaMask)

### For Organizations
- ✅ View and manage reports
- ✅ Semantic search for relevant reports
- ✅ Task management (Kanban & Calendar views)
- ✅ User management
- ✅ Bring Your Own Stripe integration
- ✅ Register Ethereum wallet for crypto donations
- ✅ Analytics and reporting
- ✅ Email notifications

### AI Features
- ✅ Automatic spam detection
- ✅ Report analysis and categorization
- ✅ Priority assignment
- ✅ Semantic report matching
- ✅ Resolution email generation
- ✅ Account verification assistance

### Web3 Features
- ✅ ERC-20 token rewards (UWT) on Sepolia
- ✅ Automatic server-side minting via Inngest
- ✅ Anti-spam token burning
- ✅ MetaMask wallet connection (wagmi v2)
- ✅ ETH crypto donations to organizations
- ✅ Direct wallet-to-wallet ETH transfers (no intermediary)

## 🔒 Security

- **Authentication**: Clerk-based authentication with JWT
- **Authorization**: Role-based access control (admin/member)
- **Secret Management**: Infisical for secure credential storage
- **Webhook Verification**: Stripe webhook signature validation
- **Data Isolation**: Organization-scoped data access
- **Input Validation**: Zod schema validation throughout
- **Token Security**: `UWT_ADMIN_PRIVATE_KEY` is server-only, never exposed client-side
- **Contract Security**: `onlyOwner` modifier prevents unauthorized minting

---

**Built with ❤️ for smarter cities**
