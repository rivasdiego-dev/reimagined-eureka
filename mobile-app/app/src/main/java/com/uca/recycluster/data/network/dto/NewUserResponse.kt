package com.uca.recycluster.data.network.dto

import java.lang.Exception

data class NewUserResponse(
    val ok: Boolean,
    var message: String?,
    val exception: Exception?
)