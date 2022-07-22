package com.uca.recycluster.data.network.dto

import com.uca.recycluster.data.model.User
import java.lang.Exception

data class LoginResponse(
    val token: String,
    val message: String?,
    val user: User?,
    val exception: Exception?
)