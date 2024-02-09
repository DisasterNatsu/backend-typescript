interface User {
  username: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface UploadUrlResult {
  uploadUrlToken: string;
  uploadUrl: string;
}

interface BackblazeAuthorizeResult {
  apiUrl: string;
  authToken: string;
}

interface Folder {
  folder: string;
}

interface uploadToBackBlazeProps {
  mime: string;
  targetDir: string;
  bucketId: string;
  apiUrl: string;
  authorizationToken: string;
}

interface UploadOptions {
  authToken: string;
  url: string;
  mime: string;
  data: Buffer;
  contentLength?: number | undefined;
  fileName: string;
}

interface BackBlazeResponse {
  accountId: string;
  action: string;
  bucketId: string;
  contentLength: number;
  contentMd5: string;
  contentSha1: string;
  contentType: string;
  fileId: string;
  fileInfo: object;
  fileName: string;
  fileRetention: {
    isClientAuthorizedToRead: boolean;
    value: { mode: string | null; retainUntilTimestamp: string | null };
  };
  legalHold: { isClientAuthorizedToRead: boolean; value: null };
  serverSideEncryption: { algorithm: any | null; mode: any | null };
  uploadTimestamp: number;
}
