package com.uca.recycluster.repository

import android.net.Uri
import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.uca.recycluster.data.model.Exchange
import com.uca.recycluster.data.network.ApiResponse
import com.uca.recycluster.data.network.ApiResponse2
import com.uca.recycluster.data.network.RecyclusterService
import com.uca.recycluster.data.network.dto.NewPostResponse
import com.uca.recycluster.data.network.dto.NewUserResponse
import com.uca.recycluster.model.NewPost
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import retrofit2.HttpException
import java.io.File
import java.io.IOException

class NewPostRepository (private val api: RecyclusterService) {

    suspend fun createPost(title: String, category: String, description: String, imageAddress: String): ApiResponse2<NewPostResponse> {
        try {
            // Body size must not be greater than 10 MB
            // Image selection will work only with jpg
            Log.d("DEBUG --- ", "momento 1")

            Log.d("DEBUG --- ", imageAddress)
            var file = File(imageAddress)

            if (file.exists()) {
                Log.d("DEBUG --- ", "Parece que si existeeeeeee")
            } else {
                Log.d("DEBUG --- ", "NEL NO existeeeeeee")
            }

            Log.d("DEBUG --- ", "momento 2")
            var requestFile = file.asRequestBody("image/jpg".toMediaTypeOrNull())

            Log.d("DEBUG --- ", "momento 3")
            Log.d("FILE NAME --- ", "-> ${file.name}")

            var multipartImage =
                MultipartBody.Part.createFormData("image", file.name, requestFile)

            Log.d("DEBUG --- ", "momento 4")
            val sendTitle = title.toRequestBody("text/plain".toMediaTypeOrNull())
            val sendCategory = category.toRequestBody("text/plain".toMediaTypeOrNull())
            val descriptionTitle = description.toRequestBody("text/plain".toMediaTypeOrNull())

            val response = api.createPost(
                sendTitle,
                sendCategory,
                descriptionTitle,
                multipartImage
            )

            Log.d("DEBUG --- ", "momento 5")
            if (response.ok) {
                response.message = "New post has been published"
            }
            return ApiResponse2.Success(response)

        } catch (e: HttpException) {
            val response = NewPostResponse(
                false,
                "Unknown Http Exception",
                e
            )
            if (e.code() == 400){
                // Get response body from http exception
                val gson = Gson()
                val type = object : TypeToken<NewPostResponse>() {}.type
                val errorResponse: NewPostResponse = gson.fromJson(e.response()?.errorBody()?.charStream(), type)

                return ApiResponse2.ErrorMessage(errorResponse)
            }
            return ApiResponse2.Error(response)
        } catch (e: IOException) {
            val response = NewPostResponse(
                false,
                e.message.toString(),
                e
            )
            return ApiResponse2.Error(response)
        }
    }

    suspend fun createExchangeRequest(postId: String, reqDescription: String): ApiResponse<String> {
        try {
            val response = api.createExchangeRequest(
                Exchange("#", postId, reqDescription, "", "", "", "", "")
            )
            var msg = ""
            if (response.ok) {
                msg = "New exchange request has been made"
            }
            return ApiResponse.Success(msg)

        } catch (e: HttpException) {
            if (e.code() == 400){
                return ApiResponse.ErrorMessage(e.response()?.errorBody().toString())
            }
            return ApiResponse.Error(e)
        } catch (e: IOException) {
            return ApiResponse.Error(e)
        }
    }

}