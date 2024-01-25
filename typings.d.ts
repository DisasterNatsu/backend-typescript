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
  uploadUrl: string;
  authToken: string;
  mime: string;
  targetDir: string;
}

interface UploadOptions {
  authToken: string;
  url: string;
  mime: string;
  data: Buffer;
  contentLength: number | undefined;
  fileName: string;
}
