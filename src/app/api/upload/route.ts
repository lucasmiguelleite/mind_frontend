import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

// Desabilita o bodyParser para usar o formidable
export const config = {
  api: {
    bodyParser: false,  // Desabilita o parsing automático
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req);
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();

    // Define o diretório de upload
    (form as any).uploadDir = path.join(process.cwd(), 'public/images'); // Pasta onde as imagens serão salvas
    (form as any).keepExtensions = true; // Manter a extensão original dos arquivos

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao processar o upload' });
      }

      // Verifica se a imagem foi enviada e está no formato correto
      if (files.imagem && Array.isArray(files.imagem) && files.imagem[0]) {
        const file = files.imagem[0]; // Acessando o primeiro arquivo da imagem

        // Gerar um nome único para evitar sobrescrever o arquivo
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.originalFilename || 'default.jpg'}`;
        const tempFilePath = file.filepath; // Caminho temporário do arquivo
        const newFilePath = path.join(process.cwd(), 'public/images', fileName); // Caminho para onde o arquivo será movido

        // Move o arquivo para a pasta public/images
        fs.renameSync(tempFilePath, newFilePath);

        // Retorna o caminho da imagem para o frontend
        return res.status(200).json({ imagePath: `/images/${fileName}` });
      }

      return res.status(400).json({ error: 'Imagem não foi enviada ou não está no formato esperado.' });
    });
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
