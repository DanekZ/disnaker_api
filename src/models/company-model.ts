export type LoginCompanyRequest = {
  username: string;
  password: string;
};

export type RegisterCompanyRequest = {
  username: string;
  password: string;
  confirm_password: string;
  email: string;
  company_name: string;
  no_handphone: string;
  province: string;
  city: string;
  address: string;
  about_company: string;
};
