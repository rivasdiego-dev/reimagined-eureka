package com.uca.recycluster.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class PostAux(
    @SerializedName("post") val post: Post,
    @SerializedName("user") val user: User): Serializable {
}