import * as FileSystem from "expo-file-system";

const LOG_FILE = FileSystem.documentDirectory + "app_logs.txt";

/**
 * Escreve uma mensagem de log no arquivo de logs do aplicativo.
 * Cada mensagem é prefixada com um timestamp ISO para facilitar a leitura.
 * @param message A mensagem de log a ser escrita. Pode ser qualquer string que descreva o evento ou informação relevante.
 * @returns void
 * @throws Erro se ocorrer um problema ao acessar o sistema de arquivos ou escrever no arquivo de log. O erro é capturado e uma mensagem de erro é exibida no console.
 */
export async function writeLog(message: string) {
  try {
    const timestamp = new Date().toISOString();

    const logMessage = `[${timestamp}] ${message}\n`;

    const fileInfo = await FileSystem.getInfoAsync(LOG_FILE);

    if (!fileInfo.exists) {
      await FileSystem.writeAsStringAsync(LOG_FILE, logMessage);
    } else {
      const currentContent = await FileSystem.readAsStringAsync(LOG_FILE);

      await FileSystem.writeAsStringAsync(
        LOG_FILE,
        currentContent + logMessage,
      );
    }
  } catch (err) {
    console.log("Erro ao salvar log:", err);
  }
}

export function getLogFilePath() {
  return LOG_FILE;
}
