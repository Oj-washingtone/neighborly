import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";

const TakerSkeletonLoader = () => {
  const pulseAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimationLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimationLoop.start();

    return () => {
      pulseAnimationLoop.stop();
    };
  }, []);

  const pulseOpacity = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <View style={styles.taskerItem}>
      <Animated.View style={[styles.taskerDP, { opacity: pulseOpacity }]} />
      <View style={styles.taskerDetails}>
        <Animated.View
          style={[styles.skeletonText, { opacity: pulseOpacity, width: "70%" }]}
        />
        <View style={styles.taskerNameRating}>
          <Animated.View
            style={[
              styles.skeletonText,
              { opacity: pulseOpacity, width: "40%" },
            ]}
          />
          <View style={styles.taskerRating}>
            <Animated.View
              style={[
                styles.skeletonText,
                { opacity: pulseOpacity, width: "20%" },
              ]}
            />
            <Animated.View
              style={[
                styles.skeletonText,
                { opacity: pulseOpacity, width: "10%" },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f3f5",
    paddingBottom: 10,
  },
  taskerDP: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#f2f3f5",
    marginRight: 10,
  },
  skeletonText: {
    flex: 1,
    backgroundColor: "#f2f3f5",
    marginBottom: 5,
    padding: 10,
  },
  taskerDetails: {
    flex: 1,
  },
  taskerNameRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  taskerRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskerPriceAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeAway: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskerButton: {
    width: 80,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#f2f3f5",
  },
});

export default TakerSkeletonLoader;
