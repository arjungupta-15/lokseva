import { SymbolView } from 'expo-symbols';

const MAPPING = {
  'house.fill': 'house.fill',
  'paperplane.fill': 'paperplane.fill',
  'chevron.left.forwardslash.chevron.right': 'chevron.left.forwardslash.chevron.right',
  'chevron.right': 'chevron.right',
  'square.and.pencil': 'square.and.pencil',
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="alwaysOriginal"
      name={MAPPING[name]}
      size={size}
      style={style}
    />
  );
}
