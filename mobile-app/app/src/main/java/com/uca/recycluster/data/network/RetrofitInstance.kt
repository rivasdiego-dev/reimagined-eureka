package com.uca.recycluster.data.network

import com.uca.recycluster.core.RetrofitHelper
import com.uca.recycluster.data.model.Post
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext


class RetrofitInstance {

    //   private val retrofit = Retrofit.Builder()....build()
    private val retrofit = RetrofitHelper.getRetrofit()

//    suspend fun getPosts(): List<Post> {
//        // Get the service instance from the Retrofit builder
//        return withContext(Dispatchers.IO) {
//            // Execute the request
//            val response = retrofit.create(RecyclusterService::class.java).getAllPost()
//            response.body() ?: emptyList()
//        }
//    }

    fun getRecyclusterServices(): RecyclusterService {
        return retrofit.create(RecyclusterService::class.java)
    }

}