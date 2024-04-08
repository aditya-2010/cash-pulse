import Colors from "@/constants/Colors";
import { useAssets } from "expo-asset";
import { ResizeMode, Video } from "expo-av";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Page() {
  const [assets] = useAssets([require("@/assets/videos/intro.mp4")]);

  return (
    <View style={styles.container}>
      {assets && (
        <View style={styles.videoContainer}>
          <Video
            shouldPlay
            isMuted
            isLooping
            resizeMode={ResizeMode.COVER}
            source={{ uri: assets[0].uri }}
            style={styles.video}
          />
        </View>
      )}
      <View style={styles.main}>
        <Text style={styles.headerText}>
          Ready to change the way you money?
        </Text>
        <View style={styles.auth}>
          <Link
            href={"/login"}
            style={[styles.authBtns, { backgroundColor: Colors.primary }]}
            asChild
          >
            <TouchableOpacity>
              <Text style={{ fontSize: 20, color: Colors.lightGray }}>
                Log In
              </Text>
            </TouchableOpacity>
          </Link>
          <Link
            asChild
            href={"/signup"}
            style={[styles.authBtns, { backgroundColor: Colors.lightGray }]}
          >
            <TouchableOpacity>
              <Text style={{ fontSize: 20 }}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    opacity: 0.5,
  },
  container: {
    flex: 1,
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  main: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 10,
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 36,
    fontWeight: "900",
    paddingHorizontal: 20,
    marginTop: 150,
    color: "white",
    textTransform: "uppercase",
  },
  auth: {
    flexDirection: "row",
    margin: 40,
    justifyContent: "space-between",
  },
  authBtns: {
    padding: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    backgroundColor: "white",
    fontSize: 40,
  },
});
