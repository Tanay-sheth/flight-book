# Flight Booking Management System (FBMS)

This project is a high-performance, role-based flight booking application designed to handle complex logistics for airports, airlines, and travelers. It is built using **Next.js**, **Prisma**, **Neon (PostgreSQL)**, and **Better Auth**.

---

## 🚀 Phase 1: The Core Architect (Member A)
**Goal:** Build the "World" of the app. Without the airports and flights, the other members have nothing to display.

* **Database Schema (Prisma):** * Expand the schema to include `Airport` (IATA, City, Country), `Airlines`, `Airplane` (Model, Capacity), and `Flight` (Departure, Arrival, Base Price, Duration).
    * Implement **Enums** for `FlightStatus` (Scheduled, Delayed, Boarding, Cancelled).
* **The Seeding Script:** * Create a robust `seed.ts` file that populates the Neon DB with 20+ airports and 50+ flights. This is **critical** so the rest of the team isn't working with an empty database.
* **The Management API:** * Build the "Admin/Company" API routes to Create, Update, and Delete flights.
* **Initial Admin UI:** * Create a simple table view where a "Flight Company" user can see their flights and change their status.

---

## 🔍 Phase 2: The Search & Discovery Lead (Member B)
**Goal:** Take Member A's data and make it findable for the "Normal User."

* **Complex Search Engine:** Build a specialized API route that filters flights by:
    * Source and Destination Airports.
    * Date (handling JS Date objects to match Prisma `DateTime`).
    * Price Range and Airline filters.
* **The Search UI:** * Build a high-quality "Hero" search bar with autocompletion (using Member A's Airport list).
    * Design the **Flight Results Card**: Displaying duration, stops, price, and airline logo.
* **Role-Based Middleware:** * Set up the logic to ensure only `AIRPORT_MANAGER` can access admin routes and `USER` stays on the booking side.

---

## 💺 Phase 3: The Booking & Seat Logic Expert (Member C)
**Goal:** Turn a "Flight Result" into a "Selection." This is the most logic-heavy part.

* **Dynamic Seat Map:** * Build a UI component that renders a grid of seats (e.g., Rows 1-30, Columns A-F).
    * Logic: Map different prices to different rows (Business vs. Economy).
    * Logic: Disable seats that are already flagged as "Occupied" in the DB.
* **The Reservation Model:** * Create the `Booking` and `Passenger` tables in the Prisma schema.
* **Inventory Lockdown:** * Implement **Prisma Transactions**. When a user clicks "Book," the system must check one last time if that seat is free before proceeding, preventing two people from booking seat 12A at the same time.

---

## 💳 Phase 4: The Payment & Ticket Master (Member D)
**Goal:** Handle the "Fake Payment" and generate the proof of purchase.

* **Checkout Flow:** * Create a checkout page where users enter Passenger Details (Name, Passport/ID, Age).
* **Fake Payment Integration:** * Build a "Processing" UI (simulating a 3-second delay).
    * Update the `Booking` status from `PENDING` to `CONFIRMED` upon "success."
* **E-Ticket Generation:** * Use a library like `react-pdf` to generate a downloadable PDF.
    * Include a unique **Booking Reference (PNR)** and a QR code (can be a static image for now).
    * Ensure the ticket pulls data from Member A (Flight info) and Member C (Seat info).

---

## 🔔 Phase 5: The Notification & Dashboard Specialist (Member E)
**Goal:** Finalize the user experience and provide post-booking value.

* **The "My Trips" Dashboard:** * Build a sleek portal for the Normal User to view their upcoming and past trips.
* **Live Updates UI:** * Implement a dashboard for **Airport Managers** to see a "Live Board" of all flights at their airport (Member A's data visualized).
* **Automated Emails:** * Set up **Resend** or **Nodemailer**. When Member D finishes a booking, Member E’s logic triggers a "Thank You" email with the PDF ticket attached.
* **Final Polish:** * Global error handling (404 pages, 500 error toasts) and ensuring the app is fully responsive on mobile.

---

## 🤝 The "Pass-the-Baton" Checklist

| From | To | Deliverable |
| :--- | :--- | :--- |
| **Member A** | **Member B** | A database full of flights and an API to fetch them. |
| **Member B** | **Member C** | A UI that passes a `flightId` to a booking page. |
| **Member C** | **Member D** | A `bookingId` with selected seats ready for payment. |
| **Member D** | **Member E** | A `CONFIRMED` status in the DB to trigger UI updates. |

---

## 🚦 Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your `.env` with `DATABASE_URL` and Auth secrets.
4. Sync the schema: `npx prisma db push` (Every member must run this when starting their phase).
5. Seed the database: `npx prisma db seed`
6. Run the dev server: `npm run dev`