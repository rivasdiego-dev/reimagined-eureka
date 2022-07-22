package com.uca.recycluster.data.network

import com.uca.recycluster.data.model.*
import com.uca.recycluster.data.network.dto.*
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.*

interface RecyclusterService {
    //TODO: Add de correct endpoint to getAllPosts
    @GET ("/posts/allnopagination")
    suspend fun getAllPost(): Response<PostResponse>

    @GET ("/posts/user/{userId}")
    suspend fun getMyPosts(@Path(value="userId", encoded=true) userId: String): Response<PostResponse>

    @GET ("/exchanges/allnopagination")
    suspend fun getAllExchanges(): Response<ExchangeResponse>

    @POST ("/login")
    suspend fun login(@Body credentials: LoginRequest): LoginResponse

    @POST ("/users")
    suspend fun createUser(@Body user: User): NewUserResponse

    @GET ("/users/restore/{email}")
    suspend fun restorePassword(@Path(value="email", encoded=true) email: String): RestorePasResponse

    // TODO: NewUserResponse actualmente es de uso gral
    @Multipart
    @POST ("/posts")
    suspend fun createPost(
        @Part("title") title: RequestBody,
        @Part("category") category: RequestBody,
        @Part("description") description: RequestBody,
        @Part image: MultipartBody.Part
    ): NewPostResponse

    @POST ("/exchanges")
    suspend fun createExchangeRequest(@Body exchange: Exchange): NewUserResponse
}