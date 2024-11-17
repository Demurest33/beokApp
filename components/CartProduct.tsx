import { productWithOptions, ProductOption } from "@/types/Menu";
import { View, Text, Image, Pressable, FlatList } from "react-native";
import useCartStore from "@/store/cart";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";

export default function CartProduct(product: productWithOptions) {
  const cartStore = useCartStore();

  const { id, name, description, price, image_url, quantity } = product;

  const madeKey = id + JSON.stringify(product.selectedOptions);

  return (
    // los products deben tener un id unico, usar el id del producto y las opciones seleccionadas
    //poner todo en un flatlist para que se renderize de manera eficiente
    // agregar un boton para remover el producto del carrito, otro para aumentar la cantidad y otro para disminuir la cantidad

    <View>
      <Image source={{ uri: image_url }} style={{ width: 50, height: 50 }} />
      <Text style={{ fontSize: 16 }}>
        {name} - {quantity}
      </Text>

      {/* optiones selected */}

      {product.selectedOptions &&
        Object.keys(product.selectedOptions).map((key) => (
          <Text key={key}>
            {key}: {product.selectedOptions[key]}
          </Text>
        ))}

      <Text>{price}</Text>
      <Pressable onPress={() => cartStore.removeProduct(product)}>
        <Text>Remove</Text>
      </Pressable>
      <Pressable onPress={() => cartStore.addOneToProduct(product)}>
        <Text>+</Text>
      </Pressable>
      <Pressable onPress={() => cartStore.substracOneToProduct(product)}>
        <Text>-</Text>
      </Pressable>
    </View>
  );
}
