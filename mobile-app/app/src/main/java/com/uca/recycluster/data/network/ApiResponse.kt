package com.uca.recycluster.data.network

sealed class ApiResponse <T> {
    data class Success <T>(val data: T) : ApiResponse<T>()
    data class Error <T>(val exception: Exception) : ApiResponse<T>()
    data class ErrorMessage <T>(val message: T) : ApiResponse<T>()
}

sealed class ApiResponse2 <T> {
    data class Success <T>(val data: T) : ApiResponse2<T>()
    data class Error <T>(val data: T) : ApiResponse2<T>()
    data class ErrorMessage <T>(val data: T) : ApiResponse2<T>()
}