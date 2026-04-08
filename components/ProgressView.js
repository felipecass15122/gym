import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Trophy, Activity, TrendingUp, Dumbbell, Scale, Plus, Footprints, Flame, Heart, Moon, Brain, RefreshCw } from 'lucide-react-native';
import { LineChart } from "react-native-chart-kit";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const ProgressView = ({ workouts, data, bodyStats, onAddWeight, onRemoveWeight, healthData, onSyncHealth, isSyncing }) => {
  const [activeTab, setActiveTab] = useState('performance');
  const [weightInput, setWeightInput] = useState('');

  const safeHealth = healthData || { steps: 0, calories: 0, heartRate: 0, sleep: "0h 0m", stress: 0 };

  // --- LÓGICA DE PERFORMANCE ---
  const stats = useMemo(() => {
    let totalVolume = 0;
    let maxLoad = 0;
    let bestLiftName = '-';
    let exerciseRanking = [];

    const safeWorkouts = workouts || {};
    const safeData = data || {};

    Object.keys(safeWorkouts).forEach(workoutKey => {
      const workout = safeWorkouts[workoutKey];
      workout.exercises?.forEach(ex => {
        let exMaxLoad = 0;
        let exMaxReps = 0;

        for (let i = 1; i <= 10; i++) {
            const load = parseFloat(safeData[`${ex.id}-s${i}-carga`]) || 0;
            const reps = parseFloat(safeData[`${ex.id}-s${i}-reps`]) || 0;

            if (load > 0 && reps > 0) {
                totalVolume += (load * reps);
                if (load > exMaxLoad) {
                    exMaxLoad = load;
                    exMaxReps = reps;
                }
            }
        }

        if (exMaxLoad > 0) {
            const oneRepMax = Math.round(exMaxLoad * (1 + exMaxReps / 30));
            exerciseRanking.push({
                name: ex.name,
                load: exMaxLoad,
                reps: exMaxReps,
                oneRepMax,
                workout: workoutKey
            });

            if (exMaxLoad > maxLoad) {
                maxLoad = exMaxLoad;
                bestLiftName = ex.name;
            }
        }
      });
    });

    return {
        totalVolume,
        bestLift: { name: bestLiftName, load: maxLoad },
        ranking: exerciseRanking.sort((a, b) => b.oneRepMax - a.oneRepMax)
    };
  }, [workouts, data]);

  // --- LÓGICA DO GRÁFICO CORPORAL ---
  const chartData = useMemo(() => {
    const safeBodyStats = bodyStats || [];
    const recentStats = safeBodyStats.slice(-6); 
    
    if (recentStats.length === 0) return null;

    return {
        labels: recentStats.map(s => {
            const parts = s.date.split('-');
            return `${parts[2]}/${parts[1]}`;
        }),
        datasets: [{ data: recentStats.map(s => s.weight) }]
    };
  }, [bodyStats]);

  const safeBodyStats = bodyStats || [];
  const currentWeight = safeBodyStats.length > 0 ? safeBodyStats[safeBodyStats.length - 1].weight : 0;
  const startWeight = safeBodyStats.length > 0 ? safeBodyStats[0].weight : 0;
  const weightDiff = (currentWeight - startWeight).toFixed(1);

  const handleLongPress = (date, weight) => {
    Alert.alert(
        "Excluir Registro",
        `Deseja apagar o peso de ${weight}kg do dia ${date.split('-').reverse().join('/')}?`,
        [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: () => onRemoveWeight(date) }
        ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 20}}>
      <Text style={styles.headerTitle}>Painel de Evolução</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'performance' && styles.activeTabBtn]} 
            onPress={() => setActiveTab('performance')}
        >
            <Dumbbell size={16} color={activeTab === 'performance' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'performance' && styles.activeTabText]}>Cargas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tabBtn, activeTab === 'body' && styles.activeTabBtn]} 
            onPress={() => setActiveTab('body')}
        >
            <Scale size={16} color={activeTab === 'body' ? '#fff' : '#94a3b8'} />
            <Text style={[styles.tabText, activeTab === 'body' && styles.activeTabText]}>Peso Corporal</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'performance' ? (
        <>
            <View style={styles.highlightCard}>
                <View style={styles.highlightRow}>
                    <View style={styles.statItem}>
                        <View style={styles.iconBg}><Activity size={20} color="#fbbf24" /></View>
                        <Text style={styles.statLabel}>Volume Total</Text>
                        <Text style={styles.statValue}>{(stats.totalVolume / 1000).toFixed(1)}k <Text style={styles.unit}>kg</Text></Text>
                    </View>
                    <View style={[styles.statItem, {borderLeftWidth:1, borderColor:'#334155'}]}>
                        <View style={styles.iconBg}><Trophy size={20} color="#f59e0b" /></View>
                        <Text style={styles.statLabel}>Maior Carga</Text>
                        <Text style={styles.statValue}>{stats.bestLift.load} <Text style={styles.unit}>kg</Text></Text>
                        <Text style={styles.statSub} numberOfLines={1}>{stats.bestLift.name}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Ranking de Força (1RM Est.)</Text>
            <View style={styles.rankingList}>
                {stats.ranking.map((item, index) => (
                    <View key={index} style={styles.rankItem}>
                        <View style={styles.rankBadge}><Text style={styles.rankPos}>{index + 1}</Text></View>
                        <View style={{flex:1}}>
                            <Text style={styles.rankName}>{item.name}</Text>
                            <Text style={styles.rankMeta}>{item.load}kg x {item.reps}</Text>
                        </View>
                        <View style={{alignItems:'flex-end'}}>
                            <Text style={styles.rankValue}>{item.oneRepMax}</Text>
                            <Text style={styles.rankUnit}>1RM</Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
      ) : (
        <>
            <View style={styles.healthGrid}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom: 12}}>
                    <Text style={styles.sectionTitle}>Galaxy Fit 3</Text>
                    <TouchableOpacity 
                        onPress={onSyncHealth} 
                        disabled={isSyncing} 
                        style={styles.syncBtnSmall}
                    >
                        {isSyncing ? (
                            <ActivityIndicator size="small" color="#fbbf24" />
                        ) : (
                            <View style={{flexDirection:'row', alignItems:'center', gap: 6}}>
                                <Text style={styles.syncTextSmall}>Sincronizar</Text>
                                <RefreshCw size={14} color="#fbbf24" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                
                <View style={styles.healthRow}>
                    <View style={styles.healthCard}>
                        <Footprints color="#60a5fa" size={24} />
                        <Text style={styles.healthValue}>{safeHealth.steps}</Text>
                        <Text style={styles.healthLabel}>Passos</Text>
                    </View>
                    <View style={styles.healthCard}>
                        <Flame color="#ef4444" size={24} />
                        <Text style={styles.healthValue}>{safeHealth.calories}</Text>
                        <Text style={styles.healthLabel}>Kcal</Text>
                    </View>
                    <View style={styles.healthCard}>
                        <Heart color="#ec4899" size={24} />
                        <Text style={styles.healthValue}>{safeHealth.heartRate}</Text>
                        <Text style={styles.healthLabel}>BPM</Text>
                    </View>
                </View>

                <View style={styles.healthRow}>
                    <View style={[styles.healthCard, { flex: 1 }]}>
                        <Moon color="#8b5cf6" size={24} />
                        <Text style={styles.healthValue}>{safeHealth.sleep}</Text>
                        <Text style={styles.healthLabel}>Sono Total</Text>
                    </View>
                </View>
            </View>

            <View style={styles.addWeightCard}>
                <Text style={styles.cardTitle}>Registrar Peso Hoje</Text>
                <View style={{flexDirection:'row', gap: 12, marginTop: 12}}>
                    <TextInput 
                        style={styles.weightInput} 
                        placeholder="Ex: 80.5" 
                        placeholderTextColor="#64748b"
                        keyboardType="numeric"
                        value={weightInput}
                        onChangeText={setWeightInput}
                    />
                    <TouchableOpacity 
                        style={styles.addBtn} 
                        onPress={() => { onAddWeight(weightInput); setWeightInput(''); }}
                    >
                        <Plus color="#fff" size={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {chartData ? (
                <View style={styles.chartContainer}>
                    <Text style={styles.sectionTitle}>Evolução de Peso</Text>
                    <Text style={[styles.subtitle, { color: parseFloat(weightDiff) > 0 ? '#ef4444' : '#059669' }]}>
                        {parseFloat(weightDiff) > 0 ? `+${weightDiff} kg` : `${weightDiff} kg`} desde o início
                    </Text>
                    
                    <LineChart
                        data={chartData}
                        width={SCREEN_WIDTH - 32}
                        height={220}
                        yAxisSuffix="kg"
                        chartConfig={{
                            backgroundColor: "#1e293b",
                            backgroundGradientFrom: "#1e293b",
                            backgroundGradientTo: "#0f172a",
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(251, 191, 36, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: "4", strokeWidth: "2", stroke: "#f59e0b" }
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                </View>
            ) : (
                <View style={styles.emptyState}>
                    <Scale color="#475569" size={40} />
                    <Text style={styles.emptyText}>Adicione seu peso para ver o gráfico.</Text>
                </View>
            )}

            <View style={styles.historyList}>
                <Text style={[styles.sectionTitle, {marginTop: 16}]}>Histórico</Text>
                <Text style={styles.hintText}>Segure o item para excluir</Text>
                {safeBodyStats.slice().reverse().map((entry, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.historyItem}
                        onLongPress={() => handleLongPress(entry.date, entry.weight)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.historyDate}>{entry.date.split('-').reverse().join('/')}</Text>
                        <Text style={styles.historyValue}>{entry.weight} kg</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerTitle: { color: '#fbbf24', fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 12, padding: 4, marginBottom: 24 },
  tabBtn: { flex: 1, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', gap: 8, borderRadius: 8 },
  activeTabBtn: { backgroundColor: '#334155' },
  tabText: { color: '#94a3b8', fontWeight: 'bold' },
  activeTabText: { color: '#fff' },
  highlightCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  highlightRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  iconBg: { backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: 8, borderRadius: 12, marginBottom: 8 },
  statLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  statValue: { color: '#fff', fontSize: 24, fontWeight: '900' },
  unit: { fontSize: 14, color: '#64748b' },
  statSub: { color: '#64748b', fontSize: 10, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 12, fontWeight: 'bold' },
  rankingList: { gap: 12, marginTop: 12 },
  rankItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 12, gap: 12 },
  rankBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  rankPos: { color: '#fbbf24', fontWeight: 'bold' },
  rankName: { color: '#e2e8f0', fontWeight: 'bold', fontSize: 14 },
  rankMeta: { color: '#64748b', fontSize: 12 },
  rankValue: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  rankUnit: { color: '#64748b', fontSize: 10, fontWeight: 'bold' },
  addWeightCard: { backgroundColor: '#1e293b', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { color: '#fff', fontWeight: 'bold' },
  weightInput: { flex: 1, backgroundColor: '#0f172a', borderRadius: 8, color: '#fff', paddingHorizontal: 16, fontSize: 18, fontWeight: 'bold', borderWidth: 1, borderColor: '#334155' },
  addBtn: { backgroundColor: '#d97706', width: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  chartContainer: { alignItems: 'center', marginVertical: 8 },
  emptyState: { alignItems: 'center', padding: 40, gap: 16 },
  emptyText: { color: '#475569', textAlign: 'center' },
  historyList: { gap: 8 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#1e293b', borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  historyDate: { color: '#94a3b8' },
  historyValue: { color: '#fff', fontWeight: 'bold' },
  hintText: { color: '#64748b', fontSize: 10, fontStyle: 'italic', marginBottom: 8 },
  healthGrid: { marginBottom: 24, gap: 10 },
  healthRow: { flexDirection: 'row', gap: 12 },
  healthCard: { flex: 1, backgroundColor: '#1e293b', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#334155' },
  healthValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  healthLabel: { color: '#94a3b8', fontSize: 10, marginTop: 2, fontWeight: 'bold' },
  syncBtnSmall: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)'
  },
  syncTextSmall: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});