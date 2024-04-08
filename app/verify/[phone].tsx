import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import {
  isClerkAPIResponseError,
  useSignIn,
  useSignUp,
} from "@clerk/clerk-expo";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
const CELL_COUNT = 6;

const Phone = () => {
  const { phone, signin } = useLocalSearchParams<{
    phone: string;
    signin: string;
  }>();
  console.log(phone, signin);

  const [code, setCode] = useState("");

  const { signIn } = useSignIn();
  const { signUp, setActive, isLoaded } = useSignUp();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (code.length === 6) {
      if (signin === "true") {
        verifySignIn();
      } else {
        verifyCode();
        console.log(code);
      }
    }
  }, [code]);

  //   Sign up
  const verifyCode = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp?.attemptPhoneNumberVerification({
        code,
      });
      await setActive!({ session: completeSignUp?.createdSessionId });
    } catch (error) {
      console.log("error", JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === "form_identifier_not_found") {
          Alert.alert("Error", error.errors[0].message);
        }
      }
    }
  };

  const verifySignIn = async () => {
    try {
      await signIn?.attemptFirstFactor({ code, strategy: "phone_code" });
      await setActive!({ session: signIn?.createdSessionId });
    } catch (error) {
      console.log("error", JSON.stringify(error, null, 2));
      if (isClerkAPIResponseError(error)) {
        if (error.errors[0].code === "form_identifier_not_found") {
          Alert.alert("Error", error.errors[0].message);
        }
      }
    }
  };

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.header}>Verification code</Text>
      <Text style={defaultStyles.descriptionText}>
        Enter the code sent to {phone}
      </Text>

      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={code}
        onChangeText={setCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        // autoComplete={Platform.select({
        //   android: "sms-otp",
        //   default: "one-time-code",
        // })}
        testID="my-code-input"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: "auto",
    marginRight: "auto",
    gap: 12,
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    paddingBottom: 8,
  },
});

export default Phone;
