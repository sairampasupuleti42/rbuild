# rbuild

rbuild is a browser-based construction planning tool for Indian residential
projects. It helps homeowners, contractors, and estimators turn a
text-searchable floor plan into an initial material estimate and local project
budget.

The application runs locally in the browser. Uploaded floor plans are not sent
to a server.

## Project scope

rbuild covers the early planning stage of a residential build:

- Review a house plan and identify its built-up area and number of floors
- Generate indicative quantities for the main structural and finishing
  materials
- Compare common clay-brick and concrete-block wall options
- Add local supplier rates and calculate a material-only budget
- View a concept 3D house preview based on the plan area and floor count
- Follow a phase-by-phase construction and inspection checklist
- Use the planner in English or Telugu

This is a planning aid, not an engineering, architectural, quantity-surveying,
or construction service. The output must be reviewed by a qualified engineer
and checked against approved drawings, soil conditions, structural design,
local requirements, and current supplier quotations.

## Functionality

### Floor-plan estimation

- Calculate built-up area from plot area per floor and floor count
- Read the total area statement and floor count from a text-searchable PDF
- Support square-foot and square-metre area statements
- Process image-only and unreadable plans with clear validation and manual
  fallback
- Enforce a 25 MB PDF upload limit
- Clear extracted plan data when project dimensions are changed manually

### Material quantities

- Cement in 50 kg bags and 25 kg equivalents
- TMT reinforcement in tonnes and kilograms
- Sand and stone aggregate in units and cubic feet
- Clay bricks or cement concrete blocks
- Reference values scaled from the bundled detailed estimate
- Print or save the generated estimate

### 3D house preview

- Display an architectural concept for the active floor count and footprint
- Switch between isometric, front, and side views
- Show area, footprint, and floor-count details beside the model
- Clearly identify the preview as a conceptual visualization rather than an
  approved construction drawing

### Local budget

- Add supplier rates for cement, steel, sand, stone, and wall material
- Calculate cost subtotals from estimated quantities
- Show the current subtotal until all material rates are entered
- Exclude labour, transport, taxes, wastage, and other costs unless entered
  separately

### Construction checklist

- Review planning, foundation, reinforced-concrete, masonry,
  waterproofing, services, and handover stages
- Track completed items for the current browser session
- Include relevant BIS reference categories
- Support bilingual checklist labels and guidance

### App and update experience

- Install as a Progressive Web App
- Work as a responsive browser application on desktop and mobile
- Cache navigation responses for offline fallback
- Check for deployed builds periodically
- Notify users when a new build is ready
- Let users reload immediately or dismiss the notification

## Estimation rules

The material estimates use the following indicative planning rules:

- Built-up area: searchable plan area when available; otherwise plot area per
  floor multiplied by floor count
- Cement: approximately 0.42 bags of 50 kg per square foot
- Steel: scaled from 3,887 kg of reinforcement for the 1,128 sq. ft.,
  three-floor reference project
- Sand: approximately 1.8 cubic feet per square foot
- Stone aggregate: approximately 1.35 cubic feet per square foot
- Clay bricks: scaled from 40.59 cubic metres of reference brick masonry,
  using 500 bricks per cubic metre
- Concrete blocks: approximately 1.4 pieces per square foot

The bundled `CH_Srinivas_Rao_Detailed_Estimation.pdf` is used as a reference
source for reinforcement, masonry, plaster, and construction cost scaling.
Supplier prices are never fetched automatically.

## Technology

- Browser application
- PDF processing in the browser
- Responsive desktop and mobile interface
- English and Telugu localization
- Unit-tested calculation and PDF-extraction behavior
- Service-worker navigation caching
- Firebase Hosting deployment

## Getting started

Requirements:

- Node.js 20
- npm

Install dependencies:

```bash
npm ci
```

Run the local test suite:

```bash
npm test -- --watch=false
```

Create a production build:

```bash
npm run build
```

The production output is written to `dist/rbuild/browser`. The build script
stamps the generated page with the deployment time in Asia/Kolkata.

## Deployment

Deploy the production build with the Firebase CLI:

```bash
npm run deploy
```

The deployment uses `firebase.json` and `.firebaserc`. Pushing a commit to
`main` can also build and deploy the app through the configured GitHub Actions
workflow.
