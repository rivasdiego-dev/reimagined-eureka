package com.uca.recycluster.data.model

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName

data class PostResponse(
    @SerializedName("ok")
    @Expose
    val ok: Boolean,
    @SerializedName("page")
    @Expose
    val page: Int,
    @SerializedName("pages")
    @Expose
    val pages: Int,
    @SerializedName("count")
    @Expose
    val count: Int,
    @SerializedName("posts")
    @Expose
    val posts: List<PostAux>
)