package com.uca.recycluster.ui.appcontent.helpers

sealed class NewExchangeUiStatus {
    object Resume: NewExchangeUiStatus()
    object Loading: NewExchangeUiStatus()
    class Error(val exception: Exception): NewExchangeUiStatus()
    data class ErrorMessage(val message: String) : NewExchangeUiStatus()
    data class Success(val message: String): NewExchangeUiStatus()
}