package com.uca.recycluster.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class ExchangeAux(
    @SerializedName("exchanges") val exchanges: Exchange,
    @SerializedName("user") val user: User): Serializable {
}