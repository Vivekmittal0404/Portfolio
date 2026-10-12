# Vivek Mittal

Full Stack Developer | React | Next.js | Node.js | TypeScript

## Admin setup

The portfolio admin uses MongoDB for messages, anonymous visitor analytics,
resume download events, and project records. Create a MongoDB Atlas database and
copy `.env.example` to `.env.local`. Keep `.env.local` private and add the same
server-only values to the deployment provider:

- `MONGODB_URI`: MongoDB connection URI for the portfolio database.
- `ADMIN_EMAIL`: the one allowed bootstrap admin email.
- `ADMIN_PASSWORD_HASH`: generate with `npm run admin:hash`; the password is
  entered in the terminal and is never stored in source code.
- When copying a generated hash into `.env.local`, keep its escaped `\$`
  separators. Next.js expands unescaped `$` references in env files and can
  corrupt the hash. In Netlify's environment settings, enter the hash normally
  without the backslashes.
- `ADMIN_SESSION_SECRET`: a random secret of at least 32 bytes. In PowerShell,
  generate one with `[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`.
- `ADMIN_DISPLAY_NAME`: optional dashboard display name.
- `WEB3FORMS_ACCESS_KEY`: optional server-side email forwarding key. Rotate the
  key previously exposed in the client-side contact form before configuring it.

On first successful login at `/admin/login`, the configured bootstrap account is
created in MongoDB. There is no public registration route. Admin sessions use
HttpOnly, SameSite=Strict cookies; all admin APIs verify the session.

## Analytics and privacy

Visitor IDs are random and scoped to a browser tab. The app does not store raw
IP addresses or infer visitor names. Location is recorded only when a trusted
hosting platform supplies approximate geo headers; unavailable fields remain
empty. Referrer paths and query strings are not stored, only the referring
domain and bounded UTM values. Contact messages are stored separately and are
not automatically linked to an analytics identity.

Visitor location is limited to approximate hosting-provided geo headers;
precise browser geolocation is not requested or stored. Contact messages remain
separate from anonymous visit records.

The admin project list is initialized from the existing portfolio projects the
first time the project manager is opened. Public projects continue to use the
current list when MongoDB is not configured, and switch to featured database
projects when it is available.
