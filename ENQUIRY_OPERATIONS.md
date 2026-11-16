# Enquiry delivery and recovery

The public endpoint validates the request before capture. It stores an AES-256-GCM encrypted copy before sending email. A successful 202 means the request has been captured; the response explicitly distinguishes confirmed provider acceptance from unconfirmed email delivery. It does not confirm inbox receipt or a reservation.

## Local development

Gmail credentials remain in .env.local. Run npm run check:email to verify authentication without sending a message. This environment's latest check stopped at DNS resolution (EDNS), before authentication; it does not establish whether the App Password is correct.

Localhost uses Node's built-in SQLite at .data/enquiries. The encryption key is generated privately in that directory. The directory is ignored by Git and excluded from source archives. Do not expose it through a web server or copy it into a deployable public directory.

## Public deployment

Set ENQUIRY_DATA_KEY to a stable, private 64-character hex key. Back it up securely and keep it separate from database backups. Losing it makes existing encrypted records unreadable. Do not rotate it without a migration.

On Vercel, set ENQUIRY_DATABASE_URL to a managed PostgreSQL connection URL. The application uses verified TLS and parameterized statements; the database account needs permission to create the two shining_enquiry tables at initial setup. Use the provider's supported pooler URL for serverless deployments. A live PostgreSQL connection has not been tested without credentials.

On a conventional Node server, either use PostgreSQL or set ENQUIRY_STORAGE_DIR to an absolute path on a persistent private disk. SQLite is suitable for a single server or processes on the same supported local filesystem, not independent serverless instances or an arbitrary network filesystem. Vercel cannot use this fallback. The release gate blocks missing storage/key settings.

There are no public enquiry-list, decrypt or resend endpoints. Operator access happens through the secured host shell/database administration workflow. Restrict hosting credentials and backups to authorised staff.

## Limits and idempotency

Database transactions share these limits across processes using that same database: five new enquiries per email per 15-minute fixed window, twenty total per 15-minute window and eighty per UTC day. Normalized email identifiers are keyed HMACs. Limits and lead capture commit together; rejected attempts do not call email delivery. Existing matching request IDs return the same durable reference. Changed payloads with the same key are rejected.

These application budgets protect provider quota. Add hosting-layer bot/IP rate controls before promotion; untrusted forwarding headers are not used as security identities. Public forms can still be targeted with valid-looking requests, including attempts to consume the daily allowance.

Gmail has a 20-second total send deadline and the browser waits 30 seconds. Database and hosting latency still matter. SMTP acceptance is not exactly-once inbox delivery. A process crash or timeout can leave the outcome uncertain; the saved lead remains recoverable and is not blindly resent. Resend also retains its provider idempotency header.

## Operator workflow

- npm run enquiries -- list lists references, delivery states and timestamps without printing personal details.
- npm run enquiries -- show REFERENCE explicitly decrypts the selected record to the local operator console. This command prints personal information; avoid shared logs and recordings.
- sent means the email provider accepted the message, not that the recipient read or received it.
- attention means email was not confirmed. processing means the attempt was started and may have been interrupted. Review these records and the provider/mailbox before contacting the visitor or resending anything.
- There is intentionally no automatic retry for ambiguous SMTP outcomes. The operator can recover the requirements and follow up without producing uncontrolled duplicate notifications. Assign a responsible person to monitor the queue before launch.

## Expiry and deletion

Website records expire after 30 days. Queries exclude expired records, new captures purge expired rows, and npm run enquiries -- prune performs explicit cleanup. Schedule that cleanup daily using the hosting operator's scheduler. Backups and mailbox copies need their own owner-approved retention procedure.

npm run enquiries -- delete REFERENCE removes one website record. Process the corresponding email/backup retention request separately. Do not delete a record merely to force a duplicate email resend.

The privacy page describes this technical behavior. The business must still confirm its responsible legal entity, mailbox retention, staff access and applicable processor/transfer details. No legal compliance certification is asserted.

## Gmail connection diagnosis — 17 November 2026

The OS resolver successfully resolves smtp.gmail.com. Gmail transport now uses that resolver while retaining TLS SNI and certificate validation for smtp.gmail.com; no IP address is hardcoded. Normal authenticated SMTP checks on both ports 465 and 587 were denied with EACCES before login in this execution environment. Credentials have not been rejected or verified. Run npm run check:email from an ordinary user terminal or the deployment host with approved SMTP access. No message is sent by this command. Do not disable TLS or regenerate passwords to address a network access denial.
