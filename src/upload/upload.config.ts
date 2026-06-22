import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

export const storage = memoryStorage();

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(
      new BadRequestException('Só são permitidos arquivos de imagem!'),
      false,
    );
  }
  cb(null, true);
};

export const limits = {
  //fileSize: 5 * 1024 * 1024, // 5 MB
};
