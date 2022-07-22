package com.uca.recycluster

import android.app.Application
import android.content.Context
import android.content.SharedPreferences
import com.uca.recycluster.core.RetrofitHelper.setToken
import com.uca.recycluster.data.network.RetrofitInstance
import com.uca.recycluster.repository.LoginRepository
import com.uca.recycluster.repository.NewPostRepository

class RecyclusterApplication: Application() {

    private val prefs: SharedPreferences by lazy {
        getSharedPreferences("Recycluster", Context.MODE_PRIVATE)
    }

    private fun getAPIService() = with(RetrofitInstance()) {
        setToken(getToken())
        getRecyclusterServices()
    }

    fun getLoginRepository() =
        LoginRepository(getAPIService())

    fun getPostRepository() =
        NewPostRepository(getAPIService())

    private fun getToken(): String = prefs.getString(USER_TOKEN, "")!!

    fun isUserLogin() = getToken() != ""

    fun saveAuthToken(token: String) {
        val editor = prefs.edit()
        editor.putString(USER_TOKEN, token)
        editor.apply()
    }

    companion object {
        const val USER_TOKEN = "user_token"
    }

}