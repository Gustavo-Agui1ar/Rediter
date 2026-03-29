import React, { useRef, useState } from "react";
import { LayoutChangeEvent, TextInput, View } from "react-native";
import { styles } from "./code.style";

interface OtpInputProps {
  length?: number;
  OnChangeCode?: (code: string) => void;
}

export default function OtpInput({ length = 6, OnChangeCode }: OtpInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const [size, setSize] = useState(50);

  const inputs = useRef<(TextInput | null)[]>([]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    const gap = 10;
    const totalGap = gap * (length - 1);

    const boxSize = (width - totalGap) / length;

    setSize(boxSize);
  };

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (OnChangeCode) {
      OnChangeCode(newCode.join(""));
    }
  };

  const handleBackspace = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref: TextInput | null) => {
            inputs.current[index] = ref;
          }}
          style={[
            styles.input,
            {
              width: size,
              height: size,
              fontSize: size * 0.4,
            },
          ]}
          keyboardType="numeric"
          maxLength={1}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            handleBackspace(nativeEvent.key, index)
          }
        />
      ))}
    </View>
  );
}
