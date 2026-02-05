import { createClient } from './client';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export async function uploadDatasetFile(file: File): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new StorageError(
      `File size exceeds 3MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    );
  }

  // Validate file type
  if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
    throw new StorageError('Only CSV and JSON files are supported');
  }

  const supabase = createClient();
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('datasets')
    .upload(fileName, file, { contentType: file.type });

  if (error) {
    throw new StorageError(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from('datasets').getPublicUrl(data.path);

  return urlData.publicUrl;
}
