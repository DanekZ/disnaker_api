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

export type CreatePositionRequest = {
  nama: string;
};

export type UpdatePositionRequest = {
  nama: string;
};

export type CreateDivisionRequest = {
  nama: string;
};

export type UpdateDivisionRequest = {
  nama: string;
};
