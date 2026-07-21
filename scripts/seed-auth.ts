/**
 * Seeds demo accounts through Better Auth's own API — never by writing raw
 * documents for the account/credential records, since Better Auth owns
 * password hashing and the account/session schema.
 *
 * This seeds:
 *  - one demo "user" account and one demo "admin" account (for the Demo
 *    Login buttons)
 *  - three "org" poster accounts (Red Crescent, Fire Service, Ocean Cleanup)
 *    whose IDs the server's mission seed script (`npm run seed` in
 *    rescuelink-server) looks up by email to use as Mission.postedBy
 *  - 100 "volunteer" accounts (volunteer.001..volunteer.100) whose IDs the
 *    server's mission seed script reads back as the volunteer signup pool
 *
 * The one exception to "never write raw documents" is promoting the admin's
 * role: Better Auth's `admin.setRole` endpoint requires an authenticated
 * admin session to call, which doesn't exist yet on a fresh DB. So for that
 * one field we update the `user` collection directly — the standard
 * bootstrap pattern for creating the very first admin.
 *
 * Requires Node 20.6+ (uses --env-file, no dotenv package needed).
 * Run with: npm run seed:auth
 */
import { MongoClient } from "mongodb";
import { auth } from "../src/lib/auth";

type DemoAccount = {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
};

const demoUser: DemoAccount = {
    name: "Demo Coordinator",
    email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "demo.user@rescuelink.org",
    password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "",
    role: "user",
};

const demoAdmin: DemoAccount = {
    name: "Demo Admin",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "demo.admin@rescuelink.org",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
    role: "admin",
};

// Fixed emails so the server's seed script can look these up predictably —
// see rescuelink-server/src/seed.ts SEED_EMAILS.
const orgPosters: DemoAccount[] = [
    { name: "Bangladesh Red Crescent", email: "org.redcrescent@rescuelink.org", password: "orgSeedPass123!", role: "user" },
    { name: "Bangladesh Fire Service", email: "org.fireservice@rescuelink.org", password: "orgSeedPass123!", role: "user" },
    { name: "Ocean Cleanup BD", email: "org.oceancleanup@rescuelink.org", password: "orgSeedPass123!", role: "user" },
];

// 100 volunteer accounts — fixed, predictable emails so the server's seed
// script can read them back as volunteer.001@rescuelink.org .. .100.
// NOTE: a single shared password across 100 accounts is fine for local/demo
// use only. If this script is ever pointed at a shared or public database,
// this needs to come from a real per-account secret instead.
const VOLUNTEER_COUNT = 100;
const VOLUNTEER_PASSWORD = process.env.NEXT_PUBLIC_SEED_VOLUNTEER_PASSWORD ?? "volunteerSeedPass123!";

const volunteerAccounts: DemoAccount[] = Array.from({ length: VOLUNTEER_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(3, "0");
    return {
        name: `Volunteer ${n}`,
        email: `volunteer.${n}@rescuelink.org`,
        password: VOLUNTEER_PASSWORD,
        role: "user",
    };
});

function isAlreadyExistsError(err: unknown): boolean {
    const message = err instanceof Error ? err.message : String(err);
    return message.toLowerCase().includes("already exist") || message.toLowerCase().includes("already registered");
}

async function ensureAccount(account: DemoAccount) {
    if (!account.password) {
        throw new Error(
            `Missing password for ${account.email}. Set NEXT_PUBLIC_DEMO_${account.role.toUpperCase()}_PASSWORD in .env.local before seeding.`
        );
    }

    try {
        await auth.api.signUpEmail({
            body: { name: account.name, email: account.email, password: account.password },
        });
        console.log(`✓ Created ${account.role} account: ${account.email}`);
    } catch (err) {
        if (isAlreadyExistsError(err)) {
            console.log(`- ${account.email} already exists, skipping creation`);
        } else {
            throw err;
        }
    }
}

// Runs a batch of accounts with limited concurrency instead of one at a time
// (100 fully-serial signUpEmail calls, each hashing a password, adds real
// time to every seed:auth run) or fully parallel (untested whether Better
// Auth's email/password provider is safe to hammer concurrently against the
// same Mongo connection).
async function ensureAccountsInBatches(accounts: DemoAccount[], batchSize = 10) {
    for (let i = 0; i < accounts.length; i += batchSize) {
        const batch = accounts.slice(i, i + batchSize);
        await Promise.all(batch.map(ensureAccount));
    }
}

async function promoteToAdmin(email: string) {
    const client = new MongoClient(process.env.MONGO_URI as string);
    try {
        await client.connect();
        const result = await client.db().collection("user").updateOne({ email }, { $set: { role: "admin" } });
        if (result.matchedCount === 0) {
            console.warn(`! Could not find a user with email ${email} to promote`);
        } else {
            console.log(`✓ Promoted ${email} to admin`);
        }
    } finally {
        await client.close();
    }
}

async function main() {
    await ensureAccount(demoUser);
    await ensureAccount(demoAdmin);
    for (const org of orgPosters) {
        await ensureAccount(org);
    }

    console.log(`\nCreating ${VOLUNTEER_COUNT} volunteer accounts...`);
    await ensureAccountsInBatches(volunteerAccounts);

    await promoteToAdmin(demoAdmin.email);
    console.log("\nDemo accounts ready. You can now use the Demo Login buttons on /login,");
    console.log("and run `npm run seed` in rescuelink-server to seed missions/testimonials.");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    });