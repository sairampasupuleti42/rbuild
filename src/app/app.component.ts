import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type MaterialRateId = 'cement' | 'steel' | 'sand' | 'stone' | 'bricks';
type Language = 'en' | 'te';

const translations: Record<Language, Record<string, string>> = {
  en: {
    language: 'Language',
    brandTagline: 'BUILT FOR INDIAN HOMES',
    heroTitle: 'A clearer plan for your build.',
    heroCopy: 'Turn your home plans into a practical material estimate and a local budget you can take to your supplier.',
    planBudget: 'Plan your budget',
    projectSnapshot: 'PROJECT SNAPSHOT',
    builtUpArea: 'sq. ft. built-up area',
    localMarket: 'Your local market',
    project: '01 / YOUR PROJECT',
    startBasics: 'Start with the basics',
    projectCopy: 'A few details shape your material quantities.',
    city: 'City / local market',
    cityPlaceholder: 'e.g. Pune, Maharashtra',
    plotArea: 'Plot area',
    floors: 'Number of floors',
    wallMaterial: 'Wall material',
    clayOption: 'Red clay bricks',
    blockOption: 'Cement concrete blocks',
    estimatedBuiltUpArea: 'Estimated built-up area',
    materials: '02 / MATERIALS',
    materialEstimate: 'Your material estimate',
    thumbRules: 'Quick quantities based on common construction thumb rules.',
    reset: 'Reset',
    printEstimate: 'Print estimate',
    estimateDisclaimer: 'Indicative estimates only—not a construction specification. Actual requirements vary by design, soil, structural engineering, and site conditions. Consult a qualified engineer before purchasing materials.',
    localBudget: '03 / LOCAL BUDGET',
    makeEstimateYours: 'Make the estimate yours',
    supplierQuotes: 'Add supplier quotes for',
    estimateCosts: 'to estimate material costs. Rates are user-provided; prices are not fetched live.',
    estimatedTotal: 'ESTIMATED MATERIAL TOTAL',
    currentSubtotal: 'CURRENT SUBTOTAL',
    material: 'Material',
    estimatedQuantity: 'Estimated quantity',
    localRate: 'Local rate (₹)',
    estimatedCost: 'Estimated cost',
    addRate: 'Add rate',
    pendingRates: 'Add a rate for every material to complete the estimate. Total excludes labour, transport, taxes, and other construction costs.',
    completedRates: 'Material-only budget based on your rates. Confirm quantities, wastage, delivery charges, taxes, and current supplier prices before budgeting.',
    onSiteGuide: '04 / ON-SITE GUIDE',
    buildConfidence: 'Build with confidence',
    checklistIntro: 'A practical checklist to review with your contractor and structural engineer.',
    checksComplete: 'checks complete',
    bisReferences: 'BIS references:',
    checklistDisclaimer: 'This checklist is not a compliance certificate or construction specification. Follow approved drawings, local requirements, and current BIS editions; confirm site decisions and inspection/testing requirements with your qualified engineer.',
    sqFt: 'sq. ft.',
    cement: 'Cement Bags (50 kg)',
    steel: 'TMT Steel Rebars',
    sand: 'Sand (M-Sand / River Sand)',
    stone: 'Stone Aggregate (Blue Metal)',
    clayBricks: 'Red Clay Bricks',
    concreteBlocks: 'Cement Concrete Blocks',
    bindingMasonry: 'Binding & Masonry',
    rccStructure: 'RCC Structure',
    fineAggregate: 'Fine Aggregate',
    coarseAggregate: 'Coarse Aggregate (20mm / 10mm)',
    wallMasonry: 'Wall Masonry',
    bags50: 'Bags (50kg)',
    bag25Equivalent: '25kg Bag Equivalent',
    tonnes: 'Tonnes (MT)',
    kilograms: 'Kg',
    unitsBrass: 'Units (Brass / 100 cft)',
    sandTonnes: 'Tonnes',
    pieces: 'Pieces',
    thousandPieces: 'Thousand (Puri)',
    requestedMetric: 'Requested Metric',
    fe550: 'Fe550D Grade',
    cuFt: 'cu.ft',
    clayBrickBadge: '9"x4"x3" Red Brick',
    blockBadge: '16"x8"x6" Solid Block',
    cementTip: 'Covers foundation footing, columns, beams, RCC slab casting, and wall plaster.',
    steelTip: 'Mix of 8mm (stirrups), 10mm/12mm (slabs), and 16mm/20mm (pillars & beams).',
    sandTip: 'Calculated for concrete mix and 12mm/20mm internal & external wall plastering.',
    stoneTip: 'Graded crushed granite stone used for high-strength RCC structural framing.',
    clayTip: 'Standard kilned red bricks for 9" external & 4.5" partition walls.',
    blockTip: 'High-strength cement concrete masonry blocks with less mortar consumption.',
    miniLorryTrips: 'Mini-lorry / Tempo trips',
    bundledSteel: 'MT ordered in bundles',
    tipperLoadsThree: 'Tipper truck loads (3 Units/truck)',
    tipperLoads: 'Tipper truck loads',
    fullLorryLoads: 'Full lorry loads',
    planning: 'Planning and setting out',
    approvedDrawings: 'Keep current, approved architectural and structural drawings and local permissions available on site.',
    soilDesign: 'Confirm the foundation design is based on the site soil investigation; refer unexpected soil, water, or nearby-structure conditions to the engineer before proceeding.',
    siteSettingOut: 'Verify plot boundaries, building lines, grid lines, levels, and underground services against the approved drawings before excavation.',
    foundation: 'Excavation and foundation',
    excavationReview: 'Check excavation dimensions and founding stratum against the drawings; obtain the engineer’s approval before covering the foundation bed.',
    foundationRebar: 'Before the pour, check reinforcement size, spacing, laps, anchorage, cover, and formwork against structural drawings.',
    foundationRecord: 'Record concrete delivery or batch details, inspection, testing, and curing for the foundation work.',
    reinforcedConcrete: 'Reinforced concrete frame',
    materialDocuments: 'Check cement, reinforcement, and aggregate deliveries against project specifications; retain required certificates and test records.',
    rebarInspection: 'Before each pour, verify reinforcement, cover blocks, formwork dimensions and stability, and all planned sleeves or embedded services against the drawings.',
    approvedMix: 'Use the approved concrete mix and batching method; do not add water at site without authorization.',
    concretePlacement: 'Place and compact concrete using the approved method; use only approved construction-joint locations and record required fresh-concrete and strength tests.',
    concreteCuring: 'Protect and cure concrete as specified; keep curing and test records, and remove formwork only when authorized.',
    masonryWaterproofing: 'Masonry and waterproofing',
    masonryUnits: 'Check masonry units against the specified type, dimensions, condition, and required test or product documents.',
    masonryWork: 'Follow the specified mortar and unit preparation; check wall line, level, plumb, joints, openings, and lintels as work proceeds.',
    waterproofing: 'Inspect waterproofing substrate, junctions, upstands, outlets, and falls; complete the specified leak test before covering the work.',
    servicesHandover: 'Services and handover',
    concealedServices: 'Complete and record required plumbing leak/pressure tests and electrical checks before concealing pipes, wiring, or conduits.',
    finalDrainage: 'Check wet-area and roof drainage, slopes, and specified water tests before finishes and handover.',
    handoverRecords: 'Collect inspection and test records, approved changes, as-built drawings, product documents, and applicable completion or occupancy approvals.',
    perBag: 'per 50 kg bag',
    perTonne: 'per tonne',
    perUnit: 'per unit (100 cu. ft.)',
    perPiece: 'per piece'
  },
  te: {
    language: 'భాష',
    brandTagline: 'భారతీయ గృహాల కోసం',
    heroTitle: 'మీ నిర్మాణానికి స్పష్టమైన ప్రణాళిక.',
    heroCopy: 'మీ ఇంటి ప్రణాళికలను ఆచరణాత్మక మెటీరియల్ అంచనా మరియు స్థానిక బడ్జెట్‌గా మార్చుకోండి.',
    planBudget: 'బడ్జెట్ రూపొందించండి',
    projectSnapshot: 'ప్రాజెక్ట్ వివరాలు',
    builtUpArea: 'చ.అ. నిర్మిత విస్తీర్ణం',
    localMarket: 'మీ స్థానిక మార్కెట్',
    project: '01 / మీ ప్రాజెక్ట్',
    startBasics: 'ప్రాథమిక వివరాలు',
    projectCopy: 'కొన్ని వివరాలు మెటీరియల్ పరిమాణాలను నిర్ణయిస్తాయి.',
    city: 'నగరం / స్థానిక మార్కెట్',
    cityPlaceholder: 'ఉదా. విజయవాడ, ఆంధ్రప్రదేశ్',
    plotArea: 'స్థల విస్తీర్ణం',
    floors: 'అంతస్తుల సంఖ్య',
    wallMaterial: 'గోడల మెటీరియల్',
    clayOption: 'ఎర్ర మట్టి ఇటుకలు',
    blockOption: 'సిమెంట్ కాంక్రీట్ బ్లాకులు',
    estimatedBuiltUpArea: 'అంచనా నిర్మిత విస్తీర్ణం',
    materials: '02 / మెటీరియల్స్',
    materialEstimate: 'మీ మెటీరియల్ అంచనా',
    thumbRules: 'సాధారణ నిర్మాణ అంచనా పద్ధతుల ఆధారంగా పరిమాణాలు.',
    reset: 'రీసెట్',
    printEstimate: 'అంచనాను ప్రింట్ చేయండి',
    estimateDisclaimer: 'ఇవి సూచనాత్మక అంచనాలు మాత్రమే; నిర్మాణ స్పెసిఫికేషన్ కాదు. వాస్తవ అవసరాలు డిజైన్, నేల, నిర్మాణ ఇంజినీరింగ్ మరియు సైట్ పరిస్థితులపై ఆధారపడి ఉంటాయి. మెటీరియల్స్ కొనుగోలు ముందు అర్హత కలిగిన ఇంజినీర్‌ను సంప్రదించండి.',
    localBudget: '03 / స్థానిక బడ్జెట్',
    makeEstimateYours: 'మీ అంచనాను రూపొందించండి',
    supplierQuotes: 'సరఫరాదారుల ధరలను నమోదు చేయండి:',
    estimateCosts: 'మెటీరియల్ ఖర్చులను అంచనా వేయడానికి. ధరలు మీరు నమోదు చేసినవి; ప్రత్యక్ష ధరలు పొందడం లేదు.',
    estimatedTotal: 'అంచనా మెటీరియల్ మొత్తం',
    currentSubtotal: 'ప్రస్తుత ఉపమొత్తం',
    material: 'మెటీరియల్',
    estimatedQuantity: 'అంచనా పరిమాణం',
    localRate: 'స్థానిక ధర (₹)',
    estimatedCost: 'అంచనా ఖర్చు',
    addRate: 'ధర నమోదు చేయండి',
    pendingRates: 'అంచనాను పూర్తి చేయడానికి ప్రతి మెటీరియల్‌కు ధర నమోదు చేయండి. మొత్తం కార్మికులు, రవాణా, పన్నులు మరియు ఇతర నిర్మాణ ఖర్చులను కలిగి ఉండదు.',
    completedRates: 'మీ ధరల ఆధారంగా మెటీరియల్ ఖర్చు మాత్రమే. బడ్జెట్ చేయడానికి ముందు పరిమాణాలు, వృథా, డెలివరీ ఛార్జీలు, పన్నులు మరియు ప్రస్తుత సరఫరాదారు ధరలను నిర్ధారించండి.',
    onSiteGuide: '04 / సైట్ మార్గదర్శిని',
    buildConfidence: 'నమ్మకంగా నిర్మించండి',
    checklistIntro: 'మీ కాంట్రాక్టర్ మరియు స్ట్రక్చరల్ ఇంజినీర్‌తో పరిశీలించాల్సిన ప్రాయోగిక చెక్‌లిస్ట్.',
    checksComplete: 'తనిఖీలు పూర్తయ్యాయి',
    bisReferences: 'BIS సూచనలు:',
    checklistDisclaimer: 'ఈ చెక్‌లిస్ట్ అనుసరణ ధృవీకరణ పత్రం లేదా నిర్మాణ స్పెసిఫికేషన్ కాదు. ఆమోదించిన డ్రాయింగ్‌లు, స్థానిక అవసరాలు మరియు ప్రస్తుత BIS సంచికలను అనుసరించండి; సైట్ నిర్ణయాలు మరియు తనిఖీ/పరీక్ష అవసరాలను అర్హత కలిగిన ఇంజినీర్‌తో నిర్ధారించండి.',
    sqFt: 'చ.అ.',
    cement: 'సిమెంట్ సంచులు (50 కిలోలు)',
    steel: 'TMT స్టీల్ రాడ్లు',
    sand: 'ఇసుక (M-సాండ్ / నది ఇసుక)',
    stone: 'కంకర (బ్లూ మెటల్)',
    clayBricks: 'ఎర్ర మట్టి ఇటుకలు',
    concreteBlocks: 'సిమెంట్ కాంక్రీట్ బ్లాకులు',
    bindingMasonry: 'బంధన మరియు ఇటుక పని',
    rccStructure: 'RCC నిర్మాణం',
    fineAggregate: 'సన్నని కంకర',
    coarseAggregate: 'మోటు కంకర (20mm / 10mm)',
    wallMasonry: 'గోడల నిర్మాణం',
    bags50: 'సంచులు (50 కిలోలు)',
    bag25Equivalent: '25 కిలోల సంచులకు సమానం',
    tonnes: 'టన్నులు (MT)',
    kilograms: 'కిలోలు',
    unitsBrass: 'యూనిట్లు (బ్రాస్ / 100 క్యూబిక్ అడుగులు)',
    sandTonnes: 'టన్నులు',
    pieces: 'ముక్కలు',
    thousandPieces: 'వెయ్యి (పురి)',
    requestedMetric: 'అభ్యర్థించిన కొలమానం',
    fe550: 'Fe550D గ్రేడ్',
    cuFt: 'క్యూబిక్ అడుగులు',
    clayBrickBadge: '9"x4"x3" ఎర్ర ఇటుక',
    blockBadge: '16"x8"x6" ఘన బ్లాక్',
    cementTip: 'ఫౌండేషన్ ఫుటింగ్, స్తంభాలు, బీములు, RCC స్లాబ్ మరియు గోడల ప్లాస్టరింగ్‌కు.',
    steelTip: '8mm (స్టిరప్స్), 10mm/12mm (స్లాబ్‌లు), 16mm/20mm (స్తంభాలు మరియు బీములు) మిశ్రమం.',
    sandTip: 'కాంక్రీట్ మిశ్రమం మరియు లోపలి/బయటి గోడల ప్లాస్టరింగ్ కోసం అంచనా.',
    stoneTip: 'అధిక బలం గల RCC నిర్మాణానికి గ్రేడెడ్ గ్రానైట్ కంకర.',
    clayTip: 'బయటి మరియు విభజన గోడల కోసం సాధారణ కాల్చిన ఎర్ర ఇటుకలు.',
    blockTip: 'తక్కువ మోర్టార్ అవసరమయ్యే అధిక బలం గల సిమెంట్ కాంక్రీట్ బ్లాకులు.',
    miniLorryTrips: 'మినీ లారీ / టెంపో ట్రిప్పులు',
    bundledSteel: 'MT కట్టలుగా ఆర్డర్ చేయాలి',
    tipperLoadsThree: 'టిప్పర్ ట్రక్ లోడ్లు (ఒక్కో ట్రక్కుకు 3 యూనిట్లు)',
    tipperLoads: 'టిప్పర్ ట్రక్ లోడ్లు',
    fullLorryLoads: 'పూర్తి లారీ లోడ్లు',
    planning: 'ప్రణాళిక మరియు లేఅవుట్',
    approvedDrawings: 'ప్రస్తుత ఆమోదిత ఆర్కిటెక్చరల్, స్ట్రక్చరల్ డ్రాయింగ్‌లు మరియు స్థానిక అనుమతులను సైట్‌లో అందుబాటులో ఉంచండి.',
    soilDesign: 'ఫౌండేషన్ డిజైన్ సైట్ నేల పరిశీలన ఆధారంగా ఉందని నిర్ధారించండి; ఊహించని నేల, నీరు లేదా సమీప నిర్మాణాల పరిస్థితులను పనికి ముందు ఇంజినీర్‌కు తెలియజేయండి.',
    siteSettingOut: 'తవ్వకానికి ముందు స్థల సరిహద్దులు, భవన రేఖలు, గ్రిడ్ రేఖలు, లెవెల్స్ మరియు భూగర్భ సర్వీసులను ఆమోదిత డ్రాయింగ్‌లతో సరిపోల్చండి.',
    foundation: 'తవ్వకం మరియు ఫౌండేషన్',
    excavationReview: 'తవ్వకం కొలతలు మరియు పునాది నేల స్థితిని డ్రాయింగ్‌లతో సరిపోల్చండి; ఫౌండేషన్ బెడ్ కప్పే ముందు ఇంజినీర్ ఆమోదం పొందండి.',
    foundationRebar: 'కాంక్రీట్ పోయడానికి ముందు రీన్‌ఫోర్స్‌మెంట్ పరిమాణం, అంతరం, ల్యాప్స్, యాంకరింగ్, కవర్ మరియు ఫార్మ్‌వర్క్‌ను డ్రాయింగ్‌లతో పరిశీలించండి.',
    foundationRecord: 'ఫౌండేషన్ పనికి కాంక్రీట్ డెలివరీ/బ్యాచ్ వివరాలు, తనిఖీ, పరీక్షలు మరియు క్యూరింగ్‌ను నమోదు చేయండి.',
    reinforcedConcrete: 'రీన్‌ఫోర్స్‌డ్ కాంక్రీట్ ఫ్రేమ్',
    materialDocuments: 'సిమెంట్, రీన్‌ఫోర్స్‌మెంట్ మరియు కంకర సరఫరాలను ప్రాజెక్ట్ స్పెసిఫికేషన్‌లతో సరిపోల్చి అవసరమైన ధృవపత్రాలు, పరీక్ష రికార్డులు భద్రపరచండి.',
    rebarInspection: 'ప్రతి కాంక్రీట్ పోయడానికి ముందు రీన్‌ఫోర్స్‌మెంట్, కవర్ బ్లాక్‌లు, ఫార్మ్‌వర్క్ కొలతలు/స్థిరత్వం మరియు స్లీవ్‌లు లేదా ఎంబెడెడ్ సర్వీసులను డ్రాయింగ్‌లతో సరిపోల్చండి.',
    approvedMix: 'ఆమోదిత కాంక్రీట్ మిశ్రమం మరియు బ్యాచింగ్ పద్ధతిని ఉపయోగించండి; అనుమతి లేకుండా సైట్‌లో నీరు కలపవద్దు.',
    concretePlacement: 'ఆమోదిత పద్ధతిలో కాంక్రీట్ వేయండి మరియు కుదించండి; ఆమోదిత నిర్మాణ జాయింట్లనే ఉపయోగించి అవసరమైన ఫ్రెష్ కాంక్రీట్, బలం పరీక్షలను నమోదు చేయండి.',
    concreteCuring: 'స్పెసిఫికేషన్ ప్రకారం కాంక్రీట్‌ను రక్షించి క్యూర్ చేయండి; రికార్డులు ఉంచి, అనుమతి తర్వాతే ఫార్మ్‌వర్క్ తొలగించండి.',
    masonryWaterproofing: 'ఇటుక పని మరియు వాటర్‌ప్రూఫింగ్',
    masonryUnits: 'నిర్దేశించిన రకం, కొలతలు, స్థితి మరియు అవసరమైన పరీక్ష/ఉత్పత్తి పత్రాలతో మేసన్రీ యూనిట్లను పరిశీలించండి.',
    masonryWork: 'నిర్దేశించిన మోర్టార్ మరియు యూనిట్ తయారీని అనుసరించి గోడల రేఖ, లెవెల్, నిలువు స్థితి, జాయింట్లు, ఓపెనింగ్స్, లింటెల్స్‌ను పరిశీలించండి.',
    waterproofing: 'వాటర్‌ప్రూఫింగ్ ఉపరితలం, కలయికలు, అప్‌స్టాండ్స్, అవుట్‌లెట్స్ మరియు వాలులను పరిశీలించి, కప్పే ముందు నిర్దేశించిన లీక్ పరీక్ష పూర్తి చేయండి.',
    servicesHandover: 'సర్వీసులు మరియు అప్పగింత',
    concealedServices: 'పైపులు, వైర్లు లేదా కండ్యూట్లు కప్పే ముందు అవసరమైన ప్లంబింగ్ లీక్/ప్రెజర్ పరీక్షలు, ఎలక్ట్రికల్ తనిఖీలు పూర్తి చేసి నమోదు చేయండి.',
    finalDrainage: 'ఫినిషింగ్ మరియు అప్పగింతకు ముందు తడి ప్రాంతాలు, పైకప్పు డ్రైనేజ్, వాలులు మరియు నిర్దేశించిన నీటి పరీక్షలను పరిశీలించండి.',
    handoverRecords: 'తనిఖీ/పరీక్ష రికార్డులు, ఆమోదిత మార్పులు, నిర్మాణానంతర డ్రాయింగ్‌లు, ఉత్పత్తి పత్రాలు మరియు వర్తించే పూర్తి/నివాస అనుమతులను సేకరించండి.',
    perBag: '50 కిలోల సంచికి',
    perTonne: 'టన్నుకు',
    perUnit: 'యూనిట్‌కు (100 క్యూబిక్ అడుగులు)',
    perPiece: 'ముక్కకు'
  }
};

const checklistTextKeys: Record<string, string> = {
  planning: 'planning',
  'approved-drawings': 'approvedDrawings',
  'soil-design': 'soilDesign',
  'site-setting-out': 'siteSettingOut',
  foundation: 'foundation',
  'excavation-review': 'excavationReview',
  'foundation-rebar': 'foundationRebar',
  'foundation-record': 'foundationRecord',
  'reinforced-concrete': 'reinforcedConcrete',
  'material-documents': 'materialDocuments',
  'rebar-inspection': 'rebarInspection',
  'approved-mix': 'approvedMix',
  'concrete-placement': 'concretePlacement',
  'concrete-curing': 'concreteCuring',
  'masonry-waterproofing': 'masonryWaterproofing',
  'masonry-units': 'masonryUnits',
  'masonry-work': 'masonryWork',
  waterproofing: 'waterproofing',
  'services-handover': 'servicesHandover',
  'concealed-services': 'concealedServices',
  'final-drainage': 'finalDrainage',
  'handover-records': 'handoverRecords'
};

export interface MaterialItem {
  id: MaterialRateId;
  name: string;
  category: string;
  primaryQty: number;
  primaryUnit: string;
  secondaryQty: number;
  secondaryUnit: string;
  laymanVehicle: string;
  badge: string;
  icon: string;
  tip: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistPhase {
  id: string;
  title: string;
  standard?: string;
  items: ChecklistItem[];
}

interface MaterialCostLine {
  id: MaterialRateId;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  rateUnit: string;
  cost: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  language = signal<Language>('en');

  // Layman Inputs
  plotAreaSft = signal<number>(1200);
  floors = signal<number>(0);
  brickType = signal<'clay' | 'cement'>('clay');
  city = signal('');
  materialRates = signal<Record<MaterialRateId, number>>({
    cement: 0,
    steel: 0,
    sand: 0,
    stone: 0,
    bricks: 0
  });
  rateFields: { id: MaterialRateId; name: string; unit: string }[] = [
    { id: 'cement', name: 'Cement', unit: 'per 50 kg bag' },
    { id: 'steel', name: 'TMT steel', unit: 'per tonne' },
    { id: 'sand', name: 'Sand', unit: 'per unit (100 cu. ft.)' },
    { id: 'stone', name: 'Stone aggregate', unit: 'per unit (100 cu. ft.)' },
    { id: 'bricks', name: 'Bricks / blocks', unit: 'per piece' }
  ];
  checklist = signal<ChecklistPhase[]>([
    {
      id: 'planning',
      title: 'Planning and setting out',
      items: [
        { id: 'approved-drawings', text: 'Keep current, approved architectural and structural drawings and local permissions available on site.', checked: false },
        { id: 'soil-design', text: 'Confirm the foundation design is based on the site soil investigation; refer unexpected soil, water, or nearby-structure conditions to the engineer before proceeding.', checked: false },
        { id: 'site-setting-out', text: 'Verify plot boundaries, building lines, grid lines, levels, and underground services against the approved drawings before excavation.', checked: false }
      ]
    },
    {
      id: 'foundation',
      title: 'Excavation and foundation',
      items: [
        { id: 'excavation-review', text: 'Check excavation dimensions and founding stratum against the drawings; obtain the engineer’s approval before covering the foundation bed.', checked: false },
        { id: 'foundation-rebar', text: 'Before the pour, check reinforcement size, spacing, laps, anchorage, cover, and formwork against structural drawings.', checked: false },
        { id: 'foundation-record', text: 'Record concrete delivery or batch details, inspection, testing, and curing for the foundation work.', checked: false }
      ]
    },
    {
      id: 'reinforced-concrete',
      title: 'Reinforced concrete frame',
      standard: 'IS 456, IS 10262, IS 383, IS 1786',
      items: [
        { id: 'material-documents', text: 'Check cement, reinforcement, and aggregate deliveries against project specifications; retain required certificates and test records.', checked: false },
        { id: 'rebar-inspection', text: 'Before each pour, verify reinforcement, cover blocks, formwork dimensions and stability, and all planned sleeves or embedded services against the drawings.', checked: false },
        { id: 'approved-mix', text: 'Use the approved concrete mix and batching method; do not add water at site without authorization.', checked: false },
        { id: 'concrete-placement', text: 'Place and compact concrete using the approved method; use only approved construction-joint locations and record required fresh-concrete and strength tests.', checked: false },
        { id: 'concrete-curing', text: 'Protect and cure concrete as specified; keep curing and test records, and remove formwork only when authorized.', checked: false }
      ]
    },
    {
      id: 'masonry-waterproofing',
      title: 'Masonry and waterproofing',
      standard: 'IS 1077 (burnt clay bricks), IS 2185 (Part 1) (concrete masonry units)',
      items: [
        { id: 'masonry-units', text: 'Check masonry units against the specified type, dimensions, condition, and required test or product documents.', checked: false },
        { id: 'masonry-work', text: 'Follow the specified mortar and unit preparation; check wall line, level, plumb, joints, openings, and lintels as work proceeds.', checked: false },
        { id: 'waterproofing', text: 'Inspect waterproofing substrate, junctions, upstands, outlets, and falls; complete the specified leak test before covering the work.', checked: false }
      ]
    },
    {
      id: 'services-handover',
      title: 'Services and handover',
      items: [
        { id: 'concealed-services', text: 'Complete and record required plumbing leak/pressure tests and electrical checks before concealing pipes, wiring, or conduits.', checked: false },
        { id: 'final-drainage', text: 'Check wet-area and roof drainage, slopes, and specified water tests before finishes and handover.', checked: false },
        { id: 'handover-records', text: 'Collect inspection and test records, approved changes, as-built drawings, product documents, and applicable completion or occupancy approvals.', checked: false }
      ]
    }
  ]);
  translatedChecklist = computed(() => this.checklist().map(phase => ({
    ...phase,
    title: this.t(checklistTextKeys[phase.id] ?? phase.id),
    items: phase.items.map(item => ({
      ...item,
      text: this.t(checklistTextKeys[item.id] ?? item.id)
    }))
  })));
  completedChecklistItems = computed(() =>
    this.checklist().reduce((total, phase) => total + phase.items.filter(item => item.checked).length, 0)
  );
  totalChecklistItems = computed(() =>
    this.checklist().reduce((total, phase) => total + phase.items.length, 0)
  );

  // Total Slab / Built-up Area
  totalBuiltUpArea = computed(() => (this.plotAreaSft() || 0) * this.floors());

  // Calculations based on Indian Construction Standards (IS Thumb Rules)
  estimates = computed<MaterialItem[]>(() => {
    const area = this.totalBuiltUpArea();

    // 1. Cement: ~0.42 standard 50kg bags per sft
    const cement50kg = Math.round(area * 0.42);
    const cement25kg = Math.round(area * 0.84);

    // 2. Steel: ~3.8 kg per sft (0.0038 MT/sft)
    const steelKg = Math.round(area * 3.8);
    const steelTonnes = Number((steelKg / 1000).toFixed(2));

    // 3. Sand: 1.8 cft per sft (1 Unit / Brass = 100 cft ~ 4.2 Tons)
    const sandCft = Math.round(area * 1.8);
    const sandUnits = Number((sandCft / 100).toFixed(2));
    const sandTons = Number((sandUnits * 4.2).toFixed(1));

    // 4. Stone Aggregate (20mm & 10mm blue metal): 1.35 cft/sft (~4.5 Tons/unit)
    const stoneCft = Math.round(area * 1.35);
    const stoneUnits = Number((stoneCft / 100).toFixed(2));
    const stoneTons = Number((stoneUnits * 4.5).toFixed(1));

    // 5. Bricks: Clay (~8.5 nos/sft) vs Cement Concrete Blocks (~1.4 blocks/sft)
    const isClay = this.brickType() === 'clay';
    const brickCount = isClay ? Math.round(area * 8.5) : Math.round(area * 1.4);

    return [
      {
        id: 'cement',
        name: 'Cement Bags (50 kg)',
        category: 'Binding & Masonry',
        primaryQty: cement50kg,
        primaryUnit: 'Bags (50kg)',
        secondaryQty: cement25kg,
        secondaryUnit: '25kg Bag Equivalent',
        laymanVehicle: `~${Math.ceil(cement50kg / 175)} Mini-lorry / Tempo trips`,
        badge: 'Requested Metric',
        icon: '🧱',
        tip: 'Covers foundation footing, columns, beams, RCC slab casting, and wall plaster.'
      },
      {
        id: 'steel',
        name: 'TMT Steel Rebars',
        category: 'RCC Structure',
        primaryQty: steelTonnes,
        primaryUnit: 'Tonnes (MT)',
        secondaryQty: steelKg,
        secondaryUnit: 'Kg',
        laymanVehicle: `~${steelTonnes} MT ordered in bundled bundles`,
        badge: 'Fe550D Grade',
        icon: '🏗️',
        tip: 'Mix of 8mm (stirrups), 10mm/12mm (slabs), and 16mm/20mm (pillars & beams).'
      },
      {
        id: 'sand',
        name: 'Sand (M-Sand / River Sand)',
        category: 'Fine Aggregate',
        primaryQty: sandUnits,
        primaryUnit: 'Units (Brass / 100 cft)',
        secondaryQty: sandTons,
        secondaryUnit: 'Tonnes',
        laymanVehicle: `~${Math.ceil(sandUnits / 3)} Tipper Truck loads (3 Units/truck)`,
        badge: `${sandCft.toLocaleString('en-IN')} cu.ft`,
        icon: '⏳',
        tip: 'Calculated for concrete mix and 12mm/20mm internal & external wall plastering.'
      },
      {
        id: 'stone',
        name: 'Stone Aggregate (Blue Metal)',
        category: 'Coarse Aggregate (20mm / 10mm)',
        primaryQty: stoneUnits,
        primaryUnit: 'Units (Brass / 100 cft)',
        secondaryQty: stoneTons,
        secondaryUnit: 'Tonnes',
        laymanVehicle: `~${Math.ceil(stoneUnits / 3)} Tipper Truck loads`,
        badge: `${stoneCft.toLocaleString('en-IN')} cu.ft`,
        icon: '🪨',
        tip: 'Graded crushed granite stone used for high-strength RCC structural framing.'
      },
      {
        id: 'bricks',
        name: isClay ? 'Red Clay Bricks' : 'Cement Concrete Blocks',
        category: 'Wall Masonry',
        primaryQty: brickCount,
        primaryUnit: 'Pieces',
        secondaryQty: Math.ceil(brickCount / 1000),
        secondaryUnit: 'Thousand (Puri)',
        laymanVehicle: `~${Math.ceil(brickCount / (isClay ? 3000 : 800))} Full Lorry loads`,
        badge: isClay ? '9"x4"x3" Red Brick' : '16"x8"x6" Solid Block',
        icon: '🏛️',
        tip: isClay ? 'Standard kilned red bricks for 9" external & 4.5" partition walls.' : 'High-strength cement concrete masonry blocks with less mortar consumption.'
      }
    ];
  });

  translatedEstimates = computed(() => this.estimates().map(item => {
    const text = (key: string) => this.t(key);
    const quantity = item.primaryQty;
    switch (item.id) {
      case 'cement':
        return {
          ...item,
          name: text('cement'),
          category: text('bindingMasonry'),
          primaryUnit: text('bags50'),
          secondaryUnit: text('bag25Equivalent'),
          laymanVehicle: `~${Math.ceil(quantity / 175)} ${text('miniLorryTrips')}`,
          badge: text('requestedMetric'),
          tip: text('cementTip')
        };
      case 'steel':
        return {
          ...item,
          name: text('steel'),
          category: text('rccStructure'),
          primaryUnit: text('tonnes'),
          secondaryUnit: text('kilograms'),
          laymanVehicle: `~${quantity} ${text('bundledSteel')}`,
          badge: text('fe550'),
          tip: text('steelTip')
        };
      case 'sand':
        return {
          ...item,
          name: text('sand'),
          category: text('fineAggregate'),
          primaryUnit: text('unitsBrass'),
          secondaryUnit: text('sandTonnes'),
          laymanVehicle: `~${Math.ceil(quantity / 3)} ${text('tipperLoadsThree')}`,
          badge: `${Math.round(quantity * 100).toLocaleString('en-IN')} ${text('cuFt')}`,
          tip: text('sandTip')
        };
      case 'stone':
        return {
          ...item,
          name: text('stone'),
          category: text('coarseAggregate'),
          primaryUnit: text('unitsBrass'),
          secondaryUnit: text('sandTonnes'),
          laymanVehicle: `~${Math.ceil(quantity / 3)} ${text('tipperLoads')}`,
          badge: `${Math.round(quantity * 100).toLocaleString('en-IN')} ${text('cuFt')}`,
          tip: text('stoneTip')
        };
      case 'bricks':
        return {
          ...item,
          name: text(this.brickType() === 'clay' ? 'clayBricks' : 'concreteBlocks'),
          category: text('wallMasonry'),
          primaryUnit: text('pieces'),
          secondaryUnit: text('thousandPieces'),
          laymanVehicle: `~${Math.ceil(quantity / (this.brickType() === 'clay' ? 3000 : 800))} ${text('fullLorryLoads')}`,
          badge: text(this.brickType() === 'clay' ? 'clayBrickBadge' : 'blockBadge'),
          tip: text(this.brickType() === 'clay' ? 'clayTip' : 'blockTip')
        };
    }
  }));

  materialCostLines = computed<MaterialCostLine[]>(() => {
    const rates = this.materialRates();
    return this.rateFields.map(field => {
      const item = this.translatedEstimates().find(estimate => estimate.id === field.id);
      if (!item) {
        throw new Error(`Missing material estimate for ${field.id}`);
      }
      const rate = rates[field.id];
      return {
        id: field.id,
        name: item.name,
        quantity: item.primaryQty,
        unit: item.primaryUnit,
        rate,
        rateUnit: this.t(this.rateUnitKeys[field.id]),
        cost: item.primaryQty * rate
      };
    });
  });
  materialCostTotal = computed(() =>
    this.materialCostLines().reduce((total, line) => total + line.cost, 0)
  );
  allMaterialRatesEntered = computed(() =>
    Object.values(this.materialRates()).every(rate => rate > 0)
  );

  private readonly rateUnitKeys: Record<MaterialRateId, string> = {
    cement: 'perBag',
    steel: 'perTonne',
    sand: 'perUnit',
    stone: 'perUnit',
    bricks: 'perPiece'
  };

  t(key: string): string {
    return translations[this.language()][key] ?? key;
  }

  updateMaterialRate(id: MaterialRateId, value: number): void {
    const rate = Number.isFinite(value) && value >= 0 ? value : 0;
    this.materialRates.update(rates => ({ ...rates, [id]: rate }));
  }

  resetForm(): void {
    this.plotAreaSft.set(1200);
    this.floors.set(0);
    this.brickType.set('clay');
    this.city.set('');
    this.materialRates.set({ cement: 0, steel: 0, sand: 0, stone: 0, bricks: 0 });
  }

  toggleChecklistItem(phaseId: string, itemId: string): void {
    this.checklist.update(phases => phases.map(phase =>
      phase.id === phaseId
        ? { ...phase, items: phase.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item) }
        : phase
    ));
  }

  print(): void {
    window.print();
  }
}
