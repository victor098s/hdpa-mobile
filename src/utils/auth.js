import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "jwtToken";
const RESPOSTAS_KEY = "respostas";

let cachedToken = null;

// Função pura para decodificar base64 sem depender de APIs exclusivas do navegador
function decodeBase64(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }

  if (typeof atob === "function") {
    try {
      return atob(base64);
    } catch {
      // continua para o fallback
    }
  }

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  base64 = String(base64).replace(/=+$/, "");

  for (
    let bc = 0, bs = 0, buffer, idx = 0;
    (buffer = base64.charAt(idx++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
}

// Inicializa o token do cache em memória
export async function initToken() {
  try {
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
  } catch {
    cachedToken = null;
    return null;
  }
}

// Retorna o token síncrono da memória ou busca do AsyncStorage
export function getToken() {
  return cachedToken;
}

// Busca o token de forma assíncrona garantindo leitura persistente
export async function getTokenAsync() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    cachedToken = token;
    return token;
  } catch {
    return cachedToken;
  }
}

// Salva o JWT no AsyncStorage e atualiza a memória
export async function setToken(token) {
  cachedToken = token;
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.warn("Erro ao salvar token no AsyncStorage:", error);
  }
}

// Remove o token da aplicação
export async function removeToken() {
  cachedToken = null;
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.warn("Erro ao remover token do AsyncStorage:", error);
  }
}

// Valida a estrutura do JWT e compara o campo exp com a data atual
export function isTokenExpired(token) {
  if (!token) return true;

  const parts = token.split(".");
  if (parts.length !== 3) return true;

  try {
    const jsonStr = decodeBase64(parts[1]);
    const payload = JSON.parse(jsonStr);
    if (!payload || typeof payload.exp !== "number") {
      return true;
    }
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

// Wrapper do fetch que injeta o Authorization automaticamente quando há token salvo
export async function getRespostas() {
  try {
    const stored = await AsyncStorage.getItem(RESPOSTAS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export async function salvarResposta({ questaoId, letra, acertou }) {
  const respostas = await getRespostas();
  const atualizadas = respostas.filter((item) => item.questaoId !== questaoId);
  atualizadas.push({ questaoId, letra, acertou, timestamp: Date.now() });
  await AsyncStorage.setItem(RESPOSTAS_KEY, JSON.stringify(atualizadas));
  return atualizadas;
}

export async function clearStorage() {
  cachedToken = null;
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, RESPOSTAS_KEY]);
  } catch (error) {
    console.warn("Erro ao limpar storage:", error);
  }
}
