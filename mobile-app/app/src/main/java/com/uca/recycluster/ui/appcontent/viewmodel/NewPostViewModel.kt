package com.uca.recycluster.ui.appcontent.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.uca.recycluster.data.network.ApiResponse
import com.uca.recycluster.data.network.ApiResponse2
import com.uca.recycluster.repository.NewPostRepository
import com.uca.recycluster.ui.appcontent.helpers.NewPostUiStatus
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class NewPostViewModel(private val repository: NewPostRepository) :ViewModel() {
    var title = MutableLiveData("")
    var category = MutableLiveData("")
    var description = MutableLiveData("")
//    var imageUri: Uri? = null
    var imageAddress: String = ""

    // NEW POST STATUS
    private val _statusNewPost = MutableLiveData<NewPostUiStatus>(NewPostUiStatus.Resume)
    val statusNewPost: LiveData<NewPostUiStatus>
        get() = _statusNewPost

    // Methods
    fun onCreatePost() {
        _statusNewPost.value = NewPostUiStatus.Loading

        viewModelScope.launch(Dispatchers.IO) {
            _statusNewPost.postValue(
                when (val response = repository.createPost(
                    title.value.toString(),
                    category.value.toString(),
                    description.value.toString(),
                    imageAddress
                )) {
                    is ApiResponse2.Error -> NewPostUiStatus.Error(response.data.exception!!)
                    is ApiResponse2.ErrorMessage -> NewPostUiStatus.ErrorMessage(response.data.message ?: "Error")
                    is ApiResponse2.Success -> NewPostUiStatus.Success(response.data.message!!)
                }
            )
        }
    }

    fun newPostStatusOnResume() {
        _statusNewPost.postValue(NewPostUiStatus.Resume)
    }

    fun clearPostForm() {
        title.value = ""
        description.value = ""
    }
}