// import React, { useEffect, useRef } from "react";
// import {
//   Animated,
//   Easing,
//   Text,
//   View,
//   Dimensions,
//   StyleSheet,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// const { width, height } = Dimensions.get("window");

// // ─── Floating particle ────────────────────────────────────────────────────────
// const Particle = ({
//   size,
//   color,
//   startX,
//   startY,
//   delay,
// }: {
//   size: number;
//   color: string;
//   startX: number;
//   startY: number;
//   delay: number;
// }) => {
//   const yAnim    = useRef(new Animated.Value(0)).current;
//   const opAnim   = useRef(new Animated.Value(0)).current;
//   const scAnim   = useRef(new Animated.Value(0.4)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.delay(delay),
//         Animated.parallel([
//           Animated.timing(yAnim,  { toValue: -80, duration: 2800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
//           Animated.sequence([
//             Animated.timing(opAnim, { toValue: 1,   duration: 600,  useNativeDriver: true }),
//             Animated.timing(opAnim, { toValue: 0,   duration: 2200, useNativeDriver: true }),
//           ]),
//           Animated.sequence([
//             Animated.timing(scAnim, { toValue: 1,   duration: 700,  useNativeDriver: true }),
//             Animated.timing(scAnim, { toValue: 0.3, duration: 2100, useNativeDriver: true }),
//           ]),
//         ]),
//         Animated.parallel([
//           Animated.timing(yAnim,  { toValue: 0,   duration: 0, useNativeDriver: true }),
//           Animated.timing(opAnim, { toValue: 0,   duration: 0, useNativeDriver: true }),
//         ]),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, []);

//   return (
//     <Animated.View
//       style={{
//         position: "absolute",
//         left: startX,
//         top: startY,
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         backgroundColor: color,
//         opacity: opAnim,
//         transform: [{ translateY: yAnim }, { scale: scAnim }],
//       }}
//     />
//   );
// };

// // ─── Particles config ─────────────────────────────────────────────────────────
// const PARTICLES = [
//   { size: 6,  color: "#D946C4", startX: width * 0.15, startY: height * 0.72, delay: 0    },
//   { size: 4,  color: "#9B4DFF", startX: width * 0.28, startY: height * 0.78, delay: 400  },
//   { size: 8,  color: "#E040A0", startX: width * 0.50, startY: height * 0.75, delay: 200  },
//   { size: 5,  color: "#7c3aed", startX: width * 0.68, startY: height * 0.80, delay: 600  },
//   { size: 6,  color: "#D946C4", startX: width * 0.82, startY: height * 0.73, delay: 100  },
//   { size: 4,  color: "#a855f7", startX: width * 0.38, startY: height * 0.68, delay: 800  },
//   { size: 7,  color: "#f0179e", startX: width * 0.60, startY: height * 0.70, delay: 300  },
//   { size: 3,  color: "#9B4DFF", startX: width * 0.10, startY: height * 0.65, delay: 700  },
//   { size: 5,  color: "#D946C4", startX: width * 0.88, startY: height * 0.65, delay: 500  },
// ];

// // ─── Pulsing ring ─────────────────────────────────────────────────────────────
// const PulseRing = ({ delay, color }: { delay: number; color: string }) => {
//   const scale = useRef(new Animated.Value(1)).current;
//   const opacity = useRef(new Animated.Value(0.7)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.delay(delay),
//         Animated.parallel([
//           Animated.timing(scale,   { toValue: 2.2, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
//           Animated.timing(opacity, { toValue: 0,   duration: 1400, useNativeDriver: true }),
//         ]),
//         Animated.parallel([
//           Animated.timing(scale,   { toValue: 1,   duration: 0, useNativeDriver: true }),
//           Animated.timing(opacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
//         ]),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, []);

//   return (
//     <Animated.View
//       style={{
//         position: "absolute",
//         width: 112,
//         height: 112,
//         borderRadius: 56,
//         borderWidth: 2,
//         borderColor: color,
//         opacity,
//         transform: [{ scale }],
//       }}
//     />
//   );
// };

// // ─── Shimmer bar ──────────────────────────────────────────────────────────────
// const ShimmerBar = ({ delay }: { delay: number }) => {
//   const x = useRef(new Animated.Value(-120)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.delay(delay),
//         Animated.timing(x, { toValue: 120, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//         Animated.timing(x, { toValue: -120, duration: 0, useNativeDriver: true }),
//         Animated.delay(600),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, []);

//   return (
//     <Animated.View
//       style={{
//         position: "absolute",
//         width: 60,
//         height: "100%",
//         backgroundColor: "rgba(255,255,255,0.22)",
//         transform: [{ translateX: x }, { skewX: "-20deg" }],
//       }}
//     />
//   );
// };

// // ─── Animated dot ─────────────────────────────────────────────────────────────
// const Dot = ({ delay }: { delay: number }) => {
//   const y = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.delay(delay),
//         Animated.timing(y, { toValue: -8,  duration: 360, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
//         Animated.timing(y, { toValue:  0,  duration: 360, easing: Easing.in(Easing.ease),     useNativeDriver: true }),
//         Animated.delay(500),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, []);

//   return (
//     <Animated.View
//       style={{
//         width: 10, height: 10, borderRadius: 5,
//         backgroundColor: "#D946C4",
//         marginHorizontal: 5,
//         transform: [{ translateY: y }],
//       }}
//     />
//   );
// };

// // ─── Main component ───────────────────────────────────────────────────────────
// const AppLoadingScreen = () => {
//   // Logo animations
//   const scaleAnim   = useRef(new Animated.Value(0)).current;
//   const rotateAnim  = useRef(new Animated.Value(0)).current;
//   const glowAnim    = useRef(new Animated.Value(0.5)).current;
//   const bounceAnim  = useRef(new Animated.Value(0)).current;

//   // Staggered text fade-ins
//   const titleFade   = useRef(new Animated.Value(0)).current;
//   const titleSlide  = useRef(new Animated.Value(24)).current;
//   const subFade     = useRef(new Animated.Value(0)).current;
//   const subSlide    = useRef(new Animated.Value(20)).current;
//   const dotsFade    = useRef(new Animated.Value(0)).current;

//   // Progress bar
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // 1. Logo entrance
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       tension: 60,
//       friction: 6,
//       useNativeDriver: true,
//     }).start();

//     // 2. Staggered text entrance
//     Animated.stagger(180, [
//       Animated.parallel([
//         Animated.timing(titleFade,  { toValue: 1, duration: 500, useNativeDriver: true }),
//         Animated.timing(titleSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
//       ]),
//       Animated.parallel([
//         Animated.timing(subFade,    { toValue: 1, duration: 500, useNativeDriver: true }),
//         Animated.timing(subSlide,   { toValue: 0, duration: 500, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
//       ]),
//       Animated.timing(dotsFade, { toValue: 1, duration: 400, useNativeDriver: true }),
//     ]).start();

//     // 3. Progress bar
//     Animated.timing(progressAnim, {
//       toValue: 1,
//       duration: 3200,
//       easing: Easing.inOut(Easing.ease),
//       useNativeDriver: false,
//     }).start();

//     // 4. Continuous logo idle
//     const idle = Animated.loop(
//       Animated.parallel([
//         Animated.sequence([
//           Animated.timing(rotateAnim, { toValue:  1,  duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//           Animated.timing(rotateAnim, { toValue: -1,  duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//           Animated.timing(rotateAnim, { toValue:  0,  duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//         ]),
//         Animated.sequence([
//           Animated.timing(glowAnim,   { toValue: 1,   duration: 1400, useNativeDriver: true }),
//           Animated.timing(glowAnim,   { toValue: 0.5, duration: 1400, useNativeDriver: true }),
//         ]),
//         Animated.sequence([
//           Animated.timing(bounceAnim, { toValue: -12, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//           Animated.timing(bounceAnim, { toValue:   0, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
//         ]),
//       ])
//     );
//     idle.start();
//     return () => idle.stop();
//   }, []);

//   const rotate = rotateAnim.interpolate({
//     inputRange: [-1, 0, 1],
//     outputRange: ["-10deg", "0deg", "10deg"],
//   });

//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0%", "100%"],
//   });

//   return (
//     <LinearGradient
//       colors={["#030014", "#110926", "#220E3E", "#030014"]}
//       locations={[0, 0.3, 0.65, 1]}
//       start={{ x: 0.1, y: 0 }}
//       end={{ x: 0.9, y: 1 }}
//       style={styles.container}
//     >
//       {/* ── Background glows ── */}
//       <View style={[styles.glow, { width: 280, height: 280, top: -60, right: -80,  backgroundColor: "rgba(217,70,196,0.20)" }]} />
//       <View style={[styles.glow, { width: 260, height: 260, top: 200, left: -100,  backgroundColor: "rgba(155,77,255,0.18)" }]} />
//       <View style={[styles.glow, { width: 200, height: 200, bottom: 100, right: -50, backgroundColor: "rgba(224,64,160,0.15)" }]} />

//       {/* ── Floating particles ── */}
//       {PARTICLES.map((p, i) => (
//         <Particle key={i} {...p} />
//       ))}

//       {/* ── Logo area ── */}
//       <View style={styles.logoArea}>
//         {/* Pulse rings behind logo */}
//         <PulseRing delay={0}    color="rgba(217,70,196,0.6)" />
//         <PulseRing delay={700}  color="rgba(155,77,255,0.5)" />

//         {/* Logo */}
//         <Animated.View
//           style={{
//             opacity: glowAnim,
//             transform: [{ scale: scaleAnim }, { rotate }, { translateY: bounceAnim }],
//           }}
//         >
//           <View style={styles.logoShadow}>
//             <LinearGradient
//               colors={["#E040C8", "#9B4DFF", "#6d28d9"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.logoGradient}
//             >
//               {/* Inner shimmer */}
//               <View style={StyleSheet.absoluteFill}>
//                 <ShimmerBar delay={400} />
//               </View>

//               {/* Play icon */}
//               <View style={styles.playIcon}>
//                 <View style={styles.playTriangle} />
//               </View>
//             </LinearGradient>
//           </View>
//         </Animated.View>
//       </View>

//       {/* ── App name ── */}
//       <Animated.View style={{ opacity: titleFade, transform: [{ translateY: titleSlide }] }}>
//         <Text style={styles.appName}>MovieFlix</Text>
//       </Animated.View>

//       {/* ── Tagline ── */}
//       <Animated.View style={{ opacity: subFade, transform: [{ translateY: subSlide }] }}>
//         <Text style={styles.tagline}>Find your next favorite movie</Text>
//       </Animated.View>

//       {/* ── Progress bar ── */}
//       <Animated.View style={{ opacity: dotsFade, width: "70%", marginTop: 40 }}>
//         <View style={styles.progressTrack}>
//           <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
//             <LinearGradient
//               colors={["#D946C4", "#9B4DFF"]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={StyleSheet.absoluteFill}
//             />
//             {/* Shimmer on progress */}
//             <ShimmerBar delay={0} />
//           </Animated.View>
//         </View>
//       </Animated.View>

//       {/* ── Bouncing dots ── */}
//       <Animated.View style={[styles.dotsRow, { opacity: dotsFade }]}>
//         <Dot delay={0}   />
//         <Dot delay={160} />
//         <Dot delay={320} />
//       </Animated.View>

//       <Animated.Text style={[styles.loadingText, { opacity: dotsFade }]}>
//         Loading movies…
//       </Animated.Text>
//     </LinearGradient>
//   );
// };

// export default AppLoadingScreen;

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 32,
//   },
//   glow: {
//     position: "absolute",
//     borderRadius: 999,
//   },
//   logoArea: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 28,
//   },
//   logoShadow: {
//     shadowColor: "#D946C4",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.9,
//     shadowRadius: 30,
//     elevation: 20,
//   },
//   logoGradient: {
//     width: 110,
//     height: 110,
//     borderRadius: 34,
//     alignItems: "center",
//     justifyContent: "center",
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.2)",
//   },
//   playIcon: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   playTriangle: {
//     width: 0,
//     height: 0,
//     borderTopWidth: 18,
//     borderBottomWidth: 18,
//     borderLeftWidth: 30,
//     borderTopColor: "transparent",
//     borderBottomColor: "transparent",
//     borderLeftColor: "#fff",
//     marginLeft: 6,
//   },
//   appName: {
//     color: "#fff",
//     fontSize: 34,
//     fontWeight: "800",
//     letterSpacing: 0.5,
//     textShadowColor: "rgba(217,70,196,0.6)",
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 16,
//   },
//   tagline: {
//     color: "rgba(180,170,210,0.85)",
//     fontSize: 14,
//     marginTop: 8,
//     textAlign: "center",
//     letterSpacing: 0.3,
//   },
//   progressTrack: {
//     height: 5,
//     borderRadius: 10,
//     backgroundColor: "rgba(255,255,255,0.08)",
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: "100%",
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   dotsRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 28,
//   },
//   loadingText: {
//     color: "rgba(180,170,210,0.7)",
//     fontSize: 13,
//     marginTop: 14,
//     letterSpacing: 0.4,
//   },
// });

import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const AppLoadingScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0.75)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const ringAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    console.log("AppLoadingScreen mounted");

    const logoAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.18,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.75,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const ringAnimation = Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    logoAnimation.start();
    ringAnimation.start();
    glowAnimation.start();

    return () => {
      logoAnimation.stop();
      ringAnimation.stop();
      glowAnimation.stop();
    };
  }, [scaleAnim, rotateAnim, fadeAnim, bounceAnim, ringAnim, glowAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const ringScale = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.8],
  });

  const ringOpacity = ringAnim.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [0.45, 0.15, 0],
  });

  return (
    <LinearGradient
      colors={["#030014", "#12071F", "#24103F", "#030014"]}
      locations={[0, 0.35, 0.72, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Animated.View
        style={[
          styles.topGlow,
          {
            opacity: glowAnim,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.bottomGlow,
          {
            opacity: glowAnim,
          },
        ]}
      />

      <View style={styles.lineOne} />
      <View style={styles.lineTwo} />
      <View style={styles.lineThree} />

      <Animated.View
        style={[
          styles.pulseRing,
          {
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
        edges={["top", "left", "right", "bottom"]}
      >
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate },
                { translateY: bounceAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#D946C4", "#9B4DFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logoText}>M</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.title}>MovieFlix</Text>

        <Text style={styles.tagline}>
          {t("splash.tagline", {
            defaultValue: "Find your next favorite movie",
          })}
        </Text>

        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#D946C4" />

          <Text style={styles.loadingText}>
            {t("splash.loading", {
              defaultValue: "Loading movies...",
            })}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AppLoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  topGlow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -96,
    right: -96,
    backgroundColor: "rgba(217, 70, 196, 0.18)",
  },
  bottomGlow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    bottom: -112,
    left: -112,
    backgroundColor: "rgba(155, 77, 255, 0.2)",
  },
  lineOne: {
    position: "absolute",
    top: 112,
    left: 40,
    width: 64,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: [{ rotate: "12deg" }],
  },
  lineTwo: {
    position: "absolute",
    top: 160,
    right: 48,
    width: 96,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: [{ rotate: "-12deg" }],
  },
  lineThree: {
    position: "absolute",
    bottom: 176,
    right: 40,
    width: 80,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    transform: [{ rotate: "12deg" }],
  },
  pulseRing: {
    position: "absolute",
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 1,
    borderColor: "#D946C4",
  },
  logoWrapper: {
    width: 128,
    height: 128,
    borderRadius: 42,
    overflow: "hidden",
    marginBottom: 28,
  },
  logoGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 60,
    fontWeight: "900",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagline: {
    color: "rgba(220,215,240,0.75)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  loadingBox: {
    height: 54,
    paddingHorizontal: 32,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "rgba(220,215,240,0.75)",
    fontSize: 14,
    fontWeight: "600",
  },
});