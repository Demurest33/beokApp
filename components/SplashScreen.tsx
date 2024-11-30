import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const animationRef = useRef<LottieView>(null);
  const [isAnimationDone, setIsAnimationDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      animationRef.current?.pause(); // Pausa la animación a los 2.5 segundos
      setIsAnimationDone(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAnimationDone) {
      const timeout = setTimeout(onFinish, 1000); // Transición tras pausa
      return () => clearTimeout(timeout);
    }
  }, [isAnimationDone]);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../assets/lottie/splash.json")}
        autoPlay
        loop={false}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});
