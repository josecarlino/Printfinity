export type OrderStatus = "Pendiente" | "En proceso" | "Entregado";

export interface Order {
  id: string;
  user_id: string;
  client: string;
  piece: string;
  due_date: string | null;
  price: number;
  paid: boolean;
  link: string | null;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
}

export type OrderInput = Pick<
  Order,
  "client" | "piece" | "due_date" | "price" | "link" | "notes" | "status"
>;
