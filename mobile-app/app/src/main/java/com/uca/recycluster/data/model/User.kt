package com.uca.recycluster.data.model

import java.io.Serializable

data class User(
    val id: String,
    var username: String,
    var email: String,
    var phone: String,
    var password: String,
    var points: Int?
): Serializable