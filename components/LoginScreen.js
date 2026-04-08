import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
// REMOVIDO: import { createUser... } from 'firebase/auth'
// AGORA USAMOS DIRETAMENTE O AUTH EXPORTADO
import { Dumbbell, Lock, Mail } from 'lucide-react-native';
import { auth } from '../src/config/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // SINTAXE COMPAT: auth.metodo()
        await auth.createUserWithEmailAndPassword(email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      // O App.js vai detectar a mudança automaticamente
    } catch (error) {
      console.log(error);
      let msg = error.message;
      // Tratamento de erros comuns
      if (msg.includes('invalid-email')) msg = 'E-mail inválido.';
      if (msg.includes('user-not-found')) msg = 'Usuário não encontrado.';
      if (msg.includes('wrong-password')) msg = 'Senha incorreta.';
      if (msg.includes('email-already-in-use')) msg = 'E-mail já cadastrado.';
      if (msg.includes('weak-password')) msg = 'A senha deve ter pelo menos 6 caracteres.';
      
      Alert.alert('Erro de Acesso', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Dumbbell color="#fbbf24" size={48} />
          <Text style={styles.title}>GYM GAIN</Text>
          
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Seu e-mail"
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock color="#64748b" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>
                {isRegistering ? 'CRIAR CONTA' : 'ACESSAR TREINO'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchBtn} 
            onPress={() => setIsRegistering(!isRegistering)}
          >
            <Text style={styles.switchText}>
              {isRegistering 
                ? 'Já tem conta? Fazer Login' 
                : 'Não tem conta? Criar agora'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { color: '#fbbf24', fontSize: 28, fontWeight: '900', marginTop: 16, letterSpacing: 1 },
  subtitle: { color: '#64748b', fontSize: 12, letterSpacing: 2, fontWeight: 'bold', marginTop: 4 },
  form: { gap: 16 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', 
    borderRadius: 12, paddingHorizontal: 16, height: 56, gap: 12 
  },
  input: { flex: 1, color: '#fff', fontSize: 16 },
  btn: { 
    backgroundColor: '#d97706', height: 56, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginTop: 8 
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchBtn: { alignItems: 'center', padding: 16 },
  switchText: { color: '#94a3b8' }
});