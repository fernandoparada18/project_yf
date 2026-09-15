/**
 * Convierte un texto plano en un hash SHA-256 de forma asíncrona.
 * Se utiliza para no enviar ni almacenar contraseñas en texto plano.
 * 
 * @param message Texto plano a encriptar (ej. la contraseña ingresada)
 * @returns Hash en formato hexadecimal
 */
export async function hashPassword(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
