package com.seu.gymgain

import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity

class HealthConnectRationaleActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Cria o pop-up nativo explicando por que o app precisa dos dados
        val dialog = AlertDialog.Builder(this)
            .setTitle("Acesso ao Samsung Health")
            .setMessage("Para mostrar seus passos e queima de calorias, o GymGain precisa da sua permissão para ler os dados do Health Connect.")
            .setPositiveButton("Entendi") { _, _ ->
                finish() // Fecha essa tela e deixa o sistema pedir a permissão real
            }
            .setCancelable(false) // Impede que o usuário feche clicando fora
            .create()
        
        dialog.show()
    }
}