package com.uca.recycluster.ui.loginSignUp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.UserHandle
import com.uca.recycluster.R
import com.uca.recycluster.data.model.User
import com.uca.recycluster.ui.appcontent.MainContentActivity
import com.uca.recycluster.ui.request.RequestActivity

class LoginActivity : AppCompatActivity() {

    fun startMainActivity(user: User) {
        val intent = Intent(this, MainContentActivity::class.java)
        // Sending All data to the next activity for each post (postAux)
        intent.putExtra(MainContentActivity.USER_KEY, user)
        startActivity(intent)
        finish()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        Thread.sleep(1000)
        setTheme(R.style.Theme_Recycluster)

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
    }
}