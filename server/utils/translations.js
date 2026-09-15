/**
 * Multi-Language Dictionary & Rural Friendly Messaging Support
 * Languages: English (en), Hindi (hi), Marathi (mr), Gujarati (gu)
 */

export const TRANSLATIONS = {
  en: {
    appName: 'AgriConnect',
    tagline: 'Farm to Fork, Directly.',
    welcome: 'Welcome to AgriConnect',
    loginSuccess: 'Login successful',
    otpSent: 'Verification OTP sent to registered mobile',
    kycVerified: 'Aadhaar Identity Verified. Full marketplace features unlocked.',
    weatherAlert: 'Local agricultural weather advisory updated.',
    orderPlaced: 'Order placed successfully. Payment secured in Escrow.',
    orderDelivered: 'Produce delivered and inspected. Escrow released to Farmer.',
    commissionDeducted: 'Order processing and quality verification confirmed.',
    hubConnected: 'Connected to local Taluka Distribution Centre.',
  },
  hi: {
    appName: 'एग्रीकनेक्ट',
    tagline: 'सीधे खेत से थाली तक।',
    welcome: 'एग्रीकनेक्ट में आपका स्वागत है',
    loginSuccess: 'लॉगिन सफल रहा',
    otpSent: 'पंजीकृत मोबाइल पर सत्यापन ओटीपी भेजा गया',
    kycVerified: 'आधार पहचान सत्यापित। बाज़ार की सभी सुविधाएं उपलब्ध हैं।',
    weatherAlert: 'स्थानीय कृषि मौसम सलाह अपडेट की गई।',
    orderPlaced: 'ऑर्डर सफलतापूर्वक दिया गया। एस्क्रो में भुगतान सुरक्षित।',
    orderDelivered: 'फसल की डिलीवरी और जांच पूरी। किसान को भुगतान जारी।',
    commissionDeducted: 'ऑर्डर प्रसंस्करण एवं गुणवत्ता सत्यापन सुनिश्चित किया गया।',
    hubConnected: 'स्थानीय तालुका वितरण केंद्र से जुड़े।',
  },
  mr: {
    appName: 'अॅग्रीकनेक्ट',
    tagline: 'थेट शेतातून ग्राहकाच्या दारापर्यंत.',
    welcome: 'अॅग्रीकनेक्ट मध्ये आपले स्वागत आहे',
    loginSuccess: 'लॉगिन यशस्वी झाले',
    otpSent: 'नोंदणीकृत मोबाईलवर ओटीपी पाठवला गेला',
    kycVerified: 'आधार ओळख पडताळणी पूर्ण झाली. सर्व सेवा उपलब्ध.',
    weatherAlert: 'स्थानिक कृषी हवामान अंदाज अद्यतनित केला.',
    orderPlaced: 'मागणी यशस्वीरित्या नोंदवली. रक्कम एस्क्रोमध्ये सुरक्षित.',
    orderDelivered: 'माल पोहोचला आणि तपासला गेला. शेतकऱ्याला पैसे वर्ग केले.',
    commissionDeducted: 'मागणी प्रक्रिया व गुणवत्ता पडताळणी पूर्ण.',
    hubConnected: 'स्थानिक तालुका वितरण केंद्राशी जोडले गेले.',
  },
  gu: {
    appName: 'એગ્રીકનેક્ટ',
    tagline: 'સીધા ખેતરથી ગ્રાહક સુધી.',
    welcome: 'એગ્રીકનેક્ટમાં તમારું સ્વાગત છે',
    loginSuccess: 'લૉગિન સફળ થયું',
    otpSent: 'નોંધાયેલા મોબાઇલ પર OTP મોકલવામાં આવ્યો',
    kycVerified: 'આધાર ઓળખ ચકાસણી પૂર્ણ. બજારની સંપૂર્ણ સુવિધાઓ સક્રિય.',
    weatherAlert: 'સ્થાનિક કૃષિ હવામાન સલાહ અદ્યતન કરાઈ.',
    orderPlaced: 'ઓર્ડર સફળતાપૂર્વક મૂકાયો. ચુકવણી એસ્ક્રોમાં સુરક્ષિત.',
    orderDelivered: 'ઉત્પાદન વિતરિત અને ચકાસાયેલું. ખેડૂતને ચુકવણી જારી.',
    commissionDeducted: 'ઓર્ડર પ્રોસેસિંગ અને ગુણવત્તા ચકાસણી પૂર્ણ થઈ.',
    hubConnected: 'સ્થાનિક તાલુકા વિતરણ કેન્દ્ર સાથે જોડાયેલ.',
  },
};

/**
 * Get localized string by key and language code
 */
export const getMessage = (key, lang = 'en') => {
  const selectedLang = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  return selectedLang[key] || TRANSLATIONS['en'][key] || key;
};
