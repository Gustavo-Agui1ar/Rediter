/* ---------- DARK MODE (Ajustado e Consistente) ---------- */
export const DarkColors = {
  /* Base - Subtom azulado/saturno */
  background: "#0D0E14",
  backgroundSecondary: "#1A1C2C",
  surface: "#161824",
  surfaceAlt: "#1F2233",

  /* Brand */
  primary: "#6B66FF",
  primaryLight: "#8A85FF",
  primaryDark: "#4D49CC",

  /* Text */
  textPrimary: "#F0F0F7",
  textSecondary: "#A1A4C1",
  textMuted: "#6B6E8F",

  /* UI */
  border: "#2F334D",
  divider: "#25283D",

  fill_button: "#6B66FF",
  border_button: "#6B66FF",

  /* States/Feedback */
  disabled: "#3E4159",
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayDark: "rgba(0, 0, 0, 0.8)",
  success: "#2DC653",
  warning: "#F4A261",
  error: "#E63946",
  link: "#8A85FF",

  white: "#FFFFFF",
  black: "#000000",

  // ==========================================
  // CHAT - CORES INTEGRADAS AO DARK MODE
  // ==========================================
  chatBubbleMe: "#4D49CC", // Usa o 'primaryDark' para um balão roxo integrado e confortável à noite
  chatBubbleThem: "#161824", // Usa o próprio 'surface' para o balão de quem recebe
  chatTextMe: "#F0F0F7", // Usa o 'textPrimary'
  chatTextThem: "#F0F0F7", // Usa o 'textPrimary'
  chatTimeMe: "#A1A4C1", // Usa o 'textSecondary' para não brigar com o texto
  chatTimeThem: "#6B6E8F", // Usa o 'textMuted' sobre o fundo surface
  chatStatusRead: "#8A85FF", // Usa o 'primaryLight' para o check duplo brilhar no balão escuro
  chatStatusUnread: "#6B6E8F", // Usa o 'textMuted'
};

/* ---------- LIGHT MODE (Ajustado e Consistente) ---------- */
export const LightColors = {
  /* Base */
  background: "#F5F7FF",
  backgroundSecondary: "#ECECFC",
  surface: "#FFFFFF",
  surfaceAlt: "#ECECFC",

  /* Brand */
  primary: "#6B66FF",
  primaryLight: "#8A85FF",
  primaryDark: "#4D49CC",

  /* Text */
  textPrimary: "#151621",
  textSecondary: "#52547D",
  textMuted: "#8E91B5",

  /* UI */
  border: "#D1D5F0",
  divider: "#bfc0ca",

  fill_button: "#6B66FF",
  border_button: "#6B66FF",

  /* States/Feedback */
  disabled: "#C8CADA",
  overlay: "rgba(0, 0, 0, 0.2)",
  overlayDark: "rgba(0, 0, 0, 0.5)",
  success: "#28A745",
  warning: "#E67E22",
  error: "#DC3545",
  link: "#4C49ED",

  white: "#FFFFFF",
  black: "#000000",

  // ==========================================
  // CHAT - CORES INTEGRADAS AO LIGHT MODE
  // ==========================================
  chatBubbleMe: "#ECECFC", // Usa o 'backgroundSecondary' (exatamente o lilás suave da sua imagem)
  chatBubbleThem: "#FFFFFF", // Usa o 'surface' puro (branco da sua imagem)
  chatTextMe: "#151621", // Usa o 'textPrimary'
  chatTextThem: "#151621", // Usa o 'textPrimary'
  chatTimeMe: "#52547D", // Usa o 'textSecondary'
  chatTimeThem: "#8E91B5", // Usa o 'textMuted'
  chatStatusRead: "#6B66FF", // Usa o 'primary' (Roxo/Azul vibrante para indicar lido)
  chatStatusUnread: "#8E91B5", // Usa o 'textMuted'
};
