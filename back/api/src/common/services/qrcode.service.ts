import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

export interface QRCodeOptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  type?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
  margin?: number;
  width?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

@Injectable()
export class QRCodeService {
  /**
   * Generate QR code as a Data URL (base64)
   */
  async generateDataURL(text: string, options?: QRCodeOptions): Promise<string> {
    const defaultOptions = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return await QRCode.toDataURL(text, mergedOptions);
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  /**
   * Generate QR code as a Buffer (PNG format)
   */
  async generateBuffer(text: string, options?: Omit<QRCodeOptions, 'type'>): Promise<Buffer> {
    const defaultOptions = {
      errorCorrectionLevel: 'M' as const,
      margin: 1,
      width: 300,
    };

    const mergedOptions: any = { ...defaultOptions };
    if (options?.errorCorrectionLevel)
      mergedOptions.errorCorrectionLevel = options.errorCorrectionLevel;
    if (options?.margin !== undefined) mergedOptions.margin = options.margin;
    if (options?.width) mergedOptions.width = options.width;
    if (options?.color) mergedOptions.color = options.color;

    try {
      // toBuffer returns a Promise<Buffer> when called with proper options
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        QRCode.toBuffer(text, mergedOptions, (error: Error, buffer: Buffer) => {
          if (error) reject(error);
          else resolve(buffer);
        });
      });
      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error.message}`);
    }
  }

  /**
   * Generate table QR code URL
   * Creates a URL that points to the restaurant's menu page for a specific table
   */
  generateTableMenuUrl(restaurantSlug: string, tableNumber: string, baseUrl: string): string {
    // In production: https://restaurant-slug.yumyum.com/menu?table=1
    // For local: https://yumyum.com/?restaurant=restaurant-slug&table=1
    return `${baseUrl}/${restaurantSlug}/menu?table=${tableNumber}`;
  }

  /**
   * Generate QR code for a table
   */
  async generateTableQRCode(
    restaurantSlug: string,
    tableNumber: string,
    baseUrl: string,
    options?: QRCodeOptions
  ): Promise<string> {
    const url = this.generateTableMenuUrl(restaurantSlug, tableNumber, baseUrl);
    return this.generateDataURL(url, options);
  }
}
