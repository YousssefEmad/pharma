/**
 * PHARMA LINK — Seeded Demo Dataset (stable IDs, realistic Egyptian pharma)
 */
window.DemoData = (function () {
  function daysFromNow(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  function isoDaysAgo(n) {
    return daysAgo(n);
  }

  const PRODUCTS = [
    { id: 'PRD-001', nameAr: 'أوجمنتين 1 جم', nameEn: 'Augmentin 1g', scientific: 'Amoxicillin/Clavulanate', ingredient: 'أموكسيسيلين/كلافولانات', strength: '1g', form: 'أقراص', formEn: 'Tablet', pack: '14 قرص', barcode: '6224000123001', code: 'AUG-1G-14', manufacturer: 'جلاكسو سميث كلاين', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 145, sellPrice: 168 },
    { id: 'PRD-002', nameAr: 'كونكور 5 مجم', nameEn: 'Concor 5mg', scientific: 'Bisoprolol', ingredient: 'بيزوبرولول', strength: '5mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123002', code: 'CON-5-30', manufacturer: 'ميرك', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 68, sellPrice: 82 },
    { id: 'PRD-003', nameAr: 'كونكور 10 مجم', nameEn: 'Concor 10mg', scientific: 'Bisoprolol', ingredient: 'بيزوبرولول', strength: '10mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123003', code: 'CON-10-30', manufacturer: 'ميرك', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 95, sellPrice: 112 },
    { id: 'PRD-004', nameAr: 'ليبيتور 20 مجم', nameEn: 'Lipitor 20mg', scientific: 'Atorvastatin', ingredient: 'أتورفاستاتين', strength: '20mg', form: 'أقراص', formEn: 'Tablet', pack: '28 قرص', barcode: '6224000123004', code: 'LIP-20-28', manufacturer: 'فايزر', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 210, sellPrice: 245 },
    { id: 'PRD-005', nameAr: 'بلاتكس 75 مجم', nameEn: 'Plavix 75mg', scientific: 'Clopidogrel', ingredient: 'كلوبيدوجريل', strength: '75mg', form: 'أقراص', formEn: 'Tablet', pack: '28 قرص', barcode: '6224000123005', code: 'PLA-75-28', manufacturer: 'سانوفي', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 320, sellPrice: 365 },
    { id: 'PRD-006', nameAr: 'جلوكوفاج 850 مجم', nameEn: 'Glucophage 850mg', scientific: 'Metformin', ingredient: 'ميتفورمين', strength: '850mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123006', code: 'GLU-850-30', manufacturer: 'ميرك', category: 'سكري', unit: 'علبة', purchasePrice: 42, sellPrice: 52 },
    { id: 'PRD-007', nameAr: 'جانوفيا 100 مجم', nameEn: 'Januvia 100mg', scientific: 'Sitagliptin', ingredient: 'سيتاغلبتين', strength: '100mg', form: 'أقراص', formEn: 'Tablet', pack: '28 قرص', barcode: '6224000123007', code: 'JAN-100-28', manufacturer: 'ام اس دي', category: 'سكري', unit: 'علبة', purchasePrice: 380, sellPrice: 425 },
    { id: 'PRD-008', nameAr: 'نوفورابيد فليكس بن', nameEn: 'NovoRapid FlexPen', scientific: 'Insulin aspart', ingredient: 'إنسولين أسبارت', strength: '100U/ml', form: 'قلم', formEn: 'Pen', pack: '5 أقلام', barcode: '6224000123008', code: 'NOV-FP-5', manufacturer: 'نوفو نورديسك', category: 'سكري', unit: 'علبة', purchasePrice: 520, sellPrice: 580 },
    { id: 'PRD-009', nameAr: 'بانادول إكسترا', nameEn: 'Panadol Extra', scientific: 'Paracetamol/Caffeine', ingredient: 'باراسيتامول/كافيين', strength: '500/65mg', form: 'أقراص', formEn: 'Tablet', pack: '24 قرص', barcode: '6224000123009', code: 'PAN-EX-24', manufacturer: 'جلاكسو', category: 'مسكنات', unit: 'علبة', purchasePrice: 28, sellPrice: 35 },
    { id: 'PRD-010', nameAr: 'بروفين 600 مجم', nameEn: 'Brufen 600mg', scientific: 'Ibuprofen', ingredient: 'أيبوبروفين', strength: '600mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123010', code: 'BRU-600-30', manufacturer: 'أبوت', category: 'مسكنات', unit: 'علبة', purchasePrice: 55, sellPrice: 68 },
    { id: 'PRD-011', nameAr: 'كاتافلام 50 مجم', nameEn: 'Cataflam 50mg', scientific: 'Diclofenac', ingredient: 'ديكلوفيناك', strength: '50mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123011', code: 'CAT-50-20', manufacturer: 'نوفارتس', category: 'مسكنات', unit: 'علبة', purchasePrice: 48, sellPrice: 58 },
    { id: 'PRD-012', nameAr: 'نيوروروبين', nameEn: 'Neurobion', scientific: 'Vitamins B1/B6/B12', ingredient: 'فيتامينات ب', strength: '—', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123012', code: 'NEU-20', manufacturer: 'ميرك', category: 'فيتامينات', unit: 'علبة', purchasePrice: 62, sellPrice: 75 },
    { id: 'PRD-013', nameAr: 'فيتامين د3 5000 وحدة', nameEn: 'Vitamin D3 5000IU', scientific: 'Cholecalciferol', ingredient: 'كوليكالسيفيرول', strength: '5000IU', form: 'كبسولات', formEn: 'Capsule', pack: '60 كبسولة', barcode: '6224000123013', code: 'VD3-5K-60', manufacturer: 'مالتى فارما', category: 'فيتامينات', unit: 'علبة', purchasePrice: 95, sellPrice: 115 },
    { id: 'PRD-014', nameAr: 'أوميبرازول 20 مجم', nameEn: 'Omeprazole 20mg', scientific: 'Omeprazole', ingredient: 'أوميبرازول', strength: '20mg', form: 'كبسولات', formEn: 'Capsule', pack: '14 كبسولة', barcode: '6224000123014', code: 'OME-20-14', manufacturer: 'إيبيكو', category: 'جهاز هضمي', unit: 'علبة', purchasePrice: 35, sellPrice: 45 },
    { id: 'PRD-015', nameAr: 'نكسيوم 40 مجم', nameEn: 'Nexium 40mg', scientific: 'Esomeprazole', ingredient: 'إيسوميبرازول', strength: '40mg', form: 'أقراص', formEn: 'Tablet', pack: '14 قرص', barcode: '6224000123015', code: 'NEX-40-14', manufacturer: 'أسترازينيكا', category: 'جهاز هضمي', unit: 'علبة', purchasePrice: 185, sellPrice: 210 },
    { id: 'PRD-016', nameAr: 'موتيليوم 10 مجم', nameEn: 'Motilium 10mg', scientific: 'Domperidone', ingredient: 'دومبيريدون', strength: '10mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123016', code: 'MOT-10-30', manufacturer: 'جانسن', category: 'جهاز هضمي', unit: 'علبة', purchasePrice: 58, sellPrice: 70 },
    { id: 'PRD-017', nameAr: 'كلاريثرومايسين 500 مجم', nameEn: 'Clarithromycin 500mg', scientific: 'Clarithromycin', ingredient: 'كلاريثرومايسين', strength: '500mg', form: 'أقراص', formEn: 'Tablet', pack: '14 قرص', barcode: '6224000123017', code: 'CLA-500-14', manufacturer: 'أبوت', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 120, sellPrice: 145 },
    { id: 'PRD-018', nameAr: 'زيثرومكس 500 مجم', nameEn: 'Zithromax 500mg', scientific: 'Azithromycin', ingredient: 'أزيثروميسين', strength: '500mg', form: 'أقراص', formEn: 'Tablet', pack: '3 أقراص', barcode: '6224000123018', code: 'ZIT-500-3', manufacturer: 'فايزر', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 78, sellPrice: 95 },
    { id: 'PRD-019', nameAr: 'سيبروفلوكساسين 500 مجم', nameEn: 'Ciprofloxacin 500mg', scientific: 'Ciprofloxacin', ingredient: 'سيبروفلوكساسين', strength: '500mg', form: 'أقراص', formEn: 'Tablet', pack: '10 أقراص', barcode: '6224000123019', code: 'CIP-500-10', manufacturer: 'إيبيكو', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 45, sellPrice: 55 },
    { id: 'PRD-020', nameAr: 'تافانيك 500 مجم', nameEn: 'Tavanic 500mg', scientific: 'Levofloxacin', ingredient: 'ليفوفلوكساسين', strength: '500mg', form: 'أقراص', formEn: 'Tablet', pack: '5 أقراص', barcode: '6224000123020', code: 'TAV-500-5', manufacturer: 'سانوفي', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 110, sellPrice: 130 },
    { id: 'PRD-021', nameAr: 'فنتولين إيفوهالر', nameEn: 'Ventolin Evohaler', scientific: 'Salbutamol', ingredient: 'سالبوتامول', strength: '100mcg', form: 'بخاخ', formEn: 'Inhaler', pack: '200 جرعة', barcode: '6224000123021', code: 'VEN-EVO', manufacturer: 'جلاكسو', category: 'جهاز تنفسي', unit: 'علبة', purchasePrice: 95, sellPrice: 115 },
    { id: 'PRD-022', nameAr: 'سيريتايد 250', nameEn: 'Seretide 250', scientific: 'Salmeterol/Fluticasone', ingredient: 'سالميترول/فلوتوكازون', strength: '250/25', form: 'بخاخ', formEn: 'Inhaler', pack: '120 جرعة', barcode: '6224000123022', code: 'SER-250', manufacturer: 'جلاكسو', category: 'جهاز تنفسي', unit: 'علبة', purchasePrice: 280, sellPrice: 320 },
    { id: 'PRD-023', nameAr: 'كلاريتين 10 مجم', nameEn: 'Clarityn 10mg', scientific: 'Loratadine', ingredient: 'لوراتادين', strength: '10mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123023', code: 'CLA-10-20', manufacturer: 'باير', category: 'حساسية', unit: 'علبة', purchasePrice: 48, sellPrice: 58 },
    { id: 'PRD-024', nameAr: 'تلفاست 180 مجم', nameEn: 'Telfast 180mg', scientific: 'Fexofenadine', ingredient: 'فيكسوفينادين', strength: '180mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123024', code: 'TEL-180-20', manufacturer: 'سانوفي', category: 'حساسية', unit: 'علبة', purchasePrice: 85, sellPrice: 98 },
    { id: 'PRD-025', nameAr: 'بريدنيزولون 5 مجم', nameEn: 'Prednisolone 5mg', scientific: 'Prednisolone', ingredient: 'بريدنيزولون', strength: '5mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123025', code: 'PRE-5-20', manufacturer: 'إيبيكو', category: 'كورتيزون', unit: 'علبة', purchasePrice: 18, sellPrice: 25 },
    { id: 'PRD-026', nameAr: 'ديبروساليك مرهم', nameEn: 'Diprosalic Ointment', scientific: 'Betamethasone/Salicylic', ingredient: 'بيتاميثازون/ساليسيليك', strength: '—', form: 'مرهم', formEn: 'Ointment', pack: '30 جم', barcode: '6224000123026', code: 'DIP-SAL-30', manufacturer: 'شيرانج', category: 'جلدية', unit: 'أنبوبة', purchasePrice: 72, sellPrice: 88 },
    { id: 'PRD-027', nameAr: 'فيوسيدين كريم', nameEn: 'Fucidin Cream', scientific: 'Fusidic acid', ingredient: 'حمض الفيوسيديك', strength: '2%', form: 'كريم', formEn: 'Cream', pack: '15 جم', barcode: '6224000123027', code: 'FUC-15', manufacturer: 'ليو فارما', category: 'جلدية', unit: 'أنبوبة', purchasePrice: 65, sellPrice: 78 },
    { id: 'PRD-028', nameAr: 'أورسوفالك 250 مجم', nameEn: 'Ursofalk 250mg', scientific: 'Ursodeoxycholic acid', ingredient: 'أورسوديوكسيكوليك', strength: '250mg', form: 'كبسولات', formEn: 'Capsule', pack: '100 كبسولة', barcode: '6224000123028', code: 'URS-250-100', manufacturer: 'د. فالك', category: 'كبد', unit: 'علبة', purchasePrice: 420, sellPrice: 480 },
    { id: 'PRD-029', nameAr: 'لاكتيلوز شراب', nameEn: 'Lactulose Syrup', scientific: 'Lactulose', ingredient: 'لاكتيلوز', strength: '667mg/ml', form: 'شراب', formEn: 'Syrup', pack: '300 مل', barcode: '6224000123029', code: 'LAC-300', manufacturer: 'إيبيكو', category: 'جهاز هضمي', unit: 'زجاجة', purchasePrice: 38, sellPrice: 48 },
    { id: 'PRD-030', nameAr: 'فلاجيل 500 مجم', nameEn: 'Flagyl 500mg', scientific: 'Metronidazole', ingredient: 'ميترونيدازول', strength: '500mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123030', code: 'FLA-500-20', manufacturer: 'سانوفي', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 32, sellPrice: 42 },
    { id: 'PRD-031', nameAr: 'كليكسان 40 مجم', nameEn: 'Clexane 40mg', scientific: 'Enoxaparin', ingredient: 'إينوكسابارين', strength: '40mg', form: 'حقن', formEn: 'Injection', pack: '2 سرنجة', barcode: '6224000123031', code: 'CLE-40-2', manufacturer: 'سانوفي', category: 'مضادات تخثر', unit: 'علبة', purchasePrice: 185, sellPrice: 210 },
    { id: 'PRD-032', nameAr: 'أسبرين بروتكت 100', nameEn: 'Aspirin Protect 100', scientific: 'Acetylsalicylic acid', ingredient: 'أسبرين', strength: '100mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123032', code: 'ASP-100-30', manufacturer: 'باير', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 45, sellPrice: 55 },
    { id: 'PRD-033', nameAr: 'كوزار 50 مجم', nameEn: 'Cozaar 50mg', scientific: 'Losartan', ingredient: 'لوزارتان', strength: '50mg', form: 'أقراص', formEn: 'Tablet', pack: '28 قرص', barcode: '6224000123033', code: 'COZ-50-28', manufacturer: 'ام اس دي', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 125, sellPrice: 145 },
    { id: 'PRD-034', nameAr: 'نورفاسك 5 مجم', nameEn: 'Norvasc 5mg', scientific: 'Amlodipine', ingredient: 'أملوديبين', strength: '5mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123034', code: 'NOR-5-30', manufacturer: 'فايزر', category: 'قلب وأوعية', unit: 'علبة', purchasePrice: 88, sellPrice: 105 },
    { id: 'PRD-035', nameAr: 'زولوفت 50 مجم', nameEn: 'Zoloft 50mg', scientific: 'Sertraline', ingredient: 'سيرترالين', strength: '50mg', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123035', code: 'ZOL-50-30', manufacturer: 'فايزر', category: 'نفسية', unit: 'علبة', purchasePrice: 165, sellPrice: 190 },
    { id: 'PRD-036', nameAr: 'سيبراليكس 10 مجم', nameEn: 'Cipralex 10mg', scientific: 'Escitalopram', ingredient: 'إسسيتالوبرام', strength: '10mg', form: 'أقراص', formEn: 'Tablet', pack: '28 قرص', barcode: '6224000123036', code: 'CIP-10-28', manufacturer: 'لوندبيك', category: 'نفسية', unit: 'علبة', purchasePrice: 195, sellPrice: 225 },
    { id: 'PRD-037', nameAr: 'ليريكا 75 مجم', nameEn: 'Lyrica 75mg', scientific: 'Pregabalin', ingredient: 'بريجابالين', strength: '75mg', form: 'كبسولات', formEn: 'Capsule', pack: '56 كبسولة', barcode: '6224000123037', code: 'LYR-75-56', manufacturer: 'فايزر', category: 'أعصاب', unit: 'علبة', purchasePrice: 310, sellPrice: 355 },
    { id: 'PRD-038', nameAr: 'نيورونتين 300 مجم', nameEn: 'Neurontin 300mg', scientific: 'Gabapentin', ingredient: 'جابابنتين', strength: '300mg', form: 'كبسولات', formEn: 'Capsule', pack: '30 كبسولة', barcode: '6224000123038', code: 'NEU-300-30', manufacturer: 'فايزر', category: 'أعصاب', unit: 'علبة', purchasePrice: 140, sellPrice: 165 },
    { id: 'PRD-039', nameAr: 'تامسولين 0.4 مجم', nameEn: 'Tamsulin 0.4mg', scientific: 'Tamsulosin', ingredient: 'تامسولوسين', strength: '0.4mg', form: 'كبسولات', formEn: 'Capsule', pack: '30 كبسولة', barcode: '6224000123039', code: 'TAM-04-30', manufacturer: 'أستيلاس', category: 'مسالك بولية', unit: 'علبة', purchasePrice: 95, sellPrice: 112 },
    { id: 'PRD-040', nameAr: 'سياليس 20 مجم', nameEn: 'Cialis 20mg', scientific: 'Tadalafil', ingredient: 'تادالافيل', strength: '20mg', form: 'أقراص', formEn: 'Tablet', pack: '4 أقراص', barcode: '6224000123040', code: 'CIA-20-4', manufacturer: 'إيلي ليلي', category: 'مسالك بولية', unit: 'علبة', purchasePrice: 280, sellPrice: 320 },
    { id: 'PRD-041', nameAr: 'ديفلوكان 150 مجم', nameEn: 'Diflucan 150mg', scientific: 'Fluconazole', ingredient: 'فلوكونازول', strength: '150mg', form: 'كبسولات', formEn: 'Capsule', pack: '1 كبسولة', barcode: '6224000123041', code: 'DIF-150-1', manufacturer: 'فايزر', category: 'مضادات فطريات', unit: 'علبة', purchasePrice: 55, sellPrice: 68 },
    { id: 'PRD-042', nameAr: 'زوفيركس 400 مجم', nameEn: 'Zovirax 400mg', scientific: 'Aciclovir', ingredient: 'أسيكلوفير', strength: '400mg', form: 'أقراص', formEn: 'Tablet', pack: '25 قرص', barcode: '6224000123042', code: 'ZOV-400-25', manufacturer: 'جلاكسو', category: 'مضادات فيروسات', unit: 'علبة', purchasePrice: 95, sellPrice: 115 },
    { id: 'PRD-043', nameAr: 'أموكسيل 500 مجم', nameEn: 'Amoxil 500mg', scientific: 'Amoxicillin', ingredient: 'أموكسيسيلين', strength: '500mg', form: 'كبسولات', formEn: 'Capsule', pack: '16 كبسولة', barcode: '6224000123043', code: 'AMO-500-16', manufacturer: 'جلاكسو', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 38, sellPrice: 48 },
    { id: 'PRD-044', nameAr: 'هايبيوتك 1 جم', nameEn: 'Hibiotic 1g', scientific: 'Amoxicillin/Clavulanate', ingredient: 'أموكسيسيلين/كلافولانات', strength: '1g', form: 'أقراص', formEn: 'Tablet', pack: '14 قرص', barcode: '6224000123044', code: 'HIB-1G-14', manufacturer: 'أمون', category: 'مضادات حيوية', unit: 'علبة', purchasePrice: 98, sellPrice: 118 },
    { id: 'PRD-045', nameAr: 'سولبادين فوار', nameEn: 'Solpadeine Effervescent', scientific: 'Paracetamol/Codeine/Caffeine', ingredient: 'باراسيتامول/كودايين', strength: '—', form: 'فوار', formEn: 'Effervescent', pack: '12 قرص', barcode: '6224000123045', code: 'SOL-EFF-12', manufacturer: 'جلاكسو', category: 'مسكنات', unit: 'علبة', purchasePrice: 42, sellPrice: 52 },
    { id: 'PRD-046', nameAr: 'رانتيدين 150 مجم', nameEn: 'Ranitidine 150mg', scientific: 'Ranitidine', ingredient: 'رانتيدين', strength: '150mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123046', code: 'RAN-150-20', manufacturer: 'إيبيكو', category: 'جهاز هضمي', unit: 'علبة', purchasePrice: 22, sellPrice: 30 },
    { id: 'PRD-047', nameAr: 'سبازموفري', nameEn: 'Spasmofree', scientific: 'Tiemonium', ingredient: 'تيمونيوم', strength: '50mg', form: 'أقراص', formEn: 'Tablet', pack: '20 قرص', barcode: '6224000123047', code: 'SPA-50-20', manufacturer: 'فايزر', category: 'جهاز هضمي', unit: 'علبة', purchasePrice: 35, sellPrice: 45 },
    { id: 'PRD-048', nameAr: 'أدفيل شراب أطفال', nameEn: 'Advil Kids Syrup', scientific: 'Ibuprofen', ingredient: 'أيبوبروفين', strength: '100mg/5ml', form: 'شراب', formEn: 'Syrup', pack: '100 مل', barcode: '6224000123048', code: 'ADV-SYR-100', manufacturer: 'فايزر', category: 'مسكنات', unit: 'زجاجة', purchasePrice: 48, sellPrice: 58 },
    { id: 'PRD-049', nameAr: 'أوجمنتين شراب 156', nameEn: 'Augmentin Syrup 156', scientific: 'Amoxicillin/Clavulanate', ingredient: 'أموكسيسيلين/كلافولانات', strength: '156mg/5ml', form: 'شراب', formEn: 'Syrup', pack: '80 مل', barcode: '6224000123049', code: 'AUG-SYR-156', manufacturer: 'جلاكسو', category: 'مضادات حيوية', unit: 'زجاجة', purchasePrice: 55, sellPrice: 68 },
    { id: 'PRD-050', nameAr: 'كالسيوم سانداس', nameEn: 'Calcium Sandoz', scientific: 'Calcium', ingredient: 'كالسيوم', strength: '500mg', form: 'فوار', formEn: 'Effervescent', pack: '20 قرص', barcode: '6224000123050', code: 'CAL-SAN-20', manufacturer: 'ساندوز', category: 'فيتامينات', unit: 'علبة', purchasePrice: 58, sellPrice: 72 },
    { id: 'PRD-051', nameAr: 'ماجنيزيوم ب6', nameEn: 'Magnesium B6', scientific: 'Magnesium/B6', ingredient: 'ماغنسيوم/ب6', strength: '—', form: 'أقراص', formEn: 'Tablet', pack: '30 قرص', barcode: '6224000123051', code: 'MAG-B6-30', manufacturer: 'سانوفي', category: 'فيتامينات', unit: 'علبة', purchasePrice: 72, sellPrice: 88 },
    { id: 'PRD-052', nameAr: 'أورسوديول 300 مجم', nameEn: 'Ursodiol 300mg', scientific: 'Ursodeoxycholic acid', ingredient: 'أورسوديوكسيكوليك', strength: '300mg', form: 'كبسولات', formEn: 'Capsule', pack: '30 كبسولة', barcode: '6224000123052', code: 'URS-300-30', manufacturer: 'مالتى فارما', category: 'كبد', unit: 'علبة', purchasePrice: 165, sellPrice: 190 }
  ];

  function generate() {
    const orgs = [
      { id: 'ORG-PLT', nameAr: 'فارما لينك', nameEn: 'Pharma Link', type: 'platform', status: 'active', city: 'القاهرة', plan: 'enterprise' },
      { id: 'ORG-B01', nameAr: 'مخازن النيل للدواء', nameEn: 'Nile Pharma Warehouse', type: 'buyer', status: 'active', city: 'القاهرة', plan: 'professional', verified: true },
      { id: 'ORG-B02', nameAr: 'مجموعة الدلتا الطبية', nameEn: 'Delta Medical Group', type: 'buyer', status: 'active', city: 'الإسكندرية', plan: 'basic', verified: true },
      { id: 'ORG-B03', nameAr: 'صيدليات الحياة الكبرى', nameEn: 'Al-Hayat Mega Pharmacy', type: 'buyer', status: 'active', city: 'الجيزة', plan: 'professional', verified: true },
      { id: 'ORG-B04', nameAr: 'مخزن مصر للأدوية', nameEn: 'Misr Pharma Store', type: 'buyer', status: 'pending_verification', city: 'المنصورة', plan: 'trial', verified: false },
      { id: 'ORG-B05', nameAr: 'مؤسسة الشفاء للتوزيع', nameEn: 'Al-Shifa Distribution', type: 'buyer', status: 'active', city: 'أسيوط', plan: 'basic', verified: true },
      { id: 'ORG-S01', nameAr: 'شركة المتحدة للتوريدات', nameEn: 'United Supplies Co.', type: 'supplier', status: 'active', city: 'القاهرة', plan: 'professional', verified: true, rating: 4.7, responseRate: 94, onTimeRate: 91 },
      { id: 'ORG-S02', nameAr: 'فارما تريد مصر', nameEn: 'Pharma Trade Egypt', type: 'supplier', status: 'active', city: 'القاهرة', plan: 'enterprise', verified: true, rating: 4.5, responseRate: 88, onTimeRate: 86 },
      { id: 'ORG-S03', nameAr: 'توزيعات المعادي الطبية', nameEn: 'Maadi Medical Dist.', type: 'supplier', status: 'active', city: 'القاهرة', plan: 'professional', verified: true, rating: 4.2, responseRate: 82, onTimeRate: 89 },
      { id: 'ORG-S04', nameAr: 'شركة الأهرام للدواء', nameEn: 'Al-Ahram Pharma', type: 'supplier', status: 'active', city: 'الجيزة', plan: 'basic', verified: true, rating: 4.0, responseRate: 76, onTimeRate: 80 },
      { id: 'ORG-S05', nameAr: 'ميديكال سوبلاي النيل', nameEn: 'Nile Medical Supply', type: 'supplier', status: 'active', city: 'الإسكندرية', plan: 'professional', verified: true, rating: 4.6, responseRate: 91, onTimeRate: 93 },
      { id: 'ORG-S06', nameAr: 'توكيلات الدلتا فارما', nameEn: 'Delta Pharma Agency', type: 'supplier', status: 'active', city: 'طنطا', plan: 'basic', verified: true, rating: 3.9, responseRate: 70, onTimeRate: 75 },
      { id: 'ORG-S07', nameAr: 'مجموعة الصحراء الطبية', nameEn: 'Sahara Medical Group', type: 'supplier', status: 'pending_verification', city: 'الفيوم', plan: 'trial', verified: false, rating: 0, responseRate: 0, onTimeRate: 0 },
      { id: 'ORG-S08', nameAr: 'توريدات سيناء للصحة', nameEn: 'Sinai Health Supplies', type: 'supplier', status: 'active', city: 'الإسماعيلية', plan: 'basic', verified: true, rating: 4.1, responseRate: 78, onTimeRate: 82 },
      { id: 'ORG-S09', nameAr: 'شركة النور للتوزيع الدوائي', nameEn: 'Al-Noor Pharma Dist.', type: 'supplier', status: 'active', city: 'القاهرة', plan: 'professional', verified: true, rating: 4.4, responseRate: 85, onTimeRate: 88 },
      { id: 'ORG-S10', nameAr: 'مصر فارما للتوريدات', nameEn: 'Misr Pharma Supplies', type: 'supplier', status: 'suspended', city: 'بورسعيد', plan: 'basic', verified: true, rating: 3.2, responseRate: 55, onTimeRate: 60 }
    ];

    const warehouses = [
      { id: 'WH-B01-A', orgId: 'ORG-B01', nameAr: 'مخزن النيل الرئيسي', nameEn: 'Nile Main Warehouse', type: 'buyer', city: 'القاهرة' },
      { id: 'WH-B01-B', orgId: 'ORG-B01', nameAr: 'فرع مدينة نصر', nameEn: 'Nasr City Branch', type: 'buyer', city: 'القاهرة' },
      { id: 'WH-B02-A', orgId: 'ORG-B02', nameAr: 'مخزن الدلتا', nameEn: 'Delta Warehouse', type: 'buyer', city: 'الإسكندرية' },
      { id: 'WH-B03-A', orgId: 'ORG-B03', nameAr: 'مخزن الحياة', nameEn: 'Al-Hayat Warehouse', type: 'buyer', city: 'الجيزة' },
      { id: 'WH-B05-A', orgId: 'ORG-B05', nameAr: 'مخزن الشفاء', nameEn: 'Al-Shifa Warehouse', type: 'buyer', city: 'أسيوط' },
      { id: 'WH-S01-A', orgId: 'ORG-S01', nameAr: 'مستودع المتحدة', nameEn: 'United Depot', type: 'supplier', city: 'القاهرة' },
      { id: 'WH-S02-A', orgId: 'ORG-S02', nameAr: 'مستودع فارما تريد', nameEn: 'Pharma Trade Depot', type: 'supplier', city: 'القاهرة' },
      { id: 'WH-S03-A', orgId: 'ORG-S03', nameAr: 'مستودع المعادي', nameEn: 'Maadi Depot', type: 'supplier', city: 'القاهرة' },
      { id: 'WH-S05-A', orgId: 'ORG-S05', nameAr: 'مستودع النيل الطبي', nameEn: 'Nile Medical Depot', type: 'supplier', city: 'الإسكندرية' },
      { id: 'WH-S09-A', orgId: 'ORG-S09', nameAr: 'مستودع النور', nameEn: 'Al-Noor Depot', type: 'supplier', city: 'القاهرة' }
    ];

    const users = [
      { id: 'USR-ADM', email: 'admin@pharmalink.eg', nameAr: 'أحمد المنصوري', nameEn: 'Ahmed Al-Mansouri', role: 'platform_admin', orgId: 'ORG-PLT', warehouseId: null, active: true },
      { id: 'USR-BO1', email: 'owner@nilepharma.eg', nameAr: 'محمود عبدالعزيز', nameEn: 'Mahmoud Abdelaziz', role: 'buyer_owner', orgId: 'ORG-B01', warehouseId: 'WH-B01-A', active: true },
      { id: 'USR-BP1', email: 'procurement@nilepharma.eg', nameAr: 'سارة إبراهيم', nameEn: 'Sara Ibrahim', role: 'buyer_procurement', orgId: 'ORG-B01', warehouseId: 'WH-B01-A', active: true },
      { id: 'USR-BV1', email: 'viewer@nilepharma.eg', nameAr: 'كريم حسن', nameEn: 'Karim Hassan', role: 'warehouse_viewer', orgId: 'ORG-B01', warehouseId: 'WH-B01-A', active: true },
      { id: 'USR-SO1', email: 'owner@unitedsupplies.eg', nameAr: 'هشام فؤاد', nameEn: 'Hesham Fouad', role: 'supplier_owner', orgId: 'ORG-S01', warehouseId: 'WH-S01-A', active: true },
      { id: 'USR-SS1', email: 'sales@unitedsupplies.eg', nameAr: 'نورا مصطفى', nameEn: 'Nora Mostafa', role: 'supplier_sales', orgId: 'ORG-S01', warehouseId: 'WH-S01-A', active: true },
      { id: 'USR-SO2', email: 'owner@pharmatrade.eg', nameAr: 'ياسر كمال', nameEn: 'Yasser Kamal', role: 'supplier_owner', orgId: 'ORG-S02', warehouseId: 'WH-S02-A', active: true },
      { id: 'USR-BP2', email: 'buy@deltamed.eg', nameAr: 'منى سعيد', nameEn: 'Mona Said', role: 'buyer_owner', orgId: 'ORG-B02', warehouseId: 'WH-B02-A', active: true }
    ];

    // Inventory for buyer WH-B01-A — mix of healthy, low, out of stock
    const inventorySeed = [
      { productId: 'PRD-001', onHand: 12, reserved: 4, minStock: 20, reorderLevel: 30, avgDailyUsage: 3.5, leadTimeDays: 5, safetyStock: 10, location: 'A-01-01' },
      { productId: 'PRD-002', onHand: 85, reserved: 10, minStock: 30, reorderLevel: 45, avgDailyUsage: 2.2, leadTimeDays: 4, safetyStock: 12, location: 'A-01-02' },
      { productId: 'PRD-003', onHand: 40, reserved: 5, minStock: 20, reorderLevel: 30, avgDailyUsage: 1.5, leadTimeDays: 4, safetyStock: 8, location: 'A-01-03' },
      { productId: 'PRD-004', onHand: 8, reserved: 2, minStock: 15, reorderLevel: 25, avgDailyUsage: 1.8, leadTimeDays: 6, safetyStock: 10, location: 'A-02-01' },
      { productId: 'PRD-005', onHand: 0, reserved: 0, minStock: 10, reorderLevel: 18, avgDailyUsage: 1.2, leadTimeDays: 7, safetyStock: 8, location: 'A-02-02' },
      { productId: 'PRD-006', onHand: 120, reserved: 15, minStock: 40, reorderLevel: 60, avgDailyUsage: 5, leadTimeDays: 3, safetyStock: 15, location: 'B-01-01' },
      { productId: 'PRD-007', onHand: 6, reserved: 1, minStock: 12, reorderLevel: 20, avgDailyUsage: 1.0, leadTimeDays: 7, safetyStock: 8, location: 'B-01-02' },
      { productId: 'PRD-008', onHand: 15, reserved: 3, minStock: 10, reorderLevel: 16, avgDailyUsage: 0.8, leadTimeDays: 10, safetyStock: 6, location: 'B-01-03' },
      { productId: 'PRD-009', onHand: 200, reserved: 20, minStock: 50, reorderLevel: 80, avgDailyUsage: 8, leadTimeDays: 3, safetyStock: 20, location: 'C-01-01' },
      { productId: 'PRD-010', onHand: 55, reserved: 8, minStock: 25, reorderLevel: 40, avgDailyUsage: 3, leadTimeDays: 4, safetyStock: 12, location: 'C-01-02' },
      { productId: 'PRD-011', onHand: 18, reserved: 5, minStock: 20, reorderLevel: 30, avgDailyUsage: 2.5, leadTimeDays: 4, safetyStock: 10, location: 'C-01-03' },
      { productId: 'PRD-012', onHand: 70, reserved: 10, minStock: 25, reorderLevel: 35, avgDailyUsage: 2, leadTimeDays: 5, safetyStock: 10, location: 'C-02-01' },
      { productId: 'PRD-014', onHand: 5, reserved: 2, minStock: 30, reorderLevel: 45, avgDailyUsage: 4, leadTimeDays: 3, safetyStock: 15, location: 'D-01-01' },
      { productId: 'PRD-015', onHand: 22, reserved: 4, minStock: 15, reorderLevel: 22, avgDailyUsage: 1.2, leadTimeDays: 5, safetyStock: 8, location: 'D-01-02' },
      { productId: 'PRD-017', onHand: 3, reserved: 1, minStock: 15, reorderLevel: 25, avgDailyUsage: 2, leadTimeDays: 5, safetyStock: 10, location: 'D-02-01' },
      { productId: 'PRD-018', onHand: 45, reserved: 5, minStock: 20, reorderLevel: 30, avgDailyUsage: 2.5, leadTimeDays: 4, safetyStock: 10, location: 'D-02-02' },
      { productId: 'PRD-021', onHand: 28, reserved: 3, minStock: 15, reorderLevel: 22, avgDailyUsage: 1.5, leadTimeDays: 6, safetyStock: 8, location: 'E-01-01' },
      { productId: 'PRD-022', onHand: 4, reserved: 0, minStock: 8, reorderLevel: 14, avgDailyUsage: 0.7, leadTimeDays: 8, safetyStock: 6, location: 'E-01-02' },
      { productId: 'PRD-023', onHand: 90, reserved: 12, minStock: 30, reorderLevel: 45, avgDailyUsage: 3, leadTimeDays: 3, safetyStock: 12, location: 'E-02-01' },
      { productId: 'PRD-028', onHand: 10, reserved: 2, minStock: 8, reorderLevel: 14, avgDailyUsage: 0.5, leadTimeDays: 10, safetyStock: 5, location: 'F-01-01' },
      { productId: 'PRD-031', onHand: 2, reserved: 0, minStock: 10, reorderLevel: 16, avgDailyUsage: 1.1, leadTimeDays: 7, safetyStock: 8, location: 'F-01-02' },
      { productId: 'PRD-032', onHand: 150, reserved: 20, minStock: 40, reorderLevel: 60, avgDailyUsage: 4, leadTimeDays: 3, safetyStock: 15, location: 'F-02-01' },
      { productId: 'PRD-033', onHand: 35, reserved: 5, minStock: 20, reorderLevel: 28, avgDailyUsage: 1.3, leadTimeDays: 5, safetyStock: 8, location: 'F-02-02' },
      { productId: 'PRD-037', onHand: 7, reserved: 2, minStock: 12, reorderLevel: 18, avgDailyUsage: 0.9, leadTimeDays: 7, safetyStock: 7, location: 'G-01-01' },
      { productId: 'PRD-043', onHand: 60, reserved: 8, minStock: 25, reorderLevel: 40, avgDailyUsage: 3.5, leadTimeDays: 3, safetyStock: 12, location: 'G-01-02' },
      { productId: 'PRD-044', onHand: 9, reserved: 3, minStock: 20, reorderLevel: 30, avgDailyUsage: 2.8, leadTimeDays: 4, safetyStock: 12, location: 'G-01-03' },
      { productId: 'PRD-049', onHand: 14, reserved: 4, minStock: 20, reorderLevel: 28, avgDailyUsage: 2, leadTimeDays: 4, safetyStock: 10, location: 'H-01-01' },
      { productId: 'PRD-011', onHand: 18, reserved: 5, minStock: 20, reorderLevel: 30, avgDailyUsage: 2.5, leadTimeDays: 4, safetyStock: 10, location: 'C-01-03' },
      { productId: 'PRD-019', onHand: 0, reserved: 0, minStock: 15, reorderLevel: 25, avgDailyUsage: 2.2, leadTimeDays: 4, safetyStock: 10, location: 'D-02-03' },
      { productId: 'PRD-025', onHand: 80, reserved: 5, minStock: 20, reorderLevel: 30, avgDailyUsage: 1.5, leadTimeDays: 3, safetyStock: 8, location: 'H-01-02' },
      { productId: 'PRD-050', onHand: 25, reserved: 3, minStock: 15, reorderLevel: 22, avgDailyUsage: 1.2, leadTimeDays: 5, safetyStock: 8, location: 'H-02-01' }
    ];

    // Dedupe inventory by productId (keep first)
    const seenInv = {};
    const inventory = inventorySeed.filter(function (row) {
      if (seenInv[row.productId]) return false;
      seenInv[row.productId] = true;
      return true;
    }).map(function (row, idx) {
      return Object.assign({}, row, {
        id: 'INV-' + String(idx + 1).padStart(3, '0'),
        warehouseId: 'WH-B01-A',
        lastPurchaseDate: daysAgo(10 + (idx % 20)).slice(0, 10),
        updatedAt: isoDaysAgo(idx % 5)
      });
    });

    // Ensure at least 30 inventory records — add more products with stock
    const extraProducts = PRODUCTS.filter(function (p) {
      return !seenInv[p.id];
    }).slice(0, Math.max(0, 30 - inventory.length));
    extraProducts.forEach(function (p, i) {
      inventory.push({
        id: 'INV-' + String(inventory.length + 1).padStart(3, '0'),
        warehouseId: 'WH-B01-A',
        productId: p.id,
        onHand: 20 + (i * 7) % 80,
        reserved: (i * 2) % 10,
        minStock: 15,
        reorderLevel: 25,
        avgDailyUsage: 1 + (i % 4) * 0.5,
        leadTimeDays: 4 + (i % 4),
        safetyStock: 8,
        location: 'Z-' + String(i + 1).padStart(2, '0'),
        lastPurchaseDate: daysAgo(15 + i).slice(0, 10),
        updatedAt: isoDaysAgo(i)
      });
    });

    const batches = [
      { id: 'BAT-001', productId: 'PRD-001', warehouseId: 'WH-B01-A', batchNo: 'AUG2401', qty: 8, expiryDate: daysFromNow(45), receivedAt: daysAgo(30).slice(0, 10) },
      { id: 'BAT-002', productId: 'PRD-001', warehouseId: 'WH-B01-A', batchNo: 'AUG2402', qty: 4, expiryDate: daysFromNow(120), receivedAt: daysAgo(10).slice(0, 10) },
      { id: 'BAT-003', productId: 'PRD-005', warehouseId: 'WH-B01-A', batchNo: 'PLA2309', qty: 0, expiryDate: daysFromNow(-5), receivedAt: daysAgo(90).slice(0, 10) },
      { id: 'BAT-004', productId: 'PRD-009', warehouseId: 'WH-B01-A', batchNo: 'PAN2410', qty: 100, expiryDate: daysFromNow(20), receivedAt: daysAgo(40).slice(0, 10) },
      { id: 'BAT-005', productId: 'PRD-009', warehouseId: 'WH-B01-A', batchNo: 'PAN2411', qty: 100, expiryDate: daysFromNow(200), receivedAt: daysAgo(5).slice(0, 10) },
      { id: 'BAT-006', productId: 'PRD-014', warehouseId: 'WH-B01-A', batchNo: 'OME2312', qty: 5, expiryDate: daysFromNow(15), receivedAt: daysAgo(60).slice(0, 10) },
      { id: 'BAT-007', productId: 'PRD-022', warehouseId: 'WH-B01-A', batchNo: 'SER2402', qty: 4, expiryDate: daysFromNow(55), receivedAt: daysAgo(20).slice(0, 10) },
      { id: 'BAT-008', productId: 'PRD-031', warehouseId: 'WH-B01-A', batchNo: 'CLE2403', qty: 2, expiryDate: daysFromNow(75), receivedAt: daysAgo(15).slice(0, 10) },
      { id: 'BAT-009', productId: 'PRD-004', warehouseId: 'WH-B01-A', batchNo: 'LIP2311', qty: 8, expiryDate: daysFromNow(25), receivedAt: daysAgo(50).slice(0, 10) },
      { id: 'BAT-010', productId: 'PRD-037', warehouseId: 'WH-B01-A', batchNo: 'LYR2401', qty: 7, expiryDate: daysFromNow(85), receivedAt: daysAgo(25).slice(0, 10) },
      { id: 'BAT-011', productId: 'PRD-006', warehouseId: 'WH-B01-A', batchNo: 'GLU2405', qty: 120, expiryDate: daysFromNow(300), receivedAt: daysAgo(8).slice(0, 10) },
      { id: 'BAT-012', productId: 'PRD-017', warehouseId: 'WH-B01-A', batchNo: 'CLA2401', qty: 3, expiryDate: daysFromNow(40), receivedAt: daysAgo(35).slice(0, 10) }
    ];

    const movements = [
      { id: 'MOV-001', warehouseId: 'WH-B01-A', productId: 'PRD-001', type: 'purchase_receipt', qty: 50, ref: 'PO-2024-008', date: daysAgo(30), notes: 'استلام أمر شراء' },
      { id: 'MOV-002', warehouseId: 'WH-B01-A', productId: 'PRD-001', type: 'sales_issue', qty: -20, ref: 'SI-1042', date: daysAgo(25), notes: 'صرف مبيعات' },
      { id: 'MOV-003', warehouseId: 'WH-B01-A', productId: 'PRD-001', type: 'sales_issue', qty: -18, ref: 'SI-1088', date: daysAgo(12), notes: 'صرف مبيعات' },
      { id: 'MOV-004', warehouseId: 'WH-B01-A', productId: 'PRD-005', type: 'sales_issue', qty: -15, ref: 'SI-1090', date: daysAgo(8), notes: 'صرف أدى لنفاذ الكمية' },
      { id: 'MOV-005', warehouseId: 'WH-B01-A', productId: 'PRD-009', type: 'purchase_receipt', qty: 200, ref: 'PO-2024-010', date: daysAgo(5), notes: 'توريد بانادول' },
      { id: 'MOV-006', warehouseId: 'WH-B01-A', productId: 'PRD-014', type: 'adjustment', qty: -5, ref: 'ADJ-012', date: daysAgo(7), notes: 'تسوية جرد' },
      { id: 'MOV-007', warehouseId: 'WH-B01-A', productId: 'PRD-019', type: 'sales_issue', qty: -30, ref: 'SI-1101', date: daysAgo(3), notes: 'صرف كامل' },
      { id: 'MOV-008', warehouseId: 'WH-B01-A', productId: 'PRD-031', type: 'purchase_receipt', qty: 10, ref: 'PO-2024-011', date: daysAgo(15), notes: 'استلام كليكسان' },
      { id: 'MOV-009', warehouseId: 'WH-B01-A', productId: 'PRD-031', type: 'sales_issue', qty: -8, ref: 'SI-1105', date: daysAgo(4), notes: 'صرف' },
      { id: 'MOV-010', warehouseId: 'WH-B01-A', productId: 'PRD-004', type: 'damaged', qty: -2, ref: 'DMG-003', date: daysAgo(6), notes: 'تلف أثناء النقل' },
      { id: 'MOV-011', warehouseId: 'WH-B01-A', productId: 'PRD-022', type: 'purchase_receipt', qty: 12, ref: 'PO-2024-009', date: daysAgo(20), notes: '' },
      { id: 'MOV-012', warehouseId: 'WH-B01-A', productId: 'PRD-022', type: 'sales_issue', qty: -8, ref: 'SI-1077', date: daysAgo(10), notes: '' },
      { id: 'MOV-013', warehouseId: 'WH-B01-A', productId: 'PRD-006', type: 'transfer', qty: -10, ref: 'TR-004', date: daysAgo(2), notes: 'تحويل لفرع مدينة نصر' },
      { id: 'MOV-014', warehouseId: 'WH-B01-A', productId: 'PRD-043', type: 'purchase_return', qty: -5, ref: 'PR-002', date: daysAgo(9), notes: 'مرتجع مورد' },
      { id: 'MOV-015', warehouseId: 'WH-B01-A', productId: 'PRD-009', type: 'sales_return', qty: 5, ref: 'SR-015', date: daysAgo(1), notes: 'مرتجع عميل' }
    ];

    const supplierRelations = [
      { id: 'SR-001', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S01', preferred: true, blocked: false },
      { id: 'SR-002', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S02', preferred: true, blocked: false },
      { id: 'SR-003', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S03', preferred: false, blocked: false },
      { id: 'SR-004', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S04', preferred: false, blocked: false },
      { id: 'SR-005', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S05', preferred: true, blocked: false },
      { id: 'SR-006', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S09', preferred: false, blocked: false },
      { id: 'SR-007', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S10', preferred: false, blocked: true },
      { id: 'SR-008', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S06', preferred: false, blocked: false },
      { id: 'SR-009', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S08', preferred: false, blocked: false },
      { id: 'SR-010', buyerOrgId: 'ORG-B02', supplierOrgId: 'ORG-S01', preferred: true, blocked: false }
    ];

    // Procurement requests (15)
    const requests = [
      { id: 'PR-2024-001', number: 'PR-2024-001', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'allocated', createdAt: daysAgo(12), deadline: daysAgo(10), publishedAt: daysAgo(12), notes: 'طلب نواقص أسبوعية', invitedSuppliers: ['ORG-S01', 'ORG-S02', 'ORG-S03', 'ORG-S05'], items: [
        { productId: 'PRD-001', qty: 100, notes: '' },
        { productId: 'PRD-005', qty: 50, notes: 'عاجل' },
        { productId: 'PRD-014', qty: 80, notes: '' }
      ]},
      { id: 'PR-2024-002', number: 'PR-2024-002', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'pending_offers', createdAt: daysAgo(2), deadline: daysFromNow(1) + 'T09:00:00', publishedAt: daysAgo(2), notes: 'نافذة عروض صباحية', invitedSuppliers: ['ORG-S01', 'ORG-S02', 'ORG-S05', 'ORG-S09'], items: [
        { productId: 'PRD-004', qty: 60, notes: '' },
        { productId: 'PRD-007', qty: 40, notes: '' },
        { productId: 'PRD-017', qty: 70, notes: '' },
        { productId: 'PRD-031', qty: 30, notes: 'تبريد مطلوب' }
      ]},
      { id: 'PR-2024-003', number: 'PR-2024-003', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'comparing', createdAt: daysAgo(5), deadline: daysAgo(3), publishedAt: daysAgo(5), notes: '', invitedSuppliers: ['ORG-S01', 'ORG-S02', 'ORG-S03'], items: [
        { productId: 'PRD-019', qty: 100, notes: '' },
        { productId: 'PRD-022', qty: 25, notes: '' },
        { productId: 'PRD-037', qty: 40, notes: '' }
      ]},
      { id: 'PR-2024-004', number: 'PR-2024-004', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'approved', createdAt: daysAgo(20), deadline: daysAgo(18), publishedAt: daysAgo(20), notes: '', invitedSuppliers: ['ORG-S01', 'ORG-S05'], items: [
        { productId: 'PRD-009', qty: 200, notes: '' },
        { productId: 'PRD-006', qty: 100, notes: '' }
      ]},
      { id: 'PR-2024-005', number: 'PR-2024-005', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'draft', createdAt: daysAgo(1), deadline: null, publishedAt: null, notes: 'مسودة نواقص', invitedSuppliers: [], items: [
        { productId: 'PRD-044', qty: 50, notes: '' },
        { productId: 'PRD-049', qty: 40, notes: '' }
      ]},
      { id: 'PR-2024-006', number: 'PR-2024-006', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'closed', createdAt: daysAgo(40), deadline: daysAgo(38), publishedAt: daysAgo(40), notes: '', invitedSuppliers: ['ORG-S01', 'ORG-S02'], items: [
        { productId: 'PRD-011', qty: 60, notes: '' }
      ]},
      { id: 'PR-2024-007', number: 'PR-2024-007', buyerOrgId: 'ORG-B02', warehouseId: 'WH-B02-A', status: 'pending_offers', createdAt: daysAgo(1), deadline: daysFromNow(0) + 'T09:00:00', publishedAt: daysAgo(1), notes: '', invitedSuppliers: ['ORG-S01', 'ORG-S05'], items: [
        { productId: 'PRD-002', qty: 80, notes: '' },
        { productId: 'PRD-033', qty: 50, notes: '' }
      ]},
      { id: 'PR-2024-008', number: 'PR-2024-008', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'delivered', createdAt: daysAgo(45), deadline: daysAgo(43), publishedAt: daysAgo(45), notes: '', invitedSuppliers: ['ORG-S01'], items: [
        { productId: 'PRD-001', qty: 50, notes: '' }
      ]},
      { id: 'PR-2024-009', number: 'PR-2024-009', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'pending_offers', createdAt: daysAgo(0), deadline: daysFromNow(0) + 'T17:00:00', publishedAt: daysAgo(0), notes: 'طلب عاجل - نافذة مفتوحة', invitedSuppliers: ['ORG-S01', 'ORG-S02', 'ORG-S03', 'ORG-S05', 'ORG-S09'], items: [
        { productId: 'PRD-005', qty: 40, notes: '' },
        { productId: 'PRD-014', qty: 100, notes: '' },
        { productId: 'PRD-001', qty: 80, notes: '' },
        { productId: 'PRD-017', qty: 50, notes: '' }
      ]},
      { id: 'PR-2024-010', number: 'PR-2024-010', buyerOrgId: 'ORG-B03', warehouseId: 'WH-B03-A', status: 'open', createdAt: daysAgo(3), deadline: daysFromNow(2), publishedAt: daysAgo(3), notes: '', invitedSuppliers: ['ORG-S02', 'ORG-S09'], items: [
        { productId: 'PRD-015', qty: 30, notes: '' }
      ]},
      { id: 'PR-2024-011', number: 'PR-2024-011', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'rejected', createdAt: daysAgo(25), deadline: daysAgo(23), publishedAt: daysAgo(25), notes: 'أُلغي لارتفاع الأسعار', invitedSuppliers: ['ORG-S04'], items: [
        { productId: 'PRD-028', qty: 20, notes: '' }
      ]},
      { id: 'PR-2024-012', number: 'PR-2024-012', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'comparing', createdAt: daysAgo(4), deadline: daysAgo(2), publishedAt: daysAgo(4), notes: 'مثال التوزيع الذكي', invitedSuppliers: ['ORG-S01', 'ORG-S02', 'ORG-S03'], items: [
        { productId: 'PRD-001', qty: 100, notes: 'مثال التخصيص: C→A→B' }
      ]},
      { id: 'PR-2024-013', number: 'PR-2024-013', buyerOrgId: 'ORG-B05', warehouseId: 'WH-B05-A', status: 'draft', createdAt: daysAgo(2), deadline: null, publishedAt: null, notes: '', invitedSuppliers: [], items: [
        { productId: 'PRD-021', qty: 20, notes: '' }
      ]},
      { id: 'PR-2024-014', number: 'PR-2024-014', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'confirmed', createdAt: daysAgo(15), deadline: daysAgo(13), publishedAt: daysAgo(15), notes: '', invitedSuppliers: ['ORG-S01', 'ORG-S05'], items: [
        { productId: 'PRD-032', qty: 100, notes: '' },
        { productId: 'PRD-012', qty: 40, notes: '' }
      ]},
      { id: 'PR-2024-015', number: 'PR-2024-015', buyerOrgId: 'ORG-B01', warehouseId: 'WH-B01-A', status: 'pending_confirmation', createdAt: daysAgo(8), deadline: daysAgo(6), publishedAt: daysAgo(8), notes: '', invitedSuppliers: ['ORG-S02', 'ORG-S09'], items: [
        { productId: 'PRD-008', qty: 20, notes: '' },
        { productId: 'PRD-013', qty: 50, notes: '' }
      ]}
    ];

    // Offers — including classic allocation example for PR-2024-012
    const offers = [
      { id: 'OFF-001', requestId: 'PR-2024-001', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(11), items: [
        { productId: 'PRD-001', unitPrice: 140, discountPct: 5, availableQty: 80, committedQty: 80, deliveryDays: 3, minOrderQty: 10 },
        { productId: 'PRD-005', unitPrice: 310, discountPct: 3, availableQty: 50, committedQty: 50, deliveryDays: 5, minOrderQty: 5 },
        { productId: 'PRD-014', unitPrice: 34, discountPct: 0, availableQty: 100, committedQty: 80, deliveryDays: 2, minOrderQty: 20 }
      ]},
      { id: 'OFF-002', requestId: 'PR-2024-001', supplierOrgId: 'ORG-S02', status: 'submitted', submittedAt: daysAgo(11), items: [
        { productId: 'PRD-001', unitPrice: 138, discountPct: 2, availableQty: 100, committedQty: 100, deliveryDays: 4, minOrderQty: 20 },
        { productId: 'PRD-005', unitPrice: 305, discountPct: 0, availableQty: 30, committedQty: 30, deliveryDays: 4, minOrderQty: 10 },
        { productId: 'PRD-014', unitPrice: 36, discountPct: 5, availableQty: 60, committedQty: 60, deliveryDays: 3, minOrderQty: 10 }
      ]},
      { id: 'OFF-003', requestId: 'PR-2024-003', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(4), items: [
        { productId: 'PRD-019', unitPrice: 42, discountPct: 5, availableQty: 100, committedQty: 100, deliveryDays: 3, minOrderQty: 10 },
        { productId: 'PRD-022', unitPrice: 275, discountPct: 2, availableQty: 20, committedQty: 20, deliveryDays: 5, minOrderQty: 5 },
        { productId: 'PRD-037', unitPrice: 300, discountPct: 0, availableQty: 40, committedQty: 40, deliveryDays: 4, minOrderQty: 5 }
      ]},
      { id: 'OFF-004', requestId: 'PR-2024-003', supplierOrgId: 'ORG-S02', status: 'submitted', submittedAt: daysAgo(4), items: [
        { productId: 'PRD-019', unitPrice: 44, discountPct: 8, availableQty: 80, committedQty: 80, deliveryDays: 2, minOrderQty: 20 },
        { productId: 'PRD-022', unitPrice: 270, discountPct: 0, availableQty: 25, committedQty: 25, deliveryDays: 6, minOrderQty: 5 },
        { productId: 'PRD-037', unitPrice: 295, discountPct: 3, availableQty: 30, committedQty: 30, deliveryDays: 5, minOrderQty: 10 }
      ]},
      { id: 'OFF-005', requestId: 'PR-2024-003', supplierOrgId: 'ORG-S03', status: 'submitted', submittedAt: daysAgo(3), items: [
        { productId: 'PRD-019', unitPrice: 40, discountPct: 0, availableQty: 50, committedQty: 50, deliveryDays: 4, minOrderQty: 10 },
        { productId: 'PRD-037', unitPrice: 315, discountPct: 5, availableQty: 40, committedQty: 40, deliveryDays: 3, minOrderQty: 5 }
      ]},
      // Classic example: requested 100 of PRD-001 — C=75/20, A=80/60, B=83/100
      { id: 'OFF-006', requestId: 'PR-2024-012', supplierOrgId: 'ORG-S03', status: 'submitted', submittedAt: daysAgo(3), items: [
        { productId: 'PRD-001', unitPrice: 75, discountPct: 0, availableQty: 20, committedQty: 20, deliveryDays: 3, minOrderQty: 5, expiryDate: daysFromNow(30) }
      ]},
      { id: 'OFF-007', requestId: 'PR-2024-012', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(3), items: [
        { productId: 'PRD-001', unitPrice: 80, discountPct: 0, availableQty: 60, committedQty: 60, deliveryDays: 2, minOrderQty: 10, expiryDate: daysFromNow(30) }
      ]},
      { id: 'OFF-008', requestId: 'PR-2024-012', supplierOrgId: 'ORG-S02', status: 'submitted', submittedAt: daysAgo(3), items: [
        { productId: 'PRD-001', unitPrice: 83, discountPct: 0, availableQty: 100, committedQty: 100, deliveryDays: 4, minOrderQty: 10, expiryDate: daysFromNow(30) }
      ]},
      { id: 'OFF-009', requestId: 'PR-2024-002', supplierOrgId: 'ORG-S01', status: 'draft', submittedAt: null, items: [
        { productId: 'PRD-004', unitPrice: 205, discountPct: 4, availableQty: 50, committedQty: 50, deliveryDays: 3, minOrderQty: 10 }
      ]},
      { id: 'OFF-010', requestId: 'PR-2024-009', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(0), items: [
        { productId: 'PRD-005', unitPrice: 315, discountPct: 5, availableQty: 40, committedQty: 40, deliveryDays: 3, minOrderQty: 5 },
        { productId: 'PRD-014', unitPrice: 33, discountPct: 0, availableQty: 80, committedQty: 80, deliveryDays: 2, minOrderQty: 20 },
        { productId: 'PRD-001', unitPrice: 142, discountPct: 6, availableQty: 60, committedQty: 60, deliveryDays: 3, minOrderQty: 10 },
        { productId: 'PRD-017', unitPrice: 118, discountPct: 2, availableQty: 50, committedQty: 50, deliveryDays: 4, minOrderQty: 10 }
      ]},
      { id: 'OFF-011', requestId: 'PR-2024-009', supplierOrgId: 'ORG-S02', status: 'submitted', submittedAt: daysAgo(0), items: [
        { productId: 'PRD-005', unitPrice: 308, discountPct: 2, availableQty: 25, committedQty: 25, deliveryDays: 4, minOrderQty: 10 },
        { productId: 'PRD-014', unitPrice: 35, discountPct: 8, availableQty: 100, committedQty: 100, deliveryDays: 3, minOrderQty: 10 },
        { productId: 'PRD-001', unitPrice: 145, discountPct: 8, availableQty: 80, committedQty: 80, deliveryDays: 2, minOrderQty: 20 },
        { productId: 'PRD-017', unitPrice: 115, discountPct: 0, availableQty: 40, committedQty: 40, deliveryDays: 5, minOrderQty: 10 }
      ]},
      { id: 'OFF-012', requestId: 'PR-2024-009', supplierOrgId: 'ORG-S05', status: 'submitted', submittedAt: daysAgo(0), items: [
        { productId: 'PRD-005', unitPrice: 300, discountPct: 0, availableQty: 20, committedQty: 20, deliveryDays: 5, minOrderQty: 5 },
        { productId: 'PRD-014', unitPrice: 32, discountPct: 0, availableQty: 50, committedQty: 50, deliveryDays: 4, minOrderQty: 10 },
        { productId: 'PRD-001', unitPrice: 139, discountPct: 3, availableQty: 40, committedQty: 40, deliveryDays: 3, minOrderQty: 10 }
      ]},
      { id: 'OFF-013', requestId: 'PR-2024-004', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(19), items: [
        { productId: 'PRD-009', unitPrice: 26, discountPct: 5, availableQty: 200, committedQty: 200, deliveryDays: 2, minOrderQty: 50 },
        { productId: 'PRD-006', unitPrice: 40, discountPct: 0, availableQty: 100, committedQty: 100, deliveryDays: 3, minOrderQty: 20 }
      ]},
      { id: 'OFF-014', requestId: 'PR-2024-007', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(0), items: [
        { productId: 'PRD-002', unitPrice: 65, discountPct: 3, availableQty: 80, committedQty: 80, deliveryDays: 3, minOrderQty: 10 },
        { productId: 'PRD-033', unitPrice: 120, discountPct: 2, availableQty: 50, committedQty: 50, deliveryDays: 4, minOrderQty: 10 }
      ]},
      { id: 'OFF-015', requestId: 'PR-2024-014', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(14), items: [
        { productId: 'PRD-032', unitPrice: 42, discountPct: 5, availableQty: 100, committedQty: 100, deliveryDays: 2, minOrderQty: 20 },
        { productId: 'PRD-012', unitPrice: 60, discountPct: 0, availableQty: 40, committedQty: 40, deliveryDays: 3, minOrderQty: 10 }
      ]},
      { id: 'OFF-016', requestId: 'PR-2024-015', supplierOrgId: 'ORG-S02', status: 'submitted', submittedAt: daysAgo(7), items: [
        { productId: 'PRD-008', unitPrice: 510, discountPct: 2, availableQty: 20, committedQty: 20, deliveryDays: 5, minOrderQty: 5 },
        { productId: 'PRD-013', unitPrice: 90, discountPct: 5, availableQty: 50, committedQty: 50, deliveryDays: 4, minOrderQty: 10 }
      ]},
      { id: 'OFF-017', requestId: 'PR-2024-002', supplierOrgId: 'ORG-S05', status: 'submitted', submittedAt: daysAgo(1), items: [
        { productId: 'PRD-004', unitPrice: 200, discountPct: 0, availableQty: 40, committedQty: 40, deliveryDays: 4, minOrderQty: 10 },
        { productId: 'PRD-007', unitPrice: 370, discountPct: 3, availableQty: 40, committedQty: 40, deliveryDays: 5, minOrderQty: 5 },
        { productId: 'PRD-017', unitPrice: 115, discountPct: 5, availableQty: 70, committedQty: 70, deliveryDays: 3, minOrderQty: 10 },
        { productId: 'PRD-031', unitPrice: 180, discountPct: 0, availableQty: 25, committedQty: 25, deliveryDays: 4, minOrderQty: 5 }
      ]},
      { id: 'OFF-018', requestId: 'PR-2024-001', supplierOrgId: 'ORG-S05', status: 'submitted', submittedAt: daysAgo(11), items: [
        { productId: 'PRD-001', unitPrice: 143, discountPct: 4, availableQty: 50, committedQty: 50, deliveryDays: 5, minOrderQty: 10 },
        { productId: 'PRD-005', unitPrice: 318, discountPct: 6, availableQty: 40, committedQty: 40, deliveryDays: 3, minOrderQty: 5 }
      ]},
      { id: 'OFF-019', requestId: 'PR-2024-009', supplierOrgId: 'ORG-S03', status: 'draft', submittedAt: null, items: [] },
      { id: 'OFF-020', requestId: 'PR-2024-006', supplierOrgId: 'ORG-S01', status: 'submitted', submittedAt: daysAgo(39), items: [
        { productId: 'PRD-011', unitPrice: 46, discountPct: 2, availableQty: 60, committedQty: 60, deliveryDays: 3, minOrderQty: 10 }
      ]}
    ];

    // Enrich offer items with netUnitPrice
    offers.forEach(function (off) {
      (off.items || []).forEach(function (it) {
        it.netUnitPrice = Math.round(it.unitPrice * (1 - (it.discountPct || 0) / 100) * 100) / 100;
        it.discountAmount = Math.round((it.unitPrice - it.netUnitPrice) * 100) / 100;
      });
    });

    const allocations = [
      {
        id: 'ALC-001',
        requestId: 'PR-2024-012',
        status: 'draft',
        createdAt: daysAgo(2),
        policies: {
          maxSuppliersPerProduct: 5,
          maxPriceDiffPct: 25,
          allowPartial: true,
          preferredSuppliers: ['ORG-S01'],
          maxPurchaseAmount: 0,
          minFulfillmentPct: 80,
          autoApproval: false,
          requireManualApproval: true,
          maxConcentrationPct: 70
        },
        lines: [
          { productId: 'PRD-001', supplierOrgId: 'ORG-S03', qty: 20, unitPrice: 75, netUnitPrice: 75, lineCost: 1500 },
          { productId: 'PRD-001', supplierOrgId: 'ORG-S01', qty: 60, unitPrice: 80, netUnitPrice: 80, lineCost: 4800 },
          { productId: 'PRD-001', supplierOrgId: 'ORG-S02', qty: 20, unitPrice: 83, netUnitPrice: 83, lineCost: 1660 }
        ],
        totals: { totalCost: 7960, uncovered: {}, fulfillmentPct: 100, savings: 340 }
      }
    ];

    const purchaseOrders = [
      { id: 'PO-2024-001', number: 'PO-2024-001', requestId: 'PR-2024-004', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S01', warehouseId: 'WH-B01-A', status: 'delivered', createdAt: daysAgo(17), approvedAt: daysAgo(17), expectedDelivery: daysAgo(14).slice(0, 10), confirmedAt: daysAgo(16), deliveredAt: daysAgo(14), items: [
        { productId: 'PRD-009', qty: 200, unitPrice: 26, discountPct: 5, netUnitPrice: 24.7, lineTotal: 4940 },
        { productId: 'PRD-006', qty: 100, unitPrice: 40, discountPct: 0, netUnitPrice: 40, lineTotal: 4000 }
      ], grandTotal: 8940, notes: '' },
      { id: 'PO-2024-002', number: 'PO-2024-002', requestId: 'PR-2024-008', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S01', warehouseId: 'WH-B01-A', status: 'delivered', createdAt: daysAgo(42), approvedAt: daysAgo(42), expectedDelivery: daysAgo(38).slice(0, 10), confirmedAt: daysAgo(41), deliveredAt: daysAgo(38), items: [
        { productId: 'PRD-001', qty: 50, unitPrice: 140, discountPct: 0, netUnitPrice: 140, lineTotal: 7000 }
      ], grandTotal: 7000, notes: '' },
      { id: 'PO-2024-003', number: 'PO-2024-003', requestId: 'PR-2024-014', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S01', warehouseId: 'WH-B01-A', status: 'confirmed', createdAt: daysAgo(13), approvedAt: daysAgo(13), expectedDelivery: daysFromNow(2), confirmedAt: daysAgo(12), items: [
        { productId: 'PRD-032', qty: 100, unitPrice: 42, discountPct: 5, netUnitPrice: 39.9, lineTotal: 3990 },
        { productId: 'PRD-012', qty: 40, unitPrice: 60, discountPct: 0, netUnitPrice: 60, lineTotal: 2400 }
      ], grandTotal: 6390, notes: '' },
      { id: 'PO-2024-004', number: 'PO-2024-004', requestId: 'PR-2024-015', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S02', warehouseId: 'WH-B01-A', status: 'pending_confirmation', createdAt: daysAgo(6), approvedAt: daysAgo(6), expectedDelivery: daysFromNow(5), items: [
        { productId: 'PRD-008', qty: 20, unitPrice: 510, discountPct: 2, netUnitPrice: 499.8, lineTotal: 9996 },
        { productId: 'PRD-013', qty: 50, unitPrice: 90, discountPct: 5, netUnitPrice: 85.5, lineTotal: 4275 }
      ], grandTotal: 14271, notes: '' },
      { id: 'PO-2024-005', number: 'PO-2024-005', requestId: 'PR-2024-001', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S01', warehouseId: 'WH-B01-A', status: 'partially_delivered', createdAt: daysAgo(9), approvedAt: daysAgo(9), expectedDelivery: daysFromNow(1), confirmedAt: daysAgo(8), items: [
        { productId: 'PRD-001', qty: 80, unitPrice: 140, discountPct: 5, netUnitPrice: 133, lineTotal: 10640, receivedQty: 50 },
        { productId: 'PRD-005', qty: 50, unitPrice: 310, discountPct: 3, netUnitPrice: 300.7, lineTotal: 15035, receivedQty: 0 }
      ], grandTotal: 25675, notes: '' },
      { id: 'PO-2024-006', number: 'PO-2024-006', requestId: 'PR-2024-001', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S02', warehouseId: 'WH-B01-A', status: 'confirmed', createdAt: daysAgo(9), approvedAt: daysAgo(9), expectedDelivery: daysFromNow(3), confirmedAt: daysAgo(8), items: [
        { productId: 'PRD-014', qty: 60, unitPrice: 36, discountPct: 5, netUnitPrice: 34.2, lineTotal: 2052 }
      ], grandTotal: 2052, notes: '' },
      { id: 'PO-2024-007', number: 'PO-2024-007', requestId: 'PR-2024-011', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S04', warehouseId: 'WH-B01-A', status: 'rejected', createdAt: daysAgo(22), approvedAt: daysAgo(22), expectedDelivery: daysAgo(18).slice(0, 10), items: [
        { productId: 'PRD-028', qty: 20, unitPrice: 430, discountPct: 0, netUnitPrice: 430, lineTotal: 8600 }
      ], grandTotal: 8600, notes: 'رفض المورد لعدم التوفر' },
      { id: 'PO-2024-008', number: 'PO-2024-008', requestId: 'PR-2024-006', buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S01', warehouseId: 'WH-B01-A', status: 'cancelled', createdAt: daysAgo(37), approvedAt: daysAgo(37), expectedDelivery: daysAgo(34).slice(0, 10), items: [
        { productId: 'PRD-011', qty: 60, unitPrice: 46, discountPct: 2, netUnitPrice: 45.08, lineTotal: 2704.8 }
      ], grandTotal: 2704.8, notes: 'أُلغي من المشتري' },
      { id: 'PO-2024-009', number: 'PO-2024-009', requestId: null, buyerOrgId: 'ORG-B01', supplierOrgId: 'ORG-S05', warehouseId: 'WH-B01-A', status: 'draft', createdAt: daysAgo(1), items: [
        { productId: 'PRD-021', qty: 15, unitPrice: 92, discountPct: 0, netUnitPrice: 92, lineTotal: 1380 }
      ], grandTotal: 1380, notes: 'أمر يدوي مسودة' },
      { id: 'PO-2024-010', number: 'PO-2024-010', requestId: 'PR-2024-010', buyerOrgId: 'ORG-B03', supplierOrgId: 'ORG-S02', warehouseId: 'WH-B03-A', status: 'pending_confirmation', createdAt: daysAgo(2), approvedAt: daysAgo(2), expectedDelivery: daysFromNow(4), items: [
        { productId: 'PRD-015', qty: 30, unitPrice: 180, discountPct: 3, netUnitPrice: 174.6, lineTotal: 5238 }
      ], grandTotal: 5238, notes: '' }
    ];

    const notifications = [
      { id: 'NTF-001', userId: 'USR-BO1', type: 'offer_submitted', titleAr: 'عرض جديد على طلب PR-2024-009', titleEn: 'New offer on PR-2024-009', bodyAr: 'قدّمت المتحدة للتوريدات عرضاً على طلب الشراء', bodyEn: 'United Supplies submitted an offer', read: false, createdAt: daysAgo(0) },
      { id: 'NTF-002', userId: 'USR-BO1', type: 'offer_closing', titleAr: 'إغلاق العروض قريباً', titleEn: 'Offer closing soon', bodyAr: 'نافذة عروض PR-2024-009 تُغلق اليوم', bodyEn: 'PR-2024-009 offer window closes today', read: false, createdAt: daysAgo(0) },
      { id: 'NTF-003', userId: 'USR-BO1', type: 'allocation_ready', titleAr: 'التوزيع الذكي جاهز للمراجعة', titleEn: 'Allocation ready for review', bodyAr: 'طلب PR-2024-012 جاهز لمراجعة التوزيع', bodyEn: 'PR-2024-012 allocation ready', read: false, createdAt: daysAgo(1) },
      { id: 'NTF-004', userId: 'USR-BO1', type: 'po_approved', titleAr: 'تم اعتماد أمر شراء', titleEn: 'PO approved', bodyAr: 'أمر الشراء PO-2024-003 بانتظار التوريد', bodyEn: 'PO-2024-003 awaiting delivery', read: true, createdAt: daysAgo(12) },
      { id: 'NTF-005', userId: 'USR-BO1', type: 'shortage', titleAr: 'نقص مخزون مكتشف', titleEn: 'Shortage detected', bodyAr: 'بلاتكس 75 مجم نفد من المخزون', bodyEn: 'Plavix 75mg is out of stock', read: false, createdAt: daysAgo(1) },
      { id: 'NTF-006', userId: 'USR-BO1', type: 'expiration', titleAr: 'أصناف قرب انتهاء الصلاحية', titleEn: 'Near-expiry products', bodyAr: '3 أصناف تنتهي خلال 30 يوماً', bodyEn: '3 products expire within 30 days', read: false, createdAt: daysAgo(2) },
      { id: 'NTF-007', userId: 'USR-SO1', type: 'new_request', titleAr: 'طلب شراء جديد', titleEn: 'New purchase request', bodyAr: 'مخازن النيل نشرت طلب PR-2024-009', bodyEn: 'Nile Pharma published PR-2024-009', read: false, createdAt: daysAgo(0) },
      { id: 'NTF-008', userId: 'USR-SO1', type: 'po_pending', titleAr: 'أمر شراء بانتظار التأكيد', titleEn: 'PO awaiting confirmation', bodyAr: 'PO-2024-004 بانتظار تأكيدك', bodyEn: 'PO-2024-004 awaits your confirmation', read: false, createdAt: daysAgo(6) },
      { id: 'NTF-009', userId: 'USR-BO1', type: 'delivery', titleAr: 'تم تأكيد التوريد', titleEn: 'Delivery confirmed', bodyAr: 'تم استلام جزئي لـ PO-2024-005', bodyEn: 'Partial receipt for PO-2024-005', read: true, createdAt: daysAgo(3) },
      { id: 'NTF-010', userId: 'USR-BO1', type: 'supplier_rejected', titleAr: 'المورد رفض الأمر', titleEn: 'Supplier rejected order', bodyAr: 'تم رفض PO-2024-007 من المورد', bodyEn: 'PO-2024-007 was rejected', read: true, createdAt: daysAgo(21) },
      { id: 'NTF-011', userId: 'USR-ADM', type: 'verification', titleAr: 'طلب تحقق جديد', titleEn: 'New verification request', bodyAr: 'مخزن مصر للأدوية بانتظار التحقق', bodyEn: 'Misr Pharma Store pending verification', read: false, createdAt: daysAgo(1) },
      { id: 'NTF-012', userId: 'USR-BO1', type: 'subscription', titleAr: 'الاشتراك يقترب من التجديد', titleEn: 'Subscription renewing soon', bodyAr: 'باقة احترافية تتجدد خلال 15 يوماً', bodyEn: 'Professional plan renews in 15 days', read: true, createdAt: daysAgo(5) },
      { id: 'NTF-013', userId: 'USR-BP1', type: 'offer_submitted', titleAr: 'عرض من فارما تريد', titleEn: 'Offer from Pharma Trade', bodyAr: 'عرض جديد على PR-2024-009', bodyEn: 'New offer on PR-2024-009', read: false, createdAt: daysAgo(0) },
      { id: 'NTF-014', userId: 'USR-SS1', type: 'new_request', titleAr: 'طلب متاح للتقديم', titleEn: 'Request available', bodyAr: 'يمكنك تقديم عرض على PR-2024-002', bodyEn: 'You can bid on PR-2024-002', read: false, createdAt: daysAgo(2) },
      { id: 'NTF-015', userId: 'USR-BO1', type: 'allocation_ready', titleAr: 'عروض PR-2024-003 جاهزة للمقارنة', titleEn: 'PR-2024-003 ready to compare', bodyAr: '3 موردين قدّموا عروضاً', bodyEn: '3 suppliers submitted offers', read: false, createdAt: daysAgo(3) }
    ];

    const customers = [
      { id: 'CUS-001', nameAr: 'صيدلية الشفاء - المعادي', nameEn: 'Al-Shifa Pharmacy - Maadi', phone: '01001234567', city: 'القاهرة', balance: 12500 },
      { id: 'CUS-002', nameAr: 'مستشفى النور التخصصي', nameEn: 'Al-Noor Specialty Hospital', phone: '01009876543', city: 'الجيزة', balance: 45000 },
      { id: 'CUS-003', nameAr: 'صيدليات العزّ', nameEn: 'Al-Ezz Pharmacies', phone: '01112345678', city: 'القاهرة', balance: 8200 },
      { id: 'CUS-004', nameAr: 'عيادة الدكتور أحمد', nameEn: 'Dr. Ahmed Clinic', phone: '01223456789', city: 'القاهرة', balance: 2100 },
      { id: 'CUS-005', nameAr: 'مركز الحياة الطبي', nameEn: 'Al-Hayat Medical Center', phone: '01555666777', city: 'الإسكندرية', balance: 18900 }
    ];

    const salesInvoices = [
      { id: 'SI-1042', customerId: 'CUS-001', date: daysAgo(25).slice(0, 10), total: 4200, status: 'paid' },
      { id: 'SI-1088', customerId: 'CUS-002', date: daysAgo(12).slice(0, 10), total: 18500, status: 'partial' },
      { id: 'SI-1090', customerId: 'CUS-003', date: daysAgo(8).slice(0, 10), total: 5600, status: 'paid' },
      { id: 'SI-1101', customerId: 'CUS-001', date: daysAgo(3).slice(0, 10), total: 3100, status: 'unpaid' },
      { id: 'SI-1105', customerId: 'CUS-005', date: daysAgo(4).slice(0, 10), total: 9800, status: 'paid' }
    ];

    // Branch warehouse stock — surplus where main warehouse is short
    const branchSeed = [
      { productId: 'PRD-001', onHand: 140, reserved: 20, minStock: 20, reorderLevel: 30, avgDailyUsage: 2, leadTimeDays: 5, safetyStock: 8, location: 'N-01-01' },
      { productId: 'PRD-005', onHand: 65, reserved: 30, minStock: 10, reorderLevel: 18, avgDailyUsage: 0.8, leadTimeDays: 7, safetyStock: 6, location: 'N-01-02' },
      { productId: 'PRD-014', onHand: 110, reserved: 0, minStock: 20, reorderLevel: 35, avgDailyUsage: 2.5, leadTimeDays: 3, safetyStock: 10, location: 'N-02-01' },
      { productId: 'PRD-017', onHand: 40, reserved: 0, minStock: 10, reorderLevel: 18, avgDailyUsage: 1, leadTimeDays: 5, safetyStock: 6, location: 'N-02-02' },
      { productId: 'PRD-031', onHand: 25, reserved: 0, minStock: 8, reorderLevel: 14, avgDailyUsage: 0.6, leadTimeDays: 7, safetyStock: 5, location: 'N-03-01' },
      { productId: 'PRD-006', onHand: 55, reserved: 0, minStock: 20, reorderLevel: 30, avgDailyUsage: 2, leadTimeDays: 3, safetyStock: 8, location: 'N-03-02' },
      { productId: 'PRD-009', onHand: 80, reserved: 0, minStock: 30, reorderLevel: 45, avgDailyUsage: 3, leadTimeDays: 3, safetyStock: 10, location: 'N-04-01' },
      { productId: 'PRD-019', onHand: 12, reserved: 0, minStock: 10, reorderLevel: 16, avgDailyUsage: 1, leadTimeDays: 4, safetyStock: 5, location: 'N-04-02' },
      { productId: 'PRD-004', onHand: 5, reserved: 0, minStock: 12, reorderLevel: 20, avgDailyUsage: 1.2, leadTimeDays: 6, safetyStock: 6, location: 'N-05-01' },
      { productId: 'PRD-022', onHand: 3, reserved: 0, minStock: 8, reorderLevel: 14, avgDailyUsage: 0.5, leadTimeDays: 8, safetyStock: 4, location: 'N-05-02' }
    ];
    branchSeed.forEach(function (row, idx) {
      inventory.push(Object.assign({}, row, {
        id: 'INV-' + String(inventory.length + 1).padStart(3, '0'),
        warehouseId: 'WH-B01-B',
        lastPurchaseDate: daysAgo(8 + idx).slice(0, 10),
        updatedAt: isoDaysAgo(idx % 4)
      }));
    });

    const shortages = [
      { id: 'SH-001', warehouseId: 'WH-B01-A', productId: 'PRD-001', requestedQty: 100, coveredQty: 20, status: 'partially_covered', source: 'auto', urgency: 'high', notes: '', linkedReservationIds: ['RSV-001'], linkedRequestId: null, createdAt: daysAgo(1) },
      { id: 'SH-002', warehouseId: 'WH-B01-A', productId: 'PRD-005', requestedQty: 50, coveredQty: 0, status: 'open', source: 'auto', urgency: 'critical', notes: 'نفد المخزون', linkedReservationIds: [], linkedRequestId: null, createdAt: daysAgo(1) },
      { id: 'SH-003', warehouseId: 'WH-B01-A', productId: 'PRD-014', requestedQty: 80, coveredQty: 0, status: 'open', source: 'auto', urgency: 'critical', notes: '', linkedReservationIds: [], linkedRequestId: null, createdAt: daysAgo(1) },
      { id: 'SH-004', warehouseId: 'WH-B01-A', productId: 'PRD-017', requestedQty: 70, coveredQty: 0, status: 'open', source: 'manual', urgency: 'high', notes: '', linkedReservationIds: [], linkedRequestId: null, createdAt: daysAgo(0) },
      { id: 'SH-005', warehouseId: 'WH-B01-A', productId: 'PRD-031', requestedQty: 30, coveredQty: 0, status: 'open', source: 'excel', urgency: 'critical', notes: 'مستورد من Excel', linkedReservationIds: [], linkedRequestId: null, createdAt: daysAgo(0) },
      { id: 'SH-006', warehouseId: 'WH-B01-B', productId: 'PRD-004', requestedQty: 25, coveredQty: 0, status: 'open', source: 'auto', urgency: 'high', notes: 'نقص في الفرع', linkedReservationIds: [], linkedRequestId: null, createdAt: daysAgo(0) },
      { id: 'SH-007', warehouseId: 'WH-B01-B', productId: 'PRD-022', requestedQty: 15, coveredQty: 0, status: 'open', source: 'manual', urgency: 'medium', notes: '', linkedReservationIds: [], linkedRequestId: null, createdAt: daysAgo(0) }
    ];

    const reservations = [
      { id: 'RSV-001', orgId: 'ORG-B01', productId: 'PRD-001', qty: 20, fromWarehouseId: 'WH-B01-B', toWarehouseId: 'WH-B01-A', shortageId: 'SH-001', status: 'received', transferId: 'TR-001', createdBy: 'USR-BO1', createdAt: daysAgo(2), updatedAt: daysAgo(1), notes: 'تغطية جزئية من فرع مدينة نصر' },
      { id: 'RSV-002', orgId: 'ORG-B01', productId: 'PRD-005', qty: 30, fromWarehouseId: 'WH-B01-B', toWarehouseId: 'WH-B01-A', shortageId: 'SH-002', status: 'reserved', transferId: 'TR-003', createdBy: 'USR-BO1', createdAt: daysAgo(0), updatedAt: daysAgo(0), notes: 'بانتظار الشحن' },
      { id: 'RSV-003', orgId: 'ORG-B01', productId: 'PRD-014', qty: 40, fromWarehouseId: 'WH-B01-B', toWarehouseId: 'WH-B01-A', shortageId: 'SH-003', status: 'requested', transferId: null, createdBy: 'USR-BP1', createdAt: daysAgo(0), updatedAt: daysAgo(0), notes: 'طلب حجز من الفرع' }
    ];

    const transfers = [
      { id: 'TR-001', fromWarehouseId: 'WH-B01-B', toWarehouseId: 'WH-B01-A', status: 'completed', reservationId: 'RSV-001', createdAt: daysAgo(2), shippedAt: daysAgo(2), receivedAt: daysAgo(1), updatedAt: daysAgo(1), items: [{ productId: 'PRD-001', qty: 20 }], notes: 'تغطية نقص أوجمنتين' },
      { id: 'TR-002', fromWarehouseId: 'WH-B01-A', toWarehouseId: 'WH-B01-B', status: 'pending', reservationId: null, createdAt: daysAgo(0), updatedAt: daysAgo(0), items: [{ productId: 'PRD-009', qty: 20 }, { productId: 'PRD-023', qty: 10 }], notes: 'تحويل روتيني' },
      { id: 'TR-003', fromWarehouseId: 'WH-B01-B', toWarehouseId: 'WH-B01-A', status: 'reserved', reservationId: 'RSV-002', createdAt: daysAgo(0), updatedAt: daysAgo(0), items: [{ productId: 'PRD-005', qty: 30 }], notes: 'حجز بلاتكس للرئيسي' }
    ];

    const countSessions = [
      { id: 'CNT-001', warehouseId: 'WH-B01-A', status: 'completed', createdAt: daysAgo(7), items: [
        { productId: 'PRD-014', systemQty: 10, countedQty: 5, difference: -5 }
      ]},
      { id: 'CNT-002', warehouseId: 'WH-B01-A', status: 'draft', createdAt: daysAgo(0), items: [] }
    ];

    const auditLogs = [
      { id: 'AUD-001', userId: 'USR-ADM', action: 'approve_verification', target: 'ORG-B03', at: daysAgo(10), detail: 'اعتماد مخزن الحياة' },
      { id: 'AUD-002', userId: 'USR-BO1', action: 'publish_request', target: 'PR-2024-009', at: daysAgo(0), detail: 'نشر طلب شراء' },
      { id: 'AUD-003', userId: 'USR-SO1', action: 'submit_offer', target: 'OFF-010', at: daysAgo(0), detail: 'تقديم عرض' },
      { id: 'AUD-004', userId: 'USR-ADM', action: 'suspend_org', target: 'ORG-S10', at: daysAgo(20), detail: 'تعليق حساب' },
      { id: 'AUD-005', userId: 'USR-BP1', action: 'import_shortage', target: 'SH-005', at: daysAgo(0), detail: 'استيراد نواقص Excel' }
    ];

    const subscriptions = [
      { id: 'SUB-001', orgId: 'ORG-B01', plan: 'professional', status: 'active', price: 2000, renewsAt: daysFromNow(15), usersLimit: 15, startedAt: daysAgo(75).slice(0, 10) },
      { id: 'SUB-002', orgId: 'ORG-B02', plan: 'basic', status: 'active', price: 1000, renewsAt: daysFromNow(40), usersLimit: 5, startedAt: daysAgo(50).slice(0, 10) },
      { id: 'SUB-003', orgId: 'ORG-S01', plan: 'professional', status: 'active', price: 2000, renewsAt: daysFromNow(22), usersLimit: 15, startedAt: daysAgo(100).slice(0, 10) },
      { id: 'SUB-004', orgId: 'ORG-B04', plan: 'trial', status: 'active', price: 0, renewsAt: daysFromNow(8), usersLimit: 3, startedAt: daysAgo(6).slice(0, 10) }
    ];

    const plans = [
      { id: 'plan_trial', nameKey: 'plan_trial', price: 0, usersLimit: 3, features: ['inventory_basic', 'shortages', 'trial_procurement'] },
      { id: 'plan_basic', nameKey: 'plan_basic', price: 1000, usersLimit: 5, features: ['inventory', 'shortages', 'procurement', 'reports_basic'] },
      { id: 'plan_pro', nameKey: 'plan_pro', price: 2000, usersLimit: 15, features: ['inventory', 'shortages', 'procurement', 'allocation', 'reports', 'excel_import', 'multi_warehouse'] },
      { id: 'plan_enterprise', nameKey: 'plan_enterprise', price: null, usersLimit: 100, features: ['all', 'api', 'sso', 'custom_sla'] }
    ];

    const procurementSchedule = {
      startHour: 8,
      endHour: 9,
      workingDays: [0, 1, 2, 3, 4],
      holidays: ['2026-01-07', '2026-01-25', '2026-04-25'],
      label: '08:00 – 09:00'
    };

    const allocationPolicies = {
      maxSuppliersPerProduct: 5,
      maxPriceDiffPct: 25,
      allowPartial: true,
      preferredSuppliers: ['ORG-S01', 'ORG-S02'],
      maxPurchaseAmount: 0,
      minFulfillmentPct: 80,
      autoApproval: false,
      requireManualApprovalProducts: [],
      maxConcentrationPct: 70
    };

    const categories = [
      'مضادات حيوية', 'قلب وأوعية', 'سكري', 'مسكنات', 'فيتامينات', 'جهاز هضمي',
      'جهاز تنفسي', 'حساسية', 'كورتيزون', 'جلدية', 'كبد', 'مضادات تخثر',
      'نفسية', 'أعصاب', 'مسالك بولية', 'مضادات فطريات', 'مضادات فيروسات'
    ];

    const activity = [
      { id: 'ACT-001', at: daysAgo(0), textAr: 'تم نشر طلب الشراء PR-2024-009', textEn: 'Published PR-2024-009', type: 'request' },
      { id: 'ACT-002', at: daysAgo(0), textAr: 'عرض جديد من المتحدة للتوريدات', textEn: 'New offer from United Supplies', type: 'offer' },
      { id: 'ACT-003', at: daysAgo(1), textAr: 'اكتشاف نقص في 5 أصناف', textEn: 'Shortage detected for 5 products', type: 'shortage' },
      { id: 'ACT-004', at: daysAgo(2), textAr: 'تحويل مخزون إلى فرع مدينة نصر', textEn: 'Stock transfer to Nasr City', type: 'transfer' },
      { id: 'ACT-005', at: daysAgo(3), textAr: 'استلام جزئي لأمر PO-2024-005', textEn: 'Partial receipt for PO-2024-005', type: 'delivery' },
      { id: 'ACT-006', at: daysAgo(5), textAr: 'تم استيراد قائمة نواقص من Excel', textEn: 'Imported shortage list from Excel', type: 'import' },
      { id: 'ACT-007', at: daysAgo(7), textAr: 'اكتمال جلسة جرد CNT-001', textEn: 'Completed count session CNT-001', type: 'count' },
      { id: 'ACT-008', at: daysAgo(9), textAr: 'إنشاء أوامر شراء من توزيع PR-2024-001', textEn: 'POs generated from PR-2024-001', type: 'po' }
    ];

    const finance = {
      payables: [
        { supplierOrgId: 'ORG-S01', balance: 25675, overdue: 0 },
        { supplierOrgId: 'ORG-S02', balance: 14271, overdue: 0 },
        { supplierOrgId: 'ORG-S05', balance: 1380, overdue: 0 }
      ],
      receivables: [
        { customerId: 'CUS-001', balance: 3100 },
        { customerId: 'CUS-002', balance: 9000 },
        { customerId: 'CUS-005', balance: 0 }
      ],
      expenses: [
        { id: 'EXP-001', date: daysAgo(5).slice(0, 10), category: 'نقل', amount: 1200, notes: 'شحن داخلي' },
        { id: 'EXP-002', date: daysAgo(10).slice(0, 10), category: 'كهرباء', amount: 3500, notes: 'فاتورة المخزن' },
        { id: 'EXP-003', date: daysAgo(15).slice(0, 10), category: 'صيانة', amount: 800, notes: 'ثلاجات' }
      ],
      cashMovements: [
        { id: 'CSH-001', date: daysAgo(3).slice(0, 10), type: 'in', amount: 18500, notes: 'تحصيل مستشفى النور' },
        { id: 'CSH-002', date: daysAgo(4).slice(0, 10), type: 'out', amount: 8940, notes: 'سداد PO-2024-001' },
        { id: 'CSH-003', date: daysAgo(8).slice(0, 10), type: 'in', amount: 5600, notes: 'تحصيل صيدليات العز' }
      ],
      monthlyPnL: [
        { month: '2025-08', revenue: 185000, cogs: 142000, expenses: 18000, profit: 25000 },
        { month: '2025-09', revenue: 198000, cogs: 150000, expenses: 19000, profit: 29000 },
        { month: '2025-10', revenue: 210000, cogs: 158000, expenses: 20000, profit: 32000 },
        { month: '2025-11', revenue: 172000, cogs: 130000, expenses: 17500, profit: 24500 }
      ]
    };

    return {
      meta: {
        version: '1.1.0',
        seededAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        demo: true,
        feature: 'shortage_cycle'
      },
      products: PRODUCTS.map(function (p) {
        return Object.assign({}, p, { active: true, archived: false });
      }),
      organizations: orgs,
      warehouses: warehouses,
      users: users,
      inventory: inventory,
      batches: batches,
      movements: movements,
      supplierRelations: supplierRelations,
      requests: requests,
      offers: offers,
      allocations: allocations,
      purchaseOrders: purchaseOrders,
      notifications: notifications,
      customers: customers,
      salesInvoices: salesInvoices,
      shortages: shortages,
      reservations: reservations,
      transfers: transfers,
      countSessions: countSessions,
      auditLogs: auditLogs,
      subscriptions: subscriptions,
      plans: plans,
      procurementSchedule: procurementSchedule,
      allocationPolicies: allocationPolicies,
      categories: categories,
      activity: activity,
      finance: finance,
      counters: {
        request: 15,
        offer: 20,
        po: 10,
        shortage: 7,
        movement: 15,
        notification: 15,
        product: 52,
        transfer: 3,
        reservation: 3,
        inventory: inventory.length,
        count: 2
      }
    };
  }

  return { generate: generate, PRODUCTS: PRODUCTS };
})();
