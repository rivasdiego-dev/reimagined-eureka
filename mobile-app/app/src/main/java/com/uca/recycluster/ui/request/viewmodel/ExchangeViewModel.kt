package com.uca.recycluster.ui.request.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.uca.recycluster.data.network.ApiResponse
import com.uca.recycluster.repository.NewPostRepository
import com.uca.recycluster.ui.appcontent.helpers.NewExchangeUiStatus
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class ExchangeViewModel(private val repository: NewPostRepository): ViewModel() {
    var request = MutableLiveData("")
    var postId = ""

    // NEW POST STATUS
    private val _statusNewExchange = MutableLiveData<NewExchangeUiStatus>(NewExchangeUiStatus.Resume)
    val statusNewExchange: LiveData<NewExchangeUiStatus>
        get() = _statusNewExchange

    // Methods
    fun onCreateExchange() {
        if (request.value.toString() == "") {
            _statusNewExchange.postValue(NewExchangeUiStatus.ErrorMessage("Complete your plans for this product"))
            return
        }
        _statusNewExchange.value = NewExchangeUiStatus.Loading

        viewModelScope.launch(Dispatchers.IO) {
            _statusNewExchange.postValue(
                when (val response = repository.createExchangeRequest(
                    postId,
                    request.value.toString()
                )) {
                    is ApiResponse.Error -> NewExchangeUiStatus.Error(response.exception)
                    is ApiResponse.ErrorMessage -> NewExchangeUiStatus.ErrorMessage(response.message)
                    is ApiResponse.Success -> NewExchangeUiStatus.Success(response.data)
                }
            )
        }
    }

    fun newExchangeStatusOnResume() {
        _statusNewExchange.postValue(NewExchangeUiStatus.Resume)
    }

    fun clearExchangeForm() {
        request.value = ""
    }
}