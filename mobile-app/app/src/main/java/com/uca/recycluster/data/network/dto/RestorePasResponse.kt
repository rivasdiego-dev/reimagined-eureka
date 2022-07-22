package com.uca.recycluster.data.network.dto

import com.uca.recycluster.data.model.User
import java.lang.Exception

data class RestorePasResponse (
    val ok: Boolean,
    val message: String,
    val exception: Exception?
    )