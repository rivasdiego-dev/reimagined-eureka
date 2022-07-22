package com.uca.recycluster.ui.appcontent.view.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.activity.result.ActivityResultCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.google.android.material.snackbar.Snackbar
import com.uca.recycluster.R
import com.uca.recycluster.RecyclusterApplication
import com.uca.recycluster.databinding.FragmentNewpostBinding
import com.uca.recycluster.ui.appcontent.MainContentActivity
import com.uca.recycluster.ui.appcontent.helpers.NewPostUiStatus
import com.uca.recycluster.ui.appcontent.helpers.RealPathUtil
import com.uca.recycluster.ui.appcontent.viewmodel.NewPostViewModel
import com.uca.recycluster.ui.loginSignUp.viewmodel.ViewModelFactory

class NewPostFragment : Fragment(), AdapterView.OnItemSelectedListener {

    lateinit var binding: FragmentNewpostBinding

    val app by lazy {
        (activity as? MainContentActivity)!!.application as RecyclusterApplication
    }

    private val viewModelFactory by lazy {
        ViewModelFactory(app.getPostRepository())
    }

    private val postViewModel: NewPostViewModel by activityViewModels {
        viewModelFactory
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_newpost, container, false)
        openGalleryForImage()

        return binding.root
    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        // VM
        binding.viewModel = postViewModel
        binding.lifecycleOwner = viewLifecycleOwner

        // Create an ArrayAdapter using the string array and a default spinner layout
        ArrayAdapter.createFromResource(
            requireContext(),
            R.array.categories,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            // Specify the layout to use when the list of choices appears
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            // Apply the adapter to the spinner
            binding.spinnerCategory.adapter = adapter
        }
        binding.spinnerCategory.onItemSelectedListener = this

        postViewModel.statusNewPost.observe(viewLifecycleOwner){ status ->
            handleUiState(status)
        }

        // Call create new post
        binding.containedButtonCreatePost.setOnClickListener {
            postViewModel.onCreatePost()
        }
    }

    private fun handleUiState(status: NewPostUiStatus) {
        when (status) {
            is NewPostUiStatus.Error -> {
                Log.d("New post", status.exception.message.toString())
                showAlert("Something went wrong")
            }
            is NewPostUiStatus.ErrorMessage -> {
                Log.d("New post", "ERROR MESSAGE")
                showAlert(status.message)
            }
            NewPostUiStatus.Loading -> {
                Log.d("New post", "Loading")
            }
            NewPostUiStatus.Resume -> Log.d("New post","Resume")
            is NewPostUiStatus.Success -> {
                postViewModel.clearPostForm()
                showAlert(status.message)
                // Status to onResume
                postViewModel.newPostStatusOnResume()
            }
        }
    }

    override fun onItemSelected(parent: AdapterView<*>, view: View?, pos: Int, id: Long) {
        // An item was selected. You can retrieve the selected item using
        // parent.getItemAtPosition(pos)
        postViewModel.category.setValue(parent.getItemAtPosition(pos).toString())
    }

    override fun onNothingSelected(p0: AdapterView<*>?) {
        TODO("Not yet implemented")
    }

    private fun openGalleryForImage() {
        val pickImage = registerForActivityResult(
            ActivityResultContracts.GetContent(),
            ActivityResultCallback {
                binding.imageView2.setImageURI(it)

                val real = RealPathUtil.getRealPath(context, it)
                postViewModel.imageAddress = real
            }
        )

        pickImage.launch("image/*")
    }

    private fun showAlert(message: String) {
        Snackbar
            .make(binding.newPostParent, message, Snackbar.LENGTH_LONG)
            .show()
    }

}