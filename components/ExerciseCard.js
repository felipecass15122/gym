import React, { useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Info, X } from 'lucide-react-native';

export const ExerciseCard = ({ exercise, data, onInputChange, onRemove }) => {
  
  const hasObs = !!exercise.obs;

  const sets = useMemo(() => {
    if (!exercise.protocol) return [{ id: 1, label: 'Série Única', type: 'normal' }];

    const parts = exercise.protocol.split('|');
    let generatedSets = [];
    let setCounter = 1;

    parts.forEach(part => {
      const cleanPart = part.trim();
      // Tenta achar um número no começo (ex: "2 Feeder")
      const match = cleanPart.match(/^(\d+)/); 
      const count = match ? parseInt(match[1]) : 1; // Se não tiver número, assume 1
      
      // Define o tipo para colorir (Cosmético)
      let type = 'normal';
      if (cleanPart.toLowerCase().includes('feeder') || cleanPart.toLowerCase().includes('aquecimento')) type = 'warmup';
      if (cleanPart.toLowerCase().includes('top') || cleanPart.toLowerCase().includes('working')) type = 'heavy';
      if (cleanPart.toLowerCase().includes('back')) type = 'backoff';

      // Cria a quantidade de linhas necessárias
      for (let i = 0; i < count; i++) {
        generatedSets.push({
          id: setCounter,
          label: cleanPart.replace(/^\d+\s*/, ''), // Remove o número do nome (ex: "Feeder" em vez de "2 Feeder")
          type: type
        });
        setCounter++;
      }
    });

    return generatedSets;
  }, [exercise.protocol]);

  const getInputValue = (setIndex, field) => {
    return data[`${exercise.id}-s${setIndex}-${field}`] || '';
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.indicator} />
      
      {/* HEADER DO CARD (Nome e Ícones) - Não mudou quase nada */}
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
        <View style={styles.actions}>
          {hasObs && (
            <TouchableOpacity onPress={() => Alert.alert("Observação", exercise.obs)} style={styles.iconBtn}>
              <Info size={20} color="#f59e0b" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onRemove(exercise.id)} style={styles.iconBtn}>
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.tableContainer}>
        
        <View style={styles.tableHeader}>
            <Text style={[styles.colText, {width: 30}]}>#</Text>
            <Text style={[styles.colText, {flex:1, textAlign:'left'}]}>TIPO</Text>
            <Text style={[styles.colText, {width: 70}]}>KG</Text>
            <Text style={[styles.colText, {width: 50}]}>REPS</Text>
        </View>

        
        {sets.map((set, index) => (
            <View key={set.id} style={[styles.row, index % 2 !== 0 && styles.rowAlt]}>
                
                
                <View style={styles.setNumberContainer}>
                    <Text style={styles.setNumber}>{set.id}</Text>
                </View>

                
                <Text style={[
                    styles.setType, 
                    set.type === 'warmup' && { color: '#94a3b8' },
                    set.type === 'heavy' && { color: '#fbbf24', fontWeight: 'bold' },
                    set.type === 'backoff' && { color: '#60a5fa' }
                ]} numberOfLines={1}>
                    {set.label}
                </Text>

                {/* Input CARGA */}
                <TextInput
                    style={styles.inputCompact}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor="#475569"
                    
                    value={getInputValue(set.id, 'carga')}
                    
                    onChangeText={(t) => onInputChange(exercise.id, `s${set.id}-carga`, t)}
                />

                {/* Input REPS */}
                <TextInput
                    style={styles.inputCompact}
                    keyboardType="numeric"
                    placeholder="-"
                    placeholderTextColor="#475569"
                    value={getInputValue(set.id, 'reps')}
                    onChangeText={(t) => onInputChange(exercise.id, `s${set.id}-reps`, t)}
                />
            </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#334155', overflow: 'hidden', position: 'relative' },
  indicator: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#d97706' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingLeft: 8 },
  title: { color: '#f1f5f9', fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8, textTransform: 'uppercase' },
  actions: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6 },

  tableContainer: { marginLeft: 8 },
  tableHeader: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
  colText: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rowAlt: { opacity: 0.9 }, // Um truque visual: linhas pares ficam levemente transparentes para facilitar a leitura

  setNumberContainer: { width: 30, alignItems: 'center' },
  setNumber: { color: '#475569', fontSize: 12, fontWeight: 'bold' },

  setType: { flex: 1, color: '#cbd5e1', fontSize: 12 },

  inputCompact: { 
    backgroundColor: '#0f172a', 
    borderWidth: 1, 
    borderColor: '#334155', 
    borderRadius: 8, 
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center',
    height: 36,
    width: 70
  
  }
});