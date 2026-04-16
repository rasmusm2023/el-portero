export type PresignMediaPutResponse = {
  objectKey: string;
  uploadUrl: string;
  requiredHeaders: Record<string, string>;
  publicUrl: string | null;
  expiresAtUtc: string;
};

export type MediaAssetDto = {
  id: number;
  objectKey: string;
  originalFileName: string;
  contentType: string;
  sizeBytes: number;
  publicUrl: string | null;
  createdByUsername: string;
  createdAtUtc: string;
};
