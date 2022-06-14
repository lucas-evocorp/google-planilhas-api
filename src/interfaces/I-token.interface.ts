export interface Itoken {
  refresh_token: string | undefined;
  expiry_date: number| undefined ;
  access_token: string | undefined;
  token_type: string | undefined;
  scope: string | undefined;
}
