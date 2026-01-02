export function validateRut(rut: string): boolean {
  if (!rut) return false;
  
  // Limpiar el RUT de puntos y guión
  const value = rut.replace(/\./g, "").replace(/-/g, "");
  
  // Validar formato mínimo
  if (value.length < 8) return false;
  
  // Separar cuerpo y dígito verificador
  const body = value.slice(0, -1);
  const dv = value.slice(-1).toUpperCase();
  
  // Validar que el cuerpo sea numérico
  if (!/^[0-9]+$/.test(body)) return false;
  
  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    suma += parseInt(body.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const resto = 11 - (suma % 11);
  let dvEsperado = "";
  
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = resto.toString();
  
  return dv === dvEsperado;
}

export function formatRut(rut: string): string {
    const clean = rut.replace(/[^0-9kK]/g, "");
    if (clean.length <= 1) return clean;
    
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1).toUpperCase();
    
    let formattedBody = "";
    for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
        formattedBody = body.charAt(i) + ((j > 0 && j % 3 === 0) ? "." : "") + formattedBody;
    }
    
    return `${formattedBody}-${dv}`;
}
