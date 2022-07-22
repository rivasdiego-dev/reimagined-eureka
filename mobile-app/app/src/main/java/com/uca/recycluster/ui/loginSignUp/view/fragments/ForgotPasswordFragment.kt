package com.uca.recycluster.ui.loginSignUp.view.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import com.uca.recycluster.R
import com.uca.recycluster.RecyclusterApplication
import com.uca.recycluster.databinding.FragmentForgotpasswordBinding
import com.uca.recycluster.ui.loginSignUp.LoginActivity
import com.uca.recycluster.ui.loginSignUp.LoginUiStatus
import com.uca.recycluster.ui.loginSignUp.viewmodel.LoginViewModel
import com.uca.recycluster.ui.loginSignUp.viewmodel.ViewModelFactory

class ForgotPasswordFragment: Fragment() {

    // Binding and ViewModel
    private lateinit var binding:FragmentForgotpasswordBinding

    // ViewModel for the activity is created here and passed to the binding.
    val app by lazy {
        (activity as? LoginActivity)!!.application as RecyclusterApplication
    }

    // ViewModel for the whole login/signup process
    private val viewModelFactory by lazy {
        ViewModelFactory(app.getLoginRepository())
    }

    // ViewModel for the current fragment
    private val loginViewModel: LoginViewModel by activityViewModels {
        viewModelFactory
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_forgotpassword, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // VM
        binding.viewModel = loginViewModel
        binding.lifecycleOwner = viewLifecycleOwner

        loginViewModel.statusRestore.observe(viewLifecycleOwner) { status ->
            handleUiState(status)
        }

        binding.backBtn.setOnClickListener {
            navigateToLogin()
        }
    }

    // Handle UI state
    private fun handleUiState(status: LoginUiStatus) {
         when (status) {
            is LoginUiStatus.Error -> {
                Log.d("Restore password", "Error")
                showAlert("Something went wrong")
            }
            is LoginUiStatus.ErrorMessage -> {
                Log.d("Restore password", "ERROR MESSAGE")
                showAlert(status.message)
            }
            LoginUiStatus.Loading -> {
                Log.d("Restore password", "Loading")
            }
            LoginUiStatus.Resume -> Log.d("Restore password","Resume")
            is LoginUiStatus.Success2 -> {
                loginViewModel.clearRestoreForm()
                showAlert(status.message)
            }

            else -> Log.d("Restore password", "else")
         }
        // Status to onResume
        loginViewModel.restoreStatusOnResume()
    }

    // Alert dialog to show message
    private fun showAlert(message: String) {
        Snackbar
            .make(binding.restoreParent, message, Snackbar.LENGTH_LONG)
            .show()
    }

    // Navigate to login fragment
    private fun navigateToLogin() {
        val navController = findNavController()
        navController.navigate(R.id.action_forgotPasswordFragment_to_loginFragment)
    }
}