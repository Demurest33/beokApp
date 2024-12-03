import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { getSms, verifySms } from "@/services/sms";
import useUserStore from "@/store/userStore";
import RadioForm, {
  RadioButton,
  RadioButtonLabel,
  RadioButtonInput,
} from "react-native-simple-radio-button";
import { sendWhatsapp } from "@/services/sms";

export default function SmsVerificationScreen() {
  const [smsCode, setSmsCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [selectedValue, setSelectedValue] = useState(0);

  const userStore = useUserStore();
  let interval: NodeJS.Timeout;

  async function handleSmsVerification() {
    if (loading) return;

    if (!smsCode) {
      alert("Ingresa el código de verificación");
      return;
    }

    try {
      setLoading(true);
      const response = await verifySms({
        phone: userStore.user!.phone,
        code: smsCode,
      });

      console.log(response);

      if (response?.verified_number) {
        alert(
          "verificacion exitosa para el número: " + response?.verified_number
        );

        router.replace("/(tabs)/");
      }
    } catch (error) {
      alert("Error en la verificación del código");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleSendSms = async () => {
    if (cooldown > 0) return;

    alert(selectedValue === 0 ? "SMS" : "Whatsapp");

    if (selectedValue === 0) {
      // alert("SMS");
      const sms = await getSms(userStore.user!.phone);
    }

    if (selectedValue === 1) {
      // alert("Whatsapp");
      const sms = await sendWhatsapp(userStore.user!.phone);
    }

    // selectedValue === 0
    //   ? await getSms(userStore.user!.phone)
    //   : await sendWhatsapp(userStore.user!.phone);

    // const sms = await getSms(userStore.user!.phone);
    // alert("Tu código de verificación es: " + sms.verification_code); // dummy

    setCooldown(60);

    interval = setInterval(() => {
      setCooldown((prevCooldown) => {
        if (prevCooldown <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCooldown - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.titleContainer}>
        <TextInput
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            paddingLeft: 8,
            flex: 3.5,
            borderRadius: 5,
            fontSize: 16,
            textAlign: "center",
          }}
          placeholder="Código de verificación"
          onChangeText={setSmsCode}
        />

        <Pressable
          style={[
            styles.button,
            { marginTop: 0, flex: 1, opacity: cooldown > 0 ? 0.5 : 1 },
          ]}
          onPress={handleSendSms}
          disabled={cooldown > 0}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Enviar
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={handleSmsVerification}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Verificar
        </Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 8 }}>
          Enviar código por:
        </Text>

        <RadioForm formHorizontal={true} animation={true}>
          <RadioButton labelHorizontal={true} key={0}>
            <RadioButtonInput
              obj={{ label: "SMS", value: 0 }}
              index={0}
              isSelected={selectedValue === 0}
              onPress={() => setSelectedValue(0)}
              buttonInnerColor={"#3D9D3D"}
              buttonOuterColor="#3D9D3D"
              buttonSize={15}
              buttonStyle={{}}
              buttonWrapStyle={{ marginLeft: 10 }}
            />
            <RadioButtonLabel
              obj={{ label: "SMS", value: 0 }}
              index={0}
              labelHorizontal={true}
              onPress={() => setSelectedValue(0)}
              labelStyle={{ fontSize: 20, color: "#000" }}
              labelWrapStyle={{}}
            />
          </RadioButton>
          <RadioButton labelHorizontal={true} key={1}>
            <RadioButtonInput
              obj={{ label: "Whatsapp", value: 1 }}
              index={1}
              isSelected={selectedValue === 1}
              onPress={() => setSelectedValue(1)}
              buttonInnerColor={"#3D9D3D"}
              buttonOuterColor="#3D9D3D"
              buttonSize={15}
              buttonStyle={{}}
              buttonWrapStyle={{ marginLeft: 10 }}
            />
            <RadioButtonLabel
              obj={{ label: "Whatsapp", value: 1 }}
              index={1}
              labelHorizontal={true}
              onPress={() => setSelectedValue(1)}
              labelStyle={{ fontSize: 20, color: "#000" }}
              labelWrapStyle={{}}
            />
          </RadioButton>
        </RadioForm>
      </View>

      {cooldown > 0 && (
        <Text style={{ textAlign: "center" }}>
          Puedes volver a enviar el código en {cooldown} segundos
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    gap: 10,
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
  },
  button: {
    backgroundColor: "#3D9D3D",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
