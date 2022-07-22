package com.uca.recycluster.ui.appcontent.view.fragments

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import com.uca.recycluster.R
import com.uca.recycluster.core.BASE_URL
import com.uca.recycluster.databinding.FragmentMoreInfoBinding

class MoreInfoFragment : Fragment () {

    lateinit var binding: FragmentMoreInfoBinding
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_more_info, container, false)

        com.uca.recycluster.ui.appcontent.binding.mainActionBar.title = getString(R.string.app_name)

        binding.containedButtonLogIn.setOnClickListener{
            goToPage()
        }

        return binding.root
    }



    private fun goToPage (){
        val intent = Intent(Intent.ACTION_VIEW)
        intent.data = Uri.parse(BASE_URL)
        startActivity(intent)
    }
}