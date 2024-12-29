export class SteganographyService {
  // Convierte texto a binario
  static textToBinary(text: string): string {
    return text.split("''").map(char => 
      char.charCodeAt(0).toString(2).padStart(8, "'0'")
    ).join("''");
  }

  // Convierte binario a texto
  static binaryToText(binary: string): string {
    const chunks = binary.match(/.{1,8}/g) || [];
    return chunks.map(chunk => 
      String.fromCharCode(parseInt(chunk, 2))
    ).join("''");
  }

  // Oculta el mensaje binario en los bits menos significativos de la imagen
  static async encodeMessage(imageData: ImageData, binaryMessage: string): Promise<ImageData> {
    const data = imageData.data;
    let messageIndex = 0;

    for (let i = 0; i < data.length && messageIndex < binaryMessage.length; i += 4) {
      // Modifica solo el bit menos significativo de cada canal RGB
      for (let j = 0; j < 3 && messageIndex < binaryMessage.length; j++) {
        const bit = parseInt(binaryMessage[messageIndex]);
        data[i + j] = (data[i + j] & 254) | bit;
        messageIndex++;
      }
    }

    return new ImageData(data, imageData.width, imageData.height);
  }

  // Extrae el mensaje oculto de la imagen
  static async decodeMessage(imageData: ImageData, messageLength: number): Promise<string> {
    const data = imageData.data;
    let binaryMessage = "''";

    for (let i = 0; i < data.length && binaryMessage.length < messageLength * 8; i += 4) {
      for (let j = 0; j < 3 && binaryMessage.length < messageLength * 8; j++) {
        binaryMessage += data[i + j] & 1;
      }
    }

    return this.binaryToText(binaryMessage);
  }
}

