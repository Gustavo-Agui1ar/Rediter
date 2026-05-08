import { getHighlightedParts, isMatch } from "@/utils/regex.utils";
import React, { memo } from "react";
import { StyleProp, Text, TextStyle } from "react-native";

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  textStyle?: StyleProp<TextStyle>;
  highlightColor?: string;
}

const HighlightedText = ({
  text,
  searchTerm,
  textStyle,
  highlightColor,
}: HighlightedTextProps) => {
  if (!searchTerm.trim()) {
    return <Text style={textStyle}>{text}</Text>;
  }

  const parts = getHighlightedParts(text, searchTerm);

  return (
    <Text style={textStyle}>
      {parts.map((part, index) => {
        const matched = isMatch(part, searchTerm);

        return (
          <Text
            key={`${index}-${part}`}
            style={
              matched
                ? {
                    fontWeight: "bold",
                    color: highlightColor || "#000",
                  }
                : undefined
            }
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

export default memo(HighlightedText);
