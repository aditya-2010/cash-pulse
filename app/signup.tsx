import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
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

const SignUp = () => {
  const [countryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;
  const router = useRouter();
  const { signUp } = useSignUp();

  const onSignUp = async () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      await signUp?.create({
        phoneNumber: fullPhoneNumber,
      });
      await signUp?.preparePhoneNumberVerification({ strategy: "phone_code" });
      router.push({
        pathname: "/verify/[phone]",
        params: { phone: fullPhoneNumber },
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View style={defaultStyles.container}>
        <Text style={defaultStyles.header}>Let's get started</Text>
        <Text style={defaultStyles.descriptionText}>
          Enter your phone number. We will send you a confirmation code there
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

        <Link href={"/login"} replace asChild>
          <TouchableOpacity>
            <Text style={defaultStyles.textLink}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={{ flex: 1 }}></View>

        <TouchableOpacity
          disabled={phoneNumber.length < 10}
          style={[
            defaultStyles.pillButton,
            phoneNumber.length < 10 ? styles.disabled : styles.enabled,
          ]}
          onPress={onSignUp}
        >
          <Text style={defaultStyles.buttonText}>Sign Up</Text>
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

export default SignUp;
