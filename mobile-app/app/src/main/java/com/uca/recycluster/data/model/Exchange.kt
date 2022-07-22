package com.uca.recycluster.data.model

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class Exchange(
    @SerializedName("id") var id: String,
    @SerializedName("post_id") var post_id: String,
    @SerializedName("req_description") var req_description: String,
    @SerializedName("title") var title: String,
    @SerializedName("description") var description: String,
    @SerializedName("materials") var materials: String,
    @SerializedName("steps") var steps: String,
    @SerializedName("image") var image: String,
//    @SerializedName("createdAt") var publishDate: String
): Serializable