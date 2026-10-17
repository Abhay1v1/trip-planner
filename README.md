# Trip Planner

**Less planning. More exploring.**

Trip Planner is a React application that turns a destination, travel duration, budget, and travel group into a personalized AI-generated itinerary. Discover suggested hotels and places to visit, save your plans, and return to your latest adventures from one place.

The interface uses a warm ivory, forest-green, and coral palette with responsive layouts across the homepage, trip creation, trip details, and saved-trip collection.

## Features

- **AI trip generation:** Create a day-by-day itinerary for a getaway of **1–5 days** using Google Gemini.
- **Destination search:** Find a city or destination with Google Places autocomplete.
- **Travel preferences:** Choose a budget-friendly, moderate, or luxury trip for solo travelers, couples, families, or friends.
- **Live trip summary:** Preview your choices and track completion before generating a plan.
- **Google sign-in:** Sign in to generate and save trips.
- **Hotel recommendations:** Browse suggested stays with addresses, estimated prices, ratings, and photos where available.
- **Daily itinerary:** Explore activities with suggested visit times, ticket prices, travel times, and Google Maps links.
- **Saved trips:** View your collection with the **newest created trip first** and a latest-adventure badge.
- **Trip links:** Copy a trip's URL to the clipboard; access still depends on the deployed database rules.
- **Resilient presentation:** Photo fallbacks, loading indicators, empty states, and retry controls for trip reads.
- **Responsive design:** Layouts adapt for desktop, tablet, and mobile screens.

> Itineraries, prices, ratings, and travel times are AI-generated suggestions, not verified booking information. Check availability, opening hours, and local details before traveling.

## Tech stack

| Area | Technologies |
| --- | --- |
| Application | React 18, JavaScript, Vite 6 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4, page-specific CSS, Geist font |
| UI components | Radix UI / shadcn, Lucide, React Icons, Sonner |
| AI | Google Gemini through `@google/genai` |
| Sign-in | Google OAuth through `@react-oauth/google` |
| Destination search | `react-google-places-autocomplete` |
| Photos | Google Places Text Search and Place Photos |
| Database | Firebase Cloud Firestore |
| HTTP requests | Axios |
| Deployment configuration | Vercel SPA rewrites |

## How it works

1. Open **Create Trip** and select a destination from the autocomplete results.
2. Enter 1–5 whole days, choose a budget, and select your travel group.
3. Select **Generate my trip** and sign in with Google if prompted.
4. The app builds a prompt and requests a structured JSON itinerary from Gemini.
5. The generated plan and your preferences are saved in Firestore's `AITrips` collection.
6. The trip details page displays hotels and daily activities, with photos fetched from Google Places.
7. Open **My Trips** to revisit saved plans, ordered newest first.

The current application is a client-side SPA. It calls Google services and Firestore directly; this repository does not include a backend API.

## Local setup

### Prerequisites

- Node.js **22 or later** and npm.
- A Google OAuth web client ID.
- A Gemini API key with access to the model configured in `src/service/AIModel.jsx`.
- A Google Maps Platform project configured for the APIs used by this app.
- A Firebase project with a web app and Cloud Firestore database.

API usage is subject to the providers' quotas, billing settings, and account access. No credentials are included in the setup instructions below.

### 1. Clone and install

```bash
git clone https://github.com/Abhay1v1/trip-planner.git
cd trip-planner
npm ci
```

### 2. Add environment variables

Create `.env.local` in the project root:

```dotenv
VITE_GOOGLE_AUTH_CLIENT_ID=your_google_oauth_web_client_id
VITE_GOOGLE_PLACES_API_KEY=your_google_maps_platform_api_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_api_key
```

| Variable | Used for |
| --- | --- |
| `VITE_GOOGLE_AUTH_CLIENT_ID` | Google OAuth provider and sign-in |
| `VITE_GOOGLE_PLACES_API_KEY` | Destination autocomplete, place searches, and photo URLs |
| `VITE_GOOGLE_GEMINI_AI_API_KEY` | Generating itineraries through Gemini |

`.env.local` is ignored by Git through the `*.local` rule. Restart the development server after changing environment values. Vite embeds `VITE_` values in the browser build; these variables do **not** keep credentials secret from visitors.

### 3. Configure Google sign-in

Create an OAuth client for a **Web application** and configure its consent screen and permitted users as needed. Add your local origin, normally `http://localhost:5173`, to **Authorized JavaScript origins**. Google also documents adding `http://localhost` for local testing. Add your deployed origin when hosting the app, and use the exact port printed by Vite if it differs.

Set the resulting client ID in `VITE_GOOGLE_AUTH_CLIENT_ID`. This browser flow does not use an OAuth client secret.

See Google's [OAuth web client setup guide](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid).

### 4. Configure Maps and Places

The app has two separate Places integrations:

- Destination autocomplete uses the Maps JavaScript Places library through `react-google-places-autocomplete`.
- Photo lookup uses the Places API (New) `places:searchText` endpoint and photo media URLs in `src/service/GlobalApi.jsx`.

Configure Maps JavaScript API, Places API (New), and the legacy Places access required by the installed autocomplete integration. Configure billing and API restrictions for your project, including the application origins where applicable.

The current autocomplete integration uses legacy functionality. If your Google Cloud project cannot access it, it needs a code migration to the new autocomplete integration; changing the API key alone may not resolve the issue. See Google's [legacy autocomplete documentation](https://developers.google.com/maps/documentation/javascript/legacy/place-autocomplete) and [autocomplete migration guide](https://developers.google.com/maps/documentation/javascript/legacy/places-migration-autocomplete).

### 5. Configure Gemini

Create a key following Google's [Gemini API key guide](https://ai.google.dev/gemini-api/docs/api-key) and add it to `.env.local`.

The source currently selects `gemini-3-flash-preview` in `src/service/AIModel.jsx`. Confirm that this model is available to your account; update the configured model if necessary. The service defines a JSON response schema for hotel recommendations and daily activities.

### 6. Configure Firebase

Create a Firebase project, register a web app, and provision Cloud Firestore. Replace the existing `firebaseConfig` object in `src/service/firebaseConfig.jsx` with your own web app configuration. Firebase configuration is currently stored in that file, not read from `.env.local`.

The app creates documents in `AITrips` when a trip is saved. Reads and writes must be permitted by the database's deployed security rules.

**Authentication integration is unfinished:** Google sign-in currently stores a profile in localStorage; it does not establish a Firebase Authentication session. Rules requiring `request.auth` will therefore reject these requests. For secure shared use, integrate Firebase Authentication, associate trips with the authenticated UID, and enforce ownership in Firestore rules. Do not make the database publicly writable to work around permission errors. No Firestore rules are included in this repository.

### 7. Start the app

```bash
npm run dev
```

Open the local URL printed in the terminal, normally `http://localhost:5173`.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite's development server |
| `npm run build` | Create the production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run the repository's ESLint checks |

Run `npm run build` before `npm run preview`. There is currently no `npm test` script or automated test suite configured. The presence of the lint command does not imply that all existing lint issues have been resolved.

## Routes

| Route | Page |
| --- | --- |
| `/` | Homepage and introduction |
| `/create-trip` | Travel preferences and itinerary generation |
| `/view-trip/:tripId` | Saved trip overview, hotels, and daily activities |
| `/my-trips` | Saved-trip collection, newest first |

## Project structure

```text
trip-planner/
├── public/
│   ├── favicon.svg              # Compass browser-tab icon
│   └── ...                      # Static assets
├── src/
│   ├── components/
│   │   ├── custom/              # Header, homepage hero, and their styles
│   │   └── ui/                  # Shared buttons, dialogs, inputs, and toasts
│   ├── constants/
│   │   └── options.jsx          # Budget/traveler options and AI prompt
│   ├── create-trip/             # Trip form, live summary, and save flow
│   ├── my-trips/
│   │   ├── components/          # Saved-trip cards
│   │   ├── tripOrder.js         # Newest-first sorting and legacy-date fallback
│   │   ├── index.jsx
│   │   └── MyTrips.css
│   ├── view-trip/
│   │   ├── [tripId]/index.jsx   # Fetch trip and handle loading/error states
│   │   ├── components/          # Overview, hotels, itinerary, photos, footer
│   │   └── ViewTrip.css
│   ├── service/
│   │   ├── AIModel.jsx          # Gemini model and response schema
│   │   ├── GlobalApi.jsx        # Google Places requests and photo URLs
│   │   └── firebaseConfig.jsx   # Firebase initialization and Firestore client
│   ├── lib/utils.js            # Shared class-name utility
│   ├── App.jsx                 # Homepage entry
│   ├── main.jsx                # Router and application providers
│   └── index.css               # Global styles and theme tokens
├── index.html                  # Page title, metadata, and favicon reference
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── vercel.json                 # SPA route fallback
```

## Saved-trip data

Each document in `AITrips` contains:

| Field | Contents |
| --- | --- |
| `id` | Document ID, currently generated with `Date.now().toString()` |
| `userEmail` | Email from the Google profile |
| `createdAt` | Creation date, stored as a Firestore timestamp |
| `userSelection` | Selected location, day count, budget, and traveler group |
| `TripData` | Parsed Gemini response with destination, duration, travelers, budget, hotels, and itinerary |

`TripData` uses this exact capitalization. Its `hotels` array contains hotel names, addresses, prices, ratings, descriptions, and coordinates. Its `itinerary` array contains days, each with a `plan` array of activities.

**Sorting:** My Trips queries by `userEmail`, then sorts the returned documents in the browser by `createdAt` descending. Older records without a usable creation date fall back to their timestamp-based document IDs. Records with no usable timestamp appear last. Reopening a trip does not change its order; this is creation order, not viewing history. This implementation does not add a Firestore `orderBy` query or require a new compound sorting index.

## Deployment

The repository includes a Vercel rewrite so direct visits to routes such as `/my-trips` are served through the SPA entry point.

For a Vercel deployment:

1. Import this repository and select the Vite framework preset.
2. Use `npm ci` to install dependencies and `npm run build` to build.
3. Set the output directory to `dist`.
4. Add the three environment variables listed above to the appropriate deployment environment.
5. Ensure `firebaseConfig.jsx` points to the intended Firebase project.
6. Add the deployed origin to Google OAuth configuration and update applicable Maps key restrictions.
7. Deploy, then verify sign-in, generation, saved trips, and direct-route reloads.

Environment values are embedded at build time. Rebuild/redeploy after changing them. Other static hosts need an equivalent fallback to `index.html` for client-side routes.

## Current limitations and production considerations

- **Client-side Gemini key:** Generation currently runs in the browser. Move it to an authenticated backend with rate limits before production use. Google advises against exposing Gemini keys in production clients in its [API key guidance](https://ai.google.dev/gemini-api/docs/api-key).
- **Database authorization:** A localStorage profile and an email query do not enforce ownership. Firebase Authentication and deployed security rules must provide that protection.
- **No booking or payments:** The app suggests places and links to Google Maps; it does not reserve hotels, purchase tickets, or confirm prices.
- **External service dependencies:** API access, quotas, photo availability, and network connectivity affect results. Photo failures use a neutral visual fallback.
- **No pagination yet:** My Trips fetches all matching documents and sorts them locally.
- **No edit/delete flow:** Saved trips can be viewed, but editing and deletion are not implemented.
- **Bundle size:** The production build may report a large JavaScript chunk. Route-level lazy loading and moving AI calls server-side are possible improvements.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Missing key warning or startup failure | Confirm `.env.local` is in the root, variable names match exactly, and restart Vite. |
| Google sign-in fails | Check the web client ID, authorized origin and port, consent-screen configuration, and permitted test users. |
| Destination suggestions do not appear | Check Maps/Places API access, billing, key restrictions, and compatibility with the legacy autocomplete integration. |
| Trip generation fails | Check Gemini model access, quota, API key, browser console, and Firestore save permissions. |
| Firestore reports insufficient permissions | Check deployed rules and the missing Firebase Authentication integration described above. |
| Photos are unavailable | Confirm Places API (New) access and quota; some places have no photos and will use the fallback. |
| No saved trips appear | Confirm you signed in with the email used to create them and are connected to the correct Firebase project. |
| Direct route returns 404 after deployment | Confirm the host serves the SPA entry for application routes; Vercel uses the included rewrite. |
| Old tab title or icon persists | Hard-refresh the page or reopen the tab to refresh cached assets. |

## Author

Created by **Abhay Patil**.

[GitHub repository](https://github.com/Abhay1v1/trip-planner)

## License

This repository does not currently include a license file.
