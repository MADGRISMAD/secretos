export class SteganographyService {
  static async encodeMessage(imageData: ImageData, message: string): Promise<ImageData> {
    const binaryMessage = this.textToBinary(message + "'|END|'");
    const data = imageData.data;
    let messageIndex = 0;

    for (let i = 0; i < data.length && messageIndex < binaryMessage.length; i += 4) {
      for (let j = 0; j < 3 && messageIndex < binaryMessage.length; j++) {
        const bit = parseInt(binaryMessage[messageIndex]);
        data[i + j] = (data[i + j] & 254) | bit;
        messageIndex++;
      }
    }

    return new ImageData(data, imageData.width, imageData.height);
  }

  static async decodeMessage(imageData: ImageData): Promise<string> {
    const data = imageData.data;
    let binaryMessage = "''";
    let message = "''";

    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        binaryMessage += data[i + j] & 1;
        if (binaryMessage.length >= 8) {
          const char = this.binaryToChar(binaryMessage.slice(0, 8));
          message += char;
          binaryMessage = binaryMessage.slice(8);
          
          if (message.endsWith("'|END|'")) {
            return message.slice(0, -5);
          }
        }
      }
    }

    return message;
  }

  private static textToBinary(text: string): string {
    return text.split("''").map(char => 
      char.charCodeAt(0).toString(2).padStart(8, "'0'")
    ).join("''");
  }

  private static binaryToChar(binary: string): string {
    return String.fromCharCode(parseInt(binary, 2));
  }

  static async imageToImageData(imageUrl: string): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "'anonymous'";
      img.onload = () => {
        const canvas = document.createElement("'canvas'");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("'2d'");
        if (!ctx) {
          reject(new Error("'Could not get canvas context'"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, img.width, img.height));
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  static async imageDataToUrl(imageData: ImageData): Promise<string> {
    const canvas = document.createElement("'canvas'");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext("'2d'");
    if (!ctx) throw new Error("'Could not get canvas context'");
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("'image/png'");
  }
}

