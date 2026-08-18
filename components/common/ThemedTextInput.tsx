import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Radii, BorderWidth } from '@/constants/theme';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedTextInput({ style, lightColor, darkColor, ...rest }: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({}, 'borderMuted');
  const backgroundColor = useThemeColor({}, 'card');
  const placeholderColor = useThemeColor({}, 'icon');

  return (
    <TextInput
      style={[styles.input, { color, borderColor, backgroundColor }, style]}
      placeholderTextColor={placeholderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: BorderWidth.thin,
    borderRadius: Radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    BorderWidth: 2
  },
});
