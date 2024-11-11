export type User = {
  id: string;
  name: string;
  lastname: string;
  role: Role;
  phone: string;
  password: string;
  verified_at: string;
};

enum Role {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
  AXULIAR = "AXULIAR",
}
