// Representa una opción de un producto
export interface ProductOption {
  id: number; // ID de la opción
  name: string; // Nombre de la opción (ej. "Tamaño")
  values: string[]; // Valores posibles (ej. ["Chico", "Grande"])
  product_id: number; // ID del producto asociado
}

// Representa un producto
export interface Product {
  id: number; // ID del producto
  name: string; // Nombre del producto
  description: string; // Descripción del producto
  price: number; // Precio del producto
  image_url: string; // URL de la imagen
  available: boolean; // Si el producto está disponible
  category_id: number; // ID de la categoría a la que pertenece
  options?: ProductOption[]; // Opciones disponibles para el producto
}

// Representa una categoría
export interface Category {
  id: number; // ID de la categoría
  name: string; // Nombre de la categoría (ej. "Desayunos")
  availability_start: string; // Hora de inicio de disponibilidad (formato HH:mm:ss)
  availability_end: string; // Hora de fin de disponibilidad (formato HH:mm:ss)
  available_days: string[]; // Días disponibles (ej. ["lunes", "martes"])
  products?: Product[]; // Lista de productos asociados a la categoría
}

// Representa el menú completo
export interface Menu {
  categories: Category[]; // Lista de categorías con sus productos
}
