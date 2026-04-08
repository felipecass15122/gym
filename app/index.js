import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Platform,
  StatusBar } from 'react-native';
// Adicionei LogOut nos ícones
import { Dumbbell, Calendar, List, Download, Trash, Plus, LogOut, GitGraphIcon } from 'lucide-react-native';
import { useWorkoutManager } from '../hooks/useWorkoutManager';
import { ExerciseCard } from '../components/ExerciseCard';
import { CalendarView } from '../components/CalendarView';
import AddExerciseForm from '../components/AddExerciseForm';
// Importe a tela de login nova
import LoginScreen from '../components/LoginScreen';
import { ProgressView } from '../components/ProgressView'; // <--- Adicione a View



export default function App() {
  const { 
    user, logout, // <--- Pegando user e logout do hook
    activeTab, setActiveTab, workoutData, handleInputChange, 
    addExercise, removeExercise, clearData, exportToCSV, 
    workouts, calendarData, updateCalendarDay, loading, batchUpdateCalendar, bodyStats, addBodyWeight, removeBodyWeight, healthData, onSyncHealth, isSyncingHealth
  } = useWorkoutManager();

  const [viewMode, setViewMode] = useState('workouts');
  const [isAdding, setIsAdding] = useState(false);

  const handleOpenWorkoutFromCalendar = (workoutId) => {
    if (workouts && workouts[workoutId]) {
      setActiveTab(workoutId);
      setViewMode('workouts');
    }
  };

  // 1. SE NÃO TIVER USUÁRIO LOGADO, MOSTRA TELA DE LOGIN
  if (!user) {
    return <LoginScreen />;
  }

  // 2. LOADING (Apenas dados)
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>Sincronizando Protocolo...</Text>
      </View>
    );
  }

  const safeWorkouts = workouts || {};

  
  const workoutKeys = Object.keys(safeWorkouts).sort((a, b) => {
    // Extrai a parte numérica de cada chave (ex: "A1" -> 1, "B2" -> 2)
    const getNum = (str) => parseInt(str.replace(/^\D+/g, '')) || 0;
    // Extrai a parte literal (ex: "A1" -> "A")
    const getLet = (str) => str.replace(/\d+/g, '');

    const numA = getNum(a);
    const numB = getNum(b);

    // 1. Se os números forem diferentes, ordena pelo número (1 vem antes de 2)
    if (numA !== numB) return numA - numB;

    // 2. Se os números forem iguais (ex: A1 e B1), ordena pela letra
    return getLet(a).localeCompare(getLet(b));
  });

  const currentWorkout = safeWorkouts[activeTab];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />  

      <View style={styles.header}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <View style={styles.logoRow}>
            <Dumbbell color="#fbbf24" size={28} />
            <Text style={styles.logoText}>GYM GAIN</Text>
           </View>
           
           <TouchableOpacity onPress={logout} style={{padding: 8}}>
              <LogOut color="#ef4444" size={24} />
           </TouchableOpacity>
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'workouts' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('workouts')}
          >
            <List size={16} color={viewMode === 'workouts' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'workouts' && styles.activeText]}>TREINOS</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'calendar' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('calendar')}
          >
            <Calendar size={16} color={viewMode === 'calendar' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'calendar' && styles.activeText]}>CALENDÁRIO</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            // CORREÇÃO AQUI: Verifique se viewMode é 'progress'
            style={[styles.toggleBtn, viewMode === 'progress' && styles.toggleBtnActive]} 
            onPress={() => setViewMode('progress')}
          >
          
            <GitGraphIcon size={16} color={viewMode === 'calendar' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'progress' && styles.activeText]}>PROGRESSO</Text>
          </TouchableOpacity>
        </View>
      </View>

     
      
      {viewMode === 'workouts' ? (
        <>
          <View style={styles.tabScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
              {workoutKeys.map(key => (
                <TouchableOpacity 
                  key={key} 
                  onPress={() => setActiveTab(key)}
                  style={[styles.tab, activeTab === key && styles.activeTab]}
                >
                  <Text style={[styles.tabText, activeTab === key && styles.activeTabText]}>{key}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
            {currentWorkout ? (
              <>
                <View style={styles.sectionHeader}>
                  <View style={styles.dot} />
                  <Text style={styles.sectionTitle}>{currentWorkout.title}</Text>
                </View>

                {currentWorkout.exercises?.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    data={workoutData}
                    onInputChange={handleInputChange}
                    onRemove={(id) => removeExercise(activeTab, id)}
                  />
                ))}
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Selecione um treino válido</Text>
              </View>
            )}

            <View style={{ marginTop: 20 }}>
              {isAdding ? (
                <AddExerciseForm 
                  onAdd={(data) => { addExercise(activeTab, data); setIsAdding(false); }} 
                  onCancel={() => setIsAdding(false)} 
                />
              ) : (
                <TouchableOpacity style={styles.addBtn} onPress={() => setIsAdding(true)}>
                  <Plus color="#94a3b8" />
                  <Text style={styles.addBtnText}>Adicionar Exercício</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <View style={styles.fabContainer}>
            <TouchableOpacity onPress={clearData} style={[styles.fab, styles.fabDelete]}>
              <Trash color="#f87171" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={exportToCSV} style={[styles.fab, styles.fabExport]}>
              <Download color="#fff" size={24} />
              <Text style={styles.fabText}>BAIXAR PLANILHA</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : viewMode === 'calendar' ? (
         // ... (SEU BLOCO DO CALENDÁRIO) ...
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <CalendarView 
             calendarData={calendarData} 
             onUpdateDay={updateCalendarDay} 
             onOpenWorkout={handleOpenWorkoutFromCalendar}
             onBatchUpdate={batchUpdateCalendar}
          />
        </ScrollView>
      ) :(
        <ProgressView 
            workouts={safeWorkouts} 
            data={workoutData} 
            bodyStats={bodyStats}        
            onAddWeight={addBodyWeight} 
            onRemoveWeight={removeBodyWeight} 
            healthData={healthData}
            onSyncHealth={onSyncHealth}
            isSyncing={isSyncingHealth}
        />
      
      )}
    </SafeAreaView>
  );
}

// ... styles iguais
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  
    loadingContainer: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
    loadingText: { color: '#fbbf24', marginTop: 12, fontWeight: 'bold', letterSpacing: 1 },
    header: { padding: 16, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    logoRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    logoText: { color: '#fbbf24', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
    subtitle: { color: '#64748b', textAlign: 'center', fontSize: 10, letterSpacing: 2, fontWeight: 'bold', marginTop: 4, marginBottom: 16 },
    viewToggle: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 8, padding: 4 },
    toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 6, gap: 6 },
    toggleBtnActive: { backgroundColor: '#d97706' },
    toggleText: { color: '#94a3b8', fontWeight: 'bold', fontSize: 12 },
    activeText: { color: '#fff' },
    tabScrollContainer: { height: 60, backgroundColor: '#0f172a', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    tabsContent: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
    tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, backgroundColor: '#1e293b', justifyContent: 'center' },
    activeTab: { backgroundColor: '#d97706' },
    tabText: { color: '#94a3b8', fontWeight: 'bold' },
    activeTabText: { color: '#fff' },
    content: { flex: 1, padding: 16 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d97706' },
    sectionTitle: { color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderWidth: 2, borderColor: '#334155', borderStyle: 'dashed', borderRadius: 12, gap: 8 },
    addBtnText: { color: '#94a3b8', fontWeight: 'bold' },
    fabContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, flexDirection: 'row', gap: 12, backgroundColor: 'rgba(15,23,42,0.95)' },
    fab: { padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
    fabDelete: { backgroundColor: '#334155' },
    fabExport: { backgroundColor: '#059669', flex: 1 },
    fabText: { color: '#fff', fontWeight: 'bold' },
    errorTitle: { color: '#fff', fontSize: 18, marginTop: 10, fontWeight: 'bold' },
    errorSubtitle: { color: '#94a3b8', textAlign: 'center', paddingHorizontal: 40, marginTop: 5 },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyText: { color: '#64748b', fontStyle: 'italic' }
});
