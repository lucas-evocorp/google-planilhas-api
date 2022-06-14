export interface IoAuth2 {
    redirectUri?: any;
    certificateCache: any;
    certificateExpiry: any;
    certificateCacheFormat: any;
    refreshTokenPromises: any;
    _clientId?: string;
    _clientSecret?: string;
    apiKey?: string;
    projectId?: string;
    eagerRefreshThresholdMillis: number;
    forceRefreshOnFailure: boolean;
  }
  