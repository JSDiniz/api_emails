// Função para separar o endereço
export function parseAddress(fullAddress: string) {
    const partes = fullAddress.split(",");
    // "Av. Djalma Batista, 946 - Nossa Sra. das Graças"
    const enderecoRua = partes
      .slice(0, partes.length - 1)
      .join(",")
      .trim();
    // "Manaus - AM - 69050-010"
    const cidadeEstadoCep = partes[partes.length - 1].trim();
  
    // Divide cidade, estado e CEP
    const [cidade, estado, cep] = cidadeEstadoCep
      .split(" - ")
      .map((p) => p.trim());
  
    return { enderecoRua, cidade, estado, cep };
  }