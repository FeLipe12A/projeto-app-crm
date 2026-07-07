import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { Image } from "expo-image";
import { router } from "expo-router";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../FirebaseConfig";

GoogleSignin.configure({
  iosClientId: "1039806310738-8iubnljrt9r3piff967ephhrmbjbuq8d.apps.googleusercontent.com",
  webClientId: "1039806310738-rc3c5pkls0bd7fdbe0qav72v8oj6nrse.apps.googleusercontent.com",
  offlineAccess: true,
});

const logoIcon = require("../assets/images/logoIcon.png");
const eyeIcon = require("../assets/images/eyeIcon.png");
const googleIcon = require("../assets/images/googleIcon.png");

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const signInWithGoogleCredential = async (idToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const user = await signInWithCredential(auth, credential);
      if (user) router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);
      alert("Falha ao logar com Google: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (idToken) {
        await signInWithGoogleCredential(idToken);
      } else {
        alert("Não foi possível obter o token do Google.");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Google Sign-In cancelado");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Google Sign-In já em andamento");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Google Play Services indisponível");
      } else {
        console.log(error);
      }
      alert("Falha ao iniciar Google Sign-In: " + error.message);
    }
  };

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);
      alert("Falha ao logar: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoSection}>
            <Image source={logoIcon} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Acesse sua conta</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="nome@exemplo.com"
                  placeholderTextColor="#DBC1B7"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#DBC1B7"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => setShowPassword((value) => !value)}
                  activeOpacity={0.8}
                >
                  <Image source={eyeIcon} style={styles.icon} contentFit="contain" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberOption}
                onPress={() => setRememberMe((value) => !value)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
                </View>
                <Text style={styles.rememberText}>Lembrar de mim</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.linkText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={signIn} activeOpacity={0.9}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OU</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} activeOpacity={0.9}>
              <Image source={googleIcon} style={styles.socialIcon} contentFit="contain" />
              <Text style={styles.socialText}>Entrar com Google</Text>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupPromptText}>
                <Text style={styles.signupPromptBase}>Não tem uma conta? </Text>
                <Text style={styles.signupPromptAction}>Solicite acesso agora.</Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7F5",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#55433B",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#55433B",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.7,
    paddingHorizontal: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(136, 115, 106, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 17,
    paddingRight: 48,
    minHeight: 56,
  },
  input: {
    flex: 1,
    color: "#2F241F",
    fontSize: 16,
    paddingVertical: 0,
  },
  iconButton: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  icon: {
    width: 22,
    height: 15,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  rememberOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "rgba(136, 115, 106, 0.2)",
    borderRadius: 2,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#A0522D",
    borderColor: "#A0522D",
  },
  checkmark: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  rememberText: {
    color: "#55433B",
    fontSize: 14,
  },
  linkText: {
    color: "#94451D",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#B35D33",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#B35D33",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFCFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.7,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(136, 115, 106, 0.1)",
  },
  separatorText: {
    marginHorizontal: 16,
    color: "#88736A",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "rgba(136, 115, 106, 0.2)",
    borderRadius: 8,
    minHeight: 56,
    gap: 12,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialText: {
    color: "#55433B",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.7,
  },
  signupPrompt: {
    alignItems: "center",
    paddingTop: 32,
  },
  signupPromptText: {
    color: "#55433B",
    fontSize: 14,
    textAlign: "center",
  },
  signupPromptBase: {
    color: "#55433B",
  },
  signupPromptAction: {
    color: "#94451D",
    fontWeight: "500",
  },
});