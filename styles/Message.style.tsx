import { TextSize } from "@/styles/global.styles";
import { makeStyles } from "@/utils/makeStyles.utils";

// ============================================================================
// INTERFACE DE CORES ATUALIZADA (Incluindo as propriedades de Chat)
// ============================================================================
export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  divider: string;

  fill_button: string;
  border_button: string;

  disabled: string;
  overlay: string;
  overlayDark: string;
  success: string;
  warning: string;
  error: string;
  link: string;
  white: string;
  black: string;

  // Propriedades específicas adicionadas para o layout de mensagens
  chatBubbleMe: string; // Fundo do balão enviado por você
  chatBubbleThem: string; // Fundo do balão recebido do outro
  chatTextMe: string; // Cor do texto da sua mensagem
  chatTextThem: string; // Cor do texto da mensagem do outro
  chatTimeMe: string; // Cor do horário no seu balão
  chatTimeThem: string; // Cor do horário no balão do outro
  chatStatusRead: string; // Cor do ícone/texto de lido (✓✓)
  chatStatusUnread: string; // Cor do ícone/texto de enviado/entregue (✓)
}

// ============================================================================
// HOOK DE ESTILOS DO CHAT
// ============================================================================
export const useChatStyles = makeStyles((colors: ThemeColors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitle: {
    fontSize: TextSize.md,
    fontWeight: "bold",
    color: colors.textPrimary,
  },

  chatArea: {
    flex: 1,
    paddingBottom: 16,
  },

  listContent: {
    paddingHorizontal: 16, // Espaçamento maior nas laterais para respirar
    paddingBottom: 16,
    gap: 8, // Mantém o espaçamento uniforme e nativo entre as mensagens
  },

  loader: {
    marginTop: 20,
  },

  footerLoader: {
    marginVertical: 10,
  },

  // =========================
  // Mensagens (Balões)
  // =========================

  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  noMessagesText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },

  bubbleWrapper: {
    width: "100%",
    marginVertical: 2,
    flexDirection: "row",
  },

  wrapperMe: {
    justifyContent: "flex-end",
  },

  wrapperThem: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "80%",
    minWidth: 80, // Garante que palavras muito curtas como "Ok" não esmaguem o relógio
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18, // Estilo arredondado moderno

    // Elevação sutil para dar profundidade ao balão
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },

  bubbleMe: {
    backgroundColor: colors.chatBubbleMe, // Tipagem específica
    borderBottomRightRadius: 4, // Cria o efeito de ponta/cauda no lado direito
  },

  bubbleThem: {
    backgroundColor: colors.chatBubbleThem, // Tipagem específica
    borderBottomLeftRadius: 4, // Cria o efeito de ponta/cauda no lado esquerdo
  },

  textMe: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.chatTextMe, // Tipagem específica
  },

  textThem: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.chatTextThem, // Tipagem específica
  },

  // =========================
  // Hora / Status da Mensagem
  // =========================
  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },

  timeMe: {
    fontSize: 11,
    color: colors.chatTimeMe, // Tipagem específica
  },

  timeThem: {
    fontSize: 11,
    color: colors.chatTimeThem, // Tipagem específica
  },

  checkMarks: {
    fontSize: 12,
    fontWeight: "bold",
  },

  checkMarksSent: {
    color: colors.chatStatusUnread, // Tipagem específica
  },

  checkMarksRead: {
    color: colors.chatStatusRead, // Tipagem específica
  },

  // =========================
  // Barra de Input (Rodapé)
  // =========================
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: colors.background, // Fundo unificado com o chat para um visual cleaner
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    width: "100%",
  },

  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 24, // Transforma a caixa de texto em formato de "pílula"
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120, // Impede que o input suba infinitamente ao digitar muito texto
    fontSize: 16,
    color: colors.textPrimary,
  },

  sendButton: {
    marginLeft: 10,
    marginBottom: 0,
    backgroundColor: colors.primary,
    width: 48, // Tamanho ideal para área de clique confortável (Acessibilidade)
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: colors.disabled,
    opacity: 0.6, // Feedback visual sutil de desativado
  },
}));
