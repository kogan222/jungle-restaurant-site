/* ════════════════════════════════════════════════════════
   THE JUNGLE WEY — Contact & Social Constants
   Single source of truth for all contact links.
════════════════════════════════════════════════════════ */

export const PHONE          = "+52 983 101 1061";
export const PHONE_RAW      = "529831011061";
export const INSTAGRAM      = "https://instagram.com/thejunglewey";
export const TRIPADVISOR    = "https://www.tripadvisor.com/Restaurant_Review-g499450-d33319306-Reviews-The_Jungle_Wey-Mahahual_Costa_Maya_Yucatan_Peninsula.html";
export const GOOGLE_MAPS    = "https://www.google.com/maps/search/The+Jungle+Wey+Avenida+Paseo+del+Puerto+1127+Mahahual+Quintana+Roo";

/* ── Pre-filled WhatsApp reservation message ── */
const BOOKING_MESSAGE = [
  "*Welcome to The Jungle Wey*",
  "",
  "I would like to reserve a table.",
  "",
  "*Name:* ",
  "*Date:* ",
  "*Time:* ",
  "*Guests:* ",
  "*Special Request:* ",
].join("\n");

export const WHATSAPP_RESERVE_URL =
  `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(BOOKING_MESSAGE)}`;

export const WHATSAPP_CHAT_URL =
  `https://wa.me/${PHONE_RAW}`;

export const TEL_URL = `tel:+${PHONE_RAW}`;
