package com.uca.recycluster.ui.request.view.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.navigation.fragment.findNavController
import com.google.android.material.snackbar.Snackbar
import com.squareup.picasso.Picasso
import com.uca.recycluster.R
import com.uca.recycluster.core.SetEmblemByPoints
import com.uca.recycluster.data.model.PostAux
import com.uca.recycluster.databinding.FragmentDetailedPostBinding
import com.uca.recycluster.ui.request.RequestActivity


class DetailedPostFragment : Fragment() {

    private lateinit var binding:FragmentDetailedPostBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_detailed_post, container, false)

        binding.textViewUsername.text = (activity as RequestActivity).username
        binding.textViewPostTitle.text = (activity as RequestActivity).postTitle
        binding.textViewPostDescription.text = (activity as RequestActivity).postDescription
        val urlImage = (activity as RequestActivity).postImage
        val userPoints = (activity as RequestActivity).userPoints

        Picasso.get().load(urlImage).into(binding.imageViewPostImage)
        SetEmblemByPoints().setEmblem(binding.imageViewUserEmblem, userPoints)

        return binding.root
    }

//    // Set the emblem according to the points of the user
//    private fun setEmblem (points: Int){
//        when (points){
//            in 0..999 -> binding.imageViewUserEmblem.setImageResource(R.drawable.emblem_1)
//            in 1000..1999 -> binding.imageViewUserEmblem.setImageResource(R.drawable.emblem_2)
//            in 2000..2999 -> binding.imageViewUserEmblem.setImageResource(R.drawable.emblem_3)
//            in 3000..3999 -> binding.imageViewUserEmblem.setImageResource(R.drawable.emblem_4)
//            else -> binding.imageViewUserEmblem.setImageResource(R.drawable.emblem_5)
//        }
//    }


    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.containedButtonRequest.setOnClickListener{
            // Navigation
            val navController = findNavController()
            navController.navigate(R.id.action_detailedPostFragment_to_makeRequestFragment)
        }
    }

}