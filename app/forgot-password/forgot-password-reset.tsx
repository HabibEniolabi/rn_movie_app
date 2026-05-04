// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Platform,
//   Keyboard,
//   Modal,
//   Pressable,
// } from "react-native";
// import React, { useState } from "react";
// import { router } from "expo-router";
// import Feather from "react-native-vector-icons/Feather";
// import { images } from "@/constants/images";
// import Button from "@/components/Button";
// import { FIREBASE_AUTH } from "@/FirebaseConfig";
// import { sendPasswordResetEmail } from "firebase/auth";

// const ForgotPassword = () => {
//   const isValidEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const [email, setEmail] = useState("");
//   const [isSending, setIsSending] = useState(false);
//   const auth = FIREBASE_AUTH;

//   const [customAlert, setCustomAlert] = useState<{
//     visible: boolean;
//     title: string;
//     message: string;
//   }>({
//     visible: false,
//     title: "",
//     message: "",
//   });

//   const handleSendResetLink = async () => {
//     const cleanEmail = email.trim().toLowerCase();

//     if (!cleanEmail) {
//       setCustomAlert({
//         visible: true,
//         title: "Missing email",
//         message: "Please enter your registered email.",
//       });
//       return;
//     }

//     try {
//       setIsSending(true);
//       await sendPasswordResetEmail(auth, cleanEmail);

//       router.push({
//         pathname: "/forgot-password/reset-email-sent",
//         params: { email: cleanEmail },
//       });
//     } catch (error: any) {
//       setCustomAlert({
//         visible: true,
//         title: "Reset failed",
//         message:
//           error?.code === "auth/invalid-email"
//             ? "Please enter a valid email address."
//             : "Could not send reset link. Please check the email and try again.",
//       });
//     } finally {
//       setIsSending(false);
//     }
//   };
//   return (
//     <KeyboardAvoidingView
//       className="bg-primary flex-1"
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View className="bg-primary flex-1 px-8">
//           <View className="mt-20">
//             <TouchableOpacity
//               activeOpacity={0.9}
//               onPress={() => router.back()}
//               className="p-2 rounded-[12px] border border-[#2A2845] bg-dark-300 items-center justify-center self-start"
//             >
//               <Feather name="chevron-left" size={24} color="#8B88A8" />
//             </TouchableOpacity>

//             <View className="flex-col items-center justify-center mt-12">
//               <View className="gap-6 items-center justify-center">
//                 <Image
//                   source={images.lock}
//                   resizeMode="contain"
//                   className="w-[110px] h-[110px]"
//                 />
//                 <View className="flex-col gap-6">
//                   <Text className="text-white text-3xl text-center font-bold">
//                     Forgot Password?
//                   </Text>
//                   <Text className="text-dark-500 test-base leading-6 text-center">
//                     No worries! Enter your registered email and we'll send you a
//                     reset link.
//                   </Text>
//                 </View>
//               </View>
//             </View>
//             <View className="flex flex-col gap-2 mt-6">
//               <Text className="text-md text-[#6A6880] font-bold">
//                 Email address
//               </Text>
//               <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52p]">
//                 <Feather name="mail" size={18} color="#3A3858" />
//                 <TextInput
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="alex@example.com"
//                   placeholderTextColor="#3A3858"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   className={`ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold`}
//                 />
//                 {isValidEmail(email) && (
//                   <View className="bg-[#E040A0] rounded-full p-2">
//                     <Feather name="check" size={18} color="#ffffff" />
//                   </View>
//                 )}
//               </View>
//             </View>

//             {email.length > 0 && (
//               <View className="flex-row gap-3 bg-[#9B59F5]/15 border border-[#3A2878] rounded-[22px] px-6 py-6 mt-6">
//                 <Text className="text-[34px]">💡</Text>
//                 <Text className="text-dark-500 text-base flex-1 leading-7">
//                   We&apos;ll send a secure link to{" "}
//                   <Text className="text-[#9B59F5] font-bold">
//                     {email.trim().toLowerCase() || "alex@example.com"}.{" "}
//                   </Text>
//                   {""}
//                   The link expires in {""}
//                   <Text className="text-[#9B59F5] font-bold">15 minutes.</Text>
//                   {""}
//                 </Text>
//               </View>
//             )}

//             <View className="mt-8">
//               <Button
//                 title={isSending ? "Sending..." : "Send Reset Link"}
//                 onPress={handleSendResetLink}
//                 disabled={isSending}
//                 showArrow={!isSending}
//               />
//             </View>
//             <View className="flex-row gap-2 items-center justify-center mt-8">
//               <Text className="font-bold text-dark-500 text-md">
//                 Remembered it?{" "}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => router.replace("/login")}
//                 activeOpacity={0.85}
//               >
//                 <Text className="text-[#E040A0] font-bold text-[20px]">
//                   Back to Sign In
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

// export default ForgotPassword;
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Modal,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Feather from "react-native-vector-icons/Feather";
import { images } from "@/constants/images";
import Button from "@/components/Button";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const auth = FIREBASE_AUTH;

  const [customAlert, setCustomAlert] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: "error" | "success" | "info";
    showNavigate?: boolean;
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const handleSendResetLink = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setCustomAlert({
        visible: true,
        title: "Missing email",
        message: "Please enter your registered email.",
        type: "error",
      });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setCustomAlert({
        visible: true,
        title: "Invalid email",
        message: "Please enter a valid email address.",
        type: "error",
      });
      return;
    }

    try {
      setIsSending(true);
      
      // Send password reset email via Firebase
      await sendPasswordResetEmail(auth, cleanEmail);

      // Show success alert with navigation option
      setCustomAlert({
        visible: true,
        title: "Email Sent!",
        message: `We've sent a password reset code to ${cleanEmail}. Check your inbox and enter the code to proceed.`,
        type: "success",
        showNavigate: true,
      });
    } catch (error: any) {
      let errorMessage = "Could not send reset email. Please try again.";
      let errorTitle = "Reset Failed";

      if (error?.code === "auth/user-not-found") {
        errorTitle = "Email Not Found";
        errorMessage = `No account found for ${cleanEmail}. Please check and try again.`;
      } else if (error?.code === "auth/invalid-email") {
        errorTitle = "Invalid Email";
        errorMessage = "Please enter a valid email address.";
      } else if (error?.code === "auth/too-many-requests") {
        errorTitle = "Too Many Attempts";
        errorMessage = "Too many reset requests. Please try again later.";
      }

      setCustomAlert({
        visible: true,
        title: errorTitle,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSending(false);
    }
  };

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

          <View className="flex-col items-center justify-center mt-12">
            <View className="gap-6 items-center justify-center">
              <Image
                source={images.lock}
                resizeMode="contain"
                className="w-[110px] h-[110px]"
              />
              <View className="flex-col gap-6">
                <Text className="text-white text-3xl text-center font-bold">
                  Forgot Password?
                </Text>
                <Text className="text-dark-500 text-base leading-6 text-center">
                  No worries! Enter your registered email and we'll send you a reset code.
                </Text>
              </View>
            </View>
          </View>

          {/* Email Input */}
          <View className="flex flex-col gap-2 mt-6">
            <Text className="text-md text-[#6A6880] font-bold">
              Email address
            </Text>
            <View className="flex-row items-center rounded-[14px] border border-[#2A2845] bg-[#141325] px-6 h-[52px]">
              <Feather name="mail" size={18} color="#3A3858" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="alex@example.com"
                placeholderTextColor="#3A3858"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSending}
                className="ml-5 flex-1 text-[#EDEAF8] text-lg font-semibold"
              />
              {isValidEmail(email) && (
                <View className="bg-[#E040A0] rounded-full p-2">
                  <Feather name="check" size={18} color="#ffffff" />
                </View>
              )}
            </View>
          </View>

          {/* Info Box */}
          {email.length > 0 && (
            <View className="flex-row gap-3 bg-[#9B59F5]/15 border border-[#3A2878] rounded-[22px] px-6 py-6 mt-6">
              <Text className="text-[34px]">💡</Text>
              <Text className="text-dark-500 text-base flex-1 leading-7">
                We'll send a reset code to{" "}
                <Text className="text-[#9B59F5] font-bold">
                  {email.trim().toLowerCase() || "alex@example.com"}.
                </Text>
                {" "}Check your inbox to proceed.
              </Text>
            </View>
          )}

          {/* Send Button */}
          <View className="mt-8">
            <Button
              title={isSending ? "Sending..." : "Send Reset Code"}
              onPress={handleSendResetLink}
              disabled={isSending || !isValidEmail(email)}
              showArrow={!isSending}
            />
          </View>

          {/* Back to Sign In */}
          <View className="flex-row gap-2 items-center justify-center mt-8">
            <Text className="font-bold text-dark-500 text-md">
              Remembered it?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              activeOpacity={0.85}
            >
              <Text className="text-[#E040A0] font-bold text-[20px]">
                Back to Sign In
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
          <View className="w-full rounded-[28px] bg-[#141325] border border-[#2A2845] px-6 py-8">
            {/* Header with Icon */}
            <View className="flex-row items-center gap-3 mb-4">
              {customAlert.type === "error" && (
                <View className="w-10 h-10 rounded-full bg-[#FF6B6B]/20 items-center justify-center">
                  <Feather name="alert-circle" size={22} color="#FF6B6B" />
                </View>
              )}
              {customAlert.type === "success" && (
                <View className="w-10 h-10 rounded-full bg-[#10B981]/20 items-center justify-center">
                  <Feather name="check-circle" size={22} color="#10B981" />
                </View>
              )}
              {customAlert.type === "info" && (
                <View className="w-10 h-10 rounded-full bg-[#9B59F5]/20 items-center justify-center">
                  <Feather name="info" size={22} color="#9B59F5" />
                </View>
              )}
              <Text className="text-white text-2xl font-bold flex-1">
                {customAlert.title}
              </Text>
            </View>

            {/* Message */}
            <Text className="text-[#8B88A8] text-base text-center leading-6 mb-6">
              {customAlert.message}
            </Text>

            {/* Action Buttons */}
            {customAlert.showNavigate ? (
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() =>
                    setCustomAlert((prev) => ({ ...prev, visible: false }))
                  }
                  className="flex-1 h-[48px] rounded-[16px] bg-[#2A2845] items-center justify-center"
                >
                  <Text className="text-[#8B88A8] font-bold text-base">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setCustomAlert((prev) => ({ ...prev, visible: false }));
                    // Generate a local code to display
                    const localCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                    router.push({
                      pathname: "/forgot-password/reset-email-sent",
                      params: { 
                        email: email.trim().toLowerCase(),
                        displayCode: localCode,
                      },
                    });
                  }}
                  className="flex-1 h-[48px] rounded-[16px] bg-[#10B981] items-center justify-center flex-row gap-2"
                >
                  <Text className="text-white font-bold text-base">
                    Proceed
                  </Text>
                  <Feather name="arrow-right" size={18} color="#ffffff" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() =>
                  setCustomAlert((prev) => ({ ...prev, visible: false }))
                }
                className={`h-[52px] rounded-[16px] items-center justify-center ${
                  customAlert.type === "success"
                    ? "bg-[#10B981]"
                    : customAlert.type === "error"
                      ? "bg-[#FF6B6B]"
                      : "bg-[#9B59F5]"
                }`}
              >
                <Text className="text-white font-bold text-lg">Okay</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;