package com.uca.recycluster.ui.loginSignUp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.uca.recycluster.repository.LoginRepository
import com.uca.recycluster.repository.NewPostRepository
import com.uca.recycluster.ui.appcontent.viewmodel.NewPostViewModel
import com.uca.recycluster.ui.request.viewmodel.ExchangeViewModel

class ViewModelFactory<R>(private val repository: R) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(LoginViewModel::class.java)) {
            return LoginViewModel(repository as LoginRepository) as T
        }
        if (modelClass.isAssignableFrom(NewPostViewModel::class.java)) {
            return NewPostViewModel(repository as NewPostRepository) as T
        }
        if (modelClass.isAssignableFrom(ExchangeViewModel::class.java)) {
            return ExchangeViewModel(repository as NewPostRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel Class")
    }
}