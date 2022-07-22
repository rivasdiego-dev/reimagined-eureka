package com.uca.recycluster.data.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class ExchangeResponse(
    @SerializedName("ok")
    @Expose
    val ok: Boolean,
    @SerializedName("count")
    @Expose
    val page: Int,
    @SerializedName("exchanges")
    @Expose
    val exchanges: List<ExchangeAux>,
    @SerializedName("count")
    @Expose
    val count: Int,
    @SerializedName("posts")
    @Expose
    val posts: List<PostAux>
)
