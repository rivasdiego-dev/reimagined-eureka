package com.uca.recycluster.ui.appcontent.helpers


sealed class NewPostUiStatus {
    object Resume: NewPostUiStatus()
    object Loading: NewPostUiStatus()
    class Error(val exception: Exception): NewPostUiStatus()
    data class ErrorMessage(val message: String) : NewPostUiStatus()
    data class Success(val message: String): NewPostUiStatus()
}