import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
// Importamos apenas auth e db configurados
import { auth, db } from '../src/config/firebase';
import { WORKOUT_DATA as INITIAL_WORKOUTS } from '../constants/workouts';

//integracao

import { useHealthConnect } from './useHealthConnect';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const hydrateWithIds = (data) => {
  if (!data) return {};
  try {
    const hydrated = JSON.parse(JSON.stringify(data));
    Object.keys(hydrated).forEach(key => {
      if (hydrated[key]?.exercises) {
        hydrated[key].exercises = hydrated[key].exercises.map((ex, index) => ({
          ...ex,
          id: ex.id || `${key}-ex-${index}-${generateId()}`
        }));
      }
    });
    return hydrated;
  } catch (e) { return data || {}; }
};

export const useWorkoutManager = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('A1');
  const [workoutData, setWorkoutData] = useState({});
  const [workouts, setWorkouts] = useState(() => hydrateWithIds(INITIAL_WORKOUTS));
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [bodyStats, setBodyStats] = useState([]);

  const { 
    healthData, 
    fetchTodayData, // A função que busca os dados
    isSyncing, initHealthConnect
  } = useHealthConnect();

  // 1. Auth Listener (Compat Syntax)
  useEffect(() => {
    // auth.onAuthStateChanged é um método direto agora
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Sincronização Firestore (Compat Syntax)
  useEffect(() => {
    if (!user || !db) return;

    setLoading(true);

    try {
      // SINTAXE ANTIGA/COMPAT: db.collection().doc()
      // Structure
      const structureRef = db.collection('users').doc(user.uid).collection('app_data').doc('structure');
      
      const unsubStructure = structureRef.onSnapshot((docSnap) => {
        if (docSnap.exists) { // Nota: no compat é .exists (propriedade), não .exists() (função)
          setWorkouts(docSnap.data().workouts);
        } else {
          const initial = hydrateWithIds(INITIAL_WORKOUTS);
          structureRef.set({ workouts: initial });
        }
        setLoading(false);
      }, (err) => {
        console.error("Erro Firestore Structure:", err);
        setLoading(false);
      });

      // Inputs
      const inputsRef = db.collection('users').doc(user.uid).collection('app_data').doc('inputs');
      const unsubInputs = inputsRef.onSnapshot((docSnap) => {
        if (docSnap.exists) setWorkoutData(docSnap.data());
      });

      // Calendar
      const calendarRef = db.collection('users').doc(user.uid).collection('app_data').doc('calendar');
      const unsubCalendar = calendarRef.onSnapshot((docSnap) => {
        if (docSnap.exists) setCalendarData(docSnap.data());
      });

      const bodyRef = db.collection('users').doc(user.uid).collection('app_data').doc('body_stats');
      const unsubBody = bodyRef.onSnapshot((docSnap) => {
        if (docSnap.exists) {
          // Ordena por data para o gráfico não quebrar
          const data = docSnap.data().history || [];
          setBodyStats(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        }
      });

      return () => { unsubStructure(); unsubInputs(); unsubCalendar(); unsubBody();};
    } catch (e) {
      console.error("Erro Setup Firestore:", e);
      setLoading(false);
    }
  }, [user]);

  // 3. Auto-save
  useEffect(() => {
    if (!user || loading || Object.keys(workoutData).length === 0) return;
    const timer = setTimeout(() => {
      // set com { merge: true } funciona igual no compat
      db.collection('users').doc(user.uid).collection('app_data').doc('inputs')
        .set(workoutData, { merge: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [workoutData, user, loading]);

  const handleInputChange = useCallback((id, field, val) => {
    setWorkoutData(p => ({ ...p, [`${id}-${field}`]: val }));
  }, []);

  const addExercise = async (workoutId, newExercise) => {
    const exerciseWithId = { ...newExercise, id: generateId() };
    const newWorkouts = {
      ...workouts,
      [workoutId]: {
        ...workouts[workoutId],
        exercises: [...(workouts[workoutId]?.exercises || []), exerciseWithId]
      }
    };
    setWorkouts(newWorkouts);
    if (user) {
        await db.collection('users').doc(user.uid).collection('app_data').doc('structure')
          .set({ workouts: newWorkouts });
    }
  };

  const removeExercise = (workoutId, exerciseId) => {
    Alert.alert("Remover", "Excluir?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          const newWorkouts = {
            ...workouts,
            [workoutId]: {
              ...workouts[workoutId],
              exercises: workouts[workoutId].exercises.filter(ex => ex.id !== exerciseId)
            }
          };
          setWorkouts(newWorkouts);
          if (user) {
            await db.collection('users').doc(user.uid).collection('app_data').doc('structure')
                .set({ workouts: newWorkouts });
          }
      }}
    ]);
  };

  const updateCalendarDay = (d, id) => {
     const n = { ...calendarData, [d]: id };
     setCalendarData(n);
     if(user) {
        db.collection('users').doc(user.uid).collection('app_data').doc('calendar')
          .set(n, { merge: true });
     }
  };

  const batchUpdateCalendar = (updates) => {
    const newData = { ...calendarData, ...updates };
    setCalendarData(newData); 
    if(user) {
       db.collection('users').doc(user.uid).collection('app_data').doc('calendar')
         .set(updates, { merge: true }); 
    }
 };

  const logout = () => {
    Alert.alert("Sair", "Deseja deslogar?", [
        { text: "Cancelar", style: "cancel"},
        { text: "Sair", style: "destructive", onPress: () => auth.signOut() }
    ])
  };

  const addBodyWeight = async (weightString) => {
    if (!weightString) return;

    // 1. Substitui vírgula por ponto (Correção para teclado Brasileiro)
    const sanitizedWeight = weightString.replace(',', '.');

    // 2. Valida se virou um número real
    if (isNaN(sanitizedWeight)) {
        Alert.alert("Erro", "Digite um peso válido (ex: 80.5)");
        return;
    }

    const weightValue = parseFloat(sanitizedWeight);
    const today = new Date().toISOString().split('T')[0];
    
    // Garante que é array
    const currentStats = Array.isArray(bodyStats) ? bodyStats : [];
    
    const filtered = currentStats.filter(item => item.date !== today);
    const newEntry = { date: today, weight: weightValue };
    const newHistory = [...filtered, newEntry].sort((a, b) => new Date(a.date) - new Date(b.date));

    setBodyStats(newHistory);

    if (user) {
      await db.collection('users').doc(user.uid).collection('app_data').doc('body_stats')
        .set({ history: newHistory }, { merge: true });
    }
  };

  const removeBodyWeight = async (dateToDelete) => {
    // 1. Filtra a lista, mantendo tudo que NÃO for a data selecionada
    const newHistory = bodyStats.filter(item => item.date !== dateToDelete);
    
    // 2. Atualiza a tela imediatamente
    setBodyStats(newHistory);

    // 3. Atualiza o Firebase
    if (user) {
      try {
        await db.collection('users').doc(user.uid).collection('app_data').doc('body_stats')
          .set({ history: newHistory }, { merge: true });
      } catch (error) {
        Alert.alert("Erro", "Não foi possível excluir do banco de dados.");
      }
    }
  };

  const exportToCSV = async () => {
    try {
        if (Object.keys(workoutData).length === 0) {
            Alert.alert("Aviso", "Não há dados para exportar.");
            return;
        }

        
        let csvContent = "ID do Exercicio,Campo,Valor\n";

        
        Object.entries(workoutData).forEach(([key, value]) => {
            const [exerciseId, field] = key.split('-'); 
            
            const cleanValue = String(value).replace(/\n/g, " "); 
            csvContent += `${exerciseId},${field},${cleanValue}\n`;
        });

        // 3. Definir onde salvar (Cache do celular)
        const fileUri = FileSystem.cacheDirectory + 'treino_backup.csv';

        // 4. Escrever o arquivo
        await FileSystem.writeAsStringAsync(fileUri, csvContent, {
            encoding: FileSystem.EncodingType.UTF8,
        });

        
        await Sharing.shareAsync(fileUri);

    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Falha ao gerar planilha.");
    }
  }

  return {
    user, logout,
    activeTab, setActiveTab, workoutData, workouts, calendarData,
    handleInputChange, addExercise, removeExercise, loading,
    updateCalendarDay, clearData: () => setWorkoutData({}), 
    exportToCSV, batchUpdateCalendar,
    addBodyWeight, bodyStats, removeBodyWeight, healthData, 
    onSyncHealth: async () => { 
        console.log("Sincronizando...");
        await initHealthConnect(); 
        await fetchTodayData(); 
    },

    // 3. Exportamos o estado de loading
    isSyncingHealth: isSyncing
  };
};