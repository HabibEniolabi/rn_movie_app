// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   TouchableWithoutFeedback,
//   Keyboard,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Pressable,
// } from "react-native";
// import React, { useState } from "react";
// import { router, useLocalSearchParams } from "expo-router";
// import Feather from "react-native-vector-icons/Feather";
// import { images } from "@/constants/images";

// const RestEmailSent = () => {
//   const { email } = useLocalSearchParams<{ email?: string }>();
//   const [isResending, setIsResending] = useState(false);

//   const [customAlert, setCustomAlert] = useState<{
//     visible: boolean;
//     title: string;
//     message: string;
//   }>({
//     visible: false,
//     title: "",
//     message: "",
//   });
//   return (
//     <KeyboardAvoidingView
//       className="bg-primary flex-1"
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View className="bg-primary flex-1 px-10">
//           <View className="mt-20">
//             <TouchableOpacity
//               activeOpacity={0.9}
//               onPress={() => router.back()}
//               className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
//             >
//               <Feather name="chevron-left" size={24} color="#8B88A8" />
//             </TouchableOpacity>
//             <View className="flex-col justify-center items-center mt-12">
//               <Image
//                 source={images.email}
//                 className="w-[110px] h-[110px]"
//                 resizeMode="contain"
//               />
//               <View className="flex-col gap-5 mt-5">
//                 <Text className="text-white text-3xl text-center font-bold">
//                   Check your inbox!
//                 </Text>
//                 <View>
//                   <Text className="text-dark-500 test-lg leading-6 text-center">
//                     We sent a reset link to
//                   </Text>
//                   <Text className="text-[#9B59F5] text-lg font-bold text-center">
//                     {email || "your email"}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             <View className="flex-row gap-2 items-center justify-center mt-8">
//               <Text className="font-bold text-dark-500 text-md">
//                 Wrong email?{" "}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => router.back()}
//                 activeOpacity={0.85}
//               >
//                 <Text className="text-[#E040A0] font-bold text-[20px]">
//                   Try again
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           <Modal
//             visible={customAlert.visible}
//             transparent
//             animationType="fade"
//             onRequestClose={() =>
//               setCustomAlert((prev) => ({ ...prev, visible: false }))
//             }
//           >
//             <View className="flex-1 bg-black/60 items-center justify-center px-6">
//               <View className="w-full rounded-[28px] bg-[#141325] border border-[#2A2845] px-6 py-6">
//                 <Text className="text-white text-2xl font-bold text-center">
//                   {customAlert.title}
//                 </Text>

//                 <Text className="text-[#8B88A8] text-base text-center leading-6 mt-4">
//                   {customAlert.message}
//                 </Text>

//                 <Pressable
//                   onPress={() =>
//                     setCustomAlert((prev) => ({ ...prev, visible: false }))
//                   }
//                   className="h-[52px] rounded-[16px] bg-[#B954F5] items-center justify-center mt-6"
//                 >
//                   <Text className="text-white font-bold text-lg">Okay</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// export default RestEmailSent;
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Feather from "react-native-vector-icons/Feather";

const ResetEmailSent = () => {
  const { email, displayCode } = useLocalSearchParams<{ 
    email?: string;
    displayCode?: string;
  }>();

  const [timeLeft, setTimeLeft] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [oobCode, setOobCode] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [showNotification, setShowNotification] = useState(true);

  const rotateAnim = useRef(new Animated.Value(0)).current;

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "error" | "success" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "error",
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeInput = async () => {
    setCodeError("");

    if (!oobCode.trim()) {
      setCodeError("Please enter the reset code from your email");
      return;
    }

    try {
      setIsVerifyingCode(true);
      
      router.push({
        pathname: "/forgot-password/verify",
        params: { oobCode: oobCode.trim(), email: email },
      });
    } catch (error) {
      setCodeError("An error occurred. Please try again.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <KeyboardAvoidingView
      className="bg-primary flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          className="flex-1 bg-primary"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 32, paddingTop: 20, paddingBottom: 40 }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.back()}
            className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
          >
            <Feather name="chevron-left" size={24} color="#8B88A8" />
          </TouchableOpacity>

          {/* Animated Email Icon Section */}
          <View className="flex-col justify-center items-center mt-16 mb-8">
            <View className="relative w-[180px] h-[180px] items-center justify-center">
              {/* Animated Dashed Circle Border */}
              <Animated.View
                style={[
                  {
                    transform: [{ rotate: spin }],
                  },
                ]}
                className="absolute w-full h-full rounded-full border-2 border-dashed border-[#9B59F5]/40"
              />

              {/* Static Circle Background */}
              <View className="absolute w-[140px] h-[140px] rounded-full bg-[#9B59F5]/20 border border-[#9B59F5]/30" />

              {/* Inner Circle with Icon */}
              <View className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#E040A0] to-[#9B59F5] items-center justify-center">
                <Feather name="mail" size={60} color="#ffffff" />
              </View>
            </View>

            {/* Title and Email */}
            <Text className="text-white text-3xl font-bold text-center mt-8">
              Check your inbox!
            </Text>
            <View className="flex-row gap-1 mt-3 items-center justify-center">
              <Text className="text-[#8B88A8] text-base">We sent a reset code to</Text>
            </View>
            <Text className="text-[#9B59F5] text-lg font-bold text-center mt-1">
              {email || "your email"}
            </Text>
          </View>

          {/* Code Notification Banner */}
          {displayCode && (
            <View className="flex-row gap-3 bg-[#10B981]/15 border border-[#10B981]/30 rounded-[16px] px-5 py-4 mt-8 items-center">
              <View className="w-10 h-10 rounded-full bg-[#10B981]/20 items-center justify-center">
                <Feather name="check-circle" size={24} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-[#10B981] font-bold text-sm">
                  Code Sent Successfully
                </Text>
                <Text className="text-[#8B88A8] text-xs mt-1">
                  Your reset code has been sent to your email
                </Text>
              </View>
            </View>
          )}

          {/* Code Display Box */}
          {displayCode && (
            <View className="bg-gradient-to-r from-[#9B59F5]/20 to-[#E040A0]/20 border border-[#9B59F5]/30 rounded-[20px] px-6 py-6 mt-6">
              <Text className="text-[#8B88A8] text-xs text-center font-semibold mb-3">
                Your Reset Code
              </Text>
              <View className="bg-[#141325] rounded-[14px] px-4 py-4 items-center">
                <Text className="text-white text-4xl font-bold tracking-[8px]">
                  {displayCode}
                </Text>
              </View>
              <Text className="text-[#8B88A8] text-xs text-center mt-3">
                Copy and paste this code below or check your email
              </Text>
            </View>
          )}
          <View className="flex-row gap-4 bg-[#1a1630] border border-[#2A2845] rounded-[24px] px-5 py-5 mt-5">
            <View className="w-[60px] h-[60px] rounded-[16px] bg-[#9B59F5]/20 items-center justify-center flex-shrink-0">
              <Feather name="mail" size={28} color="#9B59F5" />
            </View>
            <View className="flex-1 justify-center gap-1">
              <Text className="text-[#6A6880] text-xs">
                From: noreply@yourapp.com
              </Text>
              <Text className="text-white font-bold text-base">
                Password Reset Code
              </Text>
              <Text className="text-[#6A6880] text-xs">
                Copy the code and enter it below...
              </Text>
            </View>
            <Text className="text-[#6A6880] text-xs flex-shrink-0">Just now</Text>
          </View>

          {/* Resend Timer Section */}
          <View className="flex-row gap-3 items-center justify-center mt-8">
            <Text className="text-[#8B88A8] text-base">Didn't receive it? Resend in</Text>
            {!canResend ? (
              <View className="border border-[#9B59F5]/50 rounded-[12px] px-4 py-2 bg-[#9B59F5]/10">
                <Text className="text-[#9B59F5] font-bold text-base">
                  {formatTime(timeLeft)}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setTimeLeft(300);
                  setCanResend(false);
                }}
                activeOpacity={0.7}
              >
                <Text className="text-[#9B59F5] font-bold text-base">
                  Resend
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Code Input Section */}
          <View className="mt-10 gap-4">
            <View className="flex flex-col gap-2">
              <Text className="text-sm text-[#6A6880] font-bold">
                Enter Reset Code
              </Text>
              <View
                className={`flex-row items-center rounded-[14px] border px-5 h-[52px] bg-[#141325] ${
                  codeError ? "border-[#FF6B6B]" : "border-[#2A2845]"
                }`}
              >
                <Feather name="key" size={18} color="#3A3858" />
                <TextInput
                  value={oobCode}
                  onChangeText={(text) => {
                    setOobCode(text);
                    setCodeError("");
                  }}
                  placeholder={displayCode || "Paste code from email"}
                  placeholderTextColor="#3A3858"
                  editable={!isVerifyingCode}
                  className="ml-4 flex-1 text-[#EDEAF8] text-base font-semibold"
                />
              </View>
              {codeError && (
                <Text className="text-[#FF6B6B] text-sm font-semibold mt-1">
                  {codeError}
                </Text>
              )}
            </View>

            {/* Action Button */}
            <Pressable
              onPress={handleCodeInput}
              disabled={isVerifyingCode || !oobCode.trim()}
              className={`h-[48px] rounded-[14px] items-center justify-center flex-row gap-2 ${
                oobCode.trim() && !isVerifyingCode
                  ? "bg-[#E040A0]"
                  : "bg-[#E040A0]/40"
              }`}
            >
              {isVerifyingCode ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text className="text-white font-bold text-base">
                    Proceed to Password Reset
                  </Text>
                  <Feather name="arrow-right" size={18} color="#ffffff" />
                </>
              )}
            </Pressable>
          </View>

          {/* Try Again Link */}
          <View className="flex-row gap-2 items-center justify-center mt-8">
            <Text className="font-bold text-[#8B88A8] text-base">
              Wrong email?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <Text className="text-[#E040A0] font-bold text-base">
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Alert Modal */}
      <Modal
        visible={customAlert.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setCustomAlert((prev) => ({ ...prev, visible: false }))
        }
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="w-full rounded-[28px] bg-[#141325] border border-[#2A2845] px-6 py-6">
            <View className="flex-row items-center gap-3 mb-2">
              {customAlert.type === "error" && (
                <View className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 items-center justify-center">
                  <Feather name="alert-circle" size={20} color="#FF6B6B" />
                </View>
              )}
              {customAlert.type === "success" && (
                <View className="w-8 h-8 rounded-full bg-[#10B981]/20 items-center justify-center">
                  <Feather name="check-circle" size={20} color="#10B981" />
                </View>
              )}
              {customAlert.type === "info" && (
                <View className="w-8 h-8 rounded-full bg-[#9B59F5]/20 items-center justify-center">
                  <Feather name="info" size={20} color="#9B59F5" />
                </View>
              )}
              <Text className="text-white text-2xl font-bold flex-1">
                {customAlert.title}
              </Text>
            </View>

            <Text className="text-[#8B88A8] text-base text-center leading-6 mt-4">
              {customAlert.message}
            </Text>

            <Pressable
              onPress={() =>
                setCustomAlert((prev) => ({ ...prev, visible: false }))
              }
              className={`h-[52px] rounded-[16px] items-center justify-center mt-6 ${
                customAlert.type === "success"
                  ? "bg-[#10B981]"
                  : customAlert.type === "error"
                    ? "bg-[#FF6B6B]"
                    : "bg-[#9B59F5]"
              }`}
            >
              <Text className="text-white font-bold text-lg">Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ResetEmailSent;