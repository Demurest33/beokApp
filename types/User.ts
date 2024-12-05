export type User = {
  id: string;
  name: string;
  lastname: string;
  role: Role;
  phone: string;
  password: string;
  verified_at: string;
  pushToken: string;
  is_banned: boolean;
};

export interface UserWithOrderCounts {
  id: string;
  name: string;
  lastname: string;
  role: Role;
  phone: string;
  password: string;
  verified_at: string;
  pushToken: string;
  is_banned: boolean;
  preparing_orders_count: number;
  ready_orders_count: number;
  delivered_orders_count: number;
  canceled_orders_count: number;
}

export enum Role {
  CLIENTE = "CLIENTE",
  ADMIN = "ADMIN",
  AXULIAR = "AUXILIAR",
}
