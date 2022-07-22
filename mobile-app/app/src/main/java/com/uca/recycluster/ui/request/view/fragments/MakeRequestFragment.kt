package com.uca.recycluster.ui.request.view.fragments

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.activityViewModels
import com.google.android.material.snackbar.Snackbar
import com.uca.recycluster.R
import com.uca.recycluster.RecyclusterApplication
import com.uca.recycluster.databinding.FragmentMakeRequestBinding
import com.uca.recycluster.ui.appcontent.helpers.NewExchangeUiStatus
import com.uca.recycluster.ui.loginSignUp.LoginUiStatus
import com.uca.recycluster.ui.loginSignUp.viewmodel.ViewModelFactory
import com.uca.recycluster.ui.request.RequestActivity
import com.uca.recycluster.ui.request.viewmodel.ExchangeViewModel

class MakeRequestFragment : Fragment() {

    private lateinit var binding: FragmentMakeRequestBinding

    val app by lazy {
        (activity as? RequestActivity)!!.application as RecyclusterApplication
    }

    private val viewModelFactory by lazy {
        ViewModelFactory(app.getPostRepository())
    }

    private val exchangeViewModel: ExchangeViewModel by activityViewModels {
        viewModelFactory
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_make_request, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // VM
        binding.viewModel = exchangeViewModel
        binding.lifecycleOwner = viewLifecycleOwner

        exchangeViewModel.statusNewExchange.observe(viewLifecycleOwner) { status ->
            handleUiState(status)
        }

        exchangeViewModel.postId = (activity as RequestActivity).postId

        binding.containedButtonMakeRequest.setOnClickListener {
            exchangeViewModel.onCreateExchange()
        }
    }

    private fun handleUiState(status: NewExchangeUiStatus) {
        when (status) {
            is NewExchangeUiStatus.Error -> {
                Log.d("Create new request", "Error")
                showAlert("Something went wrong")
            }
            is NewExchangeUiStatus.ErrorMessage -> {
                Log.d("Create new request", "ERROR MESSAGE")
                showAlert(status.message)
            }
            NewExchangeUiStatus.Loading -> {
                Log.d("Create new request", "Loading")
            }
            NewExchangeUiStatus.Resume -> Log.d("Create new request", "Resume")
            is NewExchangeUiStatus.Success -> {
                exchangeViewModel.clearExchangeForm()
                showAlert(status.message)
                // Status to onResume
                exchangeViewModel.newExchangeStatusOnResume()
            }
            else -> Log.d("Create new request", "else")
        }
    }

    private fun showAlert(message: String) {
        Snackbar
            .make(binding.makeRequestParent, message, Snackbar.LENGTH_LONG)
            .show()
    }

}