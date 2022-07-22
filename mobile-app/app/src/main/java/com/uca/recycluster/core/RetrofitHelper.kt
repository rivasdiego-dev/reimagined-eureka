package com.uca.recycluster.core

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

//
const val BASE_URL = "https://recycluster.social"

object RetrofitHelper {

    private var token = ""

    // Set the token
    fun setToken (value: String) {
        token = value
    }

    // Create Retrofit instance with base URL and GSON converter
    fun getRetrofit():Retrofit{
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(
                OkHttpClient()
                    .newBuilder()
                    .addInterceptor { chain ->
                        chain.proceed(
                            chain
                                .request()
                                .newBuilder()
                                .addHeader("Authorization", "BEARER ${token}")
                                .build()
                        )
                    }
                    .build()
            )
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}