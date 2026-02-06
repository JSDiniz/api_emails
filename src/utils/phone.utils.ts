export function normalizePhone(phone: string): string {
  let normalized = phone.replace(/\D/g, "");

  // garante DDI 55
  if (!normalized.startsWith("55")) {
    normalized = `55${normalized}`;
  }

  // remove o 9 após o DDD (55 + DDD + 9)
  normalized = normalized.replace(/^55(\d{2})9/, "55$1");

  return normalized;
}

export function normalizePhoneForWhatsapp(phone: string) {
  let clean = phone.replace(/\D/g, "");

  // garante DDI 55
  if (!clean.startsWith("55")) {
    clean = `55${clean}`;
  }

  const ddi = clean.slice(0, 2);      // 55
  const ddd = clean.slice(2, 4);      // 92
  let number = clean.slice(4);        // 94593970

  return `${ddi}${ddd}9${number}`;
}
