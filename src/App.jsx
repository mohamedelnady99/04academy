import { useState } from 'react';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { FiGlobe } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCreditCard } from 'react-icons/fa';
import { SiSepa } from 'react-icons/si';
import { Button } from '@mui/material';
import translations from './translations.js'; // Assuming translations are in a separate JSON file
import arbFlag from "../public/sudy.png";
import engFlag from "../public/eng.png";

function App() {
  const [lang, setLang] = useState('en');
  const [formData, setFormData] = useState({
    email: '',
    parentEmail: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    streetNumber: '',
    postalCode: '',
    city: '',
    country: '',
    paymentMethod: 'card',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    acceptTerms: false
  });



  const [errors, setErrors] = useState({});
  const t = translations[lang];
  const [sessions, setSessions] = useState(4);
  const plans = [
    { label: "6 MONTHS", months: 6, sessions: 8, price: 29.6, discount: 4 },
    { label: "9 MONTHS", months: 9, sessions: 8, price: 31.2, discount: 5 },
    { label: "12 MONTHS", months: 12, sessions: 8, price: 40.0, discount: 6 },
    { label: "18 MONTHS", months: 18, sessions: 8, price: 48.0, discount: 7 },
    { label: "24 MONTHS", months: 24, sessions: 8, price: 75.0, discount: 8 },
    { label: "36 MONTHS", months: 36, sessions: 8, price: 90.0, discount: 9 },
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[0]);
  const [payInAdvance, setPayInAdvance] = useState(false);

  const discountedPrice =
    selectedPlan.price - (selectedPlan.price * selectedPlan.discount) / 100;

  const finalPrice = payInAdvance
    ? discountedPrice * 0.97 // خصم إضافي 3%
    : discountedPrice;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
      case 'parentEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return value ? (emailRegex.test(value) ? '' : t.invalidEmail) : t.required;
      case 'phone':
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        return value ? (phoneRegex.test(value) ? '' : t.invalidPhone) : t.required;
      case 'firstName':
      case 'lastName':
      case 'address':
      case 'city':
      case 'country':
      case 'cardHolder':
        return value ? '' : t.required;
      case 'cardNumber':
        const cardRegex = /^[0-9]{13,19}$/;
        return value ? (cardRegex.test(value) ? '' : 'Invalid card number') : t.required;
      case 'expiry':
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        return value ? (expiryRegex.test(value) ? '' : 'Invalid format (MM/YY)') : t.required;
      case 'cvc':
        const cvcRegex = /^[0-9]{3,4}$/;
        return value ? (cvcRegex.test(value) ? '' : 'Invalid CVC') : t.required;
      default:
        return value ? '' : t.required;
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'streetNumber' && field !== 'postalCode') { // Optional fields
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t.required;
    }

    setErrors(newErrors);

    // Submit if no errors
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Add form submission logic here
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center rounded-2xl bg-slate-700 p-4`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Language Switcher */}
      <div className={`w-full flex ${lang === 'ar' ? 'justify-start' : 'justify-end'} mb-4`}>
        <button
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-200 w-fit min-w-[120px] h-10"
        >
          <FiGlobe className="text-blue-500 text-lg" />
          <span className="text-sm font-medium">
            {lang === 'en' ? 'العربية' : 'English'}
          </span>
          {lang === 'en' ? (
            <img src={arbFlag} alt="العربية" className="w-6 h-4 object-cover rounded-sm" />
          ) : (
            <img src={engFlag} alt="English" className="w-6 h-4 object-cover rounded-sm" />
          )}
        </button>
      </div>

      <section className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        {/* Registration Form */}
        <div className="flex-1 p-6 md:border-r border-gray-200">
          <h2 className="text-xl text-black text-center font-bold mb-1">{t.register}</h2>
          <p className="text-center text-gray-500 mb-8">{t.summary}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="firstName" className="block mb-1 text-sm font-medium">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                  placeholder={t.firstName}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="col-span-2 md:col-span-1">
                <label htmlFor="lastName" className="block mb-1 text-sm font-medium">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                  placeholder={t.lastName}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                {t.studentPhone}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                placeholder="+971123456789"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* parent Phone Number */}
             <div>
              <label htmlFor="phonep" className="block mb-1 text-sm font-medium">
                {t.parentPhone}
              </label>
              <input
                type="tel"
                id="phonep"
                name=" parent phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                placeholder="+971123456789"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>


            {/* Email and Parent Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                {t.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            


            {/* Billing Address */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                {t.address}
              </label>
              <div className="flex gap-2">
                <div className="flex-grow">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t.streetAddress}
                    className={`bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                  />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                </div>
                <div className="w-20">
                  <input
                    type="text"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    placeholder={t.streetNumber}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder={t.postalCode}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder={t.city}
                  className={`bg-gray-50 border ${errors.city ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
              </div>
              <div>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`bg-gray-50 border ${errors.country ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg w-full p-2.5`}
                >
                  <option value="">{t.country}</option>
                  {t.countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
              </div>
            </div>

            {/* Monthly Sessions */}
            <div>
              <label htmlFor="sessions" className="block mb-1 text-sm font-medium">
                {t.sessions}
              </label>
              <select
                id="sessions"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                value={selectedPlan.months}
                onChange={(e) => {
                  const months = parseInt(e.target.value);
                  const plan = plans.find(p => p.months === months);
                  if (plan) setSelectedPlan(plan);
                }}
              >
                {plans.map(plan => (
                  <option key={plan.months} value={plan.months}>
                    {plan.months} {t.months}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block mb-1 text-sm font-medium">
                {t.payment}
              </label>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="sepa"
                    checked={formData.paymentMethod === 'sepa'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <SiSepa className="text-blue-800 text-xl" />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <div className="flex gap-1 text-2xl text-gray-700">
                    <FaCcVisa />
                    <FaCcMastercard />
                    <FaCcAmex />
                  </div>
                </label>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleInputChange}
                    placeholder={t.cardHolder}
                    className={`w-full bg-gray-50 border ${errors.cardHolder ? 'border-red-500' : 'border-gray-300'} p-2.5 rounded-md text-sm`}
                  />
                  {errors.cardHolder && <p className="mt-1 text-xs text-red-500">{errors.cardHolder}</p>}

                  <div className={`flex items-center bg-gray-50 border ${errors.cardNumber || errors.expiry || errors.cvc ? 'border-red-500' : 'border-gray-300'} p-2.5 rounded-md text-sm gap-2`}>
                    <FaCreditCard className="text-gray-400 text-lg" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder={t.cardNumber}
                      className="flex-grow bg-transparent outline-none"
                    />
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder={t.expiry}
                      className="w-20 bg-transparent outline-none"
                    />
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder={t.cvc}
                      className="w-14 bg-transparent outline-none"
                    />
                  </div>
                  <div className="flex text-xs text-red-500">
                    <div className="flex-grow">
                      {errors.cardNumber && <span>{errors.cardNumber}</span>}
                    </div>
                    <div className="w-20 text-center">
                      {errors.expiry && <span>{errors.expiry}</span>}
                    </div>
                    <div className="w-14 text-center">
                      {errors.cvc && <span>{errors.cvc}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="flex-1 p-6 bg-gray-100 rounded-r-lg">
          <h3 className="font-bold mb-4">{t.order}</h3>
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow space-y-4 text-sm">
            {/* Plan Selector */}
            <div className="grid grid-cols-3 gap-2">
              {plans.map((plan) => (
                <button
                  key={plan.label}
                  onClick={() => handlePlanSelect(plan)}
                  className={`p-2 border rounded text-center ${selectedPlan.label === plan.label
                    ? "bg-blue-500 text-blue-800"
                    : "bg-gray-100"
                    }`}
                >
                  {plan.label}
                </button>
              ))}
            </div>

            {/* Pay in advance toggle */}
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={payInAdvance}
                onChange={() => setPayInAdvance(!payInAdvance)}
                className="rounded"
              />
              {t.payAdvance}
            </label>

            {/* Pricing Overview */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.numberSessions}</span>
                <span className="font-medium">{selectedPlan.sessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 ">{t.regularPrice}</span>
                <span className="line-through">{selectedPlan.price.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.yourPrice}</span>
                <span>{discountedPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>
                  {t.discount} {selectedPlan.discount}%
                </span>
                <span>
                  -{(selectedPlan.price - discountedPrice).toFixed(2)}€
                </span>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex justify-between text-blue-600 font-semibold">
                <span>{t.setupFee}</span>
                <span>0.00€</span>
              </div>
              <div className="flex justify-between text-black font-bold text-base">
                <span>{t.totalMonthly}</span>

                <span>{finalPrice.toFixed(2)}€</span>
              </div>
            </div>

            {/* Terms */}
            <div className="text-xs text-gray-500">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className={`mt-1 ${errors.acceptTerms ? 'border-red-500' : ''}`}
                />
                <span>
                  {t.acceptTerms.split(t.terms)[0]}
                  <a href="#" className="text-blue-600 underline">
                    {t.terms}
                  </a>
                  {t.acceptTerms.split(t.terms)[1]}
                </span>
              </label>
              {errors.acceptTerms && <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>}
            </div>

            {/* Order Button */}
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              className="w-full h-1/2 py-5 px-4 bg-gradient-to-r from-blue-700 to-blue-400 text-white rounded-md font-bold hover:from-blue-600 hover:to-blue-800 transition-colors"
            >
              {t.orderNow}
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;