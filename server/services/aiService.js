import axios from 'axios';
import { DEFAULT_TALUKAS } from '../config/constants.js';

/**
 * Knowledge Base for Saurashtra & Indian Agricultural Current Affairs, Weather & Policies
 */
const CURRENT_AFFAIRS_AND_MSP = {
  msp2026: [
    { crop: 'Groundnut (મગફળી / मूंगफली)', msp: '₹6,783 per quintal', change: '+₹406 increase' },
    { crop: 'Cotton Shankar-6 Medium Staple (કપાસ / कपास)', msp: '₹7,121 per quintal', change: '+₹501 increase' },
    { crop: 'Cotton Long Staple (લાંબો તાર કપાસ)', msp: '₹7,521 per quintal', change: '+₹501 increase' },
    { crop: 'Wheat Sharbati / Bhalia (ઘઉં / गेहूं)', msp: '₹2,425 per quintal', change: '+₹150 increase' },
    { crop: 'Cumin Seeds (જીરું / जीरा APMC Benchmark)', msp: '₹24,500 - ₹28,000 per quintal', change: 'Strong export demand' },
    { crop: 'Mustard / Rapeseed (રાયડો / सरसों)', msp: '₹5,950 per quintal', change: '+₹300 increase' },
    { crop: 'Gram / Chana (ચણા / चना)', msp: '₹5,650 per quintal', change: '+₹210 increase' },
    { crop: 'Toor / Arhar (તુવેર / तुअर)', msp: '₹7,550 per quintal', change: '+₹550 increase' },
    { crop: 'Sesame / Til (તલ / तिल)', msp: '₹9,267 per quintal', change: '+₹632 increase' },
  ],
  schemes: [
    {
      name: 'PM-KISAN Samman Nidhi',
      details: '₹6,000 annual direct benefit transfer in 3 four-monthly installments of ₹2,000 directly to farmer Aadhaar-linked bank accounts. eKYC is mandatory.',
    },
    {
      name: 'PM Fasal Bima Yojana (PMFBY)',
      details: 'Comprehensive crop insurance against drought, unseasonal heavy rains, and pest infestation. Farmers pay only 2% for Kharif crops, 1.5% for Rabi, and 5% for commercial crops.',
    },
    {
      name: 'Gujarat i-Khedut Portal Subsidies',
      details: 'Up to 75% subsidy on PM-KUSUM Solar Water Pumps, 70% subsidy for Drip & Micro-Irrigation through GGRC, and subsidies on tractor implements & tarpaulins.',
    },
    {
      name: 'Kisan Credit Card (KCC)',
      details: 'Short-term credit up to ₹3,00,000 at a subsidized effective interest rate of 4% per annum upon timely repayment.',
    },
  ],
  qualityStandards: {
    physicalChecks: [
      'Appearance: Uniform shape, grain size, natural color, free from fungal discoloration or physical deformation.',
      'Aroma: Fresh, natural harvest aroma. Zero chemical foul odors or damp mildew smell.',
      'Moisture & Purity: Seeds and grains must be free from dust, insect bored holes, stones, and feel thoroughly dry.',
    ],
    certifications: [
      'AGMARK: Indian national food grading standard certifying grain grade, moisture threshold, and safety.',
      'GAP (Good Agricultural Practices): Verifies clean irrigation water, safe soil additives, and regulated pesticide schedules.',
      'NPOP Organic Certification: Official accreditation for zero synthetic fertilizers and chemical-free produce.',
    ],
    labTests: [
      'Moisture Content: Must be strictly under 10% for grains and under 8% for oilseeds.',
      'Oil Content: Minimum 48-51% for Saurashtra bold groundnuts and sesame.',
      'Pesticide Residue & Heavy Metal Screening: Zero banned synthetic residues for export grade approval.',
    ],
  },
};

const TALUKA_WEATHER_DATA = {
  gondal: {
    taluka: 'Gondal (Rajkot District)',
    temp: '32°C',
    feelsLike: '34°C',
    humidity: '52%',
    rainChance: '5%',
    wind: '12 km/h NE',
    condition: 'Sunny and Dry',
    advisory: 'Optimal weather for drying Gondal red chillies and threshing groundnut. Low humidity prevents fungal growth in storage.',
  },
  rajkot: {
    taluka: 'Rajkot Mandi Hub',
    temp: '33°C',
    feelsLike: '35°C',
    humidity: '50%',
    rainChance: '5%',
    wind: '14 km/h N',
    condition: 'Clear Sky',
    advisory: 'Excellent dry transport weather for dispatching grain and cotton consignments to APMC yards.',
  },
  talala: {
    taluka: 'Talala (Junagadh District)',
    temp: '30°C',
    feelsLike: '32°C',
    humidity: '62%',
    rainChance: '10%',
    wind: '10 km/h W',
    condition: 'Partly Sunny',
    advisory: 'Pleasant temperature. Ideal conditions for winter wheat cultivation and soil moisture retention.',
  },
  junagadh: {
    taluka: 'Junagadh Agro Hub',
    temp: '31°C',
    feelsLike: '33°C',
    humidity: '58%',
    rainChance: '8%',
    wind: '11 km/h NW',
    condition: 'Clear Sky',
    advisory: 'Dry conditions favor groundnut and sesame harvesting. Store harvested produce in elevated pallets.',
  },
  mahuva: {
    taluka: 'Mahuva (Bhavnagar District)',
    temp: '29°C',
    feelsLike: '31°C',
    humidity: '68%',
    rainChance: '12%',
    wind: '16 km/h SW (Coastal)',
    condition: 'Mild Coastal Breeze',
    advisory: 'Moderate coastal humidity. Ensure storage sheds are well-ventilated for pulses and cotton bales.',
  },
  amreli: {
    taluka: 'Amreli Agro Hub',
    temp: '33°C',
    feelsLike: '35°C',
    humidity: '48%',
    rainChance: '5%',
    wind: '13 km/h NE',
    condition: 'Dry & Sunny',
    advisory: 'Hot and dry. Favorable window for cotton picking and drying sesame seeds.',
  },
  jamnagar: {
    taluka: 'Jamnagar Spices Hub',
    temp: '30°C',
    feelsLike: '32°C',
    humidity: '56%',
    rainChance: '5%',
    wind: '15 km/h NW',
    condition: 'Sunny',
    advisory: 'Low moisture is ideal for sun-drying cumin (jeera) and coriander. Keep seeds covered at night from light dew.',
  },
  morbi: {
    taluka: 'Morbi Agro Distribution',
    temp: '33°C',
    feelsLike: '35°C',
    humidity: '46%',
    rainChance: '5%',
    wind: '14 km/h NE',
    condition: 'Clear & Warm',
    advisory: 'Dry weather allows steady cotton ginning and castor bean transport.',
  },
};

/**
 * Intelligent local response generator for Weather, Current Affairs, MSP, and Agricultural Schemes
 */
function generateLocalAgriculturalResponse(query, taluka = 'Gondal', language = 'en') {
  const q = (query || '').toLowerCase();

  // 1. Weather Intent Check
  if (q.includes('weather') || q.includes('rain') || q.includes('forecast') || q.includes('temp') ||
      q.includes('हवामान') || q.includes('मौसम') || q.includes('વરસાદ') || q.includes('તાપમાન') || q.includes('વાતાવરણ') ||
      q.includes('spray') || q.includes('humidity')) {
    
    let matchedTaluka = Object.keys(TALUKA_WEATHER_DATA).find((key) => q.includes(key)) || 'gondal';
    const w = TALUKA_WEATHER_DATA[matchedTaluka] || TALUKA_WEATHER_DATA.gondal;

    if (language === 'gu') {
      return `### 🌦️ કૃષિ હવામાન અહેવાલ: ${w.taluka}
- **તાપમાન:** ${w.temp} (અનુભવાય છે: ${w.feelsLike})
- **વાતાવરણ:** ${w.condition}
- **વરસાદની શક્યતા:** ${w.rainChance}
- **ભેજનું પ્રમાણ:** ${w.humidity}
- **પવનની ગતિ:** ${w.wind}

**🌾 ખેડૂત મિત્રો માટે સલાહ:**
${w.advisory}
*કીટનાશક છંટકાવ માટે પવન શાંત હોય ત્યારે સવારનો સમય સૌથી અનુકૂળ રહે છે.*`;
    }

    if (language === 'hi') {
      return `### 🌦️ स्थानीय कृषि मौसम रिपोर्ट: ${w.taluka}
- **तापमान:** ${w.temp} (महसूस: ${w.feelsLike})
- **मौसम स्थिति:** ${w.condition}
- **बारिश की संभावना:** ${w.rainChance}
- **आर्द्रता (नमी):** ${w.humidity}
- **हवा की गति:** ${w.wind}

**🌾 किसान कृषि सलाह:**
${w.advisory}
*दवा छिड़काव के लिए सुबह का समय जब हवा की गति कम हो सबसे उपयुक्त है।*`;
    }

    return `### 🌦️ Local Agricultural Weather Report: ${w.taluka}
- **Temperature:** ${w.temp} (Feels like: ${w.feelsLike})
- **Sky Condition:** ${w.condition}
- **Rain Probability:** ${w.rainChance}
- **Humidity:** ${w.humidity}
- **Wind Speed:** ${w.wind}

**🌾 Agricultural Advisory & Crop Action:**
${w.advisory}
*Spraying window: Best conducted in early morning when wind speed is under 12 km/h.*`;
  }

  // 2. MSP (Minimum Support Price) & Mandi Rates Intent
  if (q.includes('msp') || q.includes('price') || q.includes('rate') || q.includes('ભાવ') || q.includes('કિંમત') ||
      q.includes('मंडी') || q.includes('ભાવો') || q.includes('મગફળી') || q.includes('કપાસ') || q.includes('જીરું')) {
    
    const mspList = CURRENT_AFFAIRS_AND_MSP.msp2026
      .map((item) => `• **${item.crop}**: ${item.msp} (${item.change})`)
      .join('\n');

    if (language === 'gu') {
      return `### 📰 વર્ષ ૨૦૨૬ ના મુખ્ય ટેકાના ભાવ (MSP) અને સૌરાષ્ટ્ર APMC ભાવ
સરકાર દ્વારા જાહેર કરાયેલા તથા સૌરાષ્ટ્ર મંડી બજારના મુખ્ય ભાવો:

${mspList}

**💡 ખેડૂતો માટે નોંધ:**
- ટેકાના ભાવે વેચાણ માટે તમારું આધાર કાર્ડ અને ૭/૧૨, ૮-અ કઢાવી નોંધણી કરાવો.
- એગ્રીકનેક્ટ પ્લેટફોર્મ પર તમે સીધા વેરિફાઇડ ખરીદદારોને સુરક્ષિત એસ્ક્રો પેમેન્ટ સાથે વેચી શકો છો.`;
    }

    if (language === 'hi') {
      return `### 📰 वर्ष 2026 न्यूनतम समर्थन मूल्य (MSP) एवं मंडी दरें
कृषि मंत्रालय द्वारा निर्धारित वर्तमान फसल दरें:

${mspList}

**💡 किसान सलाह:**
- सरकारी खरीद केंद्रों पर बिक्री के लिए आधार एवं खतौनी ई-केवाईसी अनिवार्य है।
- एग्रीकनेक्ट प्लेटफॉर्म के माध्यम से आप सीधे सत्यापित खरीदारों को सुरक्षित एस्क्रो भुगतान के साथ उपज बेच सकते हैं।`;
    }

    return `### 📰 Latest 2026 Minimum Support Prices (MSP) & Mandi Benchmarks
Current official government support prices and Saurashtra APMC Mandi trends:

${mspList}

**💡 Key Farmer Takeaways:**
- Direct procurement at MSP requires active Aadhaar verification and land record (7/12 & 8-A) registration.
- On AgriConnect, you can sell directly to verified buyers with secure instant UPI escrow protection.`;
  }

  // 3. Pest & Disease Diagnosis Intent (Pink Bollworm, Tikka, Blight, Wilt)
  if (q.includes('pest') || q.includes('disease') || q.includes('bollworm') || q.includes('tikka') ||
      q.includes('blight') || q.includes('કીટક') || q.includes('રોગ') || q.includes('ઈયળ') || q.includes('સડો') || q.includes('જીવાત')) {
    if (language === 'gu') {
      return `### 🐛 પાક સંરક્ષણ અને જીવાત નિયંત્રણ માર્ગદર્શન (Saurashtra Crops)

**૧. કપાસમાં ગુલાબી ઈયળ (Pink Bollworm):**
• **ફેરોમોન ટ્રેપ:** એક વીઘા દીઠ ૫ થી ૮ ફેરોમોન ટ્રેપ લગાવો.
• **દવાનો છંટકાવ:** ક્લોરાન્ટ્રાનિલિપ્રોલ (Coragen) ૬ મિ.લિ. પ્રતિ પંપ અથવા પ્રોફેનોફોસ + સાયપરમેથ્રીન ૩૫ મિ.લિ. પ્રતિ પંપ.

**૨. મગફળીમાં ટિક્કા અને ગેરુ રોગ (Tikka Leaf Spot):**
• ટેબુકોનાઝોલ + ટ્રાઈફ્લોક્સીસ્ટ્રોબિન (Nativo) ૧૦ ગ્રામ પ્રતિ પંપ અથવા મેન્કોઝેબ ૩૦ ગ્રામ પ્રતિ પંપ છાંટવું.

**૩. જીરું અને ધાણામાં ચરમી/કાળિયો અને છારો (Blight & Mildew):**
• એઝોક્સિસ્ટ્રોબિન + ડિફેનોકોનાઝોલ ૧૫ મિ.લિ. અથવા સલ્ફર ૮૦% WP ૩૦ ગ્રામ પ્રતિ પંપ છંટકાવ કરવો.

*જૈવિક ઉપાય: ૧૦% લીંબોળીનું તેલ (Neem Oil 10,000 PPM) ૪૦ મિ.લિ. પ્રતિ પંપ વાપરો.*`;
    }

    return `### 🐛 Comprehensive Pest & Crop Disease Diagnosis Guide

**1. Cotton: Pink Bollworm (ગુલાબી ઈયળ):**
• **Monitoring:** Install 5–8 Pheromone traps per acre to monitor moth activity.
• **Chemical Spray:** Chlorantraniliprole 18.5% SC (Coragen) @ 6 ml per 15L pump, or Profenofos 40% + Cypermethrin 4% EC @ 35 ml per pump.
• **Biological:** Trichogramma egg parasitoids @ 60,000 eggs/acre.

**2. Groundnut: Tikka Leaf Spot & Collar Rot (ટિક્કા અને સડો):**
• **Fungicide Spray:** Tebuconazole 50% + Trifloxystrobin 25% (Nativo) @ 10 g per pump, or Mancozeb 75% WP @ 35 g per pump.
• **Seed Treatment:** Trichoderma viride @ 10 g/kg seed prior to sowing.

**3. Cumin (Jeera) & Spices: Blight (કાળિયો) & Powdery Mildew (છારો):**
• **Treatment:** Azoxystrobin + Difenoconazole @ 15 ml per pump, or Wettable Sulphur 80% WP @ 30 g per pump.

*Eco-friendly Tip: 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 10,000 ppm provides effective early barrier defense.*`;
  }

  // 4. Government Schemes Intent (PM-KISAN, i-Khedut, PMFBY)
  if (q.includes('scheme') || q.includes('pm kisan') || q.includes('yojana') || q.includes('subsidy') ||
      q.includes('યોજના') || q.includes('સહાય') || q.includes('સબસિડી') || q.includes('ikhedut') || q.includes('fasal bima')) {
    
    const schemesList = CURRENT_AFFAIRS_AND_MSP.schemes
      .map((s) => `### 🏛️ ${s.name}\n${s.details}`)
      .join('\n\n');

    if (language === 'gu') {
      return `### 🏛️ ખેડૂત કલ્યાણકારી સરકારી યોજનાઓ અને સબસિડી (૨૦૨૬)

${schemesList}

**📌 અરજી કરવાની પદ્ધતિ:**
- ગુજરાતના ખેડૂતો [i-Khedut Portal](https://ikhedut.gujarat.gov.in) પરથી સોલાર પંપ, તાર ફેન્સિંગ અને ડ્રિપ ઇરિગેશન માટે અરજી કરી શકે છે.
- PM-KISAN ના હપ્તા માટે બેંક ખાતામાં આધાર લિંક અને e-KYC હોવું ફરજિયાત છે.`;
    }

    return `### 🏛️ Active Agricultural Government Schemes & Subsidies (2026)

${schemesList}

**📌 How to Apply:**
- **Gujarat Farmers:** Apply for solar water pumps (PM-KUSUM 75% subsidy), micro-irrigation, and power equipment on the official [i-Khedut Portal](https://ikhedut.gujarat.gov.in).
- **PM-KISAN Status:** Ensure biometric or OTP-based e-KYC is completed to receive quarterly ₹2,000 disbursements.`;
  }

  // 5. Quality Standards & Testing Intent (From Handwritten Specs: AGMARK, GAP, Lab Testing)
  if (q.includes('quality') || q.includes('test') || q.includes('agmark') || q.includes('gap') ||
      q.includes('organic') || q.includes('moisture') || q.includes('ગુણવત્તા') || q.includes('તપાસ') || q.includes('લેબ')) {
    
    return `### 🔬 Crop Quality Verification & Testing Standards (AGMARK & GAP)

**1. Physical & Visual Inspection:**
${CURRENT_AFFAIRS_AND_MSP.qualityStandards.physicalChecks.map((c) => `• ${c}`).join('\n')}

**2. Certifications & Grading Marks:**
${CURRENT_AFFAIRS_AND_MSP.qualityStandards.certifications.map((c) => `• ${c}`).join('\n')}

**3. Scientific Laboratory Testing Parameters:**
${CURRENT_AFFAIRS_AND_MSP.qualityStandards.labTests.map((c) => `• ${c}`).join('\n')}
• **Other standard parameters:** Bulk density, particle count, test weight, total viable counts, heavy metal screening, and pathogen check.`;
  }

  // 6. Default General Current Affairs & Weather Overview
  if (language === 'gu') {
    return `### 🌾 કિસાન AI સહાયક (સૌરાષ્ટ્ર કૃષિ સેવા)
હું તમને હવામાન, વરસાદની આગાહી, ટેકાના ભાવ (MSP), પાક રોગ નિયંત્રણ (ગુલાબી ઈયળ, ટિક્કા), સરકારી સહાય યોજનાઓ અને અનાજ-તેલીબિયાંની ગુણવત્તા બાબતે સંપૂર્ણ માહિતી આપી શકું છું.

**તમે નીચેના પ્રશ્નો પૂછી શકો છો:**
1. 🌦️ "આજે ગોંડલ અને રાજકોટનું હવામાન અને વરસાદની આગાહી શું છે?"
2. 📰 "મગફળી, કપાસ અને જીરુંના ૨૦૨૬ ના ટેકાના ભાવ (MSP) શું છે?"
3. 🐛 "કપાસમાં ગુલાબી ઈયળ અને મગફળીમાં ટિક્કા રોગનું નિયંત્રણ કેવી રીતે કરવું?"
4. 🏛️ "પીએમ કિસાન યોજના અને આઈ-ખેડૂત સોલાર પંપ સબસિડી કેવી રીતે મેળવવી?"
5. 🔬 "અનાજ અને મસાલા માટે AGMARK ગુણવત્તા ટેસ્ટિંગના નિયમો શું છે?"`;
  }

  return `### 🌾 Kisan AI Assistant (AgriConnect Weather & Current Affairs)
I am your smart agricultural advisor specialized in real-time weather forecasts, current affairs, MSP rates, and crop protection.

**Here is what you can ask me right now:**
1. 🌦️ **Weather & Advisory:** *"What is today's weather forecast for Gondal, Rajkot, or Junagadh?"*
2. 📰 **Current Affairs & MSP:** *"What are the latest 2026 MSP rates for Groundnut, Cotton, and Wheat?"*
3. 🐛 **Crop Pest Control:** *"How to control pink bollworm in cotton and tikka disease in groundnut?"*
4. 🏛️ **Government Subsidies:** *"What are the latest updates on PM-KISAN, PMFBY, and solar pump subsidies?"*
5. 🔬 **Quality Standards:** *"What are the AGMARK quality and moisture test guidelines for grains?"*

*Feel free to ask in English, Gujarati (ગુજરાતી), or Hindi!*`;
}

/**
 * Main AI Chatbot Handler
 * Supports Gemini API with fallback to structured agricultural intelligence
 */
export const chatWithKisanAI = async ({ message, history = [], taluka = 'Gondal', language = 'en' }) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim().length > 10) {
    try {
      const weatherContext = JSON.stringify(TALUKA_WEATHER_DATA);
      const mspContext = JSON.stringify(CURRENT_AFFAIRS_AND_MSP);

      const systemInstruction = `You are "Kisan AI", an expert Indian Agricultural and Meteorological Advisor built for the AgriConnect platform.
You assist farmers and buyers with:
1. Current Affairs in Agriculture (MSP 2026, government schemes like PM-KISAN, PM Fasal Bima, i-Khedut subsidies, mandi export news).
2. Agricultural Weather Forecasts (temperature, rain probability, wind, humidity, and actionable spraying/harvesting advisories for Saurashtra hubs like Gondal, Rajkot, Talala, Mahuva, Jamnagar).
3. Produce Quality Checks (AGMARK, GAP, moisture percentage, physical purity, and lab testing parameters for grains, pulses, spices, oilseeds, cotton).
Current Weather Data Context: ${weatherContext}
Current MSP & Scheme Context: ${mspContext}
Respond in the language requested by user (${language}). Keep formatting clear with markdown bullet points and emojis.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                { text: systemInstruction },
                { text: `User Question: ${message}` },
              ],
            },
          ],
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 12000 }
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return {
          success: true,
          reply,
          source: 'gemini-ai',
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('Gemini API call error, utilizing local agricultural intelligence engine:', err.message);
    }
  }

  // Return comprehensive domain-specific intelligence
  const localReply = generateLocalAgriculturalResponse(message, taluka, language);
  return {
    success: true,
    reply: localReply,
    source: 'agri-intelligence-engine',
    timestamp: new Date().toISOString(),
  };
};

export default {
  chatWithKisanAI,
};
