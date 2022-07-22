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
import com.uca.recycluster.databinding.FragmentSignupBinding
import com.uca.recycluster.ui.loginSignUp.LoginActivity
import com.uca.recycluster.ui.loginSignUp.LoginUiStatus
import com.uca.recycluster.ui.loginSignUp.viewmodel.LoginViewModel
import com.uca.recycluster.ui.loginSignUp.viewmodel.ViewModelFactory


class SignUpFragment : Fragment() {

    private lateinit var binding: FragmentSignupBinding

    val app by lazy {
        (activity as? LoginActivity)!!.application as RecyclusterApplication
    }

    private val viewModelFactory by lazy {
        ViewModelFactory(app.getLoginRepository())
    }

    private val loginViewModel: LoginViewModel by activityViewModels {
        viewModelFactory
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_signup, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // VM
        binding.viewModel = loginViewModel
        binding.lifecycleOwner = viewLifecycleOwner

        loginViewModel.statusSignUp.observe(viewLifecycleOwner) { status ->
            handleUiState(status)
        }

        binding.backButton.setOnClickListener {
            navigateToLogin()
        }
    }

    private fun handleUiState(status: LoginUiStatus) {
        when (status) {
            is LoginUiStatus.Error -> {
                Log.d("Create user status", "Error")
                showAlert("Something went wrong")
            }
            is LoginUiStatus.ErrorMessage -> {
                Log.d("Create user status", "ERROR MESSAGE")
                showAlert(status.message)
            }
            LoginUiStatus.Loading -> {
                Log.d("Create user status", "Loading")
            }
            LoginUiStatus.Resume -> Log.d("Create user status", "Resume")
            is LoginUiStatus.Success2 -> {
                loginViewModel.clearSignUpForm()
                showAlert(status.message)
            }
            else -> Log.d("Create user status", "else")
        }
        // Status to onResume
        loginViewModel.signUpStatusOnResume()
    }

    private fun showAlert(message: String) {
        Snackbar
            .make(binding.signupParent, message, Snackbar.LENGTH_LONG)
            .show()
    }

    private fun navigateToLogin() {
        val navController = findNavController()
        navController.navigate(R.id.action_signUpFragment_to_loginFragment)
    }
}