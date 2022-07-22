package com.uca.recycluster.ui.appcontent.view.fragments

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.Toast
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.uca.recycluster.R
import com.uca.recycluster.core.RetrofitHelper
import com.uca.recycluster.core.SetEmblemByPoints
import com.uca.recycluster.data.model.PostAux
import com.uca.recycluster.data.model.PostResponse
import com.uca.recycluster.data.network.RecyclusterService
import com.uca.recycluster.databinding.FragmentProfileBinding
import com.uca.recycluster.ui.appcontent.MainContentActivity
import com.uca.recycluster.ui.appcontent.feed.adapter.PostAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import retrofit2.Response

// import com.uca.recycluster.ui.appcontent.feed.adapter.PostAdapter


class ProfileFragment : Fragment() {

    private lateinit var binding: FragmentProfileBinding
    private lateinit var adapter: PostAdapter   // adapter for recycler view
    private val postList = mutableListOf<PostAux>()       // list of posts

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_profile, container, false)

        // Receiving user data from the ActivityMainContent
        val userId = (activity as MainContentActivity).userId
        val userName = (activity as MainContentActivity).userName
        val userPhone = (activity as MainContentActivity).userPhone
        val userPoints = (activity as MainContentActivity).userPoints

        // General data of the user on the View
        binding.userPhone.text = userPhone
        binding.userPoints.text = userPoints.toString()
        binding.textView2.text = userName
        SetEmblemByPoints().setEmblem(binding.userEmblem, userPoints)

        binding.containedButtonShare.setOnClickListener {
            Toast.makeText(context, "Share Profile", Toast.LENGTH_SHORT).show()
        }

        initRecycleView(userId)
        return binding.root
    }

    // initialize recycler view
    private fun initRecycleView(userId: String) {
        adapter = PostAdapter(postList) // initialize adapter with empty list of posts
        binding.recyclerViewProfile.layoutManager = LinearLayoutManager(this.context) // set layout manager
        binding.recyclerViewProfile.adapter = adapter // set adapter to recycler view
        renderPosts(userId)
    }

    // get posts from API and add them to the list of posts and update the recycler view
    private fun Fragment?.runOnUiThread(action: () -> Unit) {
        this ?: return
        if (!isAdded) return // Fragment not attached to an Activity
        activity?.runOnUiThread(action)
    }

    private fun renderPosts(userId: String){
        CoroutineScope(Dispatchers.IO).launch{
//                val call:Response<List<Post>> = RetrofitHelper.getRetrofit().create(RecyclusterService::class.java).getAllPost()
            val call: Response<PostResponse> = RetrofitHelper.getRetrofit().create(
                RecyclusterService::class.java).getMyPosts(userId = userId)
            val response = call.body()
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

    // show error message
    private fun showError() {
        Toast.makeText(this.context, "An error occurred while loading the posts", Toast.LENGTH_LONG).show()
    }

}
