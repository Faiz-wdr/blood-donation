/**
 * WhatsApp Click-to-Chat URL generator for Blood Connect Kerala
 * Helpline number: +91 90373 05478
 */

export const HELPLINE_PHONE = '919037305478';
export const HELPLINE_DISPLAY = '9037305478';

/**
 * Builds the prefilled WhatsApp request message URL.
 * 
 * @param {Object} params
 * @param {string} params.bloodGroup - The selected blood group
 * @param {string} params.district - The selected district
 * @returns {string} Fully encoded WhatsApp URL
 */
export function buildWhatsAppRequestUrl({ bloodGroup, district }) {
  const bloodText = bloodGroup && bloodGroup !== 'Select blood group' ? bloodGroup : 'Not specified / Urgent';
  const districtText = district && district !== 'All Districts' ? district : 'All Districts (Kerala)';

  const message = `Hello Blood Connect Kerala, I need blood support.\n\nBlood Group: ${bloodText}\nDistrict: ${districtText}\n\nPlease help me with the next steps.`;

  return `https://wa.me/${HELPLINE_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Standard general helpline WhatsApp link
 */
export function getHelplineWhatsAppUrl() {
  const message = 'Hello Blood Connect Kerala, I would like to inquire about voluntary blood donation support.';
  return `https://wa.me/${HELPLINE_PHONE}?text=${encodeURIComponent(message)}`;
}

