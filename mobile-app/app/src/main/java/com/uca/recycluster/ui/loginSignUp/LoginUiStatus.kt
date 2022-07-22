package com.uca.recycluster.ui.loginSignUp

import com.uca.recycluster.data.model.User

sealed class LoginUiStatus {
    object Resume: LoginUiStatus()
    object Loading: LoginUiStatus()
    class Error(val exception: Exception): LoginUiStatus()
    data class ErrorMessage(val message: String) : LoginUiStatus()
    data class Success(val token: String, val user: User): LoginUiStatus()
    data class Success2(val message: String): LoginUiStatus()
}