import { useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { 
  initialize, 
  readRecords, 
  getGrantedPermissions, 
  requestPermission 
} from 'react-native-health-connect';

const PERMISSIONS = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'TotalCaloriesBurned' },
  { accessType: 'read', recordType: 'HeartRate' },
  { accessType: 'read', recordType: 'SleepSession' }, 
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
];

// 👇 A FUNÇÃO QUE FALTAVA PARA SEGURAR A ONDA
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const useHealthConnect = () => {
  const [healthData, setHealthData] = useState({
    steps: 0,
    calories: 0,
    heartRate: 0,
    sleep: "0h 0m",
    stress: 0,
    lastSync: null
  });

  const [hasPermission, setHasPermission] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const initHealthConnect = async () => {
    if (Platform.OS !== 'android') return;

  
    await new Promise(resolve => setTimeout(resolve, 5000)); 
    

    try {
      const isInitialized = await initialize();
      if (!isInitialized) return;

      await requestPermission(PERMISSIONS);

      setHasPermission(true);
      
    } catch (e) {
      console.log("Health Connect erro:", e);
    }
  };


  const fetchTodayData = useCallback(async () => {
    if (isSyncing) return; // Evita clique duplo
    setIsSyncing(true);

    try {
      // Garante permissão antes de ler
      if (!hasPermission) {
        const success = await initHealthConnect();
        if (!success) {
           Alert.alert("Atenção", "É necessário conceder permissão para sincronizar.");
           setIsSyncing(false);
           return; 
        }
      }

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      const timeRangeFilter = {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: endOfDay.toISOString(),
      };
      
      console.log(`📅 Buscando dados...`);

      // --- LEITURA DOS DADOS ---

      // 1. Passos
      const stepsResult = await readRecords('Steps', { timeRangeFilter });
      const stepsList = Array.isArray(stepsResult) ? stepsResult : (stepsResult.records || []);
      const totalSteps = stepsList.reduce((acc, cur) => acc + cur.count, 0);

      // 2. Calorias (Ativas + Total fallback)
      let totalCalories = 0;
      try {
        const activeCalResult = await readRecords('ActiveCaloriesBurned', { timeRangeFilter });
        const activeList = Array.isArray(activeCalResult) ? activeCalResult : (activeCalResult.records || []);
        totalCalories = activeList.reduce((acc, cur) => acc + cur.energy.inKilocalories, 0);
      } catch (err) {}

      if (totalCalories === 0) {
          try {
            const totalCalResult = await readRecords('TotalCaloriesBurned', { timeRangeFilter });
            const totalList = Array.isArray(totalCalResult) ? totalCalResult : (totalCalResult.records || []);
            totalCalories = totalList.reduce((acc, cur) => acc + cur.energy.inKilocalories, 0);
          } catch (err) {}
      }

      // 3. Batimentos
      let avgHeartRate = 0;
      try {
        const heartResult = await readRecords('HeartRate', { timeRangeFilter });
        const heartList = Array.isArray(heartResult) ? heartResult : (heartResult.records || []);
        if (heartList.length > 0) {
            const allSamples = heartList.flatMap(r => r.samples.map(s => s.beatsPerMinute));
            const sum = allSamples.reduce((a, b) => a + b, 0);
            if (allSamples.length > 0) avgHeartRate = Math.round(sum / allSamples.length);
        }
      } catch (err) {}

      // 4. Sono
      let hours = 0, minutes = 0;
      try {
        const sleepResult = await readRecords('SleepSession', { timeRangeFilter });
        const sleepList = Array.isArray(sleepResult) ? sleepResult : (sleepResult.records || []);
        let totalSleepMinutes = 0;
        sleepList.forEach(session => {
            const start = new Date(session.startTime).getTime();
            const end = new Date(session.endTime).getTime();
            totalSleepMinutes += (end - start) / 1000 / 60;
        });
        hours = Math.floor(totalSleepMinutes / 60);
        minutes = Math.floor(totalSleepMinutes % 60);
      } catch (err) {}

      // Atualiza estado
      setHealthData({
        steps: totalSteps,
        calories: Math.round(totalCalories),
        heartRate: avgHeartRate,
        sleep: `${hours}h ${minutes}m`,
        stress: 0,
        lastSync: new Date().toLocaleTimeString().slice(0, 5)
      });

    } catch (e) {
      console.error("Erro sync:", e);
      // Se der SecurityException, limpa a flag para forçar pedido na próxima
      if (e.message && e.message.includes("Security")) {
         setHasPermission(false);
         Alert.alert("Erro de Permissão", "Tente sincronizar novamente.");
      } else {
         Alert.alert("Erro", "Falha ao ler dados.");
      }
    } finally {
      setIsSyncing(false);
    }
  }, [hasPermission, isSyncing]);

  return { healthData, fetchTodayData, hasPermission, isSyncing };
};