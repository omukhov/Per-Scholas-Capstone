export interface IAuthUser {
  _id: string;
  google_id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface IGoogleLoginResponse {
  user: IAuthUser;
}
