package com.uca.recycluster.ui.loginSignUp.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.uca.recycluster.data.network.ApiResponse
import com.uca.recycluster.data.network.ApiResponse2
import com.uca.recycluster.repository.LoginRepository
import com.uca.recycluster.ui.loginSignUp.LoginUiStatus
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class LoginViewModel (private val repository: LoginRepository): ViewModel(){
    // LOGIN
    val userField = MutableLiveData("")
    val passwordField = MutableLiveData("")
    // SIGNUP
    val newUsername = MutableLiveData("")
    val newEmail = MutableLiveData("")
    val newPhone = MutableLiveData("")
    val newPassword = MutableLiveData("")
    val newPassword2 = MutableLiveData("")
    // RESTORE PASS
    val userEmail = MutableLiveData("")

    // LOGIN STATUS
    private val _statusLogin = MutableLiveData<LoginUiStatus>(LoginUiStatus.Resume)
    val statusLogin: LiveData<LoginUiStatus>
        get() = _statusLogin
    // SIGNUP STATUS
    private val _statusSignUp = MutableLiveData<LoginUiStatus>(LoginUiStatus.Resume)
    val statusSignUp: LiveData<LoginUiStatus>
        get() = _statusSignUp
    // RESTORE STATUS
    private val _statusRestore = MutableLiveData<LoginUiStatus>(LoginUiStatus.Resume)
    val statusRestore: LiveData<LoginUiStatus>
        get() = _statusRestore

    // Methods
    fun onLogin() {
        _statusLogin.value = LoginUiStatus.Loading

        viewModelScope.launch(Dispatchers.IO) {
            _statusLogin.postValue(
                when (val response = repository.login(
                    userField.value.toString(),
                    passwordField.value.toString()
                )) {
                    is ApiResponse2.Error -> LoginUiStatus.Error(response.data.exception!!)
                    is ApiResponse2.ErrorMessage -> LoginUiStatus.ErrorMessage(response.data.message ?: "Error")
                    is ApiResponse2.Success -> LoginUiStatus.Success(response.data.token, response.data.user!!)
                }
            )
        }
    }

    fun onCreateUserPrev() {
        if (newPassword.value.toString() != newPassword2.value.toString()) {
            _statusSignUp.postValue(LoginUiStatus.ErrorMessage("Passwords do not match"))
            return
        }

        onCreateUser()
    }

    private fun onCreateUser() {
        _statusSignUp.value = LoginUiStatus.Loading

        viewModelScope.launch(Dispatchers.IO) {
            _statusSignUp.postValue(
                when (val response = repository.createUser(
                    newUsername.value.toString(),
                    newEmail.value.toString(),
                    newPhone.value.toString(),
                    newPassword.value.toString(),
                )) {
                    is ApiResponse2.Error -> LoginUiStatus.Error(response.data.exception!!)
                    is ApiResponse2.ErrorMessage -> LoginUiStatus.ErrorMessage(response.data.message ?: "Error")
                    is ApiResponse2.Success -> LoginUiStatus.Success2(response.data.message ?: "Oopss")
                }
            )
        }
    }

    fun onForgotPassword() {
        _statusRestore.value = LoginUiStatus.Loading

        viewModelScope.launch(Dispatchers.IO) {
            _statusRestore.postValue(
                when (val response = repository.restorePassword(
                    userEmail.value.toString()
                )) {
                    is ApiResponse2.Error -> LoginUiStatus.Error(response.data.exception!!)
                    is ApiResponse2.ErrorMessage -> LoginUiStatus.ErrorMessage(response.data.message)
                    is ApiResponse2.Success -> LoginUiStatus.Success2(response.data.message)
                }
            )
        }
    }

    fun loginStatusOnResume() {
        _statusLogin.postValue(LoginUiStatus.Resume)
    }

    fun signUpStatusOnResume() {
        _statusSignUp.postValue(LoginUiStatus.Resume)
    }

    fun restoreStatusOnResume() {
        _statusRestore.postValue(LoginUiStatus.Resume)
    }

    fun clearSignUpForm() {
        newUsername.value = ""
        newEmail.value = ""
        newPhone.value = ""
        newPassword.value = ""
        newPassword2.value = ""
    }

    fun clearRestoreForm() {
        userEmail.value = ""
    }
}