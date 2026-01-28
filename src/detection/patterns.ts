export const PATTERNS = {
  url: /https?:\/\/[^\s]+/i,

  // Only match clear addresses with street numbers
  address:
    /\d{1,5}[,\s]+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|court|ct|place|pl|calle|c\/|avenida|avda|paseo|plaza|rue|straße|strasse|str|gasse|platz|weg|via|piazza|corso|viale|largo|rua|praça|travessa|alameda|laan|straat|plein)/i,

  email: /[\w.-]+@[\w.-]+\.\w+/i,

  phone: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
};
