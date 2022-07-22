package com.uca.recycluster.ui.appcontent.feed.ViewHolder

import android.content.Intent
import android.util.Log
import android.view.View
import androidx.core.content.ContextCompat.startActivity
import androidx.recyclerview.widget.RecyclerView
import com.squareup.picasso.Picasso
import com.uca.recycluster.R
import com.uca.recycluster.core.BASE_URL
import com.uca.recycluster.core.SetEmblemByPoints
import com.uca.recycluster.data.model.PostAux
import com.uca.recycluster.databinding.ItemPostBinding
import com.uca.recycluster.ui.appcontent.MainContentActivity
import com.uca.recycluster.ui.loginSignUp.LoginActivity
import com.uca.recycluster.ui.request.RequestActivity

class PostViewHolder(view: View) : RecyclerView.ViewHolder(view) {
    private val binding = ItemPostBinding.bind(view)

    // Associate the components with the post information
    fun bind(postAux: PostAux) {
        Picasso
            .get()
            .load(urlImage(postAux.post.image))
            .into(binding.imgPost)
        binding.titlePost.text = postAux.post.title
        binding.descriptionPost.text = postAux.post.description
        // User information in post
        binding.username.text = postAux.user.username
        SetEmblemByPoints().setEmblem(binding.profileImageView, postAux.user.points?:0)


        binding.imgPost.setOnClickListener {
            Log.d("Post", "Clicked")
            val intent = Intent(it.context, RequestActivity::class.java)
            // Sending All data to the next activity for each post (postAux)
            intent.putExtra(RequestActivity.POST_NAME, postAux)
            it.context.startActivity(intent)
        }
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