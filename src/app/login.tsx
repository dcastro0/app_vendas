import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import tw from "twrnc";
import Button from "@/components/Button";

const loginSchema = z.object({
  email: z
    .string()
    .email()
    .min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
  password: z
    .string()
    .min(3, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type LoginFormData = typeof loginSchema._input;

const LoginScreen = () => {
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await signIn(data);
    router.replace("/");
  };

  const handleOffline = async () => {
    await signIn({ email: "offline@offline.com", password: "offline" });
    router.replace("/");
  }

  return (
    <View style={tw`flex-1 justify-center p-6`}>
      <Text style={tw`font-bold text-5xl text-center mb-8`}>LOGIN</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={tw`mb-4`}>
            <TextInput
              inputMode="email"
              style={tw`bg-gray-200 p-2 rounded-md py-4`}
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            {errors.email && (
              <Text style={tw`text-red-500 italic text-xs`}>
                {errors.email.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={tw`mb-4`}>
            <TextInput
              style={tw`bg-gray-200 p-2 rounded-md py-4`}
              placeholder="Senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
            />
            {errors.password && (
              <Text style={tw`text-red-500 italic text-xs`}>
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
      />
      <View style={tw`self-center`}>
        <Button onPress={handleSubmit(onSubmit)}>Entrar</Button>
      </View>
      <Pressable onPress={handleOffline} style={tw`self-center mt-4`}>
        <Text style={tw`text-gray-600 text-lg`}>Vender Offline</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;
