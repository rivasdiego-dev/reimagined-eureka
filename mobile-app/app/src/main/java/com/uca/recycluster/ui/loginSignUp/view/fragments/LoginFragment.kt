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
import com.uca.recycluster.data.model.User
import com.uca.recycluster.databinding.FragmentLoginBinding
import com.uca.recycluster.ui.loginSignUp.LoginActivity
import com.uca.recycluster.ui.loginSignUp.LoginUiStatus
import com.uca.recycluster.ui.loginSignUp.viewmodel.LoginViewModel
import com.uca.recycluster.ui.loginSignUp.viewmodel.ViewModelFactory
import java.util.*
import kotlin.concurrent.schedule


class LoginFragment : Fragment() {
    private lateinit var binding: FragmentLoginBinding

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
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_login, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // VM
        binding.viewModel = loginViewModel
        binding.lifecycleOwner = viewLifecycleOwner

        /* Current user is not being stored
        if (app.isUserLogin()) {
            startMainActivity(status.user)
        }
         */

        loginViewModel.statusLogin.observe(viewLifecycleOwner){ status ->
            handleUiState(status)
        }

        // Navigation
        val navController = findNavController()
        binding.outlinedButtonSignUp.setOnClickListener {
            navController.navigate(R.id.action_loginFragment_to_signUpFragment)
        }
        binding.textViewRecoverPassword.setOnClickListener {
            navController.navigate(R.id.action_loginFragment_to_forgotPasswordFragment)
        }

    }

    private fun handleUiState(status: LoginUiStatus) {
        when (status) {
            is LoginUiStatus.Error -> {
                Log.d("Login list status", "Error")
                showAlert("Something went wrong")
            }
            is LoginUiStatus.ErrorMessage -> {
                Log.d("Login List Status", "ERROR MESSAGE")
                showAlert(status.message)
            }
            LoginUiStatus.Loading -> {
                Log.d("Login List Status", "Loading")
            }
            LoginUiStatus.Resume -> Log.d("Login List Status","Resume")
            is LoginUiStatus.Success -> {
                Log.d("Login List Status","EXITO")
                showAlert("Welcome!")
                Log.d("Login List USER", "-> ${status.user.id}")
                // Save token in local storage
                app.saveAuthToken(status.token)

                Timer().schedule(1000) {
                    startMainActivity(status.user)
                }
            }
            else -> {
                Log.d("Login List Status","Default")
            }
        }
        // Status to onResume
        loginViewModel.loginStatusOnResume()
    }

    private fun startMainActivity(user: User) {
        (activity as LoginActivity).startMainActivity(user)
    }

    private fun showAlert(message: String) {
        Snackbar
            .make(binding.loginParent, message, Snackbar.LENGTH_LONG)
            .show()
    }
}