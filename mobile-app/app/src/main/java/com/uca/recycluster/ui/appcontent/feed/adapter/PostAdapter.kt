package com.uca.recycluster.ui.appcontent.feed.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.uca.recycluster.R
import com.uca.recycluster.data.model.Post
import com.uca.recycluster.data.model.PostAux
import com.uca.recycluster.ui.appcontent.feed.ViewHolder.PostViewHolder

class PostAdapter(private val postList:List<PostAux>): RecyclerView.Adapter<PostViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val layoutInflater = LayoutInflater.from(parent.context)
        return PostViewHolder(layoutInflater.inflate(R.layout.item_post, parent, false))
    }

    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        val item: PostAux = postList[position]
        holder.bind(item)
        // holder.render(item, onClickListener)
    }

    override fun getItemCount() : Int = postList.size
}
