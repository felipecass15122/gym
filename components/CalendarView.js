
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { ChevronLeft, ChevronRight, X, Zap, Trash } from 'lucide-react-native';

const WORKOUT_TYPES = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3', 'OFF', 'Extras'];
const SEQUENCE = ['A1', 'B1', 'A2', 'B2', 'A3', 'B3'];
const COLORS = { 'A1': '#d97706', 'B1': '#2563eb', 'A2': '#b45309', 'B2': '#1d4ed8', 'A3': '#92400e', 'B3': '#1e40af', 'OFF': '#334155', 'Extras': '#047857' };

export const CalendarView = ({ calendarData, onUpdateDay, onOpenWorkout, onBatchUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAutoFill, setShowAutoFill] = useState(false);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  };

  const { days, firstDay, year, month } = getDaysInMonth(currentDate);
  const formatDate = (d, m, y) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const handleDayClick = (day) => setSelectedDate(formatDate(day, month, year));

  const handleClearMonth = () => {
    Alert.alert(
        "Limpar Mês",
        "Tem certeza que deseja apagar TODOS os treinos deste mês?",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Apagar Tudo", 
                style: "destructive", 
                onPress: () => {
                    const updates = {}; // Pacote de atualizações
                    
                    // Prepara o pacote: marca null em todos os dias que tem treino
                    for(let i = 1; i <= days; i++) {
                        const dateStr = formatDate(i, month, year);
                        if (calendarData[dateStr]) {
                            updates[dateStr] = null;
                        }
                    }

                    // Envia uma única vez ao Firebase
                    if (Object.keys(updates).length > 0) {
                        onBatchUpdate(updates); 
                        Alert.alert("Limpo", "O calendário foi reiniciado.");
                    } else {
                        Alert.alert("Aviso", "O mês já estava vazio.");
                    }
                    setShowAutoFill(false);
                }
            }
        ]
    );
  };

  const applySequence = (pattern) => {
    if (!selectedDate) return;
    
    const updates = {}; // Pacote de atualizações
    let seqIndex = 0;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const limit = 45; 

    for(let i = 0; i < limit; i++) {
        const nextDate = new Date(y, m-1, d + i);
        const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth()+1).padStart(2,'0')}-${String(nextDate.getDate()).padStart(2,'0')}`;
        
        let typeToAdd = '';
        if (pattern === '1x1') {
            if (i % 2 === 0) { typeToAdd = SEQUENCE[seqIndex % SEQUENCE.length]; seqIndex++; } else { typeToAdd = 'OFF'; }
        } else if (pattern === '2x1') {
            if ((i + 1) % 3 === 0) { typeToAdd = 'OFF'; } else { typeToAdd = SEQUENCE[seqIndex % SEQUENCE.length]; seqIndex++; }
        } else if (pattern === 'seq') {
            typeToAdd = SEQUENCE[seqIndex % SEQUENCE.length]; seqIndex++;
        }
        
        // Adiciona ao pacote em vez de salvar imediatamente
        updates[dateStr] = typeToAdd;
    }

    // Envia o pacote completo
    onBatchUpdate(updates);
    
    setShowAutoFill(false);
    setSelectedDate(null);
    Alert.alert("Sucesso", "Ciclo gerado e salvo no Firebase!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month - 1))} style={styles.navBtn}><ChevronLeft color="#fff" size={24} /></TouchableOpacity>
        <Text style={styles.monthTitle}>{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}</Text>
        <TouchableOpacity onPress={() => setCurrentDate(new Date(year, month + 1))} style={styles.navBtn}><ChevronRight color="#fff" size={24} /></TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <Text key={i} style={styles.dayHeader}>{d}</Text>)}
        {Array(firstDay).fill(null).map((_, i) => <View key={`empty-${i}`} style={styles.dayCell} />)}
        {Array(days).fill(null).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day, month, year);
          const workout = calendarData[dateStr];
          return (
            <TouchableOpacity key={day} onPress={() => handleDayClick(day)} style={[styles.dayCell, workout && { backgroundColor: COLORS[workout] || '#334155' }]}>
              <Text style={[styles.dayText, workout && { color: '#fff', fontWeight: 'bold' }]}>{day}</Text>
              {workout && <Text style={styles.workoutTag}>{workout}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <Modal visible={!!selectedDate} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedDate?.split('-').reverse().slice(0,2).join('/')}</Text>
                <TouchableOpacity onPress={() => { setSelectedDate(null); setShowAutoFill(false); }}><X color="#94a3b8" size={24} /></TouchableOpacity>
            </View>
            {!showAutoFill ? (
                <>
                    <View style={styles.typeGrid}>{WORKOUT_TYPES.map(type => (<TouchableOpacity key={type} style={[styles.typeBtn, { backgroundColor: COLORS[type] }]} onPress={() => { onUpdateDay(selectedDate, type); setSelectedDate(null); }}><Text style={styles.typeBtnText}>{type}</Text></TouchableOpacity>))}</View>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.autoFillBtn} onPress={() => setShowAutoFill(true)}><Zap size={18} color="#fff" /><Text style={styles.actionText}>Gerador de Ciclo</Text></TouchableOpacity>
                        {calendarData[selectedDate] && calendarData[selectedDate] !== 'OFF' && (<TouchableOpacity style={styles.openBtn} onPress={() => { onOpenWorkout(calendarData[selectedDate]); setSelectedDate(null); }}><Text style={styles.openBtnText}>Abrir Treino</Text></TouchableOpacity>)}
                    </View>
                    {calendarData[selectedDate] && (
                        <TouchableOpacity 
                            style={styles.clearDayBtn} 
                            onPress={() => { onUpdateDay(selectedDate, null); setSelectedDate(null); }}
                        >
                            <Trash size={18} color="#ef4444" />
                            <Text style={styles.clearDayText}>Remover Marcação do Dia</Text>
                        </TouchableOpacity>
                    )}
                </>
            ) : (
                <View style={{ gap: 10 }}>
                    <Text style={{color:'#94a3b8', marginBottom:10}}>Escolha o padrão:</Text>
                    <TouchableOpacity style={styles.patternBtn} onPress={() => applySequence('1x1')}><Text style={styles.patternTitle}>Ciclo 12 Dias (Recomendado)</Text><Text style={styles.patternSub}>1 Treino / 1 Descanso</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.patternBtn} onPress={() => applySequence('2x1')}><Text style={styles.patternTitle}>Ciclo Intenso</Text><Text style={styles.patternSub}>2 Treinos / 1 Descanso</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.patternBtn} onPress={() => applySequence('seq')}><Text style={styles.patternTitle}>Sequência Direta</Text><Text style={styles.patternSub}>Todos os dias</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.patternBtn, { borderColor: '#ef4444', marginTop: 10 }]} onPress={handleClearMonth}>
                        <View style={{flexDirection:'row', alignItems:'center', gap: 8}}>
                             <Trash size={20} color="#ef4444" />
                             <Text style={[styles.patternTitle, { color: '#ef4444' }]}>Limpar Mês Atual</Text>
                        </View>
                        <Text style={styles.patternSub}>Apaga todos os treinos da tela atual</Text>
                    </TouchableOpacity>
                </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#1e293b', padding: 12, borderRadius: 12 },
  monthTitle: { color: '#fbbf24', fontSize: 18, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayHeader: { width: '12%', textAlign: 'center', color: '#64748b', fontWeight: 'bold', marginBottom: 8 },
  dayCell: { width: '12%', aspectRatio: 1, backgroundColor: '#1e293b', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  dayText: { color: '#cbd5e1' },
  workoutTag: { fontSize: 8, color: '#fff', fontWeight: 'bold', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#0f172a', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  typeBtn: { width: '22%', height: 48, aspectRatio: 1.5, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  typeBtnText: { color: '#fff', fontWeight: 'bold' },
  autoFillBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#4f46e5', padding: 16, borderRadius: 12, marginBottom: 12 },
  actionText: { color: '#fff', fontWeight: 'bold' },
  openBtn: { backgroundColor: '#059669', padding: 16, borderRadius: 12, alignItems: 'center' },
  openBtnText: { color: '#fff', fontWeight: 'bold' },
  patternBtn: { backgroundColor: '#1e293b', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  patternTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  patternSub: { color: '#94a3b8', fontSize: 12 },

  clearDayBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 16, gap: 8 },
  clearDayText: { color: '#ef4444', fontWeight: 'bold' },
});
