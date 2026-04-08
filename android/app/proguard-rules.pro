# =============================================================================
# 🛡️ PROGUARD NUCLEAR - CONFIGURAÇÃO COMPLETA PARA GYMGAIN
# =============================================================================

# -----------------------------------------------------------------------------
# 1. REACT NATIVE & EXPO (O BÁSICO)
# -----------------------------------------------------------------------------
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-keep class expo.modules.** { *; }

# -----------------------------------------------------------------------------
# 2. HEALTH CONNECT (CRÍTICO)
# -----------------------------------------------------------------------------
# Protege a biblioteca RN Health Connect
-keep class dev.matinzd.healthconnect.** { *; }
# Protege a API oficial do Android Health Connect
-keep class androidx.health.connect.** { *; }
-keep interface androidx.health.connect.** { *; }

# -----------------------------------------------------------------------------
# 3. KOTLIN COROUTINES (ONDE O ERRO SILENCIOSO ACONTECE)
# -----------------------------------------------------------------------------
# O Health Connect roda em background usando isso. Se apagar, o app não responde.
-keep class kotlinx.coroutines.** { *; }
-keep class kotlin.coroutines.** { *; }
-keep class kotlin.sequences.** { *; }

# -----------------------------------------------------------------------------
# 4. ANDROID LIFECYCLE & ARCHITECTURE
# -----------------------------------------------------------------------------
# Necessário para observar se o app voltou do background após dar permissão
-keep class androidx.lifecycle.** { *; }
-keep class androidx.arch.core.** { *; }
-keep class androidx.activity.** { *; }
-keep class androidx.fragment.app.** { *; }

# -----------------------------------------------------------------------------
# 5. SEU CÓDIGO (O APP)
# -----------------------------------------------------------------------------
# Protege todas as suas Activities e Classes customizadas
-keep class com.seu.gymgain.** { *; }
# Garante especificamente a tela de permissão
-keep class com.seu.gymgain.HealthConnectRationaleActivity { *; }

# -----------------------------------------------------------------------------
# 6. METADADOS E REFLEXÃO (SEGURANÇA TOTAL)
# -----------------------------------------------------------------------------
# Impede que o Kotlin perca a referência de nomes de funções
-keep class kotlin.Metadata { *; }
-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes RuntimeInvisibleAnnotations
-keepattributes RuntimeInvisibleParameterAnnotations
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses
-keepattributes SourceFile,LineNumberTable
-keepattributes Exceptions

# -----------------------------------------------------------------------------
# 7. DEPENDÊNCIAS COMUNS (PREVENÇÃO)
# -----------------------------------------------------------------------------
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okio.**
-dontwarn javax.annotation.**