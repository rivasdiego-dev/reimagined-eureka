package com.uca.recycluster.repository

import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.uca.recycluster.data.model.User
import com.uca.recycluster.data.network.ApiResponse
import com.uca.recycluster.data.network.ApiResponse2
import com.uca.recycluster.data.network.RecyclusterService
import com.uca.recycluster.data.network.dto.LoginRequest
import com.uca.recycluster.data.network.dto.LoginResponse
import com.uca.recycluster.data.network.dto.NewUserResponse
import com.uca.recycluster.data.network.dto.RestorePasResponse
import retrofit2.HttpException
import java.io.IOException

class LoginRepository (private val api: RecyclusterService) {

    suspend fun login(username: String, password: String): ApiResponse2<LoginResponse> {
        try {

            val response = api.login(LoginRequest(username, password))
            return ApiResponse2.Success(response)

        } catch (e: HttpException) {
            val response = LoginResponse(
                "",
                "Unknown Http Exception",
                null,
                e
            )
            if (e.code() == 400){
                // Get response body from http exception
                val gson = Gson()
                val type = object : TypeToken<LoginResponse>() {}.type
                val errorResponse: LoginResponse = gson.fromJson(e.response()?.errorBody()?.charStream(), type)
                // Log.d("LOGIN DEBUG", "-> ${errorResponse.message}")

                return ApiResponse2.ErrorMessage(errorResponse)
            }
            return ApiResponse2.Error(response)
        } catch (e: IOException) {
            val response = LoginResponse(
                "",
                e.message.toString(),
                null,
                e
            )
            return ApiResponse2.Error(response)
        }
    }

    suspend fun createUser(username: String, email: String, phone: String, password: String): ApiResponse2<NewUserResponse> {
        try {
            val response = api.createUser(User("#", username, email, phone, password,0))
            if (response.ok) {
                response.message = "User succesfully created!"
            }
            return ApiResponse2.Success(response)

        } catch (e: HttpException) {
            val response = NewUserResponse(
                false,
                "Unknown Http Exception",
                e
            )
            if (e.code() == 400){
                // Get response body from http exception
                val gson = Gson()
                val type = object : TypeToken<NewUserResponse>() {}.type
                val errorResponse: NewUserResponse = gson.fromJson(e.response()?.errorBody()?.charStream(), type)

                return ApiResponse2.ErrorMessage(errorResponse)
            }
            return ApiResponse2.Error(response)
        } catch (e: IOException) {
            val response = NewUserResponse(
                false,
                e.message.toString(),
                e
            )
            return ApiResponse2.Error(response)
        }
    }

    suspend fun restorePassword(email: String): ApiResponse2<RestorePasResponse> {
        try {
            val response = api.restorePassword(email)
            return ApiResponse2.Success(response)

        } catch (e: HttpException) {
            val response = RestorePasResponse(
                false,
                "Unknown Http Exception",
                e
            )
            if (e.code() == 400){
                // Get response body from http exception
                val gson = Gson()
                val type = object : TypeToken<RestorePasResponse>() {}.type
                val errorResponse: RestorePasResponse = gson.fromJson(e.response()?.errorBody()?.charStream(), type)

                return ApiResponse2.ErrorMessage(errorResponse)
            }
            return ApiResponse2.Error(response)
        } catch (e: IOException) {
            val response = RestorePasResponse(
                false,
                e.message.toString(),
                e
            )
            return ApiResponse2.Error(response)
        }
    }
}