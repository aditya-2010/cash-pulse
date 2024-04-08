import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

enum SignInType {
  Phone,
  Email,
  Google,
  Apple,
}

const Login = () => {
  const [countryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signIn } = useSignIn();

  const onSignIn = async (type: SignInType) => {
    if (type === SignInType.Phone) {
      try {
        const fullPhoneNumber = `${countryCode}${phoneNumber}`;

        const { supportedFirstFactors } = await signIn!.create({
          identifier: fullPhoneNumber,
        });

        const firstPhoneFactor: any = supportedFirstFactors.find(
          (factor: any) => {
            return factor.strategy === "phone_code";
          }
        );

        const { phoneNumberId } = firstPhoneFactor;

        await signIn?.prepareFirstFactor({
          strategy: "phone_code",
          phoneNumberId,
        });

        router.push({
          pathname: "/verify/[phone]",
          params: { phone: fullPhoneNumber, signin: "true" },
        });
      } catch (error) {
        console.log("error", JSON.stringify(error, null, 2));
        if (isClerkAPIResponseError(error)) {
          if (error.errors[0].code === "form_identifier_not_found") {
            Alert.alert("Error", error.errors[0].message);
          }
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Welcome back!</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number associated to your account
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={countryCode}
            keyboardType="numeric"
            placeholderTextColor={Colors.gray}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            placeholder="Mobile number"
            placeholderTextColor={Colors.gray}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity
          disabled={phoneNumber.length < 10}
          style={[
            defaultStyles.pillButton,
            phoneNumber.length < 10 ? styles.disabled : styles.enabled,
          ]}
          onPress={() => onSignIn(SignInType.Phone)}
        >
          <Text style={defaultStyles.buttonText}>Get OTP</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
            marginVertical: 30,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.gray,
              height: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={{ color: Colors.gray, fontSize: 20 }}>or</Text>
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.gray,
              height: StyleSheet.hairlineWidth,
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Email)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              backgroundColor: "#fff",
              marginBottom: 20,
            },
          ]}
        >
          <Ionicons name="mail" size={24} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Google)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              backgroundColor: "#fff",
              marginBottom: 20,
            },
          ]}
        >
          <Ionicons name="logo-google" size={24} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn(SignInType.Apple)}
          style={[
            defaultStyles.pillButton,
            {
              flexDirection: "row",
              gap: 16,
              backgroundColor: "#fff",
              marginBottom: 20,
            },
          ]}
        >
          <Ionicons name="logo-apple" size={24} />
          <Text style={[defaultStyles.buttonText, { color: "#000" }]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 40,
    flexDirection: "row",
  },
  input: {
    backgroundColor: Colors.lightGray,
    padding: 20,
    borderRadius: 16,
    fontSize: 20,
    marginRight: 10,
  },
  enabled: { backgroundColor: Colors.primary },
  disabled: { backgroundColor: Colors.primaryMuted },
});

export default Login;
