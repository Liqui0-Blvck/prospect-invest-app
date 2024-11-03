import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const CardSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const startShimmer = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  useEffect(() => {
    startShimmer();
  }, []);

  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#c8c8c8']
  });

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.textSkeleton, { backgroundColor: interpolatedColor }]} />
      <Animated.View style={[styles.textSkeleton, { backgroundColor: interpolatedColor }]} />
      <Animated.View style={[styles.textSkeleton, { backgroundColor: interpolatedColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 16,
    width: 300,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textSkeleton: {
    height: 20,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default CardSkeleton;
