package com.uca.recycluster.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Post(
    @SerializedName("id") var id: String,
    @SerializedName("title") var title: String,
    @SerializedName("category") var category: String,
    @SerializedName("description") var description: String,
    @SerializedName("image") var image: String,
//    @SerializedName("createdAt") var publishDate: String
):  Serializable