import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BookOpen,
  ClipboardPen,
  BarChart3,
  UserCircle2,
  Menu as MenuIcon,
  X,
  FileText,
  LogOut,
  Info,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const MANUAL_PDF = require('../../assets/MANUAL DO USUÁRIO.pdf');

export default function Header() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout } = useAuth();

  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [modalSimulados, setModalSimulados] = useState(false);
  const [modalManual, setModalManual] = useState(false);
  const [manualAbrindo, setManualAbrindo] = useState(false);

  const irPara = (rota) => {
    setMenuAberto(false);
    setPerfilAberto(false);
    navigation.navigate(rota);
  };

  const handleSair = async () => {
    setPerfilAberto(false);
    setMenuAberto(false);
    await logout();
  };

  const abrirSimulados = () => {
    setMenuAberto(false);
    setModalSimulados(true);
  };

  const abrirManualDoUsuario = () => {
    setPerfilAberto(false);
    setMenuAberto(false);
    setModalManual(true);
  };

  const abrirPdfManual = async () => {
    setManualAbrindo(true);
    try {
      const asset = Asset.fromModule(MANUAL_PDF);

      if (Platform.OS === 'web') {
        const pdfUrl = new URL(asset.uri, window.location.href).toString();
        const pdfTab = window.open('about:blank', '_blank');
        if (pdfTab) {
          pdfTab.location.replace(pdfUrl);
        } else {
          window.location.assign(pdfUrl);
        }
        setModalManual(false);
        return;
      }

      await asset.downloadAsync();
      if (!asset.localUri) {
        throw new Error('O arquivo do manual não foi encontrado no dispositivo.');
      }

      const arquivo = new File(asset.localUri);
      try {
        await arquivo.preview({ title: 'Manual do Usuário' });
      } catch (erroPreview) {
        if (!(await Sharing.isAvailableAsync())) {
          throw erroPreview;
        }
        await Sharing.shareAsync(arquivo.uri, {
          dialogTitle: 'Manual do Usuário',
          mimeType: 'application/pdf',
        });
      }
      setModalManual(false);
    } catch {
      Alert.alert(
        'Manual indisponível',
        'Não foi possível abrir o PDF neste dispositivo.',
      );
    } finally {
      setManualAbrindo(false);
    }
  };

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}>
        <View style={styles.header}>
          {/* Logo como atalho para a Home */}
          <Pressable
            onPress={() => irPara('Home')}
            style={({ pressed }) => [styles.logoButton, pressed && { opacity: 0.8 }]}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Pressable>

          {/* Botões do lado direito: Perfil e Menu Hambúrguer */}
          <View style={styles.rightActions}>
            <Pressable
              onPress={() => setPerfilAberto(true)}
              style={({ pressed }) => [styles.profileButton, pressed && styles.profileButtonPressed]}
            >
              <UserCircle2 size={28} color="#b7b7b7" />
            </Pressable>

            <Pressable
              onPress={() => setMenuAberto(!menuAberto)}
              style={({ pressed }) => [styles.menuToggleButton, pressed && { opacity: 0.7 }]}
            >
              {menuAberto ? (
                <X size={26} color={COLORS.primary} />
              ) : (
                <MenuIcon size={26} color={COLORS.textMuted} />
              )}
            </Pressable>
          </View>
        </View>

        {/* Menu Hambúrguer Dropdown */}
        {menuAberto && (
          <View style={styles.menuAberto}>
            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => irPara('BQ')}
            >
              <BookOpen size={22} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Banco de Questões</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={abrirSimulados}
            >
              <ClipboardPen size={22} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Simulados</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={() => irPara('Desempenho')}
            >
              <BarChart3 size={22} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Meu Desempenho</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Text style={styles.mobileProfileTitle}>Perfil</Text>

            <Pressable
              style={({ pressed }) => [styles.profileMenuButton, pressed && { opacity: 0.85 }]}
              onPress={abrirManualDoUsuario}
            >
              <FileText size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.profileMenuButtonText}>Manual do Usuário</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]}
              onPress={handleSair}
            >
              <LogOut size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.logoutButtonText}>Sair</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Modal Dropdown do Perfil */}
      <Modal
        visible={perfilAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setPerfilAberto(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPerfilAberto(false)}>
          <View style={[styles.profileMenuModal, { top: insets.top + 60 }]}>
            <Text style={styles.profileTitle}>Perfil</Text>

            <Pressable
              style={({ pressed }) => [styles.profileMenuButton, pressed && { opacity: 0.85 }]}
              onPress={abrirManualDoUsuario}
            >
              <FileText size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.profileMenuButtonText}>Manual do Usuário</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]}
              onPress={handleSair}
            >
              <LogOut size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.logoutButtonText}>Sair</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Modal Informativo: Simulados */}
      <Modal
        visible={modalSimulados}
        transparent
        animationType="slide"
        onRequestClose={() => setModalSimulados(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <ClipboardPen size={28} color={COLORS.primary} />
              <Text style={styles.infoModalTitle}>Simulados Preparatórios</Text>
            </View>
            <Text style={styles.infoModalDesc}>
              A plataforma HDPA disponibiliza cadernos de simulados completos para os vestibulares ENEM, USP (FUVEST), UNICAMP, UNESP e PUC.
            </Text>
            <View style={styles.infoModalBadge}>
              <Info size={18} color={COLORS.primary} />
              <Text style={styles.infoModalBadgeText}>
                Arquivo original: SIMULADOS.pdf integrado ao ecossistema da aplicação.
              </Text>
            </View>
            <Pressable
              style={styles.infoModalCloseButton}
              onPress={() => setModalSimulados(false)}
            >
              <Text style={styles.infoModalCloseText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal Informativo: Manual do Usuário */}
      <Modal
        visible={modalManual}
        transparent
        animationType="slide"
        onRequestClose={() => setModalManual(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalCard}>
            <View style={styles.infoModalHeader}>
              <FileText size={28} color={COLORS.primary} />
              <Text style={styles.infoModalTitle}>Manual do Usuário</Text>
            </View>
            <Text style={styles.infoModalDesc}>
              Guia completo de navegação e resolução de questões da plataforma HDPA Mobile.
            </Text>
            <View style={styles.manualPoints}>
              <Text style={styles.manualPoint}>• Banco de Questões: Filtre por vestibular, disciplina e assuntos.</Text>
              <Text style={styles.manualPoint}>• Gabarito em Tempo Real: Acompanhe acertos e erros no painel.</Text>
              <Text style={styles.manualPoint}>• Meu Desempenho: Monitore taxa de acertos e evolução mensal.</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.manualOpenButton,
                pressed && styles.manualActionPressed,
                manualAbrindo && { opacity: 0.7 },
              ]}
              onPress={abrirPdfManual}
              disabled={manualAbrindo}
            >
              {manualAbrindo ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.infoModalCloseText}>Abrir manual em PDF</Text>
              )}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.manualCloseButton,
                pressed && styles.manualActionPressed,
              ]}
              onPress={() => setModalManual(false)}
            >
              <Text style={styles.infoModalCloseText}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    zIndex: 100,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logoButton: {
    justifyContent: 'center',
  },
  logoImage: {
    width: 140,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonPressed: {
    backgroundColor: '#e6edff',
  },
  menuToggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  menuAberto: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: '#f5f5f7',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555555',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 4,
  },
  mobileProfileTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  profileMenuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  profileMenuButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  profileMenuModal: {
    position: 'absolute',
    right: 16,
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  profileTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  infoModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
  },
  infoModalDesc: {
    fontSize: 15,
    lineHeight: 22,
    color: '#666666',
    marginBottom: 16,
  },
  infoModalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef3ff',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  infoModalBadgeText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 18,
  },
  manualPoints: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  manualPoint: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  infoModalCloseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoModalCloseText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  manualOpenButton: {
    backgroundColor: COLORS.primary,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    marginTop: 2,
    marginBottom: 10,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  manualCloseButton: {
    backgroundColor: COLORS.primary,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  manualActionPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
