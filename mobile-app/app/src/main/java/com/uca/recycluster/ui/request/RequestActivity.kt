package com.uca.recycluster.ui.request

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import com.uca.recycluster.R
import com.uca.recycluster.core.BASE_URL
import com.uca.recycluster.data.model.PostAux
import com.uca.recycluster.databinding.ActivityRequestBinding
import com.uca.recycluster.ui.request.view.fragments.DetailedPostFragment


private lateinit var binding: ActivityRequestBinding

class RequestActivity : AppCompatActivity() {

    var username = ""
    var userPoints = 0
    var postId = ""
    var postTitle = ""
    var postDescription = ""
    var postImage = ""

    companion object {
        const val POST_NAME = "post_passed"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = DataBindingUtil.setContentView(this, R.layout.activity_request)

        // Extracting the post from the intent with its information
        val postInfo = intent.getSerializableExtra(POST_NAME) as PostAux
        username = postInfo.user.username
        userPoints = postInfo.user.points ?: 0
        postId = postInfo.post.id
        postTitle = postInfo.post.title
        postDescription = postInfo.post.description
        postImage = urlImage(postInfo.post.image)

//        Log.d("DEBUG", "User: ${postInfo.user.id}")
        Log.d("DEBUG", "User: ${postInfo.user.username}")
        Log.d("DEBUG", "User: ${postInfo.post.id}")
        Log.d("DEBUG", "Title: ${postInfo.post.title}")
        Log.d("DEBUG", "Image: ${urlImage(postInfo.post.image)}")
    }

    // Getting a substring of the image url to get the image from the server
    private fun urlImage (url: String):String{
        val startIndex = 8
        val endIndex = url.length
        Log.d("urlImage", url.substring(startIndex, endIndex))
        // Adding the base url to get the image from the server
        return BASE_URL + url.substring(startIndex, endIndex)
    }
}