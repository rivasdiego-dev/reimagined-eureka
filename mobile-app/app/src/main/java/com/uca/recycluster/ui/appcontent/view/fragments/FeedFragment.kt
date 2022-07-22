package com.uca.recycluster.ui.appcontent.view.fragments

import android.app.AlertDialog
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.uca.recycluster.R
import com.uca.recycluster.core.RetrofitHelper
import com.uca.recycluster.databinding.FragmentFeedBinding
import com.uca.recycluster.data.network.RecyclusterService
import com.uca.recycluster.data.model.PostAux
import com.uca.recycluster.data.model.PostResponse
import com.uca.recycluster.ui.appcontent.MainContentActivity
import com.uca.recycluster.ui.appcontent.feed.adapter.PostAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Response


class FeedFragment : Fragment() {

    private lateinit var binding: FragmentFeedBinding
    private lateinit var adapter: PostAdapter   // adapter for recycler view
    private val postList = mutableListOf<PostAux>()       // list of posts
    private val MEDIA_RQ = 100

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_feed, container, false)

        initRecycleView()
        Log.d("DEBUG-1", "initRecycleView")
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        checkForPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "write external storage", MEDIA_RQ)
        com.uca.recycluster.ui.appcontent.binding.mainActionBar.title = getString(R.string.app_name)

    }

    // initialize recycler view
    private fun initRecycleView() {
        adapter = PostAdapter(postList) // initialize adapter with empty list of posts
        binding.recyclerViewPost.layoutManager = LinearLayoutManager(this.context) // set layout manager
        binding.recyclerViewPost.adapter = adapter // set adapter to recycler view
        renderPosts()
        Log.d("DEBUG-3", "renderPosts")
    }

    // get posts from API and add them to the list of posts and update the recycler view
    private fun Fragment?.runOnUiThread(action: () -> Unit) {
        this ?: return
        if (!isAdded) return // Fragment not attached to an Activity
        activity?.runOnUiThread(action)
    }

    private fun renderPosts(){
            CoroutineScope(Dispatchers.IO).launch{
//                val call:Response<List<Post>> = RetrofitHelper.getRetrofit().create(RecyclusterService::class.java).getAllPost()
                val call: Response<PostResponse> = RetrofitHelper.getRetrofit().create(RecyclusterService::class.java).getAllPost()
                val response = call.body()
                Log.d("response", "-> ${response?.ok}")
                Log.d("count", "-> ${response?.posts?.size}")
                val post: List<PostAux>? = response?.posts

                // add posts to the list of posts and update the recycler view
                runOnUiThread{
                    if(call.isSuccessful){
                        // Show recycler view
                        val postOnRecyclerView = post?: emptyList()
                        postList.clear()
                        postList.addAll(postOnRecyclerView)
                        adapter.notifyDataSetChanged()
                    }else{
                        // Show error
                        showError()
                    }
                }

            }
    }

    private fun checkForPermission(permission: String, name: String, requestCode: Int) {
        val applicationContext = getActivity()?.getApplicationContext()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            when {
                ContextCompat.checkSelfPermission(applicationContext!!, permission) == PackageManager.PERMISSION_GRANTED -> {
                    // showAlert("$name perrmission granted")
                }
                shouldShowRequestPermissionRationale(permission) -> showDialog(permission, name, requestCode)

                else -> ActivityCompat.requestPermissions((activity as MainContentActivity), arrayOf(permission), requestCode)
            }
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        fun innerCheck(name: String) {
            if (grantResults.isEmpty() || grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                showAlert("$name permission refused")
            } else {
                showAlert("$name permission granted")
            }
        }

        when (requestCode) {
            MEDIA_RQ -> innerCheck("write external storage")
        }
    }

    private fun showDialog(permission: String, name: String, requestCode: Int) {
        val builder = AlertDialog.Builder(context)

        builder.apply {
            setMessage("Permission to access your $name is required to use this app")
            setTitle("Permission Required")
            setPositiveButton("OK") { dialog, which ->
                ActivityCompat.requestPermissions((activity as MainContentActivity), arrayOf(permission), requestCode)
            }
        }
        val dialog = builder.create()
        dialog.show()
    }

    private fun showAlert(message: String) {
        Snackbar
            .make(binding.feedParent, message, Snackbar.LENGTH_LONG)
            .show()
    }

    // show error message
    private fun showError() {
        Toast.makeText(this.context, "An error occurred while loading the posts", Toast.LENGTH_LONG).show()
    }

}

