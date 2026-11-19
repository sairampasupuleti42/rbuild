# rbuild

rbuild is an Angular construction estimation application for Indian residential
projects. Upload a text-searchable house plan to estimate its built-up area and
construction quantities from the reference estimate, then add local supplier
rates for a project budget. The app also provides a construction checklist and
supports English and Telugu.

## Features

- Calculate the built-up area from plot area and floor count
- Estimate cement, TMT steel, sand, stone aggregate, clay bricks, or concrete blocks
- Enter local supplier rates and calculate an estimated material subtotal
- Switch between English and Telugu
- Generate an estimate from the area statement in a text-searchable floor-plan PDF (processed locally in the browser)
- Print or save the estimate
- Use the app as an installable Progressive Web App
- View a reference estimate based on `CH_Srinivas_Rao_Detailed_Estimation.pdf`
- Follow a phase-by-phase construction and inspection checklist

## Technology

- Angular 22 with standalone components
- TypeScript
- Angular signals and computed values
- Tailwind CSS loaded in `src/index.html`
- Vitest unit tests
- Firebase Hosting
- A service worker for navigation caching and PWA installation

## Getting started

Requirements:

- Node.js 20
- npm

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npx ng serve
```

Open `http://localhost:4200/`.

## Build and test

Run the unit tests:

```bash
npm test -- --watch=false
```

Create the production build:

```bash
npm run build
```

The build output is written to `dist/rbuild/browser`. The build script stamps
the generated `index.html` with the deployment time in Asia/Kolkata.

## Estimation behavior

The material estimates use the following indicative calculations:

- Built-up area: read from a searchable plan PDF when available; otherwise
  plot area in square feet multiplied by the number of floors
- Cement: approximately 0.42 bags of 50 kg per square foot
- Steel: scaled from 3,887 kg reinforcement for the 1,128 sq. ft.,
  three-floor reference project
- Sand: approximately 1.8 cubic feet per square foot
- Stone aggregate: approximately 1.35 cubic feet per square foot
- Clay bricks: scaled from 40.59 cubic metres of reference brick masonry,
  using 500 bricks per cubic metre
- Concrete blocks: approximately 1.4 pieces per square foot

Reference masonry, plaster, steel, and total construction cost are scaled by
built-up area using the bundled detailed estimate. Cement, sand, aggregate, and
concrete-block quantities use the planning rules above. The plan PDF is read in
the browser and is not uploaded; scanned image-only PDFs need area and floor
details entered manually.

These values are planning estimates, not construction specifications. Final
quantities and costs require a qualified engineer, approved drawings, soil and
structural analysis, and local supplier quotations.

## Firebase deployment

Deploy the production build with the Firebase CLI:

```bash
npm run deploy
```

This runs the production build and deploys `dist/rbuild/browser` to Firebase
Hosting using `.firebaserc`.

Pushing a commit to `main` also builds and deploys the app through
`.github/workflows/firebase-hosting.yml`. The workflow can also be started
manually from the Actions tab.

To enable automatic deployment, add a GitHub repository secret named
`FIREBASE_SERVICE_ACCOUNT_RBUILD`. Its value must be a Firebase service account
JSON with permission to deploy the `rbuild` Firebase project.
