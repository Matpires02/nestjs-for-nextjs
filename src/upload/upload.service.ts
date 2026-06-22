import { BadRequestException, Injectable } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { generateRandomSuffix } from 'src/common/utils/generate-random-suffix';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado!');
    }

    const maxFileSize = 900 * 1024; // 900 KB
    if (file.size > maxFileSize) {
      throw new BadRequestException(
        'O arquivo excede o tamanho máximo permitido!',
      );
    }

    const fileType = await fileTypeFromBuffer(file.buffer);

    if (
      !fileType ||
      !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
        fileType.mime,
      )
    ) {
      throw new BadRequestException('Arquivo inválido ou tipo não permitido!');
    }

    const today = new Date().toISOString().split('T')[0];
    const uploadPath = resolve(__dirname, '..', '..', 'uploads', today);

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    const uniqueSuffix = `${Date.now()}-${generateRandomSuffix()}`;
    const fileExtension = fileType.ext;
    const fileName = `${uniqueSuffix}.${fileExtension}`;
    const filePath = resolve(uploadPath, fileName);

    writeFileSync(filePath, file.buffer);

    return {
      url: `/uploads/${today}/${fileName}`,
    };
  }
}
