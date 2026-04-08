import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { X, Check, Lightbulb } from 'lucide-react-native';

export default function AddExerciseForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [protocol, setProtocol] = useState('');
  const [obs, setObs] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    // Se não preencher protocolo, assume padrão
    const finalProtocol = protocol.trim() || '3 Séries Normais';
    onAdd({ name, protocol: finalProtocol, obs });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Novo Exercício</Text>
        <TouchableOpacity onPress={onCancel}>
          <X color="#94a3b8" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} keyboardShouldPersistTaps="handled">
        
        {/* INPUT NOME */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>NOME DO EXERCÍCIO</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Supino Reto"
            placeholderTextColor="#475569"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        
        <View style={styles.tipBox}>
            <View style={{flexDirection:'row', alignItems:'center', gap: 6, marginBottom: 4}}>
                <Lightbulb color="#fbbf24" size={16} />
                <Text style={styles.tipTitle}>Como configurar as séries?</Text>
            </View>
            <Text style={styles.tipText}>
                O app cria as linhas automaticamente baseado no número inicial.
                Use <Text style={styles.highlight}>|</Text> para separar tipos.
            </Text>
            <View style={styles.exampleBox}>
                <Text style={styles.exampleLabel}>Exemplo Avançado:</Text>
                <Text style={styles.exampleText}>"2 Feeder | 1 Top Set | 1 Back-off"</Text>
            </View>
            <Text style={styles.tipSub}>Isso criará 4 linhas de input coloridas automaticamente.</Text>
        </View>

        {/* INPUT PROTOCOLO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PROTOCOLO / SÉRIES</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2 Feeder | 1 Top Set" // Placeholder educativo
            placeholderTextColor="#475569"
            value={protocol}
            onChangeText={setProtocol}
          />
        </View>

        {/* INPUT OBSERVAÇÃO */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>OBSERVAÇÕES (OPCIONAL)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ex: Banco inclinado 30 graus..."
            placeholderTextColor="#475569"
            multiline
            numberOfLines={3}
            value={obs}
            onChangeText={setObs}
          />
        </View>

        {/* BOTÃO SALVAR */}
        <TouchableOpacity 
          style={[styles.saveBtn, !name.trim() && styles.disabledBtn]} 
          onPress={handleSubmit}
          disabled={!name.trim()}
        >
          <Check color="#fff" size={20} />
          <Text style={styles.saveBtnText}>ADICIONAR AO TREINO</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1e293b', borderRadius: 16, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', maxHeight: 600 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#334155', backgroundColor: '#0f172a' },
  title: { color: '#fbbf24', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  form: { padding: 16 },
  inputGroup: { marginBottom: 16 },
  label: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold', marginBottom: 6, letterSpacing: 0.5 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#334155', borderRadius: 8, padding: 12, color: '#fff', fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  
  // Estilos da Dica UX
  tipBox: { backgroundColor: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  tipTitle: { color: '#fbbf24', fontWeight: 'bold', fontSize: 12 },
  tipText: { color: '#cbd5e1', fontSize: 12, marginBottom: 8 },
  highlight: { color: '#fbbf24', fontWeight: 'bold', fontSize: 14 },
  exampleBox: { backgroundColor: '#0f172a', padding: 8, borderRadius: 6, marginBottom: 4 },
  exampleLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  exampleText: { color: '#fff', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  tipSub: { color: '#64748b', fontSize: 10, fontStyle: 'italic' },

  saveBtn: { backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 8, gap: 8, marginTop: 8 },
  disabledBtn: { backgroundColor: '#334155', opacity: 0.7 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});