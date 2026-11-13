import type { Provider } from '@/lib/types'

/**
 * Every 3 on 6 office, from the /office/* pages on the Wix site (captured Nov 6, 2026).
 * `lat`/`lng` are city-level approximations used only to sort by distance — verify before launch.
 * `wixSlug` is the old URL (/office/<wixSlug>); middleware redirects it to /office/<slug>.
 */
type Row = [slug: string, name: string, tier: Provider['tier'], doctors: string, street: string, city: string, state: string, zip: string, phone: string, website: string, lat: number, lng: number, wixSlug?: string]

const ROWS: Row[] = [
  ['smile-clinic-utah', 'Smile Clinic (Utah)', 'Platinum', 'Dr. Randy Roberts; Dr. Logan Locke', '718 Coliseum Way', 'Midvale', 'UT', '84047', '(801) 590-8694', 'https://www.smileclinicusa.com/utah', 40.620, -111.904, 'smile-clinic-(utah)'],
  ['smile-clinic-colorado', 'Smile Clinic (Colorado)', 'Platinum', 'Dr. Traver Maxwell', '3300 E 1st Ave #500', 'Denver', 'CO', '80206', '(720) 399-1447', 'https://www.smileclinicusa.com/colorado', 39.717, -104.948, 'smile-clinic-(colorado)'],
  ['smile-clinic-arizona', 'Smile Clinic (Arizona)', 'Platinum', 'Dr. Carl Fairchild', '7032 E Cochise Rd Ste A200', 'Scottsdale', 'AZ', '85253', '(480) 702-3981', 'https://www.smileclinicusa.com/arizona', 33.588, -111.928, 'smile-clinic-(arizona)'],
  ['signature-smile-arts-chicago', 'Signature Smile Arts (Magnificent Mile)', 'Platinum', 'Dr. Alex Shore', '845 N Michigan Ave', 'Chicago', 'IL', '60611', '(312) 654-1220', 'https://magmile.signaturesmilearts.com/', 41.898, -87.624],
  ['signature-smile-arts', 'Signature Smile Arts (Homewood)', 'Platinum', 'Dr. Alex Shore', '18114 Gottschalk Ave', 'Homewood', 'IL', '60430', '(312) 654-1220', 'https://www.signaturesmilearts.com/', 41.562, -87.666],
  ['all-out-dental', 'All Out Dental', 'Platinum', 'Dr. Jason Emett', '7670 W Lake Mead Blvd #130', 'Las Vegas', 'NV', '89128', '(702) 710-9006', 'https://alloutdental.com/', 36.196, -115.264],
  ['tampa-dental-implants', 'Tampa Dental Implants', 'Platinum', 'Dr. Keenan Osman', '2425 Brunello Trce', 'Lutz', 'FL', '33558', '(813) 223-5677', 'https://www.dental-implants-tampa-fl.com/', 28.151, -82.461],
  ['oliverie-dental', 'Oliverie Dental', 'Gold', 'Dr. Mary Oliverie', '1516 State Route 138, Ste 1A', 'Wall', 'NJ', '07719', '(732) 299-5535', 'https://www.oliveriedental.com/', 40.168, -74.069],
  ['j-smiles-dental-implant-studio', 'J Smiles Dental Implant Studio', 'Gold', 'Dr. Jiro', '4828 Old Spanish Trail, Unit A', 'Houston', 'TX', '77021', '(281) 407-2382', 'https://jsmilesdentalimplantstudio.com/', 29.705, -95.351],
  ['timber-ridge-dental-center', 'Timber Ridge Dental Center', 'Gold', 'Dr. Mike Stanley', '137 Prominence Ct Ste 140', 'Dawsonville', 'GA', '30534', '(706) 265-6877', 'https://timberridgedentalcenter.com/', 34.375, -84.071],
  ['friendswood-dental-group', 'Friendswood Dental Group', 'Gold', 'Dr. James Sierra', '2 Oaktree St', 'Friendswood', 'TX', '77546', '(281) 819-5729', 'https://www.friendswooddental.com/', 29.529, -95.201],
  ['poway-dental-arts', 'Poway Dental Arts', 'Gold', 'Dr. Peter Rich', '12620 Monte Vista Rd', 'Poway', 'CA', '92064', '(858) 487-4727', 'https://www.powaydentalarts.com/', 32.962, -117.036],
  ['dental-care-of-edmond', 'Dental Care of Edmond', 'Gold', 'Dr. Wendy Cate', '1308 N Kelly Ave', 'Edmond', 'OK', '73003', '(405) 216-5299', 'https://www.dentalcareofedmond.com/', 35.666, -97.462],
  ['evergreen-dental-group', 'Evergreen Dental Group', 'Silver', 'Dr. Joseph Burns', '2902 Evergreen Pkwy', 'Evergreen', 'CO', '80439', '(303) 674-5566', 'https://www.evergreendentalgroup.com/', 39.640, -105.336],
  ['reflections-dental-care', 'Reflections Dental Care', 'Silver', 'Dr. Lance Schmidt', '1108 NW 16th St', 'Oklahoma City', 'OK', '73106', '(405) 751-4556', 'https://reflectionsdentalcare.com/', 35.488, -97.528],
  ['hughes-dental-arts', 'Hughes Dental Arts Implant Center', 'Silver', 'Dr. Christopher Hughes', '504 Rushing Dr', 'Herrin', 'IL', '62948', '(618) 993-3100', 'https://www.hughesdentalarts.com/', 37.803, -89.028],
  ['palm-springs-dental', 'Palm Springs Dental', 'Silver', 'Dr. Derek Stallard', '499 E Central Pkwy #200', 'Altamonte Springs', 'FL', '32701', '(407) 831-3959', 'https://dentalaltamonte.com/', 28.664, -81.374],
  ['reclaim', 'Reclaim Dentistry', 'Silver', 'Dr. Kevin Schwandt', '7900 W 44th Ave #101', 'Wheat Ridge', 'CO', '80033', '(303) 228-5488', 'https://www.reclaimdentistry.com/', 39.776, -105.083],
  ['brilliant-smiles-bellevue', 'Brilliant Smiles Bellevue', 'Silver', 'Dr. Brian Barron', '13033 Bel-Red Rd Ste 230', 'Bellevue', 'WA', '98005', '(425) 454-1975', 'https://www.brilliantsmilesbellevue.com/', 47.626, -122.168],
  ['grand-valley-dentistry', 'Grand Valley Dentistry', 'Silver', 'Dr. Lance Dehne', '5916 Lake Michigan Dr', 'Allendale', 'MI', '49401', '(616) 895-7400', 'https://www.grandvalleydentistry.com/', 42.963, -85.924],
  ['brookside-dental', 'Brookside Dental', 'Silver', 'Dr. David Brooks', '255 E 930 S', 'Orem', 'UT', '84058', '(801) 590-8647', 'https://www.brooksidedentalutah.com/', 40.284, -111.690],
  ['nevada-oral-facial-surgery', 'Nevada Oral & Facial Surgery', 'Bronze', 'Dr. Brendan Johnson', '6950 W Smoke Ranch Rd Ste 200', 'Las Vegas', 'NV', '89128', '(702) 360-8918', 'https://nevadaoralandfacialsurgery.com/locations/las-vegas-office/', 36.205, -115.246],
  ['brighter-smile-solutions', 'Brighter Smile Solutions', 'Bronze', 'Dr. Shane Turgeon', '410 W 9 Mile Rd', 'Pensacola', 'FL', '32534', '(850) 462-5333', 'https://brightersmilesolutions.com/', 30.537, -87.226],
  ['lombard-family-dentistry', 'Lombard Family Dentistry', 'Bronze', 'Dr. Abraham Robles', '845 S Main St Suite 303', 'Lombard', 'IL', '60148', '(630) 627-0899', 'https://www.lombard-dentist.com/', 41.869, -88.016],
  ['smile-now-boise', 'Smile Now Boise', 'Bronze', 'Dr. Caleb Stott', '467 S Rivershore Ln', 'Eagle', 'ID', '83616', '(208) 792-6473', 'https://www.smilenowboise.com/', 43.690, -116.354],
  ['smile-now-tacoma', 'Smile Now Tacoma', 'Bronze', 'Dr. Tyler Tolbert', '2748 Milton Way Unit 202', 'Milton', 'WA', '98354', '(253) 343-1470', 'http://www.smilenowtacoma.com/', 47.248, -122.313],
  ['smile-now-denver', 'Smile Now Denver', 'Bronze', 'Dr. Soren Paape', '12031 Tejon St #100', 'Westminster', 'CO', '80234', '(720) 604-2312', 'https://smilenowdenver.com/', 39.914, -105.012],
  ['carabelli-dental', 'Carabelli Dental', 'Bronze', 'Dr. Keoh Ahghar', '842 N Main St', 'Roswell', 'NM', '88201', '(575) 622-4455', 'https://www.carabellidental.com/', 33.403, -104.523],
  ['madison-dentistry', 'Madison Dentistry and Implant Center', 'Bronze', 'Dr. Mohamed Ali Boukheir', '268 Main St', 'Madison', 'NJ', '07940', '(973) 822-8003', 'https://madisondentistryllc.com/', 40.759, -74.417],
  ['covington-dental', 'Covington Dental', 'Bronze', 'Dr. Ben Covington', '360 S Harvey St', 'Plymouth', 'MI', '48170', '(734) 453-2180', 'https://drcovingtondds.com/', 42.369, -83.469],
  ['bedford-dental-care', 'Bedford Dental Care', 'Bronze', 'Dr. Diego Herrera', '64 Griffin Ave', 'Bedford Hills', 'NY', '10507', '(914) 241-9205', 'https://www.bedford-smiles.com/', 41.237, -73.695],
  ['kettle-valley-family-dental', 'Kettle Valley Family Dental', 'Bronze', 'Dr. Cory Brown', 'Main St', 'Kelowna', 'BC', '', '(778) 477-0411', 'https://www.kettlevalleyfamilydental.com/', 49.832, -119.430],
  ['the-implant-center', 'The Implant Center', 'Licensed', 'Dr. Adam Marina', '511 SW 10th Ave #1102', 'Portland', 'OR', '97205', '(503) 966-2002', 'https://www.theimplantcenter.com/', 45.521, -122.682],
  ['family-dentistry-and-advanced-implant-center', 'Family Dental & Advanced Implant Center', 'Licensed', 'Dr. Patrick Peters', '1006 Leawood Dr #200', 'Frankfort', 'KY', '40601', '(502) 223-0211', 'https://familydentalcenterkyfrankfort.net/', 38.188, -84.840],
  ['pruitt-dentistry', 'Pruitt Dentistry', 'Licensed', 'Dr. Patrick Pruitt', '2835 SE 3rd Ct', 'Ocala', 'FL', '34471', '(352) 732-3985', 'https://www.pruittdentistry.com/', 29.161, -82.130],
  ['significance-dental-specialists', 'Significance Dental Specialists', 'Licensed', 'Dr. Allen Huang', '6018 S Fort Apache Rd Ste 100', 'Las Vegas', 'NV', '89148', '(702) 547-9977', 'https://www.sdsdental.com/', 36.080, -115.298],
  ['rejuvenescence-ofs', 'Rejuvenescence OFS', 'Licensed', 'Dr. Karin Davis', '3630 Savannah Pl Dr Suite 250', 'Duluth', 'GA', '30096', '(678) 562-8710', 'https://www.rejuvenescenceoms.com/', 34.002, -84.144],
  ['smile-today-atlanta', 'Smile Today Atlanta', 'Licensed', 'Dr. Cheng Gao', '4897 Buford Hwy NE Suite 122', 'Chamblee', 'GA', '30341', '(770) 452-5922', 'https://www.smiletodayatlantaga.com/', 33.890, -84.294],
  ['metro-dental-implant-studio', 'Metro Dental & Implant Studio', 'Licensed', 'Dr. Alex Fedorenko', '1 Wallis Ct', 'Lexington', 'MA', '02421', '(617) 918-7887', 'https://metroimplantstudio.com/3-on-6-dental-implants-boston', 42.447, -71.226, 'metro-dental-&-implant-studio'],
  ['silvoy-dmd', 'Silvoy DMD', 'New', 'Dr. Christopher Silvoy', '4600 Marriott Dr Ste 275', 'Raleigh', 'NC', '27612', '(919) 386-6900', 'https://silvoydmd.com/', 35.842, -78.685],
  ['bear-river-dental', 'Bear River Dental', 'New', 'Dr. Nate Lester', '50 Park Rd', 'Evanston', 'WY', '82930', '(307) 789-5608', 'https://www.bearriverdental.com/', 41.268, -110.963],
  ['white-plains-implants', 'White Plains Implants', 'New', 'Dr. Jeffrey Schoengold', '435 North St', 'White Plains', 'NY', '10605', '(914) 745-7762', 'https://whiteplainsimplants.com/', 41.040, -73.748],
  ['drake-family-dentistry', 'Drake Family Dentistry', 'New', 'Dr. Jed Burton', '2319 E Tyler Ave', 'Harlingen', 'TX', '78550', '(956) 450-8433', 'https://drakefamilydentistry.com/', 26.193, -97.669],
  ['roots-dental', 'Roots Dental', 'New', 'Dr. Hamed Salhab', '184 Pompton Ave', 'Verona', 'NJ', '07044', '(973) 779-3771', 'https://www.rootsdentalnj.com/', 40.833, -74.236],
  ['about-face-oral-and-facial-surgery', 'About Face Oral & Facial Surgery', 'New', 'Dr. Porchia James', '12398 FM 423 #200', 'Frisco', 'TX', '75033', '(214) 705-1660', 'http://www.aboutfacesurgery.com/', 33.176, -96.883],
  ['elgin-dental-implants', 'Elgin Dental Implants', 'New', 'Dr. Samer Elbatanouny', '1670 Capital St Suite 501', 'Elgin', 'IL', '60124', '(847) 996-9166', 'https://elgindentalimplants.com/', 42.044, -88.343],
  ['smiles-for-life-dental-care', 'Smiles For Life Dental Care', 'New', 'Dr. Dan Whiting', '115 Oakwood Dr', 'Bridgewater', 'VA', '22812', '(540) 828-2312', 'https://www.smiles4lifedental.com/', 38.382, -78.971],
  ['smile-makers-dental-care', 'Smile Makers Dental Care', 'New', 'Dr. Gavin Ewing', '901 Sun Valley Blvd Ste 240', 'Concord', 'CA', '94520', '(925) 685-9339', 'https://www.smilemaker1.com/', 37.963, -122.056],
]

const e164 = (p: string) => '+1' + p.replace(/\D/g, '')
export const providers: Provider[] = ROWS.map(([slug, name, tier, doctors, street, city, state, zip, phone, website, lat, lng, wixSlug], i) => ({
  slug, name, tier, doctors: doctors.split('; '), street, city, state, zip, phoneDisplay: phone, phoneE164: e164(phone), website, lat, lng,
  wixSlug: wixSlug || slug, order: i,
}))
